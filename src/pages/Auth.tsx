import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AVATARS, MEDIA, PARTNERS } from "@/lib/data";
import { ROLE_HOME, ROLE_LABEL, useStore, type User } from "@/lib/store";
import { Badge, Button, Checkbox, Field, Input, Progress, Select } from "@/components/ui";
import { Logo } from "@/components/SiteLayout";
import { cn } from "@/utils/cn";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LayoutDashboard,
  Lock,
  Mail,
  MailCheck,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
  Users,
} from "lucide-react";

const ROLE_CARDS = [
  {
    id: "organizer" as const,
    title: "Organizer / Admin",
    desc: "Create expos, manage floor plans, approve exhibitors and view analytics.",
    icon: LayoutDashboard,
    tone: "from-brand-500 to-violet-600",
    demo: { name: "Sarah Whitfield", email: "sarah@eventsphere.io", company: "EventSphere Management" },
  },
  {
    id: "exhibitor" as const,
    title: "Exhibitor",
    desc: "Reserve booths, manage your company profile, staff and leads.",
    icon: Building2,
    tone: "from-cyan-500 to-blue-600",
    demo: { name: "Amara Osei", email: "amara@nexoracloud.com", company: "Nexora Cloud" },
  },
  {
    id: "attendee" as const,
    title: "Attendee",
    desc: "Discover expos, bookmark sessions and connect with exhibitors.",
    icon: Users,
    tone: "from-amber-400 to-flame-500",
    demo: { name: "Daniel Reyes", email: "daniel.reyes@gmail.com", company: "" },
  },
];

function SidePanel({ mode }: { mode: "login" | "register" | "forgot" }) {
  const bullets =
    mode === "register"
      ? [
          "Free 14-day trial — no card required",
          "Unlimited team members on every plan",
          "Booth & inventory tools included",
          "Cancel or export your data anytime",
        ]
      : [
          "Bank-grade TLS 1.3 encryption in transit",
          "Passwords hashed with bcrypt — never stored raw",
          "GDPR-compliant data handling & consent controls",
          "Role-based access with audit logging",
        ];
  return (
    <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
      <video autoPlay loop muted playsInline poster={MEDIA.heroPoster} className="absolute inset-0 size-full object-cover opacity-30">
        <source src={MEDIA.conferenceVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-ink-950/92 via-ink-950/80 to-brand-800/60" />
      <div className="pointer-events-none absolute inset-0 grid-noise-dark opacity-50" />
      <div className="pointer-events-none absolute -left-20 bottom-0 size-[380px] rounded-full bg-aqua-500/18 blur-[110px]" />

      <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
        <Logo light />

        <div>
          <Badge tone="brand" className="bg-white/10 text-brand-200 ring-white/15">
            <Sparkles className="size-3" /> Trusted by 480 event teams
          </Badge>
          <h2 className="mt-6 font-display text-[32px] font-extrabold leading-[1.12] tracking-[-0.03em] text-white">
            {mode === "forgot" ? "Locked out?" : "One platform."}
            <br />
            <span className="text-gradient">{mode === "forgot" ? "Let's fix that." : "Every role. Every expo."}</span>
          </h2>
          <ul className="mt-8 space-y-3.5">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[13.5px] text-slate-300">
                <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-emerald-400" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
            <div className="flex gap-1">
              {[38, 62, 45, 88, 54, 96, 71].map((h, i) => (
                <div key={i} className="flex-1">
                  <div className="rounded-t-sm bg-gradient-to-t from-brand-500/40 to-brand-400" style={{ height: h }} />
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="font-display text-[22px] font-bold text-white">3.2M</p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-white/45">Check-ins</p>
              </div>
              <div>
                <p className="font-display text-[22px] font-bold text-white">99.9%</p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-white/45">Uptime</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {PARTNERS.slice(0, 5).map((p) => (
            <span key={p} className="font-display text-[13px] font-bold tracking-tight text-white/25">
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Auth({ mode }: { mode: "login" | "register" | "forgot" }) {
  const [role, setRole] = useState<"organizer" | "exhibitor" | "attendee">("organizer");
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { login, toast } = useStore();

  const [form, setForm] = useState({ name: "", email: "", password: "", company: "", category: "", confirm: "", remember: true, terms: false });
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const r = params.get("role");
    if (r === "organizer" || r === "exhibitor" || r === "attendee") setRole(r);
  }, [params]);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const strength = useMemo(() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s += 25;
    if (/[A-Z]/.test(p)) s += 25;
    if (/[0-9]/.test(p)) s += 25;
    if (/[^A-Za-z0-9]/.test(p)) s += 25;
    return s;
  }, [form.password]);

  const demo = ROLE_CARDS.find((r) => r.id === role)!;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (mode === "register") {
      if (!form.name.trim()) err.name = "Please enter your full name";
      if (!form.email.includes("@")) err.email = "Enter a valid email address";
      if (form.password.length < 8) err.password = "Minimum 8 characters";
      if (form.password !== form.confirm) err.confirm = "Passwords do not match";
      if (role === "exhibitor" && !form.company.trim()) err.company = "Company name is required";
      if (!form.terms) err.terms = "You must accept the terms to continue";
    }
    if (mode === "login" && (!form.email.includes("@") || !form.password)) {
      if (!form.email.includes("@")) err.email = "Enter a valid email address";
      if (!form.password) err.password = "Password is required";
    }
    if (mode === "forgot" && !form.email.includes("@")) err.email = "Enter a valid email address";

    setErrors(err);
    if (Object.keys(err).length) {
      toast({ title: "Please fix the highlighted fields", tone: "danger" });
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      if (mode === "forgot") {
        setSent(true);
        toast({ title: "Reset link sent", body: `Check ${form.email} for instructions.`, tone: "success" });
        return;
      }
      const user: User = {
        name: form.name || demo.demo.name,
        email: form.email || demo.demo.email,
        role,
        company: form.company || demo.demo.company,
        avatar: AVATARS[ROLE_CARDS.indexOf(demo)],
      };
      login(user);
      toast({
        title: mode === "login" ? `Welcome back, ${user.name.split(" ")[0]}!` : "Account created successfully",
        body: `Signed in as ${ROLE_LABEL[role]}`,
        tone: "success",
      });
      nav(ROLE_HOME[role]);
    }, 1100);
  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_1fr]">
      <SidePanel mode={mode} />

      <div className="flex flex-col justify-center px-5 py-10 sm:px-10 xl:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden">
            <Logo />
          </div>

          <Link to="/" className="mt-6 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-500 transition hover:text-slate-800 lg:mt-0">
            <ArrowLeft className="size-3.5" /> Back to home
          </Link>

          <h1 className="mt-5 font-display text-[28px] font-extrabold tracking-[-0.025em] text-slate-900 sm:text-[32px]">
            {mode === "login" ? "Sign in to EventSphere" : mode === "register" ? "Create your account" : "Reset your password"}
          </h1>
          <p className="mt-2 text-[14px] text-slate-500">
            {mode === "login"
              ? "Choose your role to continue — each portal is tailored to it."
              : mode === "register"
              ? "Free for 14 days. No credit card, no setup fees."
              : "We'll email you a secure link to set a new password."}
          </p>

          {/* role selector */}
          {mode !== "forgot" && (
            <div className="mt-7 grid grid-cols-3 gap-2.5">
              {ROLE_CARDS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={cn(
                    "group relative rounded-2xl border-2 p-3 text-left transition-all duration-200",
                    role === r.id ? "border-brand-500 bg-brand-50/60 shadow-sm" : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <span
                    className={cn(
                      "grid size-8 place-items-center rounded-xl bg-gradient-to-br text-white shadow transition-transform",
                      r.tone,
                      role === r.id ? "scale-100" : "scale-90 opacity-80 group-hover:opacity-100"
                    )}
                  >
                    <r.icon className="size-4" />
                  </span>
                  <p className={cn("mt-2 text-[11.5px] font-bold leading-tight", role === r.id ? "text-brand-700" : "text-slate-600")}>
                    {r.title.split(" ")[0]}
                  </p>
                  {role === r.id && (
                    <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-brand-600 text-white shadow">
                      <CheckCircle2 className="size-3" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {mode !== "forgot" && (
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5">
              <p className="text-[11.5px] leading-snug text-slate-600">
                <b className="text-slate-800">{demo.title}:</b> {demo.desc}
              </p>
            </div>
          )}

          {sent ? (
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
                <MailCheck className="size-6" />
              </span>
              <h3 className="mt-4 font-display text-[17px] font-bold text-emerald-900">Check your inbox</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-emerald-800/80">
                We've sent a password reset link to <b>{form.email}</b>. The link expires in 30 minutes.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <Button variant="secondary" full onClick={() => nav("/login")}>
                  Return to sign in
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSent(false)}>
                  Use a different email
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              {mode === "register" && (
                <Field label="Full name" required error={errors.name}>
                  <div className="relative">
                    <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      className="pl-10"
                      placeholder="Jane Cooper"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                    />
                  </div>
                </Field>
              )}

              <Field label="Email address" required error={errors.email}>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="email"
                    className="pl-10"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </div>
              </Field>

              {mode === "register" && role === "exhibitor" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Company" required error={errors.company}>
                    <Input placeholder="Nexora Cloud" value={form.company} onChange={(e) => set("company", e.target.value)} />
                  </Field>
                  <Field label="Category">
                    <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
                      <option value="">Select…</option>
                      {["Cloud Infrastructure", "Industrial Automation", "Medical Devices", "Renewables", "Data & AI", "Cybersecurity", "Logistics", "Other"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </Select>
                  </Field>
                </div>
              )}

              {mode !== "forgot" && (
                <Field
                  label="Password"
                  required
                  error={errors.password}
                  hint={mode === "login" ? undefined : "8+ characters"}
                >
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type={showPw ? "text" : "password"}
                      className="pl-10 pr-11"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    >
                      {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </Field>
              )}

              {mode === "register" && (
                <>
                  {strength > 0 && (
                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-[11.5px]">
                        <span className="font-semibold text-slate-500">Password strength</span>
                        <span className={cn("font-bold", strength >= 75 ? "text-emerald-600" : strength >= 50 ? "text-amber-600" : "text-rose-600")}>
                          {strength >= 75 ? "Strong" : strength >= 50 ? "Fair" : "Weak"}
                        </span>
                      </div>
                      <Progress value={strength} tone={strength >= 75 ? "success" : strength >= 50 ? "warn" : "danger"} height={5} />
                    </div>
                  )}
                  <Field label="Confirm password" required error={errors.confirm}>
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="password"
                        className="pl-10"
                        placeholder="••••••••"
                        value={form.confirm}
                        onChange={(e) => set("confirm", e.target.value)}
                      />
                    </div>
                  </Field>
                </>
              )}

              {mode === "login" && (
                <div className="flex items-center justify-between gap-3">
                  <Checkbox checked={form.remember} onChange={(v) => set("remember", v)} label="Keep me signed in" />
                  <Link to="/forgot-password" className="text-[12.5px] font-semibold text-brand-600 hover:text-brand-700">
                    Forgot password?
                  </Link>
                </div>
              )}

              {mode === "register" && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <Checkbox
                    checked={form.terms}
                    onChange={(v) => set("terms", v)}
                    label={
                      <>
                        I agree to the <a href="#" className="font-semibold text-brand-600">Terms of Service</a> and{" "}
                        <a href="#" className="font-semibold text-brand-600">Privacy Policy</a>, including GDPR consent for
                        data processing.
                      </>
                    }
                  />
                  {errors.terms && <p className="mt-2 text-[11.5px] font-medium text-rose-600">{errors.terms}</p>}
                </div>
              )}

              <Button type="submit" full size="lg" loading={busy} iconRight={!busy ? <ArrowRight className="size-4.5" /> : undefined}>
                {mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}
              </Button>

              {mode === "login" && (
                <>
                  <div className="relative py-1.5 text-center">
                    <span className="absolute inset-x-0 top-1/2 h-px bg-slate-200" />
                    <span className="relative bg-white px-3 text-[11.5px] font-semibold uppercase tracking-wider text-slate-400">or</span>
                  </div>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {[
                      ["Google", "M21.35 11.1H12v2.9h5.35c-.25 1.35-1.65 3.95-5.35 3.95A5.95 5.95 0 0 1 6 12a5.95 5.95 0 0 1 6-5.95c1.7 0 2.85.7 3.5 1.3l2.4-2.35C16.4 3.6 14.4 2.8 12 2.8A9.2 9.2 0 0 0 2.8 12 9.2 9.2 0 0 0 12 21.2c5.3 0 8.8-3.7 8.8-8.9 0-.6-.05-1-.15-1.2Z"],
                      ["Microsoft", "M3 3h8.5v8.5H3V3Zm9.5 0H21v8.5h-8.5V3ZM3 12.5h8.5V21H3v-8.5Zm9.5 0H21V21h-8.5v-8.5Z"],
                    ].map(([l, d]) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => toast({ title: `${l} SSO`, body: "Social sign-in is not wired in this UI preview.", tone: "info" })}
                        className="inline-flex h-11 items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                          <path d={d} />
                        </svg>
                        {l}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <p className="pt-1 text-center text-[13px] text-slate-500">
                {mode === "login" ? (
                  <>
                    New to EventSphere?{" "}
                    <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
                      Create an account
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
                      Sign in
                    </Link>
                  </>
                )}
              </p>
            </form>
          )}

          {mode === "login" && (
            <div className="mt-7 rounded-2xl border border-dashed border-brand-200 bg-brand-50/60 p-4">
              <div className="flex items-start gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-100 text-brand-700">
                  <BadgeCheck className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[12.5px] font-bold text-brand-900">Demo mode — no password needed</p>
                  <p className="mt-0.5 text-[11.5px] leading-snug text-brand-800/75">
                    Pick a role above and click <b>Sign in</b> to enter the matching portal instantly.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-7 flex items-center justify-center gap-2 text-[11.5px] text-slate-400">
            <ShieldCheck className="size-3.5" /> Secured with 256-bit encryption
          </div>
        </div>
      </div>

    </div>
  );
}
