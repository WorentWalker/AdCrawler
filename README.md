# Low Rating Places Finder

A production-ready internal tool built with Next.js 14+ that helps you discover places with low ratings using the Google Places API (NEW). Perfect for competitive analysis, market research, or identifying business opportunities.

## Features

- 🔍 **Multi-keyword search** - Search multiple keywords simultaneously (comma-separated or multi-line)
- 📍 **Flexible location** - Search by city/address text or precise lat/lng coordinates
- ⭐ **Rating filtering** - Configurable threshold to find places below specific ratings
- 🔄 **Smart pagination** - Automatic handling of nextPageToken with retry logic
- 🚫 **Deduplication** - Places are deduplicated across keywords by place ID
- 📊 **Detailed results** - Comprehensive place information including reviews, photos, and opening hours
- 💾 **CSV export** - Download results as CSV for further analysis
- 🔄 **Client-side sorting** - Sort by rating or review count (ascending/descending)
- 🎯 **Rate limiting** - Built-in concurrency control and retry logic for API stability
- 🔒 **Secure** - API keys never exposed to the browser (server-side only)
- 📱 **Responsive UI** - Clean, modern interface built with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **API**: Google Places API (NEW)
- **Concurrency**: p-limit

## Prerequisites

1. **Node.js** 18+ installed
2. **Google Cloud Project** with Places API (NEW) enabled
3. **API Key** with Places API (NEW) access

### Getting a Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API (New)** for your project
   - Navigate to "APIs & Services" > "Library"
   - Search for "Places API (New)"
   - Click "Enable"
4. Create credentials (API Key)
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key
5. (Optional but recommended) Restrict your API key
   - Click on your API key to edit
   - Under "API restrictions", select "Restrict key"
   - Choose "Places API (New)"

## Local Development

### Installation

```bash
# Clone or navigate to the project directory
cd AdCrawler

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Google Places API key:

```env
GOOGLE_PLACES_API_KEY=your_actual_api_key_here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### Manual Deployment

1. **Install Vercel CLI** (if not already installed):

```bash
npm install -g vercel
```

2. **Login to Vercel**:

```bash
vercel login
```

3. **Deploy**:

```bash
# From the project root
vercel

# For production deployment
vercel --prod
```

4. **Set Environment Variables**:

After deployment, add your API key:

```bash
vercel env add GOOGLE_PLACES_API_KEY
```

Or via Vercel Dashboard:
- Go to your project settings
- Navigate to "Environment Variables"
- Add `GOOGLE_PLACES_API_KEY` with your API key
- Redeploy for changes to take effect

### GitHub Integration

1. Push your code to GitHub
2. Import the repository in Vercel dashboard
3. Add environment variables in project settings
4. Deploy automatically on every push

## Usage

### Basic Search

1. **Enter keywords**: Add one or more keywords (e.g., "restaurant", "coffee shop")
2. **Set location**: Enter a city/address OR provide lat/lng coordinates
3. **Configure filters**:
   - **Max Results**: Number of places to display (default: 30)
   - **Rating Threshold**: Only show places with rating below this value (default: 3.0)
4. **Click Search**: Results will appear below the form

### Understanding Results

The results table shows:
- **Name**: Place name
- **Rating**: Color-coded badge (red < 2, orange < 3, yellow < 4)
- **Reviews**: Number of user ratings
- **Address**: Short formatted address
- **Phone**: National or international phone number
- **Website**: Link to the place's website
- **Open Now**: Current open/closed status
- **Actions**: 
  - **Maps**: Open in Google Maps
  - **Details**: Expand full details

### Viewing Full Details

Click **Details** on any row to see:
- Full address and business status
- Place types and Plus Code
- GPS coordinates
- Opening hours (weekly schedule)
- Photos (references)
- Recent reviews with ratings

### Exporting Results

Click **Export CSV** to download all results as a CSV file containing:
- Name, rating, review count
- Addresses (full and short)
- Phone numbers (both formats)
- Website URL
- Open status and business status
- Place types
- Coordinates and Plus Code
- Google Maps URL

### Sorting Results

Click column headers to sort:
- **Rating**: Click to sort by rating (ascending/descending)
- **Reviews**: Click to sort by review count

## API Architecture

### Endpoints

#### `POST /api/search`

Search for low-rating places.

**Request Body**:
```json
{
  "keywords": ["restaurant", "cafe"],
  "locationText": "New York, USA",
  "latLng": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "limit": 30,
  "threshold": 3.0
}
```

**Response**:
```json
{
  "places": [...],
  "totalFetched": 150,
  "filtered": 45
}
```

### Two-Step Fetching Process

1. **Text Search API**: Fetches candidates with basic info (id, name, address, rating)
   - Filters places with `rating < threshold`
   - Deduplicates by place ID
   - Handles pagination with `nextPageToken`
   
2. **Place Details API**: Enriches filtered candidates with full details
   - Reviews, photos, opening hours
   - Business status, types, Plus Code
   - Phone numbers and website

### Rate Limiting & Retry Logic

- **Concurrency control**: Max 3 concurrent API requests
- **Exponential backoff**: Automatic retry for 429, 500, 503 errors
- **NextPageToken handling**: Retries with delay when token isn't ready yet
- **Error resilience**: Continues processing even if individual requests fail

## Project Structure

```
AdCrawler/
├── app/
│   ├── api/
│   │   └── search/
│   │       └── route.ts          # API endpoint with Zod validation
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main UI component
│   └── globals.css               # Global styles
├── lib/
│   ├── googlePlaces.ts           # Google Places API integration
│   └── csv.ts                    # CSV export utilities
├── types/
│   └── places.ts                 # TypeScript type definitions
├── .env.example                  # Environment variables template
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Configuration

### Environment Variables

- `GOOGLE_PLACES_API_KEY` (required): Your Google Places API key

### Default Values

- **Max Results**: 30 places
- **Rating Threshold**: 3.0 stars
- **Search Radius**: 50km from location
- **Max Retries**: 3 (5 for paginated requests)
- **Concurrency Limit**: 3 simultaneous requests

## Troubleshooting

### "API key not valid"

- Ensure Places API (New) is enabled in Google Cloud Console
- Verify your API key is correctly set in `.env`
- Check API key restrictions (should allow Places API New)

### "No places found"

- Try increasing the rating threshold
- Expand the search area by changing location
- Use more generic keywords
- Check that the location is valid

### Slow search results

- Reduce the `limit` value
- Use fewer keywords
- This is normal for extensive searches with many results

### NextPageToken errors

- The tool automatically retries with backoff
- If persistent, this may indicate API quota issues
- Check your Google Cloud Console for quota limits

## Cost Considerations

Google Places API (New) pricing (as of 2024):
- **Text Search**: $32 per 1,000 requests
- **Place Details**: Varies by field mask (~$17-32 per 1,000)

**Example cost for 30 results**:
- Text Search: 1-3 requests × $0.032 = $0.032-$0.096
- Place Details: 30 requests × $0.017 = $0.51
- **Total**: ~$0.54 per search

💡 **Tip**: Use the limit parameter wisely to control costs.

## Security Best Practices

✅ **Implemented**:
- API key stored server-side only (never exposed to browser)
- Server-side API calls via Next.js Route Handlers
- Input validation with Zod
- Rate limiting and concurrency control

⚠️ **Additional Recommendations for Production**:
- Add authentication/authorization
- Implement request logging and monitoring
- Set up alerts for unusual API usage
- Consider API key rotation policy

## License

MIT License - feel free to use this tool for your internal projects.

## Support

For issues related to:
- **Google Places API**: [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service/overview)
- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)
- **This tool**: Open an issue in the repository

---

Built with ❤️ using Next.js 14 and Google Places API (New)
