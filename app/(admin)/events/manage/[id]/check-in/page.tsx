'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StaffCheckInPortal() {
  const { id } = useParams();
  const [zones, setZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [ticketCode, setTicketCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchZones = async () => {
      const res = await fetch(`/api/admin/events/${id}/live`);
      if (res.ok) {
        const data = await res.json();
        setZones(data.zones);
        if (data.zones.length > 0) setSelectedZone(data.zones[0].id);
      }
    };
    fetchZones();
  }, [id]);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketCode || !selectedZone) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/admin/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketCode: ticketCode.trim(),
          zoneId: selectedZone,
          eventId: id
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Check-in failed');

      setStatus({ type: 'success', text: `Access Granted: Welcome, ${data.attendee}!` });
      setTicketCode(''); // Clear for next scan
    } catch (err: any) {
      setStatus({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <Link href={`/events/${id}/map`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>← Back to Live Map</Link>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Staff Ingress Portal</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Secure entry point for royal karyakram admission.</p>
      </header>

      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <form onSubmit={handleCheckIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Checkpoint Location (Zone)</label>
            <select 
              value={selectedZone} 
              onChange={(e) => setSelectedZone(e.target.value)}
              className="royal-input"
              style={{ padding: '0.8rem', borderRadius: '12px', background: 'var(--bg-top)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
            >
              <option value="">Select a zone...</option>
              {zones.map(z => (
                <option key={z.id} value={z.id}>{z.name} (Cap: {z.capacity - z.currentOccupancy} left)</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Scan Ticket / Enter Code</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value)}
                placeholder="TKT-XXXX-XXXX"
                autoFocus
                style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', background: 'var(--bg-top)', border: '2px solid var(--clover-green)', color: 'var(--text-primary)', fontSize: '1.2rem', outline: 'none' }}
              />
              <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.5rem' }}>📸</span>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !ticketCode} 
            className="btn btn-primary"
            style={{ padding: '1.2rem', fontSize: '1.1rem' }}
          >
            {loading ? 'Verifying Royal Seal...' : 'Confirm Entry'}
          </button>
        </form>

        {status && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            textAlign: 'center',
            background: status.type === 'success' ? 'rgba(94, 181, 87, 0.15)' : 'rgba(192, 85, 106, 0.15)',
            border: `1px solid ${status.type === 'success' ? 'rgba(94, 181, 87, 0.4)' : 'rgba(192, 85, 106, 0.4)'}`
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{status.type === 'success' ? '🏛️' : '⚠️'}</div>
            <p style={{ fontWeight: 600, color: status.type === 'success' ? 'var(--clover-light)' : '#f8a0b3', margin: 0 }}>{status.text}</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Tip: You can manually type the "TKT-..." code from the attendee's digital wallet.
        </p>
      </div>
    </div>
  );
}
