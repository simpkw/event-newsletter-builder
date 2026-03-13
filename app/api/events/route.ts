import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get('eventid');

  if (!eventId) {
    return NextResponse.json(
      { error: 'Event ID is required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Server is not configured: TICKETMASTER_API_KEY environment variable is missing' },
      { status: 500 }
    );
  }

  try {
    console.log(`Fetching event: ${eventId}`);

    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events/${encodeURIComponent(eventId)}.json?apikey=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    console.log(`Response status: ${response.status}`);

    if (response.status === 404) {
      return NextResponse.json(
        { error: 'Event not found. Please check the event ID and try again.' },
        { status: 404 }
      );
    }

    if (response.status === 401 || response.status === 403) {
      return NextResponse.json(
        { error: 'Invalid Ticketmaster API key. Please check the TICKETMASTER_API_KEY value in your environment settings.' },
        { status: 401 }
      );
    }

    if (response.status === 429) {
      return NextResponse.json(
        { error: 'Ticketmaster API rate limit reached. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: `Ticketmaster API error (status ${response.status})`, details: errData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`Response data:`, data);

    // Select the best image: prefer 16_9 ratio at ≥640 px wide, then any 16_9, then first available
    const images: Array<{ url: string; width?: number | string; ratio?: string }> = data.images || [];
    const bestImage =
      images.find((img) => img.ratio === '16_9' && Number(img.width) >= 640) ||
      images.find((img) => img.ratio === '16_9') ||
      images[0];

    const venue = data._embedded?.venues?.[0];

    // Transform into the shape the component's EventResponse interface expects
    const transformed = {
      events: [
        {
          eventid: data.id,
          eventname: data.name,
          dates: {
            startdate: data.dates?.start?.localDate || '',
          },
          eventimages: {
            large: bestImage?.url || '',
          },
          eventurl: data.url,
          venue: {
            name: venue?.name || '',
            city: venue?.city?.name || '',
            state: venue?.state?.stateCode || '',
          },
        },
      ],
    };

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event', details: String(error) },
      { status: 500 }
    );
  }
}
