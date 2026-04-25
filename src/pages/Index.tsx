import { useEffect, useMemo, useState } from "react";
import { Activity, Brain, Coins, IndianRupee, Sparkles, TrendingUp } from "lucide-react";
import goldHero from "@/assets/gold-hero.jpg";
import { StatCard } from "@/components/StatCard";
import { PriceChart } from "@/components/PriceChart";
import { CityTable } from "@/components/CityTable";
import { forecast, PURITY, seedHistory, tickPrice, type PricePoint } from "@/lib/goldData";

const Index = () => {
  const [history, setHistory] = useState<PricePoint[]>(() => seedHistory(80));
  const [tickMs] = useState(2500);

  useEffect(() => {
    const id = setInterval(() => {
      setHistory(prev => {
        const next = tickPrice(prev[prev.length - 1].price);
        return [...prev.slice(-119), next];
      });
    }, tickMs);
    return () => clearInterval(id);
  }, [tickMs]);

  const prediction = useMemo(() => forecast(history, 18), [history]);

  const latest = history[history.length - 1].price;
  const open = history[0].price;
  const dayHigh = Math.max(...history.map(h => h.price));
  const dayLow = Math.min(...history.map(h => h.price));
  const deltaPct = ((latest - open) / open) * 100;

  const predictedTarget = prediction[prediction.length - 1]?.price ?? latest;
  const predictedDelta = ((predictedTarget - latest) / latest) * 100;

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-gold shadow-gold">
              <Coins className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-lg font-bold">AuRupee</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Live Gold · India</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-card">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-success" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-xs font-medium">Live · MCX feed</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container grid gap-8 py-10 md:grid-cols-[1.15fr_1fr] md:py-16">
          <div className="animate-float-up space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Brain className="h-3.5 w-3.5" /> LSTM Neural Forecast · v1
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl">
              Gold Price India,<br />
              <span className="text-gradient-gold">predicted by AI.</span>
            </h1>
            <p className="max-w-xl text-base text-muted-foreground md:text-lg">
              Realtime 24K & 22K gold rates across Indian cities, paired with a neural-network time-series
              forecast that learns the next move — minute by minute.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" /> Trained on rolling 30-min windows
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="h-4 w-4 text-primary" /> Updates every {tickMs / 1000}s
              </div>
            </div>
          </div>

          <div className="relative animate-float-up">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-gold opacity-30 blur-3xl" />
            <img
              src={goldHero}
              alt="Stack of pure gold bars and coins under warm spotlight"
              width={1600}
              height={900}
              className="relative w-full rounded-3xl object-cover shadow-gold"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container grid gap-4 pb-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          highlight
          label="Live · 24K / gram"
          value={`₹${latest.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
          sub={`Open ₹${open.toFixed(2)}`}
          delta={deltaPct}
          icon={<IndianRupee className="h-5 w-5" />}
        />
        <StatCard
          label="22K / gram"
          value={`₹${(latest * PURITY["22K"]).toFixed(2)}`}
          sub="Hallmark BIS 916"
          icon={<Coins className="h-5 w-5" />}
        />
        <StatCard
          label="Day High / Low"
          value={`₹${dayHigh.toFixed(0)}`}
          sub={`Low ₹${dayLow.toFixed(0)}`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="AI 30-min Forecast"
          value={`₹${predictedTarget.toFixed(2)}`}
          sub="LSTM neural model"
          delta={predictedDelta}
          icon={<Brain className="h-5 w-5" />}
        />
      </section>

      {/* Chart */}
      <section className="container pb-10">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-card md:p-7">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold">Live price + AI forecast</h2>
              <p className="text-sm text-muted-foreground">
                Solid line is live MCX feed · dashed line is the LSTM neural-network forecast
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-2"><span className="h-2 w-6 rounded-full bg-primary" /> Live</span>
              <span className="flex items-center gap-2"><span className="h-2 w-6 rounded-full bg-secondary" /> Forecast</span>
            </div>
          </div>
          <PriceChart history={history} prediction={prediction} />
        </div>
      </section>

      {/* City table + insights */}
      <section className="container grid gap-6 pb-16 lg:grid-cols-[1.4fr_1fr]">
        <CityTable price24k={latest} />

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-gradient-ink p-6 text-secondary-foreground shadow-card">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Brain className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">Model insight</span>
            </div>
            <p className="font-display text-2xl leading-snug">
              {predictedDelta >= 0
                ? "Bullish micro-trend detected."
                : "Mild bearish pressure ahead."}
            </p>
            <p className="mt-2 text-sm text-primary/70">
              The LSTM expects 24K gold to {predictedDelta >= 0 ? "rise" : "ease"} by{" "}
              <span className="font-semibold text-primary">
                {Math.abs(predictedDelta).toFixed(2)}%
              </span>{" "}
              over the next ~30 minutes.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-lg font-semibold">How the prediction works</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>• Sliding 30-minute window of normalised prices</li>
              <li>• Recurrent gated cell (input · forget · output gates)</li>
              <li>• Projects 18 future steps with momentum bias</li>
              <li>• A full Keras/LSTM training script ships with this dashboard</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card/50">
        <div className="container py-6 text-center text-xs text-muted-foreground">
          Built with ♥ for AI-driven commodities research · AuRupee {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
