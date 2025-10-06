import SunCalc from "suncalc";

export type MoonData = {
  phaseName: string;
  illuminationPct: number;
  altitudeDeg: number;
};

const PHASES = [
  "New Moon",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full Moon",
  "Waning Gibbous",
  "Last Quarter",
  "Waning Crescent",
];

export function getMoonData(lat: number, lon: number, date = new Date()): MoonData {
  const illum = SunCalc.getMoonIllumination(date);
  const pos = SunCalc.getMoonPosition(date, lat, lon);
  const phaseIdx = Math.round(illum.phase * 8) % 8;
  return {
    phaseName: PHASES[phaseIdx],
    illuminationPct: Math.round(illum.fraction * 100),
    altitudeDeg: Math.round((pos.altitude * 180) / Math.PI),
  };
}

export function sampleTonight(lat: number, lon: number) {
  // hourly samples from local 18:00 → 06:00
  const now = new Date();
  const start = new Date(now);
  start.setHours(18, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + (now.getHours() >= 18 ? 1 : 0));
  end.setHours(6, 0, 0, 0);
  const out: { time: string; illumPct: number; altDeg: number }[] = [];
  for (let t = +start; t <= +end; t += 3_600_000) {
    const d = new Date(t);
    const m = getMoonData(lat, lon, d);
    out.push({ time: d.toISOString(), illumPct: m.illuminationPct, altDeg: m.altitudeDeg });
  }
  return out;
}
