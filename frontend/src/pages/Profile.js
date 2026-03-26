import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, User as UserIcon, MapPin, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const { language, t } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    location: user?.location || '',
    phone: user?.phone || ''
  });

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setEditing(false);
      toast.success(t('Profile updated!', 'प्रोफाइल अपडेट हुआ!'));
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error(t('Update failed', 'अपडेट विफल'));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex items-center gap-4 h-16">
            <button
              onClick={() => navigate(-1)}
              data-testid="back-btn"
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <UserIcon className="h-8 w-8 text-[#15803d]" />
              <span className={`text-2xl font-bold text-[#15803d] ${language === 'hi' ? 'hindi' : ''}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
                {t('Profile', 'प्रोफाइल')}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 md:px-6 max-w-3xl py-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-4 mb-8">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="h-20 w-20 rounded-full"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-[#15803d] text-white flex items-center justify-center text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-[#0f172a]">{user?.name}</h1>
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user?.email}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className={`text-sm font-medium text-slate-700 mb-1.5 block ${language === 'hi' ? 'hindi' : ''}`}>
                {t('Role', 'भूमिका')}
              </label>
              <div className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center">
                <span className="capitalize">{user?.role}</span>
              </div>
            </div>

            <div>
              <label className={`text-sm font-medium text-slate-700 mb-1.5 block ${language === 'hi' ? 'hindi' : ''}`}>
                {t('Location', 'स्थान')}
              </label>
              {editing ? (
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    data-testid="location-input"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
                  />
                </div>
              ) : (
                <div className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <span>{user?.location}</span>
                </div>
              )}
            </div>

            <div>
              <label className={`text-sm font-medium text-slate-700 mb-1.5 block ${language === 'hi' ? 'hindi' : ''}`}>
                {t('Phone', 'फोन')}
              </label>
              {editing ? (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="tel"
                    data-testid="phone-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
                  />
                </div>
              ) : (
                <div className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-slate-400" />
                  <span>{user?.phone || t('Not provided', 'नहीं दिया')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  data-testid="save-btn"
                  className="flex-1 bg-[#15803d] text-white hover:bg-[#166534] rounded-xl px-6 py-3 font-medium shadow-sm transition-all active:scale-95"
                >
                  {t('Save', 'सेव करें')}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData({ location: user?.location || '', phone: user?.phone || '' });
                  }}
                  data-testid="cancel-btn"
                  className="flex-1 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-xl px-6 py-3 font-medium transition-all"
                >
                  {t('Cancel', 'रद्द करें')}
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                data-testid="edit-btn"
                className="w-full bg-[#15803d] text-white hover:bg-[#166534] rounded-xl px-6 py-3 font-medium shadow-sm transition-all active:scale-95"
              >
                {t('Edit Profile', 'प्रोफाइल संपादित करें')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
