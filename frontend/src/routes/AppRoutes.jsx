import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Loader from '../components/common/Loader';

const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Chat = lazy(() => import('../pages/Chat'));
const Library = lazy(() => import('../pages/Library'));
const SavedAnswers = lazy(() => import('../pages/SavedAnswers'));
const Settings = lazy(() => import('../pages/Settings'));

function SuspenseWrapper({ children }) {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#0B1020] flex items-center justify-center">
          <Loader size="medium" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/login" element={<SuspenseWrapper><Login /></SuspenseWrapper>} />
      <Route path="/register" element={<SuspenseWrapper><Register /></SuspenseWrapper>} />

      {/* Protected Pages */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><Chat /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><Library /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved-answers"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><SavedAnswers /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><Settings /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />

      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/chat" replace />} />
    </Routes>
  );
}
