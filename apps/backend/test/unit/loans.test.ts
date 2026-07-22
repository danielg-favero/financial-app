import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { FastifyInstance } from "fastify";

import { authHeaders, buildTestApp, registerAndSignIn } from "../helpers/build-test-app.ts";

const loanPayload = {
  loanDate: "2026-05-20",
  personName: "João",
  description: "Jantar compartilhado",
  amountLent: 200,
};

async function createLoan(
  app: FastifyInstance,
  accessToken: string,
  payload: Record<string, string | number> = loanPayload,
): Promise<{ id: string }> {
  const response = await app.inject({
    method: "POST",
    url: "/api/loans",
    headers: authHeaders(accessToken),
    payload: [payload],
  });
  return response.json().created[0];
}

describe("POST /loans", () => {
  it("rejects unauthenticated requests with 401", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const response = await app.inject({ method: "POST", url: "/api/loans", payload: [loanPayload] });

    assert.equal(response.statusCode, 401);
  });

  it("creates a loan and computes the open balance", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const response = await app.inject({
      method: "POST",
      url: "/api/loans",
      headers: authHeaders(accessToken),
      payload: [{ ...loanPayload, amountReceived: 50 }],
    });

    assert.equal(response.statusCode, 200);
    const body = response.json();
    assert.equal(body.created.length, 1);
    assert.equal(body.failed.length, 0);
    assert.equal(body.created[0].amountLent, 200);
    assert.equal(body.created[0].amountReceived, 50);
    assert.equal(body.created[0].openBalance, 150);
    assert.equal(body.created[0].isPaid, false);
    assert.equal(body.created[0].loanDate, "2026-05-20");
  });

  it("creates many loans in a single request", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const response = await app.inject({
      method: "POST",
      url: "/api/loans",
      headers: authHeaders(accessToken),
      payload: [loanPayload, { ...loanPayload, personName: "Maria" }],
    });

    assert.equal(response.statusCode, 200);
    const body = response.json();
    assert.equal(body.created.length, 2);
    assert.equal(body.failed.length, 0);
  });

  it("marks a fully repaid loan as paid", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const response = await app.inject({
      method: "POST",
      url: "/api/loans",
      headers: authHeaders(accessToken),
      payload: [{ ...loanPayload, amountReceived: 200 }],
    });

    assert.equal(response.json().created[0].openBalance, 0);
    assert.equal(response.json().created[0].isPaid, true);
  });

  it("rejects a non-positive amountLent with 400", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const response = await app.inject({
      method: "POST",
      url: "/api/loans",
      headers: authHeaders(accessToken),
      payload: [{ ...loanPayload, amountLent: -10 }],
    });

    assert.equal(response.statusCode, 400);
  });
});

describe("GET /loans", () => {
  it("lists only the current user's loans", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const firstUser = await registerAndSignIn(app);
    const secondUser = await registerAndSignIn(app);
    await createLoan(app, firstUser.accessToken);

    const response = await app.inject({
      method: "GET",
      url: "/api/loans",
      headers: authHeaders(secondUser.accessToken),
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json().data.length, 0);
    assert.equal(response.json().total, 0);
  });
});

describe("GET /loans/:id", () => {
  it("returns a single loan", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const created = await createLoan(app, accessToken);

    const response = await app.inject({
      method: "GET",
      url: `/api/loans/${created.id}`,
      headers: authHeaders(accessToken),
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json().loan.personName, "João");
  });

  it("returns 404 for another user's loan", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const owner = await registerAndSignIn(app);
    const intruder = await registerAndSignIn(app);
    const created = await createLoan(app, owner.accessToken);

    const response = await app.inject({
      method: "GET",
      url: `/api/loans/${created.id}`,
      headers: authHeaders(intruder.accessToken),
    });

    assert.equal(response.statusCode, 404);
    assert.equal(response.json().error, "Loan not found");
  });
});

describe("PATCH /loans/:id", () => {
  it("recomputes the balance when a repayment is registered", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const created = await createLoan(app, accessToken);

    const response = await app.inject({
      method: "PATCH",
      url: `/api/loans/${created.id}`,
      headers: authHeaders(accessToken),
      payload: { amountReceived: 200 },
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json().loan.openBalance, 0);
    assert.equal(response.json().loan.isPaid, true);
  });
});

describe("DELETE /loans", () => {
  it("deletes loans in bulk", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);
    const first = await createLoan(app, accessToken);
    const second = await createLoan(app, accessToken, { ...loanPayload, personName: "Maria" });

    const deleteResponse = await app.inject({
      method: "DELETE",
      url: "/api/loans",
      headers: authHeaders(accessToken),
      payload: { ids: [first.id, second.id] },
    });
    assert.equal(deleteResponse.statusCode, 200);
    assert.deepEqual(deleteResponse.json().deleted, [first.id, second.id]);
    assert.equal(deleteResponse.json().failed.length, 0);

    const getResponse = await app.inject({
      method: "GET",
      url: `/api/loans/${first.id}`,
      headers: authHeaders(accessToken),
    });
    assert.equal(getResponse.statusCode, 404);
  });

  it("reports another user's loan as a per-item failure", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const owner = await registerAndSignIn(app);
    const intruder = await registerAndSignIn(app);
    const created = await createLoan(app, owner.accessToken);

    const response = await app.inject({
      method: "DELETE",
      url: "/api/loans",
      headers: authHeaders(intruder.accessToken),
      payload: { ids: [created.id] },
    });

    assert.equal(response.statusCode, 200);
    const body = response.json();
    assert.equal(body.deleted.length, 0);
    assert.equal(body.failed[0].id, created.id);
    assert.equal(body.failed[0].error, "Loan not found");
  });
});
