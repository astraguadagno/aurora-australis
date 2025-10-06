"use client";

import React from "react";

export default function ReadinessScore({ score, factors }: { score: number; factors: string[] }) {
  let tone = "text-zinc-200 border-zinc-700";
  if (score >= 70) tone = "text-green-300 border-green-600";
  else if (score >= 40) tone = "text-amber-300 border-amber-600";
  else tone = "text-zinc-300 border-zinc-700";

  return (
    <div className={`p-4 border rounded-xl bg-zinc-900 ${tone} space-y-3`}>
      <div className="text-sm opacity-80">Readiness</div>
      <div className="text-4xl font-semibold">{score}</div>
      <div className="flex flex-wrap gap-2">
        {factors.map((f, i) => (
          <span key={i} className="text-xs px-2 py-1 rounded-full border border-current/40">
            {f}
          </span>
        ))}
      </div>
      <div className="text-xs opacity-70">
        Higher is better. Clouds and bright/high Moon reduce visibility.
      </div>
    </div>
  );
}
