import {
  PlaceCandidate,
  PlaceDetails,
  TextSearchResponse,
  Location,
} from "@/types/places";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const BASE_URL = "https://places.googleapis.com/v1";

if (!API_KEY) {
  throw new Error("GOOGLE_PLACES_API_KEY is not set in environment variables");
}

// Field masks for API requests
export const TEXT_SEARCH_FIELDS = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "nextPageToken",
].join(",");

export const PLACE_DETAILS_FIELDS = [
  "id",
  "displayName",
  "formattedAddress",
  "shortFormattedAddress",
  "location",
  "rating",
  "userRatingCount",
  "websiteUri",
  "internationalPhoneNumber",
  "nationalPhoneNumber",
  "regularOpeningHours",
  "currentOpeningHours",
  "types",
  "businessStatus",
  "plusCode",
  "photos",
  "reviews",
  "googleMapsUri",
].join(",");

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

/**
 * Retry a function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error | undefined;
  let delay = opts.initialDelay;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Check if we should retry
      const shouldRetry =
        error.status === 429 || // Rate limit
        error.status === 503 || // Service unavailable
        error.status === 500 || // Internal server error
        error.message?.includes("INVALID_REQUEST") || // nextPageToken not ready
        error.message?.includes("nextPageToken");

      if (attempt < opts.maxRetries && shouldRetry) {
        console.log(
          `Retry attempt ${attempt + 1}/${opts.maxRetries} after ${delay}ms. Error: ${error.message}`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelay);
      } else {
        break;
      }
    }
  }

  throw lastError || new Error("Retry failed");
}

/**
 * Make a request to Google Places API
 */
async function makeRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY!,
      "X-Goog-FieldMask": options.headers
        ? (options.headers as any)["X-Goog-FieldMask"]
        : "",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorJson = JSON.parse(errorBody);
      errorMessage = errorJson.error?.message || errorMessage;
    } catch {
      // Use default error message
    }
    
    const error = new Error(errorMessage) as any;
    error.status = response.status;
    throw error;
  }

  return response.json();
}

/**
 * Search for places using Text Search API
 */
export async function searchText(
  textQuery: string,
  locationBias?: { locationText?: string; latLng?: Location },
  pageToken?: string
): Promise<TextSearchResponse> {
  const body: any = {
    textQuery,
  };

  if (pageToken) {
    body.pageToken = pageToken;
  } else {
    // Location bias only applies to initial request, not paginated ones
    if (locationBias?.locationText) {
      body.locationBias = {
        circle: {
          center: {
            addressLines: [locationBias.locationText],
          },
          radius: 50000, // 50km radius
        },
      };
    } else if (locationBias?.latLng) {
      body.locationBias = {
        circle: {
          center: {
            latitude: locationBias.latLng.latitude,
            longitude: locationBias.latLng.longitude,
          },
          radius: 50000,
        },
      };
    }
  }

  return retryWithBackoff(
    async () =>
      makeRequest<TextSearchResponse>(`${BASE_URL}/places:searchText`, {
        method: "POST",
        headers: {
          "X-Goog-FieldMask": TEXT_SEARCH_FIELDS,
        },
        body: JSON.stringify(body),
      }),
    {
      maxRetries: pageToken ? 5 : 3, // More retries for paginated requests (nextPageToken delay)
      initialDelay: pageToken ? 2000 : 1000, // Longer initial delay for pageToken
    }
  );
}

/**
 * Get detailed information about a place
 */
export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  return retryWithBackoff(async () =>
    makeRequest<PlaceDetails>(`${BASE_URL}/places/${placeId}`, {
      method: "GET",
      headers: {
        "X-Goog-FieldMask": PLACE_DETAILS_FIELDS,
      },
    })
  );
}

/**
 * Build Google Maps URL for a place
 */
export function buildGoogleMapsUrl(
  place: PlaceDetails | PlaceCandidate
): string {
  // Prefer googleMapsUri if available
  if ("googleMapsUri" in place && place.googleMapsUri) {
    return place.googleMapsUri;
  }

  // Fallback to place_id based URL
  return `https://www.google.com/maps/place/?q=place_id:${place.id}`;
}
