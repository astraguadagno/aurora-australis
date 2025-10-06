type MaybeBand = string | undefined;

type Brief = {
  k_aus?: number;
  lat_band?: MaybeBand;
};

type Props = {
  alert?: Brief;
  watch?: Brief;
};

export default function AuroraReadiness({ alert, watch }: Props) {
  const alertBand = alert?.lat_band;
  const watchK = watch?.k_aus ?? 0;

  const midOrHigh = (band: MaybeBand) => band === "mid" || band === "high";

  if (alert && midOrHigh(alertBand)) {
    return <span>Buenas chances en TAS si el cielo está despejado.</span>;
  }
  if (watch && watchK >= 5) {
    return <span>Posibles chances próximas 48 h.</span>;
  }
  return <span>Sin señales fuertes, seguí el índice K.</span>;
}
