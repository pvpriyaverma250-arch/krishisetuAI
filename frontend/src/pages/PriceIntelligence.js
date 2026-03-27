import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PriceIntelligence = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [prices, setPrices] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [trends, setTrends] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices();
  }, []);

  useEffect(() => {
    if (selectedCrop) {
      fetchTrends();
      fetchPrediction();
    }
  }, [selectedCrop]);

  const fetchPrices = async () => {
    try {
      const response = await axios.get(`${API}/prices/current`);
      setPrices(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      setLoading(false);
    }
  };

  const fetchTrends = async () => {
    try {
      const response = await axios.get(`${API}/prices/trends?crop_name=${selectedCrop}`);
      setTrends(response.data.trends);
    } catch (error) {
      console.error('Failed to fetch trends:', error);
    }
  };

  const fetchPrediction = async () => {
    try {
      const response = await axios.get(`${API}/prices/prediction?crop_name=${selectedCrop}`);
      setPrediction(response.data);
    } catch (error) {
      console.error('Failed to fetch prediction:', error);
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
              <TrendingUp className="h-8 w-8 text-[#15803d]" />
              <span className={`text-2xl font-bold text-[#15803d] ${language === 'hi' ? 'hindi' : ''}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
                {t('Price Intelligence', 'मूल्य जानकारी')}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8">
        <div className="mb-6">
          <h2 className={`text-2xl font-semibold text-[#0f172a] mb-4 ${language === 'hi' ? 'hindi' : ''}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
            {t("Today's Mandi Prices - Lucknow", 'आज की मंडी कीमतें - लखनऊ')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {prices.map(price => (
              <div
                key={price.crop_name}
                onClick={() => setSelectedCrop(price.crop_name)}
                className={`bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                  selectedCrop === price.crop_name
                    ? 'border-[#15803d] shadow-md'
                    : 'border-slate-100 hover:border-[#15803d]/50'
                }`}
                data-testid="price-card"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className={`font-medium text-[#0f172a] ${language === 'hi' ? 'hindi' : ''}`}>{price.crop_name}</p>
                  {price.source && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      price.source === 'agmarknet' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {price.source === 'agmarknet' ? t('Live', 'लाइव') : t('Est.', 'अनु.')}
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold text-[#15803d] mb-1" style={{ fontFamily: 'monospace' }}>₹{price.current_price}</p>
                <p className="text-sm text-slate-500 mb-3">per {price.unit}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{t('Min:', 'न्यून:')} ₹{price.min_price}</span>
                  <span className="text-slate-600">{t('Max:', 'अधिक:')} ₹{price.max_price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {trends.length > 0 && (
          <div className="mb-8">
            <h2 className={`text-2xl font-semibold text-[#0f172a] mb-4 ${language === 'hi' ? 'hindi' : ''}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
              {t('Price Trends - Last 30 Days', 'मूल्य प्रवृत्ति - पिछले 30 दिन')}
            </h2>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#15803d" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {prediction && (
          <div>
            <h2 className={`text-2xl font-semibold text-[#0f172a] mb-4 ${language === 'hi' ? 'hindi' : ''}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
              {t('AI Price Predictions', 'AI मूल्य पूर्वानुमान')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: t('7 Days', '7 दिन'), value: prediction.predicted_7d },
                { label: t('15 Days', '15 दिन'), value: prediction.predicted_15d },
                { label: t('30 Days', '30 दिन'), value: prediction.predicted_30d }
              ].map(pred => {
                const change = ((pred.value - prediction.current_price) / prediction.current_price * 100).toFixed(1);
                const isPositive = change > 0;

                return (
                  <div key={pred.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <p className={`text-sm text-slate-500 mb-2 ${language === 'hi' ? 'hindi' : ''}`}>{pred.label}</p>
                    <p className="text-3xl font-bold text-[#0f172a] mb-2" style={{ fontFamily: 'monospace' }}>₹{pred.value}</p>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      isPositive ? 'text-[#22c55e]' : 'text-[#ef4444]'
                    }`}>
                      {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span>{isPositive ? '+' : ''}{change}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className={`text-sm text-amber-800 ${language === 'hi' ? 'hindi' : ''}`}>
                {t('Confidence:', 'विश्वास:')} {(prediction.confidence * 100).toFixed(0)}% • {t('Based on historical data and market trends', 'ऐतिहासिक डेटा और बाजार प्रवृत्तियों पर आधारित')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceIntelligence;
