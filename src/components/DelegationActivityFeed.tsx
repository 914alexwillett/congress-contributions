import type { ActivityRecord } from "../domain/models";
import {
  getActivityTypeLabel,
  formatDisplayDate,
  getRelativeTimeLabel,
} from "../domain/presentation";
import { congressDataRepository } from "../services/congressDataRepository";

interface DelegationActivityFeedProps {
  title: string;
  subtitle: string;
  activities: ActivityRecord[];
  selectedActivityId: string;
  onSelect: (id: string) => void;
}

export function DelegationActivityFeed({
  title,
  subtitle,
  activities,
  selectedActivityId,
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
        {activities.map((activity) => {
          const member = congressDataRepository.getMemberById(activity.memberId);

          return (
            <button
              key={activity.id}
              type="button"
              className={`activity-item ${
                selectedActivityId === activity.id ? "activity-item-active" : ""
              }`}
              onClick={() => onSelect(activity.id)}
            >
              <div className="activity-topline">
                <span className="activity-member">{member?.name ?? "Member"}</span>
                <span className="activity-relative">
                  {getRelativeTimeLabel(activity.date)}
                </span>
              </div>
              <strong>{activity.headline}</strong>
              <p>{activity.summary}</p>
              <div className="activity-meta">
                <span>{formatDisplayDate(activity.date)}</span>
                <span>{getActivityTypeLabel(activity.type)}</span>
                {activity.outcomeLabel ? (
                  <span className="activity-outcome tone-neutral">
                    {activity.outcomeLabel}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
