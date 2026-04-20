'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function StaffEventConsole() {
  const { id: eventId } = useParams();
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [localAlerts, setLocalAlerts] = useState<any[]>([]);

  const fetchConsoleData = async () => {
    try {
      const res = await fetch(`/api/staff/events/${eventId}/console`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsoleData();
    const interval = setInterval(fetchConsoleData, 20000); // 20s poll for team updates/alerts
    return () => clearInterval(interval);
  }, [eventId]);

  if (loading) return <div className="royal-loader">Synchronizing With Command...</div>;
  if (!data) return <div style={{ textAlign: 'center', padding: '5rem' }}>Access Denied or Event Not Found</div>;

  const { event, roster, myDuties, broadcasts } = data;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '5rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Link href="/staff/duties" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>← Back to All Duties</Link>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{event.name}: Operational Console</h1>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
           <span style={{ fontSize: '0.9rem', background: 'rgba(212, 175, 55, 0.15)', color: '#D4AF37', padding: '0.25rem 0.75rem', borderRadius: '20px', fontWeight: 700 }}>
             ACTIVE MISSION
           </span>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{event.venueName} • {new Date(event.date).toLocaleDateString()}</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* My Timetable Section */}
          <section className="glass-card" style={{ padding: '2rem', borderLeft: '6px solid var(--clover-green)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              💂 My Personal Timetable
            </h2>
            {myDuties.length === 0 ? (
               <p style={{ color: 'var(--text-muted)' }}>Waiting for mission specifics from the Host.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {myDuties.map((duty: any) => (
                  <div key={duty.id} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                       <h4 style={{ fontSize: '1.25rem' }}>{duty.taskName}</h4>
                       <span style={{ fontWeight: 800, color: 'var(--clover-light)' }}>
                         {new Date(duty.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                       <span>🏛️ Zone: <strong>{duty.zone.name}</strong></span>
                       <span>🕒 Duration: {Math.round((new Date(duty.endTime).getTime() - new Date(duty.startTime).getTime()) / 60000)} mins</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Live Alerts Section */}
          <section className="glass-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>📢 Mission Dispatches</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {broadcasts.length === 0 ? (
                 <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No dispatches issued for this mission yet.</p>
              ) : (
                broadcasts.map((b: any) => (
                  <div key={b.id} style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: '1rem' }}>
                    <span>{b.type === 'EMERGENCY' ? '🚨' : 'ℹ️'}</span>
                    <div>
                      <p style={{ fontWeight: 500 }}>{b.message}</p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(b.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>

        {/* Sidebar: Sovereign Roster */}
        <aside>
          <div className="glass-card" style={{ padding: '2rem', height: '100%' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>💂 Sovereign Roster</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Taskforce members committed to this mission.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {roster.map((assignment: any) => (
                <div key={assignment.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--clover-light)', color: 'black', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    {assignment.staff?.firstName?.[0] || '?'}{assignment.staff?.lastName?.[0] || 'S'}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{assignment.staff?.firstName || 'Unknown'} {assignment.staff?.lastName || 'Staff'}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--clover-light)', opacity: 0.8 }}>Taskforce Member</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
