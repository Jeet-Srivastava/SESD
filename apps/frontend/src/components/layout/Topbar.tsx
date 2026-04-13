import { useAuth } from '../../context/AuthContext';

export const Topbar = () => {
  const { logout, userRole } = useAuth();
  
  return (
    <header className="dash-topbar">
      <h2>Smart Campus Dashboard</h2>
      <div className="topbar-right">
        {userRole && <span className="user-badge">{userRole}</span>}
        <button onClick={logout} className="btn-danger">Logout</button>
      </div>
    </header>
  );
};
