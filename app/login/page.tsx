'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './auth.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError('Invalid email or password.');
      } else {
        router.push('/events');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`glass-card ${styles.card}`}>
        {/* Logo / Brand */}
        <div className={styles.brand}>
          <div className={styles.logoIcon}></div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>The Karyakram Manager</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@karyakram.com"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.forgotRow}>
            <Link href="/forgot-password" className={styles.link}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo credentials */}
        <div className={styles.demoBox}>
          <p className={styles.demoTitle}>🔑 Demo Credentials</p>
          <div className={styles.demoGrid}>
            <span className={styles.roleTag} style={{background:'rgba(249,199,79,0.2)', color:'var(--dawn-gold)'}}>Admin</span>
            <span className={styles.demoCred}>admin@karyakram.com / password123</span>
            <span className={styles.roleTag} style={{background:'rgba(61,139,55,0.2)', color:'var(--clover-light)'}}>Staff</span>
            <span className={styles.demoCred}>staff@karyakram.com / password123</span>
            <span className={styles.roleTag} style={{background:'rgba(192,85,106,0.2)', color:'var(--dawn-rose)'}}>Attendee</span>
            <span className={styles.demoCred}>attendee@karyakram.com / password123</span>
          </div>
        </div>

        <p className={styles.registerLink}>
          New here?{' '}
          <Link href="/register" className={styles.link}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
