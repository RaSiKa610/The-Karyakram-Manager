'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MapPicker from '@/components/admin/MapPicker';

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
    latitude: null as number | null,
    longitude: null as number | null,
    zones: [
      { name: 'The Great Hall', capacity: 600, type: 'STANDING' },
      { name: 'Royal Gallery', capacity: 200, type: 'SEATING' },
      { name: 'Imperial Lounge', capacity: 200, type: 'VIP' }
    ]
  });

  const handleZoneChange = (index: number, field: string, value: any) => {
    const newZones = [...form.zones];
    (newZones[index] as any)[field] = value;
    setForm({ ...form, zones: newZones });
  };

  const addZone = () => {
    setForm({ ...form, zones: [...form.zones, { name: '', capacity: 100, type: 'STANDING' }] });
  };

  const removeZone = (index: number) => {
    setForm({ ...form, zones: form.zones.filter((_, i) => i !== index) });
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setForm(prev => ({ ...prev, venueAddress: address, latitude: lat, longitude: lng }));
  };

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
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500, display: 'block', marginBottom: '0.75rem' }}>Select Royal Venue Location</label>
            <MapPicker onLocationSelect={handleLocationSelect} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Venue Name</label>
              <input type="text" name="venueName" value={form.venueName} onChange={handleChange} required placeholder="e.g. Grand Arena" style={inputStyle} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Venue Address (Confirm or Override)</label>
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

        {/* Zones Section */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Royal Venue Zones</h3>
            <button type="button" onClick={addZone} className="btn btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>+ Add Zone</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {form.zones.map((zone, index) => (
              <div key={index} className="glass-card" style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Zone Name</label>
                  <input type="text" value={zone.name} onChange={(e) => handleZoneChange(index, 'name', e.target.value)} required placeholder="e.g. Gallery" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Capacity</label>
                  <input type="number" value={zone.capacity} onChange={(e) => handleZoneChange(index, 'capacity', Number(e.target.value))} required style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Type</label>
                  <select value={zone.type} onChange={(e) => handleZoneChange(index, 'type', e.target.value)} style={inputStyle}>
                    <option value="STANDING">Standing</option>
                    <option value="SEATING">Seating</option>
                    <option value="VIP">Royal VIP</option>
                  </select>
                </div>
                <button type="button" onClick={() => removeZone(index)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.2rem', marginTop: '1rem' }}>×</button>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>* Ensure total zone capacity matches event capacity.</p>
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
