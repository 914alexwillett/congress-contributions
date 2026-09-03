import type { ConstituentArea } from "../domain/models";

interface ZipLookupProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSupported: boolean;
  supportedAreas: ConstituentArea[];
  activeAreaZip?: string;
  onSelectArea: (zip: string) => void;
}

export function ZipLookup({
  value,
  onChange,
  onSubmit,
  isSupported,
  supportedAreas,
  activeAreaZip,
  onSelectArea,
}: ZipLookupProps) {
  return (
    <section className="panel hero-panel">
      <div className="eyebrow">Proof of concept</div>
      <h1>What did your representative actually do in Congress?</h1>
      <p className="hero-copy">
        This demo turns official congressional records into plain-language civic
        context without turning them into opinion. It leads with what happened,
        what the member did, what that means procedurally, what happened next,
        and which official records support that explanation.
      </p>

      <div className="lookup-row">
        <label className="field">
          <span>ZIP code</span>
          <input
            value={value}
            maxLength={5}
            onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))}
            placeholder="20852"
          />
        </label>

        <button type="button" onClick={onSubmit}>
          Find my delegation
        </button>
      </div>

      <div className="supported-areas">
        <span className="supported-areas-label">Try a supported constituent area</span>
        <div className="supported-area-grid">
          {supportedAreas.map((area) => (
            <button
              key={area.zip}
              type="button"
              className={`supported-area-card ${
                activeAreaZip === area.zip ? "supported-area-card-active" : ""
              }`}
              onClick={() => onSelectArea(area.zip)}
            >
              <strong>{area.label}</strong>
              <span>{area.zip}</span>
              <p>{area.summary}</p>
            </button>
          ))}
        </div>
      </div>

      <p className={`lookup-hint ${isSupported ? "supported" : "unsupported"}`}>
        {isSupported
          ? `Current POC support includes ${supportedAreas
              .map((area) => `${area.zip} (${area.city}, ${area.state})`)
              .join(" and ")}.`
          : `Supported ZIP codes currently include ${supportedAreas
              .map((area) => area.zip)
              .join(" and ")}.`}
      </p>
    </section>
  );
}
