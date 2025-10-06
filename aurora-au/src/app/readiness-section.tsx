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
    const kNow = k.data ? Number(k.data.index) : null;
    const cloudNowPct = deps.cloudNowPct;
    const moonIllumPct = deps.moonIllumPct;
    const moonAltDeg = deps.moonAltDeg;
    const { score, factors } = computeReadiness({ kNow, cloudNowPct, moonIllumPct, moonAltDeg });
    setScore(score);
    setFactors(factors);
  }, [k.data, deps.cloudNowPct, deps.moonIllumPct, deps.moonAltDeg]);

  return <ReadinessScore score={score} factors={factors} />;
}
