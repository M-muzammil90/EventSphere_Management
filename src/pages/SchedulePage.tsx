import { useMemo, useState } from "react";
import { SESSIONS } from "@/lib/data";
import { Badge, Button, Card, EmptyState, Reveal, SectionHeading, Select, Tabs } from "@/components/ui";
import { SessionCard } from "@/components/shared";
import { Shell } from "@/components/SiteLayout";
import { useStore } from "@/lib/store";
import { cn } from "@/utils/cn";
import { Bell, CalendarDays, Clock, Download, Filter, Search, Star, Users } from "lucide-react";

const TRACKS = ["All", ...Array.from(new Set(SESSIONS.map((s) => s.track)))];
const TYPES = ["All", "Keynote", "Workshop", "Panel", "Demo", "Roundtable"];

export default function SchedulePage() {
  const { bookmarks, toast } = useStore();
  const [day, setDay] = useState("All");
  const [track, setTrack] = useState("All");
  const [type, setType] = useState("All");
  const [q, setQ] = useState("");
  const [onlySaved, setOnlySaved] = useState(false);

  const days = Array.from(new Set(SESSIONS.map((s) => s.day)));

  const list = useMemo(
    () =>
      SESSIONS.filter((s) => {
        const hay = `${s.title} ${s.speaker} ${s.speakerRole} ${s.stage} ${s.track} ${s.tags.join(" ")}`.toLowerCase();
        return (
          (day === "All" || s.day === day) &&
          (track === "All" || s.track === track) &&
          (type === "All" || s.type === type) &&
          (!q || hay.includes(q.toLowerCase())) &&
          (!onlySaved || bookmarks.includes(s.id))
        );
      }),
    [day, track, type, q, onlySaved, bookmarks]
  );

  const grouped = days
    .filter((d) => list.some((s) => s.day === d))
    .map((d) => ({ day: d, items: list.filter((s) => s.day === d) }));

  return (
    <Shell>
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white pb-10 pt-12 sm:pt-16">
        <div className="pointer-events-none absolute inset-0 grid-noise opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Programme"
              title="Full event schedule"
              body="92 sessions across 4 days and 6 tracks. Bookmark anything and we'll remind you 45 minutes before it starts."
            />
          </Reveal>
          <Reveal delay={90}>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { i: CalendarDays, l: "Days", v: "4" },
                { i: Clock, l: "Tracks", v: "6" },
                { i: Users, l: "Speakers", v: "148" },
                { i: Star, l: "Avg. rating", v: "4.7" },
              ].map((s) => (
                <div key={s.l} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600"><s.i className="size-4.5" /></span>
                  <div>
                    <p className="font-display text-[19px] font-bold leading-none text-slate-900">{s.v}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{s.l}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* toolbar */}
      <section className="sticky top-16.5 z-30 border-b border-slate-200 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl space-y-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <Tabs tabs={[{ id: "All", label: "All days" }, ...days.map((d) => ({ id: d, label: d }))]} active={day} onChange={setDay} />
            <button
              onClick={() => setOnlySaved((v) => !v)}
              className={cn(
                "ml-auto inline-flex h-9.5 items-center gap-2 rounded-xl px-3.5 text-[13px] font-semibold transition",
                onlySaved ? "bg-brand-600 text-white shadow-sm" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              <Bell className="size-4" /> Bookmarked ({bookmarks.length})
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-0 flex-1 sm:max-w-xs">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search sessions, speakers…"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-[13.5px] outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/12"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
            <Select value={track} onChange={(e) => setTrack(e.target.value)} className="h-10 min-w-[150px]">
              {TRACKS.map((t) => <option key={t}>{t === "All" ? "All tracks" : t}</option>)}
            </Select>
            <Select value={type} onChange={(e) => setType(e.target.value)} className="h-10 min-w-[140px]">
              {TYPES.map((t) => <option key={t}>{t === "All" ? "All formats" : t}</option>)}
            </Select>
            <Button size="sm" variant="secondary" icon={<Download className="size-4" />} onClick={() => toast({ title: "Agenda exported to your calendar", tone: "success" })}>
              Export
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-slate-50/60 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {grouped.length === 0 ? (
            <Card>
              <EmptyState
                icon={<Filter className="size-6" />}
                title="No sessions match your filters"
                body="Try clearing the search or switching to a different track or format."
                action={<Button variant="secondary" onClick={() => { setQ(""); setTrack("All"); setType("All"); setDay("All"); setOnlySaved(false); }}>Clear filters</Button>}
              />
            </Card>
          ) : (
            <div className="space-y-7">
              {grouped.map((g) => (
                <div key={g.day}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 font-display text-[13px] font-bold text-white shadow-lg shadow-brand-500/25">
                      {g.day.replace("Day ", "D")}
                    </span>
                    <div>
                      <h2 className="font-display text-[18px] font-bold tracking-tight text-slate-900">{g.day}</h2>
                      <p className="text-[12.5px] text-slate-500">
                        {new Date(g.items[0].date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} · {g.items.length} sessions
                      </p>
                    </div>
                    <div className="ml-auto hidden gap-1.5 sm:flex">
                      {Array.from(new Set(g.items.map((i) => i.stage))).map((st) => (
                        <Badge key={st} tone="neutral">{st}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {g.items.map((s) => <SessionCard key={s.id} s={s} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}
