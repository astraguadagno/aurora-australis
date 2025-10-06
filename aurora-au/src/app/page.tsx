import { getAuroraAlert, getAuroraWatch, getAuroraOutlook } from "@/lib/sws";
import { toLocal } from "@/lib/time";
import StatusCard from "@/components/StatusCard";
import AuroraReadiness from "@/components/AuroraReadiness";
import KIndexSection from "@/app/kindex-section";
import dynamic from "next/dynamic";
import WeatherSection from "@/app/weather-section";
import MoonSection from "@/app/moon-section";
import ReadinessSection from "@/app/readiness-section";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), { ssr: false });

export default async function Home() {
  const [alert, watch, outlook] = await Promise.all([
    getAuroraAlert()
      .then((arr) => (Array.isArray(arr) && arr.length > 0 ? arr[0] : null))
      .catch(() => null),
    getAuroraWatch()
      .then((arr) => (Array.isArray(arr) && arr.length > 0 ? arr[0] : null))
      .catch(() => null),
    getAuroraOutlook()
      .then((arr) => (Array.isArray(arr) && arr.length > 0 ? arr[0] : null))
      .catch(() => null),
  ]);

  const alertItems: Array<{ label: string; value: string }> = [];
  if (alert?.start_time) alertItems.push({ label: "Inicio", value: toLocal(alert.start_time) });
  if (alert?.valid_until)
    alertItems.push({ label: "Válido hasta", value: toLocal(alert.valid_until) });
  if (alert?.k_aus != null) alertItems.push({ label: "K AUS", value: String(alert.k_aus) });
  if (alert?.lat_band) alertItems.push({ label: "Latitud", value: String(alert.lat_band) });

  const watchItems: Array<{ label: string; value: string }> = [];
  if (watch?.start_date && watch?.end_date)
    watchItems.push({
      label: "Ventana",
      value: `${toLocal(watch.start_date)} → ${toLocal(watch.end_date)}`,
    });
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
        <StatusCard title="Alert" status={alert ? "ok" : "info"}>
          {alert ? (
            <ul className="space-y-1">
              {alert.k_aus != null && (
                <li className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-300">K AUS</span>
                  <span className="font-medium">{String(alert.k_aus)}</span>
                </li>
              )}
              {alert.lat_band && (
                <li className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-300">Latitud</span>
                  <span className="font-medium">{String(alert.lat_band)}</span>
                </li>
              )}
              {alert.valid_until && (
                <li className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-300">Válido hasta</span>
                  <span className="font-medium">{toLocal(alert.valid_until)}</span>
                </li>
              )}
              {alert.description && (
                <li className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-300">Descripción</span>
                  <span className="font-medium">{alert.description}</span>
                </li>
              )}
            </ul>
          ) : (
            <span>No active alert.</span>
          )}
        </StatusCard>

        <StatusCard title="Watch (48h)" status={watch ? "warn" : "info"}>
          {watch ? (
            <ul className="space-y-1">
              {watch.start_date && watch.end_date && (
                <li className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-300">Ventana</span>
                  <span className="font-medium">{`${toLocal(watch.start_date)} → ${toLocal(watch.end_date)}`}</span>
                </li>
              )}
              {watch.k_aus != null && (
                <li className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-300">K AUS</span>
                  <span className="font-medium">{String(watch.k_aus)}</span>
                </li>
              )}
              {watch.lat_band && (
                <li className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-300">Latitud</span>
                  <span className="font-medium">{String(watch.lat_band)}</span>
                </li>
              )}
            </ul>
          ) : (
            <span>No current watch.</span>
          )}
        </StatusCard>

        <StatusCard title="Outlook (3–7 días)" status={outlook ? "info" : "info"}>
          {outlook ? (
            <ul className="space-y-1">
              {outlook.start_date && outlook.end_date && (
                <li className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-300">Ventana</span>
                  <span className="font-medium">{`${toLocal(outlook.start_date)} → ${toLocal(outlook.end_date)}`}</span>
                </li>
              )}
              {outlook.cause && (
                <li className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-300">Causa</span>
                  <span className="font-medium">{outlook.cause}</span>
                </li>
              )}
            </ul>
          ) : (
            <span>No outlook available.</span>
          )}
        </StatusCard>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">K-index (48 h)</h2>
        <LocationPicker />
        <KIndexSection />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Clouds (next 12–24h)</h2>
        <WeatherSection />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Moon (tonight)</h2>
        <MoonSection />
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-medium">Readiness (now)</h2>
        <ReadinessSection site="Hobart" />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Moon (tonight)</h2>
        <MoonSection />
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
