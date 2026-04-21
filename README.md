# Space-IQ: Unified Deployment Guide

Your project has been reorganized into a **Vercel "Golden Path"** structure. This setup ensures that your React frontend and Node.js backend work together perfectly on a single Vercel project.

## 🚀 Step-by-Step Fresh Deployment

Follow these steps exactly to host your app freshly on Vercel:

### 1. Push Your Code
Commit and push the latest changes to your GitHub repository.
```bash
git add .
git commit -m "Clean slate: Unified project structure"
git push
```

### 2. Create a NEW Project in Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New... > Project**.
3. Import your GitHub repository.

### 3. Configure the Fresh Build
On the "Configure Project" screen, ensure these settings are used:
- **Framework Preset**: Vite
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 4. Set Environment Variables
Add these variables in the **Environment Variables** section:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GA4_PROPERTY_ID`
- `REDIRECT_URI`: `https://space-iq-iota.vercel.app/auth/callback`

### 5. Deploy!
Click **Deploy**. 

---

## ✅ Why this works:
- **Unified Domain**: Frontend and Backend share the same URL, preventing CORS errors.
- **Auto-Routing**: Vercel handles the `/api` folder automatically as a backend.
- **OAuth Safety**: The login redirect will now always match between your local env and production.
