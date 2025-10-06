"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import KChart from "@/components/KChart";
import SiteSelect from "@/components/SiteSelector";
import { getKIndex } from "@/lib/sws";
import { hoursAgoIso, nowIso } from "@/lib/time";

type Point = { time: string; k: number };

const fetcher = async (site: string) => {
  const start = hoursAgoIso(48);
  const end = nowIso();
  const res = await getKIndex(site, start, end);
  const arr = (res?.data as Array<{ valid_time: string; index: number }>) || [];
  return arr.map((p) => ({ time: p.valid_time, k: p.index })) as Point[];
};

export default function KIndexSection() {
  const [site, setSite] = useState<string>("Hobart");
  const { data, error, isLoading, mutate } = useSWR(["kindex", site], () => fetcher(site));

  const chartData = useMemo<Point[]>(() => data ?? [], [data]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <SiteSelect value={site} onChange={(v) => setSite(v)} />
        <button
          className="text-sm rounded-md border px-2 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          onClick={() => mutate()}
          type="button"
        >
          Actualizar
        </button>
      </div>
      <div className="border rounded-md h-56">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-sm text-zinc-500">
            Cargando…
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-sm text-red-500">
            Error cargando datos
          </div>
        ) : chartData.length ? (
          <KChart data={chartData} />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-zinc-500">
            Sin datos
          </div>
        )}
      </div>
    </div>
  );
}
