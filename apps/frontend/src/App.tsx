import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';

export const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>Smart Campus Complaint Management</h1>
      </header>

      <main className="main-content">
        <Routes>
          {/* Public routing */}
          <Route 
            path="/auth" 
            element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" replace />} 
          />
          
          {/* Protected routing */}
          <Route 
            path="/dashboard/*" 
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/auth" replace />} 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </main>
    </div>
  );
};
