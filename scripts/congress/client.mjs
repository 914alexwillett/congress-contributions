const BASE_URL = "https://api.congress.gov/v3";

export class CongressApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export class CongressClient {
  constructor(apiKey, fetchImpl = fetch) {
    if (!apiKey) {
      throw new CongressApiError("CONGRESS_API_KEY is required. Add it to your environment; see .env.example.");
    }
    this.apiKey = apiKey;
    this.fetchImpl = fetchImpl;
  }

  async get(pathOrUrl) {
    const url = new URL(pathOrUrl, BASE_URL);
    url.searchParams.set("format", "json");
    url.searchParams.set("api_key", this.apiKey);
    const response = await this.fetchImpl(url);
    if (!response.ok) {
      throw new CongressApiError(`Congress.gov request failed (${response.status}) for ${url.pathname}`, response.status);
    }
    return response.json();
  }

  async getAll(path, collectionKey, limit = 20) {
    const records = [];
    let next = new URL(path.replace(/^\//, ""), `${BASE_URL}/`);
    next.searchParams.set("limit", String(limit));
    while (next && records.length < limit) {
      const page = await this.get(next);
      records.push(...(page[collectionKey] ?? []));
      next = page.pagination?.next ? new URL(page.pagination.next) : null;
    }
    return records.slice(0, limit);
  }
}
