"use server";

import { getAdminSession } from "@/lib/admin";
import { supabase } from "@/lib/supabase";
import {
  isWaitlistStatus,
  normalizeOptionalText,
  normalizeTags,
  type WaitlistStatus,
} from "@/lib/waitlist";

type UpdateWaitlistMemberInput = {
  id: string;
  status?: WaitlistStatus;
  tags?: string[] | string;
  internalNote?: string | null;
};

export async function joinWaitlist(name: string, email: string, intent?: string) {
  const { error } = await supabase
    .from("waitlist")
    .insert({
      name: name.trim(),
      email: email.trim(),
      intent: normalizeOptionalText(intent),
    });

  if (error) {
    if (error.code === "23505") {
      return { error: "You're already on the waitlist!" };
    }
    return { error: "Something went wrong. Please try again." };
  }

  return { success: true };
}

export async function updateWaitlistMember({
  id,
  internalNote,
  status,
  tags,
}: UpdateWaitlistMemberInput) {
  const session = await getAdminSession();

  if (!session) {
    return { error: "Unauthorized." };
  }

  if (status && !isWaitlistStatus(status)) {
    return { error: "Invalid status." };
  }

  const updates = {
    ...(status ? { status } : {}),
    ...(typeof tags !== "undefined" ? { tags: normalizeTags(tags) } : {}),
    ...(typeof internalNote !== "undefined"
      ? { internal_note: normalizeOptionalText(internalNote) }
      : {}),
  };

  const { data, error } = await supabase
    .from("waitlist")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return { error: "Unable to update member right now." };
  }

  return { success: true, member: data };
}
