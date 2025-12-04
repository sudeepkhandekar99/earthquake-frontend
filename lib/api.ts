const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE) {
  console.warn("NEXT_PUBLIC_API_BASE_URL is not set. API calls will fail.");
}

export type QuakeSummary = {
  id: string;
  time: number;
  mag: number | null;
  mag_band: string;
  place: string | null;
  lat: number | null;
  lon: number | null;
  depth_km: number | null;
};

async function getJson(path: string) {
  if (!API_BASE) {
    throw new Error("API base URL not configured");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }

  return res.json();
}

export async function fetchLatestQuakes() {
  return getJson("/earthquakes/latest");
}

export async function fetchSummaryQuakes(): Promise<QuakeSummary[]> {
  return getJson("/earthquakes/summary");
}