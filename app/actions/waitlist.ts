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

async function addToKlaviyo(name: string, email: string) {
  const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY;
  const KLAVIYO_WAITLIST_LIST_ID = process.env.KLAVIYO_WAITLIST_LIST_ID;

  if (!KLAVIYO_API_KEY || !KLAVIYO_WAITLIST_LIST_ID) return;

  try {
    const profileRes = await fetch("https://a.klaviyo.com/api/profiles", {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        "Content-Type": "application/vnd.api+json",
        revision: "2024-10-15",
      },
      body: JSON.stringify({
        data: {
          type: "profile",
          attributes: {
            email,
            first_name: name,
          },
        },
      }),
    });

    let profileId: string | null = null;

    if (profileRes.status === 201) {
      const profileData = await profileRes.json();
      profileId = profileData.data.id;
    } else if (profileRes.status === 409) {
      const errorData = await profileRes.json();
      profileId = errorData.errors?.[0]?.meta?.duplicate_profile_id ?? null;
    }

    if (!profileId) return;

    await fetch(
      `https://a.klaviyo.com/api/lists/${KLAVIYO_WAITLIST_LIST_ID}/relationships/profiles`,
      {
        method: "POST",
        headers: {
          Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
          "Content-Type": "application/vnd.api+json",
          revision: "2024-10-15",
        },
        body: JSON.stringify({
          data: [{ type: "profile", id: profileId }],
        }),
      }
    );
  } catch {
    console.error("Klaviyo sync failed");
  }
}

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

  addToKlaviyo(name.trim(), email.trim());

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
