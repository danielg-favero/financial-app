import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { FastifyInstance } from "fastify";

import { authHeaders, buildTestApp, registerAndSignIn } from "../helpers/build-test-app.ts";

async function createCategory(
  app: FastifyInstance,
  accessToken: string,
  payload: Record<string, string | null>,
): Promise<{ statusCode: number; category: { id: string } }> {
  const response = await app.inject({
    method: "POST",
    url: "/api/categories",
    headers: authHeaders(accessToken),
    payload: [payload],
  });
  return { statusCode: response.statusCode, category: response.json().created[0] };
}

describe("POST /categories", () => {
  it("rejects unauthenticated requests with 401", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const response = await app.inject({
      method: "POST",
      url: "/api/categories",
      payload: [{ name: "Moradia", type: "DESPESA" }],
    });

    assert.equal(response.statusCode, 401);
  });

  it("rejects a non-array body with 400", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const response = await app.inject({
      method: "POST",
      url: "/api/categories",
      headers: authHeaders(accessToken),
      payload: { name: "Moradia", type: "DESPESA" },
    });

    assert.equal(response.statusCode, 400);
  });

  it("creates a category", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const response = await app.inject({
      method: "POST",
      url: "/api/categories",
      headers: authHeaders(accessToken),
      payload: [{ name: "Moradia", type: "DESPESA", expenseKind: "FIXA" }],
    });

    assert.equal(response.statusCode, 200);
    const body = response.json();
    assert.equal(body.created.length, 1);
    assert.equal(body.failed.length, 0);
    assert.equal(body.created[0].name, "Moradia");
    assert.equal(body.created[0].type, "DESPESA");
    assert.equal(body.created[0].expenseKind, "FIXA");
    assert.equal(body.created[0].parentId, null);
  });

  it("creates many categories in a single request", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const response = await app.inject({
      method: "POST",
      url: "/api/categories",
      headers: authHeaders(accessToken),
      payload: [
        { name: "Moradia", type: "DESPESA" },
        { name: "Salário", type: "RECEITA" },
      ],
    });

    assert.equal(response.statusCode, 200);
    const body = response.json();
    assert.equal(body.created.length, 2);
    assert.equal(body.failed.length, 0);
    assert.deepEqual(
      body.created.map((category: { name: string }) => category.name),
      ["Moradia", "Salário"],
    );
  });

  it("reports per-item failures without blocking the valid ones", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const response = await app.inject({
      method: "POST",
      url: "/api/categories",
      headers: authHeaders(accessToken),
      payload: [
        { name: "Moradia", type: "DESPESA" },
        { name: "Salário", type: "RECEITA", expenseKind: "FIXA" },
      ],
    });

    assert.equal(response.statusCode, 200);
    const body = response.json();
    assert.equal(body.created.length, 1);
    assert.equal(body.created[0].name, "Moradia");
    assert.equal(body.failed.length, 1);
    assert.equal(body.failed[0].index, 1);
    assert.equal(body.failed[0].error, "expenseKind is only allowed for DESPESA categories");
  });

  it("creates a subcategory when the parent exists", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const parent = await createCategory(app, accessToken, { name: "Moradia", type: "DESPESA" });
    const response = await app.inject({
      method: "POST",
      url: "/api/categories",
      headers: authHeaders(accessToken),
      payload: [{ name: "Aluguel", type: "DESPESA", expenseKind: "FIXA", parentId: parent.category.id }],
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json().created[0].parentId, parent.category.id);
  });

  it("reports an unknown parent as a per-item failure", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const response = await app.inject({
      method: "POST",
      url: "/api/categories",
      headers: authHeaders(accessToken),
      payload: [
        {
          name: "Aluguel",
          type: "DESPESA",
          parentId: "7b3f3f65-3f4b-4a3f-9d3f-3f65b34a3f9d",
        },
      ],
    });

    assert.equal(response.statusCode, 200);
    const body = response.json();
    assert.equal(body.created.length, 0);
    assert.equal(body.failed[0].index, 0);
    assert.equal(body.failed[0].error, "Parent category not found");
  });
});

describe("GET /categories", () => {
  it("lists only the current user's categories", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const firstUser = await registerAndSignIn(app);
    const secondUser = await registerAndSignIn(app);
    await createCategory(app, firstUser.accessToken, { name: "Moradia", type: "DESPESA" });
    await createCategory(app, secondUser.accessToken, { name: "Salário", type: "RECEITA" });

    const response = await app.inject({
      method: "GET",
      url: "/api/categories",
      headers: authHeaders(firstUser.accessToken),
    });

    assert.equal(response.statusCode, 200);
    const body = response.json();
    assert.equal(body.data.length, 1);
    assert.equal(body.data[0].name, "Moradia");
    assert.equal(body.page, 1);
    assert.equal(body.perPage, 20);
    assert.equal(body.total, 1);
    assert.equal(body.totalPages, 1);
  });

  it("supports pagination, search and ordering", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    await createCategory(app, accessToken, { name: "Moradia", type: "DESPESA" });
    await createCategory(app, accessToken, { name: "Mercado", type: "DESPESA" });
    await createCategory(app, accessToken, { name: "Salário", type: "RECEITA" });

    const searchResponse = await app.inject({
      method: "GET",
      url: "/api/categories?search=m&orderBy=name&sort=desc",
      headers: authHeaders(accessToken),
    });
    assert.equal(searchResponse.statusCode, 200);
    const searchBody = searchResponse.json();
    assert.equal(searchBody.total, 2);
    assert.deepEqual(
      searchBody.data.map((category: { name: string }) => category.name),
      ["Moradia", "Mercado"],
    );

    const pagedResponse = await app.inject({
      method: "GET",
      url: "/api/categories?page=2&perPage=2&orderBy=name&sort=asc",
      headers: authHeaders(accessToken),
    });
    const pagedBody = pagedResponse.json();
    assert.equal(pagedBody.page, 2);
    assert.equal(pagedBody.perPage, 2);
    assert.equal(pagedBody.total, 3);
    assert.equal(pagedBody.totalPages, 2);
    assert.equal(pagedBody.data.length, 1);
    assert.equal(pagedBody.data[0].name, "Salário");
  });

  it("rejects an unknown orderBy field with 400", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const response = await app.inject({
      method: "GET",
      url: "/api/categories?orderBy=userId",
      headers: authHeaders(accessToken),
    });

    assert.equal(response.statusCode, 400);
  });
});

describe("GET /categories/:id", () => {
  it("returns a single category", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const created = await createCategory(app, accessToken, { name: "Lazer", type: "DESPESA" });

    const response = await app.inject({
      method: "GET",
      url: `/api/categories/${created.category.id}`,
      headers: authHeaders(accessToken),
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json().category.id, created.category.id);
  });

  it("returns 404 for another user's category", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const owner = await registerAndSignIn(app);
    const intruder = await registerAndSignIn(app);
    const created = await createCategory(app, owner.accessToken, { name: "Lazer", type: "DESPESA" });

    const response = await app.inject({
      method: "GET",
      url: `/api/categories/${created.category.id}`,
      headers: authHeaders(intruder.accessToken),
    });

    assert.equal(response.statusCode, 404);
    assert.equal(response.json().error, "Category not found");
  });

  it("returns 400 for a malformed id", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const response = await app.inject({
      method: "GET",
      url: "/api/categories/not-a-uuid",
      headers: authHeaders(accessToken),
    });

    assert.equal(response.statusCode, 400);
  });
});

describe("PATCH /categories/:id", () => {
  it("updates a category", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const created = await createCategory(app, accessToken, { name: "Lazer", type: "DESPESA" });

    const response = await app.inject({
      method: "PATCH",
      url: `/api/categories/${created.category.id}`,
      headers: authHeaders(accessToken),
      payload: { name: "Lazer e Cultura" },
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json().category.name, "Lazer e Cultura");
  });

  it("rejects making a category its own parent", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const created = await createCategory(app, accessToken, { name: "Lazer", type: "DESPESA" });

    const response = await app.inject({
      method: "PATCH",
      url: `/api/categories/${created.category.id}`,
      headers: authHeaders(accessToken),
      payload: { parentId: created.category.id },
    });

    assert.equal(response.statusCode, 400);
    assert.equal(response.json().error, "A category cannot be its own parent");
  });

  it("rejects switching to a non-DESPESA type while expenseKind is set", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const created = await createCategory(app, accessToken, {
      name: "Moradia",
      type: "DESPESA",
      expenseKind: "FIXA",
    });

    const response = await app.inject({
      method: "PATCH",
      url: `/api/categories/${created.category.id}`,
      headers: authHeaders(accessToken),
      payload: { type: "RECEITA" },
    });

    assert.equal(response.statusCode, 400);
  });
});

describe("DELETE /categories", () => {
  it("deletes categories in bulk", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const first = await createCategory(app, accessToken, { name: "Lazer", type: "DESPESA" });
    const second = await createCategory(app, accessToken, { name: "Viagem", type: "DESPESA" });

    const deleteResponse = await app.inject({
      method: "DELETE",
      url: "/api/categories",
      headers: authHeaders(accessToken),
      payload: { ids: [first.category.id, second.category.id] },
    });
    assert.equal(deleteResponse.statusCode, 200);
    const body = deleteResponse.json();
    assert.deepEqual(body.deleted, [first.category.id, second.category.id]);
    assert.equal(body.failed.length, 0);

    const getResponse = await app.inject({
      method: "GET",
      url: `/api/categories/${first.category.id}`,
      headers: authHeaders(accessToken),
    });
    assert.equal(getResponse.statusCode, 404);
  });

  it("reports a category with transactions as a per-item failure", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const created = await createCategory(app, accessToken, { name: "Lazer", type: "DESPESA" });
    await app.inject({
      method: "POST",
      url: "/api/transactions",
      headers: authHeaders(accessToken),
      payload: [
        {
          categoryId: created.category.id,
          description: "Cinema",
          amount: 50,
          referenceMonth: 6,
          referenceYear: 2026,
          transactionDate: "2026-06-15",
        },
      ],
    });

    const response = await app.inject({
      method: "DELETE",
      url: "/api/categories",
      headers: authHeaders(accessToken),
      payload: { ids: [created.category.id] },
    });

    assert.equal(response.statusCode, 200);
    const body = response.json();
    assert.equal(body.deleted.length, 0);
    assert.equal(body.failed[0].id, created.category.id);
    assert.equal(body.failed[0].error, "Category is in use and cannot be deleted");
  });

  it("reports a category with children as a per-item failure", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const parent = await createCategory(app, accessToken, { name: "Moradia", type: "DESPESA" });
    await createCategory(app, accessToken, {
      name: "Aluguel",
      type: "DESPESA",
      parentId: parent.category.id,
    });

    const response = await app.inject({
      method: "DELETE",
      url: "/api/categories",
      headers: authHeaders(accessToken),
      payload: { ids: [parent.category.id] },
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json().failed[0].error, "Category is in use and cannot be deleted");
  });
});
