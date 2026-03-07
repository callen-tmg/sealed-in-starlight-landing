import type { Enums, Tables } from "@/lib/database.types";

export const WAITLIST_STATUSES = [
  "new",
  "reviewed",
  "invited",
  "joined",
  "archived",
] as const;

export type WaitlistStatus = Enums<"waitlist_status">;
export type WaitlistMember = Tables<"waitlist">;

export function isWaitlistStatus(value: string): value is WaitlistStatus {
  return WAITLIST_STATUSES.includes(value as WaitlistStatus);
}

export function normalizeOptionalText(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function normalizeTags(value: string[] | string) {
  const tags = Array.isArray(value) ? value : value.split(",");

  return [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
}
