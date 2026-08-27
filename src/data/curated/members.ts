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
    id: "angela-alsobrooks",
    name: "Angela Alsobrooks",
    chamber: "senate",
    state: "Maryland",
    party: "Democratic",
    officeTitle: "Senator",
    imageUrl: "https://www.congress.gov/img/member/a000382_200.jpg",
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
