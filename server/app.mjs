import { createServer } from "node:http";

function send(response, status, body) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

function error(response, status, code, message) {
  send(response, status, { error: { code, message } });
}

export function createApiServer(repository) {
  return createServer(async (request, response) => {
    try {
      if (request.method !== "GET") return error(response, 405, "METHOD_NOT_ALLOWED", "Only GET requests are supported.");
      const url = new URL(request.url, "http://localhost");
      if (url.pathname === "/api/health") return send(response, 200, { status: "ok", ...(await repository.health()) });
      if (url.pathname === "/api/delegation") {
        const zip = url.searchParams.get("zip");
        if (!zip || !/^\d{5}$/.test(zip)) return error(response, 400, "INVALID_ZIP", "A five-digit ZIP code is required.");
        const delegation = await repository.delegationByZip(zip);
        return delegation ? send(response, 200, delegation) : error(response, 404, "ZIP_NOT_SUPPORTED", "ZIP code is not supported.");
      }
      const memberMatch = url.pathname.match(/^\/api\/members\/([^/]+)(?:\/(activity|contributions))?$/);
      if (memberMatch) {
        const [, memberId, collection] = memberMatch;
        const record = await repository.memberById(memberId);
        if (!record) return error(response, 404, "MEMBER_NOT_FOUND", "Member not found.");
        if (collection === "activity") return send(response, 200, { member: record, activities: await repository.memberActivity(memberId) });
        if (collection === "contributions") return send(response, 200, { member: record, contributions: await repository.memberContributions(memberId) });
        return send(response, 200, record);
      }
      const billMatch = url.pathname.match(/^\/api\/bills\/([^/]+)$/);
      if (billMatch) {
        const record = await repository.billById(billMatch[1]);
        return record ? send(response, 200, record) : error(response, 404, "BILL_NOT_FOUND", "Bill not found.");
      }
      return error(response, 404, "NOT_FOUND", "Endpoint not found.");
    } catch (caught) {
      console.error("API request failed", caught);
      return error(response, 503, "DATABASE_UNAVAILABLE", "The data service is temporarily unavailable.");
    }
  });
}
