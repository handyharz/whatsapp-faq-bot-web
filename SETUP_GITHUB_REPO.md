# Setup GitHub Repo for Deployment

## Current Situation

Your `whatsapp-faq-bot-web` folder is currently part of the main `openclaw` repo. For deployment, we need a **separate repo**.

## Option 1: Create New Repo (Recommended)

### Step 1: Create Repo on GitHub

1. Go to https://github.com/new
2. Repository name: `whatsapp-faq-bot-web`
3. Description: "WhatsApp FAQ Bot - Landing Page & Onboarding"
4. **Public** (or Private if you prefer)
5. **Don't** initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 2: Initialize and Push

```bash
cd /Users/harz/openclaw/whatsapp-faq-bot-web

# Remove existing git connection (if any)
rm -rf .git

# Initialize new repo
git init
git add .
git commit -m "Initial commit: WhatsApp FAQ Bot Web UI"

# Add your new repo as remote
git remote add origin https://github.com/YOUR_USERNAME/whatsapp-faq-bot-web.git

# Push
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username!**

### Step 3: Use GitHub Token (if needed)

If you get authentication errors, use your token:

```bash
# Option A: Use token in URL
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/whatsapp-faq-bot-web.git

# Option B: Use GitHub CLI
gh auth login --with-token <<< "YOUR_TOKEN"
```

## Option 2: Use GitHub CLI (Easier)

```bash
cd /Users/harz/openclaw/whatsapp-faq-bot-web

# Remove existing git
rm -rf .git

# Initialize
git init
git add .
git commit -m "Initial commit"

# Create repo and push (one command!)
gh repo create whatsapp-faq-bot-web --public --source=. --remote=origin --push
```

**Note:** You may need to install GitHub CLI first:
```bash
brew install gh
gh auth login
```

## After Creating Repo

Once pushed to GitHub:

1. **Go to Vercel**: https://vercel.com
2. **Import Project** → Select `whatsapp-faq-bot-web`
3. **Deploy!**

## For the Bot (`whatsapp-faq-bot`)

Same process, but create repo: `whatsapp-faq-bot`

```bash
cd /Users/harz/openclaw/whatsapp-faq-bot
rm -rf .git
git init
git add .
git commit -m "Initial commit: WhatsApp FAQ Bot"
gh repo create whatsapp-faq-bot --public --source=. --remote=origin --push
```

---

**Ready?** Create the GitHub repo first, then we'll deploy to Vercel! 🚀
