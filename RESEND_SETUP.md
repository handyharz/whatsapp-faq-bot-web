# Resend Domain Setup for exonec.com

## Domain Information
- **Domain:** `exonec.com`
- **Status:** Already connected to Vercel ✅
- **Use for:** Resend email sending

## Step 1: Verify Domain in Resend

1. **Go to Resend Dashboard:**
   - Visit https://resend.com/domains
   - Click "Add Domain"

2. **Enter Your Domain:**
   - Domain: `exonec.com` (without www)
   - Click "Add Domain"

3. **Add DNS Records:**
   Resend will provide DNS records to add. Add these to your Namecheap DNS settings:

   **MX Record (if required by Resend):**
   ```
   Type: MX
   Host: @
   Value: feedback-smtp.resend.com
   Priority: 10
   TTL: 3600
   ```
   
   **Note:** If MX record type is not available in Namecheap's dropdown:
   - Try the "Mail Settings" tab instead
   - Or contact Namecheap support to add it manually
   - Some Resend setups work with just SPF + DKIM (try those first)

   **SPF Record (TXT):**
   ```
   Type: TXT
   Host: @
   Value: v=spf1 include:resend.com ~all
   TTL: 3600
   ```

   **DKIM Records (3 TXT records):**
   Resend will provide 3 unique DKIM records. Add each one:
   ```
   Type: TXT
   Host: [provided by Resend, e.g., resend._domainkey]
   Value: [provided by Resend]
   TTL: 3600
   ```

4. **Wait for Verification:**
   - DNS propagation can take 5-60 minutes
   - Check status in Resend dashboard
   - Status will change to "Verified" when ready

## Step 2: Update Environment Variables

✅ **Domain Verified!** `exonec.com` is now verified in Resend.

### For Local Development (`.env.local`):
```env
RESEND_API_KEY=re_xxxxx
YOUR_EMAIL=harzkane@gmail.com
RESEND_FROM=WhatsApp FAQ Bot <support@exonec.com>
```

### For Vercel:
1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add/Update:
   - `RESEND_API_KEY` = `re_xxxxx`
   - `YOUR_EMAIL` = `harzkane@gmail.com`
   - `RESEND_FROM` = `WhatsApp FAQ Bot <support@exonec.com>`
4. **Important:** After adding/updating, go to Deployments → Redeploy

## Step 3: Test Email Sending

1. Visit your deployed site: `https://www.exonec.com/onboard`
2. Fill out the onboarding form
3. Submit
4. Check your email inbox (`harzkane@gmail.com`)
5. You should receive the notification email from `support@exonec.com` ✅

## Email Address Options

You can use any email address with your verified domain:
- `support@exonec.com` ✅ (currently configured, created in Namecheap)
- `onboard@exonec.com` (can be used if needed)
- `noreply@exonec.com`
- `hello@exonec.com`

**Note:** Since `support@exonec.com` is already created in Namecheap, we're using that as the default. All addresses will work once the domain is verified in Resend (which it is! ✅).

## How to Add DNS Records in Namecheap

1. **Log into Namecheap:**
   - Go to https://www.namecheap.com
   - Sign in to your account

2. **Navigate to Domain List:**
   - Click "Domain List" from the left sidebar
   - Find `exonec.com` and click "Manage"

3. **Go to Advanced DNS:**
   - Click the "Advanced DNS" tab
   - Scroll down to "Host Records" section

4. **Add MX Record (Alternative Method):**
   
   **Option A: If MX is not in the dropdown, use this format:**
   - Click "Add New Record"
   - Select Type: **TXT** (temporary workaround)
   - Host: `@`
   - Value: `v=spf1 include:resend.com ~all mx:feedback-smtp.resend.com` (combine SPF with MX)
   - TTL: `Automatic` or `3600`
   
   **Option B: Check Mail Settings:**
   - Go to "Mail Settings" tab (if available)
   - Look for MX Record configuration there
   
   **Option C: Contact Namecheap Support:**
   - If MX records aren't available, you may need to contact Namecheap support
   - They can add the MX record manually: `feedback-smtp.resend.com` with priority `10`

5. **Add TXT Records (Required):**
   - For SPF: Click "Add New Record" → Type: **TXT** → Host: `@` → Value: `v=spf1 include:resend.com ~all`
   - For DKIM: Add each of the 3 DKIM records Resend provides:
     - Click "Add New Record"
     - Type: **TXT**
     - Host: [provided by Resend, e.g., `resend._domainkey`]
     - Value: [provided by Resend]
     - TTL: `Automatic` or `3600`

6. **Save All Records:**
   - Make sure all records are saved (green checkmarks)
   - Wait 5-60 minutes for DNS propagation

**Note:** If you can't add MX records directly, Resend might work with just SPF and DKIM records. Try adding those first and see if Resend verifies the domain. If Resend specifically requires MX, you may need to contact Namecheap support.

## Troubleshooting

### Domain Not Verifying?
- Check DNS records are correct in Namecheap
- Wait 30-60 minutes for DNS propagation
- Use `dig` or online DNS checker to verify records are live
- Make sure MX record priority is set correctly (usually 10)

### Emails Not Sending?
- Verify domain status in Resend dashboard
- Check environment variables in Vercel
- Check Resend API key is correct
- Check Vercel function logs for errors

### DNS Records Not Working?
- Make sure you're editing DNS in Namecheap (not Vercel)
- Remove any conflicting SPF records
- Ensure TTL is set correctly (3600 recommended)

---

**Once verified, your emails will send from `@exonec.com`!** 🎉
