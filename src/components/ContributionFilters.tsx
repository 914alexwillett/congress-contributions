import type { ContributionFilter } from "../domain/models";

const filterOptions: Array<{ value: ContributionFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "bills", label: "Bills" },
  { value: "amendments", label: "Amendments" },
  { value: "committee", label: "Committee activity" },
  { value: "votes", label: "Votes" },
  { value: "adopted", label: "Adopted" },
  { value: "became_law", label: "Became law" },
];

interface ContributionFiltersProps {
  activeFilter: ContributionFilter;
  onSelect: (filter: ContributionFilter) => void;
}

export function ContributionFilters({
  activeFilter,
  onSelect,
}: ContributionFiltersProps) {
  return (
    <div className="filter-row">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`filter-chip ${
            option.value === activeFilter ? "filter-chip-active" : ""
          }`}
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
