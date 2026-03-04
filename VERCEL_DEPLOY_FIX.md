# 🔧 Vercel Deploy Fix

## Problem: App doesn't work on Vercel

Common issues and solutions:

---

## ✅ Solution 1: Add Environment Variables

### Step 1: Go to Vercel Project Settings

1. Open your project on Vercel
2. Click **"Settings"** tab at the top
3. Click **"Environment Variables"** in left sidebar

### Step 2: Add Required Variables

Add these **TWO** environment variables:

**Variable 1:**
```
Name:  GOOGLE_PLACES_API_KEY
Value: AIzaSyACwh6AjvCoH_bv4Q4I6tSWN2dfka_bf6E
Environment: Production, Preview, Development (select all)
```

**Variable 2:**
```
Name:  NEXT_PUBLIC_DEMO_MODE
Value: false
Environment: Production, Preview, Development (select all)
```

### Step 3: Redeploy

After adding variables:
1. Go to **"Deployments"** tab
2. Click the **three dots (...)** on the latest deployment
3. Click **"Redeploy"**
4. Check **"Use existing Build Cache"** (optional)
5. Click **"Redeploy"**

---

## ✅ Solution 2: Check Build Logs

If still not working:

1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. Click **"Building"** to see build logs
4. Look for errors (red text)
5. Send me the error message

---

## ✅ Solution 3: Check Runtime Logs

If build succeeded but app doesn't work:

1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. Click **"Functions"** tab
4. Click on any function (e.g., `api/search`)
5. Look at the logs for errors
6. Send me the error

---

## 🎯 Quick Checklist

- [ ] **GOOGLE_PLACES_API_KEY** added to Vercel
- [ ] **NEXT_PUBLIC_DEMO_MODE** = `false` added to Vercel
- [ ] Both variables set for **all environments** (Production, Preview, Development)
- [ ] Project **redeployed** after adding variables
- [ ] Build completed **successfully** (green checkmark)
- [ ] No errors in **Runtime Logs**

---

## 💡 Common Mistakes

### ❌ WRONG:
- Not adding environment variables at all
- Adding variables but not redeploying
- Setting variables only for Production (need all 3)
- Using DEMO_MODE=true in production

### ✅ CORRECT:
- Both variables added
- All environments selected
- Redeployed after adding
- DEMO_MODE=false for real data

---

## 🔍 How to Test

After redeploying:

1. Open your Vercel URL (e.g., `your-app.vercel.app`)
2. Enter search:
   - Keywords: `hotel`
   - Location: `New York, USA`
   - Threshold: `3.0`
3. Click **Search**
4. Wait 10-20 seconds
5. Should see real places!

---

## 🆘 Still Not Working?

### Check these:

1. **Environment Variables Screen:**
   - Should show 2 variables
   - Green checkmarks for all environments

2. **Deployment Status:**
   - Should say "Ready" with green checkmark
   - Not "Error" or "Failed"

3. **Function Logs:**
   - Check `/api/search` function logs
   - Look for error messages

### Send me:
- Screenshot of Environment Variables page
- Deployment error message (if any)
- Runtime logs from Functions tab

---

## 📸 What Environment Variables Should Look Like:

```
Environment Variables (2)

GOOGLE_PLACES_API_KEY
AIzaSyACwh6AjvCoH_bv4Q4I6tSWN2dfka_bf6E
Production, Preview, Development

NEXT_PUBLIC_DEMO_MODE
false
Production, Preview, Development
```

---

## 🚀 After Fixing

Your app will work with:
- ✅ Real Google Places data
- ✅ Live search functionality
- ✅ All features working
- ✅ Production-ready performance

---

**Try the fix above and let me know the result!** 🎯
