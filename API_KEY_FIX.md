# 🔧 Fix: "Requests from referer are blocked"

## Problem
API key has restrictions that block server-side requests.

## Solution: Remove API Key Restrictions

### Step 1: Go to API Credentials
```
https://console.cloud.google.com/apis/credentials?project=82486774539
```

### Step 2: Find Your API Key
- Look for your API key in the list
- Click on the key name (or pencil icon to edit)

### Step 3: Remove Application Restrictions
Scroll to **"Application restrictions"** section:

**Current (WRONG):**
- ❌ HTTP referrers (websites)
- ❌ IP addresses
- ❌ iOS apps
- ❌ Android apps

**Should be (CORRECT):**
- ✅ **None** (or "Don't restrict key")

**Action:** Select **"None"**

### Step 4: Check API Restrictions
Scroll to **"API restrictions"** section:

**Should be:**
- ✅ Restrict key
- ✅ Select APIs: **Places API (New)** only

### Step 5: Save Changes
- Click **"Save"** button at the bottom
- Wait 2-3 minutes for changes to take effect

### Step 6: Test Again
```bash
# Open http://localhost:3001
# Try search: hotel, New York, USA
```

---

## Alternative: Create New Unrestricted Key

If editing doesn't work, create a new key:

### Step 1: Create New Key
```
https://console.cloud.google.com/apis/credentials/wizard?project=82486774539
```

### Step 2: Configure
- **Which API:** Places API (New)
- **Where:** Web server (Node.js)
- **Application restrictions:** None

### Step 3: Copy New Key
- Copy the new API key

### Step 4: Update .env
```bash
cd /Users/worentwalker/Desktop/AdCrawler
nano .env
# Replace with new key
```

### Step 5: Restart Server
```bash
# Press Ctrl+C in terminal
npm run dev
```

---

## Why This Happens

API keys can have restrictions:
1. **HTTP referrer restrictions** - only allows browser requests
2. **IP restrictions** - only specific IPs
3. **Application restrictions** - only specific apps

Your server-side Next.js API needs **no restrictions** or only API-level restrictions.

---

## ⚠️ Security Note

For production:
- Use environment variables (already done ✅)
- Consider IP restrictions for production server
- Monitor API usage in Google Cloud Console
- Set up billing alerts

For development:
- No restrictions is fine (API key is in .env, not in code)

---

**After fixing, search should work!** 🚀
