import { useMemo, useState } from "react";
import { EXHIBITORS, type Exhibitor } from "@/lib/data";
import { Avatar, Badge, Button, Card, CardHeader, EmptyState, Field, Modal, Progress, Select, Table, Tabs, Td, Th, Textarea } from "@/components/ui";
import { ExhibitorLogo, StatCard } from "@/components/shared";
import { BarChart } from "@/components/charts";
import { fmt, money, useStore } from "@/lib/store";
import { cn } from "@/utils/cn";
import { AVATARS } from "@/lib/data";
import { BadgeCheck, Building2, Check, Download, FileWarning, Mail, MapPin, Search, ShieldCheck, Star, Users, X } from "lucide-react";

const STATUSES = ["All", "Pending", "Approved", "Rejected", "Waitlist"];

export default function AdminExhibitors() {
  const { toast } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("Pending");
  const [detail, setDetail] = useState<Exhibitor | null>(null);

  const list = useMemo(
    () => EXHIBITORS.filter((e) => (!q || `${e.company} ${e.category} ${e.country} ${e.rep}`.toLowerCase().includes(q.toLowerCase())) && (status === "All" || e.status === status)),
    [q, status]
  );

  const act = (e: Exhibitor, approve: boolean) => {
    toast({
      title: `${e.company} ${approve ? "approved" : "rejected"}`,
      body: approve ? `Booth ${e.booth} allocated · confirmation email sent.` : "The applicant has been notified.",
      tone: approve ? "success" : "danger",
    });
    setDetail(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[24px] font-bold tracking-[-0.02em] text-slate-900">Exhibitor management</h2>
          <p className="mt-1.5 text-[13.5px] text-slate-500">Review applications, validate documents, assign booths and track exhibitor performance.</p>
        </div>
        <div className="flex gap-2.5">
          <Button variant="secondary" icon={<Download className="size-4" />} onClick={() => toast({ title: "Exhibitor list exported", tone: "success" })}>Export</Button>
          <Button icon={<Building2 className="size-4" />} onClick={() => toast({ title: "Invite sent", body: "A registration link was emailed to 34 prospects.", tone: "success" })}>Invite exhibitors</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending review" value={String(EXHIBITORS.filter((e) => e.status === "Pending").length)} icon={<FileWarning className="size-5" />} tone="warn" sub="Awaiting your decision" />
        <StatCard label="Approved" value={String(EXHIBITORS.filter((e) => e.status === "Approved").length)} icon={<BadgeCheck className="size-5" />} tone="success" sub="Booths allocated" />
        <StatCard label="Total booth traffic" value={fmt(EXHIBITORS.reduce((s, e) => s + e.traffic, 0))} delta="+11.2%" icon={<Users className="size-5" />} tone="brand" sub="Badge scans this edition" />
        <StatCard label="Attributed revenue" value={money(EXHIBITORS.reduce((s, e) => s + e.revenue, 0))} delta="+19.4%" icon={<Star className="size-5" />} tone="info" sub="Closed deals from leads" />
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <div className="relative min-w-0 flex-1">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search company, category, country, rep…" className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-[13.5px] outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/12" />
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </div>
          <Tabs size="sm" active={status} onChange={setStatus} tabs={STATUSES.map((s) => ({ id: s, label: s === "All" ? "All" : s, count: s === "All" ? EXHIBITORS.length : EXHIBITORS.filter((e) => e.status === s).length }))} />
        </div>

        {list.length === 0 ? (
          <EmptyState icon={<Building2 className="size-6" />} title="Nothing in this queue" body={`No ${status.toLowerCase()} exhibitors match your search.`} action={<Button variant="secondary" onClick={() => { setQ(""); setStatus("All"); }}>Show all</Button>} />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Company</Th>
                <Th>Category</Th>
                <Th>Booth</Th>
                <Th>Documents</Th>
                <Th className="text-right">Lead score</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id} className="cursor-pointer transition hover:bg-slate-50/60" onClick={() => setDetail(e)}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <ExhibitorLogo name={e.company} bg={e.logoBg} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">{e.company}</p>
                        <p className="text-[11.5px] text-slate-500">{e.country} · {e.id}</p>
                      </div>
                    </div>
                  </Td>
                  <Td className="text-slate-600">{e.category}</Td>
                  <Td>
                    <Badge tone="brand">{e.booth}</Badge>
                  </Td>
                  <Td>
                    <Badge tone={e.docs === "Complete" ? "success" : "danger"} dot>{e.docs}</Badge>
                  </Td>
                  <Td>
                    <div className="flex items-center justify-end gap-2">
                      <Progress value={e.leadScore} className="w-16" height={5} tone={e.leadScore > 80 ? "success" : e.leadScore > 60 ? "warn" : "danger"} />
                      <span className="text-[11.5px] font-bold tabular-nums text-slate-700">{e.leadScore}</span>
                    </div>
                  </Td>
                  <Td>
                    <Badge tone={e.status === "Approved" ? "success" : e.status === "Pending" ? "warn" : e.status === "Rejected" ? "danger" : "info"} dot>{e.status}</Badge>
                  </Td>
                  <Td>
                    <div className="flex justify-end gap-1.5" onClick={(ev) => ev.stopPropagation()}>
                      <button onClick={() => act(e, true)} aria-label="Approve" className="grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"><Check className="size-4" /></button>
                      <button onClick={() => act(e, false)} aria-label="Reject" className="grid size-8 place-items-center rounded-lg bg-rose-50 text-rose-600 transition hover:bg-rose-100"><X className="size-4" /></button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Exhibitors by category" subtitle="Approved applications" />
          <div className="p-5">
            <BarChart
              horizontal
              color="#6366f1"
              format={(n) => String(n)}
              data={Array.from(new Set(EXHIBITORS.map((e) => e.category))).map((c) => ({ label: c, v: EXHIBITORS.filter((e) => e.category === c).length }))}
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Top booths by traffic" subtitle="Badge scans at booth level" />
          <div className="p-5">
            <BarChart
              horizontal
              color="#06b6d4"
              format={fmt}
              data={[...EXHIBITORS].filter((e) => e.traffic > 0).sort((a, b) => b.traffic - a.traffic).slice(0, 6).map((e) => ({ label: `${e.booth} · ${e.company}`, v: e.traffic }))}
            />
          </div>
        </Card>
      </div>

      {/* detail modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.company ?? ""} subtitle={`${detail?.id} · ${detail?.category}`} size="lg"
        footer={<>
          <Button variant="ghost" onClick={() => setDetail(null)}>Close</Button>
          <Button variant="danger" icon={<X className="size-4" />} onClick={() => detail && act(detail, false)}>Reject</Button>
          <Button icon={<Check className="size-4" />} onClick={() => detail && act(detail, true)}>Approve & allocate</Button>
        </>}>
        {detail && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-start gap-4 rounded-2xl bg-slate-50 p-4">
              <ExhibitorLogo name={detail.company} bg={detail.logoBg} size={56} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-[17px] font-bold text-slate-900">{detail.company}</h3>
                  <Badge tone={detail.badgeTier === "Platinum" ? "purple" : detail.badgeTier === "Gold" ? "warn" : "neutral"}>{detail.badgeTier} sponsor</Badge>
                </div>
                <p className="mt-1 text-[13px] text-slate-600">{detail.description}</p>
                <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-slate-500">
                  <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {detail.hall}</span>
                  <span className="inline-flex items-center gap-1"><Users className="size-3.5" /> {detail.staff} staff</span>
                  <span className="inline-flex items-center gap-1"><Star className="size-3.5" /> {detail.rating} rated</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              {[
                ["Booth", detail.booth],
                ["Lead score", String(detail.leadScore)],
                ["Traffic", fmt(detail.traffic)],
                ["Revenue", detail.revenue ? money(detail.revenue) : "—"],
              ].map(([l, v]) => (
                <div key={l} className="rounded-xl border border-slate-200 p-3">
                  <p className="text-[10.5px] font-bold uppercase tracking-wide text-slate-400">{l}</p>
                  <p className="mt-0.5 font-display text-[16px] font-bold text-slate-900">{v}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Assign booth"><Select defaultValue={detail.booth}>{["A-04", "A-12", "A-19", "B-04", "B-22", "C-15", "D-11"].map((b) => <option key={b}>{b}</option>)}</Select></Field>
              <Field label="Sponsorship tier"><Select defaultValue={detail.badgeTier}>{["Platinum", "Gold", "Silver", "Bronze"].map((t) => <option key={t}>{t}</option>)}</Select></Field>
            </div>

            <div>
              <p className="mb-2 text-[12.5px] font-semibold text-slate-700">Required documents</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  ["Certificate of incorporation", true],
                  ["Insurance certificate", true],
                  ["Product liability waiver", detail.docs === "Complete"],
                  ["Booth build risk assessment", detail.docs === "Complete"],
                ].map(([n, ok]) => (
                  <div key={n as string} className={cn("flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5", ok ? "border-emerald-200 bg-emerald-50/60" : "border-rose-200 bg-rose-50/60")}>
                    {ok ? <ShieldCheck className="size-4 shrink-0 text-emerald-600" /> : <FileWarning className="size-4 shrink-0 text-rose-600" />}
                    <span className={cn("text-[12.5px] font-medium", ok ? "text-emerald-900" : "text-rose-900")}>{n as string}</span>
                    <span className={cn("ml-auto text-[11px] font-bold", ok ? "text-emerald-600" : "text-rose-600")}>{ok ? "Verified" : "Missing"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[12.5px] font-semibold text-slate-700">Primary contact</p>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5">
                <Avatar src={detail.avatar} name={detail.rep} size={42} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-slate-900">{detail.rep}</p>
                  <p className="text-[11.5px] text-slate-500">Joined {new Date(detail.joined).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
                </div>
                <Button size="sm" variant="secondary" icon={<Mail className="size-4" />}>Message</Button>
              </div>
            </div>

            <Field label="Internal notes" hint="not visible to the exhibitor"><Textarea placeholder="Decision rationale, special requests, negotiated terms…" /></Field>
          </div>
        )}
      </Modal>

      <div className="hidden">{AVATARS.length}</div>
    </div>
  );
}
