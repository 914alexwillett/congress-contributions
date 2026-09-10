const issueByPolicyArea = {
  "Armed forces and national security": "defense",
  "Civil rights and liberties, minority issues": "civil-rights",
  "Commerce": "financial-regulation",
  "Environmental protection": "environment-climate",
  "Health": "healthcare",
  "Immigration": "immigration",
  "Law": "judiciary",
  "Labor and employment": "labor",
  "Taxation": "taxation",
  "Transportation and public works": "transportation-environment",
};

export function billId(bill) {
  return `congress-${bill.congress}-${String(bill.type).toLowerCase()}-${bill.number}`;
}

export function activityId(memberId, kind, bill) {
  return `congress-activity-${memberId}-${kind}-${bill.congress}-${String(bill.type).toLowerCase()}-${bill.number}`;
}

export function sourceId(resourceType, externalId) {
  return `congress-${resourceType}-${externalId.replaceAll(/[^a-zA-Z0-9-]/g, "-").toLowerCase()}`;
}

function sourceUrl(bill) {
  return `https://www.congress.gov/bill/${bill.congress}th-congress/${String(bill.type).toLowerCase()}-${String(bill.type).toLowerCase() === "s" ? "bill" : "bill"}/${bill.number}`;
}

function issueIds(bill) {
  const issue = issueByPolicyArea[bill.policyArea?.name];
  return issue ? [issue] : [];
}

export function normalizeLegislation({ memberId, chamber, kind, bill, retrievedAt }) {
  const externalId = `${bill.congress}-${String(bill.type).toLowerCase()}-${bill.number}`;
  const recordId = sourceId("bill", externalId);
  const actionDate = bill.latestAction?.actionDate ?? bill.introducedDate ?? retrievedAt.slice(0, 10);
  const isSponsored = kind === "sponsored";
  const measure = {
    id: `${String(bill.type).toUpperCase()}.${bill.number}`,
    congress: bill.congress,
    type: bill.type,
    number: String(bill.number),
    title: bill.title ?? "Untitled legislation",
    shortTitle: `${String(bill.type).toUpperCase()}.${bill.number}`,
  };
  const evidence = [{
    label: `Congress.gov record for ${measure.id}`,
    url: bill.url ?? sourceUrl(bill),
    sourceType: "congress_gov",
    sourceRecordId: recordId,
    supports: `${isSponsored ? "Sponsorship" : "Cosponsorship"}, bill metadata, and latest action supplied by Congress.gov.`,
  }];
  return {
    sourceRecord: {
      id: recordId,
      source: "congress_gov",
      resourceType: "bill",
      externalId,
      title: `${measure.id} - ${measure.title}`,
      sourceUrl: bill.url ?? sourceUrl(bill),
      retrievedAt,
      sourceUpdatedAt: bill.updateDate,
      payload: bill,
    },
    bill: {
      id: billId(bill), measure, originChamber: chamber,
      broadPurpose: bill.title ?? "Congress.gov has not supplied a title.",
      currentState: bill.latestAction?.text ?? "Latest action not supplied by Congress.gov.",
      legislativeState: "unknown", issueIds: issueIds(bill), committeeNames: [],
      majorVersions: ["Congress.gov routine ingestion"],
      lineage: { proposed: true, committee: null, house: null, senate: null, enacted: null },
      becameLaw: null, evidence,
    },
    activity: {
      id: activityId(memberId, kind, bill), memberId, date: actionDate,
      type: isSponsored ? "bill_introduction" : "bill_cosponsorship",
      headline: `${isSponsored ? "Sponsored" : "Cosponsored"} ${measure.id}: ${measure.title}`,
      summary: bill.latestAction?.text ?? "Congress.gov lists this routine legislative activity.",
      proceduralNote: isSponsored ? "Congress.gov identifies this member as the sponsor of record." : "Congress.gov identifies this member as a formal cosponsor; this does not establish drafting authorship.",
      measure, measureId: billId(bill), issueIds: issueIds(bill),
      outcomeLabel: bill.latestAction?.text ? "latest action recorded" : "activity recorded",
      changeTags: ["new_activity", isSponsored ? "bill_introduced" : "cosponsorship_added"], evidence,
    },
  };
}

export function dedupeById(records) {
  return [...new Map(records.map((record) => [record.id, record])).values()];
}
