import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ManageEventsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const userRole = (session?.user as any)?.role;

  const events = await prisma.event.findMany({
    where: userRole === 'ADMIN' ? {} : { creatorId: userId },
    orderBy: { date: 'desc' }
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Manage Events</h1>
          <p style={{ color: 'var(--text-secondary)' }}>View and edit all karyakrams you have created.</p>
        </div>
        <Link href="/events/new" className="btn btn-primary">
          + New Event
        </Link>
      </header>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Event Name</th>
              <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</th>
              <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Venue</th>
              <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No events found.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>{event.name}</td>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>{event.date.toLocaleDateString()}</td>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>{event.venueName}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {event.status}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                    <Link href={`/events/manage/${event.id}`} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
