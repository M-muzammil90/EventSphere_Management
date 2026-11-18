import { useState } from "react";
import { BOOTHS } from "@/lib/data";
import { Badge, Button, Card, CardHeader, Modal, Progress, Tabs, Td, Th, Table } from "@/components/ui";
import { FloorPlan, StatCard } from "@/components/shared";
import { BarChart, StackedBar } from "@/components/charts";
import { money, useStore } from "@/lib/store";
import { cn } from "@/utils/cn";
import { Building2, Download, Lock, MapPin, Percent, Plus, Settings2, Unlock } from "lucide-react";

export default function AdminFloorPlan() {
  const { toast } = useStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [alloc, setAlloc] = useState(false);
  const [tab, setTab] = useState("plan");

  const sold = BOOTHS.filter((b) => b.status !== "available");
  const revenue = BOOTHS.filter((b) => b.status === "sold").reduce((s, b) => s + b.price, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[24px] font-bold tracking-[-0.02em] text-slate-900">Floor plan & booth allocation</h2>
          <p className="mt-1.5 text-[13.5px] text-slate-500">Global Tech Summit 2026 · Hall 4. Allocate, reserve or block any booth — changes are live for exhibitors.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Tabs size="sm" active={tab} onChange={setTab} tabs={[{ id: "plan", label: "Floor plan" }, { id: "inventory", label: "Inventory table" }]} />
          <Button variant="secondary" icon={<Download className="size-4" />} onClick={() => toast({ title: "Inventory exported", tone: "success" })}>Export</Button>
          <Button icon={<Plus className="size-4" />} onClick={() => setAlloc(true)}>Allocate booth</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total booths" value={String(BOOTHS.length)} icon={<MapPin className="size-5" />} tone="brand" sub="4 zones · Hall 4" />
        <StatCard label="Occupancy" value={`${Math.round((sold.length / BOOTHS.length) * 100)}%`} delta="+7.2%" icon={<Percent className="size-5" />} tone="success" sub={`${sold.length} of ${BOOTHS.length} booths`} />
        <StatCard label="Available" value={String(BOOTHS.filter((b) => b.status === "available").length)} icon={<Unlock className="size-5" />} tone="info" sub="Open for reservation" />
        <StatCard label="Booth revenue" value={money(revenue)} delta="+12.4%" icon={<Building2 className="size-5" />} tone="warn" sub="Sold inventory only" />
      </div>

      {tab === "plan" ? (
        <FloorPlan mode="admin" selected={selected} onSelect={setSelected} height={560} />
      ) : (
        <Card>
          <CardHeader title="Booth inventory" subtitle={`${BOOTHS.length} booths across zones A–D`} right={<Badge tone="neutral">{money(BOOTHS.reduce((s, b) => s + b.price, 0))} total value</Badge>} />
          <Table>
            <thead>
              <tr>
                <Th>Booth</Th>
                <Th>Zone</Th>
                <Th>Type</Th>
                <Th className="text-right">Size</Th>
                <Th className="text-right">Rate</Th>
                <Th>Exhibitor</Th>
                <Th>Status</Th>
                <Th className="text-right">Action</Th>
              </tr>
            </thead>
            <tbody>
              {BOOTHS.map((b) => (
                <tr key={b.id} className="transition hover:bg-slate-50/60">
                  <Td className="font-display font-bold text-slate-900">{b.id}</Td>
                  <Td><Badge tone={b.zone === "A" ? "brand" : b.zone === "B" ? "info" : b.zone === "C" ? "warn" : "success"}>Zone {b.zone}</Badge></Td>
                  <Td className="text-slate-600">{b.size}</Td>
                  <Td className="text-right tabular-nums text-slate-600">{b.sqm} m²</Td>
                  <Td className="text-right font-semibold tabular-nums text-slate-900">{money(b.price)}</Td>
                  <Td className="text-slate-600">{b.owner ?? <span className="text-slate-400">—</span>}</Td>
                  <Td>
                    <Badge tone={b.status === "available" ? "success" : b.status === "sold" ? "brand" : b.status === "reserved" ? "warn" : "neutral"} dot>
                      {b.status === "available" ? "Available" : b.status === "sold" ? "Sold" : b.status === "reserved" ? "Reserved" : "Blocked"}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex justify-end">
                      <Button size="xs" variant={b.status === "available" ? "soft" : "secondary"} onClick={() => toast({ title: `Booth ${b.id}`, body: b.status === "available" ? "Assignment panel opened." : "Status updated.", tone: "info" })}>
                        {b.status === "available" ? "Assign" : "Manage"}
                      </Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Zone performance" subtitle="Occupancy and revenue by zone" />
          <div className="grid gap-6 p-5 sm:grid-cols-2">
            {(["A", "B", "C", "D"] as const).map((z) => {
              const all = BOOTHS.filter((b) => b.zone === z);
              const soldZ = all.filter((b) => b.status !== "available");
              return (
                <div key={z} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[15px] font-bold text-slate-900">Zone {z}</span>
                    <Badge tone={soldZ.length / all.length > 0.8 ? "warn" : "brand"}>{Math.round((soldZ.length / all.length) * 100)}%</Badge>
                  </div>
                  <div className="mt-3">
                    <Progress value={(soldZ.length / all.length) * 100} tone={z === "A" ? "brand" : z === "B" ? "info" : z === "C" ? "warn" : "success"} />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    {[["Booths", all.length], ["Sold", soldZ.length], ["Revenue", money(all.filter((b) => b.status === "sold").reduce((s, b) => s + b.price, 0))]].map(([l, v]) => (
                      <div key={l as string}>
                        <p className="text-[13px] font-bold text-slate-900">{v as string}</p>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{l as string}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Booth size mix" />
            <div className="p-5">
              <StackedBar
                segments={[
                  { label: "Island", value: BOOTHS.filter((b) => b.size === "Island").length, color: "#4f46e5" },
                  { label: "Large", value: BOOTHS.filter((b) => b.size === "Large").length, color: "#6366f1" },
                  { label: "Medium", value: BOOTHS.filter((b) => b.size === "Medium").length, color: "#06b6d4" },
                  { label: "Small", value: BOOTHS.filter((b) => b.size === "Small").length, color: "#f97316" },
                ]}
              />
            </div>
          </Card>
          <Card>
            <CardHeader title="Rate by booth type" subtitle="Average listed rate" />
            <div className="p-5">
              <BarChart
                horizontal
                color="#f97316"
                format={money}
                data={Array.from(new Set(BOOTHS.map((b) => b.size))).map((s) => ({
                  label: s,
                  v: Math.round(BOOTHS.filter((b) => b.size === s).reduce((a, b) => a + b.price, 0) / BOOTHS.filter((b) => b.size === s).length),
                }))}
              />
            </div>
          </Card>
        </div>
      </div>

      <Modal open={alloc} onClose={() => setAlloc(false)} title="Allocate a booth" subtitle="Assign space to an approved exhibitor" size="md"
        footer={<>
          <Button variant="ghost" onClick={() => setAlloc(false)}>Cancel</Button>
          <Button onClick={() => { setAlloc(false); toast({ title: "Booth allocated", body: "The exhibitor has been notified by email.", tone: "success" }); }}>Confirm allocation</Button>
        </>}>
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Booth</span>
            <select className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 px-3.5 text-[14px] outline-none focus:border-brand-400">
              {BOOTHS.filter((b) => b.status === "available").map((b) => <option key={b.id}>{b.id} — {b.sqm} m² · {money(b.price)}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Exhibitor</span>
            <select className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 px-3.5 text-[14px] outline-none focus:border-brand-400">
              <option>Quantum Ledger (pending)</option>
              <option>Orbital Freight (pending)</option>
              <option>Synthwave Audio (waitlist)</option>
            </select>
          </label>
          <div className="flex gap-2">
            {["Reserve (hold)", "Sell (final)", "Block"].map((t, i) => (
              <span key={t} className={cn("flex-1 cursor-pointer rounded-xl border px-3 py-2.5 text-center text-[12.5px] font-semibold transition", i === 0 ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600 hover:border-slate-300")}>
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3.5 text-[12px] text-slate-600">
            <Settings2 className="mt-0.5 size-4 shrink-0 text-slate-400" />
            Allocations are reflected on the public floor plan within 30 seconds and trigger a notification to the exhibitor.
          </div>
        </div>
      </Modal>
      <div className="hidden"><Lock /></div>
    </div>
  );
}
