import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { StudentComplaintForm } from './StudentComplaintForm';
import { MyComplaints } from './MyComplaints';
import { StaffDashboard } from './StaffDashboard';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ComplaintDetails } from './ComplaintDetails';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {
  const { userRole } = useAuth();
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={userRole === 'STUDENT' ? <MyComplaints /> : <StaffDashboard />} />
        <Route
          path="/new"
          element={userRole === 'STUDENT' ? <StudentComplaintForm /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/analytics"
          element={userRole !== 'STUDENT' ? <AnalyticsDashboard /> : <Navigate to="/dashboard" replace />}
        />
        <Route path="/complaint/:id" element={<ComplaintDetails />} />
      </Routes>
    </Layout>
  );
};
