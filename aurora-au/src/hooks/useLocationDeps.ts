"use client";

import useSWR from "swr";
import { useLocation } from "@/hooks/useLocation";
import { getWeather } from "@/lib/weather";
import { sampleTonight } from "@/lib/moon";

export type Deps = {
  loading: boolean;
  error: string | null;
  location: { lat: number; lon: number; name?: string } | null;
  cloudNowPct: number | null;
  moonIllumPct: number | null;
  moonAltDeg: number | null;
  cloudSeries: { time: string; cloudPct: number }[];
  moonSeries: { time: string; illumPct: number; altDeg: number }[];
  refreshAll: () => void;
};

function nearest<T extends { time: string }>(arr: T[], iso: string): T | null {
  if (!arr?.length) return null;
  let best: T | null = null;
  let bestDiff = Infinity;
  const target = new Date(iso).getTime();
  for (const x of arr) {
    const d = Math.abs(new Date(x.time).getTime() - target);
    if (d < bestDiff) {
      bestDiff = d;
      best = x;
    }
  }
  return best;
}

export default function useLocationDeps(): Deps {
  const { location } = useLocation();
  const keyWx = location ? (["wx", location.lat, location.lon] as const) : null;
  const keyMoon = location ? (["moon", location.lat, location.lon] as const) : null;

  const wx = useSWR(keyWx, () => getWeather(location!.lat, location!.lon), {
    revalidateOnFocus: false,
  });
  const mn = useSWR(keyMoon, () => sampleTonight(location!.lat, location!.lon), {
    revalidateOnFocus: false,
  });

  const nowIso = new Date().toISOString();
  const cloudSeries = (wx.data ?? []).map((d) => ({
    time: d.time,
    cloudPct: Number(d.cloudcover ?? 0),
  }));
  const moonSeries = (mn.data ?? []).map((d) => ({
    time: d.time,
    illumPct: Number(d.illumPct ?? 0),
    altDeg: Number(d.altDeg ?? 0),
  }));

  const cNow = nearest(cloudSeries, nowIso);
  const mNow = nearest(moonSeries, nowIso);

  const loading = (!!keyWx && !wx.data) || (!!keyMoon && !mn.data);
  const error = wx.error ? "weather" : mn.error ? "moon" : null;

  const refreshAll = () => {
    wx.mutate();
    mn.mutate();
  };

  return {
    loading,
    error,
    location: location ?? null,
    cloudNowPct: cNow?.cloudPct ?? null,
    moonIllumPct: mNow?.illumPct ?? null,
    moonAltDeg: mNow?.altDeg ?? null,
    cloudSeries,
    moonSeries,
    refreshAll,
  };
}
