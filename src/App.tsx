import { useEffect, useMemo, useState } from "react";
import { ContributionDetail } from "./components/ContributionDetail";
import { DelegationList } from "./components/DelegationList";
import { LegislatorOverview } from "./components/LegislatorOverview";
import { ZipLookup } from "./components/ZipLookup";
import { contributions as allContributions } from "./data/contributions";
import { delegationByZip, legislators } from "./data/legislators";
import type { ContributionFilter } from "./models/legislative";
import { filterContributions } from "./utils/contributions";

const defaultZip = "20852";

function App() {
  const [zip, setZip] = useState(defaultZip);
  const [submittedZip, setSubmittedZip] = useState(defaultZip);
  const supportedDelegation = delegationByZip[submittedZip] ?? [];
  const [selectedLegislatorId, setSelectedLegislatorId] = useState(
    supportedDelegation[0] ?? "",
  );
  const [filter, setFilter] = useState<ContributionFilter>("all");
  const [selectedContributionId, setSelectedContributionId] = useState("");

  const delegation = useMemo(
    () =>
      legislators.filter((legislator) => supportedDelegation.includes(legislator.id)),
    [supportedDelegation],
  );

  useEffect(() => {
    if (!delegation.length) {
      setSelectedLegislatorId("");
      return;
    }

    if (!delegation.some((legislator) => legislator.id === selectedLegislatorId)) {
      setSelectedLegislatorId(delegation[0].id);
    }
  }, [delegation, selectedLegislatorId]);

  const legislator = delegation.find((entry) => entry.id === selectedLegislatorId);

  const allLegislatorContributions = useMemo(
    () =>
      allContributions
      .filter((entry) => entry.memberId === selectedLegislatorId)
      .sort((left, right) => right.date.localeCompare(left.date)),
    [selectedLegislatorId],
  );

  const legislatorContributions = useMemo(
    () => filterContributions(allLegislatorContributions, filter),
    [allLegislatorContributions, filter],
  );

  useEffect(() => {
    if (!legislatorContributions.length) {
      setSelectedContributionId("");
      return;
    }

    if (!legislatorContributions.some((entry) => entry.id === selectedContributionId)) {
      setSelectedContributionId(legislatorContributions[0].id);
    }
  }, [legislatorContributions, selectedContributionId]);

  const selectedContribution = legislatorContributions.find(
    (entry) => entry.id === selectedContributionId,
  );

  const isSupported = zip === defaultZip;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">Congress Contributions</div>
          <p>
            Actions before interpretation. Evidence before scoring. Unknown is an
            acceptable answer.
          </p>
        </div>
      </header>

      <main className="page-grid">
        <ZipLookup
          value={zip}
          onChange={setZip}
          isSupported={isSupported}
          onSubmit={() => {
            setSubmittedZip(zip);
            setFilter("all");
          }}
        />

        {delegation.length ? (
          <>
            <DelegationList
              legislators={delegation}
              selectedId={selectedLegislatorId}
              onSelect={(id) => {
                setSelectedLegislatorId(id);
                setFilter("all");
              }}
            />

            {legislator ? (
              <div className="workspace-grid">
                <LegislatorOverview
                  legislator={legislator}
                  contributions={allLegislatorContributions}
                  visibleContributions={legislatorContributions}
                  selectedContributionId={selectedContributionId}
                  activeFilter={filter}
                  onFilterChange={setFilter}
                  onContributionSelect={setSelectedContributionId}
                />
                <ContributionDetail
                  legislator={legislator}
                  contribution={selectedContribution}
                />
              </div>
            ) : null}
          </>
        ) : (
          <section className="panel">
            <h2>ZIP code not yet supported</h2>
            <p>
              This proof of concept intentionally supports only 20852 so the
              evidence and delegation mapping stay narrow and inspectable.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
