import type { LegislativeContribution } from "../models/legislative";
import {
  formatDisplayDate,
  getOutcomeLabel,
  getTypeLabel,
} from "../utils/contributions";

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
            <span className="type-pill">{getTypeLabel(entry.type)}</span>
            <span className={`outcome-pill outcome-${entry.outcome}`}>
              {getOutcomeLabel(entry.outcome)}
            </span>
          </div>
          <strong>{entry.title}</strong>
          <span className="feed-bill">
            {entry.billOrMeasure.id}: {entry.billOrMeasure.title}
          </span>
          <p>{entry.summary}</p>
        </button>
      ))}
    </div>
  );
}
