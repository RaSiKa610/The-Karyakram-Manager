import Link from 'next/link';
import { prisma } from '@/lib/prisma';

// Ensure the page is dynamically rendered since it fetches live DB data
export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: {
      status: 'UPCOMING'
    },
    orderBy: {
      date: 'asc'
    }
  });

  return (
    <div className="min-h-screen pt-20 px-6 max-w-7xl mx-auto" style={{ maxWidth: '1280px', margin: '0 auto', padding: '100px 2rem' }}>
      <div className="mb-24 text-center">
        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1.25rem' }}>Upcoming Karyakrams</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Discover and register for the latest majestic events.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '3rem' }}>
        {events.map((event: any) => (
          <div key={event.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--dawn-gold)' }}>{event.name}</h2>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem' }}>{event.status}</span>
            </div>

            <div>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                📅 {event.date.toLocaleDateString()}
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                📍 {event.venueName}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '1rem' }}>
              <span style={{ backgroundColor: 'rgba(110,194,106,0.2)', color: 'var(--clover-light)', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 500 }}>
                {event.category}
              </span>
            </div>

            <Link href={`/events/${event.id}`} style={{ textDecoration: 'none', marginTop: '1rem' }}>
              <button className="btn btn-primary" style={{ width: '100%' }}>View Details</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
