import { getBillLineageStages } from "../domain/presentation";
import type { BillContext, LegislativeContribution } from "../domain/models";
import { EvidencePanel } from "./EvidencePanel";
import { LineageTrack } from "./LineageTrack";

interface BillContextPanelProps {
  bill: BillContext | undefined;
  relatedContributions: LegislativeContribution[];
  scopeLabel?: string;
}

export function BillContextPanel({
  bill,
  relatedContributions,
  scopeLabel = "this member",
}: BillContextPanelProps) {
  if (!bill) {
    return null;
  }

  return (
    <section className="panel bill-panel">
      <div className="eyebrow">Bill context</div>
      <h3>{bill.measure.shortTitle ?? bill.measure.title}</h3>
      <p className="measure-id">
        {bill.measure.id} - {bill.measure.title}
      </p>
      <p className="detail-summary">{bill.broadPurpose}</p>

      <dl className="detail-grid">
        <div>
          <dt>Current state</dt>
          <dd>{bill.currentState}</dd>
        </div>
        <div>
          <dt>Origin chamber</dt>
          <dd>{bill.originChamber === "house" ? "House" : "Senate"}</dd>
        </div>
        <div>
          <dt>Committees</dt>
          <dd>{bill.committeeNames.join(", ") || "Unknown"}</dd>
        </div>
        <div>
          <dt>Became law</dt>
          <dd>
            {bill.becameLaw === true
              ? "Yes"
              : bill.becameLaw === false
                ? "No"
                : "Unknown"}
          </dd>
        </div>
      </dl>

      {bill.majorVersions?.length ? (
        <div className="detail-block">
          <div className="block-heading">
            <strong>Known major versions</strong>
            <span>Only versions supported by the loaded source set are shown.</span>
          </div>
          <div className="version-list">
            {bill.majorVersions.map((version) => (
              <span key={version} className="version-pill">
                {version}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <LineageTrack
        title="Legislative path"
        subtitle="Unknown stages are left explicit rather than guessed."
        stages={getBillLineageStages(bill)}
      />

      <div className="detail-block">
        <div className="block-heading">
          <strong>What {scopeLabel} did on this bill</strong>
          <span>Only loaded, evidence-backed records are shown here.</span>
        </div>
        <ul className="related-list">
          {relatedContributions.map((contribution) => (
            <li key={contribution.id}>{contribution.headline}</li>
          ))}
        </ul>
      </div>

      <EvidencePanel title="Bill sources" evidence={bill.evidence} />
    </section>
  );
}
