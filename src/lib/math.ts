/** Abramowitz & Stegun 7.1.26. Accurate enough for a pricing desk, not a special-function library. */
export function normalCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989422804014327 * Math.exp(-0.5 * x * x);
  const poly =
    0.31938153 +
    t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429)));
  const tail = d * t * poly;
  return x >= 0 ? 1 - tail : tail;
}

export function bsCall(spot: number, strike: number, rate: number, sigma: number, years: number): number {
  if (years <= 0 || sigma <= 0) return Math.max(spot - strike * Math.exp(-rate * Math.max(years, 0)), 0);
  const vol = sigma * Math.sqrt(years);
  const d1 = (Math.log(spot / strike) + (rate + 0.5 * sigma * sigma) * years) / vol;
  const d2 = d1 - vol;
  return spot * normalCdf(d1) - strike * Math.exp(-rate * years) * normalCdf(d2);
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gauss(rng: () => number): number {
  const u = Math.max(rng(), 1e-12);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Almgren–Chriss remaining inventory. κ → 0 recovers a linear schedule. */
export function remainingInventory(shares: number, kappa: number, t: number, horizon: number): number {
  if (horizon <= 0) return 0;
  if (kappa < 1e-4) return shares * Math.max(horizon - t, 0) / horizon;
  const denom = Math.sinh(kappa * horizon);
  if (!Number.isFinite(denom) || Math.abs(denom) < 1e-12) return shares * Math.max(horizon - t, 0) / horizon;
  return (shares * Math.sinh(kappa * Math.max(horizon - t, 0))) / denom;
}
