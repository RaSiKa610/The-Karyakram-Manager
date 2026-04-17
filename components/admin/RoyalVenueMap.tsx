'use client';

import React from 'react';

interface ZoneData {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
}

interface RoyalVenueMapProps {
  zones: ZoneData[];
  onZoneClick?: (zoneId: string) => void;
}

export default function RoyalVenueMap({ zones, onZoneClick }: RoyalVenueMapProps) {
  
  const getZoneColor = (zoneName: string) => {
    const zone = zones.find(z => z.name.toLowerCase().includes(zoneName.toLowerCase()));
    if (!zone) return 'rgba(255, 255, 255, 0.05)';
    
    const percentage = (zone.currentOccupancy / zone.capacity) * 100;
    
    if (percentage > 90) return '#800020'; // Crimson (Overcrowded)
    if (percentage > 70) return '#B8860B'; // Bronze (Busy)
    if (percentage > 40) return '#D4AF37'; // Gold (Active)
    return 'rgba(212, 175, 55, 0.2)'; // Ivory/Soft Gold (Relaxed)
  };

  const getGlow = (zoneName: string) => {
    const zone = zones.find(z => z.name.toLowerCase().includes(zoneName.toLowerCase()));
    if (!zone) return 'none';
    const percentage = (zone.currentOccupancy / zone.capacity) * 100;
    if (percentage > 70) return 'drop-shadow(0 0 8px #D4AF37)';
    return 'none';
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', background: 'var(--glass-bg)', borderRadius: '24px', padding: '2rem', border: '1px solid var(--glass-border)' }}>
      <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
        
        {/* Background Decorative Frame */}
        <rect x="10" y="10" width="780" height="480" rx="20" fill="none" stroke="var(--glass-border)" strokeWidth="2" strokeDasharray="10 5" />

        {/* 1. Royal Gallery (Top) */}
        <g cursor="pointer" onClick={() => onZoneClick?.('gallery')}>
          <path 
            d="M50,50 L750,50 L730,120 L70,120 Z" 
            fill={getZoneColor('Gallery')} 
            stroke="var(--clover-light)" 
            strokeWidth="2"
            style={{ transition: 'fill 0.5s ease', filter: getGlow('Gallery') }}
          />
          <text x="400" y="90" textAnchor="middle" fill="var(--text-primary)" style={{ fontFamily: 'Cinzel', fontSize: '18px', fontWeight: 'bold', pointerEvents: 'none' }}>ROYAL GALLERY</text>
        </g>

        {/* 2. The Great Hall (Center) */}
        <g cursor="pointer" onClick={() => onZoneClick?.('hall')}>
          <rect 
            x="150" y="140" width="500" height="200" rx="10" 
            fill={getZoneColor('Hall')} 
            stroke="var(--clover-light)" 
            strokeWidth="2"
            style={{ transition: 'fill 0.5s ease', filter: getGlow('Hall') }}
          />
          <text x="400" y="245" textAnchor="middle" fill="var(--text-primary)" style={{ fontFamily: 'Cinzel', fontSize: '24px', fontWeight: 'bold', pointerEvents: 'none' }}>THE GREAT HALL</text>
        </g>

        {/* 3. Imperial Lounge (Side) */}
        <g cursor="pointer" onClick={() => onZoneClick?.('lounge')}>
          <path 
            d="M670,140 L750,140 L750,340 L670,340 Q640,240 670,140" 
            fill={getZoneColor('Lounge')} 
            stroke="var(--clover-light)" 
            strokeWidth="2"
            style={{ transition: 'fill 0.5s ease', filter: getGlow('Lounge') }}
          />
          <text x="710" y="245" textAnchor="middle" fill="var(--text-primary)" style={{ fontFamily: 'Cinzel', fontSize: '14px', fontWeight: 'bold', pointerEvents: 'none', transform: 'rotate(90deg)', transformOrigin: '710px 245px' }}>IMPERIAL LOUNGE</text>
        </g>

        {/* 4. Sovereign Garden (Bottom) */}
        <g cursor="pointer" onClick={() => onZoneClick?.('garden')}>
          <path 
            d="M50,360 L750,360 L780,450 L20,450 Z" 
            fill={getZoneColor('Garden')} 
            stroke="var(--clover-light)" 
            strokeWidth="2"
            style={{ transition: 'fill 0.5s ease', filter: getGlow('Garden') }}
          />
          <text x="400" y="420" textAnchor="middle" fill="var(--text-primary)" style={{ fontFamily: 'Cinzel', fontSize: '18px', fontWeight: 'bold', pointerEvents: 'none' }}>SOVEREIGN GARDEN</text>
        </g>

        {/* Labels & Decorations */}
        <path d="M400,20 L400,40 M400,460 L400,480" stroke="var(--clover-light)" strokeWidth="2" opacity="0.5" />
      </svg>
      
      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', background: 'rgba(212, 175, 55, 0.2)', border: '1px solid var(--clover-light)' }}></div>
          <span>Relaxed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', background: '#D4AF37' }}></div>
          <span>Active</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', background: '#800020' }}></div>
          <span>Saturated</span>
        </div>
      </div>
    </div>
  );
}
