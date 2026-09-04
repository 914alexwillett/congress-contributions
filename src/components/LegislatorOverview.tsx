import type {
  ContributionFilter,
  LegislativeContribution,
  Legislator,
} from "../domain/models";
import { getContributionCounts } from "../domain/presentation";
import { ContributionFilters } from "./ContributionFilters";
import { ContributionList } from "./ContributionList";
import { LegislatorPortrait } from "./LegislatorPortrait";

interface LegislatorOverviewProps {
  legislator: Legislator;
  activityCount: number;
  contributions: LegislativeContribution[];
  visibleContributions: LegislativeContribution[];
  selectedContributionId: string;
  activeFilter: ContributionFilter;
  onFilterChange: (filter: ContributionFilter) => void;
  onContributionSelect: (id: string) => void;
}

export function LegislatorOverview({
  legislator,
  activityCount,
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
        <LegislatorPortrait legislator={legislator} />
        <div>
          <div className="eyebrow">Member overview</div>
          <h2>{legislator.name}</h2>
          <p>
            {legislator.officeTitle} -{" "}
            {legislator.chamber === "house"
              ? `${legislator.state} ${legislator.district}`
              : legislator.state}
          </p>
          <p className="bio-copy">{legislator.bio}</p>
        </div>
      </div>

      <div className="stats-grid">
        <article>
          <span>Activity records</span>
          <strong>{activityCount}</strong>
        </article>
        <article>
          <span>Deep contributions</span>
          <strong>{counts.total}</strong>
        </article>
        <article>
          <span>Bill sponsorships</span>
          <strong>{counts.bills}</strong>
        </article>
        <article>
          <span>Amendments</span>
          <strong>{counts.amendments}</strong>
        </article>
        <article>
          <span>Recorded votes</span>
          <strong>{counts.votes}</strong>
        </article>
        <article>
          <span>Adopted</span>
          <strong>{counts.adopted}</strong>
        </article>
      </div>

      <div className="detail-block">
        <div className="block-heading">
          <strong>Current committee memberships</strong>
          <span>Drawn from official member office pages or chamber records.</span>
        </div>
        {legislator.committeeMemberships.length ? (
          <ul className="committee-list">
            {legislator.committeeMemberships.map((committee) => (
              <li key={committee.committeeName}>
                <strong>{committee.role}</strong> - {committee.committeeName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="bio-copy">
            Committee context is not yet loaded for this member in the current curated slice.
          </p>
        )}
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
