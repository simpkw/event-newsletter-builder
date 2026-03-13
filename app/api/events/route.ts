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
      { error: 'TICKETMASTER_API_KEY is not configured. Add it to your .env.local file.' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events/${encodeURIComponent(eventId)}.json?apikey=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.fault?.faultstring ?? 'Event not found', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event', details: String(error) },
      { status: 500 }
    );
  }
}
