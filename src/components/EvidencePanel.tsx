import { getSourceRecordById } from "../services/curatedRepository";
import type { EvidenceReference } from "../domain/models";

interface EvidencePanelProps {
  title?: string;
  evidence: EvidenceReference[];
}

export function EvidencePanel({
  title = "Why are we saying this?",
  evidence,
}: EvidencePanelProps) {
  return (
    <details className="evidence-panel" open>
      <summary>{title}</summary>
      <p>
        These links are the source trail behind the claim. The app translates the
        record into plain language, but the user should still be able to inspect
        the underlying official material directly.
      </p>
      <ul className="evidence-list">
        {evidence.map((source) => {
          const sourceRecord = source.sourceRecordId
            ? getSourceRecordById(source.sourceRecordId)
            : undefined;

          return (
            <li key={`${source.url}-${source.label}`}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.label}
              </a>
              <strong>{source.supports}</strong>
              <span>
                {source.sourceType.replaceAll("_", " ")}
                {sourceRecord ? ` - retrieved ${sourceRecord.retrievedAt}` : ""}
              </span>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
