import type { BillContext } from "../domain/models";
import { formatDisplayDate, getOutcomeLabel } from "../domain/presentation";

interface ActiveBillsPanelProps {
  items: Array<{
    bill: BillContext;
    relatedContributionCount: number;
    memberNames: string[];
    latestDate?: string;
  }>;
  selectedBillId?: string;
  onSelect: (billId: string) => void;
}

export function ActiveBillsPanel({
  items,
  selectedBillId,
  onSelect,
}: ActiveBillsPanelProps) {
  return (
    <section className="panel">
      <div className="eyebrow">Active bills</div>
      <h2>Measures where your delegation has observable activity</h2>
      <div className="bill-grid">
        {items.map((item) => (
          <button
            key={item.bill.id}
            type="button"
            className={`bill-card ${selectedBillId === item.bill.id ? "bill-card-active" : ""}`}
            onClick={() => onSelect(item.bill.id)}
          >
            <span className="type-pill">{item.bill.measure.id}</span>
            <strong>{item.bill.measure.shortTitle ?? item.bill.measure.title}</strong>
            <p>{item.bill.broadPurpose}</p>
            <div className="bill-card-meta">
              <span>{item.relatedContributionCount} delegation records</span>
              <span>{getOutcomeLabel(item.bill.legislativeState)}</span>
              <span>
                {item.latestDate ? `Latest action in app: ${formatDisplayDate(item.latestDate)}` : "Latest date unknown"}
              </span>
            </div>
            <div className="member-mini-list">{item.memberNames.join(", ")}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
