import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Mic, Sprout, TrendingUp, MapPin, UserCheck, ShoppingCart, Languages, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();

  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  const handleLogin = () => {
    const redirectUrl = window.location.origin + '/auth/callback';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

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
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Languages className="h-5 w-5" />
                <span className="font-medium">{language === 'en' ? 'हिंदी' : 'English'}</span>
              </button>
              <button
                onClick={handleLogin}
                data-testid="nav-login-btn"
                className="bg-[#15803d] text-white hover:bg-[#166534] rounded-xl px-6 py-3 font-medium shadow-sm transition-all active:scale-95"
              >
                {t('Login', 'लॉगिन')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-b from-green-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#0f172a] mb-6 ${language === 'hi' ? 'hindi' : ''}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
                {t(
                  'Empowering Farmers with AI',
                  'किसानों को AI से सशक्त बनाना'
                )}
              </h1>
              <p className={`text-lg leading-relaxed text-slate-600 mb-8 ${language === 'hi' ? 'hindi' : ''}`}>
                {t(
                  'Connect directly with buyers, get real-time price insights, and grow your income with voice-first AI technology.',
                  'सीधे खरीदारों से जुड़ें, रीयल-टाइम मूल्य जानकारी पाएं, और वॉयस-फर्स्ट AI तकनीक से अपनी आय बढ़ाएं।'
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleLogin}
                  data-testid="hero-get-started-btn"
                  className="bg-[#15803d] text-white hover:bg-[#166534] rounded-xl px-8 py-4 font-medium shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {t('Get Started', 'शुरू करें')}
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  data-testid="hero-learn-more-btn"
                  className="bg-white text-[#15803d] border-2 border-[#15803d]/20 hover:border-[#15803d] hover:bg-green-50 rounded-xl px-8 py-4 font-medium transition-all"
                >
                  {t('Learn More', 'और जानें')}
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/7415326/pexels-photo-7415326.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt={t('Happy Indian farmer with smartphone', 'स्मार्टफोन के साथ खुश भारतीय किसान')}
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-semibold tracking-tight text-[#0f172a] mb-4 ${language === 'hi' ? 'hindi' : ''}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
              {t('Powerful Features for Farmers', 'किसानों के लिए शक्तिशाली सुविधाएँ')}
            </h2>
            <p className={`text-base leading-relaxed text-slate-600 max-w-2xl mx-auto ${language === 'hi' ? 'hindi' : ''}`}>
              {t(
                'Everything you need to sell directly and get fair prices',
                'सीधे बेचने और उचित मूल्य पाने के लिए आपको जो कुछ भी चाहिए'
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Mic,
                title: t('Voice Listing', 'वॉयस लिस्टिंग'),
                desc: t('List your crops using voice in Hindi or English', 'हिंदी या अंग्रेजी में वॉयस का उपयोग करके अपनी फसलें सूचीबद्ध करें'),
                color: 'text-[#15803d]',
                bg: 'bg-green-50'
              },
              {
                icon: TrendingUp,
                title: t('Price Intelligence', 'मूल्य जानकारी'),
                desc: t('Real-time mandi prices and AI predictions', 'रीयल-टाइम मंडी मूल्य और AI भविष्यवाणी'),
                color: 'text-[#d97706]',
                bg: 'bg-amber-50'
              },
              {
                icon: UserCheck,
                title: t('Verified Buyers', 'सत्यापित खरीदार'),
                desc: t('Connect with verified local wholesale buyers', 'सत्यापित स्थानीय थोक खरीदारों से जुड़ें'),
                color: 'text-[#3b82f6]',
                bg: 'bg-blue-50'
              },
              {
                icon: ShoppingCart,
                title: t('Direct Sales', 'सीधी बिक्री'),
                desc: t('Eliminate middlemen and increase profits', 'बिचौलियों को खत्म करें और मुनाफा बढ़ाएं'),
                color: 'text-[#22c55e]',
                bg: 'bg-green-50'
              },
              {
                icon: MapPin,
                title: t('Hyperlocal', 'हाइपरलोकल'),
                desc: t('District-level marketplace for faster connections', 'तेज़ कनेक्शन के लिए जिला स्तर का बाज़ार'),
                color: 'text-[#f59e0b]',
                bg: 'bg-amber-50'
              },
              {
                icon: Sprout,
                title: t('Quality Grading', 'गुणवत्ता ग्रेडिंग'),
                desc: t('AI-powered crop quality assessment', 'AI-संचालित फसल गुणवत्ता मूल्यांकन'),
                color: 'text-[#15803d]',
                bg: 'bg-green-50'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8"
              >
                <div className={`${feature.bg} ${feature.color} h-12 w-12 rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className={`text-xl md:text-2xl font-semibold text-[#0f172a] mb-2 ${language === 'hi' ? 'hindi' : ''}`}>
                  {feature.title}
                </h3>
                <p className={`text-base leading-relaxed text-slate-600 ${language === 'hi' ? 'hindi' : ''}`}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-white to-green-50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl text-center">
          <h2 className={`text-3xl md:text-4xl font-semibold tracking-tight text-[#0f172a] mb-6 ${language === 'hi' ? 'hindi' : ''}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
            {t('Ready to Transform Your Farming?', 'अपनी खेती को बदलने के लिए तैयार हैं?')}
          </h2>
          <p className={`text-lg leading-relaxed text-slate-600 mb-8 max-w-2xl mx-auto ${language === 'hi' ? 'hindi' : ''}`}>
            {t(
              'Join hundreds of farmers in Lucknow district who are earning more with KrishiSetuAI',
              'लखनऊ जिले के सैकड़ों किसानों से जुड़ें जो कृषिसेतु AI से अधिक कमा रहे हैं'
            )}
          </p>
          <button
            onClick={handleLogin}
            data-testid="cta-signup-btn"
            className="bg-[#15803d] text-white hover:bg-[#166534] rounded-xl px-8 py-4 font-medium shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
          >
            {t('Sign Up Now', 'अभी साइन अप करें')}
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      <footer className="bg-[#0f172a] text-white py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sprout className="h-8 w-8 text-[#22c55e]" />
            <span className="text-2xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {t('KrishiSetuAI', 'कृषिसेतु AI')}
            </span>
          </div>
          <p className={`text-slate-400 ${language === 'hi' ? 'hindi' : ''}`}>
            {t(
              '© 2026 KrishiSetuAI. Empowering farmers across India.',
              '© 2026 कृषिसेतु AI। भारत भर के किसानों को सशक्त बनाना।'
            )}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
