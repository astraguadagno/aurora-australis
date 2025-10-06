import type { AuroraAlert, AuroraWatch, AuroraOutlook, KIndexPoint } from "@/lib/types";
import { toApiUtc } from "@/lib/time";

async function post<T>(method: string, options?: unknown): Promise<T> {
  const res = await fetch("/api/sws", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method, options }),
  });

  const json: { ok?: boolean; status?: number; data?: unknown } = await res.json();

  if (!json?.ok) {
    let message = `SWS ${json?.status ?? "error"}`;
    const dataVal = json.data as unknown;
    if (
      typeof dataVal === "object" &&
      dataVal !== null &&
      "error" in (dataVal as Record<string, unknown>)
    ) {
      const maybeErr = (dataVal as { error?: unknown }).error;
      if (typeof maybeErr === "string") message = maybeErr;
    }
    throw new Error(message);
  }

  // unwrap nested .data if present
  const dataVal = json.data as unknown;
  const inner = Array.isArray(dataVal)
    ? (dataVal as unknown[])
    : Array.isArray((dataVal as { data?: unknown[] } | undefined)?.data)
      ? (((dataVal as { data?: unknown[] } | undefined)?.data as unknown[]) ?? [])
      : [];

  return inner as T;
}

export const getAuroraAlert = () => post<AuroraAlert[]>("get-aurora-alert");
export const getAuroraWatch = () => post<AuroraWatch[]>("get-aurora-watch");
export const getAuroraOutlook = () => post<AuroraOutlook[]>("get-aurora-outlook");

export const getKIndex = (location: string, start?: string, end?: string) => {
  const opts: { location: string; start?: string; end?: string } = { location };
  if (start) opts.start = toApiUtc(start);
  if (end) opts.end = toApiUtc(end);
  return post<KIndexPoint[]>("get-k-index", opts);
};
