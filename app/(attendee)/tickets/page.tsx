'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';

export default function TicketsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    const fetchTickets = async () => {
      try {
        const res = await fetch('/api/user/tickets');
        if (res.ok) {
          const data = await res.json();
          // Generate QR codes for each ticket
          const ticketsWithQr = await Promise.all(data.registrations.map(async (reg: any) => {
            const qrDataUrl = await QRCode.toDataURL(reg.qrCodeUrl || 'INVALID');
            return { ...reg, qrDataUrl };
          }));
          setRegistrations(ticketsWithQr);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') fetchTickets();
  }, [status, router]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="royal-loader">Fetching Tickets...</div>
    </div>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '5rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>My Royal Passes</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Your secured reservations for upcoming karyakrams.</p>
      </header>

      {registrations.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.3 }}>🎟️</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No Tickets Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You haven&apos;t reserved a spot in any karyakram yet.</p>
          <Link href="/events" className="btn btn-primary">Discover Events</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {registrations.map((reg) => (
            <div key={reg.id} className="glass-card" style={{ 
              display: 'flex', 
              padding: '0', 
              overflow: 'hidden', 
              borderLeft: '8px solid var(--btn-primary-bg)', 
              minHeight: '220px',
              flexDirection: 'row',
              flexWrap: 'wrap'
            }}>
              
              {/* Left Side: Ticket Details */}
              <div style={{ flex: '1 1 400px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '2px dashed var(--glass-border)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--btn-primary-bg)', fontWeight: 800 }}>Digital Entry Pass</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.7 }}>#{reg.id.split('-')[0].toUpperCase()}</span>
                  </div>
                  <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{reg.event.name}</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>🏛️ {reg.event.venueName}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                   <div>
                     <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Date</p>
                     <p style={{ fontWeight: 600 }}>{new Date(reg.event.date).toLocaleDateString()}</p>
                   </div>
                   <div>
                     <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Time</p>
                     <p style={{ fontWeight: 600 }}>{new Date(reg.event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                   </div>
                </div>
              </div>

              {/* Right Side: QR Code Area */}
              <div style={{ width: '220px', background: 'rgba(255,255,255,0.03)', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ 
                  background: 'white', 
                  padding: '10px', 
                  borderRadius: '12px', 
                  marginBottom: '1rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={reg.qrDataUrl} alt="Ticket QR Code" style={{ width: '130px', height: '130px' }} />
                </div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '1px' }}>{reg.qrCodeUrl}</p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
