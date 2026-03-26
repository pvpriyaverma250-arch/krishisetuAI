import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Sprout, ShoppingCart, MapPin, Languages } from 'lucide-react';
import { toast } from 'sonner';

const RoleSelection = () => {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const [role, setRole] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!role || !locationInput) {
      toast.error(t('Please fill all required fields', 'कृपया सभी आवश्यक फील्ड भरें'));
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ role, location: locationInput, phone });
      toast.success(t('Profile updated!', 'प्रोफाइल अपडेट हो गया!'));
      
      if (role === 'farmer') {
        navigate('/farmer/dashboard', { replace: true });
      } else {
        navigate('/buyer/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(t('Update failed', 'अपडेट विफल'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <nav className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Sprout className="h-8 w-8 text-[#15803d]" />
              <span className="text-2xl font-bold text-[#15803d]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {t('KrishiSetuAI', 'कृषिसेतु AI')}
              </span>
            </div>
            <button
              onClick={toggleLanguage}
              data-testid="language-toggle-btn"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Languages className="h-5 w-5" />
              <span className="font-medium">{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className={`text-3xl md:text-4xl font-semibold tracking-tight text-[#0f172a] mb-3 ${language === 'hi' ? 'hindi' : ''}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
              {t('Complete Your Profile', 'अपना प्रोफाइल पूरा करें')}
            </h1>
            <p className={`text-base text-slate-600 ${language === 'hi' ? 'hindi' : ''}`}>
              {t('Tell us a bit about yourself to get started', 'शुरू करने के लिए अपने बारे में बताएं')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-lg p-8">
            <div className="mb-6">
              <label className={`text-sm font-medium text-slate-700 mb-2 block ${language === 'hi' ? 'hindi' : ''}`}>
                {t('I am a...', 'मैं हूँ...')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  data-testid="role-farmer-btn"
                  onClick={() => setRole('farmer')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    role === 'farmer'
                      ? 'border-[#15803d] bg-green-50'
                      : 'border-slate-200 hover:border-[#15803d]/50 bg-white'
                  }`}
                >
                  <Sprout className={`h-10 w-10 mx-auto mb-3 ${
                    role === 'farmer' ? 'text-[#15803d]' : 'text-slate-400'
                  }`} />
                  <p className={`font-medium text-[#0f172a] ${language === 'hi' ? 'hindi' : ''}`}>
                    {t('Farmer', 'किसान')}
                  </p>
                  <p className={`text-sm text-slate-500 mt-1 ${language === 'hi' ? 'hindi' : ''}`}>
                    {t('Sell crops directly', 'सीधे फसल बेचें')}
                  </p>
                </button>
                <button
                  type="button"
                  data-testid="role-buyer-btn"
                  onClick={() => setRole('buyer')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    role === 'buyer'
                      ? 'border-[#15803d] bg-green-50'
                      : 'border-slate-200 hover:border-[#15803d]/50 bg-white'
                  }`}
                >
                  <ShoppingCart className={`h-10 w-10 mx-auto mb-3 ${
                    role === 'buyer' ? 'text-[#15803d]' : 'text-slate-400'
                  }`} />
                  <p className={`font-medium text-[#0f172a] ${language === 'hi' ? 'hindi' : ''}`}>
                    {t('Buyer', 'खरीदार')}
                  </p>
                  <p className={`text-sm text-slate-500 mt-1 ${language === 'hi' ? 'hindi' : ''}`}>
                    {t('Buy from farmers', 'किसानों से खरीदें')}
                  </p>
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="location" className={`text-sm font-medium text-slate-700 mb-1.5 block ${language === 'hi' ? 'hindi' : ''}`}>
                {t('Location (District)', 'स्थान (जिला)')} *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="location"
                  type="text"
                  data-testid="location-input"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder={t('e.g., Lucknow', 'उदाहरण: लखनऊ')}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all text-lg"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className={`text-sm font-medium text-slate-700 mb-1.5 block ${language === 'hi' ? 'hindi' : ''}`}>
                {t('Phone Number (Optional)', 'फोन नंबर (वैकल्पिक)')}
              </label>
              <input
                id="phone"
                type="tel"
                data-testid="phone-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXXXXXXX"
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all text-lg"
              />
            </div>

            <button
              type="submit"
              data-testid="submit-profile-btn"
              disabled={loading}
              className="w-full bg-[#15803d] text-white hover:bg-[#166534] rounded-xl px-6 py-3 font-medium shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('Saving...', 'सेव हो रहा है...') : t('Continue', 'जारी रखें')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
