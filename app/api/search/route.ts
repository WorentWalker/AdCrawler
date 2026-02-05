import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import pLimit from "p-limit";
import {
  searchText,
  getPlaceDetails,
  buildGoogleMapsUrl,
} from "@/lib/googlePlaces";
import { PlaceCandidate, PlaceDetails } from "@/types/places";
import { generateMockPlaces, DEMO_MODE } from "@/lib/mockData";

// Request validation schema
const searchRequestSchema = z.object({
  keywords: z.array(z.string().min(1)).min(1, "At least one keyword required"),
  locationText: z.string().optional(),
  latLng: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
  limit: z.number().int().min(1).max(100).default(30),
  threshold: z.number().min(0).max(5).default(3.0),
});

type SearchRequest = z.infer<typeof searchRequestSchema>;

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = searchRequestSchema.parse(body);

    const { keywords, locationText, latLng, limit, threshold } = validatedData;

    // DEMO MODE: Return mock data without API calls
    if (DEMO_MODE) {
      console.log("🎭 DEMO MODE: Returning mock data");
      const mockPlaces = generateMockPlaces(
        keywords[0] || "place",
        locationText || "Unknown Location",
        threshold,
        limit
      );
      
      return NextResponse.json({
        places: mockPlaces,
        totalFetched: mockPlaces.length * 3, // Simulate more were fetched
        filtered: mockPlaces.length,
        demo: true,
      });
    }

    // Build location bias
    const locationBias = latLng
      ? { latLng: { latitude: latLng.lat, longitude: latLng.lng } }
      : locationText
      ? { locationText }
      : undefined;

    console.log(
      `Starting search with ${keywords.length} keywords, threshold: ${threshold}, limit: ${limit}`
    );

    // Step 1: Collect candidates from Text Search for all keywords
    const candidatesMap = new Map<string, PlaceCandidate>();
    let totalFetched = 0;

    // Use concurrency limit for API requests
    const limitConcurrency = pLimit(3);

    for (const keyword of keywords) {
      console.log(`Searching for keyword: "${keyword}"`);
      
      try {
        let pageToken: string | undefined = undefined;
        let keywordCandidates = 0;

        // Keep fetching pages until we have enough total filtered candidates
        // or there are no more pages
        while (candidatesMap.size < limit) {
          const response = await searchText(keyword, locationBias, pageToken);

          if (response.places && response.places.length > 0) {
            for (const place of response.places) {
              totalFetched++;
              keywordCandidates++;

              // Deduplicate by place ID
              if (!candidatesMap.has(place.id)) {
                // Only add if rating exists and is below threshold
                if (
                  place.rating !== null &&
                  place.rating !== undefined &&
                  place.rating < threshold
                ) {
                  candidatesMap.set(place.id, place);
                  console.log(
                    `Added: ${place.displayName?.text} (Rating: ${place.rating}, ID: ${place.id})`
                  );

                  // Stop early if we've reached the limit
                  if (candidatesMap.size >= limit) {
                    break;
                  }
                }
              }
            }
          }

          // Check if there's a next page and we need more results
          if (response.nextPageToken && candidatesMap.size < limit) {
            pageToken = response.nextPageToken;
            console.log(
              `Fetching next page for "${keyword}" (collected ${candidatesMap.size}/${limit})`
            );
          } else {
            // No more pages or we have enough results
            break;
          }
        }

        console.log(
          `Keyword "${keyword}": fetched ${keywordCandidates} places, ${candidatesMap.size} total filtered`
        );

        // Stop processing keywords if we've reached the limit
        if (candidatesMap.size >= limit) {
          console.log(`Reached limit of ${limit} filtered results`);
          break;
        }
      } catch (error: any) {
        console.error(`Error searching for keyword "${keyword}":`, error.message);
        // Continue with next keyword instead of failing entirely
      }
    }

    console.log(
      `Collected ${candidatesMap.size} candidates from ${totalFetched} total places`
    );

    if (candidatesMap.size === 0) {
      return NextResponse.json({
        places: [],
        totalFetched,
        filtered: 0,
        message: "No places found matching the criteria",
      });
    }

    // Step 2: Fetch detailed information for filtered candidates
    const candidates = Array.from(candidatesMap.values()).slice(0, limit);
    console.log(`Fetching details for ${candidates.length} places`);

    const detailsPromises = candidates.map((candidate) =>
      limitConcurrency(async () => {
        try {
          const details = await getPlaceDetails(candidate.id);
          return details;
        } catch (error: any) {
          console.error(
            `Error fetching details for ${candidate.id}:`,
            error.message
          );
          // Return candidate data as fallback
          return {
            id: candidate.id,
            name: candidate.id,
            displayName: candidate.displayName,
            formattedAddress: candidate.formattedAddress,
            location: candidate.location,
            rating: candidate.rating,
            userRatingCount: candidate.userRatingCount,
          } as PlaceDetails;
        }
      })
    );

    const places = await Promise.all(detailsPromises);

    console.log(`Successfully fetched details for ${places.length} places`);

    return NextResponse.json({
      places,
      totalFetched,
      filtered: candidatesMap.size,
    });
  } catch (error: any) {
    console.error("Search API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
