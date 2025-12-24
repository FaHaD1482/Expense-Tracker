# Deployment Guide - Expense Tracker

This guide will walk you through deploying your Expense Tracker application using **Vercel** (frontend) and **Render** (backend), both on their free tiers.

## 📋 Prerequisites

Before you begin, make sure you have:

1. ✅ A GitHub account
2. ✅ Your code pushed to a GitHub repository
3. ✅ Firebase project credentials (already configured)
4. ✅ Firebase service account key file (`serviceAccountKey.json`)

---

## 🚀 Part 1: Deploy Backend to Render (Free Tier)

### Step 1: Create a Render Account

1. Go to [https://render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up using your **GitHub account** (recommended for easy integration)
4. Verify your email address

### Step 2: Prepare Your Repository

Before deploying, make sure your code is pushed to GitHub:

```bash
# Navigate to your project root
cd "d:\Coding\Intern Project\Expense Tracker"

# Add all files
git add .

# Commit changes
git commit -m "Prepare for deployment with environment variables"

# Push to GitHub
git push origin main
```

### Step 3: Create a New Web Service on Render

1. **Log in to Render Dashboard**: [https://dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** button (top right)
3. Select **"Web Service"**
4. Click **"Connect a repository"**
5. **Authorize Render** to access your GitHub account
6. **Select your repository**: `Expense-Tracker` (or whatever you named it)
7. Click **"Connect"**

### Step 4: Configure the Web Service

Fill in the following settings:

| Field | Value |
|-------|-------|
| **Name** | `expense-tracker-api` (or any name you prefer) |
| **Region** | Choose closest to you (e.g., Singapore, Oregon) |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | **Free** |

### Step 5: Add Environment Variables

Scroll down to the **"Environment Variables"** section:

1. Click **"Add Environment Variable"**
2. Add the following variable:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |

### Step 6: Upload Firebase Service Account

This is the most important step for backend authentication:

1. In the **Environment Variables** section, click **"Add Secret File"**
2. **Filename**: `serviceAccountKey.json`
3. **Contents**: Open your local `server/src/config/serviceAccountKey.json` file and **copy the entire JSON content**
4. Paste it into the text area
5. Click **"Save"**

### Step 7: Deploy

1. Click **"Create Web Service"** at the bottom
2. Render will start building and deploying your backend
3. Wait for the deployment to complete (usually 2-5 minutes)
4. You'll see **"Live"** with a green indicator when it's ready

### Step 8: Get Your Backend URL

1. Once deployed, you'll see your service URL at the top: `https://expense-tracker-api-xxxx.onrender.com`
2. **Copy this URL** - you'll need it for the frontend deployment
3. Test your backend by visiting: `https://your-backend-url.onrender.com/api/health`
4. You should see: `{"status":"ok","message":"Server is running"}`

> [!IMPORTANT]
> **Free Tier Note**: Render's free tier will spin down your service after 15 minutes of inactivity. It will automatically spin back up when a request comes in (takes ~30 seconds). This is normal for the free tier.

---

## 🎨 Part 2: Deploy Frontend to Vercel (Free Tier)

### Step 1: Create a Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Project

1. From the Vercel Dashboard, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **"Expense-Tracker"** and click **"Import"**

### Step 3: Configure Project Settings

Vercel will auto-detect that it's a Vite project. Configure as follows:

| Field | Value |
|-------|-------|
| **Framework Preset** | `Vite` (should be auto-detected) |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` (auto-filled) |
| **Output Directory** | `dist` (auto-filled) |

### Step 4: Add Environment Variables

This is **crucial** - click on **"Environment Variables"** and add the following:

| Name | Value |
|------|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyAkG7nSB7wkMFKPWSMX0WsAupX0B6mzTlg` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `expense-tracker-692d1.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `expense-tracker-692d1` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `expense-tracker-692d1.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `926628737720` |
| `VITE_FIREBASE_APP_ID` | `1:926628737720:web:980479651650feecc57a4d` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-B95LV210GJ` |
| `VITE_API_BASE_URL` | `https://your-backend-url.onrender.com/api` |

> [!WARNING]
> **Replace** `https://your-backend-url.onrender.com/api` with your **actual Render backend URL** from Part 1, Step 8. Make sure to include `/api` at the end!

**How to add each variable:**
1. Type the **Name** in the first field
2. Type the **Value** in the second field
3. Click **"Add"**
4. Repeat for all variables

### Step 5: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your frontend (takes 1-3 minutes)
3. You'll see a success screen with confetti 🎉
4. Click **"Visit"** to see your live application

### Step 6: Get Your Frontend URL

1. Your app will be live at: `https://expense-tracker-xxxx.vercel.app`
2. Vercel also provides a production URL that you can customize

---

## ✅ Part 3: Test Your Deployed Application

### 1. Visit Your Frontend URL

Open `https://your-app.vercel.app` in your browser

### 2. Test Authentication

1. Click **"Sign Up"** or **"Login"**
2. Create a new account or log in with existing credentials
3. Verify you can successfully authenticate

### 3. Test Functionality

1. **Add a transaction**: Click "Add Transaction" and create a new income/expense
2. **View dashboard**: Check that your transaction appears on the dashboard
3. **Delete a transaction**: Try deleting a transaction
4. **Check balance**: Verify the balance calculations are correct

### 4. Check Browser Console

1. Press `F12` to open Developer Tools
2. Go to the **Console** tab
3. Make sure there are no errors (especially network errors)

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Backend health check fails
- **Solution**: Check Render logs in the dashboard. Make sure `serviceAccountKey.json` was uploaded correctly.

**Problem**: "Service Unavailable" error
- **Solution**: Free tier services spin down after inactivity. Wait 30 seconds and try again.

### Frontend Issues

**Problem**: "Firebase: Error (auth/invalid-api-key)"
- **Solution**: Double-check all Firebase environment variables in Vercel settings.

**Problem**: "Network Error" when adding transactions
- **Solution**: Verify `VITE_API_BASE_URL` points to your correct Render backend URL with `/api` at the end.

**Problem**: Blank page after deployment
- **Solution**: Check Vercel deployment logs. Make sure all environment variables are set correctly.

---

## 🔄 Updating Your Deployment

### Update Backend (Render)

Render automatically redeploys when you push to GitHub:

```bash
# Make your changes to the server code
git add .
git commit -m "Update backend"
git push origin main
```

Render will automatically detect the changes and redeploy.

### Update Frontend (Vercel)

Vercel also automatically redeploys on git push:

```bash
# Make your changes to the client code
git add .
git commit -m "Update frontend"
git push origin main
```

Vercel will automatically rebuild and redeploy.

---

## 📊 Monitoring Your Application

### Render Dashboard
- View logs: [https://dashboard.render.com](https://dashboard.render.com)
- Check service status
- Monitor resource usage

### Vercel Dashboard
- View deployment history: [https://vercel.com/dashboard](https://vercel.com/dashboard)
- Check build logs
- Monitor analytics

---

## 💰 Free Tier Limits

### Render Free Tier
- ✅ 750 hours/month (enough for 24/7 uptime)
- ✅ Automatic SSL
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ 512 MB RAM

### Vercel Free Tier
- ✅ Unlimited deployments
- ✅ Automatic SSL
- ✅ 100 GB bandwidth/month
- ✅ Always online (no spin-down)

---

## 🎉 Congratulations!

Your Expense Tracker is now live and accessible from anywhere in the world! 🌍

**Frontend**: `https://your-app.vercel.app`  
**Backend**: `https://your-api.onrender.com`

Both services are running on free tiers and will stay online 24/7 (with Render's minor spin-down delay on free tier).
