import { useState } from "react";
import { FAQS } from "@/lib/data";
import { Badge, Button, Card, CardHeader, Checkbox, Field, Input, Reveal, SectionHeading, Select, Textarea, Tabs } from "@/components/ui";
import { Shell } from "@/components/SiteLayout";
import { useStore } from "@/lib/store";
import { cn } from "@/utils/cn";
import { BookOpen, Bug, ChevronRight, Cloud, LifeBuoy, Lightbulb, Mail, MessageSquare, Phone, Send, ShieldCheck, Sparkles } from "lucide-react";

const CHANNELS = [
  { i: MessageSquare, t: "Live chat", d: "In-app, 24/7 during expo week", v: "Average reply: 2 min", tone: "from-brand-500 to-violet-600" },
  { i: Mail, t: "Email support", d: "support@eventsphere.io", v: "Average reply: 4 hours", tone: "from-cyan-500 to-blue-600" },
  { i: Phone, t: "Phone line", d: "+971 4 555 0134", v: "Mon–Fri, 09:00–18:00 GST", tone: "from-amber-400 to-flame-500" },
  { i: BookOpen, t: "Help centre", d: "380 articles & walkthroughs", v: "Searchable, always on", tone: "from-emerald-500 to-teal-600" },
];

const STATUS = [
  { s: "All systems operational", tone: "success" as const, items: [["Registration API", "Operational"], ["Floor plan service", "Operational"], ["Analytics pipeline", "Operational"], ["Badge check-in", "Degraded"]] },
];

export default function SupportPage() {
  const { toast } = useStore();
  const [tab, setTab] = useState("contact");
  const [type, setType] = useState("question");
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", body: "", urgent: false });

  const TYPES = [
    { id: "question", label: "Question", icon: LifeBuoy, d: "How something works" },
    { id: "idea", label: "Suggestion", icon: Lightbulb, d: "Product feedback or idea" },
    { id: "bug", label: "Report an issue", icon: Bug, d: "Something is broken" },
  ];

  return (
    <Shell>
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white pb-12 pt-12 sm:pt-16">
        <div className="pointer-events-none absolute inset-0 grid-noise opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              center
              eyebrow="Support & feedback"
              title="We're here before you need us"
              body="Submit a suggestion, report an issue or just ask how something works. Every message reaches a real person."
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CHANNELS.map((c, i) => (
              <Reveal key={c.t} delay={i * 70}>
                <Card hover className="group h-full p-5">
                  <span className={cn("grid size-11 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg", c.tone)}>
                    <c.i className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-[15px] font-bold text-slate-900">{c.t}</h3>
                  <p className="mt-1 text-[12.5px] text-slate-600">{c.d}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-bold text-emerald-600">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" /> {c.v}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-bold text-brand-600 opacity-0 transition group-hover:opacity-100">
                    Open <ChevronRight className="size-3.5" />
                  </span>
                </Card>
              </Reveal>
            ))}
          </div>

          <div className="mt-12">
            <Tabs active={tab} onChange={setTab} tabs={[{ id: "contact", label: "Contact form" }, { id: "faq", label: "FAQ" }, { id: "status", label: "System status" }]} />
          </div>

          {tab === "contact" && (
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <Card>
                <CardHeader title="Send us a message" subtitle="We reply to every submission within one business day" />
                {sent ? (
                  <div className="p-8 text-center">
                    <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-emerald-50 text-emerald-600">
                      <Send className="size-7" />
                    </span>
                    <h3 className="mt-5 font-display text-[19px] font-bold text-slate-900">Thanks — message received</h3>
                    <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-slate-600">
                      Your ticket <b className="text-slate-900">#SUP-{Math.floor(Math.random() * 90000 + 10000)}</b> has been
                      created. We'll email {form.email || "you"} with a response shortly.
                    </p>
                    <Button variant="secondary" className="mt-6" onClick={() => setSent(false)}>Send another message</Button>
                  </div>
                ) : (
                  <form
                    className="space-y-5 p-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSent(true);
                      toast({ title: "Message submitted", body: "A support ticket has been created.", tone: "success" });
                    }}
                  >
                    <div>
                      <span className="mb-2 block text-[12.5px] font-semibold text-slate-700">What is this about?</span>
                      <div className="grid gap-2.5 sm:grid-cols-3">
                        {TYPES.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setType(t.id)}
                            className={cn(
                              "rounded-2xl border-2 p-3.5 text-left transition",
                              type === t.id ? "border-brand-500 bg-brand-50/60" : "border-slate-200 hover:border-slate-300"
                            )}
                          >
                            <t.icon className={cn("size-5", type === t.id ? "text-brand-600" : "text-slate-400")} />
                            <p className={cn("mt-2 text-[12.5px] font-bold", type === t.id ? "text-brand-700" : "text-slate-700")}>{t.label}</p>
                            <p className="mt-0.5 text-[11px] text-slate-500">{t.d}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Your name" required>
                        <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Cooper" />
                      </Field>
                      <Field label="Email" required>
                        <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@company.com" />
                      </Field>
                    </div>

                    <Field label="Related to" hint="optional">
                      <Select defaultValue="General">
                        <option>General</option>
                        <option>Global Tech Summit 2026</option>
                        <option>MedExpo International</option>
                        <option>Industrial Innovate Fair</option>
                        <option>Billing & invoices</option>
                        <option>Account & access</option>
                      </Select>
                    </Field>

                    <Field label="Subject" required>
                      <Input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Brief summary of your message" />
                    </Field>

                    <Field label="Message" required hint={`${form.body.length}/1000`}>
                      <Textarea
                        required
                        maxLength={1000}
                        value={form.body}
                        onChange={(e) => setForm({ ...form, body: e.target.value })}
                        placeholder="Tell us what's happening — include steps to reproduce if you're reporting an issue."
                      />
                    </Field>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                      <Checkbox checked={form.urgent} onChange={(v) => setForm({ ...form, urgent: v })} label="This is blocking me right now (during a live expo)" />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <p className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-400">
                        <ShieldCheck className="size-3.5" /> Handled under our GDPR data-processing agreement
                      </p>
                      <Button type="submit" icon={<Send className="size-4" />}>Send message</Button>
                    </div>
                  </form>
                )}
              </Card>

              <div className="space-y-6">
                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-br from-ink-900 to-ink-800 p-6 text-white">
                    <Sparkles className="size-5 text-brand-300" />
                    <h3 className="mt-3.5 font-display text-[16px] font-bold">Priority expo-week cover</h3>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-slate-300">
                      During live event weeks we run 24/7 cover with a 15-minute response target on Severity-1 issues.
                    </p>
                    <div className="mt-4 space-y-2">
                      {[["Sev 1 — expo down", "15 min"], ["Sev 2 — feature broken", "1 hour"], ["Sev 3 — question", "4 hours"]].map(([l, v]) => (
                        <div key={l} className="flex items-center justify-between rounded-lg bg-white/8 px-3 py-2 text-[11.5px]">
                          <span className="text-slate-300">{l}</span>
                          <span className="font-bold text-white">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card>
                  <CardHeader title="Popular articles" />
                  <div className="divide-y divide-slate-100">
                    {[
                      "Reserving a booth from the floor plan",
                      "Publishing a schedule update instantly",
                      "Exporting leads to your CRM",
                      "Adding staff badges for your team",
                      "Changing your data & privacy settings",
                    ].map((a) => (
                      <button key={a} onClick={() => toast({ title: "Opening article", body: a, tone: "info" })} className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-slate-50">
                        <BookOpen className="size-4 shrink-0 text-slate-400" />
                        <span className="flex-1 text-[13px] font-medium text-slate-700">{a}</span>
                        <ChevronRight className="size-4 shrink-0 text-slate-300" />
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {tab === "faq" && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {FAQS.map((f, i) => (
                <Reveal key={f.q} delay={i * 60}>
                  <Card className="h-full p-5">
                    <h3 className="text-[14px] font-bold text-slate-900">{f.q}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{f.a}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
          )}

          {tab === "status" && (
            <div className="mt-6 space-y-6">
              <Card className="flex flex-wrap items-center gap-4 p-5">
                <span className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Cloud className="size-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-display text-[17px] font-bold text-slate-900">All systems operational</h3>
                    <Badge tone="success" dot>99.98% uptime · 90 days</Badge>
                  </div>
                  <p className="mt-1 text-[13px] text-slate-500">Last incident resolved 42 days ago · Scheduled maintenance: none planned</p>
                </div>
                <div className="flex items-end gap-[3px]">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <span key={i} className={cn("w-1.5 rounded-full", i === 27 ? "h-6 bg-amber-400" : "h-9 bg-emerald-400")} />
                  ))}
                </div>
              </Card>

              <div className="grid gap-3 sm:grid-cols-2">
                {STATUS[0].items.map(([n, s]) => (
                  <Card key={n} className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-[13.5px] font-semibold text-slate-900">{n}</p>
                      <p className="text-[11.5px] text-slate-500">Checked 30 seconds ago</p>
                    </div>
                    <Badge tone={s === "Operational" ? "success" : "warn"} dot>{s}</Badge>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}
