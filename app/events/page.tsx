import Link from 'next/link';

export default function EventsPage() {
  const events = [
    {
      id: "1",
      name: "Global Tech & Sports Summit 2026",
      date: "2026-06-15",
      location: "Grand National Stadium, Metro City",
      status: "Upcoming",
      tags: ["Conference", "Sports"],
    },
    {
      id: "2",
      name: "Summer Music Festival",
      date: "2026-07-20",
      location: "City Park Arena",
      status: "Upcoming",
      tags: ["Concert", "Music"],
    }
  ];

  return (
    <div className="min-h-screen pt-20 px-6 max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Upcoming Events</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Discover and register for the latest karyakrams.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {events.map((event) => (
          <div key={event.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--dawn-gold)' }}>{event.name}</h2>
               <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem' }}>{event.status}</span>
             </div>
             
             <div>
               <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  📅 {event.date}
               </p>
               <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  📍 {event.location}
               </p>
             </div>

             <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '1rem' }}>
                {event.tags.map(tag => (
                  <span key={tag} style={{ backgroundColor: 'rgba(110,194,106,0.2)', color: 'var(--clover-light)', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 500 }}>
                    {tag}
                  </span>
                ))}
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
