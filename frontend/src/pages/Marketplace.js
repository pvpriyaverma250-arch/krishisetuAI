import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Sprout, Search, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Marketplace = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('');

  useEffect(() => {
    fetchCrops();
  }, [cropFilter]);

  const fetchCrops = async () => {
    try {
      const params = {};
      if (cropFilter) params.crop_name = cropFilter;
      
      const response = await axios.get(`${API}/crops`, { params });
      setCrops(response.data);
    } catch (error) {
      console.error('Failed to fetch crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCrops = crops.filter(crop => {
    const searchLower = search.toLowerCase();
    return crop.name.toLowerCase().includes(searchLower) || 
           crop.location.toLowerCase().includes(searchLower) ||
           crop.farmer_name.toLowerCase().includes(searchLower);
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                data-testid="back-btn"
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <Sprout className="h-8 w-8 text-[#15803d]" />
                <span className="text-2xl font-bold text-[#15803d]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {t('Marketplace', 'बाजार')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                data-testid="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('Search crops, location, or farmer...', 'फसल, स्थान, या किसान खोजें...')}
                className={`w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all ${language === 'hi' ? 'hindi' : ''}`}
              />
            </div>
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              data-testid="crop-filter"
              className="h-12 px-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all"
            >
              <option value="">{t('All Crops', 'सभी फसलें')}</option>
              <option value="Wheat">{t('Wheat', 'गेहूं')}</option>
              <option value="Rice">{t('Rice', 'चावल')}</option>
              <option value="Potato">{t('Potato', 'आलू')}</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">{t('Loading...', 'लोड हो रहा है...')}</div>
        ) : filteredCrops.length === 0 ? (
          <div className={`text-center py-12 text-slate-500 ${language === 'hi' ? 'hindi' : ''}`}>
            {t('No crops found', 'कोई फसल नहीं मिली')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCrops.map(crop => (
              <div
                key={crop.crop_id}
                onClick={() => navigate(`/crops/${crop.crop_id}`)}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer"
                data-testid="crop-card"
              >
                <div className="w-full aspect-[4/3] bg-slate-100 flex items-center justify-center">
                  <Sprout className="h-16 w-16 text-slate-300" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    {crop.quality_grade && (
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-800 font-bold text-sm border border-amber-200">
                        {crop.quality_grade}
                      </span>
                    )}
                  </div>
                  <h3 className={`text-xl font-semibold text-[#0f172a] mb-1 ${language === 'hi' ? 'hindi' : ''}`}>
                    {language === 'en' ? crop.name : crop.name_hi}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">
                    {crop.farmer_name} • {crop.location}
                  </p>
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
    </div>
  );
};

export default Marketplace;
