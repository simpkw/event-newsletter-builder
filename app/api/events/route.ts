import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get('eventid');

  if (!eventId) {
    return NextResponse.json(
      { error: 'Event ID is required' },
      { status: 400 }
    );
  }

  try {
    console.log(`Fetching event: ${eventId}`);
    
    const response = await fetch(
      `http://api.ticketweb.com/api/events?eventid=${eventId}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    console.log(`Response status: ${response.status}`);
    const data = await response.json();
    console.log(`Response data:`, data);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Event not found', details: data },
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
