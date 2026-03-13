"use client";

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Provider {
  id: number;
  name: string;
  type: string;
  specialty: string;
  lat: number;
  lng: number;
  city: string;
  providers: number;
  address: string;
  phone: string;
}

interface LeafletMapProps {
  providers: Provider[];
  selectedProvider: Provider | null;
  onSelectProvider: (provider: Provider | null) => void;
  typeFilter: string;
  specialtyFilter: string;
}

const typeColors: Record<string, string> = {
  "Hospital": "#ef4444",
  "Practice": "#3b82f6",
  "Facility": "#22c55e",
};

export default function LeafletMap({ 
  providers, 
  selectedProvider, 
  onSelectProvider,
  typeFilter,
  specialtyFilter 
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Filter providers
  const filteredProviders = providers.filter(p => {
    const matchesType = typeFilter === "All Types" || p.type === typeFilter;
    const matchesSpecialty = specialtyFilter === "All" || p.specialty === specialtyFilter;
    return matchesType && matchesSpecialty;
  });

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Create map centered on Cleveland, OH
    const map = L.map(containerRef.current, {
      center: [41.4993, -81.6944],
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Alternative: Dark tile layer for better aesthetics
    // L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    //   maxZoom: 19,
    // }).addTo(map);

    // Create markers layer group
    markersRef.current = L.layerGroup().addTo(map);

    mapRef.current = map;
    setIsMapReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when providers or filters change
  useEffect(() => {
    if (!mapRef.current || !markersRef.current || !isMapReady) return;

    // Clear existing markers
    markersRef.current.clearLayers();

    // Add markers for filtered providers
    filteredProviders.forEach(provider => {
      const color = typeColors[provider.type] || '#6b7280';
      
      // Create custom icon
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            position: relative;
            width: 24px;
            height: 24px;
          ">
            ${provider.type === 'Hospital' ? `
              <div style="
                position: absolute;
                inset: -4px;
                background: ${color}40;
                border-radius: 50%;
                animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
            ` : ''}
            <div style="
              position: absolute;
              inset: 0;
              background: ${color};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              ${selectedProvider?.id === provider.id ? 'transform: scale(1.5);' : ''}
            "></div>
            ${provider.providers > 50 ? `
              <div style="
                position: absolute;
                top: -2px;
                right: -2px;
                width: 10px;
                height: 10px;
                background: #facc15;
                border: 2px solid white;
                border-radius: 50%;
              "></div>
            ` : ''}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([provider.lat, provider.lng], { icon })
        .on('click', () => onSelectProvider(provider))
        .bindTooltip(`
          <div style="font-weight: 600; color: #fff;">${provider.name}</div>
          <div style="color: #94a3b8; font-size: 12px;">${provider.city} • ${provider.providers} providers</div>
        `, {
          direction: 'top',
          offset: [0, -10],
          className: 'custom-tooltip',
        });

      markersRef.current?.addLayer(marker);
    });
  }, [filteredProviders, selectedProvider, isMapReady, onSelectProvider]);

  // Fly to selected provider
  useEffect(() => {
    if (!mapRef.current || !selectedProvider) return;
    mapRef.current.flyTo([selectedProvider.lat, selectedProvider.lng], 13, {
      duration: 0.5,
    });
  }, [selectedProvider]);

  return (
    <>
      <style jsx global>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .custom-tooltip {
          background: #1e293b !important;
          border: 1px solid #475569 !important;
          border-radius: 8px !important;
          padding: 8px 12px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
        }
        .custom-tooltip::before {
          border-top-color: #1e293b !important;
        }
        .leaflet-container {
          background: #0f172a;
        }
        .leaflet-control-zoom a {
          background: #334155 !important;
          color: #fff !important;
          border-color: #475569 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #475569 !important;
        }
        .leaflet-control-attribution {
          background: rgba(15, 23, 42, 0.8) !important;
          color: #64748b !important;
        }
        .leaflet-control-attribution a {
          color: #818cf8 !important;
        }
      `}</style>
      <div 
        ref={containerRef} 
        className="w-full h-full rounded-xl overflow-hidden"
        style={{ minHeight: '500px' }}
      />
    </>
  );
}
