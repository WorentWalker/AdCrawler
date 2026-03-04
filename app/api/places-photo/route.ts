import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

/**
 * Proxy for Google Places photo media - fetches image and returns it
 * to avoid exposing API key on client
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const maxWidth = searchParams.get("maxWidth") || "800";

  if (!name) {
    return NextResponse.json({ error: "Missing name parameter" }, { status: 400 });
  }

  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const mediaUrl = `https://places.googleapis.com/v1/${name}/media?key=${API_KEY}&maxWidthPx=${maxWidth}`;

  try {
    const response = await fetch(mediaUrl, { redirect: "follow" });
    if (!response.ok) {
      return NextResponse.json(
        { error: `Photo fetch failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache 24h
      },
    });
  } catch (error: any) {
    console.error("Places photo proxy error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch photo" },
      { status: 500 }
    );
  }
}
