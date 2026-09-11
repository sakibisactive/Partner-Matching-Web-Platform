import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { SocketProvider } from './contexts/SocketContext';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './views/public/LandingPage';
import { LoginPage } from './views/public/LoginPage';
import { RegisterPage } from './views/public/RegisterPage';
import { ForgotPasswordPage } from './views/public/ForgotPasswordPage';
import { AboutPage } from './views/public/AboutPage';
import { PrismaDemoPage } from './views/public/PrismaDemoPage';
import { DiscoverPage } from './views/user/DiscoverPage';
import { MatchResultsPage } from './views/user/MatchResultsPage';
import { ProfilePage } from './views/user/ProfilePage';
import { EditProfilePage } from './views/user/EditProfilePage';
import { LikesPage } from './views/user/LikesPage';
import { ChatPage } from './views/user/ChatPage';
import { AdminDashboard } from './views/admin/AdminDashboard';
import { AdminUsersPage } from './views/admin/AdminUsersPage';
import { AdminReportsPage } from './views/admin/AdminReportsPage';
import { AdminInterestsPage } from './views/admin/AdminInterestsPage';
import { useAuth } from './hooks/useAuth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  return isAuthenticated && isAdmin ? <>{children}</> : <Navigate to="/discover" replace />;
};

export default function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="reset-password" element={<ForgotPasswordPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="prisma-demo" element={<PrismaDemoPage />} />

              {/* Protected User Routes */}
              <Route
                path="discover"
                element={
                  <ProtectedRoute>
                    <DiscoverPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="matches"
                element={
                  <ProtectedRoute>
                    <MatchResultsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit-profile"
                element={
                  <ProtectedRoute>
                    <EditProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="likes"
                element={
                  <ProtectedRoute>
                    <LikesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="chat"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/users"
                element={
                  <AdminRoute>
                    <AdminUsersPage />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/reports"
                element={
                  <AdminRoute>
                    <AdminReportsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/interests"
                element={
                  <AdminRoute>
                    <AdminInterestsPage />
                  </AdminRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </Provider>
  );
}
