import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PricePoint } from "@/lib/goldData";

type Row = { label: string; actual?: number; predicted?: number };

export const PriceChart = ({ history, prediction }: { history: PricePoint[]; prediction: PricePoint[] }) => {
  const data: Row[] = [
    ...history.map(h => ({ label: h.label, actual: h.price })),
    ...prediction.map(p => ({ label: p.label, predicted: p.price })),
  ];
  const splitLabel = history[history.length - 1]?.label;
  const all = [...history.map(h => h.price), ...prediction.map(p => p.price)];
  const min = Math.min(...all) - 8;
  const max = Math.max(...all) + 8;

  return (
    <div className="h-[340px] w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 16, right: 12, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="gActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gPred" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 6" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            interval={Math.floor(data.length / 6)}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[min, max]}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            tickFormatter={(v) => `₹${Math.round(v)}`}
            tickLine={false}
            axisLine={false}
            width={64}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 12,
              boxShadow: "var(--shadow-card)",
              fontSize: 12,
            }}
            formatter={(v: number, n) => [`₹ ${v.toLocaleString("en-IN")}`, n === "actual" ? "Live" : "AI Forecast"]}
          />
          {splitLabel && (
            <ReferenceLine x={splitLabel} stroke="hsl(var(--primary))" strokeDasharray="4 4" label={{ value: "now", fill: "hsl(var(--primary))", fontSize: 11, position: "top" }} />
          )}
          <Area type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={2.4} fill="url(#gActual)" isAnimationActive={false} />
          <Area type="monotone" dataKey="predicted" stroke="hsl(var(--secondary))" strokeWidth={2.4} strokeDasharray="6 4" fill="url(#gPred)" isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
