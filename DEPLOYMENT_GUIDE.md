# Deployment Guide

## What to Deploy Where

### 1. Web UI (`whatsapp-faq-bot-web`) → **Vercel** ✅
- **What:** Next.js landing page + onboarding form
- **Why Vercel:** Free, perfect for Next.js, automatic deployments
- **Domain:** Use Vercel's free domain or your custom domain
- **Resend:** Verify domain in Resend to send emails from your domain

### 2. WhatsApp Bot (`whatsapp-faq-bot`) → **VPS/24/7 Service** ⚠️
- **What:** The actual WhatsApp bot that runs 24/7
- **Why NOT Vercel:** Vercel is serverless (runs on demand). Bots need to run continuously.
- **Options:**
  - **VPS** (DigitalOcean, Linode, etc.) - ₦5,000-10,000/month
  - **Railway** - Free tier available, then ~$5/month
  - **Render** - Free tier, then ~$7/month
  - **Fly.io** - Good for long-running processes
- **Docker:** Optional but recommended for easier deployment

## Step 1: Create GitHub Repos

### Option A: Two Separate Repos (Recommended)

**Repo 1: `whatsapp-faq-bot-web`**
```bash
cd /Users/harz/openclaw/whatsapp-faq-bot-web
git init
git add .
git commit -m "Initial commit: WhatsApp FAQ Bot Web UI"
git branch -M main
git remote add origin https://github.com/handyharz/whatsapp-faq-bot-web.git
git push -u origin main
```

**Repo 2: `whatsapp-faq-bot`**
```bash
cd /Users/harz/openclaw/whatsapp-faq-bot
git init
git add .
git commit -m "Initial commit: WhatsApp FAQ Bot"
git branch -M main
git remote add origin https://github.com/handyharz/whatsapp-faq-bot-web.git
git push -u origin main
```

### Option B: Monorepo (Both in One Repo)

```bash
cd /Users/harz/openclaw
git init
git add .
git commit -m "Initial commit: WhatsApp FAQ Bot Platform"
git branch -M main
git remote add origin https://github.com/handyharz/whatsapp-faq-bot-web.git
git push -u origin main
```

**Recommendation:** Use **Option A** (separate repos) - easier to manage, deploy independently.

## Step 2: Deploy Web UI to Vercel

### 2.1 Create GitHub Repo First

1. Go to https://github.com/new
2. Create repo: `whatsapp-faq-bot-web`
3. **Don't** initialize with README (we already have files)

### 2.2 Push Code to GitHub

```bash
cd /Users/harz/openclaw/whatsapp-faq-bot-web

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: WhatsApp FAQ Bot Web UI"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/whatsapp-faq-bot-web.git

# Push
git branch -M main
git push -u origin main
```

### 2.3 Deploy to Vercel

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import `whatsapp-faq-bot-web` repo
5. Vercel auto-detects Next.js - click "Deploy"
6. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     RESEND_API_KEY=re_xxxxx
     YOUR_EMAIL=your@email.com
     RESEND_FROM=WhatsApp FAQ Bot <onboard@yourdomain.com>
     ```
7. Redeploy (Settings → Deployments → Redeploy)

### 2.4 Get Your Domain

**Option A: Use Vercel's Free Domain**
- After deployment, you'll get: `whatsapp-faq-bot-web.vercel.app`
- Use this to verify in Resend

**Option B: Use Custom Domain**
- In Vercel: Settings → Domains
- Add your domain (e.g., `whatsappfaqbot.com`)
- Add DNS records Vercel provides
- Wait for verification

## Step 3: Verify Domain in Resend

1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter your domain (from Vercel):
   - If using Vercel free: `vercel.app` (but this won't work - need custom domain)
   - If using custom: `yourdomain.com`
4. Add DNS records Resend provides:
   - SPF record
   - DKIM records (3 TXT records)
5. Wait for verification (5-10 minutes)
6. Update `.env.local` in Vercel:
   ```
   RESEND_FROM=WhatsApp FAQ Bot <onboard@yourdomain.com>
   ```
7. Redeploy

## Step 4: Deploy Bot (Later - Not Now)

The bot needs to run 24/7. Options:

### Option A: VPS (Recommended for Production)

1. Get VPS (DigitalOcean, Linode, etc.)
2. SSH into server
3. Install Node.js
4. Clone repo
5. Install dependencies
6. Run with PM2 or systemd

### Option B: Railway (Easiest)

1. Go to https://railway.app
2. Connect GitHub
3. Deploy `whatsapp-faq-bot` repo
4. Add environment variables
5. Deploy

### Option C: Docker (Optional)

Create `Dockerfile` in `whatsapp-faq-bot/`:
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

Then deploy to Railway/Render/Fly.io

## Current Priority: Deploy Web UI First

**Right now, focus on:**
1. ✅ Create GitHub repo for `whatsapp-faq-bot-web`
2. ✅ Deploy to Vercel
3. ✅ Get domain (custom or Vercel's)
4. ✅ Verify domain in Resend
5. ✅ Update email from address
6. ✅ Test form submission

**Bot deployment can wait** - you can test the web UI and form first!

## Quick Start Commands

```bash
# 1. Create GitHub repo for web UI
cd /Users/harz/openclaw/whatsapp-faq-bot-web
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/whatsapp-faq-bot-web.git
git push -u origin main

# 2. Then deploy via Vercel dashboard (import from GitHub)
```

## Environment Variables for Vercel

Add these in Vercel dashboard (Project → Settings → Environment Variables):

```
RESEND_API_KEY=re_xxxxx
YOUR_EMAIL=your@email.com
RESEND_FROM=WhatsApp FAQ Bot <onboard@yourdomain.com>
```

**Note:** After adding env vars, you need to **redeploy** for them to take effect!

---

**Let's start with the web UI deployment!** 🚀
