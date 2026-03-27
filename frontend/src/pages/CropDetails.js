import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Sprout, ArrowLeft, MapPin, Loader2, MessageCircle, Phone, Share2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CropDetails = () => {
  const { cropId } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactLoading, setContactLoading] = useState(false);

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

  const handleWhatsAppContact = async () => {
    setContactLoading(true);
    try {
      const token = localStorage.getItem('session_token');
      const response = await axios.get(`${API}/crops/${cropId}/contact`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const { whatsapp_link, phone } = response.data;
      
      if (phone) {
        window.open(whatsapp_link, '_blank');
        toast.success(t('Opening WhatsApp...', 'WhatsApp खुल रहा है...'));
      } else {
        // If no phone, copy message to clipboard
        const message = `नमस्ते! मुझे KrishiSetuAI पर ${crop.name} में दिलचस्पी है।`;
        navigator.clipboard.writeText(message);
        toast.info(t('Message copied! Share with farmer via WhatsApp', 'संदेश कॉपी हुआ! WhatsApp से किसान को भेजें'));
      }
    } catch (error) {
      console.error('Contact error:', error);
      // Fallback - direct share
      const message = encodeURIComponent(`मुझे ${crop?.name} में दिलचस्पी है - KrishiSetuAI`);
      window.open(`https://wa.me/?text=${message}`, '_blank');
    } finally {
      setContactLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${crop.name} - KrishiSetuAI`,
      text: `${crop.name} (${crop.quantity} ${crop.unit}) @ ₹${crop.price}/${crop.unit} - ${crop.location}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      toast.success(t('Link copied!', 'लिंक कॉपी हुआ!'));
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
            <div className="relative w-full aspect-square bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl flex items-center justify-center overflow-hidden">
              <Sprout className="h-32 w-32 text-green-300" />
              
              {/* Quality Grade Badge */}
              {crop.quality_grade && (
                <div className={`absolute top-4 right-4 h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg ${
                  crop.quality_grade === 'A' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                  crop.quality_grade === 'B' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                  crop.quality_grade === 'C' ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
                  'bg-gradient-to-br from-red-500 to-red-600'
                }`}>
                  {crop.quality_grade}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              {crop.quality_grade && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  crop.quality_grade === 'A' ? 'bg-green-100 text-green-700 border border-green-200' :
                  crop.quality_grade === 'B' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                  'bg-amber-100 text-amber-700 border border-amber-200'
                }`}>
                  {t('Grade', 'ग्रेड')} {crop.quality_grade}
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

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6 mb-6">
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
                {language === 'en' ? (crop.description || 'Fresh quality crop available for sale.') : (crop.description_hi || 'बिक्री के लिए ताज़ी गुणवत्ता वाली फसल उपलब्ध है।')}
              </p>
            </div>

            <div className="mb-6">
              <h2 className={`text-xl font-semibold text-[#0f172a] mb-3 ${language === 'hi' ? 'hindi' : ''}`}>
                {t('Farmer Information', 'किसान जानकारी')}
              </h2>
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center font-bold text-lg">
                    {crop.farmer_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0f172a]">{crop.farmer_name}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {crop.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Contact Button */}
            <div className="space-y-3">
              <button
                onClick={handleWhatsAppContact}
                disabled={contactLoading}
                data-testid="whatsapp-contact-btn"
                className={`w-full bg-[#25D366] text-white hover:bg-[#20BA5C] rounded-xl px-6 py-4 font-semibold shadow-lg shadow-green-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 ${language === 'hi' ? 'hindi' : ''}`}
              >
                {contactLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <MessageCircle className="h-5 w-5" />
                )}
                {t('Contact on WhatsApp', 'WhatsApp पर संपर्क करें')}
              </button>
              
              <button
                onClick={handleShare}
                data-testid="share-btn"
                className={`w-full bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl px-6 py-4 font-semibold transition-all flex items-center justify-center gap-3 ${language === 'hi' ? 'hindi' : ''}`}
              >
                <Share2 className="h-5 w-5" />
                {t('Share Listing', 'लिस्टिंग शेयर करें')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDetails;
