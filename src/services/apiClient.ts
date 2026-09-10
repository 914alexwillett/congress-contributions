import type { ActivityRecord, BillContext, SourceRecord } from "../domain/models";

export interface DelegationRoutineData {
  activities: ActivityRecord[];
  bills: BillContext[];
  sources: SourceRecord[];
}

export async function fetchDelegationRoutineData(zip: string): Promise<DelegationRoutineData | undefined> {
  const response = await fetch(`/api/delegation?zip=${encodeURIComponent(zip)}`);
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error("The live activity service is unavailable.");
  return response.json() as Promise<DelegationRoutineData>;
}
