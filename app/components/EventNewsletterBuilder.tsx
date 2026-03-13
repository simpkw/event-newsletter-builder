import React, { useState } from 'react';
import axios from 'axios';

interface Event {
  id: string;
  name: string;
  date: string;
  image: string;
  url: string;
  venue?: string;
}

interface EventResponse {
  id: string;
  name: string;
  eventDate: string;
  imageUrl: string;
  ticketUrl: string;
  venue?: string;
}

const EventNewsletterBuilder = () => {
  const [eventIdInput, setEventIdInput] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch individual event by ID
  const fetchEventById = async (eventId: string) => {
    if (!eventId.trim()) {
      setError('Please enter a valid event ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const response = await axios.get(`http://api.ticketweb.com/api/events/${eventId}`);
      const eventData: EventResponse = response.data;

      // Check if event already exists in the list
      if (events.some((e) => e.id === eventId)) {
        setError('This event is already added to your newsletter');
        setLoading(false);
        return;
      }

      // Check if we've reached the 10 event limit
      if (events.length >= 10) {
        setError('You have reached the maximum of 10 events per newsletter');
        setLoading(false);
        return;
      }

      // Transform API response to Event interface
      const newEvent: Event = {
        id: eventData.id,
        name: eventData.name,
        date: eventData.eventDate,
        image: eventData.imageUrl,
        url: eventData.ticketUrl,
        venue: eventData.venue || 'Denver, CO',
      };

      setEvents([...events, newEvent]);
      setEventIdInput('');
      setSuccessMessage(`Added "${newEvent.name}" to your newsletter`);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError('Event not found. Please check the event ID and try again.');
      } else {
        setError('Failed to fetch event. Please try again.');
      }
