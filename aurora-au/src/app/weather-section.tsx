"use client";

import { useMemo } from "react";
import useLocationDeps from "@/hooks/useLocationDeps";
import CloudStrip from "@/components/CloudStrip";

export default function WeatherSection() {
  const deps = useLocationDeps();

  const next = useMemo(() => {
    const nowIsoPrefix = new Date().toISOString().slice(0, 13);
    const slice = deps.cloudSeries.filter((p) => p.time >= nowIsoPrefix).slice(0, 24);
    return slice.map((p) => ({ time: p.time, cloudcover: p.cloudPct }));
  }, [deps.cloudSeries]);

  if (!deps.location) {
    return (
      <div className="rounded-md border px-2 py-2 text-sm text-zinc-600 dark:text-zinc-300">
        Pick a location to load weather.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-xs text-zinc-600 dark:text-zinc-300">0% clear → 100% overcast</div>
        <button
          type="button"
          className="rounded-md border px-2 py-1 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800"
          onClick={() => deps.refreshAll()}
        >
          Refresh
        </button>
      </div>
      <div className="border rounded-md">
        {deps.loading ? (
          <div className="h-40 flex items-center justify-center text-sm text-zinc-500">
            Loading…
          </div>
        ) : deps.error ? (
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
