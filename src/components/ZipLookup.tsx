interface ZipLookupProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSupported: boolean;
}

export function ZipLookup({
  value,
  onChange,
  onSubmit,
  isSupported,
}: ZipLookupProps) {
  return (
    <section className="panel hero-panel">
      <div className="eyebrow">Proof of concept</div>
      <h1>What did your representative actually do to shape legislation?</h1>
      <p className="hero-copy">
        This demo follows a narrow, evidence-first path from ZIP code to
        delegation, then from legislator to documented sponsorships and text
        changes. Every substantial claim is paired with an official source.
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

      <p className={`lookup-hint ${isSupported ? "supported" : "unsupported"}`}>
        {isSupported
          ? "POC support is currently limited to ZIP code 20852."
          : "This prototype currently supports only ZIP code 20852."}
      </p>
    </section>
  );
}
