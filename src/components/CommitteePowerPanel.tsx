import type { CommitteeContext, LegislativeContribution, Legislator } from "../domain/models";

interface CommitteePowerPanelProps {
  legislator: Legislator;
  items: Array<{
    membership: Legislator["committeeMemberships"][number];
    committee?: CommitteeContext;
    relatedContributions: LegislativeContribution[];
  }>;
  onSelectContribution: (id: string) => void;
}

export function CommitteePowerPanel({
  legislator,
  items,
  onSelectContribution,
}: CommitteePowerPanelProps) {
  return (
    <section className="panel">
      <div className="eyebrow">Committee power</div>
      <h2>Why this member's institutional position matters</h2>
      <p className="detail-summary">
        Committee assignments shape where a member can influence legislation
        before the full chamber acts. These cards connect structure to observable action.
      </p>

      {items.length ? (
        <div className="committee-context-grid">
          {items.map(({ membership, committee, relatedContributions }) =>
            committee ? (
              <article key={committee.id} className="committee-context-card">
                <div className="committee-context-top">
                  <strong>{committee.name}</strong>
                  <span>{membership.role}</span>
                </div>
                <p>{committee.purpose}</p>
                <p className="committee-why">{committee.whyItMatters}</p>
                <ul className="committee-list">
                  {committee.responsibilities.map((responsibility) => (
                    <li key={responsibility}>{responsibility}</li>
                  ))}
                </ul>
                {relatedContributions.length ? (
                  <div className="committee-recent">
                    <span>Recent activity here</span>
                    {relatedContributions.slice(0, 2).map((contribution) => (
                      <button
                        key={contribution.id}
                        type="button"
                        className="committee-activity-link"
                        onClick={() => onSelectContribution(contribution.id)}
                      >
                        {contribution.headline}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="committee-recent">
                    <span>No linked contribution records are loaded yet for {legislator.name} in this committee context.</span>
                  </div>
                )}
              </article>
            ) : null,
          )}
        </div>
      ) : (
        <p className="detail-summary">
          Committee-power context is not yet loaded for this member in the current curated dataset.
        </p>
      )}
    </section>
  );
}
