# WhatsApp FAQ Bot - Web UI

Beautiful landing page and onboarding form for WhatsApp FAQ Bot service, inspired by Resend's sleek design.

## Features

- 🎨 **Resend-inspired Design** - Clean, modern, dark theme
- 📱 **Fully Responsive** - Works on all devices
- ⚡ **Fast & Optimized** - Built with Next.js 15
- 📧 **Email Notifications** - Integrated with Resend API
- 🎯 **SEO Optimized** - Proper meta tags and structure

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Lucide React** - Beautiful icons
- **Resend** - Email notifications
- **Custom CSS** - Resend-inspired styling

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env.local`:**
   ```env
   RESEND_API_KEY=re_xxxxx
   YOUR_EMAIL=your@email.com
   RESEND_FROM=WhatsApp FAQ Bot <onboard@yourdomain.com>
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Visit:** http://localhost:3000

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

See `QUICK_DEPLOY.md` in the parent directory for detailed instructions.

## Project Structure

```
app/
  ├── layout.tsx          # Root layout
  ├── page.tsx            # Landing page
  ├── globals.css         # Global styles (Resend-inspired)
  ├── onboard/
  │   └── page.tsx        # Onboarding form
  └── api/
      └── onboard/
          └── route.ts    # Form submission API
```

## Environment Variables

- `RESEND_API_KEY` - Your Resend API key
- `YOUR_EMAIL` - Email to receive form submissions
- `RESEND_FROM` - Email address to send from (must be verified domain)

## License

MIT
