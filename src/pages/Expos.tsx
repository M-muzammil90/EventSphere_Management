import { useMemo, useState } from "react";
import { EXPOS } from "@/lib/data";
import { Badge, Button, Card, EmptyState, Reveal, SectionHeading, Select, Tabs } from "@/components/ui";
import { ExpoCard } from "@/components/shared";
import { Shell, SearchPill } from "@/components/SiteLayout";
import { cn } from "@/utils/cn";
import { Link } from "react-router-dom";
import { CalendarDays, LayoutGrid, List, MapPin, RotateCcw, SearchX, SlidersHorizontal, Star } from "lucide-react";

const CATEGORIES = ["All", ...Array.from(new Set(EXPOS.map((e) => e.category)))];
const STATUSES = ["All", "Live", "Upcoming", "Completed"] as const;

export default function Expos() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [status, setStatus] = useState<string>("All");
  const [city, setCity] = useState("All");
  const [sort, setSort] = useState("date");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [maxPrice, setMaxPrice] = useState(250);
  const [showFilters, setShowFilters] = useState(false);

  const cities = ["All", ...Array.from(new Set(EXPOS.map((e) => e.city)))];

  const results = useMemo(() => {
    let r = EXPOS.filter((e) => {
      const hay = `${e.title} ${e.category} ${e.industry} ${e.city} ${e.venue} ${e.tags.join(" ")} ${e.theme}`.toLowerCase();
      return (
        (!q || hay.includes(q.toLowerCase())) &&
        (cat === "All" || e.category === cat) &&
        (status === "All" || e.status === status) &&
        (city === "All" || e.city === city) &&
        e.price <= maxPrice
      );
    });
    r = [...r].sort((a, b) =>
      sort === "date" ? +new Date(a.startDate) - +new Date(b.startDate)
      : sort === "attendees" ? b.attendees - a.attendees
      : sort === "price" ? a.price - b.price
      : b.rating - a.rating
    );
    return r;
  }, [q, cat, status, city, sort, maxPrice]);

  const reset = () => {
    setQ(""); setCat("All"); setStatus("All"); setCity("All"); setSort("date"); setMaxPrice(250);
  };

  return (
    <Shell>
      {/* header */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white pb-10 pt-12 sm:pt-16">
        <div className="pointer-events-none absolute inset-0 grid-noise opacity-60" />
        <div className="pointer-events-none absolute -right-24 -top-24 size-[380px] rounded-full bg-brand-100/60 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Discover"
              title="Find your next expo"
              body="Browse every edition managed on EventSphere — filter by industry, city, date or price and reserve your place in minutes."
            />
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-8 max-w-2xl">
              <div className="relative">
                <SearchPill />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search expos, industries, cities…"
                  className="absolute inset-0 w-full rounded-2xl border border-transparent bg-transparent px-4 py-3.5 text-[14px] text-slate-900 outline-none placeholder:text-transparent focus:border-brand-300"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* toolbar */}
      <section className="sticky top-16.5 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <Tabs
              tabs={STATUSES.map((s) => ({ id: s, label: s === "All" ? "All" : s, count: s === "All" ? EXPOS.length : EXPOS.filter((e) => e.status === s).length }))}
              active={status}
              onChange={setStatus}
            />
            <div className="ml-auto flex items-center gap-2">
              <Button
                size="sm"
                variant={showFilters ? "soft" : "secondary"}
                icon={<SlidersHorizontal className="size-4" />}
                onClick={() => setShowFilters((v) => !v)}
              >
                Filters
              </Button>
              <div className="hidden rounded-xl border border-slate-200 p-0.5 sm:flex">
                {([["grid", LayoutGrid], ["list", List]] as const).map(([v, Ic]) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    aria-label={`${v} view`}
                    className={cn("grid size-8 place-items-center rounded-lg transition", view === v ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-700")}
                  >
                    <Ic className="size-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="mt-3 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2 lg:grid-cols-5">
              <label className="block">
                <span className="mb-1.5 block text-[11.5px] font-bold text-slate-600">Category</span>
                <Select value={cat} onChange={(e) => setCat(e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </Select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11.5px] font-bold text-slate-600">City</span>
                <Select value={city} onChange={(e) => setCity(e.target.value)}>
                  {cities.map((c) => <option key={c}>{c}</option>)}
                </Select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11.5px] font-bold text-slate-600">Sort by</span>
                <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="date">Start date</option>
                  <option value="attendees">Most attendees</option>
                  <option value="price">Price: low to high</option>
                  <option value="rating">Highest rated</option>
                </Select>
              </label>
              <label className="block sm:col-span-2 lg:col-span-2">
                <span className="mb-1.5 flex items-baseline justify-between text-[11.5px] font-bold text-slate-600">
                  Max ticket price
                  <span className="font-display text-[13px] text-brand-700">${maxPrice}</span>
                </span>
                <input
                  type="range"
                  min={50}
                  max={250}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(+e.target.value)}
                  className="mt-3.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-600"
                />
              </label>
            </div>
          )}
        </div>
      </section>

      {/* results */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13.5px] text-slate-500">
              Showing <b className="text-slate-900">{results.length}</b> of {EXPOS.length} expos
            </p>
            <div className="flex flex-wrap gap-1.5">
              {cat !== "All" && <FilterChip label={cat} onClear={() => setCat("All")} />}
              {city !== "All" && <FilterChip label={city} onClear={() => setCity("All")} />}
              {status !== "All" && <FilterChip label={status} onClear={() => setStatus("All")} />}
              {(cat !== "All" || city !== "All" || status !== "All") && (
                <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11.5px] font-bold text-slate-500 transition hover:text-rose-600">
                  <RotateCcw className="size-3" /> Reset all
                </button>
              )}
            </div>
          </div>

          {results.length === 0 ? (
            <Card className="mt-6">
              <EmptyState
                icon={<SearchX className="size-6" />}
                title="No expos match your filters"
                body="Try widening your search — clear a filter or two, or browse a different category."
                action={<Button variant="secondary" icon={<RotateCcw className="size-4" />} onClick={reset}>Reset filters</Button>}
              />
            </Card>
          ) : view === "grid" ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((e, i) => (
                <Reveal key={e.id} delay={Math.min(i * 60, 300)}>
                  <ExpoCard expo={e} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {results.map((e) => (
                <Card key={e.id} hover className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <img src={e.cover} alt="" loading="lazy" className="h-28 w-full shrink-0 rounded-xl object-cover sm:w-44" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="brand">{e.category}</Badge>
                      {e.status === "Live" && (
                        <Badge tone="danger" className="bg-rose-500 text-white ring-rose-400">
                          <span className="size-1.5 animate-pulse rounded-full bg-white" /> LIVE
                        </Badge>
                      )}
                      <span className="inline-flex items-center gap-1 text-[11.5px] font-bold text-amber-600">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" /> {e.rating}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-[16px] font-bold tracking-tight text-slate-900">{e.title}</h3>
                    <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-500">
                      <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {e.venue}</span>
                      <span className="inline-flex items-center gap-1"><CalendarDays className="size-3.5 text-brand-500" /> {e.startDate} → {e.endDate}</span>
                    </p>
                    <p className="mt-2 line-clamp-1 text-[12.5px] text-slate-600">{e.description}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-stretch gap-2 sm:w-40">
                    <div className="text-center">
                      <p className="font-display text-[20px] font-bold text-slate-900">${e.price}</p>
                      <p className="text-[11px] text-slate-400">per day pass</p>
                    </div>
                    <Link to={`/expos/${e.slug}`}>
                      <Button full size="sm">View expo</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}

const FilterChip = ({ label, onClear }: { label: string; onClear: () => void }) => (
  <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1 text-[11.5px] font-bold text-brand-700 ring-1 ring-brand-100">
    {label}
    <button onClick={onClear} aria-label={`Clear ${label}`} className="text-brand-400 hover:text-brand-700">×</button>
  </span>
);
