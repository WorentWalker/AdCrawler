# 🚀 Getting Started with Low Rating Places Finder

Welcome! This guide will get you up and running in **5 minutes**.

---

## 📋 Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Node.js 18+ installed ([Download here](https://nodejs.org/))
- [ ] A Google Cloud account ([Sign up here](https://console.cloud.google.com/))
- [ ] Places API (New) enabled in Google Cloud
- [ ] A Google Places API key

---

## 🔑 Getting Your API Key (First Time Setup)

### Step 1: Create/Select a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it (e.g., "Low Rating Places Finder")
4. Click "Create"

### Step 2: Enable Places API (New)

1. In the Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Places API (New)"**
3. Click on it, then click **"Enable"**
4. Wait for it to activate (~30 seconds)

### Step 3: Create an API Key

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API Key"**
3. Copy your API key (it looks like: `AIzaSyC...`)
4. (Optional) Click on the key to restrict it:
   - Under "API restrictions", select "Restrict key"
   - Choose "Places API (New)"
   - Click "Save"

✅ You now have your API key!

---

## ⚙️ Project Setup

### Step 1: Install Dependencies

Open your terminal in the `AdCrawler` directory and run:

```bash
npm install
```

This will install all required packages (~2 minutes).

### Step 2: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` and replace `your_api_key_here` with your actual API key:

```env
GOOGLE_PLACES_API_KEY=AIzaSyC...your-actual-key
```

### Step 3: Verify Setup (Optional but Recommended)

```bash
node verify-setup.js
```

This script checks if everything is configured correctly.

### Step 4: Start Development Server

```bash
npm run dev
```

You should see:

```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in 2.3s
```

---

## 🎯 Your First Search

### Open the App

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### Try This Example

1. **Keywords**: Enter one keyword per line or comma-separated
   ```
   restaurant
   cafe
   bistro
   ```

2. **Location**: Enter a city or address
   ```
   New York, USA
   ```

3. **Max Results**: `30` (default)

4. **Rating Threshold**: `3.0` (shows places with rating < 3.0)

5. Click **"Search"** and wait ~10-30 seconds

### What You'll See

- **Stats bar**: Shows how many places were fetched and filtered
- **Results table**: Displays matching places with ratings, addresses, etc.
- **Maps link**: Click to open the place in Google Maps
- **Details button**: Click to expand and see reviews, hours, photos

### Try More Features

- **Sort results**: Click on "Rating" or "Reviews" column headers
- **View details**: Click "Details" on any row to see reviews and opening hours
- **Export CSV**: Click "Export CSV" to download all results
- **Reset**: Click "Reset" to clear the form

---

## 📊 Understanding the Results

### Table Columns

| Column | Description |
|--------|-------------|
| **Name** | Business name |
| **Rating** | Star rating (color-coded: red <2, orange <3, yellow <4) |
| **Reviews** | Total number of user ratings |
| **Address** | Short formatted address |
| **Phone** | Contact phone number |
| **Website** | Link to business website |
| **Open Now** | Current open/closed status |
| **Actions** | Maps link and Details button |

### Expandable Details

Click "Details" to see:
- Full address and GPS coordinates
- Business types and Plus Code
- Weekly opening hours
- Photo references
- Recent reviews with ratings

---

## 🎨 Customization Ideas

### Adjust Search Parameters

- **Lower threshold** (e.g., 2.5) → Find only very poor ratings
- **Higher threshold** (e.g., 3.5) → Cast a wider net
- **More results** (e.g., 50) → Get more data (costs more)
- **Specific keywords** → Target specific business types

### Search Strategies

**Competitive Analysis:**
```
Keywords: hotel, motel, resort
Location: Miami, FL
Threshold: 3.0
```

**Market Research:**
```
Keywords: coffee shop, cafe
Location: 47.6062, -122.3321  (Seattle lat/lng)
Threshold: 3.5
```

**Multi-category:**
```
Keywords: restaurant, bar, nightclub, pub
Location: Las Vegas, NV
Threshold: 2.5
```

---

## 💾 Exporting Data

### CSV Export

Click **"Export CSV"** to download results including:
- All visible fields (name, rating, address, phone, website, etc.)
- GPS coordinates
- Plus Codes
- Google Maps URLs
- Opening status

The file is named: `low-rating-places-YYYY-MM-DD.csv`

### Using Exported Data

Open in:
- **Excel/Google Sheets**: For analysis and filtering
- **Google My Maps**: Import coordinates to visualize
- **CRM tools**: Import leads for follow-up
- **Analysis tools**: Further data processing

---

## 🚨 Troubleshooting

### "API key not valid"

**Solution:**
1. Check that Places API (New) is enabled (not the old Places API)
2. Verify your `.env` file has the correct key
3. Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again
4. Check API key restrictions in Google Cloud Console

### No results found

**Solution:**
1. Increase the rating threshold (try 3.5 or 4.0)
2. Use more generic keywords ("restaurant" vs "italian restaurant")
3. Try a different or larger city
4. Check that your location is spelled correctly

### Search is very slow

**Why:** The tool is fetching and filtering many places

**Solutions:**
1. Reduce max results (try 20 instead of 30)
2. Use fewer keywords (1-2 instead of 5+)
3. This is normal for comprehensive searches

### Rate limit errors

**Solution:**
1. Wait a few seconds and try again
2. The tool has automatic retry logic built in
3. Check your Google Cloud quota/billing status

---

## 📚 Next Steps

### Learn More
- 📖 Read [README.md](README.md) for comprehensive documentation
- 📝 Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for technical details
- 🔧 Explore the code in `app/`, `lib/`, and `types/` directories

### Deploy to Production
- 🚀 Deploy to [Vercel](https://vercel.com) (see README.md)
- 🔒 Add authentication for internal use
- 📊 Set up monitoring and alerts
- 💰 Monitor API costs in Google Cloud Console

### Customize
- 🎨 Modify UI colors in `tailwind.config.ts`
- ⚙️ Adjust API behavior in `lib/googlePlaces.ts`
- 🔧 Add new features in `app/page.tsx`
- 📋 Extend types in `types/places.ts`

---

## 💡 Tips for Success

✅ **Start small**: Test with 1-2 keywords and 20 results first  
✅ **Be specific**: "coffee shop" is better than just "shop"  
✅ **Use lat/lng**: More precise than text-based locations  
✅ **Export often**: Save your results for analysis  
✅ **Sort strategically**: Find the worst ratings or most-reviewed places  
✅ **Check details**: Reviews often reveal WHY ratings are low  

---

## 🤝 Getting Help

- **Setup issues**: Run `node verify-setup.js`
- **API errors**: Check [Google Places API docs](https://developers.google.com/maps/documentation/places/web-service/overview)
- **Next.js questions**: See [Next.js docs](https://nextjs.org/docs)
- **TypeScript errors**: Check types in `types/places.ts`

---

## 🎉 You're Ready!

You now have a powerful tool for finding and analyzing low-rated places. Use it for:

- 🔍 Competitive intelligence
- 📊 Market research
- 💼 Lead generation
- 🏪 Location analysis
- 📈 Business opportunities

**Happy searching! 🚀**

---

*Built with Next.js 14, TypeScript, and Google Places API (New)*
