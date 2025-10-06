export type LatBand = "high" | "mid" | "low" | "equatorial";

export type AuroraAlert = {
  start_time: string;
  valid_until: string;
  k_aus: number;
  lat_band: LatBand;
  description: string;
};

export type AuroraWatch = {
  issue_time: string;
  start_date: string;
  end_date: string;
  cause?: string;
  k_aus?: number;
  lat_band?: LatBand;
  comments?: string;
};

export type AuroraOutlook = {
  issue_time: string;
  start_date: string;
  end_date: string;
  cause?: string;
  k_aus?: number;
  lat_band?: LatBand;
};

export type KIndexPoint = {
  valid_time: string;
  analysis_time?: string;
  index: number;
};
