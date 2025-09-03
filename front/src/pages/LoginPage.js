import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import useAuth from '../hooks/userAuth';

export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <LoginForm
        onSwitchToRegister={() => navigate('/register')}
        onForgotPassword={() => navigate('/forgot-password')}
      />
    </div>
  );
}


