import assert from "node:assert/strict";
import test from "node:test";
import { createApiServer } from "../../server/app.mjs";

const repository = {
  async health() { return { database: "ready" }; },
  async delegationByZip(zip) { return zip === "20852" ? { area: { zip }, members: [], activities: [], bills: [], sources: [] } : undefined; },
  async memberById(id) { return id === "jamie-raskin" ? { id } : undefined; },
  async memberActivity() { return []; },
  async memberContributions() { return [{ id: "contribution-1" }]; },
  async billById(id) { return id === "congress-bill-119-hr-1" ? { id } : undefined; },
};

async function withApi(run) {
  const server = createApiServer(repository);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test("API provides health, supported delegation, and deterministic errors", async () => {
  await withApi(async (baseUrl) => {
    const health = await fetch(`${baseUrl}/api/health`);
    assert.deepEqual(await health.json(), { status: "ok", database: "ready" });

    const delegation = await fetch(`${baseUrl}/api/delegation?zip=20852`);
    assert.equal(delegation.status, 200);
    assert.equal((await delegation.json()).area.zip, "20852");

    const unsupported = await fetch(`${baseUrl}/api/delegation?zip=00000`);
    assert.equal(unsupported.status, 404);
    assert.equal((await unsupported.json()).error.code, "ZIP_NOT_SUPPORTED");

    const invalid = await fetch(`${baseUrl}/api/delegation?zip=bad`);
    assert.equal(invalid.status, 400);
    assert.equal((await invalid.json()).error.code, "INVALID_ZIP");
  });
});

test("API returns member and bill not-found errors without implementation details", async () => {
  await withApi(async (baseUrl) => {
    const member = await fetch(`${baseUrl}/api/members/not-a-member`);
    assert.equal(member.status, 404);
    assert.equal((await member.json()).error.code, "MEMBER_NOT_FOUND");

    const contributions = await fetch(`${baseUrl}/api/members/jamie-raskin/contributions`);
    assert.equal(contributions.status, 200);
    assert.equal((await contributions.json()).contributions.length, 1);

    const bill = await fetch(`${baseUrl}/api/bills/not-a-bill`);
    assert.equal(bill.status, 404);
    assert.equal((await bill.json()).error.code, "BILL_NOT_FOUND");
  });
});
