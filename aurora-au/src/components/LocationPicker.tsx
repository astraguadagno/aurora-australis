"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, type UserLocation } from "@/hooks/useLocation";

type GeoResult = {
  id: number;
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
};

export default function LocationPicker() {
  const { location, setLocation } = useLocation();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<GeoResult[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const currentLabel = useMemo(() => {
    if (!location) return "No location selected";
    return `${location.name} (${location.lat.toFixed(2)}, ${location.lon.toFixed(2)})`;
  }, [location]);

  const handleUseMyLocation = () => {
    setError(null);
    if (!("geolocation" in navigator)) {
      setError("Geolocation not available in this browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc: UserLocation = { lat: latitude, lon: longitude, name: "My location" };
        setLocation(loc);
        // temporary debug
        // eslint-disable-next-line no-console
        console.log("Selected location:", loc);
      },
      (err) => {
        setError(err.message || "Unable to fetch location");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query,
    )}&count=5&language=en`;
    fetch(url, { signal: ac.signal })
      .then(async (r) => {
        const j = (await r.json()) as { results?: GeoResult[] };
        setResults(j.results ?? []);
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setError("Geocoding request failed");
      })
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, [query]);

  return (
    <div className="rounded-md border px-2 py-2 flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <button
          type="button"
          className="rounded-md border px-2 py-1 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
          onClick={handleUseMyLocation}
        >
          📍 Use my location
        </button>
        <input
          className="flex-1 rounded-md border px-2 py-1 text-sm bg-white dark:bg-zinc-900"
          placeholder="Search a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="text-xs text-zinc-600 dark:text-zinc-300">Current: {currentLabel}</div>
      {error ? (
        <div className="text-xs text-red-600">{error}</div>
      ) : loading ? (
        <div className="text-xs text-zinc-500">Searching…</div>
      ) : results.length ? (
        <ul className="border rounded-md divide-y max-h-48 overflow-auto">
          {results.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                className="w-full text-left px-2 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm"
                onClick={() => {
                  const loc: UserLocation = {
                    lat: r.latitude,
                    lon: r.longitude,
                    name: `${r.name}${r.country ? ", " + r.country : ""}`,
                  };
                  setLocation(loc);
                  setQuery("");
                  setResults([]);
                  // temporary debug
                  // eslint-disable-next-line no-console
                  console.log("Selected location:", loc);
                }}
              >
                {r.name}
                {r.country ? <span className="text-zinc-500">, {r.country}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
