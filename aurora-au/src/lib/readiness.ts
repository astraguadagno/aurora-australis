import type { AuroraAlert, AuroraWatch } from "@/lib/types";

const clamp = (v: number, a = 0, b = 100) => Math.max(a, Math.min(b, v));
const pct = (v: number) => clamp(Math.round(v));

// Weights
const W_GEO = 40; // geomagnetic
const W_CLOUD = 40; // less clouds -> higher score
const W_MOON = 20; // darker moon -> higher score

export function geomagneticScoreFromSignals(
  alert?: AuroraAlert | null,
  watch?: AuroraWatch | null,
  kNow?: number | null,
): number {
  if (typeof kNow === "number") return clamp((kNow / 9) * W_GEO, 0, W_GEO);
  if (alert && (alert.lat_band === "mid" || alert.lat_band === "high")) return W_GEO;
  if (watch && (watch.lat_band === "mid" || watch.lat_band === "high" || (watch.k_aus ?? 0) >= 5))
    return Math.round(W_GEO * 0.6);
  return Math.round(W_GEO * 0.25);
}

export function cloudScore(cloudNowPct?: number | null): number {
  if (cloudNowPct == null) return Math.round(W_CLOUD * 0.5);
  const clear = 1 - clamp(cloudNowPct, 0, 100) / 100;
  return pct(W_CLOUD * clear);
}

export function moonScore(illumPct?: number | null, altDeg?: number | null): number {
  if (illumPct == null) return Math.round(W_MOON * 0.5);
  const dark = 1 - clamp(illumPct, 0, 100) / 100; // 1 when new moon
  const altPenalty = (altDeg ?? 0) > 10 ? 0.5 : 1; // simple alt gate
  return pct(W_MOON * dark * altPenalty);
}

export type ReadinessInput = {
  alert?: AuroraAlert | null;
  watch?: AuroraWatch | null;
  kNow?: number | null;
  cloudNowPct?: number | null;
  moonIllumPct?: number | null;
  moonAltDeg?: number | null;
};

export type ReadinessResult = { score: number; factors: string[] };

export function computeReadiness(inp: ReadinessInput): ReadinessResult {
  const g = geomagneticScoreFromSignals(inp.alert, inp.watch, inp.kNow);
  const c = cloudScore(inp.cloudNowPct);
  const m = moonScore(inp.moonIllumPct, inp.moonAltDeg);
  const score = clamp(g + c + m, 0, 100);
  const factors: string[] = [];
  factors.push(`Geomagnetic +${g}/${W_GEO}`);
  factors.push(`Clouds +${c}/${W_CLOUD}`);
  factors.push(`Moon +${m}/${W_MOON}`);
  return { score, factors };
}

export type HourPoint = {
  time: string;
  k?: number | null;
  cloudPct?: number | null;
  moonIllumPct?: number | null;
  moonAltDeg?: number | null;
};

function nearest<T extends { time: string }>(arr: T[] | undefined, t: string): T | undefined {
  if (!arr?.length) return undefined;
  let best: T | undefined;
  let bestDiff = Infinity;
  const target = new Date(t).getTime();
  for (const x of arr) {
    const d = Math.abs(new Date(x.time).getTime() - target);
    if (d < bestDiff) {
      best = x;
      bestDiff = d;
    }
  }
  return best;
}

export function computeHourlyReadiness(
  hours: string[],
  opts: {
    kSeries?: { time: string; k: number }[];
    cloudSeries?: { time: string; cloudPct: number }[];
    moonSeries?: { time: string; illumPct: number; altDeg: number }[];
    alert?: AuroraAlert | null;
    watch?: AuroraWatch | null;
  },
): { time: string; score: number }[] {
  return hours.map((time) => {
    const kNow = opts.kSeries ? (nearest(opts.kSeries, time)?.k ?? null) : null;
    const cloudNowPct = opts.cloudSeries
      ? (nearest(opts.cloudSeries, time)?.cloudPct ?? null)
      : null;
    const moon = opts.moonSeries ? nearest(opts.moonSeries, time) : undefined;
    const { score } = computeReadiness({
      alert: opts.alert,
      watch: opts.watch,
      kNow,
      cloudNowPct,
      moonIllumPct: moon?.illumPct ?? null,
      moonAltDeg: moon?.altDeg ?? null,
    });
    return { time, score };
  });
}
