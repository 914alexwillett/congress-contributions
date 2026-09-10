import test from "node:test";
import assert from "node:assert/strict";
import { activityId, billId, dedupeById, normalizeLegislation } from "./normalizers.mjs";

const bill = { congress: 119, type: "S", number: "42", title: "Test Bill", introducedDate: "2026-01-02", latestAction: { actionDate: "2026-01-03", text: "Referred to committee." }, policyArea: { name: "Health" }, url: "https://api.congress.gov/v3/bill/119/s/42" };

test("normalizes sponsored legislation with stable project-owned IDs", () => {
  const result = normalizeLegislation({ memberId: "member", chamber: "senate", kind: "sponsored", bill, retrievedAt: "2026-09-04T00:00:00.000Z" });
  assert.equal(result.bill.id, billId(bill));
  assert.equal(result.activity.id, activityId("member", "sponsored", bill));
  assert.deepEqual(result.activity.issueIds, ["healthcare"]);
  assert.equal(result.activity.type, "bill_introduction");
});

test("preserves unknown policy areas and removes duplicate stable IDs", () => {
  const result = normalizeLegislation({ memberId: "member", chamber: "senate", kind: "cosponsored", bill: { ...bill, policyArea: { name: "Unmapped" } }, retrievedAt: "2026-09-04T00:00:00.000Z" });
  assert.deepEqual(result.activity.issueIds, []);
  assert.equal(dedupeById([result.activity, result.activity]).length, 1);
  assert.equal(result.activity.type, "bill_cosponsorship");
});
