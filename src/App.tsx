import { useEffect, useMemo, useState } from "react";
import { BillContextPanel } from "./components/BillContextPanel";
import { ContributionDetail } from "./components/ContributionDetail";
import { DelegationList } from "./components/DelegationList";
import { GlossarySidebar } from "./components/GlossarySidebar";
import { InfluencePanel } from "./components/InfluencePanel";
import { LegislatorOverview } from "./components/LegislatorOverview";
import { ZipLookup } from "./components/ZipLookup";
import { filterContributions } from "./domain/presentation";
import type { ContributionFilter } from "./domain/models";
import {
  getBillForContribution,
  getContributionsByMember,
  getDelegationByZip,
  getRelatedContributionsForMemberAndBill,
  isSupportedZip,
} from "./services/curatedRepository";

const defaultZip = "20852";

function App() {
  const [zip, setZip] = useState(defaultZip);
  const [submittedZip, setSubmittedZip] = useState(defaultZip);
  const [selectedLegislatorId, setSelectedLegislatorId] = useState("");
  const [filter, setFilter] = useState<ContributionFilter>("all");
  const [selectedContributionId, setSelectedContributionId] = useState("");

  const delegation = useMemo(() => getDelegationByZip(submittedZip), [submittedZip]);

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
    () => getContributionsByMember(selectedLegislatorId),
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
  const selectedBill = getBillForContribution(selectedContribution);
  const relatedBillContributions =
    selectedBill && legislator
      ? getRelatedContributionsForMemberAndBill(legislator.id, selectedBill.id)
      : [];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">Congress Contributions</div>
          <p>
            Actions before interpretation. Context before jargon. Evidence before
            scoring. Unknown is an acceptable answer.
          </p>
        </div>
      </header>

      <main className="page-grid">
        <ZipLookup
          value={zip}
          onChange={setZip}
          isSupported={isSupportedZip(zip)}
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
                <div className="detail-column">
                  <ContributionDetail
                    legislator={legislator}
                    contribution={selectedContribution}
                  />
                  <BillContextPanel
                    bill={selectedBill}
                    relatedContributions={relatedBillContributions}
                  />
                  <InfluencePanel
                    legislator={legislator}
                    bill={selectedBill}
                  />
                </div>
              </div>
            ) : null}

            <GlossarySidebar />
          </>
        ) : (
          <section className="panel">
            <h2>ZIP code not yet supported</h2>
            <p>
              This proof of concept intentionally supports only 20852 so the
              delegation and evidence remain easy to inspect.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
