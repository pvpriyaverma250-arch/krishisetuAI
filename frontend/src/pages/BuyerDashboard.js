import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Sprout, TrendingUp, Package, Users, LogOut, Languages, User, ShoppingCart } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const [crops, setCrops] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cropsRes, pricesRes] = await Promise.all([
        axios.get(`${API}/crops`),
        axios.get(`${API}/prices/current`)
      ]);
      setCrops(cropsRes.data.slice(0, 6));
      setPrices(pricesRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const stats = [
    {
      icon: Package,
      label: t('Available Crops', 'उपलब्ध फसलें'),
      value: crops.length,
      color: 'text-[#15803d]',
      bg: 'bg-green-50'
    },
    {
      icon: Users,
      label: t('Active Farmers', 'सक्रिय किसान'),
      value: new Set(crops.map(c => c.farmer_id)).size,
      color: 'text-[#3b82f6]',
      bg: 'bg-blue-50'
    },
    {
      icon: TrendingUp,
      label: t('Avg Price', 'औसत मूल्य'),
      value: crops.length > 0 ? `₹${Math.round(crops.reduce((sum, c) => sum + c.price, 0) / crops.length)}` : '₹0',
      color: 'text-[#d97706]',
      bg: 'bg-amber-50'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Sprout className="h-8 w-8 text-[#15803d]" />
              <span className="text-2xl font-bold text-[#15803d]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {t('KrishiSetuAI', 'कृषिसेतु AI')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                data-testid="language-toggle-btn"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Languages className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('/profile')}
                data-testid="profile-btn"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <User className="h-5 w-5" />
              </button>
              <button
                onClick={handleLogout}
                data-testid="logout-btn"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8">
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-semibold tracking-tight text-[#0f172a] mb-2 ${language === 'hi' ? 'hindi' : ''}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
            {t('Welcome back', 'वापस आपका स्वागत है')}, {user?.name?.split(' ')[0]}
          </h1>
          <p className={`text-base text-slate-600 ${language === 'hi' ? 'hindi' : ''}`}>
            {t('Find quality crops from verified farmers', 'सत्यापित किसानों से गुणवत्ता वाली फसलें खोजें')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-sm text-slate-500 mb-1 ${language === 'hi' ? 'hindi' : ''}`}>{stat.label}</p>
                  <p className="text-2xl font-bold text-[#0f172a]">{stat.value}</p>
                </div>
                <div className={`${stat.bg} ${stat.color} h-12 w-12 rounded-xl flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => navigate('/marketplace')}
            data-testid="browse-marketplace-btn"
            className="bg-[#15803d] text-white hover:bg-[#166534] rounded-2xl p-6 font-medium shadow-sm transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className={`text-lg ${language === 'hi' ? 'hindi' : ''}`}>
              {t('Browse Marketplace', 'बाजार देखें')}
            </span>
          </button>
          <button
            onClick={() => navigate('/prices')}
            data-testid="view-prices-btn"
            className="bg-white text-[#15803d] border-2 border-[#15803d]/20 hover:border-[#15803d] hover:bg-green-50 rounded-2xl p-6 font-medium transition-all flex items-center justify-center gap-3"
          >
            <TrendingUp className="h-6 w-6" />
            <span className={`text-lg ${language === 'hi' ? 'hindi' : ''}`}>
              {t('View Market Prices', 'बाजार मूल्य देखें')}
            </span>
          </button>
        </div>

        <div>
          <h2 className={`text-2xl font-semibold text-[#0f172a] mb-4 ${language === 'hi' ? 'hindi' : ''}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
            {t('Recent Listings', 'हाल की सूचियाँ')}
          </h2>
          {loading ? (
            <div className="text-center py-8 text-slate-500">{t('Loading...', 'लोड हो रहा है...')}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {crops.map(crop => (
                <div
                  key={crop.crop_id}
                  onClick={() => navigate(`/crops/${crop.crop_id}`)}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {t('Farmer', 'किसान')}
                      </span>
                    </div>
                    <h3 className={`text-xl font-semibold text-[#0f172a] mb-2 ${language === 'hi' ? 'hindi' : ''}`}>
                      {language === 'en' ? crop.name : crop.name_hi}
                    </h3>
                    <p className="text-sm text-slate-500 mb-3">{crop.location}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#15803d]" style={{ fontFamily: 'monospace' }}>
                        ₹{crop.price}/{crop.unit}
                      </span>
                      <span className="text-sm text-slate-600">{crop.quantity} {crop.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className={`text-2xl font-semibold text-[#0f172a] mb-4 ${language === 'hi' ? 'hindi' : ''}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
            {t("Today's Mandi Prices", 'आज की मंडी कीमतें')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {prices.map(price => (
              <div key={price.crop_name} className="bg-white rounded-xl border border-slate-100 p-4">
                <p className={`font-medium text-[#0f172a] mb-2 ${language === 'hi' ? 'hindi' : ''}`}>{price.crop_name}</p>
                <p className="text-2xl font-bold text-[#15803d] mb-1" style={{ fontFamily: 'monospace' }}>₹{price.current_price}</p>
                <p className="text-xs text-slate-500">{price.market}</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{t('Min:', 'न्यून:')} ₹{price.min_price}</span>
                  <span className="text-slate-500">{t('Max:', 'अधिक:')} ₹{price.max_price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
