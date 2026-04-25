// Simulated realistic INR gold price stream + lightweight neural-network style forecast.
// Replace `seedHistory` and `tickPrice` with a real API later (e.g. metals.dev / GoldAPI.io).

export type PricePoint = { time: number; price: number; label: string };

const BASE_24K = 7420; // INR per gram, realistic 2025 baseline
const VOL = 14;        // intraday volatility band

function fmtTime(t: number) {
  const d = new Date(t);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

// Geometric-brownian-ish walker with mean reversion
function nextPrice(prev: number) {
  const drift = (BASE_24K - prev) * 0.04;
  const shock = (Math.random() - 0.5) * VOL;
  return Math.max(BASE_24K - 120, Math.min(BASE_24K + 140, prev + drift + shock));
}

export function seedHistory(points = 90): PricePoint[] {
  const now = Date.now();
  const out: PricePoint[] = [];
  let p = BASE_24K + (Math.random() - 0.5) * 30;
  for (let i = points; i > 0; i--) {
    p = nextPrice(p);
    const t = now - i * 60_000; // 1 min spacing
    out.push({ time: t, price: +p.toFixed(2), label: fmtTime(t) });
  }
  return out;
}

export function tickPrice(prev: number): PricePoint {
  const t = Date.now();
  const price = +nextPrice(prev).toFixed(2);
  return { time: t, price, label: fmtTime(t) };
}

/* -------------------- "LSTM-lite" forecast --------------------
 * Browser-safe forecaster inspired by an LSTM cell:
 *   - normalises a sliding window
 *   - runs a tiny tanh-gated recurrent update
 *   - de-normalises and projects N steps ahead
 * Not a substitute for the real Python/Keras LSTM script we ship,
 * but produces a smooth, plausible forward curve for the dashboard.
 */
function tanh(x: number) { return Math.tanh(x); }
function sigmoid(x: number) { return 1 / (1 + Math.exp(-x)); }

export function forecast(history: PricePoint[], steps = 15): PricePoint[] {
  if (history.length < 10) return [];
  const window = history.slice(-30).map(h => h.price);
  const mean = window.reduce((a, b) => a + b, 0) / window.length;
  const std = Math.sqrt(window.reduce((s, v) => s + (v - mean) ** 2, 0) / window.length) || 1;
  const norm = window.map(v => (v - mean) / std);

  // tiny "recurrent" pass — learned-ish weights
  const Wf = 0.62, Wi = 0.55, Wo = 0.48, Wc = 0.71, b = 0.02;
  let h = 0, c = 0;
  for (const x of norm) {
    const f = sigmoid(Wf * x + h * 0.3 + b);
    const i = sigmoid(Wi * x + h * 0.25 + b);
    const o = sigmoid(Wo * x + h * 0.2 + b);
    const cand = tanh(Wc * x + h * 0.4);
    c = f * c + i * cand;
    h = o * tanh(c);
  }

  // recent slope for direction
  const slope = (norm[norm.length - 1] - norm[norm.length - 6]) / 5;

  const last = history[history.length - 1];
  const out: PricePoint[] = [];
  let xPrev = norm[norm.length - 1];
  for (let s = 1; s <= steps; s++) {
    const f = sigmoid(Wf * xPrev + h * 0.3 + b);
    const i = sigmoid(Wi * xPrev + h * 0.25 + b);
    const o = sigmoid(Wo * xPrev + h * 0.2 + b);
    const cand = tanh(Wc * xPrev + h * 0.4 + slope);
    c = f * c + i * cand;
    h = o * tanh(c);
    const nextNorm = h * 0.85 + slope * 0.15;
    xPrev = nextNorm;
    const price = +(nextNorm * std + mean).toFixed(2);
    const t = last.time + s * 60_000;
    out.push({ time: t, price, label: fmtTime(t) });
  }
  return out;
}

export const PURITY = {
  "24K": 1,
  "22K": 22 / 24,
  "18K": 18 / 24,
} as const;

export const CITIES = [
  { name: "Mumbai", premium: 0 },
  { name: "Delhi", premium: 25 },
  { name: "Chennai", premium: 60 },
  { name: "Bengaluru", premium: 15 },
  { name: "Kolkata", premium: 10 },
  { name: "Hyderabad", premium: 20 },
];
