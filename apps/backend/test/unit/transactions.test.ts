import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { FastifyInstance } from "fastify";

import { authHeaders, buildTestApp, registerAndSignIn } from "../helpers/build-test-app.ts";

async function createCategory(app: FastifyInstance, accessToken: string): Promise<string> {
  const response = await app.inject({
    method: "POST",
    url: "/api/categories",
    headers: authHeaders(accessToken),
    payload: [{ name: "Alimentação", type: "DESPESA", expenseKind: "VARIAVEL" }],
  });
  return response.json().created[0].id;
}

function transactionPayload(categoryId: string): Record<string, string | number> {
  return {
    categoryId,
    description: "Mercado",
    amount: 350.5,
    referenceMonth: 6,
    referenceYear: 2026,
    transactionDate: "2026-06-10",
  };
}

async function createTransaction(
  app: FastifyInstance,
  accessToken: string,
  categoryId: string,
): Promise<{ id: string }> {
  const response = await app.inject({
    method: "POST",
    url: "/api/transactions",
    headers: authHeaders(accessToken),
    payload: [transactionPayload(categoryId)],
  });
  return response.json().created[0];
}

describe("POST /transactions", () => {
  it("rejects unauthenticated requests with 401", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const response = await app.inject({ method: "POST", url: "/api/transactions", payload: [] });

    assert.equal(response.statusCode, 401);
  });

  it("creates a transaction", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const categoryId = await createCategory(app, accessToken);

    const response = await app.inject({
      method: "POST",
      url: "/api/transactions",
      headers: authHeaders(accessToken),
      payload: [transactionPayload(categoryId)],
    });

    assert.equal(response.statusCode, 200);
    const body = response.json();
    assert.equal(body.created.length, 1);
    assert.equal(body.failed.length, 0);
    assert.equal(body.created[0].description, "Mercado");
    assert.equal(body.created[0].amount, 350.5);
    assert.equal(body.created[0].transactionDate, "2026-06-10");
    assert.equal(body.created[0].category.id, categoryId);
    assert.equal(body.created[0].category.name, "Alimentação");
    assert.equal(body.created[0].category.type, "DESPESA");
    assert.equal(body.created[0].category.expenseKind, "VARIAVEL");
  });

  it("creates many transactions in a single request", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const categoryId = await createCategory(app, accessToken);

    const response = await app.inject({
      method: "POST",
      url: "/api/transactions",
      headers: authHeaders(accessToken),
      payload: [
        transactionPayload(categoryId),
        { ...transactionPayload(categoryId), description: "Farmácia", referenceMonth: 7 },
      ],
    });

    assert.equal(response.statusCode, 200);
    const body = response.json();
    assert.equal(body.created.length, 2);
    assert.equal(body.failed.length, 0);
  });

  it("reports an unknown category as a per-item failure", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const categoryId = await createCategory(app, accessToken);
    const response = await app.inject({
      method: "POST",
      url: "/api/transactions",
      headers: authHeaders(accessToken),
      payload: [
        transactionPayload(categoryId),
        transactionPayload("7b3f3f65-3f4b-4a3f-9d3f-3f65b34a3f9d"),
      ],
    });

    assert.equal(response.statusCode, 200);
    const body = response.json();
    assert.equal(body.created.length, 1);
    assert.equal(body.failed.length, 1);
    assert.equal(body.failed[0].index, 1);
    assert.equal(body.failed[0].error, "Category not found");
  });

  it("rejects an out-of-range referenceMonth with 400", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const categoryId = await createCategory(app, accessToken);

    const response = await app.inject({
      method: "POST",
      url: "/api/transactions",
      headers: authHeaders(accessToken),
      payload: [{ ...transactionPayload(categoryId), referenceMonth: 13 }],
    });

    assert.equal(response.statusCode, 400);
  });
});

describe("GET /transactions", () => {
  it("lists the user's transactions with filters", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const categoryId = await createCategory(app, accessToken);

    await app.inject({
      method: "POST",
      url: "/api/transactions",
      headers: authHeaders(accessToken),
      payload: [
        transactionPayload(categoryId),
        { ...transactionPayload(categoryId), referenceMonth: 7, transactionDate: "2026-07-01" },
      ],
    });

    const allResponse = await app.inject({
      method: "GET",
      url: "/api/transactions",
      headers: authHeaders(accessToken),
    });
    assert.equal(allResponse.statusCode, 200);
    assert.equal(allResponse.json().data.length, 2);
    assert.equal(allResponse.json().total, 2);

    const filters = encodeURIComponent(JSON.stringify({ referenceMonth: 7, referenceYear: 2026 }));
    const filteredResponse = await app.inject({
      method: "GET",
      url: `/api/transactions?filters=${filters}`,
      headers: authHeaders(accessToken),
    });
    assert.equal(filteredResponse.json().data.length, 1);
    assert.equal(filteredResponse.json().data[0].referenceMonth, 7);
  });

  it("filters by the related category's type and expenseKind", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const expenseCategoryId = await createCategory(app, accessToken);
    const incomeCategoryResponse = await app.inject({
      method: "POST",
      url: "/api/categories",
      headers: authHeaders(accessToken),
      payload: [{ name: "Salário", type: "RECEITA" }],
    });
    const incomeCategoryId = incomeCategoryResponse.json().created[0].id;

    await app.inject({
      method: "POST",
      url: "/api/transactions",
      headers: authHeaders(accessToken),
      payload: [
        transactionPayload(expenseCategoryId),
        { ...transactionPayload(incomeCategoryId), description: "Salário de junho" },
      ],
    });

    const typeFilter = encodeURIComponent(JSON.stringify({ categoryType: "RECEITA" }));
    const typeResponse = await app.inject({
      method: "GET",
      url: `/api/transactions?filters=${typeFilter}`,
      headers: authHeaders(accessToken),
    });
    assert.equal(typeResponse.json().data.length, 1);
    assert.equal(typeResponse.json().data[0].category.type, "RECEITA");

    const expenseKindFilter = encodeURIComponent(JSON.stringify({ expenseKind: "VARIAVEL" }));
    const expenseKindResponse = await app.inject({
      method: "GET",
      url: `/api/transactions?filters=${expenseKindFilter}`,
      headers: authHeaders(accessToken),
    });
    assert.equal(expenseKindResponse.json().data.length, 1);
    assert.equal(expenseKindResponse.json().data[0].category.id, expenseCategoryId);
  });

  it("searches by description and category name", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const foodCategoryId = await createCategory(app, accessToken);
    const transportCategoryResponse = await app.inject({
      method: "POST",
      url: "/api/categories",
      headers: authHeaders(accessToken),
      payload: [{ name: "Transporte", type: "DESPESA", expenseKind: "VARIAVEL" }],
    });
    const transportCategoryId = transportCategoryResponse.json().created[0].id;

    await app.inject({
      method: "POST",
      url: "/api/transactions",
      headers: authHeaders(accessToken),
      payload: [
        { ...transactionPayload(foodCategoryId), description: "Mercado da esquina" },
        { ...transactionPayload(transportCategoryId), description: "Uber" },
      ],
    });

    const byDescription = await app.inject({
      method: "GET",
      url: "/api/transactions?search=mercado",
      headers: authHeaders(accessToken),
    });
    assert.equal(byDescription.json().data.length, 1);
    assert.equal(byDescription.json().data[0].description, "Mercado da esquina");

    const byCategoryName = await app.inject({
      method: "GET",
      url: "/api/transactions?search=transp",
      headers: authHeaders(accessToken),
    });
    assert.equal(byCategoryName.json().data.length, 1);
    assert.equal(byCategoryName.json().data[0].category.name, "Transporte");
  });

  it("does not leak other users' transactions", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const owner = await registerAndSignIn(app);
    const other = await registerAndSignIn(app);
    const categoryId = await createCategory(app, owner.accessToken);
    await createTransaction(app, owner.accessToken, categoryId);

    const response = await app.inject({
      method: "GET",
      url: "/api/transactions",
      headers: authHeaders(other.accessToken),
    });

    assert.equal(response.json().data.length, 0);
  });
});

describe("GET /transactions/:id", () => {
  it("returns a single transaction", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const categoryId = await createCategory(app, accessToken);
    const created = await createTransaction(app, accessToken, categoryId);

    const response = await app.inject({
      method: "GET",
      url: `/api/transactions/${created.id}`,
      headers: authHeaders(accessToken),
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json().transaction.id, created.id);
  });

  it("returns 404 for another user's transaction", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const owner = await registerAndSignIn(app);
    const intruder = await registerAndSignIn(app);
    const categoryId = await createCategory(app, owner.accessToken);
    const created = await createTransaction(app, owner.accessToken, categoryId);

    const response = await app.inject({
      method: "GET",
      url: `/api/transactions/${created.id}`,
      headers: authHeaders(intruder.accessToken),
    });

    assert.equal(response.statusCode, 404);
    assert.equal(response.json().error, "Transaction not found");
  });
});

describe("PATCH /transactions/:id", () => {
  it("updates a transaction", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const categoryId = await createCategory(app, accessToken);
    const created = await createTransaction(app, accessToken, categoryId);

    const response = await app.inject({
      method: "PATCH",
      url: `/api/transactions/${created.id}`,
      headers: authHeaders(accessToken),
      payload: { amount: 99.9, description: "Mercado do mês" },
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json().transaction.amount, 99.9);
    assert.equal(response.json().transaction.description, "Mercado do mês");
  });

  it("rejects updating to an unknown category with 400", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const categoryId = await createCategory(app, accessToken);
    const created = await createTransaction(app, accessToken, categoryId);

    const response = await app.inject({
      method: "PATCH",
      url: `/api/transactions/${created.id}`,
      headers: authHeaders(accessToken),
      payload: { categoryId: "7b3f3f65-3f4b-4a3f-9d3f-3f65b34a3f9d" },
    });

    assert.equal(response.statusCode, 400);
  });
});

describe("DELETE /transactions", () => {
  it("deletes transactions in bulk", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const categoryId = await createCategory(app, accessToken);
    const first = await createTransaction(app, accessToken, categoryId);
    const second = await createTransaction(app, accessToken, categoryId);

    const deleteResponse = await app.inject({
      method: "DELETE",
      url: "/api/transactions",
      headers: authHeaders(accessToken),
      payload: { ids: [first.id, second.id] },
    });
    assert.equal(deleteResponse.statusCode, 200);
    assert.deepEqual(deleteResponse.json().deleted, [first.id, second.id]);
    assert.equal(deleteResponse.json().failed.length, 0);

    const getResponse = await app.inject({
      method: "GET",
      url: `/api/transactions/${first.id}`,
      headers: authHeaders(accessToken),
    });
    assert.equal(getResponse.statusCode, 404);
  });

  it("reports another user's transaction as a per-item failure", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const owner = await registerAndSignIn(app);
    const intruder = await registerAndSignIn(app);
    const categoryId = await createCategory(app, owner.accessToken);
    const created = await createTransaction(app, owner.accessToken, categoryId);

    const response = await app.inject({
      method: "DELETE",
      url: "/api/transactions",
      headers: authHeaders(intruder.accessToken),
      payload: { ids: [created.id] },
    });

    assert.equal(response.statusCode, 200);
    const body = response.json();
    assert.equal(body.deleted.length, 0);
    assert.equal(body.failed[0].id, created.id);
    assert.equal(body.failed[0].error, "Transaction not found");
  });
});
