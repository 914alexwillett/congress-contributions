import type { Legislator } from "../domain/models";

interface DelegationListProps {
  legislators: Legislator[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function DelegationList({
  legislators,
  selectedId,
  onSelect,
}: DelegationListProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <div className="eyebrow">Federal delegation</div>
          <h2>20852 resolves to three federal representatives in this POC</h2>
        </div>
      </div>

      <div className="card-grid">
        {legislators.map((legislator) => (
          <button
            key={legislator.id}
            type="button"
            className={`member-card ${
              selectedId === legislator.id ? "member-card-active" : ""
            }`}
            onClick={() => onSelect(legislator.id)}
          >
            <img src={legislator.imageUrl} alt={legislator.name} />
            <div className="member-copy">
              <strong>{legislator.name}</strong>
              <span>{legislator.officeTitle}</span>
              <span>
                {legislator.chamber === "house"
                  ? `${legislator.state} ${legislator.district}`
                  : legislator.state}
              </span>
              <span>
                {legislator.committeeMemberships[0]?.role ?? "Member"} -{" "}
                {legislator.committeeMemberships[0]?.committeeName ??
                  "Committee not loaded"}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
