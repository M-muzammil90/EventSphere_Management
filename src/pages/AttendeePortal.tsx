import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EXPOS, EXHIBITORS, SESSIONS, NOTIFICATIONS, TESTIMONIALS } from "@/lib/data";
import { Avatar, Badge, Button, Card, CardHeader, EmptyState, Field, Input, Modal, Progress, Reveal, Select, Tabs, Textarea, Toggle } from "@/components/ui";
import { ExpoCard, ExhibitorLogo, SessionCard, StatCard } from "@/components/shared";
import { Sparkline } from "@/components/charts";
import { useStore } from "@/lib/store";
import { cn } from "@/utils/cn";
import {
  Bell, Bookmark, Building2, CalendarClock, CalendarDays, Download, Globe2, MapPin,
  MessageSquare, QrCode, Search, Send, Sparkles, Star, Ticket, Users,
} from "lucide-react";

export default function AttendeePortal() {
  const { user, bookmarks, toast } = useStore();
  const [tab, setTab] = useState("overview");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [contact, setContact] = useState<string | null>(null);

  const saved = SESSIONS.filter((s) => bookmarks.includes(s.id));
  const recommended = useMemo(
    () => EXHIBITORS.filter((e) => e.status === "Approved" && e.rating > 4.6).slice(0, 4),
    []
  );
  const cats = ["All", ...Array.from(new Set(EXHIBITORS.map((e) => e.category)))];
  const filteredEx = EXHIBITORS.filter(
    (e) => (cat === "All" || e.category === cat) && (!q || `${e.company} ${e.category} ${e.products.join(" ")} ${e.country}`.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-100/70">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16.5 items-center gap-3">
            <Link to="/" className="font-display text-[16px] font-extrabold tracking-[-0.03em] text-slate-900">
              Event<span className="text-brand-600">Sphere</span>
            </Link>
            <Badge tone="warn" className="hidden sm:inline-flex">Attendee</Badge>
            <div className="ml-auto flex items-center gap-2">
              <Link to="/expos"><Button size="sm" variant="ghost" className="hidden sm:inline-flex">Browse expos</Button></Link>
              <Link to="/schedule"><Button size="sm" variant="ghost" className="hidden sm:inline-flex">Schedule</Button></Link>
              <Link to="/support"><Button size="sm" variant="ghost" icon={<MessageSquare className="size-4" />} className="hidden sm:inline-flex">Support</Button></Link>
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 py-1 pl-1 pr-3">
                <Avatar src={user?.avatar ?? TESTIMONIALS[2].avatar} name={user?.name} size={30} />
                <div className="hidden leading-tight sm:block">
                  <p className="text-[12px] font-bold text-slate-900">{user?.name?.split(" ")[0] ?? "Daniel"}</p>
                  <p className="text-[10px] text-slate-400">Full Access Pass</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden bg-ink-950">
        <img src={EXPOS[0].cover} alt="" className="absolute inset-0 size-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/85 to-ink-950/60" />
        <div className="pointer-events-none absolute inset-0 grid-noise-dark opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="min-w-0">
              <Badge tone="brand" className="bg-white/10 text-brand-200 ring-white/15">
                <Sparkles className="size-3" /> Global Tech Summit 2026 · 18–21 March
              </Badge>
              <h1 className="mt-4 font-display text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-[34px]">
                Hi {user?.name?.split(" ")[0] ?? "Daniel"}, your agenda is set
              </h1>
              <p className="mt-2 max-w-xl text-[14px] text-slate-300/90">
                You have {bookmarks.length} bookmarked sessions, {recommended.length} recommended exhibitors and a digital badge
                ready to scan.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <Button icon={<QrCode className="size-4.5" />} onClick={() => toast({ title: "Your e-Badge", body: "Show this QR at the fast-lane entrance.", tone: "info" })}>Show my badge</Button>
                <Link to="/floor-plan"><Button variant="outline" icon={<MapPin className="size-4" />}>Open floor plan</Button></Link>
              </div>
            </div>
            <div className="w-[220px] rounded-3xl border border-white/12 bg-white/[0.055] p-5 backdrop-blur-2xl">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-white/45">Your e-Badge</p>
              <div className="mt-3 grid place-items-center rounded-2xl bg-white p-4">
                <QrCode className="size-24 text-slate-900" strokeWidth={1.2} />
              </div>
              <p className="mt-3 text-center font-display text-[14px] font-bold text-white">{user?.name ?? "Daniel Reyes"}</p>
              <p className="text-center text-[11px] text-white/50">Full Access · Hall 4</p>
              <div className="mt-3 rounded-lg bg-emerald-400/15 px-2 py-1.5 text-center text-[10px] font-bold text-emerald-300">
                FAST-LANE ENTRY
              </div>
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
            { id: "agenda", label: "My agenda", count: bookmarks.length },
            { id: "exhibitors", label: "Exhibitors" },
            { id: "expos", label: "Discover expos" },
            { id: "tickets", label: "My tickets" },
            { id: "notifications", label: "Alerts", count: NOTIFICATIONS.length },
          ]}
        />

        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Bookmarked sessions" value={String(bookmarks.length)} icon={<Bookmark className="size-5" />} tone="brand" sub="Reminders enabled" spark={<Sparkline values={[1, 2, 2, 3, 3, 4, bookmarks.length]} color="#6366f1" width={140} height={32} />} />
              <StatCard label="Exhibitors saved" value="12" icon={<Building2 className="size-5" />} tone="info" sub="Across 4 categories" spark={<Sparkline values={[2, 4, 5, 7, 9, 11, 12]} color="#06b6d4" width={140} height={32} />} />
              <StatCard label="Sessions attended" value="9" delta="+3" icon={<CalendarClock className="size-5" />} tone="success" sub="Of 14 booked" spark={<Sparkline values={[1, 2, 4, 5, 6, 8, 9]} color="#10b981" width={140} height={32} />} />
              <StatCard label="Booths visited" value="48" delta="+11" icon={<MapPin className="size-5" />} tone="warn" sub="Out of 486" spark={<Sparkline values={[4, 9, 16, 24, 31, 40, 48]} color="#f97316" width={140} height={32} />} />
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <CardHeader title="Next up in your agenda" subtitle="Reminders fire 45 minutes before each session"
                  right={<Link to="/schedule"><Button size="xs" variant="ghost">Browse schedule</Button></Link>} />
                <div className="space-y-3 p-5">
                  {saved.length === 0 ? (
                    <EmptyState icon={<Bookmark className="size-6" />} title="Nothing bookmarked yet" body="Browse the schedule and tap the bookmark icon on anything you'd like to attend." action={<Link to="/schedule"><Button>Explore sessions</Button></Link>} />
                  ) : (
                    saved.slice(0, 3).map((s) => <SessionCard key={s.id} s={s} compact />)
                  )}
                </div>
              </Card>

              <Card>
                <CardHeader title="Notifications" subtitle="Real-time updates" right={<Badge tone="brand">{NOTIFICATIONS.length} new</Badge>} />
                <div className="divide-y divide-slate-100">
                  {NOTIFICATIONS.map((n) => (
                    <div key={n.id} className="flex gap-3 px-5 py-3.5">
                      <span className={cn("mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl", n.tone === "warn" ? "bg-amber-50 text-amber-600" : n.tone === "success" ? "bg-emerald-50 text-emerald-600" : "bg-brand-50 text-brand-600")}>
                        <Bell className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-bold leading-snug text-slate-900">{n.title}</p>
                        <p className="mt-0.5 text-[11.5px] text-slate-500">{n.body}</p>
                        <p className="mt-1 text-[10.5px] text-slate-400">{n.time} ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card>
              <CardHeader title="Recommended for you" subtitle="Based on the sessions you bookmarked and exhibitors you visited" />
              <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
                {recommended.map((e) => (
                  <div key={e.id} className="rounded-2xl border border-slate-200 p-4 transition hover:border-brand-300 hover:shadow-md">
                    <div className="flex items-start gap-3">
                      <ExhibitorLogo name={e.company} bg={e.logoBg} size={40} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold text-slate-900">{e.company}</p>
                        <p className="truncate text-[11px] text-slate-500">{e.category}</p>
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-[11.5px] leading-snug text-slate-600">{e.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <Badge tone="brand">{e.booth}</Badge>
                      <Button size="xs" variant="ghost" icon={<MessageSquare className="size-3.5" />} onClick={() => setContact(e.company)}>Enquire</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Reveal>
              <Card>
                <CardHeader title="Your expo activity" subtitle="Everything you've done at Global Tech Summit 2026" />
                <div className="p-5">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { i: CalendarDays, l: "Days attended", v: "3 of 4", p: 75 },
                      { i: Ticket, l: "Sessions attended", v: "9 of 14", p: 64 },
                      { i: MapPin, l: "Booths visited", v: "48 of 486", p: 10 },
                      { i: Star, l: "Sessions rated", v: "7 of 9", p: 78 },
                    ].map((a) => (
                      <div key={a.l} className="rounded-2xl border border-slate-200 p-4">
                        <span className="grid size-9 place-items-center rounded-xl bg-brand-50 text-brand-600"><a.i className="size-4" /></span>
                        <p className="mt-3 font-display text-[16px] font-bold text-slate-900">{a.v}</p>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{a.l}</p>
                        <div className="mt-2.5"><Progress value={a.p} height={5} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Reveal>
          </div>
        )}

        {tab === "agenda" && (
          <div className="space-y-6">
            <Card>
              <CardHeader title="My bookmarked sessions" subtitle={`${bookmarks.length} sessions · reminders enabled`}
                right={<Button size="sm" variant="secondary" icon={<Download className="size-4" />} onClick={() => toast({ title: "Agenda exported", body: "Added to your calendar app.", tone: "success" })}>Add to calendar</Button>} />
              {saved.length === 0 ? (
                <EmptyState icon={<Bookmark className="size-6" />} title="Your agenda is empty" body="Bookmark sessions from the schedule and they'll appear here with automatic reminders." action={<Link to="/schedule"><Button icon={<CalendarDays className="size-4" />}>Browse the schedule</Button></Link>} />
              ) : (
                <div className="space-y-3 p-5">
                  {saved.map((s) => <SessionCard key={s.id} s={s} />)}
                </div>
              )}
            </Card>

            {saved.length > 0 && (
              <Card>
                <CardHeader title="Day-by-day plan" subtitle="Your personal route through the expo" />
                <div className="grid gap-4 p-5 lg:grid-cols-4">
                  {["Day 1", "Day 2", "Day 3", "Day 4"].map((d) => {
                    const items = saved.filter((s) => s.day === d);
                    return (
                      <div key={d} className="rounded-2xl bg-slate-50 p-3">
                        <p className="mb-3 px-1 text-[12px] font-bold uppercase tracking-wider text-slate-500">{d}</p>
                        {items.length === 0 ? (
                          <p className="px-1 py-4 text-[12px] text-slate-400">Nothing booked</p>
                        ) : (
                          <div className="space-y-2.5">
                            {items.map((s) => (
                              <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-3">
                                <p className="font-display text-[12px] font-bold text-brand-700">{s.start}</p>
                                <p className="mt-1 text-[12px] font-semibold leading-snug text-slate-900">{s.title}</p>
                                <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500"><MapPin className="size-3" /> {s.stage}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        )}

        {tab === "exhibitors" && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-wrap items-center gap-3 p-4">
                <div className="relative min-w-0 flex-1">
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search exhibitors by company, product or keyword…" className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-[14px] outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/12" />
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                </div>
                <Select value={cat} onChange={(e) => setCat(e.target.value)} className="h-11 min-w-[190px]">
                  {cats.map((c) => <option key={c}>{c === "All" ? "All categories" : c}</option>)}
                </Select>
                <Badge tone="neutral" className="h-8 px-3">{filteredEx.length} results</Badge>
              </div>
            </Card>

            {filteredEx.length === 0 ? (
              <Card><EmptyState icon={<Building2 className="size-6" />} title="No exhibitors found" body="Try a different keyword or widen the category filter." action={<Button variant="secondary" onClick={() => { setQ(""); setCat("All"); }}>Clear filters</Button>} /></Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEx.map((e) => (
                  <Card key={e.id} hover className="p-5">
                    <div className="flex items-start gap-3.5">
                      <ExhibitorLogo name={e.company} bg={e.logoBg} size={48} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-[15px] font-bold text-slate-900">{e.company}</p>
                        <p className="mt-0.5 text-[11.5px] text-slate-500">{e.category}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-[11.5px] font-bold text-slate-700">{e.rating}</span>
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400"><Globe2 className="size-3" /> {e.country}</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3.5 line-clamp-2 text-[12.5px] leading-relaxed text-slate-600">{e.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {e.products.map((p) => <span key={p} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10.5px] font-semibold text-slate-600">{p}</span>)}
                    </div>
                    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3.5">
                      <Badge tone="brand"><MapPin className="size-3" /> {e.booth}</Badge>
                      <span className="text-[11px] text-slate-400">{e.hall}</span>
                      <Button size="xs" variant="ghost" className="ml-auto" icon={<MessageSquare className="size-3.5" />} onClick={() => setContact(e.company)}>Chat</Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "expos" && (
          <div className="space-y-6">
            <Card>
              <CardHeader title="Recommended expos" subtitle="Curated from your interests and past attendance" />
              <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
                {EXPOS.filter((e) => e.status !== "Completed").slice(0, 3).map((e) => (
                  <div key={e.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3.5">
                    <img src={e.cover} alt="" className="size-14 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold text-slate-900">{e.title}</p>
                      <p className="mt-0.5 text-[11.5px] text-slate-500">{e.city}</p>
                      <p className="mt-1 text-[11px] font-semibold text-brand-600">${e.price} / day</p>
                    </div>
                    <Link to={`/expos/${e.slug}`}><Button size="xs" variant="soft">View</Button></Link>
                  </div>
                ))}
              </div>
            </Card>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {EXPOS.filter((e) => e.status !== "Completed").map((e) => <ExpoCard key={e.id} expo={e} />)}
            </div>
          </div>
        )}

        {tab === "tickets" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader title="My tickets" subtitle="Active passes and workshop add-ons" right={<Badge tone="success" dot>Paid</Badge>} />
              <div className="divide-y divide-slate-100">
                {[
                  { n: "Full Access Pass", e: "Global Tech Summit 2026", d: "18–21 March 2026", p: 349, id: "TKT-2026-88214", t: "Full" },
                  { n: "Workshop add-on", e: "Ship a RAG Pipeline in 90 Minutes", d: "18 March · 11:00", p: 120, id: "TKT-2026-88215", t: "Workshop" },
                  { n: "Expo Day Pass", e: "MedExpo International", d: "9 April 2026", p: 199, id: "TKT-2026-90112", t: "Day" },
                ].map((t) => (
                  <div key={t.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                    <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                      <Ticket className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-bold text-slate-900">{t.n}</p>
                      <p className="mt-0.5 text-[12px] text-slate-500">{t.e}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-slate-500">
                        <span className="inline-flex items-center gap-1"><CalendarDays className="size-3" /> {t.d}</span>
                        <span className="font-mono text-[10.5px] text-slate-400">{t.id}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-[18px] font-bold text-slate-900">${t.p}</p>
                      <Badge tone={t.t === "Full" ? "brand" : t.t === "Workshop" ? "purple" : "neutral"} className="mt-1">{t.t}</Badge>
                    </div>
                    <Button size="xs" variant="secondary" icon={<QrCode className="size-3.5" />} onClick={() => toast({ title: "Ticket QR", body: t.id, tone: "info" })}>Show QR</Button>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4">
                <div>
                  <p className="text-[12.5px] font-bold text-slate-900">Total paid</p>
                  <p className="text-[11.5px] text-slate-500">Including VAT · invoices in your email</p>
                </div>
                <p className="font-display text-[22px] font-bold text-slate-900">$668</p>
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white">
                  <Ticket className="size-5" />
                  <p className="mt-3 font-display text-[15px] font-bold">Upgrade your pass</p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/75">
                    Add workshop access and 12 months of session recordings for $120.
                  </p>
                  <Button variant="secondary" size="sm" className="mt-4 w-full" onClick={() => toast({ title: "Upgrade flow", body: "This is a UI preview — no billing connected.", tone: "info" })}>Upgrade now</Button>
                </div>
              </Card>
              <Card>
                <CardHeader title="Purchase history" />
                <div className="divide-y divide-slate-100">
                  {[
                    ["Full Access Pass", "12 Feb 2026", "$349.00"],
                    ["Workshop add-on", "12 Feb 2026", "$120.00"],
                    ["MedExpo Day Pass", "28 Feb 2026", "$199.00"],
                  ].map(([n, d, p]) => (
                    <div key={n} className="flex items-center justify-between gap-3 px-5 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] font-semibold text-slate-800">{n}</p>
                        <p className="text-[11px] text-slate-500">{d}</p>
                      </div>
                      <span className="text-[13px] font-bold text-slate-900">{p}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-100 p-4">
                  <Button full variant="secondary" size="sm" icon={<Download className="size-4" />} onClick={() => toast({ title: "Invoices downloaded", tone: "success" })}>Download invoices</Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {tab === "notifications" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader title="All notifications" subtitle="Schedule changes, reminders and matches" right={<Button size="xs" variant="ghost" onClick={() => toast({ title: "All marked as read", tone: "success" })}>Mark all read</Button>} />
              <div className="divide-y divide-slate-100">
                {[...NOTIFICATIONS, ...NOTIFICATIONS.map((n) => ({ ...n, id: n.id + "-b", time: "1d", title: n.title, body: n.body, tone: n.tone }))].map((n, i) => (
                  <div key={n.id + i} className="flex gap-3 px-5 py-4 transition hover:bg-slate-50/70">
                    <span className={cn("mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl", n.tone === "warn" ? "bg-amber-50 text-amber-600" : n.tone === "success" ? "bg-emerald-50 text-emerald-600" : "bg-brand-50 text-brand-600")}>
                      <Bell className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold leading-snug text-slate-900">{n.title}</p>
                      <p className="mt-0.5 text-[12px] text-slate-500">{n.body}</p>
                      <p className="mt-1 text-[11px] text-slate-400">{n.time} ago</p>
                    </div>
                    {i < 4 && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-600" />}
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardHeader title="Notification settings" subtitle="How and when we contact you" />
              <div className="space-y-5 p-5">
                <Toggle checked label="Session reminders" desc="45 minutes before each bookmarked session" onChange={() => {}} />
                <Toggle checked label="Schedule change alerts" desc="Instant notification for any change" onChange={() => {}} />
                <Toggle checked label="Exhibitor matches" desc="New exhibitors in your interest areas" onChange={() => {}} />
                <Toggle checked={false} label="Email summaries" desc="A daily digest during expo week" onChange={() => {}} />
                <Button variant="secondary" onClick={() => toast({ title: "Settings saved", tone: "success" })}>Save preferences</Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      <Modal open={!!contact} onClose={() => setContact(null)} title={`Message ${contact}`} subtitle="Ask about products, pricing or book a meeting at their booth"
        footer={<>
          <Button variant="ghost" onClick={() => setContact(null)}>Cancel</Button>
          <Button icon={<Send className="size-4" />} onClick={() => { setContact(null); toast({ title: "Message sent", body: `${contact} typically replies within a day.`, tone: "success" }); }}>Send message</Button>
        </>}>
        <div className="space-y-4">
          <Field label="Subject" required><Input defaultValue={`Meeting request at ${contact}`} /></Field>
          <Field label="Preferred day">
            <Select>
              {["Day 1 · 18 March", "Day 2 · 19 March", "Day 3 · 20 March", "Day 4 · 21 March"].map((d) => <option key={d}>{d}</option>)}
            </Select>
          </Field>
          <Field label="Message" required><Textarea placeholder="Hi, I'd like to learn more about…" /></Field>
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3.5 text-[12px] text-slate-600">
            <Users className="size-4 shrink-0 text-slate-400" />
            Your email address is shared with the exhibitor when you send a message.
          </div>
        </div>
      </Modal>
    </div>
  );
}
