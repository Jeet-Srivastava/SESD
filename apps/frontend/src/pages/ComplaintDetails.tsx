import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, type ComplaintRecord } from '../lib/api';

export const ComplaintDetails = () => {
  const { id } = useParams();
  const { token, userRole } = useAuth();
  const [complaint, setComplaint] = useState<ComplaintRecord | null>(null);
  const [newComment, setNewComment] = useState('');

  const fetchDetails = () => {
    if (!token || !id) return;
    void api.getComplaintById(token, id).then(setComplaint);
  };

  useEffect(() => {
    fetchDetails();
  }, [id, token]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id || !newComment.trim()) return;
    await api.addComment(token, id, { message: newComment });
    setNewComment('');
    fetchDetails();
  };

  if (!complaint) return (
    <div className="content-card" style={{ maxWidth: '100%', margin: 0, padding: 40, textAlign: 'center', color: 'var(--color-text-muted)' }}>
      Loading details...
    </div>
  );

  return (
    <div className="content-card animate-fade-in" style={{ maxWidth: 800, margin: '0 auto', width: '100%', padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{complaint.title}</h2>
        <span className={`badge badge-${complaint.status.toLowerCase()}`}>{complaint.status}</span>
      </div>
      
      <p style={{ background: 'var(--color-bg)', padding: '20px', borderRadius: 'var(--radius-md)', color: 'var(--color-text-main)', fontSize: '1rem', lineHeight: 1.6, border: '1px solid var(--color-border)' }}>
        {complaint.description}
      </p>
      
      <div className="dash-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', margin: '24px 0', gap: 16 }}>
        <div className="stat-card" style={{ padding: 16 }}>
          <span className="stat-title">Priority</span>
          <strong style={{ fontSize: '1.1rem', color: complaint.priority === 'CRITICAL' ? 'var(--color-danger)' : 'var(--color-text-main)' }}>{complaint.priority}</strong>
        </div>
        <div className="stat-card" style={{ padding: 16 }}>
          <span className="stat-title">Category</span>
          <strong style={{ fontSize: '1.1rem' }}>{complaint.category}</strong>
        </div>
        <div className="stat-card" style={{ padding: 16 }}>
          <span className="stat-title">Author</span>
          <strong style={{ fontSize: '1.1rem' }}>{complaint.authorId?.name}</strong>
        </div>
        {userRole !== 'STUDENT' ? (
          <div className="stat-card" style={{ padding: 16 }}>
            <span className="stat-title">Assigned Staff</span>
            <strong style={{ fontSize: '1.1rem' }}>{complaint.assigneeId?.name ?? 'Unassigned'}</strong>
          </div>
        ) : null}
      </div>

      {complaint.imageUrls.length > 0 ? (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: 16, color: 'var(--color-text-main)' }}>Attached Images</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {complaint.imageUrls.map((url) => (
              <a key={url} href={url} target="_blank" rel="noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
                <img
                  src={url}
                  alt="Complaint attachment"
                  style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', transition: 'transform var(--transition-fast)' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {complaint.resolutionNote && (
         <div className="success-msg" style={{ marginBottom: 32, padding: 20 }}>
           <h4 style={{ margin: '0 0 8px 0', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 8 }}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
             Resolution Details
           </h4>
           <p style={{ margin: 0, color: '#064e3b' }}>{complaint.resolutionNote}</p>
         </div>
      )}

      <div style={{ marginTop: 40, borderTop: '1px solid var(--color-border)', paddingTop: 32 }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: 20 }}>Discussion Thread</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {complaint.comments?.length === 0 ? <p style={{ color: 'var(--color-text-lighter)', fontStyle: 'italic' }}>No discussion started yet.</p> : (
            complaint.comments?.map((cmt, idx) => (
              <div key={idx} style={{ background: 'var(--color-bg)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong style={{ color: 'var(--color-text-main)' }}>{cmt.authorId?.name ?? 'User'}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-lighter)' }}>{new Date(cmt.createdAt).toLocaleString()}</span>
                </div>
                <div style={{ color: 'var(--color-text-muted)' }}>{cmt.message}</div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleComment} style={{ display: 'flex', gap: 12 }}>
          <input 
            placeholder="Type your message here..." 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)} 
          />
          <button type="submit" disabled={!newComment.trim()} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
            Send Reply
          </button>
        </form>
      </div>
    </div>
  );
};
