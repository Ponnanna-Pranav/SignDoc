import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Manage from './pages/Manage';
import Templates from './pages/Templates';
import Reports from './pages/Reports';
import Admin from './pages/Admin';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminSettings from './pages/Admin/AdminSettings';
import AdminBilling from './pages/Admin/AdminBilling';
import AdminSecurity from './pages/Admin/AdminSecurity';
import SignDocument from './pages/SignDocument';
import MainLayout from './components/Layout/MainLayout';
import AuthService from './api/auth.service';

const ProtectedRoute = ({ children }) => {
  const user = AuthService.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppLayout = ({ children }) => {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes with Layout */}
        <Route path="/home" element={<AppLayout><Home /></AppLayout>} />
        <Route path="/manage" element={<AppLayout><Manage /></AppLayout>} />
        <Route path="/templates" element={<AppLayout><Templates /></AppLayout>} />
        <Route path="/reports" element={<AppLayout><Reports /></AppLayout>} />
        <Route path="/admin" element={<AppLayout><Admin /></AppLayout>} />
        <Route path="/admin/users" element={<AppLayout><AdminUsers /></AppLayout>} />
        <Route path="/admin/settings" element={<AppLayout><AdminSettings /></AppLayout>} />
        <Route path="/admin/billing" element={<AppLayout><AdminBilling /></AppLayout>} />
        <Route path="/admin/security" element={<AppLayout><AdminSecurity /></AppLayout>} />

        {/* Standalone Protected Routes (e.g. detailed signing view) */}
        <Route
          path="/sign/:id"
          element={
            <ProtectedRoute>
              <SignDocument />
            </ProtectedRoute>
          }
        />

        {/* Redirects */}
        <Route
          path="/dashboard"
          element={<Navigate to="/home" replace />}
        />
        <Route
          path="/"
          element={
            AuthService.getCurrentUser() ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
