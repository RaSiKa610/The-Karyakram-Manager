'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StaffDutiesPage() {
  const [duties, setDuties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDuties = async () => {
      try {
        const res = await fetch('/api/staff/duties');
        if (res.ok) {
          const data = await res.json();
          setDuties(data.duties || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDuties();
  }, []);

  if (loading) return <div className="royal-loader">⚜️ Loading Duty Roster...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>My Royal Assignments</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Your personalized timetable for all accepted karyakrams.</p>
      </header>

      {duties.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.3 }}>💂</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No Active Duties</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You haven&apos;t been assigned any duties for your accepted events yet.</p>
          <Link href="/alerts" className="btn btn-primary">Check Invitations</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Group by Event */}
          {Object.entries(
            duties.reduce((acc: any, duty: any) => {
              const eventId = duty.assignment.eventId;
              if (!acc[eventId]) acc[eventId] = { event: duty.assignment.event, duties: [] };
              acc[eventId].duties.push(duty);
              return acc;
            }, {})
          ).map(([eventId, group]: any) => (
            <div key={eventId} className="mission-group">
              <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', borderBottom: '2px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <div>
                   <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{group.event.name}</h2>
                   <p style={{ color: 'var(--clover-light)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Mission Command</p>
                </div>
                <Link href={`/staff/events/${eventId}`} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                  Open Royal Console →
                </Link>
              </header>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {group.duties.map((duty: any) => (
                  <div key={duty.id} className="glass-card" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', alignItems: 'center', gap: '2rem' }}>
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>{new Date(duty.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shift Start</p>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{duty.taskName}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>🏛️ Zone: {duty.zone.name}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{Math.round((new Date(duty.endTime).getTime() - new Date(duty.startTime).getTime()) / 60000)}m Duration</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
