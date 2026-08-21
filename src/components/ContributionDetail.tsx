import type { LegislativeContribution, Legislator } from "../models/legislative";
import {
  formatDisplayDate,
  getLineageStages,
  getOutcomeLabel,
  getTypeLabel,
} from "../utils/contributions";

interface ContributionDetailProps {
  legislator: Legislator;
  contribution: LegislativeContribution | undefined;
}

export function ContributionDetail({
  legislator,
  contribution,
}: ContributionDetailProps) {
  if (!contribution) {
    return (
      <section className="panel detail-panel empty-detail">
        <h3>Select a contribution</h3>
        <p>Choose an entry from the feed to inspect the record and source trail.</p>
      </section>
    );
  }

  const lineage = getLineageStages(contribution);

  return (
    <section className="panel detail-panel">
      <div className="eyebrow">Contribution detail</div>
      <h3>{contribution.title}</h3>
      <p className="detail-summary">{contribution.summary}</p>

      <dl className="detail-grid">
        <div>
          <dt>Legislator</dt>
          <dd>{legislator.name}</dd>
        </div>
        <div>
          <dt>Bill or measure</dt>
          <dd>
            {contribution.billOrMeasure.id ?? "Unnumbered"}:{" "}
            {contribution.billOrMeasure.title}
          </dd>
        </div>
        <div>
          <dt>Date</dt>
          <dd>{formatDisplayDate(contribution.date)}</dd>
        </div>
        <div>
          <dt>Venue</dt>
          <dd>{contribution.venue?.name ?? "Not specified"}</dd>
        </div>
        <div>
          <dt>Contribution type</dt>
          <dd>{getTypeLabel(contribution.type)}</dd>
        </div>
        <div>
          <dt>Outcome</dt>
          <dd>{getOutcomeLabel(contribution.outcome)}</dd>
        </div>
        <div>
          <dt>Confidence</dt>
          <dd className={`confidence confidence-${contribution.confidence}`}>
            {contribution.confidence}
          </dd>
        </div>
        <div>
          <dt>Attribution note</dt>
          <dd>{contribution.attributionNote}</dd>
        </div>
      </dl>

      {(contribution.proposedText || contribution.affectedText) && (
        <div className="detail-block">
          <div className="block-heading">
            <strong>Text change snapshot</strong>
            <span>Evidence-backed excerpt or paraphrase from the record</span>
          </div>
          <pre className="diff-card">
            {contribution.affectedText
              ? `- ${contribution.affectedText}\n+ ${
                  contribution.proposedText ?? "Proposed text not captured"
                }`
              : `+ ${contribution.proposedText ?? "Proposed text not captured"}`}
          </pre>
        </div>
      )}

      <div className="detail-block">
        <div className="block-heading">
          <strong>Future lineage placeholder</strong>
          <span>This POC leaves room for text-survival tracking.</span>
        </div>
        <div className="lineage-row">
          {lineage.map((stage) => (
            <div key={stage.label} className="lineage-stage">
              <span>{stage.label}</span>
              <strong>
                {stage.reached === true
                  ? "Yes"
                  : stage.reached === false
                    ? "No"
                    : "Unknown"}
              </strong>
            </div>
          ))}
        </div>
      </div>

      <details className="evidence-panel" open>
        <summary>Why are we saying this?</summary>
        <p>
          These are the primary sources backing the displayed claim. Users should
          be able to inspect them directly and make their own judgment.
        </p>
        <ul className="evidence-list">
          {contribution.evidence.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.label}
              </a>
              <span>{source.sourceType.replaceAll("_", " ")}</span>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
