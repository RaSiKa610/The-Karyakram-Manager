'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './StaffManagement.module.css';

export default function StaffManagementPage() {
  const { id: eventId } = useParams();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Duty Builder State
  const [showDutyModal, setShowDutyModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [newDuty, setNewDuty] = useState({
    zoneId: '',
    taskName: '',
    startTime: '',
    endTime: '',
    notes: ''
  });

  const fetchData = async () => {
    try {
      const [assignRes, liveRes] = await Promise.all([
        fetch(`/api/admin/staff/invite?eventId=${eventId}`),
        fetch(`/api/admin/events/${eventId}/live`)
      ]);
      
      const assignData = await assignRes.json();
      const liveData = await liveRes.json();
      
      setAssignments(assignData.assignments || []);
      setZones(liveData.event?.zones || []);
    } catch (err) {
      console.error('Failed to fetch staff data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/admin/staff/search?q=${query}`);
      const data = await res.json();
      setSearchResults(data.staffMembers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const inviteStaff = async (staffId: string) => {
    try {
      const res = await fetch('/api/admin/staff/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, eventId })
      });
      if (res.ok) {
        setSearchQuery('');
        setSearchResults([]);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to invite');
      }
    } catch (err) {
      alert('Invitation error');
    }
  };

  const openDutyBuilder = (assignment: any) => {
    setSelectedAssignment(assignment);
    setShowDutyModal(true);
  };

  const saveDuty = async () => {
    if (!newDuty.zoneId || !newDuty.taskName || !newDuty.startTime || !newDuty.endTime) {
      alert('Fill all required duty fields');
      return;
    }
    try {
      const res = await fetch('/api/admin/staff/duty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: selectedAssignment.id,
          ...newDuty
        })
      });
      if (res.ok) {
        setShowDutyModal(false);
        setNewDuty({ zoneId: '', taskName: '', startTime: '', endTime: '', notes: '' });
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      alert('Duty assignment error');
    }
  };

  if (loading) return <div className="royal-loader">⚜️ Mobilizing Staff...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href={`/events/manage/${eventId}`} className={styles.backLink}>← Back to Management</Link>
        <h1 className={styles.title}>Staff Orchestration</h1>
        <p className={styles.subtitle}>Invite, verify commitment, and deploy royal staff members.</p>
      </header>

      {/* Invitation Section */}
      <section className={styles.inviteSection}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Invite New Staff Member</h3>
          <div className={styles.searchWrapper}>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={styles.searchInput}
            />
            {isSearching && <span className={styles.loader}>⚜️</span>}
          </div>
          
          {searchResults.length > 0 && (
            <div className={styles.resultsList}>
              {searchResults.map((user: any) => (
                <div key={user.id} className={styles.resultItem}>
                  <div>
                    <strong>{user.firstName} {user.lastName}</strong>
                    <br />
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{user.email}</span>
                  </div>
                  <button onClick={() => inviteStaff(user.id)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    Send Invitation
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Assignment List */}
      <section className={styles.listSection}>
        <h2 style={{ marginBottom: '1.5rem' }}>Event Roster</h2>
        <div className={styles.rosterGrid}>
          {assignments.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1' }}>
              <p style={{ color: 'var(--text-muted)' }}>No staff members invited yet.</p>
            </div>
          ) : (
            assignments.map((assignment: any) => (
              <div key={assignment.id} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{assignment.staff.firstName} {assignment.staff.lastName}</h4>
                    <span className={styles.badge} data-status={assignment.status}>{assignment.status}</span>
                  </div>
                  {assignment.status === 'ACCEPTED' && (
                    <button onClick={() => openDutyBuilder(assignment)} className="btn btn-outline" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}>
                      + Duty
                    </button>
                  )}
                </div>
                
                <div className={styles.dutyList}>
                   {/* Here we would list existing duties if assignment included them */}
                   <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                      {assignment.status === 'PENDING' ? 'Waiting for staff to accept the royal invitation.' : 'Duty assignments enabled.'}
                   </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Duty Builder Modal */}
      {showDutyModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} glass-card`}>
            <h3>Assign Duty: {selectedAssignment.staff.firstName}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
               Standard duty timings must match the royal event schedule.
            </p>
            
            <div className={styles.formGroup}>
              <label>Location (Zone)</label>
              <select 
                value={newDuty.zoneId} 
                onChange={(e) => setNewDuty({...newDuty, zoneId: e.target.value})}
              >
                <option value="">Select a zone...</option>
                {zones.map((z: any) => <option key={z.id} value={z.id}>{z.name}</option>)}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Task Description</label>
              <input 
                type="text" 
                placeholder="e.g. VIP Gate Supervision"
                value={newDuty.taskName}
                onChange={(e) => setNewDuty({...newDuty, taskName: e.target.value})}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               <div className={styles.formGroup}>
                <label>Shift Start</label>
                <input 
                  type="datetime-local"
                  value={newDuty.startTime}
                  onChange={(e) => setNewDuty({...newDuty, startTime: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Shift End</label>
                <input 
                  type="datetime-local"
                  value={newDuty.endTime}
                  onChange={(e) => setNewDuty({...newDuty, endTime: e.target.value})}
                />
              </div>
            </div>

            <div className={styles.modalActions}>
               <button onClick={() => setShowDutyModal(false)} className="btn btn-outline">Cancel</button>
               <button onClick={saveDuty} className="btn btn-primary">Establish Duty</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
