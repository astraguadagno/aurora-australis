"use client";

import { useCallback, useEffect, useState } from "react";

export type UserLocation = { lat: number; lon: number; name: string } | null;

const STORAGE_KEY = "aurora.location";

export function useLocation() {
  const [location, setLocationState] = useState<UserLocation>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as UserLocation;
        if (parsed && typeof parsed === "object" && "lat" in parsed && "lon" in parsed) {
          setLocationState(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const setLocation = useCallback((loc: UserLocation) => {
    setLocationState(loc);
    try {
      if (loc) localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { location, setLocation } as const;
}
