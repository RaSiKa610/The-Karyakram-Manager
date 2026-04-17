import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-16 pb-12 px-6">

      {/* Hero Section */}
      <div className="glass-card text-center max-w-4xl w-full mx-auto relative z-10" style={{ padding: '4rem 2rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'var(--glass-border)', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--btn-primary-bg)', marginBottom: '1.5rem', letterSpacing: '0.5px' }}>
            NEW · Phase 1 Early Access
          </div>
          <h1 style={{ fontSize: '3.8rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '-1px' }}>
            The Karyakram Manager
          </h1>
          <p style={{ fontSize: '1.35rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            The intelligent platform for managing large-scale sporting and entertainment events.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '3rem' }}>
          <Link href="/events" className="btn btn-primary" style={{ padding: '1.1rem 2.5rem', fontSize: '1.15rem' }}>
            Explore Events
          </Link>
          <Link href="/login" className="btn btn-outline" style={{ padding: '1.1rem 2.5rem', fontSize: '1.15rem', background: 'var(--glass-bg)' }}>
            Staff Login
          </Link>
        </div>
      </div>

      {/* Feature highlight */}
      <div style={{ marginTop: '5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '1000px', zIndex: 10 }}>
        <div className="glass-card" style={{ flex: '1 1 300px', padding: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}></div>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Seamless Ticketing</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Quick registration, dynamic QR codes, and integrated group logic tailored for attendees.
          </p>
        </div>
        <div className="glass-card" style={{ flex: '1 1 300px', padding: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}></div>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Venue Intelligence</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Real-time crowd flow analysis and smart queue management to prevent bottlenecks.
          </p>
        </div>
        <div className="glass-card" style={{ flex: '1 1 300px', padding: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}></div>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Rapid Emergency Response</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Instant alerting systems connecting attendees directly to on-scene medical and security staff.
          </p>
        </div>
      </div>

    </div>
  );
}
