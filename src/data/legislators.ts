import type { Legislator } from "../models/legislative";

export const supportedZipCodes = ["20852"] as const;

export const legislators: Legislator[] = [
  {
    id: "jamie-raskin",
    name: "Jamie Raskin",
    chamber: "house",
    state: "Maryland",
    district: "MD-08",
    party: "Democratic",
    officeTitle: "Representative",
    imageUrl: "https://www.congress.gov/img/member/r000606_200.jpg",
    bio: "Represents Maryland's 8th Congressional District in the U.S. House.",
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
  },
];

export const delegationByZip: Record<string, string[]> = {
  "20852": legislators.map((legislator) => legislator.id),
};
