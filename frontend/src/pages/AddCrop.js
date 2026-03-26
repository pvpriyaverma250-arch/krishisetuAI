import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Sprout, ArrowLeft, Upload, Mic, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AddCrop = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_hi: '',
    quantity: '',
    unit: 'quintal',
    price: '',
    location: user?.location || '',
    description: '',
    description_hi: ''
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const cropOptions = [
    { en: 'Wheat', hi: 'गेहूं' },
    { en: 'Rice', hi: 'चावल' },
    { en: 'Potato', hi: 'आलू' }
  ];

  const handleCropSelect = (crop) => {
    setFormData({ ...formData, name: crop.en, name_hi: crop.hi });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const token = localStorage.getItem('session_token');
      const uploadPromises = files.map(async (file) => {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        const response = await axios.post(`${API}/storage/upload`, uploadFormData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data.path;
      });

      const paths = await Promise.all(uploadPromises);
      setImages([...images, ...paths]);
      toast.success(t('Images uploaded!', 'चित्र अपलोड हो गए!'));
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error(t('Upload failed', 'अपलोड विफल'));
    } finally {
      setUploading(false);
    }
  };

  const generateDescription = async () => {
    if (!formData.name || !formData.quantity) {
      toast.error(t('Please fill crop name and quantity first', 'पहले फसल का नाम और मात्रा भरें'));
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('session_token');
      const response = await axios.post(
        `${API}/ai/generate-description`,
        {
          crop_name: formData.name,
          quantity: parseFloat(formData.quantity),
          unit: formData.unit,
          location: formData.location,
          language: language
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (language === 'en') {
        setFormData({ ...formData, description: response.data.description });
      } else {
        setFormData({ ...formData, description_hi: response.data.description });
      }
      toast.success(t('Description generated!', 'विवरण तैयार!'));
    } catch (error) {
      console.error('Description generation failed:', error);
      toast.error(t('Generation failed', 'जनरेशन विफल'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.quantity || !formData.price) {
      toast.error(t('Please fill all required fields', 'कृपया सभी आवश्यक फील्ड भरें'));
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('session_token');
      await axios.post(
        `${API}/crops`,
        {
          ...formData,
          quantity: parseFloat(formData.quantity),
          price: parseFloat(formData.price),
          images
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      toast.success(t('Crop listed successfully!', 'फसल सफलतापूर्वक सूचीबद्ध!'));
      navigate('/farmer/dashboard');
    } catch (error) {
      console.error('Crop creation failed:', error);
      toast.error(t('Failed to create listing', 'सूची बनाने में विफल'));
    } finally {
      setLoading(false);
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
              <Sprout className="h-8 w-8 text-[#15803d]" />
              <span className={`text-2xl font-bold text-[#15803d] ${language === 'hi' ? 'hindi' : ''}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
                {t('Add Crop', 'फसल जोड़ें')}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 md:px-6 max-w-3xl py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
          <div className="mb-6">
            <label className={`text-sm font-medium text-slate-700 mb-2 block ${language === 'hi' ? 'hindi' : ''}`}>
              {t('Select Crop', 'फसल चुनें')} *
            </label>
            <div className="grid grid-cols-3 gap-4">
              {cropOptions.map(crop => (
                <button
                  key={crop.en}
                  type="button"
                  data-testid={`crop-${crop.en.toLowerCase()}-btn`}
                  onClick={() => handleCropSelect(crop)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.name === crop.en
                      ? 'border-[#15803d] bg-green-50'
                      : 'border-slate-200 hover:border-[#15803d]/50 bg-white'
                  }`}
                >
                  <p className={`font-medium text-[#0f172a] ${language === 'hi' ? 'hindi' : ''}`}>
                    {language === 'en' ? crop.en : crop.hi}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`text-sm font-medium text-slate-700 mb-1.5 block ${language === 'hi' ? 'hindi' : ''}`}>
                {t('Quantity', 'मात्रा')} *
              </label>
              <input
                type="number"
                data-testid="quantity-input"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="100"
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
                required
              />
            </div>
            <div>
              <label className={`text-sm font-medium text-slate-700 mb-1.5 block ${language === 'hi' ? 'hindi' : ''}`}>
                {t('Unit', 'इकाई')}
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                data-testid="unit-select"
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
              >
                <option value="quintal">{t('Quintal', 'क्विंटल')}</option>
                <option value="kg">{t('Kg', 'किलो')}</option>
                <option value="ton">{t('Ton', 'टन')}</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className={`text-sm font-medium text-slate-700 mb-1.5 block ${language === 'hi' ? 'hindi' : ''}`}>
              {t('Price per unit (₹)', 'प्रति इकाई मूल्य (₹)')} *
            </label>
            <input
              type="number"
              data-testid="price-input"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="2150"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
              required
            />
          </div>

          <div className="mb-4">
            <label className={`text-sm font-medium text-slate-700 mb-1.5 block ${language === 'hi' ? 'hindi' : ''}`}>
              {t('Location', 'स्थान')} *
            </label>
            <input
              type="text"
              data-testid="location-input"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder={t('Lucknow', 'लखनऊ')}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
              required
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className={`text-sm font-medium text-slate-700 ${language === 'hi' ? 'hindi' : ''}`}>
                {t('Description', 'विवरण')}
              </label>
              <button
                type="button"
                onClick={generateDescription}
                disabled={loading}
                data-testid="generate-desc-btn"
                className="text-sm text-[#15803d] hover:text-[#166534] font-medium flex items-center gap-1 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
                {t('AI Generate', 'AI से बनाएं')}
              </button>
            </div>
            <textarea
              data-testid="description-input"
              value={language === 'en' ? formData.description : formData.description_hi}
              onChange={(e) => {
                if (language === 'en') {
                  setFormData({ ...formData, description: e.target.value });
                } else {
                  setFormData({ ...formData, description_hi: e.target.value });
                }
              }}
              placeholder={t('Describe your crop...', 'अपनी फसल का वर्णन करें...')}
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all ${language === 'hi' ? 'hindi' : ''}`}
            />
          </div>

          <div className="mb-6">
            <label className={`text-sm font-medium text-slate-700 mb-1.5 block ${language === 'hi' ? 'hindi' : ''}`}>
              {t('Crop Images', 'फसल की तस्वीरें')}
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-[#15803d]/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                data-testid="image-upload-input"
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {uploading ? (
                  <Loader2 className="h-12 w-12 mx-auto mb-3 text-[#15803d] animate-spin" />
                ) : (
                  <Upload className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                )}
                <p className={`text-slate-600 ${language === 'hi' ? 'hindi' : ''}`}>
                  {uploading
                    ? t('Uploading...', 'अपलोड हो रहा है...')
                    : t('Click to upload images', 'छवियां अपलोड करने के लिए क्लिक करें')}
                </p>
              </label>
              {images.length > 0 && (
                <p className="text-sm text-[#15803d] mt-2">{images.length} {t('images uploaded', 'छवियां अपलोड हुईं')}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            data-testid="submit-crop-btn"
            className="w-full bg-[#15803d] text-white hover:bg-[#166534] rounded-xl px-6 py-3 font-medium shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('Submitting...', 'सबमिट हो रहा है...') : t('List Crop', 'फसल सूचीबद्ध करें')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCrop;
