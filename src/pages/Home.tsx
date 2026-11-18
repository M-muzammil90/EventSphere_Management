import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MEDIA, EXPOS, TESTIMONIALS, PARTNERS, FEATURES, IMG } from "@/lib/data";
import { Badge, Button, Card, CountUp, Reveal, SectionHeading } from "@/components/ui";
import { Sparkline, LiveChart } from "@/components/charts";
import { DateChip, SearchPill, Shell } from "@/components/SiteLayout";
import { cn } from "@/utils/cn";
import { fmt } from "@/lib/store";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Map,
  MapPin,
  MessagesSquare,
  MousePointerClick,
  Play,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  LayoutDashboard, Map, ShieldCheck, BarChart3, MessagesSquare, CalendarClock,
};

/* ================================ HERO ================================ */
function Hero() {
  const vid = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [stats, setStats] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setStats(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-ink-950">
      {/* video layer */}
      <div className="absolute inset-0 -z-10">
        <video
          ref={vid}
          autoPlay
          loop
          muted={muted}
          playsInline
          poster={MEDIA.heroPoster}
          className="size-full object-cover"
        >
          <source src={MEDIA.heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/78 to-ink-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(99,102,241,.34),transparent_55%),radial-gradient(ellipse_at_85%_75%,rgba(6,182,212,.24),transparent_50%)]" />
        <div className="absolute inset-0 grid-noise-dark opacity-50" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
          {/* left */}
          <div>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.07] py-1.5 pl-1.5 pr-4 backdrop-blur">
              <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-500 to-aqua-500 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-white">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                </span>
                Live now
              </span>
              <span className="text-[12.5px] font-medium text-white/80">
                Industrial Innovate Fair · Munich — <b className="text-white">9,310</b> on floor
              </span>
            </div>

            <h1 className="mt-7 font-display text-[38px] font-extrabold leading-[1.04] tracking-[-0.035em] text-white sm:text-[54px] lg:text-[62px]">
              Run world-class
              <br />
              expos <span className="text-gradient">without</span>
              <br />
              the chaos.
            </h1>

            <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-slate-300/90 sm:text-[17px]">
              EventSphere replaces manual registration, disjointed email threads and printed floor plans with one live
              platform — for <b className="text-white">organizers</b>, <b className="text-white">exhibitors</b> and{" "}
              <b className="text-white">attendees</b>.
            </p>

            <div className="mt-9 max-w-xl">
              <SearchPill onClick={() => nav("/expos")} />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/expos">
                <Button size="lg" icon={<Sparkles className="size-4.5" />} iconRight={<ArrowRight className="size-4.5" />}>
                  Explore expos
                </Button>
              </Link>
              <Link to="/register?role=organizer">
                <Button size="lg" variant="outline" icon={<Play className="size-4" />}>
                  Host an expo
                </Button>
              </Link>
              <button
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? "Unmute background video" : "Mute background video"}
                className="grid size-12 place-items-center rounded-2xl border border-white/15 bg-white/[0.07] text-white/70 backdrop-blur transition hover:bg-white/15 hover:text-white"
              >
                {muted ? <VolumeX className="size-4.5" /> : <Volume2 className="size-4.5" />}
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-[12.5px] text-slate-400">
              <span className="inline-flex items-center gap-2">
                <div className="flex -space-x-2.5">
                  {TESTIMONIALS.map((t) => (
                    <img key={t.name} src={t.avatar} alt="" className="size-7 rounded-full object-cover ring-2 ring-ink-950" />
                  ))}
                </div>
                Trusted by 1,200+ exhibitor teams
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <b className="text-white">4.9</b>/5 · 386 reviews
              </span>
            </div>
          </div>

          {/* right — live dashboard preview */}
          <Reveal delay={150} y={30}>
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[36px] bg-gradient-to-br from-brand-500/25 via-transparent to-aqua-500/20 blur-2xl" />
              <div className="overflow-hidden rounded-[26px] border border-white/12 bg-white/[0.055] shadow-[0_40px_100px_-30px_rgba(0,0,0,.8)] backdrop-blur-2xl">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <span className="size-2.5 rounded-full bg-rose-400/80" />
                  <span className="size-2.5 rounded-full bg-amber-400/80" />
                  <span className="size-2.5 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 truncate rounded-md bg-white/8 px-2.5 py-1 text-[11px] font-medium text-white/60">
                    eventsphere.app/admin/overview
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-emerald-400/15 px-2 py-1 text-[10px] font-bold text-emerald-300">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" /> REAL-TIME
                  </span>
                </div>

                <div className="space-y-3.5 p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { l: "On-floor now", v: 9310, s: [12, 18, 15, 22, 19, 27, 31], c: "#22d3ee", d: "+18.4%" },
                      { l: "Booths sold", v: 297, s: [40, 44, 43, 52, 58, 61, 63], c: "#818cf8", d: "+7.2%" },
                    ].map((k) => (
                      <div key={k.l} className="rounded-2xl border border-white/10 bg-white/[0.05] p-3.5">
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-white/45">{k.l}</p>
                        <div className="mt-1.5 flex items-end justify-between gap-2">
                          <p className="font-display text-[22px] font-bold leading-none text-white">
                            {stats ? <CountUp to={k.v} /> : 0}
                          </p>
                          <Sparkline values={k.s} color={k.c} width={62} height={26} />
                        </div>
                        <p className="mt-2 inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-300">
                          <TrendingUp className="size-3" /> {k.d}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3.5">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[10.5px] font-bold uppercase tracking-wider text-white/45">Hall traffic · live</p>
                      <span className="rounded-md bg-white/8 px-1.5 py-0.5 text-[9.5px] font-bold text-white/50">30s refresh</span>
                    </div>
                    <LiveChart height={72} />
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3.5">
                    <div className="space-y-2.5">
                      {[
                        ["A-12 · Nexora Cloud", 92, "from-brand-500 to-violet-500"],
                        ["B-04 · Lumen Robotics", 78, "from-cyan-500 to-aqua-500"],
                        ["A-19 · CyberFortis", 64, "from-amber-400 to-flame-500"],
                      ].map(([n, v, g]) => (
                        <div key={n as string}>
                          <div className="mb-1 flex justify-between text-[11px]">
                            <span className="font-medium text-white/70">{n}</span>
                            <span className="font-bold text-white">{v}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                            <div className={cn("h-full rounded-full bg-gradient-to-r", g)} style={{ width: `${v}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-4 hidden animate-float items-center gap-2.5 rounded-2xl border border-white/15 bg-ink-900/90 px-3.5 py-2.5 shadow-2xl backdrop-blur sm:flex">
                <span className="grid size-8 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300">
                  <Zap className="size-4" />
                </span>
                <div className="leading-tight">
                  <p className="text-[11.5px] font-bold text-white">Booth A-19 reserved</p>
                  <p className="text-[10px] text-white/50">CyberFortis · 1 min ago</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* stat strip */}
      <div className="relative border-t border-white/10 bg-ink-950/60 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-white/10 px-4 sm:px-6 lg:grid-cols-4 lg:divide-x lg:px-8">
          {[
            { l: "Expos delivered", v: 480, s: "+" },
            { l: "Exhibitors managed", v: 12400, s: "+" },
            { l: "Attendee check-ins", v: 3.2, s: "M", d: 1 },
            { l: "Avg. setup time", v: 38, s: " min" },
          ].map((s) => (
            <div key={s.l} className="px-2 py-7 text-center lg:px-6">
              <p className="font-display text-[28px] font-extrabold tracking-tight text-white sm:text-[34px]">
                {stats ? <CountUp to={s.v} decimals={s.d ?? 0} suffix={s.s} /> : 0}
              </p>
              <p className="mt-1 text-[11.5px] font-semibold uppercase tracking-wider text-white/45">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== PARTNERS ============================== */
function Partners() {
  const row = [...PARTNERS, ...PARTNERS];
  return (
    <section className="border-b border-slate-100 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Powering exhibit programmes at
        </p>
        <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-14">
            {row.map((p, i) => (
              <span key={i} className="font-display text-[19px] font-bold tracking-tight text-slate-300 transition hover:text-slate-500">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================== FEATURES ============================= */
function Features() {
  return (
    <section id="features" className="relative overflow-hidden bg-slate-50/70 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 grid-noise opacity-70" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            center
            eyebrow="Platform"
            title={<>Everything an expo needs, <span className="text-gradient-dark">nothing it doesn't</span></>}
            body="Six tightly-integrated modules replace the spreadsheet-and-email stack most expo teams still run on."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = ICONS[f.icon] ?? LayoutDashboard;
            return (
              <Reveal key={f.title} delay={i * 70}>
                <Card hover className="group h-full overflow-hidden p-6">
                  <div className="absolute inset-x-0 top-0 h-[3px] scale-x-0 bg-gradient-to-r from-brand-500 to-aqua-500 transition-transform duration-500 group-hover:scale-x-100" />
                  <div className="relative grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 ring-1 ring-brand-100 transition-all duration-500 group-hover:from-brand-500 group-hover:to-brand-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-500/30">
                    <Icon className="size-5.5" />
                  </div>
                  <h3 className="mt-5 font-display text-[17px] font-bold tracking-tight text-slate-900">{f.title}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-600">{f.body}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-brand-600 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    Learn more <ArrowRight className="size-3.5" />
                  </span>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================== WORKFLOW ============================== */
function Workflow() {
  const steps = [
    { n: "01", t: "Create your expo", b: "Set dates, venue, halls, theme and ticket tiers. Clone a previous edition in one click.", icon: CalendarDays },
    { n: "02", t: "Draw the floor plan", b: "Define zones and booth sizes on the grid. Pricing auto-derives from size and zone demand.", icon: Map },
    { n: "03", t: "Approve exhibitors", b: "Review applications, validate documents and allocate or let exhibitors self-reserve booths.", icon: Building2 },
    { n: "04", t: "Publish the schedule", b: "Add sessions, speakers and stages. Attendees bookmark; changes push out instantly.", icon: CalendarClock },
    { n: "05", t: "Go live & measure", b: "Watch footfall, booth traffic, session fill-rate and lead funnels update in real time.", icon: BarChart3 },
  ];
  const [active, setActive] = useState(0);
  return (
    <section className="relative overflow-hidden bg-ink-950 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 grid-noise-dark opacity-60" />
      <div className="pointer-events-none absolute right-0 top-1/4 size-[500px] rounded-full bg-brand-600/18 blur-[130px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            light
            eyebrow="How it works"
            title="From blank hall to live expo in five steps"
            body="A laddered implementation path — every stage is usable on its own, and each one feeds the next."
          />
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-2.5">
            {steps.map((s, i) => (
              <button
                key={s.n}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className={cn(
                  "group flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-300",
                  active === i
                    ? "border-brand-400/40 bg-gradient-to-r from-brand-500/15 to-transparent"
                    : "border-white/8 bg-white/[0.025] hover:border-white/20"
                )}
              >
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-xl font-display text-[12.5px] font-bold transition",
                    active === i ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-600/30" : "bg-white/8 text-white/50"
                  )}
                >
                  {s.n}
                </span>
                <div className="min-w-0">
                  <p className={cn("font-display text-[15px] font-bold", active === i ? "text-white" : "text-white/70")}>{s.t}</p>
                  <p className={cn("mt-1 text-[13px] leading-relaxed", active === i ? "text-slate-300" : "text-slate-400/70")}>{s.b}</p>
                </div>
                <s.icon className={cn("ml-auto hidden size-5 shrink-0 transition sm:block", active === i ? "text-brand-300" : "text-white/20")} />
              </button>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-1.5">
            <div className="relative overflow-hidden rounded-[20px]">
              <img src={EXPOS[active].cover} alt="" className="h-[300px] w-full object-cover transition-all duration-700 sm:h-[380px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <Badge tone="brand" className="bg-white/10 text-brand-200 ring-white/15">
                  Step {steps[active].n}
                </Badge>
                <h4 className="mt-3 font-display text-[20px] font-bold text-white">{steps[active].t}</h4>
                <p className="mt-1.5 max-w-md text-[13px] text-slate-300">{steps[active].b}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================ UPCOMING EXPOS ========================== */
function Upcoming() {
  const list = EXPOS.filter((e) => e.status !== "Completed").slice(0, 3);
  const [i, setI] = useState(0);
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Featured expos"
              title="Next on the calendar"
              body="Browse upcoming editions, see booth availability and register in two clicks."
            />
            <Link to="/expos">
              <Button variant="secondary" iconRight={<ArrowUpRight className="size-4" />}>
                View all expos
              </Button>
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {list.map((e, idx) => (
            <Reveal key={e.id} delay={idx * 90}>
              <Card hover className="group flex h-full flex-col overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img src={e.cover} alt={e.title} loading="lazy" className="size-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                  <div className="absolute left-4 top-4 flex gap-2">
                    <Badge tone="dark">{e.category}</Badge>
                    {e.status === "Live" && (
                      <Badge tone="danger" className="bg-rose-500 text-white ring-rose-400">
                        <span className="size-1.5 animate-pulse rounded-full bg-white" /> LIVE
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[12px] font-semibold text-white/90">
                    <MapPin className="size-3.5" /> {e.city}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start gap-3.5">
                    <DateChip date={e.startDate} />
                    <div className="min-w-0">
                      <h3 className="font-display text-[16.5px] font-bold leading-snug tracking-tight text-slate-900">{e.title}</h3>
                      <p className="mt-1 text-[12px] font-medium text-slate-500">{e.industry}</p>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-2 text-[13px] leading-relaxed text-slate-600">{e.description}</p>

                  <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center">
                    {[
                      [fmt(e.attendees), "Attendees"],
                      [String(e.exhibitors), "Exhibitors"],
                      [`${Math.round((e.boothsSold / e.boothsTotal) * 100)}%`, "Booths sold"],
                    ].map(([v, l]) => (
                      <div key={l}>
                        <p className="font-display text-[15px] font-bold text-slate-900">{v}</p>
                        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{l}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-3 pt-1">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-aqua-500" style={{ width: `${(e.boothsSold / e.boothsTotal) * 100}%` }} />
                    </div>
                    <span className="text-[11.5px] font-bold text-slate-500">
                      {e.boothsTotal - e.boothsSold} left
                    </span>
                  </div>

                  <Link to={`/expos/${e.slug}`} className="mt-5">
                    <Button full variant="secondary" iconRight={<ArrowRight className="size-4" />}>
                      View details
                    </Button>
                  </Link>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <button onClick={() => setI((v) => Math.max(0, v - 1))} className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
            <ChevronLeft className="size-4.5" />
          </button>
          <div className="flex gap-1.5">
            {EXPOS.slice(0, 6).map((_, k) => (
              <span key={k} className={cn("h-1.5 rounded-full transition-all", i === k ? "w-6 bg-brand-600" : "w-1.5 bg-slate-300")} onClick={() => setI(k)} />
            ))}
          </div>
          <button onClick={() => setI((v) => Math.min(5, v + 1))} className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
            <ChevronRight className="size-4.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* =============================== ROLES ================================ */
function Roles() {
  const roles = [
    {
      role: "Organizer / Admin",
      to: "/register?role=organizer",
      icon: LayoutDashboard,
      tone: "from-brand-500 to-violet-600",
      points: ["Create & manage expos", "Approve exhibitor applications", "Allocate booths on the floor plan", "Real-time analytics & reports"],
    },
    {
      role: "Exhibitor",
      to: "/register?role=exhibitor",
      icon: Building2,
      tone: "from-cyan-500 to-blue-600",
      points: [
        "Register with company details & documents",
        "Reserve booths from the live floor plan",
        "Manage staff badges & lead scanning",
        "Chat with organisers and neighbours",
      ],
    },
    {
      role: "Attendee",
      to: "/register?role=attendee",
      icon: Users,
      tone: "from-amber-400 to-flame-500",
      points: ["Browse events, sessions & exhibitors", "Search and filter by category", "Bookmark sessions with reminders", "Chat with exhibitors"],
    },
  ];
  return (
    <section className="bg-slate-50/70 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            center
            eyebrow="One platform, three doors"
            title="Purpose-built portals for every role"
            body="Role-based access control means each user sees exactly what they need — nothing more."
          />
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {roles.map((r, i) => (
            <Reveal key={r.role} delay={i * 90}>
              <Card hover className="relative h-full overflow-hidden p-7">
                <div className={cn("absolute -right-14 -top-14 size-36 rounded-full bg-gradient-to-br opacity-[0.09] blur-2xl", r.tone)} />
                <div className={cn("grid size-13 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg", r.tone)}>
                  <r.icon className="size-6" />
                </div>
                <h3 className="mt-5 font-display text-[19px] font-bold tracking-tight text-slate-900">{r.role}</h3>
                <ul className="mt-5 space-y-3">
                  {r.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-[13.5px] leading-snug text-slate-600">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <Link to={r.to} className="mt-7 block">
                  <Button full variant="secondary" iconRight={<ArrowRight className="size-4" />}>
                    Enter as {r.role.split(" ")[0]}
                  </Button>
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================= TESTIMONIALS =========================== */
function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[i];
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-3xl">
                <img src={IMG.expoTrade} alt="Expo hall" className="h-[360px] w-full object-cover sm:h-[460px]" />
              </div>
              <div className="absolute -bottom-6 right-4 w-[230px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:right-8">
                <div className="flex items-center gap-2">
                  <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <MousePointerClick className="size-4.5" />
                  </span>
                  <div>
                    <p className="font-display text-[19px] font-bold leading-none text-slate-900">18,420</p>
                    <p className="mt-1 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Badge scans</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-1">
                  {[34, 58, 82, 96, 71, 88, 94, 66].map((h, k) => (
                    <span key={k} className="flex-1 rounded-sm bg-gradient-to-t from-brand-200 to-brand-500" style={{ height: h / 3 }} />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Quote className="size-10 text-brand-200" />
            <blockquote key={i} className="mt-5 animate-[popIn_.5s_cubic-bezier(.22,1,.36,1)]">
              <p className="font-display text-[21px] font-semibold leading-[1.45] tracking-[-0.015em] text-slate-900 sm:text-[26px]">
                "{t.quote}"
              </p>
              <footer className="mt-7 flex items-center gap-3.5">
                <img src={t.avatar} alt={t.name} className="size-12 rounded-full object-cover ring-4 ring-slate-100" />
                <div>
                  <p className="text-[14px] font-bold text-slate-900">{t.name}</p>
                  <p className="text-[12.5px] text-slate-500">{t.role}</p>
                </div>
                <Badge tone="success" className="ml-auto">{t.stat}</Badge>
              </footer>
            </blockquote>
            <div className="mt-8 flex gap-2">
              {TESTIMONIALS.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  aria-label={`Testimonial ${k + 1}`}
                  className={cn("h-1.5 rounded-full transition-all", i === k ? "w-8 bg-brand-600" : "w-4 bg-slate-200 hover:bg-slate-300")}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================================= CTA ================================ */
function CTA() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900 py-20 sm:py-28">
      <video autoPlay loop muted playsInline poster={MEDIA.heroPoster} className="absolute inset-0 -z-10 size-full object-cover opacity-25">
        <source src={MEDIA.conferenceVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ink-950/90 via-brand-800/50 to-ink-950/95" />
      <div className="pointer-events-none absolute inset-0 -z-10 grid-noise-dark opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/22 blur-[130px]" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <Badge tone="brand" className="bg-white/10 text-brand-200 ring-white/15">
            <Sparkles className="size-3" /> Free 14-day trial · no card required
          </Badge>
          <h2 className="mt-6 font-display text-[32px] font-extrabold leading-[1.08] tracking-[-0.03em] text-white sm:text-[46px]">
            Your next expo deserves
            <br />
            <span className="text-gradient">better software.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-slate-300/90">
            Join 480 event teams who replaced spreadsheets, PDFs and reply-all threads with a single live source of truth.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg" iconRight={<ArrowRight className="size-4.5" />}>
                Start free trial
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Book a live demo
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-[12.5px] text-slate-400">
            {["Setup in under an hour", "GDPR compliant", "Cancel anytime"].map((x) => (
              <span key={x} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-400" /> {x}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Shell>
      <Hero />
      <Partners />
      <Features />
      <Upcoming />
      <Workflow />
      <Roles />
      <Testimonials />
      <CTA />
    </Shell>
  );
}
