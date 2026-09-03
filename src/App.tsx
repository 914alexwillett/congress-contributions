import { useEffect, useMemo, useState } from "react";
import { ActiveBillsPanel } from "./components/ActiveBillsPanel";
import { BillContextPanel } from "./components/BillContextPanel";
import { CommitteePowerPanel } from "./components/CommitteePowerPanel";
import { ContributionDetail } from "./components/ContributionDetail";
import { DelegationActivityFeed } from "./components/DelegationActivityFeed";
import { DelegationList } from "./components/DelegationList";
import { GlossarySidebar } from "./components/GlossarySidebar";
import { InfluencePanel } from "./components/InfluencePanel";
import { IssueAttentionPanel } from "./components/IssueAttentionPanel";
import { LegislatorOverview } from "./components/LegislatorOverview";
import { TopNav, type TopLevelView } from "./components/TopNav";
import { WhatChangedPanel } from "./components/WhatChangedPanel";
import { ZipLookup } from "./components/ZipLookup";
import {
  buildActiveBillSummaries,
  buildCommitteePowerSummaries,
  buildDelegationChangeSummary,
  buildIssueAttention,
  filterContributions,
} from "./domain/presentation";
import type { ContributionFilter } from "./domain/models";
import {
  getBillById,
  getBillForContribution,
  getBillsForDelegation,
  getCommitteesById,
  getConstituentAreaByZip,
  getContributionsByMember,
  getContributionsForDelegation,
  getDelegationByZip,
  getIssuesById,
  getMembersById,
  getRelatedContributionsForMemberAndBill,
  getSupportedConstituentAreas,
  isSupportedZip,
} from "./services/curatedRepository";

const supportedAreas = getSupportedConstituentAreas();
const defaultZip = supportedAreas[0]?.zip ?? "";

function App() {
  const [zip, setZip] = useState(defaultZip);
  const [submittedZip, setSubmittedZip] = useState(defaultZip);
  const [activeView, setActiveView] = useState<TopLevelView>("overview");
  const [selectedLegislatorId, setSelectedLegislatorId] = useState("");
  const [selectedContributionId, setSelectedContributionId] = useState("");
  const [selectedBillId, setSelectedBillId] = useState("");
  const [activeIssueId, setActiveIssueId] = useState("");
  const [memberFilter, setMemberFilter] = useState<ContributionFilter>("all");

  const selectedArea = getConstituentAreaByZip(submittedZip);
  const delegation = useMemo(() => getDelegationByZip(submittedZip), [submittedZip]);
  const delegationMemberIds = delegation.map((member) => member.id);
  const membersById = getMembersById();
  const issuesById = getIssuesById();
  const committeesById = getCommitteesById();

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

  const allDelegationContributions = useMemo(
    () => getContributionsForDelegation(delegationMemberIds),
    [submittedZip, delegationMemberIds.join(",")],
  );

  const allDelegationBills = useMemo(
    () => getBillsForDelegation(delegationMemberIds),
    [submittedZip, delegationMemberIds.join(",")],
  );

  const allLegislatorContributions = useMemo(
    () => getContributionsByMember(selectedLegislatorId),
    [selectedLegislatorId],
  );

  const visibleMemberContributions = useMemo(
    () => filterContributions(allLegislatorContributions, memberFilter),
    [allLegislatorContributions, memberFilter],
  );

  useEffect(() => {
    if (!allDelegationContributions.length) {
      setSelectedContributionId("");
      return;
    }

    if (!allDelegationContributions.some((entry) => entry.id === selectedContributionId)) {
      const defaultContribution = allDelegationContributions[0];
      setSelectedContributionId(defaultContribution.id);
      setSelectedBillId(defaultContribution.measureId);
    }
  }, [allDelegationContributions, selectedContributionId]);

  useEffect(() => {
    if (!allDelegationBills.length) {
      setSelectedBillId("");
      return;
    }

    if (!allDelegationBills.some((bill) => bill.id === selectedBillId)) {
      setSelectedBillId(allDelegationBills[0].id);
    }
  }, [allDelegationBills, selectedBillId]);

  const selectedContribution = allDelegationContributions.find(
    (entry) => entry.id === selectedContributionId,
  );

  useEffect(() => {
    if (selectedContribution) {
      setSelectedLegislatorId(selectedContribution.memberId);
      setSelectedBillId(selectedContribution.measureId);
    }
  }, [selectedContribution?.id]);

  const selectedBill =
    (selectedBillId ? getBillById(selectedBillId) : undefined) ??
    getBillForContribution(selectedContribution);

  const memberBillContributions =
    selectedBill && legislator
      ? getRelatedContributionsForMemberAndBill(legislator.id, selectedBill.id)
      : [];

  const delegationBillContributions = selectedBill
    ? allDelegationContributions.filter((entry) => entry.measureId === selectedBill.id)
    : [];

  const recentDelegationActivity = allDelegationContributions.slice(0, 7);
  const changeSummary = buildDelegationChangeSummary(
    allDelegationContributions,
    allDelegationBills,
  );
  const issueAttention = buildIssueAttention(allDelegationContributions, issuesById);
  const activeBills = buildActiveBillSummaries(
    allDelegationBills,
    allDelegationContributions,
    membersById,
  );
  const activeIssueContributions = activeIssueId
    ? allDelegationContributions.filter((entry) => entry.issueIds.includes(activeIssueId))
    : allDelegationContributions.slice(0, 5);
  const committeePower = legislator
    ? buildCommitteePowerSummaries(
        legislator,
        committeesById,
        allLegislatorContributions,
      )
    : [];

  const selectContribution = (contributionId: string) => {
    const contribution = allDelegationContributions.find(
      (entry) => entry.id === contributionId,
    );

    if (!contribution) {
      return;
    }

    setSelectedContributionId(contribution.id);
    setSelectedLegislatorId(contribution.memberId);
    setSelectedBillId(contribution.measureId);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">Congress Contributions V3</div>
          <p>
            A civic evidence interface for making political representation
            observable between elections. The goal is not to score politicians,
            but to help citizens see ongoing legislative action, context,
            consequences, and evidence.
          </p>
        </div>
      </header>

      <main className="page-grid">
        <ZipLookup
          value={zip}
          onChange={setZip}
          isSupported={isSupportedZip(zip)}
          supportedAreas={supportedAreas}
          activeAreaZip={selectedArea?.zip}
          onSelectArea={(nextZip) => {
            setZip(nextZip);
            setSubmittedZip(nextZip);
            setActiveView("overview");
            setSelectedContributionId("");
            setSelectedBillId("");
            setActiveIssueId("");
            setMemberFilter("all");
          }}
          onSubmit={() => {
            setSubmittedZip(zip);
            setActiveView("overview");
            setSelectedContributionId("");
            setSelectedBillId("");
            setActiveIssueId("");
            setMemberFilter("all");
          }}
        />

        {delegation.length ? (
          <>
            <TopNav activeView={activeView} onChange={setActiveView} />

            <section className="panel summary-hero">
              <div>
                <div className="eyebrow">Your federal delegation</div>
                <h2>
                  {selectedArea
                    ? `${selectedArea.city}, ${selectedArea.state}`
                    : "Representation should be understandable between elections"}
                </h2>
                <p className="detail-summary">
                  {selectedArea
                    ? `This constituent view emphasizes ongoing congressional activity, what changed, which bills are moving, what issues are receiving attention, and which institutional positions shape influence for ${selectedArea.city}.`
                    : "This view emphasizes ongoing congressional activity, what changed, what bills are moving, what issues are receiving attention, and which institutional positions shape influence."}
                </p>
              </div>
              <div className="summary-hero-stats">
                <article>
                  <strong>{delegation.length}</strong>
                  <span>federal representatives</span>
                </article>
                <article>
                  <strong>{allDelegationContributions.length}</strong>
                  <span>loaded actions</span>
                </article>
                <article>
                  <strong>{allDelegationBills.length}</strong>
                  <span>active measures</span>
                </article>
              </div>
            </section>

            {(activeView === "overview" || activeView === "delegation") && (
              <DelegationList
                legislators={delegation}
                areaLabel={selectedArea?.label ?? submittedZip}
                selectedId={selectedLegislatorId}
                onSelect={(id) => {
                  setSelectedLegislatorId(id);
                  setActiveView("delegation");
                }}
              />
            )}

            {activeView === "overview" ? (
              <>
                <WhatChangedPanel summary={changeSummary} />
                <div className="workspace-grid">
                  <DelegationActivityFeed
                    title="Recent legislative activity"
                    subtitle="Structured congressional actions from your House member and senators, not a generic political news feed."
                    contributions={recentDelegationActivity}
                    selectedContributionId={selectedContributionId}
                    onSelect={selectContribution}
                  />
                  <div className="detail-column">
                    {legislator ? (
                      <ContributionDetail
                        legislator={legislator}
                        contribution={selectedContribution}
                        bill={selectedBill}
                      />
                    ) : null}
                  </div>
                </div>

                <ActiveBillsPanel
                  items={activeBills}
                  selectedBillId={selectedBill?.id}
                  onSelect={(billId) => {
                    setSelectedBillId(billId);
                    setActiveView("bills");
                  }}
                />

                <IssueAttentionPanel
                  items={issueAttention}
                  activeIssueId={activeIssueId}
                  onSelect={(issueId) => {
                    setActiveIssueId(issueId);
                    setActiveView("issues");
                  }}
                />
              </>
            ) : null}

            {activeView === "delegation" && legislator ? (
              <>
                <div className="workspace-grid">
                  <LegislatorOverview
                    legislator={legislator}
                    contributions={allLegislatorContributions}
                    visibleContributions={visibleMemberContributions}
                    selectedContributionId={selectedContributionId}
                    activeFilter={memberFilter}
                    onFilterChange={setMemberFilter}
                    onContributionSelect={selectContribution}
                  />
                  <div className="detail-column">
                    <ContributionDetail
                      legislator={legislator}
                      contribution={selectedContribution}
                      bill={selectedBill}
                    />
                    <BillContextPanel
                      bill={selectedBill}
                      relatedContributions={memberBillContributions}
                      scopeLabel={legislator.name}
                    />
                    <InfluencePanel
                      legislator={legislator}
                      bill={selectedBill}
                    />
                  </div>
                </div>

                <CommitteePowerPanel
                  legislator={legislator}
                  items={committeePower}
                  onSelectContribution={selectContribution}
                />
              </>
            ) : null}

            {activeView === "activity" ? (
              <div className="workspace-grid">
                <DelegationActivityFeed
                  title="All delegation activity"
                  subtitle="A chronological view of structured congressional actions by your delegation."
                  contributions={allDelegationContributions}
                  selectedContributionId={selectedContributionId}
                  onSelect={selectContribution}
                />
                <div className="detail-column">
                  {legislator ? (
                    <ContributionDetail
                      legislator={legislator}
                      contribution={selectedContribution}
                      bill={selectedBill}
                    />
                  ) : null}
                  <BillContextPanel
                    bill={selectedBill}
                    relatedContributions={delegationBillContributions}
                    scopeLabel="your delegation"
                  />
                </div>
              </div>
            ) : null}

            {activeView === "bills" ? (
              <div className="workspace-grid">
                <ActiveBillsPanel
                  items={activeBills}
                  selectedBillId={selectedBill?.id}
                  onSelect={setSelectedBillId}
                />
                <div className="detail-column">
                  <BillContextPanel
                    bill={selectedBill}
                    relatedContributions={delegationBillContributions}
                    scopeLabel="your delegation"
                  />
                </div>
              </div>
            ) : null}

            {activeView === "issues" ? (
              <>
                <IssueAttentionPanel
                  items={issueAttention}
                  activeIssueId={activeIssueId}
                  onSelect={setActiveIssueId}
                />
                <div className="workspace-grid">
                  <DelegationActivityFeed
                    title={
                      activeIssueId && issuesById[activeIssueId]
                        ? `${issuesById[activeIssueId].label} activity`
                        : "Issue-linked activity"
                    }
                    subtitle="Observed legislative attention in the current dataset, not ideology or preference."
                    contributions={activeIssueContributions}
                    selectedContributionId={selectedContributionId}
                    onSelect={selectContribution}
                  />
                  <div className="detail-column">
                    {legislator ? (
                      <ContributionDetail
                        legislator={legislator}
                        contribution={selectedContribution}
                        bill={selectedBill}
                      />
                    ) : null}
                  </div>
                </div>
              </>
            ) : null}

            <GlossarySidebar />
          </>
        ) : (
          <section className="panel">
            <h2>ZIP code not yet supported</h2>
            <p>
              This proof of concept currently supports a small set of curated
              constituent areas so the delegation and evidence remain easy to inspect.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
