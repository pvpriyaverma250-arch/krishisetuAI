import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Sprout, ArrowLeft, MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CropDetails = () => {
  const { cropId } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrop();
  }, [cropId]);

  const fetchCrop = async () => {
    try {
      const response = await axios.get(`${API}/crops/${cropId}`);
      setCrop(response.data);
    } catch (error) {
      console.error('Failed to fetch crop:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-12 w-12 animate-spin text-[#15803d]" />
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <p className="text-lg text-slate-600">{t('Crop not found', 'फसल नहीं मिली')}</p>
      </div>
    );
  }

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
              <Sprout className="h-8 w-8 text-[#15803d]" />
              <span className={`text-2xl font-bold text-[#15803d] ${language === 'hi' ? 'hindi' : ''}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
                {t('Crop Details', 'फसल विवरण')}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 md:px-6 max-w-5xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="w-full aspect-square bg-slate-100 rounded-2xl flex items-center justify-center">
              <Sprout className="h-24 w-24 text-slate-300" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              {crop.quality_grade && (
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 text-amber-800 font-bold text-lg border border-amber-200">
                  {crop.quality_grade}
                </span>
              )}
              {crop.verified && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  {t('Verified Farmer', 'सत्यापित किसान')}
                </span>
              )}
            </div>

            <h1 className={`text-3xl md:text-4xl font-bold tracking-tight text-[#0f172a] mb-4 ${language === 'hi' ? 'hindi' : ''}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
              {language === 'en' ? crop.name : crop.name_hi}
            </h1>

            <div className="bg-green-50 border border-green-100 rounded-xl p-6 mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-[#15803d]" style={{ fontFamily: 'monospace' }}>₹{crop.price}</span>
                <span className="text-lg text-slate-600">/ {crop.unit}</span>
              </div>
              <p className={`text-sm text-slate-600 ${language === 'hi' ? 'hindi' : ''}`}>
                {t('Available:', 'उपलब्ध:')} {crop.quantity} {crop.unit}
              </p>
            </div>

            <div className="mb-6">
              <h2 className={`text-xl font-semibold text-[#0f172a] mb-3 ${language === 'hi' ? 'hindi' : ''}`}>
                {t('Description', 'विवरण')}
              </h2>
              <p className={`text-base leading-relaxed text-slate-600 ${language === 'hi' ? 'hindi' : ''}`}>
                {language === 'en' ? (crop.description || 'No description available') : (crop.description_hi || 'कोई विवरण उपलब्ध नहीं')}
              </p>
            </div>

            <div className="mb-6">
              <h2 className={`text-xl font-semibold text-[#0f172a] mb-3 ${language === 'hi' ? 'hindi' : ''}`}>
                {t('Farmer Information', 'किसान जानकारी')}
              </h2>
              <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#15803d] text-white flex items-center justify-center font-bold">
                    {crop.farmer_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-[#0f172a]">{crop.farmer_name}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {crop.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              data-testid="contact-farmer-btn"
              className={`w-full bg-[#15803d] text-white hover:bg-[#166534] rounded-xl px-6 py-4 font-medium shadow-sm transition-all active:scale-95 ${language === 'hi' ? 'hindi' : ''}`}
            >
              {t('Contact Farmer', 'किसान से संपर्क करें')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDetails;
