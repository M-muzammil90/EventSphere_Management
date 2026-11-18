import { useState } from "react";
import { Link } from "react-router-dom";
import { FAQS, TICKETS } from "@/lib/data";
import { Badge, Button, Card, Reveal, SectionHeading, Tabs, Checkbox } from "@/components/ui";
import { Shell } from "@/components/SiteLayout";
import { useStore } from "@/lib/store";
import { cn } from "@/utils/cn";
import { Check, ChevronDown, HelpCircle, Minus, Sparkles } from "lucide-react";

const MATRIX = [
  ["Expo & event management", true, true, true],
  ["Interactive floor plans", true, true, true],
  ["Exhibitor applications & approvals", true, true, true],
  ["Session scheduling & publishing", true, true, true],
  ["Real-time analytics dashboard", "Basic", "Advanced", "Full + API"],
  ["Lead capture & CRM export", false, true, true],
  ["Neighbour messaging", false, true, true],
  ["Custom domain & branding", false, false, true],
  ["SSO / SAML", false, false, true],
  ["Dedicated success manager", false, false, true],
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [open, setOpen] = useState<number | null>(0);
  const { toast } = useStore();
  const [tab, setTab] = useState("tickets");

  return (
    <Shell>
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white pb-12 pt-12 sm:pt-16">
        <div className="pointer-events-none absolute inset-0 grid-noise opacity-60" />
        <div className="pointer-events-none absolute left-1/2 top-0 size-[460px] -translate-x-1/2 rounded-full bg-brand-100/50 blur-[110px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              center
              eyebrow="Pricing"
              title={<>Simple pricing, <span className="text-gradient-dark">no surprises</span></>}
              body="Start free for 14 days. Upgrade when your expo grows — every plan includes the floor plan, scheduling and analytics engine."
            />
          </Reveal>
          <Reveal delay={90}>
            <div className="mt-8 flex items-center justify-center gap-3">
              <span className={cn("text-[13px] font-semibold transition", !annual ? "text-slate-900" : "text-slate-400")}>Monthly</span>
              <button
                onClick={() => setAnnual((v) => !v)}
                className={cn("relative h-7 w-13 rounded-full transition-colors", annual ? "bg-brand-600" : "bg-slate-300")}
                aria-label="Toggle billing period"
              >
                <span className={cn("absolute top-0.5 size-6 rounded-full bg-white shadow transition-all", annual ? "left-[26px]" : "left-0.5")} />
              </button>
              <span className={cn("text-[13px] font-semibold transition", annual ? "text-slate-900" : "text-slate-400")}>
                Annual
              </span>
              <Badge tone="success">Save 20%</Badge>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-center">
            <Tabs active={tab} onChange={setTab} tabs={[{ id: "tickets", label: "Attendee tickets" }, { id: "platform", label: "Platform plans" }]} />
          </div>

          {tab === "tickets" ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {TICKETS.map((t, i) => (
                <Reveal key={t.id} delay={i * 90}>
                  <Card
                    className={cn(
                      "relative flex h-full flex-col overflow-hidden p-7",
                      t.best && "border-brand-300 shadow-[0_24px_70px_-24px_rgba(79,70,229,.4)]"
                    )}
                  >
                    {t.best && (
                      <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-brand-600 to-aqua-500 py-1.5 text-center text-[11px] font-bold uppercase tracking-widest text-white">
                        Most popular
                      </div>
                    )}
                    <div className={cn(t.best && "pt-5")}>
                      <h3 className="font-display text-[18px] font-bold tracking-tight text-slate-900">{t.name}</h3>
                      <div className="mt-4 flex items-baseline gap-1.5">
                        <span className="font-display text-[40px] font-extrabold leading-none tracking-[-0.03em] text-slate-900">${t.price}</span>
                        <span className="text-[12.5px] font-medium text-slate-500">/ {t.unit}</span>
                      </div>
                      <p className="mt-2 text-[12.5px] text-slate-500">
                        {t.id === "t3" ? "For companies exhibiting at the show" : "All prices exclude local VAT"}
                      </p>
                    </div>
                    <ul className="mt-6 flex-1 space-y-3">
                      {t.perks.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-[13.5px] text-slate-600">
                          <span className="mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                            <Check className="size-3" strokeWidth={3} />
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                    <Link to="/register?role=attendee" className="mt-7 block">
                      <Button full size="lg" variant={t.best ? "primary" : "secondary"}>
                        {t.id === "t3" ? "Reserve a booth" : "Buy ticket"}
                      </Button>
                    </Link>
                  </Card>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-4">
              {[
                { n: "Starter", p: annual ? 0 : 0, d: "For a single small expo", f: ["1 expo", "Up to 50 booths", "200 attendees", "Email support"], cta: "Start free" },
                { n: "Growth", p: annual ? 119 : 149, d: "For growing event teams", f: ["5 expos", "Up to 300 booths", "5,000 attendees", "Priority support", "Advanced analytics"], cta: "Start trial", best: true },
                { n: "Scale", p: annual ? 319 : 399, d: "For multi-venue operators", f: ["Unlimited expos", "Unlimited booths", "50,000 attendees", "API + webhooks", "SSO / SAML"], cta: "Contact sales" },
                { n: "Enterprise", p: -1, d: "Custom contractual terms", f: ["Dedicated infra", "99.99% SLA", "Custom DPA", "Onboarding + training", "Success manager"], cta: "Talk to us" },
              ].map((p, i) => (
                <Reveal key={p.n} delay={i * 80}>
                  <Card className={cn("relative flex h-full flex-col p-6", p.best && "border-brand-300 shadow-[0_24px_70px_-24px_rgba(79,70,229,.4)]")}>
                    {p.best && <Badge tone="brand" className="absolute -top-3 left-6">Recommended</Badge>}
                    <h3 className="font-display text-[16px] font-bold text-slate-900">{p.n}</h3>
                    <p className="mt-1 text-[12px] text-slate-500">{p.d}</p>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-display text-[30px] font-extrabold leading-none text-slate-900">
                        {p.p < 0 ? "Custom" : p.p === 0 ? "Free" : `$${p.p}`}
                      </span>
                      {p.p > 0 && <span className="text-[11.5px] text-slate-500">/mo</span>}
                    </div>
                    <ul className="mt-5 flex-1 space-y-2.5">
                      {p.f.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-[12.5px] text-slate-600">
                          <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Check className="size-2.5" strokeWidth={3} /></span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button full className="mt-6" variant={p.best ? "primary" : "secondary"} onClick={() => toast({ title: `${p.n} plan`, body: "This is a UI preview — no billing is connected.", tone: "info" })}>
                      {p.cta}
                    </Button>
                  </Card>
                </Reveal>
              ))}
            </div>
          )}

          {/* comparison matrix */}
          <div className="mt-16">
            <h3 className="font-display text-[20px] font-bold tracking-tight text-slate-900">Compare what's included</h3>
            <Card className="mt-5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-[13.5px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Feature</th>
                      {["Starter", "Growth", "Scale"].map((h) => (
                        <th key={h} className="px-5 py-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MATRIX.map((row) => (
                      <tr key={row[0] as string} className="border-b border-slate-100 last:border-0">
                        <td className="px-5 py-3.5 font-medium text-slate-700">{row[0] as string}</td>
                        {row.slice(1).map((v, i) => (
                          <td key={i} className="px-5 py-3.5 text-center">
                            {v === true ? (
                              <span className="inline-grid size-5 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Check className="size-3" strokeWidth={3} /></span>
                            ) : v === false ? (
                              <span className="inline-grid size-5 place-items-center rounded-full bg-slate-100 text-slate-400"><Minus className="size-3" strokeWidth={3} /></span>
                            ) : (
                              <span className="text-[12px] font-bold text-slate-700">{v as string}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* FAQ */}
          <div className="mt-16 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Badge tone="brand"><HelpCircle className="size-3" /> FAQ</Badge>
              <h3 className="mt-4 font-display text-[26px] font-bold leading-tight tracking-[-0.02em] text-slate-900">
                Questions, answered
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-slate-600">
                Can't find what you need? Our team replies in under 4 hours on business days.
              </p>
              <Link to="/support">
                <Button variant="secondary" className="mt-5" icon={<Sparkles className="size-4" />}>Contact support</Button>
              </Link>
            </div>
            <div className="space-y-2.5">
              {FAQS.map((f, i) => (
                <Card key={f.q} className="overflow-hidden">
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left"
                  >
                    <span className="flex-1 text-[14px] font-semibold text-slate-900">{f.q}</span>
                    <ChevronDown className={cn("size-4.5 shrink-0 text-slate-400 transition-transform duration-300", open === i && "rotate-180 text-brand-600")} />
                  </button>
                  <div className={cn("grid transition-all duration-300 ease-out", open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-[13.5px] leading-relaxed text-slate-600">{f.a}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-10 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Checkbox checked onChange={() => {}} label="I'd like to receive product updates and expo industry news (optional — you can change this any time in Settings)." />
          </div>
        </div>
      </section>
    </Shell>
  );
}
