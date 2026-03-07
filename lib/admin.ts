import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const ADMIN_EMAILS = ["christer.hagen@gmail.com"];

export function isAdminEmail(email?: string | null) {
  return !!email && ADMIN_EMAILS.includes(email);
}

export async function getAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !isAdminEmail(session.user.email)) {
    return null;
  }

  return session;
}
