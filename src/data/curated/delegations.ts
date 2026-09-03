import type { ConstituentArea } from "../../domain/models";

export const curatedConstituentAreas: ConstituentArea[] = [
  {
    zip: "20852",
    label: "Rockville, Maryland",
    city: "Rockville",
    state: "Maryland",
    summary: "Montgomery County constituent view centered on Maryland's federal delegation.",
    memberIds: ["jamie-raskin", "chris-van-hollen", "angela-alsobrooks"],
  },
  {
    zip: "94102",
    label: "San Francisco, California",
    city: "San Francisco",
    state: "California",
    summary: "San Francisco constituent view centered on a California House member and both senators.",
    memberIds: ["nancy-pelosi", "alex-padilla", "adam-schiff"],
  },
];

export const supportedZipCodes = curatedConstituentAreas.map((area) => area.zip) as [
  string,
  ...string[],
];

export const curatedDelegationsByZip: Record<string, string[]> = Object.fromEntries(
  curatedConstituentAreas.map((area) => [area.zip, area.memberIds]),
);
