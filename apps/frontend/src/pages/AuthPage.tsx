import { FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../lib/api';

export const AuthPage = () => {
  const { mode, setMode, login, register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, role);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content-card animate-fade-in" style={{ marginTop: '10vh' }}>
      <div className="auth-head">
        <h2>{mode === 'login' ? 'Welcome Back' : 'Create an Account'}</h2>
        <p>
          {mode === 'login'
            ? 'Enter your details to access your dashboard'
            : 'Register to manage smart campus complaints'}
        </p>
      </div>
      
      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === 'register' ? (
          <>
            <div className="role-tabs">
              {(['STUDENT', 'STAFF', 'ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`role-tab ${role === r ? 'active' : ''}`}
                  onClick={() => setRole(r)}
                >
                  {r.charAt(0) + r.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            <input
              placeholder="Full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </>
        ) : null}
        
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        
        {error ? <div className="error-msg">{error}</div> : null}
        
        <button type="submit" disabled={isSubmitting} style={{ marginTop: 8 }}>
          {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Register Account'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
        </span>
        <button
          className="auth-switch-btn"
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError(null);
          }}
        >
          {mode === 'login' ? 'Sign up' : 'Log in'}
        </button>
      </div>
    </div>
  );
};
