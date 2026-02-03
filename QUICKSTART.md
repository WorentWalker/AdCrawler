# Quick Start Guide

Get up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up API Key

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Google Places API key:
```env
GOOGLE_PLACES_API_KEY=your_actual_key_here
```

> Don't have an API key? [Get one here](https://console.cloud.google.com/apis/credentials) (make sure to enable "Places API (New)")

## Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Step 4: Try a Search

**Example 1 - Find low-rated restaurants in New York:**
- Keywords: `restaurant`
- Location: `New York, USA`
- Threshold: `3.0`
- Click **Search**

**Example 2 - Find low-rated hotels using coordinates:**
- Keywords: `hotel, motel`
- Latitude: `40.7128`
- Longitude: `--74.0060`
- Threshold: `2.5`
- Click **Search**

## Common Issues

### "API key not valid"
- Make sure Places API (New) is enabled in [Google Cloud Console](https://console.cloud.google.com/)
- Check that your `.env` file has the correct key
- Restart the dev server after adding the key

### Module not found errors
- Run `npm install` again
- Delete `node_modules` and `.next` folders, then run `npm install`

### No results found
- Try increasing the rating threshold (e.g., 3.5)
- Use more general keywords
- Try a different location

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Deploy to [Vercel](https://vercel.com) for production use
- Customize the UI in `app/page.tsx`
- Adjust API behavior in `lib/googlePlaces.ts`

## Tips for Better Results

✅ Use multiple keywords separated by commas or new lines  
✅ Be specific with location (city + country)  
✅ Start with threshold 3.0, adjust as needed  
✅ Export results to CSV for analysis  
✅ Click "Details" on rows to see reviews and photos  

Happy searching! 🔍
