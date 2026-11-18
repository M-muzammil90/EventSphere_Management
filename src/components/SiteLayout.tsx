import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import { useStore } from "@/lib/store";
import { Button, Badge } from "@/components/ui";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Sparkles,
  TriangleAlert,
  X,
  Zap,
} from "lucide-react";

export function Logo({ light, compact }: { light?: boolean; compact?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-2.5">
      <span className="relative grid size-9.5 place-items-center overflow-hidden rounded-[13px] bg-gradient-to-br from-brand-500 via-brand-600 to-aqua-600 shadow-[0_6px_20px_-6px_rgba(79,70,229,.8)]">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.45),transparent_60%)]" />
        <svg viewBox="0 0 24 24" className="relative size-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 20h18" />
          <path d="M6 20V9l6-5 6 5v11" />
          <path d="M10 20v-6h4v6" />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className={cn("font-display text-[17px] font-extrabold tracking-[-0.03em]", light ? "text-white" : "text-slate-900")}>
            Event<span className={light ? "text-brand-300" : "text-brand-600"}>Sphere</span>
          </span>
          <span className={cn("mt-0.5 text-[9.5px] font-bold uppercase tracking-[0.22em]", light ? "text-white/45" : "text-slate-400")}>
            Expo Platform
          </span>
        </span>
      )}
    </Link>
  );
}

const NAV = [
  { to: "/expos", label: "Expos" },
  { to: "/floor-plan", label: "Floor Plan" },
  { to: "/schedule", label: "Schedule" },
  { to: "/pricing", label: "Pricing" },
  { to: "/support", label: "Support" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, logout } = useStore();
  const loc = useLocation();
  const nav = useNavigate();
  const overDark = loc.pathname === "/" || loc.pathname.startsWith("/expos/");
  const onDark = overDark && !scrolled;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => setOpen(false), [loc.pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          onDark ? "bg-transparent" : "border-b border-slate-200/70 bg-white/85 backdrop-blur-xl"
        )}
      >
        <div className="mx-auto flex h-16.5 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Logo light={onDark} />

          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  cn(
                    "relative rounded-lg px-3.5 py-2 text-[13.5px] font-semibold transition-colors",
                    onDark
                      ? isActive
                        ? "text-white"
                        : "text-white/65 hover:text-white"
                      : isActive
                        ? "text-brand-700"
                        : "text-slate-600 hover:text-slate-900"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && (
                      <span className={cn("absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full", onDark ? "bg-white" : "bg-brand-600")} />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {user ? (
              <>
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setNotifOpen((v) => !v)}
                    aria-label="Notifications"
                    className={cn(
                      "relative grid size-9.5 place-items-center rounded-xl transition",
                      onDark ? "text-white/80 hover:bg-white/10" : "text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    <Bell className="size-4.5" />
                    <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-white" />
                  </button>
                  {notifOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                      <div className="absolute right-0 z-20 mt-2 w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                          <span className="text-[13px] font-bold text-slate-900">Notifications</span>
                          <Badge tone="brand">4 new</Badge>
                        </div>
                        <ul className="max-h-72 divide-y divide-slate-100 overflow-y-auto text-[12.5px]">
                          {[
                            ["Schedule change: SS-07 moved to 10:00", "12m ago", "warn"],
                            ["Bookmarked session starts in 45 min", "1h ago", "info"],
                            ["3 exhibitors matched your interests", "3h ago", "success"],
                          ].map(([t, time, tone]) => (
                            <li key={t as string} className="flex gap-3 px-4 py-3 hover:bg-slate-50">
                              <span
                                className={cn(
                                  "mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg",
                                  tone === "warn" ? "bg-amber-50 text-amber-600" : tone === "success" ? "bg-emerald-50 text-emerald-600" : "bg-brand-50 text-brand-600"
                                )}
                              >
                                <Zap className="size-3.5" />
                              </span>
                              <div className="min-w-0">
                                <p className="font-semibold leading-snug text-slate-800">{t}</p>
                                <p className="mt-0.5 text-[11px] text-slate-400">{time}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
                <Button
                  size="sm"
                  variant={onDark ? "outline" : "dark"}
                  icon={<LayoutDashboard className="size-4" />}
                  onClick={() => nav(user.role === "organizer" ? "/admin" : user.role === "exhibitor" ? "/portal" : "/attendee")}
                >
                  Dashboard
                </Button>
                <button
                  onClick={() => {
                    logout();
                    nav("/");
                  }}
                  aria-label="Sign out"
                  className={cn(
                    "hidden size-9.5 place-items-center rounded-xl transition sm:grid",
                    onDark ? "text-white/80 hover:bg-white/10" : "text-slate-500 hover:bg-slate-100"
                  )}
                >
                  <LogOut className="size-4.5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block">
                  <Button variant={onDark ? "outline" : "ghost"} size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" icon={<Sparkles className="size-4" />} className="hidden sm:inline-flex">
                    Get started
                  </Button>
                </Link>
              </>
            )}

            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              className={cn(
                "grid size-9.5 place-items-center rounded-xl transition lg:hidden",
                onDark ? "text-white hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-slate-200 bg-white px-4 pb-5 pt-3 lg:hidden">
            <div className="grid gap-1">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-xl px-4 py-3 text-[14px] font-semibold",
                      isActive ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-50"
                    )
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </div>
            <div className="mt-4 grid gap-2">
              {!user ? (
                <>
                  <Link to="/login">
                    <Button variant="secondary" full>
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button full>Get started free</Button>
                  </Link>
                </>
              ) : (
                <Button full variant="dark" onClick={() => nav(user.role === "organizer" ? "/admin" : user.role === "exhibitor" ? "/portal" : "/attendee")}>
                  Go to dashboard
                </Button>
              )}
            </div>
          </div>
        )}
      </header>
      <div className={cn("h-16.5", overDark && "bg-ink-950")} />
    </>
  );
}

/* -------------------------------- Footer ------------------------------- */
export function Footer() {
  const cols = [
    { h: "Platform", items: ["Expo Management", "Floor Plans", "Scheduling", "Analytics", "Lead Capture"] },
    { h: "For Exhibitors", items: ["Booth Reservation", "Profile & Assets", "Staff Badges", "Neighbour Chat", "Lead Scanner"] },
    { h: "For Attendees", items: ["Browse Expos", "Session Bookmarks", "Exhibitor Search", "Digital Badge", "Reminders"] },
    { h: "Company", items: ["About EventSphere", "Careers", "Press Kit", "Partners", "Contact"] },
  ];
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-slate-400">
      <div className="pointer-events-none absolute inset-0 grid-noise-dark opacity-60" />
      <div className="pointer-events-none absolute -left-40 -top-40 size-[420px] rounded-full bg-brand-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 size-[420px] rounded-full bg-aqua-500/12 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-slate-400">
              EventSphere Management builds the software layer for large-scale expos and trade shows — registration, floor
              plans, scheduling and real-time analytics in one platform.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["GDPR Ready", "WCAG 2.1 AA", "99.9% Uptime", "TLS 1.3"].map((t) => (
                <span key={t} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-7 flex max-w-sm items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1.5">
              <input
                placeholder="you@company.com"
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[13px] text-white placeholder:text-slate-500 outline-none"
              />
              <Button size="sm">Subscribe</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {cols.map((c) => (
              <div key={c.h}>
                <h4 className="text-[12px] font-bold uppercase tracking-[0.14em] text-white">{c.h}</h4>
                <ul className="mt-4 space-y-2.5">
                  {c.items.map((i) => (
                    <li key={i}>
                      <a href="#" className="text-[13px] transition hover:text-white">
                        {i}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 text-[12.5px] sm:flex-row">
          <p>© 2026 EventSphere Management. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {["Privacy Policy", "Terms of Service", "Cookie Settings", "Status"].map((l) => (
              <a key={l} href="#" className="transition hover:text-white">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------ Toast host ----------------------------- */
export function ToastHost() {
  const { toasts, dismiss } = useStore();
  const icons = {
    success: <CheckCircle2 className="size-4.5 text-emerald-500" />,
    info: <Info className="size-4.5 text-brand-500" />,
    warn: <TriangleAlert className="size-4.5 text-amber-500" />,
    danger: <TriangleAlert className="size-4.5 text-rose-500" />,
  };
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[200] flex w-[min(92vw,352px)] flex-col gap-2.5">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3.5 shadow-[0_20px_50px_-16px_rgba(16,24,40,.35)] backdrop-blur-xl animate-[popIn_.3s_cubic-bezier(.22,1,.36,1)]"
        >
          <span className="mt-0.5 shrink-0">{icons[t.tone]}</span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-slate-900">{t.title}</p>
            {t.body && <p className="mt-0.5 text-[12px] leading-snug text-slate-500">{t.body}</p>}
          </div>
          <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="shrink-0 text-slate-300 hover:text-slate-600">
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* --------------------------- Scroll-to-top ----------------------------- */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export function Shell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-white", className)}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export const SearchPill = ({ onClick, placeholder = "Search expos, exhibitors, sessions…" }: { onClick?: () => void; placeholder?: string }) => (
  <button
    onClick={onClick}
    className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-left shadow-sm transition hover:border-brand-300 hover:shadow-md"
  >
    <Search className="size-4.5 shrink-0 text-slate-400" />
    <span className="flex-1 truncate text-[14px] text-slate-400">{placeholder}</span>
    <span className="hidden shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-500 sm:block">
      ⌘K
    </span>
  </button>
);

export const DateChip = ({ date }: { date: string }) => {
  const d = new Date(date);
  return (
    <div className="flex size-13 shrink-0 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white leading-none">
      <span className="text-[9.5px] font-bold uppercase tracking-wider text-brand-600">
        {d.toLocaleDateString("en-US", { month: "short" })}
      </span>
      <span className="mt-0.5 font-display text-[19px] font-bold text-slate-900">{d.getDate()}</span>
    </div>
  );
};

export { CalendarDays };
