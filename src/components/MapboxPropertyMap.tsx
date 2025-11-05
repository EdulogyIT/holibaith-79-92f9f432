// src/components/MapboxPropertyMap.tsx
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  price: string | number;
  price_type?: string;
  price_currency?: string;
  city: string;
  location: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
}

interface MapboxPropertyMapProps {
  properties: Property[];
  hoveredPropertyId?: string | null;
}


/** -------- Algeria helpers -------- */
const norm = (s: string) =>
  (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

const DZ: Record<string, { lat: number; lng: number }> = {
  algiers:{lat:36.7538,lng:3.0588}, alger:{lat:36.7538,lng:3.0588},
  oran:{lat:35.6969,lng:-0.6331}, constantine:{lat:36.365,lng:6.6147},
  annaba:{lat:36.9,lng:7.7667}, bejaia:{lat:36.7525,lng:5.0556},
  tiziouzou:{lat:36.7169,lng:4.0497}, blida:{lat:36.48,lng:2.83},
  tipaza:{lat:36.5897,lng:2.4477}, boumerdes:{lat:36.7664,lng:3.4772},
  jijel:{lat:36.8167,lng:5.7667}, skikda:{lat:36.8665,lng:6.9063},
  mostaganem:{lat:35.9312,lng:0.0892}, chlef:{lat:36.1647,lng:1.3317},
  tlemcen:{lat:34.878,lng:-1.315}, 'sidi bel abbes':{lat:35.1899,lng:-0.6417},
  relizane:{lat:35.737,lng:0.555}, bouira:{lat:36.38,lng:3.9014},
  medea:{lat:36.2642,lng:2.7539}, tiaret:{lat:35.371,lng:1.3169},
  tissemsilt:{lat:35.6072,lng:1.8115}, msila:{lat:35.7058,lng:4.5418},
  setif:{lat:36.1905,lng:5.4139}, batna:{lat:35.5559,lng:6.1741},
  biskra:{lat:34.85,lng:5.7333}, khenchela:{lat:35.4358,lng:7.1433},
  tebessa:{lat:35.4042,lng:8.1242}, 'souk ahras':{lat:36.2848,lng:7.9515},
  djelfa:{lat:34.6728,lng:3.263}, laghouat:{lat:33.8,lng:2.8833},
  bechar:{lat:31.6111,lng:-2.2333}, adrar:{lat:27.874,lng:-0.2939},
  tamanrasset:{lat:22.785,lng:5.5228}, illizi:{lat:26.4833,lng:8.4667},
  eloued:{lat:33.3683,lng:6.8676}, ouargla:{lat:31.95,lng:5.3167},
  ghardaia:{lat:32.489,lng:3.6736}, elbayadh:{lat:33.6832,lng:1.0193},
  naama:{lat:33.2667,lng:-0.3167},
};
const cityLL = (city: string) => DZ[norm(city)] || { lat: 36.7538, lng: 3.0588 };


export const MapboxPropertyMap = ({ properties, hoveredPropertyId }: MapboxPropertyMapProps) => {
  const mapEl = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [token, setToken] = useState('');
  const [mapError, setMapError] = useState<string | null>(null);
  const htmlMarkers = useRef<mapboxgl.Marker[]>([]);
  const zoomLevelRef = useRef(5);
  const zoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  /** Get Mapbox token */
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (!error && data?.token) setToken(data.token);
        else setToken('pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTRmYm0ycDMwYWVzMnBzaHo0aTg5enBkIn0.VhY5RN5gX_zc5SjGHLqKJQ');
      } catch {
        setToken('pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTRmYm0ycDMwYWVzMnBzaHo0aTg5enBkIn0.VhY5RN5gX_zc5SjGHLqKJQ');
      }
    })();
  }, []);

  /** Init map */
  useEffect(() => {
    if (!token || !mapEl.current || map.current) return;
    
    try {
      mapboxgl.accessToken = token;
      
      // Check if browser supports WebGL
      if (!mapboxgl.supported()) {
        console.warn('WebGL not supported - map will not render');
        setMapError('Your device does not support WebGL, which is required for interactive maps. This may be due to hardware limitations or browser settings.');
        return;
      }

      const m = new mapboxgl.Map({
      container: mapEl.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [3.0588, 36.7538],
      zoom: 5,
      cooperativeGestures: true,
      dragRotate: false,
      touchPitch: false,
    });
    const navControl = new mapboxgl.NavigationControl({
      visualizePitch: true,
      showCompass: true,
      showZoom: true,
    });
    
    m.addControl(navControl, 'top-right');
    
    // Add custom styling for better visibility
    const style = document.createElement('style');
    style.textContent = `
      .mapboxgl-ctrl-group {
        background: white !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
        border-radius: 8px !important;
      }
      .mapboxgl-ctrl-zoom-in,
      .mapboxgl-ctrl-zoom-out,
      .mapboxgl-ctrl-compass {
        width: 36px !important;
        height: 36px !important;
        font-size: 18px !important;
        font-weight: bold !important;
      }
      .mapboxgl-ctrl-icon {
        filter: contrast(1.2) !important;
      }
    `;
    document.head.appendChild(style);
    
      m.once('load', () => setIsMapReady(true));
      map.current = m;

      return () => {
        if (zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
        htmlMarkers.current.forEach(mm => mm.remove());
        htmlMarkers.current = [];
        m.remove();
        map.current = null;
        setIsMapReady(false);
      };
    } catch (error) {
      console.error('Map initialization failed:', error);
      setMapError('Failed to initialize map. Please try refreshing the page or use a different browser.');
    }
  }, [token]);


  /** Draw price pills at exact coordinates */
  useEffect(() => {
    const m = map.current;
    if (!m || !isMapReady) return;

    // clear existing pills
    htmlMarkers.current.forEach(mm => mm.remove());
    htmlMarkers.current = [];

    // Validate coordinates are within Algeria's bounds
    const isValidCoord = (lat: number, lng: number) => {
      return lat >= 18 && lat <= 37 && lng >= -9 && lng <= 12;
    };

    // Place each property at its exact coordinates
    properties.forEach((p) => {
      const lat = p.latitude ?? cityLL(p.city).lat;
      const lng = p.longitude ?? cityLL(p.city).lng;

      // Skip markers with invalid coordinates
      if (!isValidCoord(lat, lng)) {
        console.warn(`Invalid coordinates for property ${p.id}:`, { lat, lng, city: p.city });
        return;
      }
        const priceNum = typeof p.price === 'number' ? p.price : parseFloat(String(p.price));
        const label = formatPrice(priceNum, p.price_type, p.price_currency || 'DZD');

        const el = document.createElement('div');
        el.setAttribute('data-property-id', p.id);
        const isHovered = hoveredPropertyId === p.id;
        el.style.cssText = `
          background:#FF385C;color:#fff;padding:6px 10px;border-radius:999px;
          font-weight:700;font-size:12px;white-space:nowrap;
          border:2px solid #fff;cursor:pointer;
          pointer-events:auto;
          transform: ${isHovered ? 'scale(1.15)' : 'scale(1)'};
          box-shadow: ${isHovered ? '0 6px 20px rgba(255,56,92,.6)' : '0 2px 10px rgba(0,0,0,.25)'};
          transition: all 0.2s ease;
          z-index: ${isHovered ? '1000' : 'auto'};
        `;
        el.textContent = label;
        el.onmouseenter = () => {
          el.style.transform = 'scale(1.15)';
          el.style.boxShadow = '0 6px 20px rgba(255,56,92,.6)';
        };
        el.onmouseleave = () => {
          if (hoveredPropertyId !== p.id) {
            el.style.transform = 'scale(1)';
            el.style.boxShadow = '0 2px 10px rgba(0,0,0,.25)';
          }
        };
        el.addEventListener('click', () => navigate(`/property/${p.id}`));

        // Create popup (shown on hover, not click)
        const popup = new mapboxgl.Popup({ 
          offset: 12,
          closeButton: false,
          closeOnClick: false
        }).setHTML(`
          <div style="padding:8px;min-width:200px">
            ${p.images?.[0] ? `<img src="${p.images[0]}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px" />` : ''}
            <div style="font-weight:600;font-size:14px;margin-bottom:4px">${p.title ?? ''}</div>
            <div style="font-size:12px;color:#666;margin-bottom:4px">${p.location ?? ''}</div>
            <div style="font-weight:800;color:#FF385C">${label}</div>
          </div>
        `);

        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([lng, lat])
          .addTo(m);

        // Show popup on hover using marker's current position
        el.addEventListener('mouseenter', () => {
          const currentPos = marker.getLngLat();
          popup.setLngLat(currentPos).addTo(m);
        });
        el.addEventListener('mouseleave', () => {
          popup.remove();
        });

        htmlMarkers.current.push(marker);
    });

    // fit bounds to all markers
    const bounds = new mapboxgl.LngLatBounds();
    properties.forEach(p => {
      const lat = p.latitude ?? cityLL(p.city).lat;
      const lng = p.longitude ?? cityLL(p.city).lng;
      if (lat != null && lng != null) bounds.extend([lng, lat]);
    });
    if (!bounds.isEmpty()) m.fitBounds(bounds, { padding: 50, maxZoom: 11 });

    return () => {
      htmlMarkers.current.forEach(mm => mm.remove());
      htmlMarkers.current = [];
    };
  }, [properties, isMapReady, formatPrice, navigate]);

  // Update marker styles when hoveredPropertyId changes
  useEffect(() => {
    if (!isMapReady) return;

    htmlMarkers.current.forEach(marker => {
      const el = marker.getElement();
      const propertyId = el.getAttribute('data-property-id');
      const isHovered = propertyId === hoveredPropertyId;
      
      if (isHovered) {
        el.style.transform = 'scale(1.15)';
        el.style.boxShadow = '0 6px 20px rgba(255,56,92,.6)';
        el.style.zIndex = '1000';
      } else {
        el.style.transform = 'scale(1)';
        el.style.boxShadow = '0 2px 10px rgba(0,0,0,.25)';
        el.style.zIndex = 'auto';
      }
    });
  }, [hoveredPropertyId, isMapReady]);

  // Show error fallback if map failed to initialize
  if (mapError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-muted/30">
        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Map Unavailable</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-4">{mapError}</p>
        <div className="text-xs text-muted-foreground max-w-md space-y-1">
          <p className="font-medium mb-2">Troubleshooting steps:</p>
          <p>• Enable hardware acceleration in your browser settings</p>
          <p>• Try using Chrome, Firefox, or Safari</p>
          <p>• Update your browser to the latest version</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapEl} className="w-full h-full" />
      {properties.length > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-background/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-border">
          <p className="text-sm font-semibold text-foreground">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'}
          </p>
        </div>
      )}
    </div>
  );
};
