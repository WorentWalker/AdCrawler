// Type definitions for Google Places API (NEW)

export interface Location {
  latitude: number;
  longitude: number;
}

export interface DisplayName {
  text: string;
  languageCode?: string;
}

export interface Photo {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions?: Array<{
    displayName: string;
    uri: string;
    photoUri?: string;
  }>;
}

export interface Review {
  name: string;
  relativePublishTimeDescription: string;
  rating: number;
  text?: {
    text: string;
    languageCode: string;
  };
  originalText?: {
    text: string;
    languageCode: string;
  };
  authorAttribution?: {
    displayName: string;
    uri: string;
    photoUri?: string;
  };
  publishTime: string;
}

export interface OpeningHours {
  openNow?: boolean;
  periods?: Array<{
    open: {
      day: number;
      hour: number;
      minute: number;
      date?: {
        year: number;
        month: number;
        day: number;
      };
    };
    close?: {
      day: number;
      hour: number;
      minute: number;
      date?: {
        year: number;
        month: number;
        day: number;
      };
    };
  }>;
  weekdayDescriptions?: string[];
  secondaryHoursType?: string;
  specialDays?: Array<{
    date: {
      year: number;
      month: number;
      day: number;
    };
  }>;
}

export interface PlusCode {
  globalCode: string;
  compoundCode?: string;
}

// Candidate from Text Search
export interface PlaceCandidate {
  id: string;
  displayName?: DisplayName;
  formattedAddress?: string;
  location?: Location;
  rating?: number;
  userRatingCount?: number;
}

// Full place details
export interface PlaceDetails {
  id: string;
  name: string;
  displayName?: DisplayName;
  formattedAddress?: string;
  shortFormattedAddress?: string;
  location?: Location;
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  internationalPhoneNumber?: string;
  nationalPhoneNumber?: string;
  regularOpeningHours?: OpeningHours;
  currentOpeningHours?: OpeningHours;
  types?: string[];
  businessStatus?: string;
  plusCode?: PlusCode;
  photos?: Photo[];
  reviews?: Review[];
  googleMapsUri?: string;
}

// Text Search API Response
export interface TextSearchResponse {
  places: PlaceCandidate[];
  nextPageToken?: string;
}

// Search request payload
export interface SearchRequest {
  keywords: string[];
  locationText?: string;
  latLng?: {
    lat: number;
    lng: number;
  };
  limit: number;
  threshold: number;
}

// Search response
export interface SearchResponse {
  places: PlaceDetails[];
  totalFetched: number;
  filtered: number;
  error?: string;
}
