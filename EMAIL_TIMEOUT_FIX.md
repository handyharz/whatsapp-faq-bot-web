# Email Timeout Fix

## Issue
Connection timeout when sending emails via Resend API:
```
ConnectTimeoutError: Connect Timeout Error (attempted address: api.resend.com:443, timeout: 10000ms)
```

## Solution Applied

✅ **Updated `/app/api/onboard/route.ts`** with:
1. **Retry Logic**: 3 attempts with exponential backoff
2. **Increased Timeout**: 30 seconds (from 10 seconds)
3. **Better Error Handling**: Distinguishes timeout vs other errors
4. **Graceful Degradation**: Form submission succeeds even if email fails

---

## What Changed

### Before:
- Single attempt
- 10-second timeout (default)
- Request fails if email fails

### After:
- 3 retry attempts
- 30-second timeout per attempt
- Exponential backoff (1s, 2s, 4s delays)
- Form submission always succeeds
- Email failure is logged but doesn't block the form

---

## Testing

1. **Submit the form again** - it should work now with retries
2. **Check console logs** for:
   - `✅ Email sent: [id]` - Success
   - `⏱️ Email timeout (attempt X/3)` - Retrying
   - `❌ Email failed after all retries` - All attempts failed

---

## If Still Failing

### Check Network Connectivity

```bash
# Test Resend API connectivity
curl -I https://api.resend.com/emails

# Should return HTTP 401 (unauthorized) - means connection works
# If timeout, there's a network/firewall issue
```

### Possible Causes

1. **Firewall/Proxy**: Corporate firewall blocking `api.resend.com`
2. **DNS Issues**: Can't resolve `api.resend.com`
3. **Network Outage**: Temporary Resend API outage
4. **VPN/Network**: VPN or network configuration blocking HTTPS

### Solutions

1. **Check Internet Connection**: Ensure you can reach other HTTPS sites
2. **Try Different Network**: Switch to mobile hotspot or different WiFi
3. **Check Firewall**: Temporarily disable firewall/antivirus
4. **DNS**: Try using `8.8.8.8` (Google DNS) or `1.1.1.1` (Cloudflare DNS)
5. **Resend Status**: Check https://status.resend.com

---

## Alternative: Use Resend SDK

If fetch continues to fail, we can switch to the official Resend SDK:

```bash
npm install resend
```

The SDK handles timeouts and retries automatically.

---

## Current Behavior

✅ **Form submission always succeeds** (even if email fails)
✅ **Email retries 3 times** with exponential backoff
✅ **Detailed logging** for debugging
✅ **30-second timeout** per attempt (90 seconds total)

**The form will work, but email notifications might fail if there's a persistent network issue.**

---

## Next Steps

1. **Test the form** - Submit again and check logs
2. **If it works**: Great! The retry logic fixed it
3. **If still failing**: Check network connectivity (see above)
4. **Consider**: Switching to Resend SDK if network issues persist
