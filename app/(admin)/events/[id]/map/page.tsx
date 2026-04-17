'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RoyalVenueMap from '@/components/admin/RoyalVenueMap';
import Link from 'next/link';

export default function EventMapDashboard() {
  const { id } = useParams();
  const [zones, setZones] = useState<any[]>([]);
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastType, setBroadcastType] = useState('INFO');
  const [broadcasting, setBroadcasting] = useState(false);

  const fetchLiveStats = async () => {
    try {
      const res = await fetch(`/api/admin/events/${id}/live`);
      if (res.ok) {
        const data = await res.json();
        setZones(data.zones);
        setEventData(data.event);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Error polling live stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg) return;
    setBroadcasting(true);
    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: id, type: broadcastType, message: broadcastMsg })
      });
      if (res.ok) {
        setBroadcastMsg('');
        alert('Dispatched successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBroadcasting(false);
    }
  };

  useEffect(() => {
    fetchLiveStats();
    // Royal Polling - Near Real-time sync every 5 seconds
    const interval = setInterval(fetchLiveStats, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}><div className="royal-loader">⚜️ Preparing Royal Insight...</div></div>;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Link href="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>← Back to Command Center</Link>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>Live Crowd Density: {eventData?.name}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Monitoring the royal ingress and zone saturation in real-time.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Last Sync: {lastUpdated.toLocaleTimeString()}
          </div>
          <Link href={`/events/manage/${id}/check-in`} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
            Open Scan Portal
          </Link>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem' }}>
        
        {/* Map Area */}
        <div>
          <RoyalVenueMap zones={zones} />
          
          <div className="glass-card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
             <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Sovereign Guard Logs</h3>
             <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p>• [SYS] Real-time data stream initialized.</p>
                <p>• [SEC] All ingress points monitored via encrypted handshake.</p>
                <p>• [Live] Total active guests: {zones.reduce((acc, z) => acc + z.currentOccupancy, 0)}</p>
             </div>
          </div>
        </div>

        {/* Sidebar: Zone Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Zone Saturation</h3>
          {zones.map((zone) => {
            const perc = Math.round((zone.currentOccupancy / zone.capacity) * 100);
            return (
              <div key={zone.id} className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>{zone.name}</span>
                  <span style={{ fontSize: '0.85rem', color: perc > 80 ? '#f8a0b3' : 'var(--text-secondary)' }}>{perc}% Full</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${perc}%`, 
                    height: '100%', 
                    background: perc > 90 ? '#800020' : perc > 60 ? '#D4AF37' : 'var(--clover-light)',
                    transition: 'width 1s ease'
                  }} />
                </div>
                <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>{zone.currentOccupancy} guests</span>
                  <span>{zone.capacity} capacity</span>
                </div>
              </div>
            );
          })}

          <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1rem', border: '1px solid var(--btn-primary-bg)' }}>
             <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--btn-primary-bg)' }}>Royal Operations</h3>
             <form onSubmit={handleBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <select 
                  value={broadcastType} 
                  onChange={(e) => setBroadcastType(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', background: 'var(--bg-top)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                >
                  <option value="INFO">Information</option>
                  <option value="URGENT">Urgent Alert</option>
                  <option value="EMERGENCY">Emergency Dispatch</option>
                </select>
                <textarea 
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  placeholder="Enter royal dispatch..."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-top)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', fontSize: '0.85rem', minHeight: '80px', resize: 'none' }}
                />
                <button type="submit" disabled={broadcasting || !broadcastMsg} className="btn btn-primary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem' }}>
                  {broadcasting ? 'Issuing...' : 'Issue Dispatch'}
                </button>
             </form>
          </div>
        </div>

      </div>
    </div>
  );
}
