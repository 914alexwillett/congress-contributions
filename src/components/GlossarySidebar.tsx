import { glossaryHighlights, proceduralGlossary } from "../glossary/terms";

export function GlossarySidebar() {
  return (
    <section className="panel glossary-panel">
      <div className="eyebrow">Shared glossary</div>
      <h3>Teach through consistent structure</h3>
      <p className="detail-summary">
        These explanations are centralized so the app can stay beginner-friendly
        without changing its interface based on who is using it.
      </p>
      <div className="glossary-grid">
        {glossaryHighlights.map((termId) => {
          const term = proceduralGlossary[termId];

          return (
            <article key={term.id} className="glossary-card">
              <strong>{term.label}</strong>
              <p>{term.conciseDefinition}</p>
              <span>{term.whyItMatters ?? term.beginnerExplanation}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
