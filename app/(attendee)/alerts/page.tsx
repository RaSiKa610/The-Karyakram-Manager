'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AlertsInbox() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dispatches, setDispatches] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    const fetchAlerts = async () => {
      try {
        const [alertRes, inviteRes] = await Promise.all([
          fetch('/api/user/alerts'),
          fetch('/api/staff/respond') // GET invitations
        ]);
        
        if (alertRes.ok) {
          const data = await alertRes.json();
          setDispatches(data.dispatches);
        }

        if (inviteRes.ok) {
          const data = await inviteRes.json();
          setInvitations(data.invitations || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') fetchAlerts();
  }, [status, router]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="royal-loader">⚜️ Opening Royal Inbox...</div>
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '5rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Royal Dispatch Inbox</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Official communications and emergency alerts for your registered karyakrams.</p>
      </header>

      {invitations.length > 0 && (
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--clover-light)' }}>💂 Taskforce Invitations</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {invitations.map((invite) => (
              <div key={invite.id} className="glass-card" style={{ padding: '2rem', border: '2px solid var(--clover-light)', background: 'rgba(212, 175, 55, 0.05)' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Invitation: {invite.event.name}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                   <strong>Venue:</strong> {invite.event.venueName} • <strong>Date:</strong> {new Date(invite.event.date).toLocaleDateString()}
                </p>
                
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--glass-border)' }}>
                   <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.75rem', color: 'var(--clover-light)' }}>Rules of Engagement</h4>
                   <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                      By accepting this royal invitation, you formally commit to the event timetable and duty requirements. 
                      <strong> Once accepted, assignments and event presence cannot be declined.</strong>
                   </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                   <button 
                     onClick={async () => {
                        const res = await fetch('/api/staff/respond', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ assignmentId: invite.id, status: 'ACCEPTED' })
                        });
                        if (res.ok) router.refresh();
                        // Re-fetch logic
                        window.location.reload();
                     }}
                     className="btn btn-primary" style={{ flex: 1, padding: '1rem' }}
                   >
                     Accept & Commit
                   </button>
                   <button 
                     onClick={async () => {
                        const res = await fetch('/api/staff/respond', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ assignmentId: invite.id, status: 'DECLINED' })
                        });
                        if (res.ok) window.location.reload();
                     }}
                     className="btn btn-outline" style={{ flex: 1, padding: '1rem' }}
                   >
                     Decline
                   </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {dispatches.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.3 }}>📬</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Your Inbox is Clear</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>No dispatches have been issued for your events yet.</p>
          <Link href="/events" className="btn btn-outline">Explore More Events</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {dispatches.map((dispatch) => {
            const isEmergency = dispatch.type === 'EMERGENCY';
            const isUrgent = dispatch.type === 'URGENT';
            
            return (
              <div key={dispatch.id} className="glass-card" style={{ 
                padding: '1.5rem', 
                borderLeft: `6px solid ${isEmergency ? '#800020' : isUrgent ? '#B8860B' : 'var(--clover-light)'}`,
                background: isEmergency ? 'rgba(128, 0, 32, 0.1)' : 'rgba(255, 255, 255, 0.03)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{isEmergency ? '🚨' : isUrgent ? '⚠️' : '⚜️'}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: isEmergency ? '#ff4d4d' : 'var(--text-primary)' }}>
                      {dispatch.type} Dispatch
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(dispatch.createdAt).toLocaleString()}
                  </span>
                </div>

                <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1rem', fontWeight: 500 }}>
                  {dispatch.message}
                </p>

                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                     Event: <strong>{dispatch.event.name}</strong>
                   </span>
                   <Link href={`/events/${dispatch.eventId}`} style={{ fontSize: '0.8rem', color: 'var(--btn-primary-bg)', textDecoration: 'none', fontWeight: 700 }}>
                     View Event Details →
                   </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
