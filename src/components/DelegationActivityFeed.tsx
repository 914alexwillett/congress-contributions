import type { LegislativeContribution } from "../domain/models";
import {
  formatDisplayDate,
  getContributionTypeLabel,
  getOutcomeLabel,
  getOutcomeTone,
  getRelativeTimeLabel,
} from "../domain/presentation";
import { getMemberById } from "../services/curatedRepository";

interface DelegationActivityFeedProps {
  title: string;
  subtitle: string;
  contributions: LegislativeContribution[];
  selectedContributionId: string;
  onSelect: (id: string) => void;
}

export function DelegationActivityFeed({
  title,
  subtitle,
  contributions,
  selectedContributionId,
  onSelect,
}: DelegationActivityFeedProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div className="eyebrow">Delegation activity</div>
        <h2>{title}</h2>
        <p className="detail-summary">{subtitle}</p>
      </div>

      <div className="activity-feed">
        {contributions.map((contribution) => {
          const member = getMemberById(contribution.memberId);

          return (
            <button
              key={contribution.id}
              type="button"
              className={`activity-item ${
                selectedContributionId === contribution.id ? "activity-item-active" : ""
              }`}
              onClick={() => onSelect(contribution.id)}
            >
              <div className="activity-topline">
                <span className="activity-member">{member?.name ?? "Member"}</span>
                <span className="activity-relative">
                  {getRelativeTimeLabel(contribution.date)}
                </span>
              </div>
              <strong>{contribution.headline}</strong>
              <p>{contribution.context.proceduralMeaning}</p>
              <div className="activity-meta">
                <span>{formatDisplayDate(contribution.date)}</span>
                <span>{getContributionTypeLabel(contribution.type)}</span>
                <span className={`activity-outcome tone-${getOutcomeTone(contribution.outcome)}`}>
                  {getOutcomeLabel(contribution.outcome)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
