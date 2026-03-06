"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-[#9a96a8] hover:text-[#c9a84c] transition-colors cursor-pointer"
    >
      Sign out
    </button>
  );
}
