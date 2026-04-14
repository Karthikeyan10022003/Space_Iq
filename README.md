# Space IQ — Analytics Dashboard

A premium, enterprise-grade analytics dashboard for **The Hive Workspaces**, built with React + Node.js and powered by the Google Analytics 4 (GA4) Data API.

## Features

- 📊 **Live GA4 Analytics** — Realtime active users, page views, traffic sources, device breakdown, top pages, and countries
- 📣 **Google Ads** — Campaign performance: impressions, clicks, CTR, CPC, ROAS, conversions
- 📘 **Facebook Ads** — Meta Ads Manager: reach, placements, age breakdown, ad sets
- 💼 **LinkedIn Ads** — B2B lead generation: job functions, seniority mix, campaign CPL
- 🎨 **Premium dark UI** — Charcoal/black base with restrained red accent (`#E11D48`), built with Tailwind CSS + Recharts

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Tailwind CSS, Recharts |
| Backend | Node.js, Express |
| Analytics | Google Analytics 4 Data API (GA4) |
| Auth | Google OAuth2 |
| Build | Vite |

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Karthikeyan10022003/Space_Iq.git
cd Space_Iq
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Fill in your Google OAuth credentials in .env
```

### 3. Install dependencies
```bash
# Backend
npm install

# Frontend
cd client && npm install
```

### 4. Authenticate with Google
Start the backend and navigate to the auth URL:
```bash
npm run dev
# Visit: http://localhost:3001/auth/login
```

### 5. Start the frontend
```bash
cd client
npm run dev
# Visit: http://localhost:5173
```

## Environment Variables

See `.env.example` for required variables:

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
REDIRECT_URI=http://localhost:3001/auth/callback
GA4_PROPERTY_ID=
PORT=3001
```

## Project Structure

```
space_iq/
├── server.js              # Express backend + GA4 API routes
├── .env                   # Secrets (gitignored)
├── .env.example           # Template
└── client/
    └── src/
        ├── pages/         # AnalyticsPage, GoogleAdsPage, FacebookAdsPage, LinkedInPage
        ├── components/
        │   ├── analytics/ # KPICards, Charts, Tables
        │   ├── layout/    # Sidebar, TopHeader
        │   └── ui/        # Skeleton, ErrorState
        └── hooks/         # useRealtimeData
```
