import type { BillContext, Legislator } from "../domain/models";
import { congressDataRepository } from "../services/congressDataRepository";

interface InfluencePanelProps {
  legislator: Legislator;
  bill: BillContext | undefined;
}

export function InfluencePanel({ legislator, bill }: InfluencePanelProps) {
  const snapshot = congressDataRepository.getInfluenceSnapshotForMember(
    legislator.id,
    bill?.id,
  );

  if (!snapshot) {
    return null;
  }

  return (
    <section className="panel influence-panel">
      <div className="eyebrow">Money and influence context</div>
      <h3>Campaign money, lobbying, and spending should be visible here</h3>
      <p className="detail-summary">
        This product direction is now explicit. The app should eventually place
        legislative activity next to campaign-finance, lobbying, and federal
        spending context without implying unsupported causation.
      </p>

      <div className="influence-grid">
        <article className="signal-card">
          <span className="signal-label">Campaign finance</span>
          <strong>{snapshot.campaignFinance.loadedRecords} loaded records</strong>
          <p>{snapshot.campaignFinance.summary}</p>
        </article>
        <article className="signal-card">
          <span className="signal-label">Lobbying</span>
          <strong>{snapshot.lobbying.loadedRecords} loaded records</strong>
          <p>{snapshot.lobbying.summary}</p>
        </article>
        <article className="signal-card">
          <span className="signal-label">Federal spending</span>
          <strong>{snapshot.federalSpending.loadedRecords} loaded records</strong>
          <p>{snapshot.federalSpending.summary}</p>
        </article>
      </div>

      <div className="detail-block">
        <div className="block-heading">
          <strong>Relationship confidence model</strong>
          <span>The UI should distinguish direct evidence from weaker contextual links.</span>
        </div>
        <div className="version-list">
          <span className="version-pill">DIRECT_BILL_MATCH</span>
          <span className="version-pill">POLICY_AREA_MATCH</span>
          <span className="version-pill">INDUSTRY_CONTEXT</span>
        </div>
      </div>

      <div className="detail-block">
        <div className="block-heading">
          <strong>Current POC status</strong>
          <span>
            The panel is intentionally visible even when no finance or lobbying
            data has been loaded yet, so the product scope is legible to users.
          </span>
        </div>
        <ul className="related-list">
          <li>Future campaign-finance source: FEC / OpenFEC.</li>
          <li>Future lobbying source: official Lobbying Disclosure Act records.</li>
          <li>Future spending source: USAspending.</li>
          <li>Current rule: context is allowed, accusations are not.</li>
        </ul>
      </div>
    </section>
  );
}
