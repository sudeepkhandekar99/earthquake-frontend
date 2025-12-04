import { fetchSummaryQuakes, type QuakeSummary } from "@/lib/api";
import { MapView } from "@/components/map-view";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

type BandKey = "micro" | "light" | "moderate" | "strong" | "unknown" | string;

function computeStats(quakes: QuakeSummary[]) {
  const total = quakes.length;
  const maxMag = quakes.reduce<number>(
    (max, q) => (q.mag !== null && q.mag > max ? q.mag : max),
    0,
  );

  const bands: Record<BandKey, number> = {};
  for (const q of quakes) {
    const band = (q.mag_band || "unknown") as BandKey;
    bands[band] = (bands[band] || 0) + 1;
  }

  return { total, maxMag, bands };
}

export default async function Home() {
  let quakes: QuakeSummary[] = [];

  try {
    quakes = await fetchSummaryQuakes();
  } catch (err) {
    console.error("Failed to fetch summary quakes", err);
  }

  const { total, maxMag, bands } = computeStats(quakes);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Earthquake Dashboard
            </h1>
            <p className="text-sm md:text-base text-slate-300 mt-1">
              Live analytics from the USGS feed, processed through a serverless
              AWS backend.
            </p>
          </div>
          <div className="text-xs md:text-sm text-slate-300 text-right">
            <div>Backend: API Gateway → Lambda → S3</div>
            <div>Frontend: Next.js (App Router) on Vercel</div>
          </div>
        </header>

        {/* Main grid */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Map */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-50">
                Global Activity
              </h2>
              <span className="text-xs text-slate-300">
                Showing latest ingested snapshot
              </span>
            </div>
            {total === 0 ? (
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="py-10 text-center text-slate-200">
                  No data yet. Waiting for backend ingestion…
                </CardContent>
              </Card>
            ) : (
              <MapView quakes={quakes} />
            )}
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">
                  Snapshot Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">
                    Total events
                  </div>
                  <div className="mt-1 text-2xl font-semibold text-slate-50">
                    {total}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">
                    Max magnitude
                  </div>
                  <div className="mt-1 text-2xl font-semibold text-slate-50">
                    {maxMag.toFixed(1)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">
                    Data source
                  </div>
                  <div className="mt-1 text-sm text-slate-100">
                    USGS hourly feed
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">
                  Magnitude Bands
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {(["micro", "light", "moderate", "strong", "unknown"] as BandKey[])
                  .map((band) => {
                    const value = bands[band] ?? 0;
                    const pct = total > 0 ? (value / total) * 100 : 0;

                    const labelMap: Record<BandKey, string> = {
                      micro: "Micro (< 2.5)",
                      light: "Light (2.5–4.5)",
                      moderate: "Moderate (4.5–6.0)",
                      strong: "Strong (≥ 6.0)",
                      unknown: "Unknown",
                    };

                    return (
                      <div key={band} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-100">
                            {labelMap[band] ?? band}
                          </span>
                          <span className="text-xs text-slate-300">
                            {value} ({pct.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-500"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}