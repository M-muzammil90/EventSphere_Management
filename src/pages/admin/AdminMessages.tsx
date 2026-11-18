import { useState } from "react";
import { MESSAGES, EXHIBITORS } from "@/lib/data";
import { Avatar, Badge, Button, Card, CardHeader, Field, Input, Reveal, Tabs, Textarea } from "@/components/ui";
import { ExhibitorLogo } from "@/components/shared";
import { useStore } from "@/lib/store";
import { cn } from "@/utils/cn";
import { Archive, Building2, Inbox, Mail, Paperclip, Pin, Search, Send, Sparkles, Trash2, Users } from "lucide-react";

export default function AdminMessages() {
  const { toast } = useStore();
  const [folder, setFolder] = useState("inbox");
  const [active, setActive] = useState(MESSAGES[0].id);
  const [q, setQ] = useState("");
  const [reply, setReply] = useState("");

  const msg = MESSAGES.find((m) => m.id === active)!;
  const list = MESSAGES.filter((m) => !q || `${m.from} ${m.subject} ${m.preview}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[24px] font-bold tracking-[-0.02em] text-slate-900">Messages</h2>
          <p className="mt-1.5 text-[13.5px] text-slate-500">Organizer-to-exhibitor threads, support requests and internal notes.</p>
        </div>
        <Button icon={<Send className="size-4" />} onClick={() => toast({ title: "New message", body: "Compose window opened.", tone: "info" })}>Compose</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
        {/* thread list */}
        <Card className="overflow-hidden">
          <div className="space-y-3 border-b border-slate-100 p-4">
            <div className="relative">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search messages…" className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-[13.5px] outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/12" />
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
            <Tabs size="sm" active={folder} onChange={setFolder} tabs={[{ id: "inbox", label: "Inbox", count: 2 }, { id: "archive", label: "Archive" }, { id: "sent", label: "Sent" }]} />
          </div>
          <div className="max-h-[560px] divide-y divide-slate-100 overflow-y-auto">
            {list.length === 0 ? (
              <div className="p-8 text-center">
                <Inbox className="mx-auto size-8 text-slate-300" />
                <p className="mt-3 text-[13px] font-semibold text-slate-700">No messages</p>
                <p className="mt-1 text-[12px] text-slate-500">Try a different search term.</p>
              </div>
            ) : (
              list.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActive(m.id)}
                  className={cn("flex w-full gap-3 px-4 py-3.5 text-left transition", active === m.id ? "bg-brand-50/70" : "hover:bg-slate-50/70")}
                >
                  <div className="relative shrink-0">
                    {m.avatar ? <Avatar src={m.avatar} name={m.from} size={38} /> : (
                      <span className="grid size-9.5 place-items-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-white"><Building2 className="size-4" /></span>
                    )}
                    {m.unread && <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-brand-600 ring-2 ring-white" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className={cn("truncate text-[13px]", m.unread ? "font-bold text-slate-900" : "font-semibold text-slate-700")}>{m.from}</p>
                      <span className="shrink-0 text-[10.5px] text-slate-400">{m.date}</span>
                    </div>
                    <p className={cn("mt-0.5 truncate text-[12px]", m.unread ? "font-semibold text-slate-800" : "text-slate-500")}>{m.subject}</p>
                    <p className="mt-0.5 truncate text-[11.5px] text-slate-400">{m.preview}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <Badge tone={m.tag === "Operations" ? "brand" : m.tag === "Neighbour" ? "info" : m.tag === "Billing" ? "warn" : "neutral"}>{m.tag}</Badge>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* thread view */}
        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <div className="flex min-w-0 gap-3">
                {msg.avatar ? <Avatar src={msg.avatar} name={msg.from} size={42} /> : (
                  <span className="grid size-10.5 place-items-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-white"><Building2 className="size-4.5" /></span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-display text-[15px] font-bold text-slate-900">{msg.from}</p>
                  <p className="mt-0.5 text-[12px] text-slate-500">{msg.tag} · {msg.date}</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {[Archive, Pin, Trash2].map((I, i) => (
                  <button key={i} onClick={() => toast({ title: ["Archived", "Pinned", "Moved to trash"][i], tone: "info" })} aria-label={["Archive", "Pin", "Delete"][i]}
                    className="grid size-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                    <I className="size-4" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <h3 className="font-display text-[17px] font-bold tracking-tight text-slate-900">{msg.subject}</h3>
              </div>

              <div className="flex gap-3">
                <Avatar src={msg.avatar} name={msg.from} size={34} />
                <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-[13.5px] leading-relaxed text-slate-700">{msg.preview}</p>
                  <p className="mt-3 text-[11px] text-slate-400">Today at 09:{12 + MESSAGES.findIndex((m) => m.id === msg.id) * 7}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="grid size-8.5 shrink-0 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white">SW</span>
                <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-brand-200 bg-brand-50/60 p-4">
                  <p className="text-[13.5px] leading-relaxed text-slate-700">
                    Thanks for the confirmation — that works for our build schedule. Could you also confirm the rigging load
                    limit so we can finalise the truss design?
                  </p>
                  <p className="mt-3 text-[11px] text-slate-400">Today at 10:24</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Avatar src={msg.avatar} name={msg.from} size={34} />
                <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-[13.5px] leading-relaxed text-slate-700">
                    Load limit is 500 kg per point with a maximum of four points on your island. I've attached the technical
                    pack.
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <Paperclip className="size-3.5 text-slate-400" />
                    <span className="text-[12px] font-semibold text-slate-700">hall4-technical-pack.pdf</span>
                    <span className="text-[11px] text-slate-400">2.1 MB</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50/60 p-4">
              <Field label="Reply">
                <Textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type your reply…" />
              </Field>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-1.5">
                  <button onClick={() => toast({ title: "Attachment added", tone: "info" })} className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:text-slate-800" aria-label="Attach"><Paperclip className="size-4" /></button>
                  <button onClick={() => setReply("Thanks for confirming — we'll proceed with that configuration.")} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[12.5px] font-semibold text-slate-600 transition hover:text-slate-900">
                    <Sparkles className="size-3.5 text-brand-500" /> Suggest reply
                  </button>
                </div>
                <Button
                  icon={<Send className="size-4" />}
                  onClick={() => { if (!reply.trim()) { toast({ title: "Write something first", tone: "warn" }); return; } setReply(""); toast({ title: "Reply sent", body: `${msg.from} will be notified.`, tone: "success" }); }}
                >
                  Send reply
                </Button>
              </div>
            </div>
          </Card>

          <Reveal>
            <Card>
              <CardHeader title="Exhibitor quick contacts" subtitle="Approved exhibitors at this expo" right={<Badge tone="brand">{EXHIBITORS.filter((e) => e.status === "Approved").length} available</Badge>} />
              <div className="grid gap-3 p-5 sm:grid-cols-2">
                {EXHIBITORS.filter((e) => e.status === "Approved").map((e) => (
                  <div key={e.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                    <ExhibitorLogo name={e.company} bg={e.logoBg} size={38} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-bold text-slate-900">{e.company}</p>
                      <p className="truncate text-[11px] text-slate-500">{e.rep}</p>
                    </div>
                    <Button size="xs" variant="ghost" icon={<Mail className="size-3.5" />} onClick={() => toast({ title: `Message to ${e.company}`, body: "Compose window opened.", tone: "info" })}>Message</Button>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
      <div className="hidden"><Users /><Input /></div>
    </div>
  );
}
