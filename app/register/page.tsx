'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import styles from '../login/auth.module.css';

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', role: 'ATTENDEE'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Registration failed');
      }

      // Auto login after registration
      const loginRes = await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (!loginRes?.error) {
        router.push('/events');
        router.refresh();
      } else {
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`glass-card ${styles.card}`} style={{ maxWidth: 560 }}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}></div>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join The Karyakram Manager</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.field}>
              <label>First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Rahul" className={styles.input} required />
            </div>
            <div className={styles.field}>
              <label>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Sharma" className={styles.input} required />
            </div>
          </div>

          <div className={styles.field}>
            <label>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={styles.input} required />
          </div>

          <div className={styles.field}>
            <label>Phone Number</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className={styles.input} />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" className={styles.input} required />
          </div>

          <div className={styles.field}>
            <label>I am registering as</label>
            <select name="role" value={form.role} onChange={handleChange} className={styles.input} style={{ cursor: 'pointer' }}>
              <option value="ATTENDEE">Attendee</option>
              <option value="STAFF">Staff Member</option>
              <option value="HOST">Event Host</option>
            </select>
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className={styles.registerLink}>
          Already have an account?{' '}
          <Link href="/login" className={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
