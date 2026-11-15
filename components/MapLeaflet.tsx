"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import { Place } from "@/data/places";
import { Filter } from "lucide-react";

interface MapLeafletProps {
  places: Place[];
  initialCenter?: [number, number];
  initialZoom?: number;
  height?: string;
  showFilters?: boolean;
}

export default function MapLeaflet({
  places,
  initialCenter = [16.0544, 107.5], // Center of Vietnam
  initialZoom = 6,
  height = "75vh",
  showFilters = true,
}: MapLeafletProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter places that have lat and lng
  const geoPlaces = useMemo(() => {
    return places.filter((p) => p.lat !== null && p.lng !== null);
  }, [places]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    geoPlaces.forEach((p) => set.add(p.category_en));
    return ["all", ...Array.from(set).sort()];
  }, [geoPlaces]);

  // Filtered for display
  const activePlaces = useMemo(() => {
    return geoPlaces.filter((p) => {
      const matchRegion = selectedRegion === "all" || p.region === selectedRegion;
      const matchCategory = selectedCategory === "all" || p.category_en === selectedCategory;
      return matchRegion && matchCategory;
    });
  }, [geoPlaces, selectedRegion, selectedCategory]);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    // Initialize Map if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: true,
      });

      // Add OpenStreetMap Tile Layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    // Clear previous markers
    markersLayer.clearLayers();

    // Custom Icon generator
    const createCustomIcon = () => {
      return L.divIcon({
        className: "custom-div-icon",
        html: `
          <div style="
            background-color: #0E7C7B;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            border: 2px solid white;
            cursor: pointer;
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });
    };

    // Add markers for active places
    activePlaces.forEach((place) => {
      if (place.lat === null || place.lng === null) return;

      const marker = L.marker([place.lat, place.lng], {
        icon: createCustomIcon(),
      });

      const popupHtml = `
        <div style="font-family: inherit; width: 220px; padding: 2px;">
          ${
            place.photo_status === "ok" && place.photo_url
              ? `<div style="width: 100%; height: 110px; border-radius: 8px; overflow: hidden; margin-bottom: 8px; background: #eee;">
                  <img src="${place.photo_url}" alt="${place.name_en}" style="width: 100%; height: 100%; object-fit: cover;" />
                 </div>`
              : ""
          }
          <div style="font-size: 11px; color: #0E7C7B; font-weight: 600; text-transform: uppercase; margin-bottom: 2px;">
            ${place.category_en}
          </div>
          <h4 style="font-family: serif; font-size: 15px; font-weight: bold; margin: 0 0 4px 0; color: #1D232A; line-height: 1.2;">
            ${place.name_en}
          </h4>
          <p style="font-size: 11px; color: #636B74; margin: 0 0 8px 0;">
            ${place.city} (${place.region})
          </p>
          <a href="/places/${place.slug}" style="display: inline-block; padding: 6px 12px; background: #0E7C7B; color: white; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600;">
            View details &rarr;
          </a>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 260 });
      markersLayer.addLayer(marker);
    });

    // Auto-fit bounds if markers exist and not using specific city center
    if (activePlaces.length > 0 && showFilters && activePlaces.length !== geoPlaces.length) {
      const group = L.featureGroup(markersLayer.getLayers());
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [activePlaces, initialCenter, initialZoom, showFilters, geoPlaces.length]);

  return (
    <div className="flex flex-col gap-4">
      {/* Map Filter Controls */}
      {showFilters && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-travel-border shadow-sm">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-travel-subtext">
              Map Filters:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Region select */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="text-xs px-3 py-2 bg-travel-muted border border-travel-border rounded-xl text-travel-text focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[44px]"
            >
              <option value="all">All Regions ({geoPlaces.length})</option>
              <option value="north">North Vietnam</option>
              <option value="central">Central Vietnam</option>
              <option value="south">South Vietnam</option>
            </select>

            {/* Category select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-3 py-2 bg-travel-muted border border-travel-border rounded-xl text-travel-text focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[44px]"
            >
              <option value="all">All Categories</option>
              {categories
                .filter((c) => c !== "all")
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>

            <span className="text-xs text-travel-subtext ml-2">
              Showing <strong>{activePlaces.length}</strong> markers
            </span>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        style={{ minHeight: height }}
        className="w-full rounded-2xl border border-travel-border shadow-card overflow-hidden relative z-0"
      />
    </div>
  );
}
