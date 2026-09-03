import { useState } from "react";
import type { Legislator } from "../domain/models";

interface LegislatorPortraitProps {
  legislator: Legislator;
  className?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function LegislatorPortrait({
  legislator,
  className = "",
}: LegislatorPortraitProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !legislator.imageUrl) {
    return (
      <div
        className={`portrait-fallback ${className}`.trim()}
        aria-label={`${legislator.name} portrait unavailable`}
        role="img"
      >
        <span>{getInitials(legislator.name)}</span>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={legislator.imageUrl}
      alt={legislator.name}
      onError={() => setHasError(true)}
    />
  );
}
