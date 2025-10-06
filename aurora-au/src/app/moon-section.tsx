"use client";

import MoonCard from "@/components/MoonCard";
import useLocationDeps from "@/hooks/useLocationDeps";

export default function MoonSection() {
  const deps = useLocationDeps();
  if (!deps.location)
    return <div className="text-sm text-zinc-500">Pick a location to see moon data.</div>;
  return <MoonCard lat={deps.location.lat} lon={deps.location.lon} />;
}
