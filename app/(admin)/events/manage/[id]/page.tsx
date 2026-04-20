'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function EventManagementHub() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await fetch(`/api/admin/events/${id}/live`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data.event);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}><div className="royal-loader">Opening Hub...</div></div>;
  if (!event) return <div style={{ textAlign: 'center', padding: '5rem' }}>Event not found</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Link href="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>← Back to Dashboard</Link>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Management Centre: {event.name}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Central command for royal operations and attendee management.</p>
      </header>

      {/* Royal Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--clover-green)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Hall Occupancy</p>
          <p style={{ fontSize: '2rem', fontWeight: 800 }}>{event.currentAttendance} / {event.totalCapacity}</p>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '0.5rem', borderRadius: '2px', overflow: 'hidden' }}>
             <div style={{ width: `${(event.currentAttendance / event.totalCapacity) * 100}%`, height: '100%', background: 'var(--clover-green)' }}></div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--clover-light)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Remaining Capacity</p>
          <p style={{ fontSize: '2rem', fontWeight: 800 }}>{event.totalCapacity - event.currentAttendance}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Live Map Card */}
        <Link href={`/events/${id}/map`} style={{ textDecoration: 'none' }}>
          <div className="glass-card" style={{ 
            padding: '2rem', 
            height: '100%', 
            transition: 'all 0.3s ease', 
            cursor: 'pointer',
            border: '2px solid var(--clover-green)',
            boxShadow: '0 0 20px rgba(94, 181, 87, 0.2)'
          }} 
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(94, 181, 87, 0.4)';
          }} 
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(94, 181, 87, 0.2)';
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem' }}>🛰️</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(94, 181, 87, 0.2)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', color: 'var(--clover-light)', fontWeight: 800 }}>
                <span style={{ width: '8px', height: '8px', background: 'var(--clover-green)', borderRadius: '50%', boxShadow: '0 0 8px var(--clover-green)', animation: 'pulse 1.5s infinite' }}></span>
                LIVE
              </div>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Sovereign Heat Signature</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Monitor real-time zone occupancy and crowd density from the royal floor plan.</p>
            <div style={{ marginTop: '2rem', color: 'var(--clover-light)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Open Visualizer Dashboard →</div>
          </div>
        </Link>
        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.5; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>

        {/* Scan Portal Card */}
        <Link href={`/events/manage/${id}/check-in`} style={{ textDecoration: 'none' }}>
          <div className="glass-card" style={{ padding: '2rem', height: '100%', transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🛂</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Admission Portal</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Process attendee ingress, scan digital passes, and authorize royal entry.</p>
            <div style={{ marginTop: '2rem', color: 'var(--btn-primary-bg)', fontWeight: 700 }}>Open Scanner →</div>
          </div>
        </Link>

        {/* Staff Orchestration Card - Hidden from STAFF */}
        {(session?.user as any)?.role !== 'STAFF' && (
          <Link href={`/events/manage/${id}/staff`} style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ padding: '2rem', height: '100%', transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>💂</div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Staff Orchestration</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Invite royal staff, manage event acceptance, and build the sovereign duty timetable.</p>
              <div style={{ marginTop: '2rem', color: 'var(--btn-primary-bg)', fontWeight: 700 }}>Manage Staff →</div>
            </div>
          </Link>
        )}

        {/* Info Card */}
        <div className="glass-card" style={{ padding: '2rem', background: 'rgba(212, 175, 55, 0.05)', border: '1px dashed var(--clover-light)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📢</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Sovereign Dispatch</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Issue emergency broadcasts and urgent notifications to all checked-in attendees.</p>
          <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>* Broadcast directly from the Live Map dashboard.</p>
        </div>

      </div>
    </div>
  );
}
