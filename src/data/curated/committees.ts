import type { CommitteeContext } from "../../domain/models";

export const curatedCommittees: CommitteeContext[] = [
  {
    id: "house-judiciary",
    chamber: "house",
    name: "House Committee on the Judiciary",
    purpose:
      "Handles legislation involving the Constitution, civil liberties, immigration, courts, antitrust, and aspects of criminal law.",
    whyItMatters:
      "Judiciary members can shape major constitutional, oversight, and legal-policy bills before they reach the House floor.",
    responsibilities: [
      "Civil liberties and constitutional questions",
      "Federal courts and judicial administration",
      "Parts of criminal and immigration law",
    ],
    sourceRecordIds: ["source-raskin-committees", "source-house-clerk-raskin"],
  },
  {
    id: "senate-appropriations",
    chamber: "senate",
    name: "Senate Appropriations Committee",
    purpose:
      "Writes and negotiates annual federal spending legislation and related funding provisions.",
    whyItMatters:
      "Appropriators have unusual influence over how federal money is allowed to flow and which restrictions are attached.",
    responsibilities: [
      "Annual federal spending bills",
      "Continuing resolutions",
      "Funding restrictions and directives",
    ],
    sourceRecordIds: ["source-vanhollen-about"],
  },
  {
    id: "senate-foreign-relations",
    chamber: "senate",
    name: "Senate Foreign Relations Committee",
    purpose:
      "Handles foreign policy legislation, treaties, diplomatic matters, and oversight of foreign affairs.",
    whyItMatters:
      "This committee shapes how the Senate approaches foreign policy and international commitments.",
    responsibilities: [
      "Foreign policy legislation",
      "Treaties and diplomatic nominations",
      "Oversight of international affairs",
    ],
    sourceRecordIds: ["source-vanhollen-about"],
  },
  {
    id: "senate-banking",
    chamber: "senate",
    name: "Senate Banking, Housing, and Urban Affairs Committee",
    purpose:
      "Handles banking, housing, financial regulation, urban affairs, and related market oversight.",
    whyItMatters:
      "Members here can shape financial-regulation bills before they move through the Senate.",
    responsibilities: [
      "Banking and financial regulation",
      "Housing and urban affairs",
      "Market and digital asset oversight",
    ],
    sourceRecordIds: ["source-vanhollen-about", "source-alsobrooks-about"],
  },
  {
    id: "senate-budget",
    chamber: "senate",
    name: "Senate Budget Committee",
    purpose:
      "Handles congressional budget frameworks and related fiscal process questions.",
    whyItMatters:
      "Budget procedure can determine what legislation is possible and how it moves.",
    responsibilities: [
      "Budget resolutions",
      "Fiscal process oversight",
      "Spending and revenue framework debates",
    ],
    sourceRecordIds: ["source-vanhollen-about"],
  },
  {
    id: "senate-rules",
    chamber: "senate",
    name: "Senate Rules and Administration Committee",
    purpose:
      "Handles federal election administration, Senate procedure, and internal congressional operations.",
    whyItMatters:
      "This committee shapes how federal elections are administered and how the Senate's own institutional rules operate.",
    responsibilities: [
      "Federal election administration",
      "Senate procedure and internal operations",
      "Oversight of Capitol-related administration",
    ],
    sourceRecordIds: ["source-padilla-committees"],
  },
  {
    id: "senate-epw",
    chamber: "senate",
    name: "Senate Environment and Public Works Committee",
    purpose:
      "Handles environmental policy, infrastructure, transportation-related public works, and related oversight.",
    whyItMatters:
      "This committee is a key venue for transportation and environmental legislation before it reaches the full Senate.",
    responsibilities: [
      "Environmental policy",
      "Public works and infrastructure",
      "Transportation-related environmental issues",
    ],
    sourceRecordIds: ["source-alsobrooks-about"],
  },
  {
    id: "senate-energy",
    chamber: "senate",
    name: "Senate Energy and Natural Resources Committee",
    purpose:
      "Handles energy policy, public lands, natural resources, and related infrastructure resilience questions.",
    whyItMatters:
      "Members on Energy and Natural Resources can shape federal clean-energy, land-management, and resilience legislation before floor consideration.",
    responsibilities: [
      "Energy systems and grid policy",
      "Public lands and natural resources",
      "Climate resilience and federal resource management",
    ],
    sourceRecordIds: ["source-padilla-committees"],
  },
  {
    id: "senate-aging",
    chamber: "senate",
    name: "Senate Special Committee on Aging",
    purpose:
      "Studies issues affecting older Americans, including health, retirement, and fraud prevention.",
    whyItMatters:
      "While not a standard legislative committee, it can focus attention and oversight on aging-related policy questions.",
    responsibilities: [
      "Oversight and public hearings",
      "Aging-related policy attention",
      "Fraud and retirement issues",
    ],
    sourceRecordIds: ["source-alsobrooks-about"],
  },
  {
    id: "senate-help",
    chamber: "senate",
    name: "Senate Health, Education, Labor, and Pensions Committee",
    purpose:
      "Handles health, education, labor, and pensions legislation.",
    whyItMatters:
      "HELP is a major gatekeeper for health, education, labor, and public-humanities legislation in the Senate.",
    responsibilities: [
      "Healthcare policy",
      "Education and labor legislation",
      "Pensions and public program oversight",
    ],
    sourceRecordIds: ["source-alsobrooks-about"],
  },
  {
    id: "senate-hsgac",
    chamber: "senate",
    name: "Senate Homeland Security and Governmental Affairs Committee",
    purpose:
      "Handles homeland security, government operations, and major oversight issues.",
    whyItMatters:
      "This committee shapes legislation about the structure and operation of the federal government.",
    responsibilities: [
      "Government operations",
      "Oversight and homeland security",
      "Federal workforce and structural reforms",
    ],
    sourceRecordIds: ["source-s51", "source-s3844"],
  },
  {
    id: "senate-judiciary",
    chamber: "senate",
    name: "Senate Judiciary Committee",
    purpose:
      "Handles federal courts, constitutional issues, civil liberties, criminal law, and immigration.",
    whyItMatters:
      "Judiciary is a central gatekeeper for major legal and rights-related legislation in the Senate.",
    responsibilities: [
      "Constitutional issues",
      "Federal courts and criminal law",
      "Civil liberties and immigration",
    ],
    sourceRecordIds: ["source-s123"],
  },
  {
    id: "senate-agriculture",
    chamber: "senate",
    name: "Senate Agriculture, Nutrition, and Forestry Committee",
    purpose:
      "Handles agriculture, nutrition assistance, forestry, food systems, and related rural policy.",
    whyItMatters:
      "This committee helps shape farm, nutrition, and food-system legislation that can strongly affect California's agriculture and food-security interests.",
    responsibilities: [
      "Agriculture and food systems",
      "Nutrition assistance and food security",
      "Forestry and natural-resource management",
    ],
    sourceRecordIds: ["source-schiff-committees"],
  },
  {
    id: "senate-small-business",
    chamber: "senate",
    name: "Senate Small Business and Entrepreneurship Committee",
    purpose:
      "Oversees small-business programs, federal lending support, and entrepreneurship policy.",
    whyItMatters:
      "Members here can influence how federal programs support small businesses, including disaster recovery and access to capital.",
    responsibilities: [
      "Small Business Administration oversight",
      "Capital access and lending policy",
      "Small-business disaster support",
    ],
    sourceRecordIds: ["source-schiff-committees"],
  },
];
