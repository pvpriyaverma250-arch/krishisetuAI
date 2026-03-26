import React, { useState } from 'react';
import { Mic, X, Loader2, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const VoiceAssistant = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${API}/ai/chat`,
        { message: input, language },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('session_token')}`
          }
        }
      );

      const aiMessage = { role: 'assistant', content: response.data.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(t('Failed to send message', 'संदेश भेजने में विफल'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
      )}

      {isOpen && (
        <div className="fixed bottom-24 right-6 md:bottom-28 md:right-8 w-[90vw] sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col max-h-[70vh]">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h3 className={`font-semibold text-[#0f172a] ${language === 'hi' ? 'hindi' : ''}`}>
              {t('KrishiSetu AI Assistant', 'कृषिसेतु AI सहायक')}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              data-testid="close-assistant-btn"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
            {messages.length === 0 ? (
              <div className={`text-center text-slate-500 py-8 ${language === 'hi' ? 'hindi' : ''}`}>
                {t(
                  'Ask me anything about farming, prices, or marketplace!',
                  'खेती, मूल्य, या बाजार के बारे में कुछ भी पूछें!'
                )}
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-[#15803d] text-white'
                        : 'bg-slate-100 text-[#0f172a]'
                    } ${language === 'hi' ? 'hindi' : ''}`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-xl px-4 py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-[#15803d]" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={t('Type your message...', 'अपना संदेश लिखें...')}
                data-testid="chat-input"
                className={`flex-1 h-10 px-3 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-all ${language === 'hi' ? 'hindi' : ''}`}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                data-testid="send-message-btn"
                className="bg-[#15803d] text-white hover:bg-[#166534] rounded-lg px-4 py-2 font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        data-testid="voice-assistant-fab"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 h-16 w-16 rounded-full bg-[#15803d] shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Mic className="text-white h-8 w-8" />
      </button>
    </>
  );
};

export default VoiceAssistant;
