import { formatInTimeZone } from "date-fns-tz";

const TZ = process.env.TZ_DEFAULT || "Australia/Melbourne";

export const toLocal = (iso: string) => formatInTimeZone(new Date(iso), TZ, "yyyy-MM-dd HH:mm");

export const nowIso = () => new Date().toISOString();

export const hoursAgoIso = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

export const toApiUtc = (d: Date | string) =>
  formatInTimeZone(new Date(d), "UTC", "yyyy-MM-dd HH:mm:ss");
