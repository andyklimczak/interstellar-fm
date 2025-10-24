export interface Station {
  stationuuid: string;
  name: string;
  url: string;
  urlResolved: string;
  favicon?: string | null;
  country?: string | null;
  countryCode?: string | null;
  state?: string | null;
  tags?: string | null;
  bitrate?: number | null;
  homepage?: string | null;
  language?: string | null;
  codec?: string | null;
  votes?: number | null;
  clickCount?: number | null;
}
