import assert from "node:assert/strict";
import { test } from "node:test";

import { buildApp } from "@/app";
import { DBConnection } from "@/shared/database/db-connection";
import { createPrismaRepositories } from "@/shared/database/prisma-repositories";
import { InMemoryEmailSender } from "../helpers/in-memory-email-sender.ts";
import { extractAuthCookie } from "../helpers/build-test-app.ts";

test("full user journey across all use-cases", async (t) => {
  const db = new DBConnection();
  const app = buildApp({
    repositories: createPrismaRepositories(db),
    emailSender: new InMemoryEmailSender(),
    auth: {
      jwtSecret: "e2e-secret",
      jwtExpiresInSeconds: 3600,
      refreshTokenExpiresInSeconds: 86400,
      appUrl: "http://localhost:3000",
      cookieSecure: false,
    },
  });

  await db.connect();
  await db.client.transaction.deleteMany();
  await db.client.loan.deleteMany();
  await db.client.category.deleteMany();
  await db.client.user.deleteMany();

  t.after(async () => {
    await app.close();
    await db.disconnect();
  });

  const email = "journey@example.com";
  const password = "Super-secret-password1";

  // Sign up
  const signUpResponse = await app.inject({
    method: "POST",
    url: "/api/auth/signup",
    payload: { email, password, confirmPassword: password, firstName: "Daniel", lastName: "Favero" },
  });
  assert.equal(signUpResponse.statusCode, 201);
  const { verificationToken } = signUpResponse.json();

  // Signing in before verifying must fail
  const earlySignIn = await app.inject({
    method: "POST",
    url: "/api/auth/signin",
    payload: { email, password },
  });
  assert.equal(earlySignIn.statusCode, 403);

  // Verify email
  const verifyResponse = await app.inject({
    method: "POST",
    url: "/api/auth/verify-email",
    payload: { token: verificationToken },
  });
  assert.equal(verifyResponse.statusCode, 200);
  assert.equal(verifyResponse.json().user.emailVerified, true);

  // Sign in
  const signInResponse = await app.inject({
    method: "POST",
    url: "/api/auth/signin",
    payload: { email, password },
  });
  assert.equal(signInResponse.statusCode, 200);
  const accessToken = extractAuthCookie(signInResponse.cookies);
  const headers = { authorization: `Bearer ${accessToken}` };

  // Current profile
  const meResponse = await app.inject({
    method: "GET",
    url: "/api/auth/me",
    headers,
  });
  assert.equal(meResponse.statusCode, 200);
  assert.equal(meResponse.json().user.email, email);

  // Create a parent category and a subcategory
  const parentCategoryResponse = await app.inject({
    method: "POST",
    url: "/api/categories",
    headers,
    payload: [{ name: "Moradia", type: "DESPESA", expenseKind: "FIXA" }],
  });
  assert.equal(parentCategoryResponse.statusCode, 200);
  const parentCategoryId = parentCategoryResponse.json().created[0].id;

  const childCategoryResponse = await app.inject({
    method: "POST",
    url: "/api/categories",
    headers,
    payload: [
      {
        name: "Aluguel",
        type: "DESPESA",
        expenseKind: "FIXA",
        parentId: parentCategoryId,
      },
    ],
  });
  assert.equal(childCategoryResponse.statusCode, 200);
  const childCategoryId = childCategoryResponse.json().created[0].id;

  // List and get categories
  const listCategoriesResponse = await app.inject({
    method: "GET",
    url: "/api/categories",
    headers,
  });
  assert.equal(listCategoriesResponse.statusCode, 200);
  assert.equal(listCategoriesResponse.json().data.length, 2);
  assert.equal(listCategoriesResponse.json().total, 2);

  // List categories with search, ordering and pagination
  const searchCategoriesResponse = await app.inject({
    method: "GET",
    url: "/api/categories?search=alu&orderBy=name&sort=desc&page=1&perPage=1",
    headers,
  });
  assert.equal(searchCategoriesResponse.statusCode, 200);
  const searchCategoriesBody = searchCategoriesResponse.json();
  assert.equal(searchCategoriesBody.total, 1);
  assert.equal(searchCategoriesBody.totalPages, 1);
  assert.equal(searchCategoriesBody.data[0].name, "Aluguel");

  // List subcategories through the filters query param
  const childFilters = encodeURIComponent(JSON.stringify({ parentId: parentCategoryId }));
  const childCategoriesResponse = await app.inject({
    method: "GET",
    url: `/api/categories?filters=${childFilters}`,
    headers,
  });
  assert.equal(childCategoriesResponse.statusCode, 200);
  assert.equal(childCategoriesResponse.json().total, 1);
  assert.equal(childCategoriesResponse.json().data[0].id, childCategoryId);

  const getCategoryResponse = await app.inject({
    method: "GET",
    url: `/api/categories/${childCategoryId}`,
    headers,
  });
  assert.equal(getCategoryResponse.statusCode, 200);

  // Update category
  const updateCategoryResponse = await app.inject({
    method: "PATCH",
    url: `/api/categories/${childCategoryId}`,
    headers,
    payload: { name: "Aluguel + Condomínio" },
  });
  assert.equal(updateCategoryResponse.statusCode, 200);
  assert.equal(
    updateCategoryResponse.json().category.name,
    "Aluguel + Condomínio",
  );

  // Create a transaction in the subcategory
  const createTransactionResponse = await app.inject({
    method: "POST",
    url: "/api/transactions",
    headers,
    payload: [
      {
        categoryId: childCategoryId,
        description: "Aluguel de junho",
        amount: 2100,
        referenceMonth: 6,
        referenceYear: 2026,
        transactionDate: "2026-06-05",
      },
    ],
  });
  assert.equal(createTransactionResponse.statusCode, 200);
  const transactionId = createTransactionResponse.json().created[0].id;

  // Deleting a category in use must be reported as a per-item failure
  const deleteUsedCategoryResponse = await app.inject({
    method: "DELETE",
    url: "/api/categories",
    headers,
    payload: { ids: [childCategoryId] },
  });
  assert.equal(deleteUsedCategoryResponse.statusCode, 200);
  assert.equal(deleteUsedCategoryResponse.json().deleted.length, 0);
  assert.equal(
    deleteUsedCategoryResponse.json().failed[0].error,
    "Category is in use and cannot be deleted",
  );

  // List (filtered), get and update transactions
  const transactionFilters = encodeURIComponent(
    JSON.stringify({ referenceMonth: 6, referenceYear: 2026 }),
  );
  const listTransactionsResponse = await app.inject({
    method: "GET",
    url: `/api/transactions?filters=${transactionFilters}`,
    headers,
  });
  assert.equal(listTransactionsResponse.statusCode, 200);
  assert.equal(listTransactionsResponse.json().data.length, 1);

  const getTransactionResponse = await app.inject({
    method: "GET",
    url: `/api/transactions/${transactionId}`,
    headers,
  });
  assert.equal(getTransactionResponse.statusCode, 200);
  assert.equal(getTransactionResponse.json().transaction.amount, 2100);

  const updateTransactionResponse = await app.inject({
    method: "PATCH",
    url: `/api/transactions/${transactionId}`,
    headers,
    payload: { amount: 2200.55 },
  });
  assert.equal(updateTransactionResponse.statusCode, 200);
  assert.equal(updateTransactionResponse.json().transaction.amount, 2200.55);

  // Loans lifecycle
  const createLoanResponse = await app.inject({
    method: "POST",
    url: "/api/loans",
    headers,
    payload: [
      {
        loanDate: "2026-05-20",
        personName: "João",
        description: "Ingressos do show",
        amountLent: 180,
      },
    ],
  });
  assert.equal(createLoanResponse.statusCode, 200);
  const loanId = createLoanResponse.json().created[0].id;
  assert.equal(createLoanResponse.json().created[0].openBalance, 180);

  const listLoansResponse = await app.inject({
    method: "GET",
    url: "/api/loans",
    headers,
  });
  assert.equal(listLoansResponse.statusCode, 200);
  assert.equal(listLoansResponse.json().data.length, 1);

  const getLoanResponse = await app.inject({
    method: "GET",
    url: `/api/loans/${loanId}`,
    headers,
  });
  assert.equal(getLoanResponse.statusCode, 200);

  const updateLoanResponse = await app.inject({
    method: "PATCH",
    url: `/api/loans/${loanId}`,
    headers,
    payload: { amountReceived: 180 },
  });
  assert.equal(updateLoanResponse.statusCode, 200);
  assert.equal(updateLoanResponse.json().loan.isPaid, true);

  const deleteLoanResponse = await app.inject({
    method: "DELETE",
    url: "/api/loans",
    headers,
    payload: { ids: [loanId] },
  });
  assert.equal(deleteLoanResponse.statusCode, 200);
  assert.deepEqual(deleteLoanResponse.json().deleted, [loanId]);

  // Clean up the transaction, then the categories
  const deleteTransactionResponse = await app.inject({
    method: "DELETE",
    url: "/api/transactions",
    headers,
    payload: { ids: [transactionId] },
  });
  assert.equal(deleteTransactionResponse.statusCode, 200);
  assert.deepEqual(deleteTransactionResponse.json().deleted, [transactionId]);

  // Both categories can now be removed in a single bulk call
  const deleteCategoriesResponse = await app.inject({
    method: "DELETE",
    url: "/api/categories",
    headers,
    payload: { ids: [childCategoryId, parentCategoryId] },
  });
  assert.equal(deleteCategoriesResponse.statusCode, 200);
  assert.deepEqual(deleteCategoriesResponse.json().deleted, [childCategoryId, parentCategoryId]);

  // Sign out and confirm the token is revoked
  const signOutResponse = await app.inject({
    method: "POST",
    url: "/api/auth/signout",
    headers,
  });
  assert.equal(signOutResponse.statusCode, 204);

  const meAfterSignOut = await app.inject({
    method: "GET",
    url: "/api/auth/me",
    headers,
  });
  assert.equal(meAfterSignOut.statusCode, 401);
});
