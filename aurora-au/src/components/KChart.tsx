"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fmtHour, fmtDayHour } from "@/lib/time";

type Point = { time: string; k: number };

type Props = {
  data: Point[];
};

export default function KChart({ data }: Props) {
  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <XAxis dataKey="time" tick={{ fontSize: 12 }} minTickGap={24} tickFormatter={fmtHour} />
          <YAxis domain={[0, 9]} tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            formatter={(v: unknown) => String(v)}
            labelFormatter={(l) => fmtDayHour(String(l))}
            contentStyle={{
              backgroundColor: "#0b0b0b",
              border: "1px solid #333",
              color: "#e5e7eb",
            }}
            labelStyle={{ color: "#e5e7eb" }}
            itemStyle={{ color: "#e5e7eb" }}
          />
          <Line type="monotone" dataKey="k" stroke="#60a5fa" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
