"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { fmtHour, fmtDayHour } from "@/lib/time";

type Point = { time: string; k: number };

type Props = {
  data: Point[];
};

function kColor(k: number) {
  if (k >= 7) return "#ef4444";
  if (k >= 5) return "#f59e0b";
  if (k >= 4) return "#facc15";
  return "#60a5fa";
}

export default function KChart({ data }: Props) {
  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <XAxis dataKey="time" tick={{ fontSize: 12 }} minTickGap={24} tickFormatter={fmtHour} />
          <YAxis domain={[0, 9]} tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            formatter={(v: unknown) => String(v)}
            labelFormatter={(l) => fmtDayHour(String(l))}
            contentStyle={{ backgroundColor: "#0b0b0b", border: "1px solid #333", color: "#e5e7eb" }}
            labelStyle={{ color: "#e5e7eb" }}
            itemStyle={{ color: "#e5e7eb" }}
          />
          <Bar dataKey="k" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={kColor(d.k)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 flex items-center gap-3 text-xs text-zinc-400">
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm" style={{ background: "#60a5fa" }} /> Quiet (K 0–3)
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm" style={{ background: "#facc15" }} /> Active (K 4)
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm" style={{ background: "#f59e0b" }} /> Storm (K 5–6)
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm" style={{ background: "#ef4444" }} /> Severe (K 7–9)
        </span>
      </div>
    </div>
  );
}
