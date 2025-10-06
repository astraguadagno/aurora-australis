"use client";

import useSWR from "swr";
import { useMemo } from "react";
import { useLocation } from "@/hooks/useLocation";
import { getWeather } from "@/lib/weather";
import CloudStrip from "@/components/CloudStrip";

export default function WeatherSection() {
  const { location } = useLocation();

  const { data, error, isLoading } = useSWR(
    location ? ["weather", location.lat, location.lon] : null,
    () => getWeather(location!.lat, location!.lon),
    { revalidateOnFocus: false },
  );

  const next = useMemo(() => {
    if (!data) return [] as { time: string; cloudcover: number }[];
    const nowIsoPrefix = new Date().toISOString().slice(0, 13);
    const slice = data.filter((p) => p.time >= nowIsoPrefix).slice(0, 24);
    return slice.map((p) => ({ time: p.time, cloudcover: p.cloudcover }));
  }, [data]);

  if (!location) {
    return (
      <div className="rounded-md border px-2 py-2 text-sm text-zinc-600 dark:text-zinc-300">
        Pick a location to load weather.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-zinc-600 dark:text-zinc-300">0% clear → 100% overcast</div>
      <div className="border rounded-md">
        {isLoading ? (
          <div className="h-40 flex items-center justify-center text-sm text-zinc-500">
            Loading…
          </div>
        ) : error ? (
          <div className="h-40 flex items-center justify-center text-sm text-red-500">
            Error loading weather
          </div>
        ) : next.length ? (
          <CloudStrip data={next} />
        ) : (
          <div className="h-40 flex items-center justify-center text-sm text-zinc-500">
            No cloud data
          </div>
        )}
      </div>
    </div>
  );
}
