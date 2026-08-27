import type { LegislativeContribution } from "../domain/models";
import {
  formatDisplayDate,
  getContributionTypeLabel,
  getOutcomeLabel,
} from "../domain/presentation";

interface ContributionListProps {
  entries: LegislativeContribution[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ContributionList({
  entries,
  selectedId,
  onSelect,
}: ContributionListProps) {
  return (
    <div className="feed">
      {entries.map((entry) => (
        <button
          key={entry.id}
          type="button"
          className={`feed-item ${selectedId === entry.id ? "feed-item-active" : ""}`}
          onClick={() => onSelect(entry.id)}
        >
          <div className="feed-item-top">
            <span className="date-pill">{formatDisplayDate(entry.date)}</span>
            <span className="type-pill">{getContributionTypeLabel(entry.type)}</span>
            <span className={`outcome-pill outcome-${entry.outcome}`}>
              {getOutcomeLabel(entry.outcome)}
            </span>
          </div>
          <strong>{entry.headline}</strong>
          <span className="feed-bill">
            {entry.measure.id}: {entry.measure.shortTitle ?? entry.measure.title}
          </span>
          <p>{entry.context.plainEnglishAction}</p>
        </button>
      ))}
    </div>
  );
}
