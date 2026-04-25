import { CITIES, PURITY } from "@/lib/goldData";

export const CityTable = ({ price24k }: { price24k: number }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border bg-gradient-soft px-5 py-3">
        <h3 className="font-display text-lg font-semibold">Today's Gold Rate Across India</h3>
        <span className="text-xs text-muted-foreground">per gram (INR)</span>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-5 py-3 text-left font-medium">City</th>
            <th className="px-5 py-3 text-right font-medium">24K</th>
            <th className="px-5 py-3 text-right font-medium">22K</th>
            <th className="px-5 py-3 text-right font-medium">18K</th>
          </tr>
        </thead>
        <tbody>
          {CITIES.map((c, i) => {
            const p24 = price24k + c.premium;
            return (
              <tr key={c.name} className={i % 2 ? "bg-muted/20" : ""}>
                <td className="px-5 py-3 font-medium">{c.name}</td>
                <td className="px-5 py-3 text-right font-mono">₹{p24.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                <td className="px-5 py-3 text-right font-mono">₹{(p24 * PURITY["22K"]).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                <td className="px-5 py-3 text-right font-mono">₹{(p24 * PURITY["18K"]).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
