# KrishiSetuAI - Product Requirements Document

## Original Problem Statement
Create a modern, fully working AI-powered agricultural marketplace website (KrishiSetuAI) that connects farmers directly with buyers, eliminating middlemen.

## Architecture
- **Frontend**: React 18 with Tailwind CSS, Framer Motion, Recharts, Lucide icons
- **Backend**: FastAPI with Python 3.11
- **Database**: MongoDB
- **Storage**: Emergent Object Storage for crop images
- **Auth**: Emergent-managed Google OAuth
- **AI**: GPT-5.2 (via Emergent LLM Key) for chat, descriptions

## User Personas
1. **Farmer (किसान)**: Small/marginal farmers in Lucknow district, low digital literacy, voice-first
2. **Buyer (खरीदार)**: Local wholesale buyers, looking for quality crops at fair prices

## Core Requirements (Static)
- Voice-enabled crop listing in Hindi/English
- Real-time mandi price display (Wheat, Rice, Potato - Lucknow)
- AI-powered price predictions and trends
- Image-based crop quality grading
- Buyer-farmer matching
- Bilingual interface (Hindi/English)

## What's Been Implemented (March 2026)
### Backend APIs
- ✅ Authentication (Google OAuth via Emergent, JWT sessions)
- ✅ User profile CRUD with role selection (farmer/buyer)
- ✅ Crop listings CRUD
- ✅ Price Intelligence APIs (current prices, trends, predictions - MOCK DATA)
- ✅ AI Chat with GPT-5.2
- ✅ AI Description Generation
- ✅ Object Storage for crop images

### Frontend Pages
- ✅ Landing Page (bilingual, hero, features, CTA)
- ✅ Auth Callback (handles Google OAuth)
- ✅ Role Selection (farmer/buyer with location)
- ✅ Farmer Dashboard (stats, listings, quick actions)
- ✅ Buyer Dashboard (available crops, search, prices)
- ✅ Marketplace (crop grid with filters)
- ✅ Add Crop (form with AI description generation)
- ✅ Crop Details (full info, contact farmer)
- ✅ Price Intelligence (charts, predictions)
- ✅ Profile (edit location, phone)
- ✅ Voice Assistant FAB (AI chat)

### Design
- Fresh green (#15803d) + Earth tones color palette
- Outfit + Manrope + Noto Sans Devanagari fonts
- Mobile-first responsive design
- Accessible large buttons and clear icons

## Prioritized Backlog

### P0 (Critical - Next Sprint)
- [ ] Real Agmarknet API integration for live prices
- [ ] OpenAI Whisper integration for voice-to-text
- [ ] GPT Image 1 for crop quality grading
- [ ] WhatsApp/SMS notifications for farmers

### P1 (High Priority)
- [ ] Buyer preference matching algorithm
- [ ] Crop image gallery with multiple photos
- [ ] Farmer verification badge system
- [ ] Push notifications
- [ ] Transaction history

### P2 (Medium Priority)
- [ ] Payment integration (Razorpay)
- [ ] Review/rating system
- [ ] Analytics dashboard
- [ ] Multi-district expansion

## Next Tasks
1. Integrate real Agmarknet API for live Lucknow mandi prices
2. Implement OpenAI Whisper for voice input on AddCrop page
3. Add GPT Image 1 for automatic crop quality grading
4. Enable farmer-buyer direct messaging
