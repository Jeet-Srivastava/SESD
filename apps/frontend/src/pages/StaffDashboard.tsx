import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, type ComplaintRecord, type ComplaintStatus, type UserSummary } from '../lib/api';

const allowedStatusTransitions: Record<ComplaintStatus, ComplaintStatus[]> = {
  CREATED: ['ASSIGNED', 'ESCALATED'],
  ASSIGNED: ['IN_PROGRESS', 'ESCALATED'],
  IN_PROGRESS: ['RESOLVED', 'ESCALATED'],
  RESOLVED: ['CLOSED', 'ESCALATED'],
  CLOSED: [],
  ESCALATED: ['ASSIGNED', 'IN_PROGRESS', 'RESOLVED'],
};

export const StaffDashboard = () => {
  const { token, userRole } = useAuth();
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [staffUsers, setStaffUsers] = useState<UserSummary[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const fetchComplaints = () => {
    if (!token) return Promise.resolve();
    return api.getAllComplaints(token).then(setComplaints);
  };

  useEffect(() => {
    void fetchComplaints();
  }, [token]);

  useEffect(() => {
    if (!token || userRole !== 'ADMIN') return;
    void api.getStaffUsers(token).then(setStaffUsers);
  }, [token, userRole]);

  const changeStatus = async (id: string, status: ComplaintStatus) => {
    if (!token) return;
    try {
      await api.updateComplaintStatus(token, id, status);
      await fetchComplaints();
      setMessage('Complaint status updated.');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update complaint status.');
    }
  };

  const resolveIssue = async (id: string) => {
    if (!token) return;
    const note = prompt('Enter the resolution details:');
    if (!note) return;
    try {
      await api.resolveComplaint(token, id, note);
      await fetchComplaints();
      setMessage('Complaint marked as resolved.');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to resolve complaint.');
    }
  };

  const assignComplaint = async (complaintId: string, assigneeId: string) => {
    if (!token || !assigneeId) return;
    try {
      await api.assignComplaint(token, complaintId, assigneeId);
      await fetchComplaints();
      setMessage('Complaint assigned successfully.');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to assign complaint.');
    }
  };

  return (
    <div className="content-card animate-fade-in" style={{ maxWidth: '100%', margin: 0, padding: 32 }}>
      <h2 style={{ margin: '0 0 24px 0' }}>Staff & Admin Queue</h2>
      {message ? <div className="success-msg" style={{ marginBottom: 20 }}>{message}</div> : null}
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Title</th>
              <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Category/Priority</th>
              <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Assigned Staff</th>
              <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>
                  No complaints found in the queue.
                </td>
              </tr>
            ) : complaints.map((c) => (
              <tr key={c._id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: 500, color: 'var(--color-text-main)', marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-lighter)' }}>ID: {c._id.slice(-6)}</div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ marginBottom: 6, fontSize: '0.875rem' }}>{c.category}</div>
                  <span className={`badge badge-${c.priority.toLowerCase()}`}>
                    {c.priority}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <select 
                    value={c.status} 
                    onChange={(e) => changeStatus(c._id, e.target.value as ComplaintStatus)}
                    style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', cursor: 'pointer' }}
                  >
                    <option value={c.status}>{c.status}</option>
                    {allowedStatusTransitions[c.status].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '16px' }}>
                  {userRole === 'ADMIN' ? (
                    <select
                      aria-label={`Assign complaint ${c.title}`}
                      value={c.assigneeId?._id ?? ''}
                      onChange={(e) => assignComplaint(c._id, e.target.value)}
                      style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)' }}
                    >
                      <option value="">Unassigned</option>
                      {staffUsers.map((staff) => (
                        <option key={staff._id} value={staff._id}>
                          {staff.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{c.assigneeId?.name ?? 'Unassigned'}</span>
                  )}
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/dashboard/complaint/${c._id}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem', textDecoration: 'none' }}>View</Link>
                    {c.status !== 'RESOLVED' && c.status !== 'CLOSED' && (
                      <button onClick={() => resolveIssue(c._id)} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                        Resolve
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
