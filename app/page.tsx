"use client";

import { useState } from "react";
import { PlaceDetails } from "@/types/places";
import { generateCSV, downloadCSV } from "@/lib/csv";
import { PLACE_TYPES } from "@/lib/placeTypes";

export default function Home() {
  const [keywords, setKeywords] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [limit, setLimit] = useState(30);
  const [threshold, setThreshold] = useState(3.0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PlaceDetails[]>([]);
  const [stats, setStats] = useState<{
    totalFetched: number;
    filtered: number;
  } | null>(null);

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [photoSlideIndex, setPhotoSlideIndex] = useState<Record<string, number>>({});
  const [sortBy, setSortBy] = useState<"rating" | "ratingCount">("rating");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);
    setStats(null);
    setExpandedRow(null);

    try {
      // Parse keywords
      const keywordList = keywords
        .split(/[\n,]+/)
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      if (keywordList.length === 0 && categories.length === 0) {
        throw new Error("Please enter at least one keyword or select a category");
      }

      // Build request payload
      const payload: any = {
        keywords: keywordList,
        categories,
        limit,
        threshold,
      };

      // Add location
      if (location) {
        payload.locationText = location;
      }

      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Search failed");
      }

      const data = await response.json();
      setResults(data.places || []);
      setStats({
        totalFetched: data.totalFetched,
        filtered: data.filtered,
      });
      
      // Show demo mode notification
      if (data.demo) {
        console.log("🎭 Running in DEMO mode with mock data");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setKeywords("");
    setCategories([]);
    setLocation("");
    setLimit(30);
    setThreshold(3.0);
    setResults([]);
    setStats(null);
    setError(null);
    setExpandedRow(null);
  };

  const toggleCategory = (value: string) => {
    setCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const handleExportCSV = () => {
    if (results.length === 0) {
      alert("No results to export");
      return;
    }

    const csv = generateCSV(results);
    const timestamp = new Date().toISOString().split("T")[0];
    downloadCSV(csv, `low-rating-places-${timestamp}.csv`);
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "rating") {
      const ratingA = a.rating ?? 0;
      const ratingB = b.rating ?? 0;
      return sortOrder === "asc" ? ratingA - ratingB : ratingB - ratingA;
    } else {
      const countA = a.userRatingCount ?? 0;
      const countB = b.userRatingCount ?? 0;
      return sortOrder === "asc" ? countA - countB : countB - countA;
    }
  });

  const toggleSort = (newSortBy: "rating" | "ratingCount") => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const toggleExpand = (placeId: string) => {
    setExpandedRow(expandedRow === placeId ? null : placeId);
    if (expandedRow !== placeId) {
      setPhotoSlideIndex((prev) => ({ ...prev, [placeId]: 0 }));
    }
  };

  const getPhotoUrl = (photoName: string, maxWidth = 800) =>
    `/api/places-photo?name=${encodeURIComponent(photoName)}&maxWidth=${maxWidth}`;

  const getGoogleMapsUrl = (place: PlaceDetails) => {
    return (
      place.googleMapsUri ||
      `https://www.google.com/maps/place/?q=place_id:${place.id}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Low Rating Places Finder
          </h1>
          <p className="mt-2 text-gray-600">
            Search for places with ratings below your threshold using Google
            Places API
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Keywords */}
            <div className="md:col-span-2">
              <label
                htmlFor="keywords"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Keywords (one per line or comma-separated)
              </label>
              <textarea
                id="keywords"
                rows={4}
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., restaurant, coffee shop, hotel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Categories */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories (Google Maps place types)
              </label>
              <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {PLACE_TYPES.map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
                    >
                      <input
                        type="checkbox"
                        checked={categories.includes(value)}
                        onChange={() => toggleCategory(value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {categories.length > 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  Selected: {categories.join(", ")}
                </p>
              )}
            </div>

            {/* Location Text */}
            <div className="md:col-span-2">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Location (city, country, address)
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., New York, USA"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Max Results */}
            <div>
              <label
                htmlFor="limit"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Max Results
              </label>
                <input
                  id="limit"
                  type="number"
                  min="1"
                  max="200"
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Rating Threshold */}
            <div>
              <label
                htmlFor="threshold"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Rating Threshold (show places below this)
              </label>
              <input
                id="threshold"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Searching..." : "Search"}
            </button>
            <button
              onClick={handleReset}
              disabled={loading}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
            >
              Reset
            </button>
            <button
              onClick={handleExportCSV}
              disabled={loading || results.length === 0}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            <strong className="font-medium">Error:</strong> {error}
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md mb-6">
            <p>
              <strong>Total places fetched:</strong> {stats.totalFetched} |{" "}
              <strong>Filtered (below threshold):</strong> {stats.filtered} |{" "}
              <strong>Displaying:</strong> {results.length}
            </p>
          </div>
        )}

        {/* Results Table */}
        {results.length > 0 && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleSort("rating")}
                    >
                      Rating{" "}
                      {sortBy === "rating" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleSort("ratingCount")}
                    >
                      Reviews{" "}
                      {sortBy === "ratingCount" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Open Now
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedResults.map((place) => (
                    <>
                      <tr key={place.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {place.displayName?.text || place.name}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              (place.rating ?? 0) < 2
                                ? "bg-red-100 text-red-800"
                                : (place.rating ?? 0) < 3
                                ? "bg-orange-100 text-orange-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {place.rating?.toFixed(1) ?? "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {place.userRatingCount ?? "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                          {place.shortFormattedAddress ||
                            place.formattedAddress ||
                            "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {place.nationalPhoneNumber ||
                            place.internationalPhoneNumber ||
                            "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {place.websiteUri ? (
                            <a
                              href={place.websiteUri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Visit
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {place.currentOpeningHours?.openNow !== undefined ? (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                place.currentOpeningHours.openNow
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {place.currentOpeningHours.openNow
                                ? "Open"
                                : "Closed"}
                            </span>
                          ) : place.regularOpeningHours?.openNow !==
                            undefined ? (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                place.regularOpeningHours.openNow
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {place.regularOpeningHours.openNow
                                ? "Open"
                                : "Closed"}
                            </span>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm space-x-2">
                          <a
                            href={getGoogleMapsUrl(place)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Maps
                          </a>
                          <button
                            onClick={() => toggleExpand(place.id)}
                            className="text-purple-600 hover:underline"
                          >
                            {expandedRow === place.id ? "Hide" : "Details"}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {expandedRow === place.id && (
                        <tr>
                          <td colSpan={9} className="px-4 py-4 bg-gray-50">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                  Full Details
                                </h4>
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <dt className="font-medium text-gray-700">
                                      Full Address:
                                    </dt>
                                    <dd className="text-gray-600">
                                      {place.formattedAddress || "N/A"}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="font-medium text-gray-700">
                                      Business Status:
                                    </dt>
                                    <dd className="text-gray-600">
                                      {place.businessStatus || "N/A"}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="font-medium text-gray-700">
                                      Types:
                                    </dt>
                                    <dd className="text-gray-600">
                                      {place.types?.join(", ") || "N/A"}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="font-medium text-gray-700">
                                      Plus Code:
                                    </dt>
                                    <dd className="text-gray-600">
                                      {place.plusCode?.globalCode || "N/A"}
                                    </dd>
                                  </div>
                                  {place.location && (
                                    <div>
                                      <dt className="font-medium text-gray-700">
                                        Coordinates:
                                      </dt>
                                      <dd className="text-gray-600">
                                        {place.location.latitude.toFixed(6)},{" "}
                                        {place.location.longitude.toFixed(6)}
                                      </dd>
                                    </div>
                                  )}
                                </dl>
                              </div>

                              {/* Opening Hours */}
                              {(place.regularOpeningHours?.weekdayDescriptions ||
                                place.currentOpeningHours
                                  ?.weekdayDescriptions) && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                    Opening Hours
                                  </h4>
                                  <ul className="text-sm text-gray-600 space-y-1">
                                    {(
                                      place.currentOpeningHours
                                        ?.weekdayDescriptions ||
                                      place.regularOpeningHours
                                        ?.weekdayDescriptions ||
                                      []
                                    ).map((desc, idx) => (
                                      <li key={idx}>{desc}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Photos Slider - 4 per page */}
                              {place.photos && place.photos.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                    Photos ({place.photos.length})
                                  </h4>
                                  <div className="relative">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                      {place.photos
                                        .slice(
                                          ((photoSlideIndex[place.id] ?? 0) * 4),
                                          ((photoSlideIndex[place.id] ?? 0) * 4) + 4
                                        )
                                        .map((photo, idx) => (
                                          <div
                                            key={idx}
                                            className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative"
                                          >
                                            <img
                                              src={getPhotoUrl(photo.name, 400)}
                                              alt={`Photo ${((photoSlideIndex[place.id] ?? 0) * 4) + idx + 1}`}
                                              className="w-full h-full object-cover relative z-10"
                                              onError={(e) => {
                                                const el = e.target as HTMLImageElement;
                                                el.style.display = "none";
                                                el.nextElementSibling?.classList.remove("hidden");
                                              }}
                                            />
                                            <div className="hidden absolute inset-0 z-0 flex items-center justify-center bg-gray-200 text-gray-500 text-xs">
                                              Photo unavailable
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                    {place.photos.length > 4 && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setPhotoSlideIndex((prev) => ({
                                              ...prev,
                                              [place.id]: Math.max(
                                                0,
                                                (prev[place.id] ?? 0) - 1
                                              ),
                                            }))
                                          }
                                          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white text-gray-700 disabled:opacity-50"
                                          disabled={(photoSlideIndex[place.id] ?? 0) === 0}
                                        >
                                          ‹
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setPhotoSlideIndex((prev) => ({
                                              ...prev,
                                              [place.id]: Math.min(
                                                Math.ceil((place.photos?.length ?? 0) / 4) - 1,
                                                (prev[place.id] ?? 0) + 1
                                              ),
                                            }))
                                          }
                                          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white text-gray-700 disabled:opacity-50"
                                          disabled={(photoSlideIndex[place.id] ?? 0) >= Math.ceil((place.photos?.length ?? 0) / 4) - 1}
                                        >
                                          ›
                                        </button>
                                        <div className="flex justify-center gap-1 mt-2">
                                          {Array.from({
                                            length: Math.ceil((place.photos?.length ?? 0) / 4),
                                          }).map((_, pageIdx) => (
                                            <button
                                              key={pageIdx}
                                              type="button"
                                              onClick={() =>
                                                setPhotoSlideIndex((prev) => ({
                                                  ...prev,
                                                  [place.id]: pageIdx,
                                                }))
                                              }
                                              className={`w-2 h-2 rounded-full transition-colors ${
                                                (photoSlideIndex[place.id] ?? 0) === pageIdx
                                                  ? "bg-blue-600"
                                                  : "bg-gray-300 hover:bg-gray-400"
                                              }`}
                                            />
                                          ))}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Reviews */}
                              {place.reviews && place.reviews.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                    Reviews ({place.reviews.length})
                                  </h4>
                                  <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                                    {place.reviews.map((review, idx) => (
                                      <div
                                        key={idx}
                                        className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
                                      >
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                          <span className="text-sm font-medium text-gray-900">
                                            {review.authorAttribution
                                              ?.displayName || "Anonymous"}
                                          </span>
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                            ★ {review.rating}/5
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {review.relativePublishTimeDescription}
                                          </span>
                                        </div>
                                        {(review.text?.text || review.originalText?.text) && (
                                          <p className="text-sm text-gray-600 leading-relaxed">
                                            {review.text?.text || review.originalText?.text}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && results.length === 0 && stats && (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p className="text-gray-500">
              No places found matching your criteria. Try adjusting your search
              parameters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
