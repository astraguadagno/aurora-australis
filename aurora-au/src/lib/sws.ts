import type { AuroraAlert, AuroraWatch, AuroraOutlook, KIndexPoint } from "@/lib/types";
import { toApiUtc } from "@/lib/time";

type SwsResponse<T> = { data: T };

async function post<T>(method: string, options?: unknown): Promise<SwsResponse<T>> {
  const res = await fetch("/api/sws", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method, options }),
  });
  const json: { ok?: boolean; status?: number; data?: unknown } = await res.json();
  if (!json?.ok) throw new Error(`SWS ${json?.status ?? "error"}`);
  return { data: json.data as T };
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
