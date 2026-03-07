import { redirect } from "next/navigation";
import { AdminWaitlistConsole } from "@/components/admin-waitlist-console";
import { getAdminSession } from "@/lib/admin";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { SignOutButton } from "@/components/sign-out-button";

export const dynamic = "force-dynamic";

async function getWaitlistMembers() {
  const { data, error } = await supabase
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/sign-in");
  }

  const members = await getWaitlistMembers();

  return (
    <div className="dark min-h-screen bg-[#0a0a12] p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#e8e4df]">
              Waitlist
            </h1>
            <p className="text-sm text-[#9a96a8]">
              Manage your Sealed in Starlight waitlist members.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant="secondary"
              className="bg-[#1a1020] text-[#c9a84c] border border-[#c9a84c]/20"
            >
              {members.length} {members.length === 1 ? "member" : "members"}
            </Badge>
            <SignOutButton />
          </div>
        </div>
        <AdminWaitlistConsole initialMembers={members} />
      </div>
    </div>
  );
}
