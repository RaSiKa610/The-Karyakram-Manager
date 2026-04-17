'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    name: '',
    category: 'SPORTS',
    venueName: '',
    venueAddress: '',
    date: '',
    startTime: '',
    endTime: '',
    totalCapacity: 1000,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          totalCapacity: Number(form.totalCapacity)
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create event');
      }

      const data = await res.json();
      // Redirect to the events management dashboard or the event details
      router.push(`/dashboard`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Create New Event</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Define the essential details for your upcoming karyakram.</p>
      </header>

      {error && (
        <div style={{ background: 'rgba(192, 85, 106, 0.15)', border: '1px solid rgba(192, 85, 106, 0.4)', color: '#f8a0b3', padding: '1rem', borderRadius: '12px', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2.5rem' }}>
        
        {/* Basic Info */}
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Basic Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Event Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Summer Music Festival 2026" style={inputStyle} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                <option value="SPORTS">Sports Match</option>
                <option value="CONCERTS">Concert / Music</option>
                <option value="CONFERENCES">Conference / Expo</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Capacity</label>
              <input type="number" name="totalCapacity" value={form.totalCapacity} onChange={handleChange} required min="1" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Location & Time */}
        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Location & Schedule</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Venue Name</label>
              <input type="text" name="venueName" value={form.venueName} onChange={handleChange} required placeholder="e.g. Grand Arena" style={inputStyle} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Venue Address</label>
              <input type="text" name="venueAddress" value={form.venueAddress} onChange={handleChange} required placeholder="City center, NY" style={inputStyle} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Event Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Start Time</label>
                <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required style={inputStyle} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>End Time</label>
                <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required style={inputStyle} />
              </div>
            </div>

          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button type="button" onClick={() => router.back()} className="btn btn-outline" style={{ padding: '0.8rem 2rem' }}>
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>

      </form>
    </div>
  );
}

const inputStyle = {
  background: 'var(--bg-top)',
  border: '1px solid var(--glass-border)',
  borderRadius: '12px',
  padding: '0.85rem 1.1rem',
  color: 'var(--text-primary)',
  fontFamily: 'inherit',
  fontSize: '1rem',
  outline: 'none',
  width: '100%',
};
