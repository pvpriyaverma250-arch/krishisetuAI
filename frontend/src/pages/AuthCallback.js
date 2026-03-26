import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const processSession = async () => {
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      try {
        const hash = location.hash;
        if (!hash) {
          navigate('/');
          return;
        }

        const params = new URLSearchParams(hash.substring(1));
        const sessionId = params.get('session_id');

        if (!sessionId) {
          navigate('/');
          return;
        }

        const user = await login(sessionId);

        if (!user.role || !user.location) {
          navigate('/role-selection', { state: { user }, replace: true });
        } else if (user.role === 'farmer') {
          navigate('/farmer/dashboard', { state: { user }, replace: true });
        } else if (user.role === 'buyer') {
          navigate('/buyer/dashboard', { state: { user }, replace: true });
        } else {
          navigate('/role-selection', { state: { user }, replace: true });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/');
      }
    };

    processSession();
  }, [location, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#15803d] mx-auto mb-4" />
        <p className="text-lg text-slate-600">Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
