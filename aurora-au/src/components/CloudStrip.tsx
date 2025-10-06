"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fmtHour, fmtDayHour } from "@/lib/time";

type Props = {
  data: { time: string; cloudcover: number }[];
};

export default function CloudStrip({ data }: Props) {
  if (!data?.length) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-zinc-500">
        No cloud data
      </div>
    );
  }
  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <XAxis dataKey="time" tick={{ fontSize: 12 }} minTickGap={24} tickFormatter={fmtHour} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(v: unknown) => [`Clouds: ${v as number}%`, ""]}
            labelFormatter={(l) => fmtDayHour(String(l))}
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
            dataKey="cloudcover"
            stroke="#60a5fa"
            fill="#60a5fa"
            fillOpacity={0.25}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
