import type {
  ContributionFilter,
  LegislativeContribution,
  Legislator,
} from "../models/legislative";
import { getContributionCounts } from "../utils/contributions";
import { ContributionFilters } from "./ContributionFilters";
import { ContributionList } from "./ContributionList";

interface LegislatorOverviewProps {
  legislator: Legislator;
  contributions: LegislativeContribution[];
  visibleContributions: LegislativeContribution[];
  selectedContributionId: string;
  activeFilter: ContributionFilter;
  onFilterChange: (filter: ContributionFilter) => void;
  onContributionSelect: (id: string) => void;
}

export function LegislatorOverview({
  legislator,
  contributions,
  visibleContributions,
  selectedContributionId,
  activeFilter,
  onFilterChange,
  onContributionSelect,
}: LegislatorOverviewProps) {
  const counts = getContributionCounts(contributions);

  return (
    <section className="panel">
      <div className="legislator-header">
        <img src={legislator.imageUrl} alt={legislator.name} />
        <div>
          <div className="eyebrow">Legislator overview</div>
          <h2>{legislator.name}</h2>
          <p>
            {legislator.officeTitle} ·{" "}
            {legislator.chamber === "house"
              ? `${legislator.state} ${legislator.district}`
              : legislator.state}
          </p>
          <p className="bio-copy">{legislator.bio}</p>
        </div>
      </div>

      <div className="stats-grid">
        <article>
          <span>Total seeded records</span>
          <strong>{counts.total}</strong>
        </article>
        <article>
          <span>Bill sponsorships</span>
          <strong>{counts.bills}</strong>
        </article>
        <article>
          <span>Amendment records</span>
          <strong>{counts.amendments}</strong>
        </article>
        <article>
          <span>Adopted in seed data</span>
          <strong>{counts.adopted}</strong>
        </article>
      </div>

      <ContributionFilters
        activeFilter={activeFilter}
        onSelect={onFilterChange}
      />

      <ContributionList
        entries={visibleContributions}
        selectedId={selectedContributionId}
        onSelect={onContributionSelect}
      />
    </section>
  );
}
