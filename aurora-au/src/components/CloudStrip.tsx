"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
          <XAxis dataKey="time" tick={{ fontSize: 12 }} minTickGap={24} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(v: unknown) => [`Clouds: ${v as number}%`, ""]}
            labelFormatter={(l) => String(l)}
          />
          <Area
            type="monotone"
            dataKey="cloudcover"
            stroke="#6b7280"
            fill="#9ca3af"
            fillOpacity={0.4}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
