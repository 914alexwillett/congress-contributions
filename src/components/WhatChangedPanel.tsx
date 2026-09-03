import type { DelegationChangeSummary } from "../domain/models";

interface WhatChangedPanelProps {
  summary: DelegationChangeSummary;
}

export function WhatChangedPanel({ summary }: WhatChangedPanelProps) {
  return (
    <section className="panel">
      <div className="eyebrow">What changed</div>
      <h2>Recent movement in the loaded congressional record</h2>
      <p className="detail-summary">
        This is derived from the current curated dataset rather than user-behavior
        tracking. It summarizes changes in Congress, not changes in the user.
      </p>

      <div className="change-grid">
        <article className="change-card">
          <strong>{summary.totalRecentActions}</strong>
          <span>recent delegation actions</span>
        </article>
        <article className="change-card">
          <strong>{summary.introducedBills}</strong>
          <span>bills introduced</span>
        </article>
        <article className="change-card">
          <strong>{summary.cosponsorshipsAdded}</strong>
          <span>cosponsorships added</span>
        </article>
        <article className="change-card">
          <strong>{summary.committeeAdvances}</strong>
          <span>committee-linked advances</span>
        </article>
        <article className="change-card">
          <strong>{summary.floorVotes}</strong>
          <span>floor votes in the loaded record</span>
        </article>
        <article className="change-card">
          <strong>{summary.billOutcomeChanges}</strong>
          <span>bills currently at chamber passage or law</span>
        </article>
      </div>
    </section>
  );
}
