import type { BillContext, LegislativeContribution, Legislator } from "../domain/models";
import {
  formatDisplayDate,
  getConfidenceLabel,
  getContributionLineageStages,
  getContributionOutcomeSummary,
  getContributionTypeLabel,
  getGlossaryTerms,
  getOutcomeLabel,
} from "../domain/presentation";
import { congressDataRepository } from "../services/congressDataRepository";
import { EvidencePanel } from "./EvidencePanel";
import { LineageTrack } from "./LineageTrack";

interface ContributionDetailProps {
  legislator: Legislator;
  contribution: LegislativeContribution | undefined;
  bill?: BillContext;
}

export function ContributionDetail({
  legislator,
  contribution,
  bill,
}: ContributionDetailProps) {
  if (!contribution) {
    return (
      <section className="panel detail-panel empty-detail">
        <h3>Select a contribution</h3>
        <p>Choose a record from the feed to inspect what happened, what it means, and the evidence behind that explanation.</p>
      </section>
    );
  }

  const glossaryTerms = getGlossaryTerms(contribution.glossaryTermIds);
  const outcomeSummary = getContributionOutcomeSummary(contribution, bill);

  return (
    <section className="panel detail-panel">
      <div className="eyebrow">Contribution detail</div>
      <h3>{contribution.headline}</h3>

      <div className="outcome-banner">
        <div>
          <span className="label">Contribution outcome</span>
          <strong>{getOutcomeLabel(contribution.outcome)}</strong>
        </div>
        <div>
          <span className="label">Bill outcome</span>
          <strong>{outcomeSummary.billOutcome}</strong>
        </div>
        <div>
          <span className="label">Confidence</span>
          <strong className={`confidence confidence-${contribution.attribution.confidence}`}>
            {getConfidenceLabel(contribution.attribution.confidence)}
          </strong>
        </div>
      </div>

      <div className="detail-block outcome-contrast">
        <div className="outcome-contrast-card">
          <span className="signal-label">This contribution</span>
          <strong>{outcomeSummary.contributionOutcome}</strong>
          <p>{contribution.context.immediateConsequence}</p>
        </div>
        <div className="outcome-contrast-card">
          <span className="signal-label">Underlying bill</span>
          <strong>{outcomeSummary.billOutcome}</strong>
          <p>{outcomeSummary.billOutcomeDetail}</p>
        </div>
      </div>

      <div className="explanation-stack">
        <section className="explanation-card">
          <span className="explanation-label">What happened?</span>
          <p>{contribution.headline}</p>
        </section>
        <section className="explanation-card">
          <span className="explanation-label">What did the member actually do?</span>
          <p>{contribution.context.plainEnglishAction}</p>
        </section>
        <section className="explanation-card">
          <span className="explanation-label">What does that mean procedurally?</span>
          <p>{contribution.context.proceduralMeaning}</p>
        </section>
        <section className="explanation-card">
          <span className="explanation-label">What happened because of it?</span>
          <p>{contribution.context.immediateConsequence}</p>
        </section>
        {contribution.context.laterOutcome ? (
          <section className="explanation-card">
            <span className="explanation-label">What happened next?</span>
            <p>{contribution.context.laterOutcome}</p>
          </section>
        ) : null}
        {contribution.context.nextStep ? (
          <section className="explanation-card">
            <span className="explanation-label">What is the next procedural step?</span>
            <p>{contribution.context.nextStep}</p>
          </section>
        ) : null}
      </div>

      <LineageTrack
        title="Legislative path"
        subtitle="The app shows known and unknown stages separately rather than filling gaps with guesses."
        stages={getContributionLineageStages(contribution)}
      />

      <dl className="detail-grid">
        <div>
          <dt>Legislator</dt>
          <dd>{legislator.name}</dd>
        </div>
        <div>
          <dt>Measure</dt>
          <dd>
            {contribution.measure.id} -{" "}
            {contribution.measure.shortTitle ?? contribution.measure.title}
          </dd>
        </div>
        <div>
          <dt>Date</dt>
          <dd>{formatDisplayDate(contribution.date)}</dd>
        </div>
        <div>
          <dt>Venue</dt>
          <dd>{contribution.venue?.name ?? "Unknown"}</dd>
        </div>
        <div>
          <dt>Contribution type</dt>
          <dd>{getContributionTypeLabel(contribution.type)}</dd>
        </div>
        <div>
          <dt>Drafting authorship known</dt>
          <dd>
            {contribution.attribution.literalDraftingKnown === true
              ? "Yes"
              : contribution.attribution.literalDraftingKnown === false
                ? "No"
                : "Unknown"}
          </dd>
        </div>
      </dl>

      <div className="detail-block">
        <div className="block-heading">
          <strong>Issue context</strong>
          <span>Observed legislative attention, not ideology or endorsement.</span>
        </div>
        <div className="version-list">
          {contribution.issueIds.map((issueId) => {
            const issue = congressDataRepository.getIssueById(issueId);

            return issue ? (
              <span key={issue.id} className="version-pill">
                {issue.label}
              </span>
            ) : null;
          })}
        </div>
      </div>

      <div className="detail-sections">
        {contribution.textChange ? (
          <details className="detail-disclosure">
            <summary>Text change snapshot</summary>
            <div className="detail-disclosure-body">
              <p className="detail-disclosure-copy">
                This is shown only where the available record supports a text-change description.
              </p>
              <pre className="diff-card">
                {contribution.textChange.previousText
                  ? `- ${contribution.textChange.previousText}\n+ ${
                      contribution.textChange.proposedText ?? "Proposed text not captured"
                    }`
                  : `+ ${contribution.textChange.proposedText ?? "Proposed text not captured"}`}
                {contribution.textChange.resultingText
                  ? `\n\nResulting text:\n${contribution.textChange.resultingText}`
                  : ""}
              </pre>
              <p className="reconstruction-note">
                Reconstruction method: {contribution.textChange.reconstructionMethod ?? "unknown"}.
                Confidence: {getConfidenceLabel(contribution.textChange.confidence ?? "unknown")}.
              </p>
            </div>
          </details>
        ) : null}

        <details className="detail-disclosure">
          <summary>Procedural glossary</summary>
          <div className="detail-disclosure-body">
            <p className="detail-disclosure-copy">
              Definitions come from a shared glossary rather than one-off component text.
            </p>
            <div className="glossary-grid">
              {glossaryTerms.map((term) => (
                <article key={term.id} className="glossary-card">
                  <strong>{term.label}</strong>
                  <p>{term.conciseDefinition}</p>
                  <span>{term.beginnerExplanation}</span>
                </article>
              ))}
            </div>
          </div>
        </details>

        <details className="detail-disclosure">
          <summary>Attribution and evidence</summary>
          <div className="detail-disclosure-body">
            <p className="detail-disclosure-copy">
              The app separates formal action from unsupported assumptions about authorship.
            </p>
            <p className="attribution-copy">{contribution.attribution.statement}</p>
            <EvidencePanel evidence={contribution.evidence} />
          </div>
        </details>
      </div>
    </section>
  );
}
