import type { GlossaryTermId } from "../domain/models";

export interface GlossaryTerm {
  id: GlossaryTermId;
  label: string;
  conciseDefinition: string;
  beginnerExplanation: string;
  whyItMatters?: string;
}

export const proceduralGlossary: Record<GlossaryTermId, GlossaryTerm> = {
  markup: {
    id: "markup",
    label: "Markup",
    conciseDefinition: "A committee session where members debate and change a measure.",
    beginnerExplanation:
      "This is where committee members can try to rewrite a bill or amendment before deciding whether to move it forward.",
    whyItMatters:
      "Markup is one of the clearest places to see lawmakers trying to shape legislative text.",
  },
  committee_hearing: {
    id: "committee_hearing",
    label: "Committee hearing",
    conciseDefinition:
      "A committee meeting to gather testimony or examine an issue or proposal.",
    beginnerExplanation:
      "Hearings are usually for information gathering rather than direct text changes, though they can influence later drafts.",
  },
  committee_report: {
    id: "committee_report",
    label: "Committee report",
    conciseDefinition:
      "A formal committee step that sends a measure onward with recommendations or explanation.",
    beginnerExplanation:
      "If a committee reports a bill, it is signaling that the measure is ready to move further in the process.",
  },
  floor_amendment: {
    id: "floor_amendment",
    label: "Floor amendment",
    conciseDefinition:
      "An amendment offered while the full chamber is considering a measure.",
    beginnerExplanation:
      "This is a public attempt to change the text while the House or Senate is debating the bill.",
    whyItMatters:
      "Floor amendments are strong signals of visible text-shaping activity by a member.",
  },
  committee_amendment: {
    id: "committee_amendment",
    label: "Committee amendment",
    conciseDefinition: "An amendment offered during committee consideration.",
    beginnerExplanation:
      "The member is trying to change the bill before it reaches the full chamber.",
  },
  substitute_amendment: {
    id: "substitute_amendment",
    label: "Substitute amendment",
    conciseDefinition:
      "An amendment that proposes replacing a larger portion of the existing text.",
    beginnerExplanation:
      "Instead of tweaking one part, a substitute amendment often swaps in a broader alternative version.",
  },
  motion_to_recommit: {
    id: "motion_to_recommit",
    label: "Motion to recommit",
    conciseDefinition:
      "A House motion to send a bill back before final passage, sometimes with instructions.",
    beginnerExplanation:
      "This is one last chance to delay, change, or return a bill before the House votes on final passage.",
  },
  cloture: {
    id: "cloture",
    label: "Cloture",
    conciseDefinition:
      "A Senate procedure to limit debate and move toward a final vote.",
    beginnerExplanation:
      "Cloture is often the step that determines whether the Senate can stop debate and continue to a decision.",
  },
  unanimous_consent: {
    id: "unanimous_consent",
    label: "Unanimous consent",
    conciseDefinition:
      "An action taken without a formal roll call if no senator objects.",
    beginnerExplanation:
      "If no one objects, the Senate can move faster and approve procedural steps or measures without a recorded vote.",
  },
  final_passage: {
    id: "final_passage",
    label: "Final passage",
    conciseDefinition:
      "The vote on whether the chamber will pass the measure in its current form.",
    beginnerExplanation:
      "This is the main yes-or-no vote on whether the bill or resolution clears that chamber.",
    whyItMatters:
      "It does not show who drafted the text, but it does show whether the member supported the chamber's final version.",
  },
  conference_committee: {
    id: "conference_committee",
    label: "Conference committee",
    conciseDefinition:
      "A process for resolving differences between House and Senate versions.",
    beginnerExplanation:
      "If both chambers pass different versions, negotiators may try to produce one common text.",
  },
  appropriations: {
    id: "appropriations",
    label: "Appropriations",
    conciseDefinition:
      "Legislation providing or adjusting government funding.",
    beginnerExplanation:
      "Appropriations activity is about how federal money is allowed to be spent.",
    whyItMatters:
      "Funding language can have immediate practical effects even when it does not change a permanent law.",
  },
  authorization: {
    id: "authorization",
    label: "Authorization",
    conciseDefinition:
      "Legislation that creates, continues, or defines a program or policy.",
    beginnerExplanation:
      "An authorization often says what a program should do, while appropriations provide the money.",
  },
  cosponsorship: {
    id: "cosponsorship",
    label: "Cosponsorship",
    conciseDefinition:
      "Formal support for a measure introduced by another member.",
    beginnerExplanation:
      "Cosponsoring shows the member chose to publicly support the measure, but it does not necessarily show who drafted it.",
  },
  bill_sponsorship: {
    id: "bill_sponsorship",
    label: "Bill sponsorship",
    conciseDefinition:
      "Formal introduction of a bill or resolution by the sponsoring member.",
    beginnerExplanation:
      "The sponsor is the member officially responsible for introducing the measure into the congressional process.",
  },
  roll_call_vote: {
    id: "roll_call_vote",
    label: "Roll call vote",
    conciseDefinition:
      "A recorded vote showing how each member voted.",
    beginnerExplanation:
      "This is the clearest official source for a member's vote because the chamber records each name and vote position.",
  },
  procedural_vote: {
    id: "procedural_vote",
    label: "Procedural vote",
    conciseDefinition:
      "A vote on process rather than directly on final passage.",
    beginnerExplanation:
      "Procedural votes can still matter a lot because they can determine whether debate continues, whether an amendment is considered, or whether a bill advances.",
  },
};

export const glossaryHighlights: GlossaryTermId[] = [
  "bill_sponsorship",
  "floor_amendment",
  "appropriations",
  "procedural_vote",
  "final_passage",
  "roll_call_vote",
];
