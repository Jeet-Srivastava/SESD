import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, type ComplaintRecord } from '../lib/api';

export const StudentComplaintForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [similarIssues, setSimilarIssues] = useState<ComplaintRecord[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const checkSimilar = async () => {
    if (!token || title.length < 5 || description.length < 10) return;

    try {
      const duplicates = await api.checkSimilarComplaints(token, { title, description });
      setSimilarIssues(duplicates);
    } catch {
      setSimilarIssues([]);
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!token || !event.target.files?.length) return;

    setUploading(true);
    setErrorMsg('');

    try {
      const uploadedUrls = await Promise.all(
        Array.from(event.target.files).map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = async () => {
                try {
                  const result = await api.uploadImage(token, String(reader.result));
                  resolve(result.url);
                } catch (error) {
                  reject(error);
                }
              };
              reader.onerror = () => reject(new Error('Image read failed'));
              reader.readAsDataURL(file);
            }),
        ),
      );

      setImageUrls((current) => [...current, ...uploadedUrls]);
    } catch {
      setErrorMsg('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const removeImage = (urlToRemove: string) => {
    setImageUrls((current) => current.filter((url) => url !== urlToRemove));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) {
      setErrorMsg('Your session is missing. Please log in again.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await api.createComplaint(token, { title, description, imageUrls });
      setSuccessMsg(`Complaint submitted successfully! Redirecting...`);
      setTitle('');
      setDescription('');
      setSimilarIssues([]);
      setImageUrls([]);
      
      // Redirect to dashboard after brief delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch {
      setErrorMsg('Unable to create the complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-card animate-fade-in" style={{ maxWidth: 640, margin: '0 auto', width: '100%' }}>
      <h2 style={{ marginBottom: 8 }}>Submit a New Complaint</h2>
      <p style={{ marginBottom: 24 }}>
        Your complaint will be categorized automatically using AI.
      </p>

      {successMsg && <div className="success-msg" style={{ marginBottom: 20 }}>{successMsg}</div>}
      {errorMsg && <div className="error-msg" style={{ marginBottom: 20 }}>{errorMsg}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <input 
          placeholder="Issue title (e.g. Water dripping from AC)" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          onBlur={checkSimilar}
          minLength={3}
          required 
        />
        
        <textarea 
          placeholder="Issue description (please provide a few details, minimum 10 characters)" 
          rows={5}
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          onBlur={checkSimilar}
          minLength={10}
          required 
        />

        <div style={{ marginTop: 8 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: '0.9rem' }}>Attach Images (Optional)</label>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} style={{ background: 'transparent', padding: '12px 0', border: 'none' }} />
          {uploading ? <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>Uploading images...</p> : null}
          {imageUrls.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
              {imageUrls.map((url) => (
                <div
                  key={url}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <img src={url} alt="attached" style={{ width: 20, height: 20, objectFit: 'cover', borderRadius: 4 }} />
                  Attached
                  <button type="button" onClick={() => removeImage(url)} style={{ background: 'transparent', border: 'none', padding: 0, color: 'var(--color-danger)' }}>&times;</button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {similarIssues.length > 0 && (
          <div style={{ background: 'var(--color-warning-bg)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.2)', marginTop: 8 }}>
            <strong style={{ color: 'var(--color-warning)', display: 'block', marginBottom: 8 }}>Similar issues already reported:</strong>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
              {similarIssues.map((issue, idx) => (
                <li key={idx} style={{ marginBottom: 4 }}>
                  {issue.title} - <span className={`badge badge-${issue.status.toLowerCase()}`}>{issue.status}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" disabled={loading || uploading || !!successMsg} className="btn-primary" style={{ marginTop: 16 }}>
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
};
