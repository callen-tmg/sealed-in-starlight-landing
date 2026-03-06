import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const members = await getWaitlistMembers();

  return (
    <div className="dark min-h-screen bg-[#0a0a12] p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#e8e4df]">
              Waitlist
            </h1>
            <p className="text-sm text-[#9a96a8]">
              Manage your Sealed in Starlight waitlist members.
            </p>
          </div>
          <Badge
            variant="secondary"
            className="bg-[#1a1020] text-[#c9a84c] border border-[#c9a84c]/20"
          >
            {members.length} {members.length === 1 ? "member" : "members"}
          </Badge>
        </div>

        <Card className="border-[#c9a84c]/10 bg-[#141422]">
          <CardHeader>
            <CardTitle className="text-[#e8e4df] text-lg">
              All Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <p className="text-center text-[#6a6678] py-10">
                No waitlist members yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-[#c9a84c]/10 hover:bg-transparent">
                    <TableHead className="text-[#9a96a8]">Name</TableHead>
                    <TableHead className="text-[#9a96a8]">Email</TableHead>
                    <TableHead className="text-[#9a96a8] text-right">
                      Joined
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow
                      key={member.id}
                      className="border-[#c9a84c]/5 hover:bg-[#1a1020]/50"
                    >
                      <TableCell className="text-[#e8e4df] font-medium">
                        {member.name}
                      </TableCell>
                      <TableCell className="text-[#9a96a8]">
                        {member.email}
                      </TableCell>
                      <TableCell className="text-[#6a6678] text-right">
                        {new Date(member.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
