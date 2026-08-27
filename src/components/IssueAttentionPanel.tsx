interface IssueAttentionPanelProps {
  items: Array<{
    issue: {
      id: string;
      label: string;
      description: string;
    };
    count: number;
  }>;
  activeIssueId?: string;
  onSelect: (issueId: string) => void;
}

export function IssueAttentionPanel({
  items,
  activeIssueId,
  onSelect,
}: IssueAttentionPanelProps) {
  return (
    <section className="panel">
      <div className="eyebrow">Legislative attention</div>
      <h2>What subjects appear most in the current delegation record?</h2>
      <div className="issue-grid">
        {items.map(({ issue, count }) => (
          <button
            key={issue.id}
            type="button"
            className={`issue-card ${activeIssueId === issue.id ? "issue-card-active" : ""}`}
            onClick={() => onSelect(issue.id)}
          >
            <strong>{issue.label}</strong>
            <span>{count} related actions</span>
            <p>{issue.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
