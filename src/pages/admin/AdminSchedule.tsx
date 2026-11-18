import { useMemo, useState } from "react";
import { SESSIONS, type Session } from "@/lib/data";
import { Avatar, Badge, Button, Card, CardHeader, EmptyState, Field, Input, Modal, Progress, Select, Tabs, Textarea } from "@/components/ui";
import { StatCard } from "@/components/shared";
import { BarChart } from "@/components/charts";
import { fmt, useStore } from "@/lib/store";
import { cn } from "@/utils/cn";
import { AVATARS } from "@/lib/data";
import { CalendarClock, Clock, Download, MapPin, Pencil, Plus, Search, Star, Trash2, Users } from "lucide-react";

const DAYS = ["Day 1", "Day 2", "Day 3", "Day 4"];
const TRACKS = ["Vision", "Engineering", "Infrastructure", "Automation", "Security", "Commerce", "Governance", "Energy", "Foresight"];

export default function AdminSchedule() {
  const { toast } = useStore();
  const [view, setView] = useState("list");
  const [q, setQ] = useState("");
  const [day, setDay] = useState("All");
  const [editing, setEditing] = useState<Session | null>(null);
  const [creating, setCreating] = useState(false);

  const list = useMemo(
    () => SESSIONS.filter((s) => (day === "All" || s.day === day) && (!q || `${s.title} ${s.speaker} ${s.stage} ${s.track}`.toLowerCase().includes(q.toLowerCase()))),
    [q, day]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[24px] font-bold tracking-[-0.02em] text-slate-900">Schedule management</h2>
          <p className="mt-1.5 text-[13.5px] text-slate-500">Create sessions, assign speakers, topics and stages. Changes push to attendees in real time.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button variant="secondary" icon={<Download className="size-4" />} onClick={() => toast({ title: "Schedule exported", tone: "success" })}>Export</Button>
          <Button icon={<Plus className="size-4" />} onClick={() => setCreating(true)}>Add session</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total sessions" value={String(SESSIONS.length)} icon={<CalendarClock className="size-5" />} tone="brand" sub="Across 4 days" />
        <StatCard label="Speakers" value="148" icon={<Users className="size-5" />} tone="info" sub="38 first-time speakers" />
        <StatCard label="Avg. fill rate" value="84%" delta="+6.1%" icon={<Star className="size-5" />} tone="success" sub="Registrations vs. capacity" />
        <StatCard label="Avg. rating" value="4.7" delta="+0.3" icon={<Star className="size-5" />} tone="warn" sub="Post-session feedback" />
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <div className="relative min-w-0 flex-1">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sessions, speakers, stages…" className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-[13.5px] outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/12" />
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </div>
          <Tabs size="sm" active={day} onChange={setDay} tabs={[{ id: "All", label: "All days", count: SESSIONS.length }, ...DAYS.map((d) => ({ id: d, label: d, count: SESSIONS.filter((s) => s.day === d).length }))]} />
          <Tabs size="sm" active={view} onChange={setView} tabs={[{ id: "list", label: "List" }, { id: "grid", label: "Timeline" }]} />
        </div>

        {list.length === 0 ? (
          <EmptyState icon={<CalendarClock className="size-6" />} title="No sessions found" body="Try another day or clear your search." />
        ) : view === "list" ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  {["Session", "Speaker", "Day & time", "Stage", "Capacity", "Rating", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map((s) => {
                  const fill = Math.round((s.registered / s.capacity) * 100);
                  return (
                    <tr key={s.id} className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60">
                      <td>
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-[10px] font-bold text-brand-700">{s.id.replace("SS-", "")}</span>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900">{s.title}</p>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              <Badge tone={s.type === "Keynote" ? "purple" : s.type === "Workshop" ? "brand" : s.type === "Demo" ? "warn" : "neutral"}>{s.type}</Badge>
                              <Badge tone="neutral" className="bg-slate-50">{s.track}</Badge>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <Avatar src={s.avatar} name={s.speaker} size={30} />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-800">{s.speaker}</p>
                            <p className="truncate text-[11px] text-slate-500">{s.speakerRole}</p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap text-slate-600">
                        <span className="font-semibold text-slate-800">{s.day}</span>
                        <span className="ml-2 inline-flex items-center gap-1 text-[12px]"><Clock className="size-3" /> {s.start}–{s.end}</span>
                      </td>
                      <td><Badge tone="neutral" className="bg-slate-50">{s.stage}</Badge></td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Progress value={fill} className="w-16" height={5} tone={fill > 95 ? "danger" : fill > 80 ? "warn" : "success"} />
                          <span className="text-[11.5px] font-bold tabular-nums text-slate-700">{fill}%</span>
                        </div>
                        <p className="mt-1 text-[10.5px] text-slate-400">{fmt(s.registered)}/{fmt(s.capacity)}</p>
                      </td>
                      <td className="font-semibold tabular-nums text-slate-800">{s.rating}</td>
                      <td>
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => setEditing(s)} aria-label="Edit" className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-brand-100 hover:text-brand-700"><Pencil className="size-3.5" /></button>
                          <button onClick={() => toast({ title: "Session removed", body: s.title, tone: "danger" })} aria-label="Delete" className="grid size-8 place-items-center rounded-lg bg-rose-50 text-rose-600 transition hover:bg-rose-100"><Trash2 className="size-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-4 p-4 lg:grid-cols-4">
            {DAYS.map((d) => (
              <div key={d} className="rounded-2xl bg-slate-50 p-3">
                <p className="mb-3 px-1 text-[12px] font-bold uppercase tracking-wider text-slate-500">{d}</p>
                <div className="space-y-2.5">
                  {list.filter((s) => s.day === d).sort((a, b) => a.start.localeCompare(b.start)).map((s) => (
                    <button key={s.id} onClick={() => setEditing(s)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-brand-300 hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-[12px] font-bold text-brand-700">{s.start}</span>
                        <Badge tone={s.type === "Keynote" ? "purple" : s.type === "Workshop" ? "brand" : s.type === "Demo" ? "warn" : "neutral"}>{s.type}</Badge>
                      </div>
                      <p className="mt-1.5 text-[12.5px] font-semibold leading-snug text-slate-900">{s.title}</p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500"><MapPin className="size-3" /> {s.stage}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Capacity utilisation" subtitle="Registrations vs. room capacity" />
          <div className="p-5">
            <BarChart
              horizontal
              color="#6366f1"
              format={(n) => `${n}%`}
              data={SESSIONS.slice(0, 7).map((s) => ({ label: s.title.length > 26 ? s.title.slice(0, 26) + "…" : s.title, v: Math.round((s.registered / s.capacity) * 100) }))}
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Sessions by track" subtitle="Distribution across the programme" />
          <div className="p-5">
            <BarChart
              horizontal
              color="#06b6d4"
              format={(n) => String(n)}
              data={Array.from(new Set(SESSIONS.map((s) => s.track))).map((t) => ({ label: t, v: SESSIONS.filter((s) => s.track === t).length }))}
            />
          </div>
        </Card>
      </div>

      <SessionModal
        open={!!editing || creating}
        session={editing}
        onClose={() => { setEditing(null); setCreating(false); }}
        onSave={() => { setEditing(null); setCreating(false); toast({ title: editing ? "Session updated" : "Session created", body: "All bookmarked attendees have been notified.", tone: "success" }); }}
      />
      <div className="hidden">{AVATARS.length}</div>
    </div>
  );
}

function SessionModal({ open, session, onClose, onSave }: { open: boolean; session: Session | null; onClose: () => void; onSave: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title={session ? "Edit session" : "Add a session"} subtitle={session ? `${session.id} · ${session.day}` : "Assign a speaker, topic, stage and time slot"} size="lg"
      footer={<>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={onSave}>{session ? "Save & notify" : "Create session"}</Button>
      </>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Session title" required className="sm:col-span-2"><Input defaultValue={session?.title} placeholder="Hands-on: Ship a RAG pipeline" /></Field>
        <Field label="Format"><Select defaultValue={session?.type}>{["Keynote", "Workshop", "Panel", "Demo", "Roundtable"].map((t) => <option key={t}>{t}</option>)}</Select></Field>
        <Field label="Track"><Select defaultValue={session?.track}>{TRACKS.map((t) => <option key={t}>{t}</option>)}</Select></Field>
        <Field label="Speaker name"><Input defaultValue={session?.speaker} placeholder="Dr. Elena Vance" /></Field>
        <Field label="Speaker role / company"><Input defaultValue={session?.speakerRole} placeholder="CTO, Nexora Cloud" /></Field>
        <Field label="Day"><Select defaultValue={session?.day}>{DAYS.map((d) => <option key={d}>{d}</option>)}</Select></Field>
        <Field label="Stage / room"><Select defaultValue={session?.stage}>{["Main Stage", "Forum A", "Forum B", "Lab 1", "Lab 2", "Demo Arena"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
        <Field label="Start time"><Input type="time" defaultValue={session?.start} /></Field>
        <Field label="End time"><Input type="time" defaultValue={session?.end} /></Field>
        <Field label="Capacity"><Input type="number" defaultValue={session?.capacity ?? 120} /></Field>
        <Field label="Rating" hint="read-only"><Input value={session?.rating ?? "—"} readOnly className="bg-slate-50 text-slate-500" /></Field>
        <Field label="Description" className="sm:col-span-2"><Textarea placeholder="What will attendees learn?" /></Field>
        <div className="sm:col-span-2">
          <p className="mb-2 text-[12.5px] font-semibold text-slate-700">Push notification</p>
          <div className={cn("flex flex-wrap gap-2")}>
            {["Notify all bookmarked attendees", "Notify all attendees", "Don't notify"].map((t, i) => (
              <span key={t} className={cn("cursor-pointer rounded-xl border px-3 py-2 text-[12.5px] font-semibold transition", i === 0 ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600 hover:border-slate-300")}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
