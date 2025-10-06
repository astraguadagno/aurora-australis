type SwsResponse<T> = { data: T };

async function post<T>(method: string, options?: unknown): Promise<SwsResponse<T>> {
  const res = await fetch("/api/sws", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method, options }),
  });
  const json: { ok?: boolean; status?: number; data?: unknown } = await res.json();
  if (!json?.ok) throw new Error(`SWS ${json?.status ?? "error"}`);
  return json.data as SwsResponse<T>;
}

export const getAuroraAlert = () => post("get-aurora-alert");
export const getAuroraWatch = () => post("get-aurora-watch");
export const getAuroraOutlook = () => post("get-aurora-outlook");
export const getKIndex = (location: string, start?: string, end?: string) =>
  post("get-k-index", { location, ...(start ? { start } : {}), ...(end ? { end } : {}) });
