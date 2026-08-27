interface LineageTrackProps {
  title: string;
  subtitle: string;
  stages: Array<{
    label: string;
    reached: boolean | null;
  }>;
}

export function LineageTrack({ title, subtitle, stages }: LineageTrackProps) {
  return (
    <section className="detail-block">
      <div className="block-heading">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
      <div className="lineage-row">
        {stages.map((stage) => (
          <div
            key={stage.label}
            className={`lineage-stage ${
              stage.reached === true
                ? "lineage-yes"
                : stage.reached === false
                  ? "lineage-no"
                  : "lineage-unknown"
            }`}
          >
            <span>{stage.label}</span>
            <strong>
              {stage.reached === true
                ? "Yes"
                : stage.reached === false
                  ? "No"
                  : "Unknown"}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}
