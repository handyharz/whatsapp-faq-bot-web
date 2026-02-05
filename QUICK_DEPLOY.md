# Quick Deployment Guide

## What We're Deploying

### ✅ Deploy to Vercel: `whatsapp-faq-bot-web`
- Landing page + onboarding form
- Perfect for Vercel (Next.js)
- **Free hosting**
- Get domain → verify in Resend

### ⏸️ Deploy Later: `whatsapp-faq-bot`
- The actual WhatsApp bot
- Needs 24/7 service (VPS/Railway/Render)
- **NOT Vercel** (Vercel is serverless, bot needs to run continuously)
- We'll handle this after web UI is working

## Step 1: Create GitHub Repo for Web UI

### Option A: Using GitHub CLI (Fastest)

```bash
cd /Users/harz/openclaw/whatsapp-faq-bot-web

# Install GitHub CLI if needed: brew install gh

# Login (will prompt for token)
gh auth login --with-token <<< "YOUR_TOKEN"

# Create repo and push
gh repo create whatsapp-faq-bot-web --public --source=. --remote=origin --push
```

### Option B: Manual (GitHub Website)

1. Go to https://github.com/new
2. Repository name: `whatsapp-faq-bot-web`
3. Description: "WhatsApp FAQ Bot - Landing Page & Onboarding"
4. Public
5. **Don't** initialize with README/license
6. Click "Create repository"

Then run:
```bash
cd /Users/harz/openclaw/whatsapp-faq-bot-web
git init
git add .
git commit -m "Initial commit: WhatsApp FAQ Bot Web UI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/whatsapp-faq-bot-web.git
git push -u origin main
```

## Step 2: Deploy to Vercel

1. **Go to https://vercel.com**
2. **Sign up/Login** (use GitHub account)
3. **Click "Add New Project"**
4. **Import `whatsapp-faq-bot-web` repo**
5. **Vercel auto-detects Next.js** - just click "Deploy"
6. **Wait for deployment** (~2 minutes)

## Step 3: Add Environment Variables

1. In Vercel dashboard, go to your project
2. **Settings → Environment Variables**
3. Add these:
   ```
   RESEND_API_KEY = re_xxxxx
   YOUR_EMAIL = your@email.com
   RESEND_FROM = WhatsApp FAQ Bot <onboard@yourdomain.com>
   ```
4. **Important:** After adding, go to **Deployments → Latest → Redeploy**

## Step 4: Get Your Domain

### Option A: Use Vercel's Free Domain (Quick Test)
- After deployment: `whatsapp-faq-bot-web.vercel.app`
- **Problem:** Can't verify `vercel.app` in Resend (not your domain)
- **Solution:** Use custom domain (see Option B)

### Option B: Use Custom Domain (Recommended)

1. **Buy domain** (Namecheap, GoDaddy, etc.) - ~₦2,000-5,000/year
   - Example: `whatsappfaqbot.com` or `faqbot.ng`
2. **In Vercel:** Settings → Domains
3. **Add your domain**
4. **Add DNS records** Vercel provides:
   - A record: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`
5. **Wait for verification** (5-10 minutes)

## Step 5: Verify Domain in Resend

1. **Go to https://resend.com/domains**
2. **Click "Add Domain"**
3. **Enter your custom domain** (e.g., `whatsappfaqbot.com`)
4. **Add DNS records** Resend provides:
   - SPF record (TXT)
   - DKIM records (3 TXT records)
5. **Wait for verification** (5-10 minutes)
6. **Update Vercel env var:**
   ```
   RESEND_FROM = WhatsApp FAQ Bot <onboard@whatsappfaqbot.com>
   ```
7. **Redeploy** in Vercel

## Step 6: Test!

1. Visit your deployed site
2. Fill onboarding form
3. Submit
4. Check email inbox! ✅

## About the Bot (`whatsapp-faq-bot`)

**Don't deploy to Vercel** - it needs to run 24/7.

**Options:**
- **Railway** (easiest) - Free tier, then ~$5/month
- **Render** - Free tier, then ~$7/month  
- **VPS** (DigitalOcean) - ₦5,000-10,000/month
- **Fly.io** - Good for long-running processes

**We'll handle bot deployment later** - focus on web UI first!

## Docker? 

**Not needed for Vercel** - Vercel handles everything.

**For bot:** Docker is optional but helpful for:
- Consistent environment
- Easy deployment to Railway/Render
- We can add it later if needed

## Quick Commands Summary

```bash
# 1. Create and push to GitHub
cd /Users/harz/openclaw/whatsapp-faq-bot-web
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/whatsapp-faq-bot-web.git
git push -u origin main

# 2. Then deploy via Vercel dashboard (import from GitHub)
```

---

**Let's start!** Create the GitHub repo first, then deploy to Vercel! 🚀
