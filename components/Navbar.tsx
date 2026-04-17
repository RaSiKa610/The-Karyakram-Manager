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
      document.documentElement.style.setProperty('--bg-top', '#FFFFFF');
      document.documentElement.style.setProperty('--bg-mid', '#FFECF2');
      document.documentElement.style.setProperty('--bg-bottom', '#FCA1B9');
      document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.6)');
      document.documentElement.style.setProperty('--glass-border', 'rgba(252, 161, 185, 0.4)');
      document.documentElement.style.setProperty('--glass-shadow', 'rgba(252, 161, 185, 0.2)');
      document.documentElement.style.setProperty('--text-primary', '#2D142C');
      document.documentElement.style.setProperty('--text-secondary', 'rgba(45, 20, 44, 0.7)');
      document.documentElement.style.setProperty('--text-muted', 'rgba(45, 20, 44, 0.5)');
      document.documentElement.style.setProperty('--btn-primary-bg', '#E12D6E');
      document.documentElement.style.setProperty('--btn-primary-text', '#FFFFFF');
      document.documentElement.style.setProperty('--clover-light', '#5EB557');
      document.documentElement.style.setProperty('--falling-item-fill', '#5EB557');
    } else {
      document.documentElement.style.setProperty('--bg-top', '#020014');
      document.documentElement.style.setProperty('--bg-mid', '#0A0F2C');
      document.documentElement.style.setProperty('--bg-bottom', '#1B2B5B');
      document.documentElement.style.setProperty('--glass-bg', 'rgba(26, 16, 53, 0.4)');
      document.documentElement.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.15)');
      document.documentElement.style.setProperty('--glass-shadow', 'rgba(0, 0, 0, 0.4)');
      document.documentElement.style.setProperty('--text-primary', '#FFFFFF');
      document.documentElement.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.8)');
      document.documentElement.style.setProperty('--text-muted', 'rgba(255, 255, 255, 0.5)');
      document.documentElement.style.setProperty('--btn-primary-bg', '#F28B5A');
      document.documentElement.style.setProperty('--btn-primary-text', '#1A1035');
      document.documentElement.style.setProperty('--clover-light', '#7BEA74');
      document.documentElement.style.setProperty('--falling-item-fill', '#FFB7C5');
    }
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Brand */}
        <Link href="/" className={styles.brand}>
          <span className={styles.brandIcon}>⚜️</span>
          <span className={styles.brandText}>Karyakram</span>
        </Link>

        {/* Nav Links */}
        <div className={styles.links}>
          <Link href="/events" className={styles.link}>Events</Link>
          
          {session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              {(session.user as any)?.role === 'ADMIN' || (session.user as any)?.role === 'HOST' ? (
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
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}
