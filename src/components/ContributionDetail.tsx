import type {
  ActivityRecord,
  BillContext,
  LegislativeContribution,
  Legislator,
} from "../domain/models";
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
  activity?: ActivityRecord;
  contribution: LegislativeContribution | undefined;
  bill?: BillContext;
}

export function ContributionDetail({
  legislator,
  activity,
  contribution,
  bill,
}: ContributionDetailProps) {
  if (!contribution && !activity) {
    return (
      <section className="panel detail-panel empty-detail">
        <h3>Select a contribution</h3>
        <p>Choose a record from the feed to inspect what happened, what it means, and the evidence behind that explanation.</p>
      </section>
    );
  }

  if (!contribution && activity) {
    return (
      <section className="panel detail-panel">
        <div className="eyebrow">Activity detail</div>
        <h3>{activity.headline}</h3>

        <div className="outcome-banner">
          <div>
            <span className="label">Activity type</span>
            <strong>{activity.type.replaceAll("_", " ")}</strong>
          </div>
          <div>
            <span className="label">Measure</span>
            <strong>{activity.measure?.shortTitle ?? activity.measure?.id ?? "Not loaded"}</strong>
          </div>
          <div>
            <span className="label">Deep contribution</span>
            <strong>Not yet loaded</strong>
          </div>
        </div>

        <div className="explanation-stack">
          <section className="explanation-card">
            <span className="explanation-label">What happened?</span>
            <p>{activity.headline}</p>
          </section>
          <section className="explanation-card">
            <span className="explanation-label">What did the member actually do?</span>
            <p>{activity.summary}</p>
          </section>
          <section className="explanation-card">
            <span className="explanation-label">Why is this lighter than a deep contribution?</span>
            <p>
              This record keeps the recent-activity feed grounded in real congressional motion
              even when the app has not yet built full lineage, bill-context, and attribution
              detail for the item.
            </p>
          </section>
          {activity.proceduralNote ? (
            <section className="explanation-card">
              <span className="explanation-label">What procedural context is loaded?</span>
              <p>{activity.proceduralNote}</p>
            </section>
          ) : null}
        </div>

        <dl className="detail-grid">
          <div>
            <dt>Legislator</dt>
            <dd>{legislator.name}</dd>
          </div>
          <div>
            <dt>Measure</dt>
            <dd>
              {activity.measure
                ? `${activity.measure.id} - ${
                    activity.measure.shortTitle ?? activity.measure.title
                  }`
                : "Not loaded for this activity"}
            </dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{formatDisplayDate(activity.date)}</dd>
          </div>
          <div>
            <dt>Status in app</dt>
            <dd>{activity.outcomeLabel ?? "Recorded activity"}</dd>
          </div>
        </dl>

        <div className="detail-block">
          <div className="block-heading">
            <strong>Issue context</strong>
            <span>Observed legislative attention, not ideology or endorsement.</span>
          </div>
          <div className="version-list">
            {activity.issueIds.map((issueId) => {
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
          <details className="detail-disclosure" open>
            <summary>Evidence</summary>
            <div className="detail-disclosure-body">
              <p className="detail-disclosure-copy">
                This activity is source-backed, but the deeper contribution layer for it has not
                been curated yet.
              </p>
              <EvidencePanel evidence={activity.evidence} />
            </div>
          </details>
        </div>
      </section>
    );
  }

  if (!contribution) {
    return null;
  }

  const selectedContribution = contribution;
  const glossaryTerms = getGlossaryTerms(selectedContribution.glossaryTermIds);
  const outcomeSummary = getContributionOutcomeSummary(selectedContribution, bill);

  return (
    <section className="panel detail-panel">
      <div className="eyebrow">Contribution detail</div>
      <h3>{selectedContribution.headline}</h3>

      <div className="outcome-banner">
        <div>
          <span className="label">Contribution outcome</span>
          <strong>{getOutcomeLabel(selectedContribution.outcome)}</strong>
        </div>
        <div>
          <span className="label">Bill outcome</span>
          <strong>{outcomeSummary.billOutcome}</strong>
        </div>
        <div>
          <span className="label">Confidence</span>
          <strong className={`confidence confidence-${selectedContribution.attribution.confidence}`}>
            {getConfidenceLabel(selectedContribution.attribution.confidence)}
          </strong>
        </div>
      </div>

      <div className="detail-block outcome-contrast">
        <div className="outcome-contrast-card">
          <span className="signal-label">This contribution</span>
          <strong>{outcomeSummary.contributionOutcome}</strong>
          <p>{selectedContribution.context.immediateConsequence}</p>
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
          <p>{selectedContribution.headline}</p>
        </section>
        <section className="explanation-card">
          <span className="explanation-label">What did the member actually do?</span>
          <p>{selectedContribution.context.plainEnglishAction}</p>
        </section>
        <section className="explanation-card">
          <span className="explanation-label">What does that mean procedurally?</span>
          <p>{selectedContribution.context.proceduralMeaning}</p>
        </section>
        <section className="explanation-card">
          <span className="explanation-label">What happened because of it?</span>
          <p>{selectedContribution.context.immediateConsequence}</p>
        </section>
        {selectedContribution.context.laterOutcome ? (
          <section className="explanation-card">
            <span className="explanation-label">What happened next?</span>
            <p>{selectedContribution.context.laterOutcome}</p>
          </section>
        ) : null}
        {selectedContribution.context.nextStep ? (
          <section className="explanation-card">
            <span className="explanation-label">What is the next procedural step?</span>
            <p>{selectedContribution.context.nextStep}</p>
          </section>
        ) : null}
      </div>

      <LineageTrack
        title="Legislative path"
        subtitle="The app shows known and unknown stages separately rather than filling gaps with guesses."
        stages={getContributionLineageStages(selectedContribution)}
      />

      <dl className="detail-grid">
        <div>
          <dt>Legislator</dt>
          <dd>{legislator.name}</dd>
        </div>
        <div>
          <dt>Measure</dt>
          <dd>
            {selectedContribution.measure.id} -{" "}
            {selectedContribution.measure.shortTitle ?? selectedContribution.measure.title}
          </dd>
        </div>
        <div>
          <dt>Date</dt>
          <dd>{formatDisplayDate(selectedContribution.date)}</dd>
        </div>
        <div>
          <dt>Venue</dt>
          <dd>{selectedContribution.venue?.name ?? "Unknown"}</dd>
        </div>
        <div>
          <dt>Contribution type</dt>
          <dd>{getContributionTypeLabel(selectedContribution.type)}</dd>
        </div>
        <div>
          <dt>Drafting authorship known</dt>
          <dd>
            {selectedContribution.attribution.literalDraftingKnown === true
              ? "Yes"
              : selectedContribution.attribution.literalDraftingKnown === false
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
          {selectedContribution.issueIds.map((issueId) => {
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
        {selectedContribution.textChange ? (
          <details className="detail-disclosure">
            <summary>Text change snapshot</summary>
            <div className="detail-disclosure-body">
              <p className="detail-disclosure-copy">
                This is shown only where the available record supports a text-change description.
              </p>
              <pre className="diff-card">
                {selectedContribution.textChange.previousText
                  ? `- ${selectedContribution.textChange.previousText}\n+ ${
                      selectedContribution.textChange.proposedText ?? "Proposed text not captured"
                    }`
                  : `+ ${selectedContribution.textChange.proposedText ?? "Proposed text not captured"}`}
                {selectedContribution.textChange.resultingText
                  ? `\n\nResulting text:\n${selectedContribution.textChange.resultingText}`
                  : ""}
              </pre>
              <p className="reconstruction-note">
                Reconstruction method: {selectedContribution.textChange.reconstructionMethod ?? "unknown"}.
                Confidence: {getConfidenceLabel(selectedContribution.textChange.confidence ?? "unknown")}.
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
            <p className="attribution-copy">{selectedContribution.attribution.statement}</p>
            <EvidencePanel evidence={selectedContribution.evidence} />
          </div>
        </details>
      </div>
    </section>
  );
}
