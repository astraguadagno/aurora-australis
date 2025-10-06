import { getAuroraAlert, getAuroraWatch, getAuroraOutlook } from "@/lib/sws";
import type { AuroraAlert, AuroraWatch, AuroraOutlook } from "@/lib/types";
import { toLocal } from "@/lib/time";
import StatusCard from "@/components/StatusCard";
import AuroraReadiness from "@/components/AuroraReadiness";
import KIndexSection from "./kindex-section";

async function fetchSafe<T>(fn: () => Promise<{ data: T }>): Promise<T | null> {
  try {
    const res = await fn();
    return (res as { data: T }).data ?? null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const [alert, watch, outlook] = await Promise.all([
    fetchSafe<AuroraAlert>(() => getAuroraAlert()),
    fetchSafe<AuroraWatch>(() => getAuroraWatch()),
    fetchSafe<AuroraOutlook>(() => getAuroraOutlook()),
  ]);

  const alertItems: Array<{ label: string; value: string }> = [];
  if (alert?.start_time) alertItems.push({ label: "Inicio", value: toLocal(alert.start_time) });
  if (alert?.valid_until)
    alertItems.push({ label: "Válido hasta", value: toLocal(alert.valid_until) });
  if (alert?.k_aus != null) alertItems.push({ label: "K AUS", value: String(alert.k_aus) });
  if (alert?.lat_band) alertItems.push({ label: "Latitud", value: String(alert.lat_band) });

  const watchItems: Array<{ label: string; value: string }> = [];
  if (watch?.issue_time) watchItems.push({ label: "Emitido", value: toLocal(watch.issue_time) });
  if (watch?.start_date) watchItems.push({ label: "Desde", value: toLocal(watch.start_date) });
  if (watch?.end_date) watchItems.push({ label: "Hasta", value: toLocal(watch.end_date) });
  if (watch?.k_aus != null) watchItems.push({ label: "K AUS", value: String(watch.k_aus) });
  if (watch?.lat_band) watchItems.push({ label: "Latitud", value: String(watch.lat_band) });

  const outlookItems: Array<{ label: string; value: string }> = [];
  if (outlook?.issue_time)
    outlookItems.push({ label: "Emitido", value: toLocal(outlook.issue_time) });
  if (outlook?.start_date)
    outlookItems.push({ label: "Desde", value: toLocal(outlook.start_date) });
  if (outlook?.end_date) outlookItems.push({ label: "Hasta", value: toLocal(outlook.end_date) });

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Aurora Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard title="Alert" status={alert ? "warn" : "info"}>
          {alertItems.length ? (
            <ul className="space-y-1">
              {alertItems.map((it) => (
                <li key={it.label} className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-300">{it.label}</span>
                  <span className="font-medium">{it.value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span>Sin datos de alerta.</span>
          )}
        </StatusCard>

        <StatusCard title="Watch" status={watch ? "warn" : "info"}>
          {watchItems.length ? (
            <ul className="space-y-1">
              {watchItems.map((it) => (
                <li key={it.label} className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-300">{it.label}</span>
                  <span className="font-medium">{it.value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span>Sin datos de watch.</span>
          )}
        </StatusCard>

        <StatusCard title="Outlook" status={outlook ? "info" : "info"}>
          {outlookItems.length ? (
            <ul className="space-y-1">
              {outlookItems.map((it) => (
                <li key={it.label} className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-300">{it.label}</span>
                  <span className="font-medium">{it.value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span>Sin datos de outlook.</span>
          )}
        </StatusCard>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">K-index (48 h)</h2>
        <KIndexSection />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">¿Salgo a buscarla?</h2>
        <AuroraReadiness alert={alert ?? undefined} watch={watch ?? undefined} />
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Cielos oscuros y poca Luna ayudan.
        </p>
      </section>
    </div>
  );
}
