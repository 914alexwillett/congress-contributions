import type { Legislator } from "../../domain/models";

export const curatedMembers: Legislator[] = [
  {
    id: "jamie-raskin",
    name: "Jamie Raskin",
    chamber: "house",
    state: "Maryland",
    district: "MD-08",
    party: "Democratic",
    officeTitle: "Representative",
    imageUrl: "https://www.congress.gov/img/member/r000606_200.jpg",
    bio: "Represents Maryland's 8th Congressional District in the U.S. House of Representatives.",
    committeeMemberships: [
      {
        committeeId: "house-judiciary",
        committeeName: "House Committee on the Judiciary",
        role: "Ranking Member",
      },
    ],
    sourceRecordIds: ["source-raskin-about", "source-raskin-committees", "source-house-clerk-raskin"],
  },
  {
    id: "chris-van-hollen",
    name: "Chris Van Hollen",
    chamber: "senate",
    state: "Maryland",
    party: "Democratic",
    officeTitle: "Senator",
    imageUrl: "https://www.congress.gov/img/member/v000128_200.jpg",
    bio: "Serves Maryland in the U.S. Senate.",
    committeeMemberships: [
      {
        committeeId: "senate-appropriations",
        committeeName: "Senate Appropriations Committee",
        role: "Member",
      },
      {
        committeeId: "senate-foreign-relations",
        committeeName: "Senate Foreign Relations Committee",
        role: "Member",
      },
      {
        committeeId: "senate-banking",
        committeeName: "Senate Banking, Housing, and Urban Affairs Committee",
        role: "Member",
      },
      {
        committeeId: "senate-budget",
        committeeName: "Senate Budget Committee",
        role: "Member",
      },
    ],
    sourceRecordIds: ["source-vanhollen-about"],
  },
  {
    id: "nancy-pelosi",
    name: "Nancy Pelosi",
    chamber: "house",
    state: "California",
    district: "CA-11",
    party: "Democratic",
    officeTitle: "Representative",
    imageUrl: "https://www.congress.gov/img/member/p000197_200.jpg",
    bio: "Represents California's 11th Congressional District in the U.S. House of Representatives.",
    committeeMemberships: [],
    sourceRecordIds: ["source-pelosi-about"],
  },
  {
    id: "alex-padilla",
    name: "Alex Padilla",
    chamber: "senate",
    state: "California",
    party: "Democratic",
    officeTitle: "Senator",
    imageUrl: "https://www.congress.gov/img/member/p000145_200.jpg",
    bio: "Serves California in the U.S. Senate, with current committee work spanning elections, immigration, environment, energy, and budget policy.",
    committeeMemberships: [
      {
        committeeId: "senate-rules",
        committeeName: "Senate Rules and Administration Committee",
        role: "Ranking Member",
      },
      {
        committeeId: "senate-judiciary",
        committeeName: "Senate Judiciary Committee",
        role: "Member",
      },
      {
        committeeId: "senate-budget",
        committeeName: "Senate Budget Committee",
        role: "Member",
      },
      {
        committeeId: "senate-epw",
        committeeName: "Senate Environment and Public Works Committee",
        role: "Member",
      },
      {
        committeeId: "senate-energy",
        committeeName: "Senate Energy and Natural Resources Committee",
        role: "Member",
      },
    ],
    sourceRecordIds: ["source-padilla-about", "source-padilla-committees"],
  },
  {
    id: "adam-schiff",
    name: "Adam Schiff",
    chamber: "senate",
    state: "California",
    party: "Democratic",
    officeTitle: "Senator",
    imageUrl: "https://www.congress.gov/img/member/s001150_200.jpg",
    bio: "Serves California in the U.S. Senate, with committee work touching judiciary, environment, agriculture, and small-business oversight.",
    committeeMemberships: [
      {
        committeeId: "senate-judiciary",
        committeeName: "Senate Judiciary Committee",
        role: "Member",
      },
      {
        committeeId: "senate-epw",
        committeeName: "Senate Environment and Public Works Committee",
        role: "Member",
      },
      {
        committeeId: "senate-agriculture",
        committeeName: "Senate Agriculture, Nutrition, and Forestry Committee",
        role: "Member",
      },
      {
        committeeId: "senate-small-business",
        committeeName: "Senate Small Business and Entrepreneurship Committee",
        role: "Member",
      },
    ],
    sourceRecordIds: ["source-schiff-about", "source-schiff-committees"],
  },
  {
    id: "angela-alsobrooks",
    name: "Angela Alsobrooks",
    chamber: "senate",
    state: "Maryland",
    party: "Democratic",
    officeTitle: "Senator",
    imageUrl:
      "https://www.alsobrooks.senate.gov/wp-content/uploads/2025/11/official-portrait-scaled.jpg",
    bio: "Serves Maryland in the U.S. Senate.",
    committeeMemberships: [
      {
        committeeId: "senate-epw",
        committeeName: "Senate Environment and Public Works Committee",
        role: "Member",
      },
      {
        committeeId: "senate-aging",
        committeeName: "Senate Special Committee on Aging",
        role: "Member",
      },
      {
        committeeId: "senate-banking",
        committeeName: "Senate Banking, Housing, and Urban Affairs Committee",
        role: "Member",
      },
      {
        committeeId: "senate-help",
        committeeName: "Senate Health, Education, Labor, and Pensions Committee",
        role: "Member",
      },
    ],
    sourceRecordIds: ["source-alsobrooks-about"],
  },
];
