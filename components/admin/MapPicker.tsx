'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  APIProvider,
  Map,
  Marker,
  useMapsLibrary,
  useMap
} from '@vis.gl/react-google-maps';

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
}

export default function MapPicker({ onLocationSelect, initialLat, initialLng }: MapPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const defaultCenter = { lat: initialLat || 19.0760, lng: initialLng || 72.8777 }; // Default Mumbai coordinates

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
      <APIProvider apiKey={apiKey} language="en">
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={13}
          mapId="ROYAL_MAP_ID" // Can be any string for now
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          style={{ width: '100%', height: '100%' }}
        >
          <MapContent onLocationSelect={onLocationSelect} />
        </Map>
      </APIProvider>
    </div>
  );
}

function MapContent({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number, address: string) => void }) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Initialize Autocomplete
  useEffect(() => {
    if (!placesLib || !inputRef.current) return;

    autoCompleteRef.current = new placesLib.Autocomplete(inputRef.current, {
      fields: ['geometry', 'formatted_address', 'name']
    });

    autoCompleteRef.current.addListener('place_changed', () => {
      const place = autoCompleteRef.current?.getPlace();
      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || place.name || '';
        
        const pos = { lat, lng };
        setMarkerPosition(pos);
        map?.panTo(pos);
        map?.setZoom(16);
        onLocationSelect(lat, lng, address);
      }
    });
  }, [placesLib, map, onLocationSelect]);

  // Click on map to place marker
  useEffect(() => {
    if (!map) return;
    const listener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPosition({ lat, lng });
        
        // Use geocoder to get address if clicked manually
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            onLocationSelect(lat, lng, results[0].formatted_address);
            if (inputRef.current) inputRef.current.value = results[0].formatted_address;
          } else {
            onLocationSelect(lat, lng, 'Custom Coordinates');
          }
        });
      }
    });
    return () => google.maps.event.removeListener(listener);
  }, [map, onLocationSelect]);

  return (
    <>
      <div style={{ position: 'absolute', top: '10px', left: '10px', width: 'calc(100% - 20px)', zIndex: 10 }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a Royal Venue..."
          className="map-search-input"
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid var(--clover-green)',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(10px)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            outline: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        />
      </div>
      {markerPosition && <Marker position={markerPosition} />}
    </>
  );
}
