"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerMapProps {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
  height?: string;
}

export default function LocationPickerMap({
  lat,
  lng,
  onChange,
  height = "200px",
}: LocationPickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    const defaultLat = lat || 16.0544; // Center of Vietnam
    const defaultLng = lng || 107.5;
    const defaultZoom = lat && lng ? 11 : 5;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: defaultZoom,
        zoomControl: true,
      });

      // ESRI World Street Map tiles
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri",
          maxZoom: 19,
        }
      ).addTo(map);

      // Custom Pin Icon
      const pinIcon = L.divIcon({
        className: "custom-picker-pin",
        html: `
          <div style="
            background-color: #0E7C7B;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            border: 2px solid white;
            cursor: grab;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background-color: white;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      // Initial marker if lat/lng provided
      if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
        const marker = L.marker([lat, lng], {
          icon: pinIcon,
          draggable: true,
        }).addTo(map);

        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          onChange(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
        });

        markerRef.current = marker;
      }

      // Map click handler to set or reposition marker
      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        const roundedLat = Number(clickLat.toFixed(6));
        const roundedLng = Number(clickLng.toFixed(6));

        if (!markerRef.current) {
          const marker = L.marker([clickLat, clickLng], {
            icon: pinIcon,
            draggable: true,
          }).addTo(map);

          marker.on("dragend", () => {
            const pos = marker.getLatLng();
            onChange(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
          });

          markerRef.current = marker;
        } else {
          markerRef.current.setLatLng([clickLat, clickLng]);
        }

        onChange(roundedLat, roundedLng);
      });

      mapRef.current = map;

      // Force recalculate bounds when rendered in modal
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 250);

      return () => {
        clearTimeout(timer);
        map.remove();
        mapRef.current = null;
        markerRef.current = null;
      };
    }
  }, []);

  // Sync external changes (typing or quick-paste) with map marker
  useEffect(() => {
    if (!mapRef.current) return;
    if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
      if (markerRef.current) {
        const currentPos = markerRef.current.getLatLng();
        if (Math.abs(currentPos.lat - lat) > 0.0001 || Math.abs(currentPos.lng - lng) > 0.0001) {
          markerRef.current.setLatLng([lat, lng]);
          mapRef.current.panTo([lat, lng]);
        }
      }
    }
  }, [lat, lng]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-inner">
      <div ref={mapContainerRef} style={{ height, width: "100%" }} />
      <div className="absolute bottom-2 left-2 z-[400] bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-700 shadow-sm border border-slate-200 pointer-events-none flex items-center gap-1.5">
        <span>📍 Click or drag pin to adjust coordinates</span>
      </div>
    </div>
  );
}
