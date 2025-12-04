"use client";

import type { QuakeSummary } from "@/lib/api";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type MapViewProps = {
  quakes: QuakeSummary[];
};

export function MapView({ quakes }: MapViewProps) {
  const firstWithCoords = quakes.find(
    (q) => q.lat !== null && q.lon !== null,
  );

  const center: [number, number] = firstWithCoords
    ? [firstWithCoords.lat as number, firstWithCoords.lon as number]
    : [0, 20];

  const zoom = firstWithCoords ? 3 : 2;

  return (
    <div className="h-[420px] rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {quakes
          .filter((q) => q.lat !== null && q.lon !== null)
          .map((q) => {
            const mag = q.mag ?? 0;
            const radius = 4 + mag * 1.2;

            const color =
              mag >= 6
                ? "#ef4444" // strong - red
                : mag >= 4.5
                ? "#f97316" // moderate - orange
                : mag >= 2.5
                ? "#eab308" // light - yellow
                : "#22c55e"; // micro - green

            return (
              <CircleMarker
                key={q.id}
                center={[q.lat as number, q.lon as number]}
                radius={radius}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.85,
                  weight: 1,
                }}
              >
                <Popup>
                  <div className="space-y-1 text-xs">
                    <div className="font-semibold">
                      M {q.mag ?? "?"} – {q.place ?? "Unknown location"}
                    </div>
                    <div>Band: {q.mag_band}</div>
                    {q.depth_km !== null && <div>Depth: {q.depth_km} km</div>}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>
    </div>
  );
}