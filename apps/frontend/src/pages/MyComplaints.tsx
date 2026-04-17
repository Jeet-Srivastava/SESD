import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, type ComplaintRecord } from '../lib/api';

export const MyComplaints = () => {
  const { token } = useAuth();
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .getMyComplaints(token)
      .then(setComplaints)
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="content-card animate-fade-in" style={{ maxWidth: '100%', margin: 0, padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>My Complaints History</h2>
        <button onClick={() => navigate('/dashboard/new')} className="btn-primary">
          + New Complaint
        </button>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>
          Loading data...
        </div>
      ) : (
        <div className="complaint-list">
          {complaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)' }}>
              <p style={{ margin: 0 }}>You have not submitted any complaints yet.</p>
            </div>
          ) : (
            complaints.map((c) => (
              <div key={c._id} className="complaint-item" onClick={() => navigate(`/dashboard/complaint/${c._id}`)}>
                <div className="complaint-header">
                  <div>
                    <h3 className="complaint-title">{c.title}</h3>
                    <div className="complaint-meta">
                      <span>Category: <strong>{c.category}</strong></span>
                      <span>&bull;</span>
                      <span>Priority: <strong>{c.priority}</strong></span>
                      <span>&bull;</span>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div>
                    <span className={`badge badge-${c.status.toLowerCase()}`}>
                      {c.status}
                    </span>
                  </div>
                </div>
                
                {c.aiHints && (
                  <div style={{ marginTop: 8, padding: 12, background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--color-brand)' }}>🤖 AI Action:</strong> {c.aiHints}
                  </div>
                )}
                {c.resolutionNote && (
                  <div style={{ marginTop: 8, padding: 12, background: 'var(--color-success-bg)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: 'var(--color-success)' }}>
                    <strong>✅ Resolution:</strong> {c.resolutionNote}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
