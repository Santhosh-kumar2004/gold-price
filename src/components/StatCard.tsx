import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  sub?: string;
  delta?: number;
  icon?: React.ReactNode;
  highlight?: boolean;
};

export const StatCard = ({ label, value, sub, delta, icon, highlight }: Props) => {
  const positive = (delta ?? 0) >= 0;
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:shadow-gold",
        highlight && "bg-gradient-ink text-secondary-foreground border-transparent"
      )}
    >
      {highlight && <div className="absolute inset-x-0 top-0 h-px animate-shimmer" />}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className={cn("text-xs uppercase tracking-[0.18em]", highlight ? "text-primary/80" : "text-muted-foreground")}>
            {label}
          </p>
          <p className={cn("font-display text-3xl font-bold", highlight && "text-gradient-gold")}>
            {value}
          </p>
          {sub && <p className={cn("text-xs", highlight ? "text-primary/70" : "text-muted-foreground")}>{sub}</p>}
        </div>
        {icon && (
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            highlight ? "bg-primary/15 text-primary" : "bg-accent text-accent-foreground"
          )}>
            {icon}
          </div>
        )}
      </div>
      {typeof delta === "number" && (
        <div className={cn(
          "mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
          positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        )}>
          {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {positive ? "+" : ""}{delta.toFixed(2)}%
        </div>
      )}
    </div>
  );
};
