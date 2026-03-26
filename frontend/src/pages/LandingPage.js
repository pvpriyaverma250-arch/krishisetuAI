import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Mic, Sprout, TrendingUp, MapPin, UserCheck, ShoppingCart, Languages, ChevronRight, Zap, Shield, BarChart3, Users, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();

  const handleLogin = () => {
    const redirectUrl = window.location.origin + '/auth/callback';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-green-200/40 to-green-300/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-orange-200/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-green-100/50 to-emerald-200/30 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-xl border-b border-white/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <Sprout className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {t('KrishiSetuAI', 'कृषिसेतु AI')}
              </span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={toggleLanguage}
                data-testid="language-toggle-btn"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all duration-300"
              >
                <Languages className="h-5 w-5 text-slate-600" />
                <span className="font-medium text-slate-700">{language === 'en' ? 'हिंदी' : 'EN'}</span>
              </button>
              <button
                onClick={handleLogin}
                data-testid="nav-login-btn"
                className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 rounded-xl px-6 py-3 font-semibold shadow-lg shadow-green-600/30 hover:shadow-green-600/40 transition-all duration-300 active:scale-95"
              >
                {t('Get Started', 'शुरू करें')}
              </button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200 mb-6"
              >
                <Zap className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {t('AI-Powered Agriculture', 'AI-संचालित कृषि')}
                </span>
              </motion.div>
              
              <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#0f172a] mb-6 leading-[1.1] ${language === 'hi' ? 'hindi' : ''}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
                {t('Empowering', 'किसानों को')}
                <span className="block bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                  {t('Farmers', 'सशक्त बनाना')}
                </span>
                {t('with AI', 'AI के साथ')}
              </h1>
              
              <p className={`text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl ${language === 'hi' ? 'hindi' : ''}`}>
                {t(
                  'Connect directly with buyers, get real-time mandi prices, and boost your income with voice-first AI technology.',
                  'सीधे खरीदारों से जुड़ें, रीयल-टाइम मंडी भाव पाएं, और वॉयस-फर्स्ट AI तकनीक से अपनी आय बढ़ाएं।'
                )}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogin}
                  data-testid="hero-get-started-btn"
                  className="group bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl px-8 py-4 font-semibold text-lg shadow-xl shadow-green-600/30 hover:shadow-green-600/50 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  {t('Start Free', 'मुफ्त शुरू करें')}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  data-testid="hero-learn-more-btn"
                  className="bg-white/80 backdrop-blur-sm text-slate-700 border-2 border-slate-200 hover:border-green-300 hover:bg-green-50/50 rounded-2xl px-8 py-4 font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {t('See Features', 'सुविधाएं देखें')}
                </motion.button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 mt-10 pt-10 border-t border-slate-200">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white flex items-center justify-center text-white font-bold text-sm">
                      {['R', 'S', 'A', 'K'][i-1]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-sm text-slate-600">{t('500+ farmers trust us', '500+ किसान हम पर भरोसा करते हैं')}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Glassmorphism Card */}
              <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl shadow-slate-200/50 p-3 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/2519332/pexels-photo-2519332.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt={t('Indian farmer', 'भारतीय किसान')}
                  className="rounded-2xl w-full h-auto object-cover"
                />
                
                {/* Floating Stats Card */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -left-6 bottom-20 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">₹2,150</p>
                      <p className="text-xs text-slate-500">{t('Wheat/Quintal', 'गेहूं/क्विंटल')}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Voice Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -right-4 top-20 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl px-4 py-3 shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    <span className="font-medium text-sm">{t('Voice Enabled', 'वॉयस सक्षम')}</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 bg-gradient-to-r from-green-800 via-green-700 to-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: '500+', label: t('Active Farmers', 'सक्रिय किसान') },
              { value: '₹2Cr+', label: t('Trade Value', 'व्यापार मूल्य') },
              { value: '3', label: t('Crops Supported', 'फसलें समर्थित') },
              { value: '24/7', label: t('AI Support', 'AI सहायता') }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <p className="text-4xl sm:text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{stat.value}</p>
                <p className={`text-green-200 text-sm ${language === 'hi' ? 'hindi' : ''}`}>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm mb-4">
              {t('FEATURES', 'सुविधाएं')}
            </span>
            <h2 className={`text-4xl sm:text-5xl font-bold text-[#0f172a] mb-6 ${language === 'hi' ? 'hindi' : ''}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
              {t('Everything You Need', 'आपको जो कुछ भी चाहिए')}
            </h2>
            <p className={`text-lg text-slate-600 max-w-2xl mx-auto ${language === 'hi' ? 'hindi' : ''}`}>
              {t('Powerful tools designed for Indian farmers', 'भारतीय किसानों के लिए शक्तिशाली उपकरण')}
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {[
              {
                icon: Mic,
                title: t('Voice Listing', 'वॉयस लिस्टिंग'),
                desc: t('List crops using your voice in Hindi or English', 'हिंदी या अंग्रेजी में अपनी आवाज से फसल सूचीबद्ध करें'),
                gradient: 'from-green-500 to-emerald-600',
                glow: 'shadow-green-500/25'
              },
              {
                icon: TrendingUp,
                title: t('Live Prices', 'लाइव भाव'),
                desc: t('Real-time mandi prices with AI predictions', 'AI भविष्यवाणी के साथ रीयल-टाइम मंडी भाव'),
                gradient: 'from-amber-500 to-orange-600',
                glow: 'shadow-amber-500/25'
              },
              {
                icon: UserCheck,
                title: t('Verified Buyers', 'सत्यापित खरीदार'),
                desc: t('Connect with trusted local wholesale buyers', 'विश्वसनीय स्थानीय थोक खरीदारों से जुड़ें'),
                gradient: 'from-blue-500 to-indigo-600',
                glow: 'shadow-blue-500/25'
              },
              {
                icon: ShoppingCart,
                title: t('Direct Sales', 'सीधी बिक्री'),
                desc: t('No middlemen, better profits for you', 'कोई बिचौलिया नहीं, आपके लिए बेहतर मुनाफा'),
                gradient: 'from-purple-500 to-violet-600',
                glow: 'shadow-purple-500/25'
              },
              {
                icon: MapPin,
                title: t('Hyperlocal', 'हाइपरलोकल'),
                desc: t('District-level marketplace in Lucknow', 'लखनऊ में जिला स्तरीय बाज़ार'),
                gradient: 'from-rose-500 to-pink-600',
                glow: 'shadow-rose-500/25'
              },
              {
                icon: Shield,
                title: t('Quality Grading', 'गुणवत्ता ग्रेडिंग'),
                desc: t('AI-powered crop quality assessment', 'AI-संचालित फसल गुणवत्ता मूल्यांकन'),
                gradient: 'from-teal-500 to-cyan-600',
                glow: 'shadow-teal-500/25'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`group bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl p-8 transition-all duration-300`}
              >
                <div className={`h-14 w-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${feature.glow} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className={`text-xl font-bold text-[#0f172a] mb-3 ${language === 'hi' ? 'hindi' : ''}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {feature.title}
                </h3>
                <p className={`text-slate-600 leading-relaxed ${language === 'hi' ? 'hindi' : ''}`}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 rounded-[2.5rem] overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
            </div>
            
            <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center">
              <h2 className={`text-4xl sm:text-5xl font-bold text-white mb-6 ${language === 'hi' ? 'hindi' : ''}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
                {t('Ready to Grow Your Income?', 'अपनी आय बढ़ाने के लिए तैयार हैं?')}
              </h2>
              <p className={`text-lg text-green-100 mb-10 max-w-2xl mx-auto ${language === 'hi' ? 'hindi' : ''}`}>
                {t(
                  'Join hundreds of farmers in Lucknow who are already earning more with KrishiSetuAI',
                  'लखनऊ के सैकड़ों किसानों से जुड़ें जो पहले से कृषिसेतु AI से अधिक कमा रहे हैं'
                )}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogin}
                data-testid="cta-signup-btn"
                className="bg-white text-green-700 hover:bg-green-50 rounded-2xl px-10 py-5 font-bold text-lg shadow-2xl transition-all duration-300 inline-flex items-center gap-3"
              >
                {t('Start Free Today', 'आज ही मुफ्त शुरू करें')}
                <ChevronRight className="h-6 w-6" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#0f172a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center">
                <Sprout className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {t('KrishiSetuAI', 'कृषिसेतु AI')}
              </span>
            </div>
            <p className={`text-slate-400 text-center ${language === 'hi' ? 'hindi' : ''}`}>
              {t(
                '© 2026 KrishiSetuAI. Empowering farmers across India.',
                '© 2026 कृषिसेतु AI। भारत भर के किसानों को सशक्त बनाना।'
              )}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
