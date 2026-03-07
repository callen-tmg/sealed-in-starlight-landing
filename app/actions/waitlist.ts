"use server";

import { supabase } from "@/lib/supabase";

export async function joinWaitlist(name: string, email: string) {
  const { error } = await supabase
    .from("waitlist")
    .insert({ name: name.trim(), email: email.trim() });

  if (error) {
    if (error.code === "23505") {
      return { error: "You're already on the waitlist!" };
    }
    return { error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
