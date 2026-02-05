import { PlaceDetails } from "@/types/places";

// Mock data for demo purposes (no API required)
export const generateMockPlaces = (
  keyword: string,
  location: string,
  threshold: number,
  limit: number
): PlaceDetails[] => {
  const mockPlaces: PlaceDetails[] = [
    {
      id: "mock-1",
      name: "mock-1",
      displayName: { text: `Budget ${keyword} Inn` },
      formattedAddress: `123 Main St, ${location}`,
      shortFormattedAddress: "123 Main St",
      location: { latitude: 40.7128, longitude: -74.006 },
      rating: 2.3,
      userRatingCount: 145,
      websiteUri: "https://example.com",
      internationalPhoneNumber: "+1 212-555-0123",
      nationalPhoneNumber: "(212) 555-0123",
      regularOpeningHours: {
        openNow: true,
        weekdayDescriptions: [
          "Monday: 9:00 AM – 5:00 PM",
          "Tuesday: 9:00 AM – 5:00 PM",
          "Wednesday: 9:00 AM – 5:00 PM",
          "Thursday: 9:00 AM – 5:00 PM",
          "Friday: 9:00 AM – 5:00 PM",
          "Saturday: Closed",
          "Sunday: Closed",
        ],
      },
      types: ["lodging", "establishment"],
      businessStatus: "OPERATIONAL",
      plusCode: { globalCode: "87G8Q2J8+3M" },
      reviews: [
        {
          name: "review-1",
          relativePublishTimeDescription: "2 weeks ago",
          rating: 2,
          text: { text: "Poor service and dated rooms. Not worth the money.", languageCode: "en" },
          authorAttribution: { displayName: "John D.", uri: "https://example.com" },
          publishTime: new Date().toISOString(),
        },
        {
          name: "review-2",
          relativePublishTimeDescription: "1 month ago",
          rating: 1,
          text: { text: "Terrible experience. Would not recommend.", languageCode: "en" },
          authorAttribution: { displayName: "Sarah M.", uri: "https://example.com" },
          publishTime: new Date().toISOString(),
        },
      ],
      photos: [
        {
          name: "photo-1",
          widthPx: 1920,
          heightPx: 1080,
        },
        {
          name: "photo-2",
          widthPx: 1920,
          heightPx: 1080,
        },
      ],
      googleMapsUri: "https://maps.google.com/?cid=123456789",
    },
    {
      id: "mock-2",
      name: "mock-2",
      displayName: { text: `Economy ${keyword}` },
      formattedAddress: `456 Oak Ave, ${location}`,
      shortFormattedAddress: "456 Oak Ave",
      location: { latitude: 40.7589, longitude: -73.9851 },
      rating: 2.7,
      userRatingCount: 89,
      websiteUri: "https://example.com",
      internationalPhoneNumber: "+1 212-555-0456",
      nationalPhoneNumber: "(212) 555-0456",
      regularOpeningHours: {
        openNow: false,
        weekdayDescriptions: [
          "Monday: 8:00 AM – 6:00 PM",
          "Tuesday: 8:00 AM – 6:00 PM",
          "Wednesday: 8:00 AM – 6:00 PM",
          "Thursday: 8:00 AM – 6:00 PM",
          "Friday: 8:00 AM – 6:00 PM",
          "Saturday: 10:00 AM – 4:00 PM",
          "Sunday: Closed",
        ],
      },
      types: ["lodging", "point_of_interest"],
      businessStatus: "OPERATIONAL",
      plusCode: { globalCode: "87G8Q95G+2H" },
      reviews: [
        {
          name: "review-3",
          relativePublishTimeDescription: "3 days ago",
          rating: 3,
          text: { text: "It's okay for the price, but nothing special.", languageCode: "en" },
          authorAttribution: { displayName: "Mike R.", uri: "https://example.com" },
          publishTime: new Date().toISOString(),
        },
      ],
      photos: [
        {
          name: "photo-3",
          widthPx: 1920,
          heightPx: 1080,
        },
      ],
      googleMapsUri: "https://maps.google.com/?cid=987654321",
    },
    {
      id: "mock-3",
      name: "mock-3",
      displayName: { text: `Discount ${keyword} Palace` },
      formattedAddress: `789 Elm St, ${location}`,
      shortFormattedAddress: "789 Elm St",
      location: { latitude: 40.7489, longitude: -73.9680 },
      rating: 1.9,
      userRatingCount: 234,
      internationalPhoneNumber: "+1 212-555-0789",
      nationalPhoneNumber: "(212) 555-0789",
      regularOpeningHours: {
        openNow: true,
        weekdayDescriptions: [
          "Monday: Open 24 hours",
          "Tuesday: Open 24 hours",
          "Wednesday: Open 24 hours",
          "Thursday: Open 24 hours",
          "Friday: Open 24 hours",
          "Saturday: Open 24 hours",
          "Sunday: Open 24 hours",
        ],
      },
      types: ["lodging", "establishment"],
      businessStatus: "OPERATIONAL",
      plusCode: { globalCode: "87G8P5X9+4M" },
      reviews: [
        {
          name: "review-4",
          relativePublishTimeDescription: "1 week ago",
          rating: 1,
          text: { text: "Absolutely terrible. Dirty rooms and rude staff.", languageCode: "en" },
          authorAttribution: { displayName: "Lisa K.", uri: "https://example.com" },
          publishTime: new Date().toISOString(),
        },
        {
          name: "review-5",
          relativePublishTimeDescription: "2 weeks ago",
          rating: 2,
          text: { text: "Very disappointing. Would not stay again.", languageCode: "en" },
          authorAttribution: { displayName: "Tom B.", uri: "https://example.com" },
          publishTime: new Date().toISOString(),
        },
        {
          name: "review-6",
          relativePublishTimeDescription: "1 month ago",
          rating: 1,
          text: { text: "Worst place I've ever stayed. Avoid at all costs.", languageCode: "en" },
          authorAttribution: { displayName: "Anna S.", uri: "https://example.com" },
          publishTime: new Date().toISOString(),
        },
      ],
      photos: [
        {
          name: "photo-4",
          widthPx: 1920,
          heightPx: 1080,
        },
      ],
      googleMapsUri: "https://maps.google.com/?cid=456789123",
    },
  ];

  // Filter by threshold and return limited results
  return mockPlaces
    .filter((place) => place.rating! < threshold)
    .slice(0, limit)
    .map((place, index) => ({
      ...place,
      id: `mock-${index + 1}`,
      name: `mock-${index + 1}`,
    }));
};

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
