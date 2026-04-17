'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function RoyalDispatchListener() {
  const { id } = useParams(); 
  const { data: session, status } = useSession();
  const [latestDispatch, setLatestDispatch] = useState<any>(null);
  const [upcomingDuty, setUpcomingDuty] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [dismissedId, setDismissedId] = useState<string | null>(null);
  const [notifiedDutyId, setNotifiedDutyId] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const pollSystem = async () => {
      try {
        // 1. Poll for Broadcasts
        const alertRes = await fetch(`/api/user/alerts`);
        if (alertRes.ok) {
          const alertData = await alertRes.json();
          const latest = alertData.dispatches[0];
          if (latest && latest.id !== dismissedId) {
            setLatestDispatch(latest);
            setVisible(true);
          }
        }

        // 2. Poll for Upcoming Duties (Staff Only)
        if ((session?.user as any)?.role === 'STAFF') {
           const dutyRes = await fetch(`/api/staff/duties`);
           if (dutyRes.ok) {
             const dutyData = await dutyRes.json();
             const now = new Date();
             const fiveMinsFromNow = new Date(now.getTime() + 5 * 60 * 1000);
             const tenMinsFromNow = new Date(now.getTime() + 10 * 60 * 1000); // Buffer
             
             // Find duty starting in the next 5-10 mins that hasn't been notified
             const upcoming = dutyData.duties.find((d: any) => {
                const startTime = new Date(d.startTime);
                return startTime > now && startTime <= fiveMinsFromNow && d.id !== notifiedDutyId;
             });

             if (upcoming) {
                setUpcomingDuty(upcoming);
                setNotifiedDutyId(upcoming.id);
                setVisible(true);
             }
           }
        }
      } catch (err) {
        console.error('System poll failed', err);
      }
    };

    pollSystem();
    const interval = setInterval(pollSystem, 15000);
    return () => clearInterval(interval);
  }, [id, dismissedId, notifiedDutyId, session, status]);

  if (!visible || (!latestDispatch && !upcomingDuty)) return null;

  // Decide which alert to show (Duty takes priority)
  const isDutyAlert = !!upcomingDuty;
  const target = upcomingDuty || latestDispatch;

  const getAlertStyles = (type: string) => {
    if (isDutyAlert) return { bg: '#030508', border: '#FFD700', icon: '💂', text: 'ROYAL DUTY CALLING' };
    switch (type) {
      case 'EMERGENCY': return { bg: '#800020', border: '#D4AF37', icon: '🚨', text: 'EMERGENCY DISPATCH' };
      case 'URGENT': return { bg: '#B8860B', border: '#FAF9F6', icon: '⚠️', text: 'URGENT DISPATCH' };
      default: return { bg: 'rgba(8, 11, 18, 0.9)', border: 'var(--glass-border)', icon: '⚜️', text: 'MODERATE DISPATCH' };
    }
  };

  const styles = getAlertStyles(target.type);

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 1000,
      width: '380px',
      padding: '1.75rem',
      borderRadius: '20px',
      background: styles.bg,
      border: `2px solid ${styles.border}`,
      boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 20px rgba(212, 175, 55, 0.1)',
      color: 'white',
      backdropFilter: 'blur(30px)',
      animation: 'slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{styles.icon}</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {styles.text}
          </span>
        </div>
        <button 
          onClick={() => { setVisible(false); setDismissedId(latestDispatch.id); }}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '1.2rem' }}
        >
          ×
        </button>
      </div>

      <p style={{ fontSize: '1rem', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
        {isDutyAlert 
          ? `Commencing in 5 minutes: ${target.taskName} at ${target.zone.name}. Event: ${target.assignment.event.name}`
          : target.message}
      </p>

      <div style={{ marginTop: '1rem', fontSize: '0.7rem', opacity: 0.6, textAlign: 'right' }}>
        {isDutyAlert ? 'Operational Readiness Required' : `Issued ${new Date(target.createdAt).toLocaleTimeString()}`}
      </div>
    </div>
  );
}
