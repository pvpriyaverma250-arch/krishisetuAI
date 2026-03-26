import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from 'sonner';
import './App.css';

import LandingPage from './pages/LandingPage';
import AuthCallback from './pages/AuthCallback';
import RoleSelection from './pages/RoleSelection';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import Marketplace from './pages/Marketplace';
import AddCrop from './pages/AddCrop';
import CropDetails from './pages/CropDetails';
import PriceIntelligence from './pages/PriceIntelligence';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import VoiceAssistant from './components/VoiceAssistant';

function AppRouter() {
  const location = useLocation();
  
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        
        <Route path="/farmer/dashboard" element={
          <ProtectedRoute requiredRole="farmer">
            <FarmerDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/buyer/dashboard" element={
          <ProtectedRoute requiredRole="buyer">
            <BuyerDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/marketplace" element={
          <ProtectedRoute>
            <Marketplace />
          </ProtectedRoute>
        } />
        
        <Route path="/crops/new" element={
          <ProtectedRoute requiredRole="farmer">
            <AddCrop />
          </ProtectedRoute>
        } />
        
        <Route path="/crops/:cropId" element={
          <ProtectedRoute>
            <CropDetails />
          </ProtectedRoute>
        } />
        
        <Route path="/prices" element={
          <ProtectedRoute>
            <PriceIntelligence />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <VoiceAssistant />
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
