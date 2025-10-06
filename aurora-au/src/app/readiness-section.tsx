"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import ReadinessScore from "@/components/ReadinessScore";
import { computeReadiness } from "@/lib/readiness";
import { getKIndex } from "@/lib/sws";
import useLocationDeps from "@/hooks/useLocationDeps";
import { hoursAgoIso, nowIso } from "@/lib/time";
import type { KIndexPoint } from "@/lib/types";

export default function ReadinessSection({ site }: { site: string }) {
  const deps = useLocationDeps();
  const [score, setScore] = useState(0);
  const [factors, setFactors] = useState<string[]>([]);
  const [hasComputed, setHasComputed] = useState(false);

  const k = useSWR<KIndexPoint | null>(
    ["kNow", site],
    async () => {
      const start = hoursAgoIso(6),
        end = nowIso();
      const arr = await getKIndex(site, start, end);
      return Array.isArray(arr) && arr.length ? arr[arr.length - 1] : null;
    },
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    const kNow = k.data ? Number(k.data.index ?? (k.data as unknown as { k?: number }).k ?? NaN) : null;
    const cloudNowPct = deps.cloudNowPct ?? null;
    const moonIllumPct = deps.moonIllumPct ?? null;
    const moonAltDeg = deps.moonAltDeg ?? null;

    const hasAny = kNow != null || cloudNowPct != null || moonIllumPct != null || moonAltDeg != null;
    if (!hasAny) return; // keep previous score

    const { score, factors } = computeReadiness({ kNow, cloudNowPct, moonIllumPct, moonAltDeg });
    setScore(score);
    setFactors(factors);
    setHasComputed(true);
  }, [k.data, deps.cloudNowPct, deps.moonIllumPct, deps.moonAltDeg]);

  if (!hasComputed) {
    return (
      <div className="p-4 border rounded-xl bg-zinc-900 text-zinc-300 text-sm">Calculating…</div>
    );
  }
  return <ReadinessScore score={score} factors={factors} />;
}
