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
    const response = await fetch(
      `http://api.ticketweb.com/api/events?eventid=${eventId}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}
