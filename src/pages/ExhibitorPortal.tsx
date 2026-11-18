import { useState } from "react";
import { Link } from "react-router-dom";
import { EXHIBITORS, MESSAGES, BOOTHS, SESSIONS } from "@/lib/data";
import { Avatar, Badge, Button, Card, CardHeader, Field, Input, Modal, Progress, Reveal, Select, Tabs, Textarea, Toggle } from "@/components/ui";
import { FloorPlan, StatCard, ExhibitorLogo, SessionCard } from "@/components/shared";
import { AreaChart, BarChart, Gauge, Sparkline } from "@/components/charts";
import { fmt, money, useStore } from "@/lib/store";
import { cn } from "@/utils/cn";
import {
  Activity, Award, Bell, Building2, CalendarClock, Check, Download, FileCheck2, Mail, MapPin, MessageSquare,
  Pencil, ScanLine, Send, Sparkles, Star, Target, TrendingUp, Upload, UserPlus, Users,
} from "lucide-react";

const ME = EXHIBITORS[0];

export default function ExhibitorPortal() {
  const { user, toast } = useStore();
  const [tab, setTab] = useState("overview");
  const [booth, setBooth] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);
  const [notify, setNotify] = useState({ alloc: true, neighbour: true, leads: true, digest: false });

  const STAFF = [
    { n: "Amara Osei", r: "Booth Lead", e: "amara@nexoracloud.com", b: "Lead scanner, full access", a: ME.avatar },
    { n: "Daniel Cho", r: "Sales Engineer", e: "daniel@nexoracloud.com", b: "Lead scanner", a: EXHIBITORS[2].avatar },
    { n: "Lucia Ferrer", r: "Demo Specialist", e: "lucia@nexoracloud.com", b: "Demo area only", a: EXHIBITORS[3].avatar },
    { n: "Tom Berger", r: "Field Marketer", e: "tom@nexoracloud.com", b: "Lead scanner, full access", a: EXHIBITORS[4].avatar },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70">
      {/* portal header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16.5 items-center gap-3">
            <Link to="/" className="font-display text-[16px] font-extrabold tracking-[-0.03em] text-slate-900">
              Event<span className="text-brand-600">Sphere</span>
            </Link>
            <Badge tone="info" className="hidden sm:inline-flex">Exhibitor portal</Badge>
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" variant="secondary" icon={<Bell className="size-4" />} onClick={() => toast({ title: "3 unread notifications", tone: "info" })} className="hidden sm:inline-flex">Alerts</Button>
              <Link to="/support"><Button size="sm" variant="ghost" icon={<MessageSquare className="size-4" />} className="hidden sm:inline-flex">Support</Button></Link>
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 py-1 pl-1 pr-3">
                <Avatar src={user?.avatar ?? ME.avatar} name={user?.name ?? ME.rep} size={30} />
                <div className="hidden leading-tight sm:block">
                  <p className="text-[12px] font-bold text-slate-900">{ME.company}</p>
                  <p className="text-[10px] text-slate-400">Booth {ME.booth}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* hero band */}
      <section className="relative overflow-hidden bg-ink-950">
        <div className="absolute inset-0 grid-noise-dark opacity-50" />
        <div className="pointer-events-none absolute -left-24 -top-24 size-[380px] rounded-full bg-brand-600/25 blur-[110px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 size-[380px] rounded-full bg-aqua-500/15 blur-[110px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-6">
            <ExhibitorLogo name={ME.company} bg={ME.logoBg} size={72} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-[26px] font-extrabold tracking-[-0.025em] text-white">{ME.company}</h1>
                <Badge tone="purple" className="bg-white/10 text-purple-200 ring-white/15">{ME.badgeTier} exhibitor</Badge>
                <Badge tone="success" className="bg-white/10 text-emerald-200 ring-white/15" dot>Approved</Badge>
              </div>
              <p className="mt-2 max-w-2xl text-[13.5px] text-slate-300/90">{ME.description}</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-slate-400">
                <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" /> Booth {ME.booth} · {ME.hall}</span>
                <span className="inline-flex items-center gap-1.5"><Users className="size-3.5" /> {ME.staff} staff badges</span>
                <span className="inline-flex items-center gap-1.5"><Star className="size-3.5" /> {ME.rating} exhibitor rating</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Button variant="outline" icon={<Pencil className="size-4" />} onClick={() => setEditProfile(true)}>Edit profile</Button>
              <Button icon={<ScanLine className="size-4" />} onClick={() => toast({ title: "Lead scanner", body: "Opens the camera view for badge scanning.", tone: "info" })}>Open lead scanner</Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs
          active={tab}
          onChange={setTab}
          className="mb-6 w-fit max-w-full"
          tabs={[
            { id: "overview", label: "Overview" },
            { id: "booth", label: "Booth & floor plan" },
            { id: "leads", label: "Leads" },
            { id: "staff", label: "Staff & badges" },
            { id: "messages", label: "Messages", count: MESSAGES.length },
            { id: "docs", label: "Documents" },
            { id: "settings", label: "Settings" },
          ]}
        />

        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Badge scans" value={fmt(ME.traffic)} delta="+11.2%" icon={<ScanLine className="size-5" />} tone="brand" sub="Total interactions at your booth" spark={<Sparkline values={[320, 410, 480, 520, 610, 680, 742]} color="#6366f1" width={140} height={32} />} />
              <StatCard label="Qualified leads" value={fmt(Math.round(ME.traffic * 0.61))} delta="+18.6%" icon={<Target className="size-5" />} tone="success" sub="61% qualification rate" spark={<Sparkline values={[190, 220, 260, 290, 330, 360, 392]} color="#10b981" width={140} height={32} />} />
              <StatCard label="Meetings booked" value="214" delta="+9.4%" icon={<CalendarClock className="size-5" />} tone="info" sub="Across 4 expo days" spark={<Sparkline values={[12, 24, 38, 62, 88, 121, 152]} color="#06b6d4" width={140} height={32} />} />
              <StatCard label="Pipeline value" value={money(ME.revenue)} delta="+22.1%" icon={<TrendingUp className="size-5" />} tone="warn" sub="Deals closed from expo leads" spark={<Sparkline values={[22, 31, 42, 58, 71, 88, 104]} color="#f97316" width={140} height={32} />} />
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <CardHeader title="Booth traffic trend" subtitle="Daily badge scans at booth A-12" right={<Badge tone="brand">This edition</Badge>} />
                <div className="p-5">
                  <AreaChart
                    data={[
                      { label: "D1", a: 620, b: 480 }, { label: "D2", a: 980, b: 710 }, { label: "D3", a: 1240, b: 820 },
                      { label: "D4", a: 1080, b: 910 }, { label: "D5", a: 900, b: 640 },
                    ]}
                    format={fmt}
                    height={250}
                    labels={["This edition", "Previous edition"]}
                  />
                </div>
              </Card>
              <Card>
                <CardHeader title="Lead quality" subtitle="Scored by our enrichment model" />
                <div className="flex flex-col items-center p-5">
                  <Gauge value={ME.leadScore} label="Lead score" sub="Top 8% of exhibitors at this expo" size={168} />
                  <div className="mt-4 w-full space-y-2">
                    {[["Hot", 38], ["Warm", 44], ["Nurture", 18]].map(([l, v]) => (
                      <div key={l as string} className="flex items-center gap-2.5">
                        <span className="w-16 text-[12px] font-semibold text-slate-600">{l as string}</span>
                        <Progress value={v as number} className="flex-1" height={6} tone={l === "Hot" ? "danger" : l === "Warm" ? "warn" : "brand"} />
                        <span className="w-8 text-right text-[12px] font-bold text-slate-900">{v as number}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader title="Sessions you're speaking at" subtitle="Your team is on the programme" right={<Link to="/schedule"><Button size="xs" variant="ghost">Full schedule</Button></Link>} />
                <div className="space-y-3 p-5">
                  {SESSIONS.filter((s) => s.speaker.includes("Elena") || s.speaker.includes("Marcus")).slice(0, 3).map((s) => <SessionCard key={s.id} s={s} compact />)}
                </div>
              </Card>
              <Card>
                <CardHeader title="Neighbouring exhibitors" subtitle="Zone A — say hello" right={<Badge tone="info">Collab</Badge>} />
                <div className="divide-y divide-slate-100">
                  {EXHIBITORS.filter((e) => e.booth.startsWith("A") && e.id !== ME.id).slice(0, 4).map((e) => (
                    <div key={e.id} className="flex items-center gap-3 px-5 py-3.5">
                      <ExhibitorLogo name={e.company} bg={e.logoBg} size={36} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12.5px] font-bold text-slate-900">{e.company}</p>
                        <p className="text-[11px] text-slate-500">Booth {e.booth}</p>
                      </div>
                      <Button size="xs" variant="ghost" icon={<MessageSquare className="size-3.5" />} onClick={() => toast({ title: `Message to ${e.company}`, body: "Thread opened in Messages.", tone: "info" })}>Chat</Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Reveal>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { i: Upload, t: "Upload assets", d: "Logos, product photos, videos", tone: "from-brand-500 to-violet-600" },
                  { i: UserPlus, t: "Add staff badges", d: `${8 - ME.staff} of 8 badges left`, tone: "from-cyan-500 to-blue-600" },
                  { i: Award, t: "Upgrade sponsorship", d: "Platinum still available", tone: "from-amber-400 to-flame-500" },
                  { i: Download, t: "Export leads", d: "CSV, XLSX or CRM sync", tone: "from-emerald-500 to-teal-600" },
                ].map((a) => (
                  <button key={a.t} onClick={() => toast({ title: a.t, body: "Panel opened.", tone: "info" })} className="text-left">
                    <Card hover className="group flex h-full items-center gap-4 p-4">
                      <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform group-hover:scale-105", a.tone)}><a.i className="size-5" /></span>
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-bold text-slate-900">{a.t}</p>
                        <p className="mt-0.5 text-[11.5px] leading-snug text-slate-500">{a.d}</p>
                      </div>
                    </Card>
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
        )}

        {tab === "booth" && (
          <div className="space-y-6">
            <Card>
              <CardHeader title="Your booth" subtitle="Current allocation and build details" right={<Badge tone="success" dot>Confirmed</Badge>} />
              <div className="grid gap-5 p-5 lg:grid-cols-[1.4fr_1fr]">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Booth ID", ME.booth],
                    ["Location", ME.hall],
                    ["Type", "Island · 4 open sides"],
                    ["Size", "72 m² (9m × 8m)"],
                    ["Included", "3-phase power · Wi-Fi · rigging"],
                    ["Rate paid", money(12000)],
                  ].map(([l, v]) => (
                    <div key={l} className="rounded-xl border border-slate-200 p-3.5">
                      <p className="text-[10.5px] font-bold uppercase tracking-wide text-slate-400">{l}</p>
                      <p className="mt-1 text-[13.5px] font-bold text-slate-900">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white">
                  <Sparkles className="size-5" />
                  <p className="mt-3 font-display text-[15px] font-bold">Upgrade or relocate</p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/75">
                    34 booths remain available across Hall 4. Relocations are free until 14 days before build-up.
                  </p>
                  <Button variant="secondary" size="sm" className="mt-4 w-full" onClick={() => toast({ title: "Relocation request", body: "Our team will confirm within 4 hours.", tone: "success" })}>Request a change</Button>
                </div>
              </div>
            </Card>

            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-[18px] font-bold tracking-tight text-slate-900">Reserve a different booth</h3>
                  <p className="mt-1 text-[13px] text-slate-500">Click any green booth to select it, then confirm your reservation.</p>
                </div>
                {booth && <Badge tone="brand">Selected: {booth}</Badge>}
              </div>
              <FloorPlan mode="select" selected={booth} onSelect={setBooth} height={520} />
              {booth && (
                <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50/70 p-4">
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-600 text-white"><Check className="size-5" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-bold text-brand-900">Booth {booth} selected</p>
                    <p className="mt-0.5 text-[12px] text-brand-800/75">
                      {BOOTHS.find((b) => b.id === booth)?.sqm} m² · {money(BOOTHS.find((b) => b.id === booth)?.price ?? 0)} — subject to organizer approval.
                    </p>
                  </div>
                  <Button onClick={() => setConfirm(true)}>Request reservation</Button>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "leads" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total scans" value={fmt(ME.traffic)} icon={<ScanLine className="size-5" />} tone="brand" sub="All interactions" />
              <StatCard label="Qualified" value={fmt(Math.round(ME.traffic * 0.61))} icon={<Target className="size-5" />} tone="success" sub="Meet sales criteria" />
              <StatCard label="Meetings" value="214" icon={<CalendarClock className="size-5" />} tone="info" sub="Booked on-site" />
              <StatCard label="Closed won" value="89" delta="+14.0%" icon={<Award className="size-5" />} tone="warn" sub={`${money(ME.revenue)} pipeline`} />
            </div>

            <Card>
              <CardHeader
                title="Captured leads"
                subtitle={`${Math.round(ME.traffic * 0.61)} qualified leads from ${fmt(ME.traffic)} scans`}
                right={<Button size="sm" variant="secondary" icon={<Download className="size-4" />} onClick={() => toast({ title: "Leads exported", body: "leads-2026-03-21.csv", tone: "success" })}>Export CSV</Button>}
              />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-[13.5px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      {["Contact", "Company", "Interest", "Scanned", "Score", "Status", ""].map((h) => (
                        <th key={h} className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Elena Marsh", "Northwind Retail", "Kubernetes Platform", "Day 2 · 11:42", 94, "Hot"],
                      ["Rahul Mehta", "Vantage Bank", "Managed DB", "Day 2 · 13:08", 88, "Hot"],
                      ["Clara Oswald", "BlueOrbit Logistics", "Edge CDN", "Day 3 · 10:15", 76, "Warm"],
                      ["Tomás Silva", "Helix Pharma", "Kubernetes Platform", "Day 3 · 14:52", 71, "Warm"],
                      ["Nina Bergström", "Arctic Freight", "Managed DB", "Day 3 · 16:20", 58, "Nurture"],
                      ["Omar Haddad", "Zenith Media", "Edge CDN", "Day 4 · 09:35", 46, "Nurture"],
                    ].map(([n, c, i, s, sc, st]) => (
                      <tr key={n as string} className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60">
                        <td>
                          <div className="flex items-center gap-2.5">
                            <Avatar name={n as string} size={30} />
                            <span className="font-semibold text-slate-900">{n as string}</span>
                          </div>
                        </td>
                        <td className="text-slate-600">{c as string}</td>
                        <td><Badge tone="neutral" className="bg-slate-50">{i as string}</Badge></td>
                        <td className="whitespace-nowrap text-slate-600">{s as string}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Progress value={sc as number} className="w-14" height={5} tone={(sc as number) > 85 ? "danger" : (sc as number) > 65 ? "warn" : "brand"} />
                            <span className="text-[11.5px] font-bold tabular-nums text-slate-700">{sc as number}</span>
                          </div>
                        </td>
                        <td><Badge tone={st === "Hot" ? "danger" : st === "Warm" ? "warn" : "brand"}>{st as string}</Badge></td>
                        <td><Button size="xs" variant="ghost" icon={<Mail className="size-3.5" />} onClick={() => toast({ title: `Follow-up sent to ${n}`, tone: "success" })}>Follow up</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader title="Scans by day" subtitle="Booth A-12 traffic" />
                <div className="p-5"><BarChart color="#6366f1" height={200} showValues format={fmt} data={[{ label: "D1", v: 620 }, { label: "D2", v: 980 }, { label: "D3", v: 1240 }, { label: "D4", v: 1080 }, { label: "D5", v: 900 }]} /></div>
              </Card>
              <Card>
                <CardHeader title="Product interest" subtitle="Which of your offerings drew attention" />
                <div className="p-5">
                  <BarChart horizontal color="#06b6d4" format={fmt} data={ME.products.map((p, i) => ({ label: p, v: [2140, 1620, 1060][i] ?? 800 }))} />
                </div>
              </Card>
            </div>
          </div>
        )}

        {tab === "staff" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Badges allocated" value={`${ME.staff} / 8`} icon={<Users className="size-5" />} tone="brand" sub="Included with your tier" />
              <StatCard label="Lead scanners" value="4" icon={<ScanLine className="size-5" />} tone="info" sub="Devices enabled" />
              <StatCard label="Demo slots" value="3" icon={<Activity className="size-5" />} tone="success" sub="Booked at Demo Arena" />
            </div>
            <Card>
              <CardHeader title="Staff & badges" subtitle="Manage who represents your company on the floor"
                right={<Button size="sm" icon={<UserPlus className="size-4" />} onClick={() => setStaffOpen(true)}>Add staff member</Button>} />
              <div className="divide-y divide-slate-100">
                {STAFF.map((s) => (
                  <div key={s.e} className="flex flex-wrap items-center gap-3 px-5 py-4">
                    <Avatar src={s.a} name={s.n} size={42} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-bold text-slate-900">{s.n}</p>
                      <p className="text-[12px] text-slate-500">{s.e}</p>
                    </div>
                    <Badge tone={s.r === "Booth Lead" ? "purple" : s.r === "Sales Engineer" ? "brand" : "neutral"}>{s.r}</Badge>
                    <Badge tone="neutral" className="bg-slate-50">{s.b}</Badge>
                    <Button size="xs" variant="ghost" icon={<Pencil className="size-3.5" />} onClick={() => toast({ title: "Editing badge", body: s.n, tone: "info" })}>Edit</Button>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 bg-slate-50/70 p-5">
                <p className="text-[12.5px] text-slate-600">
                  Badges are issued as QR codes delivered by email. Staff can scan attendee badges using the EventSphere mobile
                  app — no hardware needed.
                </p>
              </div>
            </Card>
          </div>
        )}

        {tab === "messages" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader title="Inbox" subtitle={`${MESSAGES.filter((m) => m.unread).length} unread`} />
              <div className="divide-y divide-slate-100">
                {MESSAGES.map((m) => (
                  <button key={m.id} onClick={() => toast({ title: "Thread opened", body: m.subject, tone: "info" })} className="flex w-full gap-3 px-5 py-3.5 text-left transition hover:bg-slate-50/70">
                    <span className="relative shrink-0">
                      {m.avatar ? <Avatar src={m.avatar} name={m.from} size={38} /> : (
                        <span className="grid size-9.5 place-items-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-white"><Building2 className="size-4" /></span>
                      )}
                      {m.unread && <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-brand-600 ring-2 ring-white" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className={cn("truncate text-[13px]", m.unread ? "font-bold text-slate-900" : "font-semibold text-slate-700")}>{m.from}</p>
                        <span className="shrink-0 text-[10.5px] text-slate-400">{m.date}</span>
                      </div>
                      <p className="mt-0.5 truncate text-[12px] text-slate-500">{m.subject}</p>
                      <p className="mt-0.5 line-clamp-1 text-[11.5px] text-slate-400">{m.preview}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
            <Card>
              <CardHeader title="Message the organizers" subtitle="Typical reply within 4 hours" />
              <div className="space-y-4 p-5">
                <Field label="Topic"><Select>{["Booth & build", "Power & rigging", "Shipping & storage", "Billing", "Lead scanner", "Other"].map((t) => <option key={t}>{t}</option>)}</Select></Field>
                <Field label="Message" required><Textarea placeholder="How can we help?" /></Field>
                <Button icon={<Send className="size-4" />} onClick={() => toast({ title: "Message sent", body: "EventSphere Organizing Team will reply shortly.", tone: "success" })}>Send message</Button>
                <div className="rounded-xl bg-brand-50 p-4 text-[12.5px] leading-relaxed text-brand-900">
                  <b>Neighbour channel:</b> you can also message exhibitors in adjacent booths directly — great for co-hosted
                  demos and shared storage.
                </div>
              </div>
            </Card>
          </div>
        )}

        {tab === "docs" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader title="Required documents" subtitle="Status of your compliance pack" right={<Badge tone="success" dot>Complete</Badge>} />
              <div className="grid gap-3 p-5 sm:grid-cols-2">
                {[
                  ["Certificate of incorporation", "Verified", "12 Jan 2026"],
                  ["Public liability insurance", "Verified", "12 Jan 2026"],
                  ["Product liability waiver", "Verified", "18 Jan 2026"],
                  ["Booth build risk assessment", "Verified", "02 Feb 2026"],
                  ["Staff list & badge photos", "Verified", "09 Feb 2026"],
                  ["Electrical certificate", "Verified", "14 Feb 2026"],
                ].map(([n, s, d]) => (
                  <div key={n} className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-3.5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600"><FileCheck2 className="size-4" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-bold text-slate-900">{n}</p>
                      <p className="text-[11px] text-slate-500">Uploaded {d}</p>
                    </div>
                    <Badge tone="success">{s}</Badge>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardHeader title="Upload a document" subtitle="PDF, JPG or PNG · max 10 MB" />
              <div className="p-5">
                <button onClick={() => toast({ title: "File picker opened", tone: "info" })} className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 px-4 py-10 text-center transition hover:border-brand-400 hover:bg-brand-50/40">
                  <span className="grid size-12 place-items-center rounded-2xl bg-white text-brand-600 shadow-sm"><Upload className="size-5" /></span>
                  <p className="mt-3.5 text-[13px] font-bold text-slate-900">Drop a file here or click to browse</p>
                  <p className="mt-1 text-[11.5px] text-slate-500">Your documents are encrypted at rest</p>
                </button>
                <div className="mt-5 space-y-2.5">
                  {[["Under review", 1], ["Verified", 6], ["Rejected", 0]].map(([l, v]) => (
                    <div key={l as string} className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5">
                      <span className="text-[12.5px] font-medium text-slate-600">{l as string}</span>
                      <span className="text-[13px] font-bold text-slate-900">{v as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {tab === "settings" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader title="Company profile" subtitle="Shown to attendees in the exhibitor directory" />
              <div className="space-y-4 p-5">
                <Field label="Company name" required><Input defaultValue={ME.company} /></Field>
                <Field label="Category"><Input defaultValue={ME.category} /></Field>
                <Field label="Website"><Input defaultValue="https://nexoracloud.com" /></Field>
                <Field label="Country"><Select defaultValue={ME.country}>{["United States", "Germany", "Switzerland", "Singapore", "Netherlands", "United Kingdom"].map((c) => <option key={c}>{c}</option>)}</Select></Field>
                <Field label="Description"><Textarea defaultValue={ME.description} /></Field>
                <Field label="Products / services showcased"><Input defaultValue={ME.products.join(", ")} /></Field>
                <Button onClick={() => toast({ title: "Profile saved", tone: "success" })}>Save profile</Button>
              </div>
            </Card>
            <div className="space-y-6">
              <Card>
                <CardHeader title="Notifications" subtitle="What you want to hear about" />
                <div className="space-y-5 p-5">
                  <Toggle checked={notify.alloc} label="Booth & allocation changes" desc="Any change affecting your space" onChange={(v) => setNotify({ ...notify, alloc: v })} />
                  <Toggle checked={notify.neighbour} label="Neighbour messages" desc="Messages from adjacent exhibitors" onChange={(v) => setNotify({ ...notify, neighbour: v })} />
                  <Toggle checked={notify.leads} label="New lead alerts" desc="Real-time when a badge is scanned" onChange={(v) => setNotify({ ...notify, leads: v })} />
                  <Toggle checked={notify.digest} label="Daily performance digest" desc="Emailed each evening during the expo" onChange={(v) => setNotify({ ...notify, digest: v })} />
                </div>
              </Card>
              <Card>
                <CardHeader title="Privacy" subtitle="Control what attendees can see" />
                <div className="space-y-5 p-5">
                  <Toggle checked label="Show booth location on floor plan" desc="Attendees can find you" onChange={() => {}} />
                  <Toggle checked label="Allow attendee chat requests" desc="Receive enquiries in Messages" onChange={() => {}} />
                  <Toggle checked={false} label="Show email address publicly" desc="Only shown if enabled" onChange={() => {}} />
                  <Button variant="secondary" onClick={() => toast({ title: "Privacy settings saved", tone: "success" })}>Save</Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* modals */}
      <Modal open={confirm} onClose={() => setConfirm(false)} title="Confirm booth reservation" subtitle={`Booth ${booth} · Global Tech Summit 2026`} size="md"
        footer={<>
          <Button variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button>
          <Button onClick={() => { setConfirm(false); setBooth(null); toast({ title: "Reservation requested 🎉", body: "The organizer will confirm within 4 hours.", tone: "success" }); }}>Confirm reservation</Button>
        </>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[["Booth", booth ?? "—"], ["Zone", (booth ?? "A").split("-")[0]], ["Size", `${BOOTHS.find((b) => b.id === booth)?.sqm ?? 0} m²`], ["Rate", money(BOOTHS.find((b) => b.id === booth)?.price ?? 0)]].map(([l, v]) => (
              <div key={l} className="rounded-xl border border-slate-200 p-3">
                <p className="text-[10.5px] font-bold uppercase tracking-wide text-slate-400">{l}</p>
                <p className="mt-0.5 font-display text-[15px] font-bold text-slate-900">{v}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-brand-50 p-4 text-[12.5px] leading-relaxed text-brand-900">
            Your current booth {ME.booth} will be released once this reservation is approved by the organizer. No payment is
            taken until confirmation.
          </div>
        </div>
      </Modal>

      <Modal open={editProfile} onClose={() => setEditProfile(false)} title="Edit exhibitor profile" subtitle="Your public listing in the expo directory" size="lg"
        footer={<>
          <Button variant="ghost" onClick={() => setEditProfile(false)}>Cancel</Button>
          <Button onClick={() => { setEditProfile(false); toast({ title: "Profile updated", body: "Live in the exhibitor directory.", tone: "success" }); }}>Save profile</Button>
        </>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company name" required className="sm:col-span-2"><Input defaultValue={ME.company} /></Field>
          <Field label="Primary contact"><Input defaultValue={ME.rep} /></Field>
          <Field label="Contact email"><Input defaultValue="amara@nexoracloud.com" /></Field>
          <Field label="Category"><Select defaultValue={ME.category}>{["Cloud Infrastructure", "Industrial Automation", "Medical Devices", "Renewables", "Data & AI", "Cybersecurity"].map((c) => <option key={c}>{c}</option>)}</Select></Field>
          <Field label="Country"><Select defaultValue={ME.country}>{["United States", "Germany", "Switzerland", "Singapore"].map((c) => <option key={c}>{c}</option>)}</Select></Field>
          <Field label="Description" className="sm:col-span-2"><Textarea defaultValue={ME.description} /></Field>
          <div className="sm:col-span-2">
            <p className="mb-2 text-[12.5px] font-semibold text-slate-700">Logo</p>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5">
              <ExhibitorLogo name={ME.company} bg={ME.logoBg} size={44} />
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-bold text-slate-900">nexora-logo.svg</p>
                <p className="text-[11px] text-slate-500">SVG · 18 KB</p>
              </div>
              <Button size="sm" variant="secondary" icon={<Upload className="size-4" />}>Replace</Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={staffOpen} onClose={() => setStaffOpen(false)} title="Add a staff member" subtitle="They'll receive an e-Badge by email" size="md"
        footer={<>
          <Button variant="ghost" onClick={() => setStaffOpen(false)}>Cancel</Button>
          <Button onClick={() => { setStaffOpen(false); toast({ title: "Staff member added", body: "Badge invitation sent.", tone: "success" }); }}>Send badge invitation</Button>
        </>}>
        <div className="grid gap-4">
          <Field label="Full name" required><Input placeholder="Jordan Ellis" /></Field>
          <Field label="Email address" required><Input type="email" placeholder="jordan@nexoracloud.com" /></Field>
          <Field label="Role at the booth"><Select>{["Booth Lead", "Sales Engineer", "Demo Specialist", "Field Marketer", "Support"].map((r) => <option key={r}>{r}</option>)}</Select></Field>
          <Field label="Permissions"><Select>{["Lead scanner, full access", "Lead scanner only", "Demo area only"].map((p) => <option key={p}>{p}</option>)}</Select></Field>
        </div>
      </Modal>
    </div>
  );
}
