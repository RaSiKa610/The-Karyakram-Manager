'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { data: session } = useSession();
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Check system preference
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mq.matches);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.style.setProperty('--bg-top', '#FAF9F6');
      document.documentElement.style.setProperty('--bg-mid', '#F0E6D2');
      document.documentElement.style.setProperty('--bg-bottom', '#D4AF37');
      document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.65)');
      document.documentElement.style.setProperty('--glass-border', 'rgba(212, 175, 55, 0.4)');
      document.documentElement.style.setProperty('--glass-shadow', 'rgba(0, 0, 0, 0.1)');
      document.documentElement.style.setProperty('--text-primary', '#0A1128');
      document.documentElement.style.setProperty('--text-secondary', 'rgba(10, 17, 40, 0.7)');
      document.documentElement.style.setProperty('--text-muted', 'rgba(10, 17, 40, 0.5)');
      document.documentElement.style.setProperty('--btn-primary-bg', '#800020');
      document.documentElement.style.setProperty('--btn-primary-text', '#FFFFFF');
      document.documentElement.style.setProperty('--clover-light', '#D4AF37');
      document.documentElement.style.setProperty('--falling-item-fill', '#D4AF37');
    } else {
      document.documentElement.style.setProperty('--bg-top', '#1A052D');
      document.documentElement.style.setProperty('--bg-mid', '#2E0249');
      document.documentElement.style.setProperty('--bg-bottom', '#570A57');
      document.documentElement.style.setProperty('--glass-bg', 'rgba(26, 5, 45, 0.85)');
      document.documentElement.style.setProperty('--glass-border', 'rgba(225, 173, 1, 0.35)');
      document.documentElement.style.setProperty('--glass-shadow', 'rgba(0, 0, 0, 0.8)');
      document.documentElement.style.setProperty('--text-primary', '#F8F1E1');
      document.documentElement.style.setProperty('--text-secondary', 'rgba(248, 241, 225, 0.85)');
      document.documentElement.style.setProperty('--text-muted', 'rgba(248, 241, 225, 0.55)');
      document.documentElement.style.setProperty('--btn-primary-bg', '#E1AD01');
      document.documentElement.style.setProperty('--btn-primary-text', '#1A052D');
      document.documentElement.style.setProperty('--clover-light', '#FFDB58');
      document.documentElement.style.setProperty('--falling-item-fill', '#E1AD01');
    }
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Brand */}
        <Link href="/" className={styles.brand}>
          <span className={styles.brandIcon}>⚜️</span>
          <span className={styles.brandText}>The Karyakram Manager</span>
        </Link>

        {/* Nav Links */}
        <div className={styles.links}>
          <Link href="/events" className={styles.link}>Events</Link>

          {session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <Link href="/tickets" className={styles.link}>My Tickets</Link>
              <Link href="/alerts" className={styles.link}>Alerts</Link>
              {(session.user as any)?.role === 'STAFF' && (
                <Link href="/staff/duties" className={styles.link}>My Duties</Link>
              )}
              {(session.user as any)?.role === 'ADMIN' || (session.user as any)?.role === 'HOST' || (session.user as any)?.role === 'STAFF' ? (
                <Link href="/dashboard" className={styles.link} style={{ color: 'var(--btn-primary-bg)', fontWeight: 600 }}>
                  Portal
                </Link>
              ) : null}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} title={session.user?.email || ''}>
                <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--btn-primary-bg)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {session.user?.name?.charAt(0) || 'U'}
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }} className="user-name-hide-mobile">{session.user?.name?.split(' ')[0]}</span>
              </div>
              <button onClick={() => signOut()} className={`btn btn-outline ${styles.cta}`} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className={styles.link}>Login</Link>
              <Link href="/register" className={`btn btn-primary ${styles.cta}`}>
                Get Tickets
              </Link>
            </>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={styles.themeToggle}
          aria-label="Toggle theme"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? '⚪️' : '⏾'}
        </button>
      </div>
    </nav>
  );
}
