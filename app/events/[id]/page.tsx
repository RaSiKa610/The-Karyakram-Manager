'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error('Event not found');
        const data = await res.json();
        setEvent(data.event);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  const handleBookTicket = async () => {
    if (status !== 'authenticated') {
      router.push(`/login?callbackUrl=/events/${id}`);
      return;
    }

    setBooking(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/events/${id}/book`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to book ticket');

      setMessage({ type: 'success', text: 'Karyakram booked successfully! View your ticket in your wallet.' });
      setTimeout(() => router.push('/tickets'), 2000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="royal-loader">⚜️ Loading...</div>
    </div>
  );

  if (!event) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1 style={{ color: 'var(--text-muted)' }}>Event Not Found</h1>
      <Link href="/events" className="btn btn-outline" style={{ marginTop: '2rem' }}>Back to events</Link>
    </div>
  );

  const isCreator = session?.user && (session.user as any).id === event.creatorId;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 5rem 2rem' }}>
      <Link href="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-secondary)', marginBottom: '2rem', fontWeight: 500 }}>
        ← Explore All Events
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '4rem', alignItems: 'start' }}>
        
        {/* Left Side: Details */}
        <div>
          <header style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ backgroundColor: 'rgba(184, 134, 11, 0.15)', color: 'var(--clover-green)', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid var(--glass-border)' }}>
                {event.category}
              </span>
              <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>
                {event.status}
              </span>
            </div>
            <h1 style={{ fontSize: '3.2rem', lineHeight: 1.1, marginBottom: '2rem', color: 'var(--text-primary)' }}>{event.name}</h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '800px' }}>{event.description || 'Join us for this majestic karyakram. Experience the elegance and grandeur of our premier venue.'}</p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
              <div style={{ fontSize: '1.5rem' }}>📅</div>
              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Date</h4>
                <p style={{ fontWeight: 600 }}>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
              <div style={{ fontSize: '1.5rem' }}>🕒</div>
              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Time</h4>
                <p style={{ fontWeight: 600 }}>
                  {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' })} - {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' })}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Venue Information</h3>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
               <div style={{ fontSize: '2.5rem' }}>🏛️</div>
               <div>
                 <h4 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.25rem' }}>{event.venueName}</h4>
                 <p style={{ color: 'var(--text-secondary)' }}>{event.venueAddress}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Side: Booking Card */}
        <div className="glass-card" style={{ position: 'sticky', top: '100px', padding: '2rem', border: '2px solid var(--clover-green)' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Reservation</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Standard Entry</span>
            <span style={{ fontWeight: 700, color: 'var(--clover-green)' }}>FREE</span>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Remaining Capacity</p>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
               <div style={{ width: `${Math.max(10, 100 - (event.currentAttendance / event.totalCapacity * 100))}%`, height: '100%', background: 'var(--clover-green)' }}></div>
            </div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, textAlign: 'right' }}>{event.totalCapacity - event.currentAttendance} spots left</p>
          </div>

          {message && (
            <div style={{ 
              marginBottom: '1.5rem', 
              padding: '1rem', 
              borderRadius: '12px', 
              fontSize: '0.9rem',
              background: message.type === 'success' ? 'rgba(94, 181, 87, 0.15)' : 'rgba(192, 85, 106, 0.15)',
              border: `1px solid ${message.type === 'success' ? 'rgba(94, 181, 87, 0.4)' : 'rgba(192, 85, 106, 0.4)'}`,
              color: message.type === 'success' ? 'var(--clover-light)' : '#f8a0b3'
            }}>
              {message.text}
            </div>
          )}

          <button 
            onClick={handleBookTicket}
            disabled={booking || event.currentAttendance >= event.totalCapacity}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem' }}
          >
            {booking ? 'Securing Spot...' : status === 'authenticated' ? 'Confirm Reservation' : 'Login to Book'}
          </button>

          {isCreator && (
            <Link href={`/dashboard`} className="btn btn-outline" style={{ width: '100%', marginTop: '1rem', fontSize: '0.9rem' }}>
              Manage This Karyakram
            </Link>
          )}

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
            * Instant digital ticket will be issued upon confirmation.
          </p>
        </div>

      </div>
    </div>
  );
}
