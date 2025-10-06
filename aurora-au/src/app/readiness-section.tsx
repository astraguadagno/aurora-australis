"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import ReadinessScore from "@/components/ReadinessScore";
import { computeReadiness } from "@/lib/readiness";
import { getKIndex } from "@/lib/sws";
import { getWeather } from "@/lib/weather";
import { sampleTonight } from "@/lib/moon";
import { useLocation } from "@/hooks/useLocation";
import { hoursAgoIso, nowIso } from "@/lib/time";
import type { KIndexPoint } from "@/lib/types";

export default function ReadinessSection({ site }: { site: string }) {
  const { location } = useLocation();
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

  const wx = useSWR(
    location ? ["wx", location.lat, location.lon] : null,
    () => getWeather(location!.lat, location!.lon),
    { revalidateOnFocus: false },
  );

  const moon = useSWR(
    location ? ["moon", location.lat, location.lon] : null,
    () => sampleTonight(location!.lat, location!.lon),
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    const kNow = k.data ? Number(k.data.index) : null;
    const cloudNowPct = wx.data?.length ? Number(wx.data[0].cloudcover) : null;
    const mNow = moon.data?.length ? moon.data[0] : null;
    const moonIllumPct = mNow?.illumPct ?? null;
    const moonAltDeg = mNow?.altDeg ?? null;
    const { score, factors } = computeReadiness({ kNow, cloudNowPct, moonIllumPct, moonAltDeg });
    setScore(score);
    setFactors(factors);
  }, [k.data, wx.data, moon.data]);

  return <ReadinessScore score={score} factors={factors} />;
}
