'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
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
    } else {
      document.documentElement.style.setProperty('--bg-top', '#1A1035');
      document.documentElement.style.setProperty('--bg-mid', '#4A2060');
      document.documentElement.style.setProperty('--bg-bottom', '#C0556A');
      document.documentElement.style.setProperty('--glass-bg', 'rgba(26, 16, 53, 0.4)');
      document.documentElement.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.15)');
      document.documentElement.style.setProperty('--glass-shadow', 'rgba(0, 0, 0, 0.4)');
      document.documentElement.style.setProperty('--text-primary', '#FFFFFF');
      document.documentElement.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.8)');
      document.documentElement.style.setProperty('--text-muted', 'rgba(255, 255, 255, 0.5)');
      document.documentElement.style.setProperty('--btn-primary-bg', '#F28B5A');
      document.documentElement.style.setProperty('--btn-primary-text', '#1A1035');
      document.documentElement.style.setProperty('--clover-light', '#7BEA74');
    }
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Brand */}
        <Link href="/" className={styles.brand}>
          <span className={styles.brandIcon}>🍀</span>
          <span className={styles.brandText}>Karyakram</span>
        </Link>

        {/* Nav Links */}
        <div className={styles.links}>
          <Link href="/events" className={styles.link}>Events</Link>
          <Link href="/login" className={styles.link}>Login</Link>
          <Link href="/register" className={`btn btn-primary ${styles.cta}`}>
            Get Tickets
          </Link>
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
