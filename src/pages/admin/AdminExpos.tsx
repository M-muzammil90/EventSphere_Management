import { useMemo, useState } from "react";
import { EXPOS, type Expo } from "@/lib/data";
import { Badge, Button, Card, EmptyState, Field, Input, Modal, Progress, Select, Table, Tabs, Td, Th, Textarea } from "@/components/ui";
import { StatCard } from "@/components/shared";
import { fmt, money, useStore } from "@/lib/store";
import { cn } from "@/utils/cn";
import { Building2, CalendarClock, Copy, Download, MapPin, Pencil, Plus, Search, Trash2, TrendingUp, Users } from "lucide-react";

export default function AdminExpos() {
  const { toast } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [editing, setEditing] = useState<Expo | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDel, setConfirmDel] = useState<Expo | null>(null);

  const list = useMemo(
    () => EXPOS.filter((e) => (!q || `${e.title} ${e.city} ${e.category}`.toLowerCase().includes(q.toLowerCase())) && (status === "All" || e.status === status)),
    [q, status]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[24px] font-bold tracking-[-0.02em] text-slate-900">Expo management</h2>
          <p className="mt-1.5 text-[13.5px] text-slate-500">Create, edit and delete expos. Manage dates, venue, theme, pricing and booth inventory.</p>
        </div>
        <Button icon={<Plus className="size-4" />} onClick={() => setCreating(true)}>Create expo</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total expos" value="8" icon={<CalendarClock className="size-5" />} tone="brand" sub="1 live · 6 upcoming · 1 completed" />
        <StatCard label="Total attendees" value={fmt(EXPOS.reduce((s, e) => s + e.attendees, 0))} delta="+14.2%" icon={<Users className="size-5" />} tone="info" sub="Across all editions" />
        <StatCard label="Exhibitors" value={String(EXPOS.reduce((s, e) => s + e.exhibitors, 0))} delta="+9.8%" icon={<Building2 className="size-5" />} tone="success" sub="Unique exhibitor accounts" />
        <StatCard label="Gross revenue" value={money(EXPOS.reduce((s, e) => s + e.boothsSold * 8400, 0))} delta="+31.0%" icon={<TrendingUp className="size-5" />} tone="warn" sub="Booth sales, all editions" />
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <div className="relative min-w-0 flex-1">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search expos…" className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-[13.5px] outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/12" />
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </div>
          <Tabs size="sm" active={status} onChange={setStatus} tabs={["All", "Live", "Upcoming", "Completed"].map((s) => ({ id: s, label: s, count: s === "All" ? EXPOS.length : EXPOS.filter((e) => e.status === s).length }))} />
          <Button size="sm" variant="secondary" icon={<Download className="size-4" />} onClick={() => toast({ title: "Expos exported to CSV", tone: "success" })}>CSV</Button>
        </div>

        {list.length === 0 ? (
          <EmptyState icon={<CalendarClock className="size-6" />} title="No expos found" body="Adjust your search or create a new expo to get started." action={<Button onClick={() => setCreating(true)} icon={<Plus className="size-4" />}>Create expo</Button>} />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Expo</Th>
                <Th>Dates</Th>
                <Th>Status</Th>
                <Th className="text-right">Attendees</Th>
                <Th className="text-right">Exhibitors</Th>
                <Th>Booth inventory</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {list.map((e) => {
                const pct = Math.round((e.boothsSold / e.boothsTotal) * 100);
                return (
                  <tr key={e.id} className="transition hover:bg-slate-50/60">
                    <Td>
                      <div className="flex items-center gap-3">
                        <img src={e.cover} alt="" className="size-10 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">{e.title}</p>
                          <p className="flex items-center gap-1 text-[11.5px] text-slate-500"><MapPin className="size-3" /> {e.city}</p>
                        </div>
                      </div>
                    </Td>
                    <Td className="whitespace-nowrap text-slate-600">
                      {new Date(e.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
                      {new Date(e.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                    </Td>
                    <Td>
                      <Badge tone={e.status === "Live" ? "danger" : e.status === "Upcoming" ? "brand" : "neutral"} dot={e.status === "Live"}>{e.status}</Badge>
                    </Td>
                    <Td className="text-right font-semibold tabular-nums text-slate-900">{fmt(e.attendees)}</Td>
                    <Td className="text-right tabular-nums text-slate-600">{e.exhibitors}</Td>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <Progress value={pct} className="w-24" height={6} tone={pct > 90 ? "warn" : "brand"} />
                        <span className="text-[11.5px] font-bold tabular-nums text-slate-600">{e.boothsSold}/{e.boothsTotal}</span>
                      </div>
                    </Td>
                    <Td>
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => setEditing(e)} aria-label="Edit" className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-brand-100 hover:text-brand-700"><Pencil className="size-3.5" /></button>
                        <button onClick={() => { navigator.clipboard?.writeText(e.id); toast({ title: `Duplicated as draft`, body: `${e.title} (copy)`, tone: "info" }); }} aria-label="Duplicate" className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-brand-100 hover:text-brand-700"><Copy className="size-3.5" /></button>
                        <button onClick={() => setConfirmDel(e)} aria-label="Delete" className="grid size-8 place-items-center rounded-lg bg-rose-50 text-rose-600 transition hover:bg-rose-100"><Trash2 className="size-3.5" /></button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>

      {/* edit drawer */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={`Edit — ${editing?.title ?? ""}`} subtitle={`Expo ID ${editing?.id ?? ""}`} size="lg"
        footer={<>
          <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          <Button onClick={() => { setEditing(null); toast({ title: "Expo updated", body: "Changes are live for all users.", tone: "success" }); }}>Save changes</Button>
        </>}>
        {editing && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" className="sm:col-span-2"><Input defaultValue={editing.title} /></Field>
            <Field label="Category"><Select defaultValue={editing.category}>{["Technology", "Healthcare", "Manufacturing", "Automotive", "Retail", "Sustainability", "Food & Beverage", "Aerospace"].map((c) => <option key={c}>{c}</option>)}</Select></Field>
            <Field label="Status"><Select defaultValue={editing.status}>{["Live", "Upcoming", "Completed"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
            <Field label="City"><Input defaultValue={editing.city} /></Field>
            <Field label="Venue"><Input defaultValue={editing.venue} /></Field>
            <Field label="Start date"><Input type="date" defaultValue={editing.startDate} /></Field>
            <Field label="End date"><Input type="date" defaultValue={editing.endDate} /></Field>
            <Field label="Theme"><Input defaultValue={editing.theme} /></Field>
            <Field label="Ticket price (USD)"><Input type="number" defaultValue={editing.price} /></Field>
            <Field label="Description" className="sm:col-span-2"><Textarea defaultValue={editing.description} /></Field>
            <div className="sm:col-span-2 grid grid-cols-3 gap-3">
              {[["Attendees", editing.attendees], ["Exhibitors", editing.exhibitors], ["Sessions", editing.sessions]].map(([l, v]) => (
                <div key={l as string} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{l as string}</p>
                  <p className="mt-1 font-display text-[18px] font-bold text-slate-900">{v as number}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <ExpoCreateModal open={creating} onClose={() => setCreating(false)} />

      <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="Delete this expo?" size="sm"
        footer={<>
          <Button variant="ghost" onClick={() => setConfirmDel(null)}>Keep it</Button>
          <Button variant="danger" onClick={() => { setConfirmDel(null); toast({ title: "Expo deleted", body: `${confirmDel?.title} has been removed.`, tone: "danger" }); }}>Delete permanently</Button>
        </>}>
        <div className="rounded-xl bg-rose-50 p-4">
          <p className="text-[13.5px] font-semibold text-rose-900">{confirmDel?.title}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-rose-800/80">
            This will remove {confirmDel?.exhibitors} exhibitor registrations, {confirmDel?.sessions} sessions and all booth
            allocations. This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export function ExpoCreateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useStore();
  const [step, setStep] = useState(1);
  return (
    <Modal open={open} onClose={onClose} title="Create a new expo" subtitle={`Step ${step} of 3`} size="lg"
      footer={<>
        {step > 1 && <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>}
        {step < 3 ? (
          <Button onClick={() => setStep(step + 1)}>Continue</Button>
        ) : (
          <Button onClick={() => { onClose(); setStep(1); toast({ title: "Expo created 🎉", body: "Draft saved — publish when you're ready.", tone: "success" }); }}>Create expo</Button>
        )}
      </>}>
      <div className="mb-6 flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <span className={cn("grid size-7 shrink-0 place-items-center rounded-full text-[11.5px] font-bold transition", step >= s ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-400")}>
              {step > s ? "✓" : s}
            </span>
            <span className={cn("text-[12px] font-semibold", step >= s ? "text-slate-900" : "text-slate-400")}>
              {["Basics", "Venue & pricing", "Publish"][s - 1]}
            </span>
            {s < 3 && <span className="h-px flex-1 bg-slate-200" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Expo title" required className="sm:col-span-2"><Input placeholder="Global Tech Summit 2026" /></Field>
          <Field label="Category" required><Select>{["Technology", "Healthcare", "Manufacturing", "Automotive", "Retail", "Sustainability"].map((c) => <option key={c}>{c}</option>)}</Select></Field>
          <Field label="Industry focus"><Input placeholder="SaaS · AI · Cloud" /></Field>
          <Field label="Start date" required><Input type="date" /></Field>
          <Field label="End date" required><Input type="date" /></Field>
          <Field label="Theme" className="sm:col-span-2"><Input placeholder="Intelligence at Scale" /></Field>
          <Field label="Description" className="sm:col-span-2"><Textarea placeholder="What makes this expo unmissable?" /></Field>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="City" required><Input placeholder="Dubai, UAE" /></Field>
          <Field label="Venue / hall" required><Input placeholder="Dubai World Trade Centre — Hall 4" /></Field>
          <Field label="Total booths"><Input type="number" placeholder="520" /></Field>
          <Field label="Ticket price (USD)"><Input type="number" placeholder="149" /></Field>
          <div className="sm:col-span-2">
            <span className="mb-2 block text-[12.5px] font-semibold text-slate-700">Included in every ticket</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {["All halls & zones", "Digital floor plan", "Keynote seating", "e-Badge with QR", "Session bookmarks", "Networking lounge"].map((p, i) => (
                <span key={p} className={cn("rounded-xl border px-3 py-2.5 text-[12.5px] font-medium", i < 4 ? "border-brand-200 bg-brand-50/60 text-brand-800" : "border-slate-200 text-slate-500")}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-[13px] font-bold text-slate-900">Review</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {[["Status", "Draft (not public)"], ["Visibility", "Unlisted until published"], ["Notifications", "Will notify 12,400 subscribers"], ["Floor plan", "Blank — define zones next"]].map(([l, v]) => (
                <div key={l} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10.5px] font-bold uppercase tracking-wide text-slate-400">{l}</p>
                  <p className="mt-0.5 text-[12.5px] font-semibold text-slate-800">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-brand-50 p-4 text-[13px] leading-relaxed text-brand-900">
            Once published, your expo appears in public search, the attendee app and the newsletter digest. You can unpublish
            at any time from Expo Management.
          </div>
        </div>
      )}
    </Modal>
  );
}
