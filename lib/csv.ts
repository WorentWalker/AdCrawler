import { PlaceDetails } from "@/types/places";

/**
 * Convert places data to CSV format
 */
export function generateCSV(places: PlaceDetails[]): string {
  if (places.length === 0) {
    return "No data to export";
  }

  // CSV Headers
  const headers = [
    "Name",
    "Rating",
    "User Rating Count",
    "Address",
    "Short Address",
    "Phone (International)",
    "Phone (National)",
    "Website",
    "Open Now",
    "Business Status",
    "Types",
    "Latitude",
    "Longitude",
    "Plus Code",
    "Google Maps URL",
  ];

  // Helper to escape CSV fields
  const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) {
      return "";
    }
    const str = String(value);
    // Escape double quotes and wrap in quotes if contains comma, newline, or quote
    if (str.includes(",") || str.includes("\n") || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Build rows
  const rows = places.map((place) => {
    const googleMapsUrl = place.googleMapsUri || 
      `https://www.google.com/maps/place/?q=place_id:${place.id}`;
    
    return [
      escapeCSV(place.displayName?.text || place.name),
      escapeCSV(place.rating ?? ""),
      escapeCSV(place.userRatingCount ?? ""),
      escapeCSV(place.formattedAddress ?? ""),
      escapeCSV(place.shortFormattedAddress ?? ""),
      escapeCSV(place.internationalPhoneNumber ?? ""),
      escapeCSV(place.nationalPhoneNumber ?? ""),
      escapeCSV(place.websiteUri ?? ""),
      escapeCSV(
        place.currentOpeningHours?.openNow ??
          place.regularOpeningHours?.openNow ??
          ""
      ),
      escapeCSV(place.businessStatus ?? ""),
      escapeCSV(place.types?.join("; ") ?? ""),
      escapeCSV(place.location?.latitude ?? ""),
      escapeCSV(place.location?.longitude ?? ""),
      escapeCSV(place.plusCode?.globalCode ?? ""),
      escapeCSV(googleMapsUrl),
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

/**
 * Download CSV file in browser
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
