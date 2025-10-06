"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Point = { time: string; k: number };

type Props = {
  data: Point[];
};

export default function KChart({ data }: Props) {
  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <XAxis dataKey="time" tick={{ fontSize: 12 }} minTickGap={24} />
          <YAxis domain={[0, 9]} tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip formatter={(v: unknown) => String(v)} labelFormatter={(l) => String(l)} />
          <Line type="monotone" dataKey="k" stroke="#0ea5e9" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
