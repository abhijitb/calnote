import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import SecurityBadge from './components/SecurityBadge';
import CredentialsHelper from './components/CredentialsHelper';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/notes-dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 hover-lift">
          <LoginHeader />
          <LoginForm />
          <SecurityBadge />
        </div>

        {/* Demo Credentials Helper */}
        <CredentialsHelper />

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            © {new Date()?.getFullYear()} NoteCalendar. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;