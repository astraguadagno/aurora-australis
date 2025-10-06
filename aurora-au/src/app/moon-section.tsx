"use client";

import MoonCard from "@/components/MoonCard";
import { useLocation } from "@/hooks/useLocation";

export default function MoonSection() {
  const { location } = useLocation();
  if (!location)
    return <div className="text-sm text-zinc-500">Pick a location to see moon data.</div>;
  return <MoonCard lat={location.lat} lon={location.lon} />;
}
