"use client";

import { Fragment, useMemo, useState, useTransition } from "react";
import { IconChevronDown, IconChevronUp, IconSearch } from "@tabler/icons-react";
import { updateWaitlistMember } from "@/app/actions/waitlist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  type WaitlistMember,
  type WaitlistStatus,
  WAITLIST_STATUSES,
} from "@/lib/waitlist";

type SortDirection = "newest" | "oldest";

type MemberDraft = {
  status: WaitlistStatus;
  tags: string;
  internalNote: string;
};

type AdminWaitlistConsoleProps = {
  initialMembers: WaitlistMember[];
};

const STATUS_LABELS: Record<WaitlistStatus, string> = {
  new: "New",
  reviewed: "Reviewed",
  invited: "Invited",
  joined: "Joined",
  archived: "Archived",
};

const STATUS_BADGE_CLASSES: Record<WaitlistStatus, string> = {
  new: "border border-sky-400/20 bg-sky-500/10 text-sky-200",
  reviewed: "border border-violet-400/20 bg-violet-500/10 text-violet-200",
  invited: "border border-amber-400/20 bg-amber-500/10 text-amber-200",
  joined: "border border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
  archived: "border border-zinc-400/20 bg-zinc-500/10 text-zinc-300",
};

function formatMemberTimestamp(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function isToday(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function isWithinLastDays(dateString: string, days: number) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}

function createDraft(member: WaitlistMember): MemberDraft {
  return {
    status: member.status,
    tags: member.tags.join(", "),
    internalNote: member.internal_note ?? "",
  };
}

function WaitlistSummaryCards({ members }: { members: WaitlistMember[] }) {
  const joinedToday = members.filter((member) => isToday(member.created_at)).length;
  const joinedThisWeek = members.filter((member) =>
    isWithinLastDays(member.created_at, 7)
  ).length;
  const latestMember = members[0] ?? null;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card size="sm" className="border-[#c9a84c]/10 bg-[#141422]">
        <CardHeader>
          <CardDescription className="text-[#9a96a8]">Total members</CardDescription>
          <CardTitle className="text-2xl text-[#e8e4df]">{members.length}</CardTitle>
        </CardHeader>
      </Card>
      <Card size="sm" className="border-[#c9a84c]/10 bg-[#141422]">
        <CardHeader>
          <CardDescription className="text-[#9a96a8]">Joined today</CardDescription>
          <CardTitle className="text-2xl text-[#e8e4df]">{joinedToday}</CardTitle>
        </CardHeader>
      </Card>
      <Card size="sm" className="border-[#c9a84c]/10 bg-[#141422]">
        <CardHeader>
          <CardDescription className="text-[#9a96a8]">Last 7 days</CardDescription>
          <CardTitle className="text-2xl text-[#e8e4df]">{joinedThisWeek}</CardTitle>
        </CardHeader>
      </Card>
      <Card size="sm" className="border-[#c9a84c]/10 bg-[#141422]">
        <CardHeader>
          <CardDescription className="text-[#9a96a8]">Latest signup</CardDescription>
          <CardTitle className="text-base text-[#e8e4df]">
            {latestMember ? latestMember.name : "None yet"}
          </CardTitle>
          <p className="text-sm text-[#6a6678]">
            {latestMember
              ? formatMemberTimestamp(latestMember.created_at)
              : "Waiting for the first signup."}
          </p>
        </CardHeader>
      </Card>
    </div>
  );
}

function MemberDetails({
  draft,
  error,
  isPending,
  member,
  onChange,
  onSave,
}: {
  draft: MemberDraft;
  error?: string;
  isPending: boolean;
  member: WaitlistMember;
  onChange: (next: MemberDraft) => void;
  onSave: () => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#6a6678]">
            Member intent
          </p>
          <div className="rounded-lg border border-[#c9a84c]/10 bg-[#100f1a] px-4 py-3 text-sm text-[#c7c2d3]">
            {member.intent ?? "No intent added on signup."}
          </div>
        </div>
        <div>
          <label
            htmlFor={`member-note-${member.id}`}
            className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-[#6a6678]"
          >
            Internal note
          </label>
          <Textarea
            id={`member-note-${member.id}`}
            value={draft.internalNote}
            onChange={(event) =>
              onChange({ ...draft, internalNote: event.target.value })
            }
            placeholder="Add context for follow-up, fit, or outreach."
            className="min-h-28 border-[#c9a84c]/10 bg-[#100f1a] text-[#e8e4df] placeholder:text-[#6a6678]"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor={`member-status-${member.id}`}
            className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-[#6a6678]"
          >
            Status
          </label>
          <Select
            value={draft.status}
            onValueChange={(value) =>
              onChange({ ...draft, status: value as WaitlistStatus })
            }
          >
            <SelectTrigger
              id={`member-status-${member.id}`}
              className="w-full border-[#c9a84c]/10 bg-[#100f1a] text-[#e8e4df]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WAITLIST_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label
            htmlFor={`member-tags-${member.id}`}
            className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-[#6a6678]"
          >
            Tags
          </label>
          <Input
            id={`member-tags-${member.id}`}
            value={draft.tags}
            onChange={(event) => onChange({ ...draft, tags: event.target.value })}
            placeholder="creator, gifting, high-intent"
            className="border-[#c9a84c]/10 bg-[#100f1a] text-[#e8e4df] placeholder:text-[#6a6678]"
          />
          <p className="mt-2 text-xs text-[#6a6678]">
            Comma-separated. Tags are saved lowercase and deduplicated.
          </p>
        </div>

        <div className="rounded-lg border border-[#c9a84c]/10 bg-[#100f1a] px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6a6678]">
            Joined
          </p>
          <p className="mt-2 text-sm text-[#e8e4df]">
            {formatMemberTimestamp(member.created_at)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={onSave}
            disabled={isPending}
            className="bg-[#c9a84c] text-[#140f06] hover:bg-[#d6b766]"
          >
            {isPending ? "Saving..." : "Save changes"}
          </Button>
          {error ? (
            <p className="text-sm text-[#e87777]">{error}</p>
          ) : (
            <p className="text-sm text-[#6a6678]">
              Updates apply immediately after save.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminWaitlistConsole({
  initialMembers,
}: AdminWaitlistConsoleProps) {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | WaitlistStatus>("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [sortDirection, setSortDirection] = useState<SortDirection>("newest");
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(
    initialMembers[0]?.id ?? null
  );
  const [drafts, setDrafts] = useState<Record<string, MemberDraft>>(() =>
    Object.fromEntries(initialMembers.map((member) => [member.id, createDraft(member)]))
  );
  const [memberErrors, setMemberErrors] = useState<Record<string, string>>({});
  const [savingMemberId, setSavingMemberId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const availableTags = useMemo(() => {
    return [...new Set(members.flatMap((member) => member.tags))].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [members]);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...members]
      .filter((member) => {
        if (!query) {
          return true;
        }

        return (
          member.name.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query)
        );
      })
      .filter((member) =>
        statusFilter === "all" ? true : member.status === statusFilter
      )
      .filter((member) => (tagFilter === "all" ? true : member.tags.includes(tagFilter)))
      .sort((left, right) => {
        const diff =
          new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
        return sortDirection === "newest" ? diff : -diff;
      });
  }, [members, search, sortDirection, statusFilter, tagFilter]);

  const handleDraftChange = (memberId: string, next: MemberDraft) => {
    setDrafts((current) => ({ ...current, [memberId]: next }));
  };

  const handleSave = async (memberId: string) => {
    const draft = drafts[memberId];
    if (!draft) {
      return;
    }

    setSavingMemberId(memberId);

    try {
      const result = await updateWaitlistMember({
        id: memberId,
        status: draft.status,
        tags: draft.tags,
        internalNote: draft.internalNote,
      });

      if (result.error) {
        setMemberErrors((current) => ({ ...current, [memberId]: result.error }));
        return;
      }

      startTransition(() => {
        setMemberErrors((current) => {
          const next = { ...current };
          delete next[memberId];
          return next;
        });

        if (result.member) {
          setMembers((current) =>
            current.map((member) =>
              member.id === memberId ? result.member : member
            )
          );
          setDrafts((current) => ({
            ...current,
            [memberId]: createDraft(result.member),
          }));
        }
      });
    } catch {
      setMemberErrors((current) => ({
        ...current,
        [memberId]: "Unable to update member right now.",
      }));
    } finally {
      setSavingMemberId(null);
    }
  };

  return (
    <div className="space-y-6">
      <WaitlistSummaryCards members={members} />

      <Card className="border-[#c9a84c]/10 bg-[#141422]">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle className="text-lg text-[#e8e4df]">All Members</CardTitle>
              <CardDescription className="text-[#9a96a8]">
                Search, segment, and update early waitlist members.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setSortDirection((current) =>
                  current === "newest" ? "oldest" : "newest"
                )
              }
              className="border-[#c9a84c]/15 bg-[#100f1a] text-[#e8e4df] hover:bg-[#1a1020]"
            >
              {sortDirection === "newest" ? "Newest first" : "Oldest first"}
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1.5fr)_minmax(180px,0.7fr)_minmax(180px,0.7fr)]">
            <div className="relative">
              <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#6a6678]" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or email"
                className="border-[#c9a84c]/10 bg-[#100f1a] pl-9 text-[#e8e4df] placeholder:text-[#6a6678]"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as "all" | WaitlistStatus)
              }
            >
              <SelectTrigger className="w-full border-[#c9a84c]/10 bg-[#100f1a] text-[#e8e4df]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {WAITLIST_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="w-full border-[#c9a84c]/10 bg-[#100f1a] text-[#e8e4df]">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tags</SelectItem>
                {availableTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {filteredMembers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#c9a84c]/15 bg-[#100f1a] px-6 py-14 text-center">
              <p className="text-base text-[#e8e4df]">
                {members.length === 0
                  ? "No waitlist members yet."
                  : "No members match the current filters."}
              </p>
              <p className="mt-2 text-sm text-[#6a6678]">
                {members.length === 0
                  ? "Once someone joins, their profile and workflow state will appear here."
                  : "Adjust search, status, or tag filters to widen the list."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#c9a84c]/10 hover:bg-transparent">
                  <TableHead className="text-[#9a96a8]">Name</TableHead>
                  <TableHead className="text-[#9a96a8]">Email</TableHead>
                  <TableHead className="text-[#9a96a8]">Status</TableHead>
                  <TableHead className="text-[#9a96a8]">Tags</TableHead>
                  <TableHead className="text-[#9a96a8]">Joined</TableHead>
                  <TableHead className="text-right text-[#9a96a8]">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => {
                  const isExpanded = expandedMemberId === member.id;
                  const draft = drafts[member.id] ?? createDraft(member);
                  const isSaving = savingMemberId === member.id || (isPending && savingMemberId === member.id);

                  return (
                    <Fragment key={member.id}>
                      <TableRow className="border-[#c9a84c]/5 hover:bg-[#1a1020]/40">
                        <TableCell className="text-[#e8e4df] font-medium">
                          {member.name}
                        </TableCell>
                        <TableCell className="text-[#9a96a8]">{member.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn("capitalize", STATUS_BADGE_CLASSES[member.status])}
                          >
                            {STATUS_LABELS[member.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-48 whitespace-normal">
                          {member.tags.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {member.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="border-[#c9a84c]/10 bg-[#100f1a] text-[#c7c2d3]"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[#6a6678]">No tags</span>
                          )}
                        </TableCell>
                        <TableCell className="text-[#c7c2d3]">
                          {formatMemberTimestamp(member.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedMemberId((current) =>
                                current === member.id ? null : member.id
                              )
                            }
                            className="text-[#9a96a8] hover:bg-[#1a1020] hover:text-[#e8e4df]"
                          >
                            {isExpanded ? (
                              <>
                                Hide <IconChevronUp />
                              </>
                            ) : (
                              <>
                                Edit <IconChevronDown />
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {isExpanded ? (
                        <TableRow className="border-[#c9a84c]/10 bg-[#100f1a]/80 hover:bg-[#100f1a]/80">
                          <TableCell colSpan={6} className="whitespace-normal p-4">
                            <MemberDetails
                              member={member}
                              draft={draft}
                              error={memberErrors[member.id]}
                              isPending={isSaving}
                              onChange={(next) => handleDraftChange(member.id, next)}
                              onSave={() => {
                                void handleSave(member.id);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
