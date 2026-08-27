export type TopLevelView = "overview" | "delegation" | "activity" | "bills" | "issues";

interface TopNavProps {
  activeView: TopLevelView;
  onChange: (view: TopLevelView) => void;
}

const navItems: Array<{ id: TopLevelView; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "delegation", label: "Delegation" },
  { id: "activity", label: "Activity" },
  { id: "bills", label: "Bills" },
  { id: "issues", label: "Issues" },
];

export function TopNav({ activeView, onChange }: TopNavProps) {
  return (
    <div className="top-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`top-nav-button ${
            activeView === item.id ? "top-nav-button-active" : ""
          }`}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
