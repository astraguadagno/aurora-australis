export type WeatherPoint = {
  time: string;
  cloudcover: number;
  precipitation: number;
  wind: number;
};

export async function getWeather(lat: number, lon: number): Promise<WeatherPoint[]> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=cloudcover,precipitation,wind_speed_10m&timezone=auto`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  const j = await res.json().catch(() => null);
  const times: string[] = j?.hourly?.time ?? [];
  const cc: number[] = j?.hourly?.cloudcover ?? [];
  const pr: number[] = j?.hourly?.precipitation ?? [];
  const wd: number[] = j?.hourly?.wind_speed_10m ?? [];
  const n = Math.min(times.length, cc.length, pr.length, wd.length);
  const out: WeatherPoint[] = [];
  for (let i = 0; i < n; i++)
    out.push({ time: times[i], cloudcover: cc[i], precipitation: pr[i], wind: wd[i] });
  return out;
}
