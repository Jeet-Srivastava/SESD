import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, type AnalyticsOverview } from '../lib/api';

export const AnalyticsDashboard = () => {
  const { token } = useAuth();
  const [data, setData] = useState<AnalyticsOverview | null>(null);

  useEffect(() => {
    if (!token) return;
    void api.getAnalyticsOverview(token).then(setData);
  }, [token]);

  if (!data) return (
    <div className="content-card" style={{ maxWidth: '100%', margin: 0, padding: 40, textAlign: 'center', color: 'var(--color-text-muted)' }}>
      Loading analytics...
    </div>
  );

  return (
    <div className="content-card animate-fade-in" style={{ maxWidth: '100%', margin: 0, padding: 32 }}>
      <h2 style={{ margin: '0 0 24px 0' }}>Analytics & System Overview</h2>
      
      <div className="dash-grid" style={{ marginBottom: 32 }}>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <span className="stat-title">Total Complaints</span>
          <strong className="stat-value" style={{ color: 'var(--color-brand)' }}>{data.totalComplaints}</strong>
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <span className="stat-title">Avg Resolution Time</span>
          <strong className="stat-value" style={{ color: 'var(--color-success)' }}>{data.avgResolutionHours?.toFixed(1) || 0}h</strong>
        </div>
      </div>

      <div className="dash-grid" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Status Breakdown</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.statusBreakdown.map((item) => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{item._id}</span>
                <span className={`badge badge-${item._id.toLowerCase()}`}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="stat-card">
          <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Priority Breakdown</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.priorityBreakdown.map((item) => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{item._id}</span>
                <span className={`badge badge-${item._id.toLowerCase()}`}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="stat-card">
          <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Complaint Trends</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.complaintTrends.length === 0 ? <p style={{ color: 'var(--color-text-lighter)' }}>No trend data yet.</p> : data.complaintTrends.map((item) => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--color-border)', paddingBottom: 8 }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{item._id}</span>
                <strong style={{ fontSize: '1.1rem' }}>{item.count}</strong>
              </div>
            ))}
          </div>
        </div>
        
        <div className="stat-card">
          <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Staff Performance</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {data.staffPerformance.length === 0 ? <p style={{ color: 'var(--color-text-lighter)' }}>No assigned staff records yet.</p> : data.staffPerformance.map((staff) => (
              <div key={staff._id} style={{ background: 'var(--color-bg)', padding: 12, borderRadius: 'var(--radius-md)' }}>
                <strong style={{ display: 'block', marginBottom: 8, color: 'var(--color-text-main)' }}>{staff.name}</strong>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  <span>Assigned: <strong>{staff.totalAssigned}</strong></span>
                  <span>Resolved: <strong>{staff.resolvedCount}</strong></span>
                  <span>Avg logic: <strong>{staff.avgResolutionHours.toFixed(1)}h</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
