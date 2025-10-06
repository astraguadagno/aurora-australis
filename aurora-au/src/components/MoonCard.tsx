"use client";

import { useEffect, useState } from "react";
import { getMoonData, sampleTonight, type MoonData } from "@/lib/moon";
import { fmtDayHour, fmtHour } from "@/lib/time";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

export default function MoonCard({ lat, lon }: { lat: number; lon: number }) {
  const [nowData, setNowData] = useState<MoonData | null>(null);
  const [series, setSeries] = useState<{ time: string; illumPct: number; altDeg: number }[]>([]);

  useEffect(() => {
    setNowData(getMoonData(lat, lon));
    setSeries(sampleTonight(lat, lon));
  }, [lat, lon]);

  if (!nowData) return <div className="p-4 border rounded-md">Loading…</div>;

  const hint =
    nowData.altitudeDeg > 10
      ? "Moon high (reduces visibility)"
      : "Moon low/behind horizon (better)";

  return (
    <div className="p-4 border rounded-md space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">🌙 Moon</h3>
        <span className="text-sm text-zinc-500">{fmtDayHour(new Date().toISOString())}</span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <div className="text-zinc-500">Phase</div>
          <div className="font-medium">{nowData.phaseName}</div>
        </div>
        <div>
          <div className="text-zinc-500">Illum.</div>
          <div className="font-medium">{nowData.illuminationPct}%</div>
        </div>
        <div>
          <div className="text-zinc-500">Altitude</div>
          <div className="font-medium">{nowData.altitudeDeg}°</div>
        </div>
      </div>
      <div className="text-xs text-zinc-500">{hint}</div>

      <div className="h-36 border rounded-md">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <XAxis dataKey="time" tick={{ fontSize: 12 }} minTickGap={24} tickFormatter={fmtHour} />
            <YAxis domain={[-10, 80]} tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={(l) => fmtDayHour(String(l))}
              formatter={(v: unknown, n) =>
                n === "altDeg" ? [`${v as number}°`, "Altitude"] : [`${v as number}%`, "Illum."]
              }
              contentStyle={{
                backgroundColor: "#0b0b0b",
                border: "1px solid #333",
                color: "#e5e7eb",
              }}
              labelStyle={{ color: "#e5e7eb" }}
              itemStyle={{ color: "#e5e7eb" }}
            />
            <Area
              type="monotone"
              dataKey="altDeg"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.15}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
