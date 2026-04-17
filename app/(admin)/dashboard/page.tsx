import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const userRole = (session?.user as any)?.role;

  // Fetch some stats from the database
  const myEventsCount = await prisma.event.count({
    where: (userRole === 'ADMIN' || userRole === 'STAFF') ? {} : { creatorId: userId }
  });

  const totalAttendees = await prisma.registration.count({
    where: (userRole === 'ADMIN' || userRole === 'STAFF') ? {} : { event: { creatorId: userId } }
  });

  const recentEvents = await prisma.event.findMany({
    where: (userRole === 'ADMIN' || userRole === 'STAFF') ? {} : { creatorId: userId },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome back, {session?.user?.name?.split(' ')[0]}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Here&apos;s an overview of your karyakrams and metrics.</p>
        </div>
        {userRole !== 'STAFF' && (
          <Link href="/events/new" className="btn btn-primary">
            + New Event
          </Link>
        )}
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '2rem' }}>📅</span>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>Total Events</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 800 }}>{myEventsCount}</p>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '2rem' }}>👥</span>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>Total Attendees</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 800 }}>{totalAttendees}</p>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '2rem' }}>🎟️</span>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>Upcoming Events</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 800 }}>
            {recentEvents.filter(e => e.status === 'UPCOMING').length}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Recent Events</h2>
        {recentEvents.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem', opacity: 0.5 }}>📂</span>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No events yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{userRole === 'STAFF' ? 'No royal duties assigned yet.' : "You haven't created any karyakrams."}</p>
            {userRole !== 'STAFF' && (
              <Link href="/events/new" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>Create your first event</Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentEvents.map(event => (
              <div key={event.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{event.name}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{event.date.toLocaleDateString()} • {event.venueName}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
                    {event.status}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/events/${event.id}/map`} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderColor: 'var(--clover-green)', color: 'var(--clover-green)' }}>
                      Live Map
                    </Link>
                    <Link href={`/events/manage/${event.id}`} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
