'use client';

import React, { useState, useCallback } from 'react';
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
  eventid: string;
  eventname: string;
  dates: {
    startdate: string;
  };
  eventimages: {
    large: string;
  };
  eventurl: string;
  venue: {
    name: string;
    city: string;
    state: string;
  };
}

const EventNewsletterBuilder = () => {
  const [eventIdInput, setEventIdInput] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newsletterTitle, setNewsletterTitle] = useState('THE WEEKLY MIX');
  const [newsletterCity, setNewsletterCity] = useState('DENVER');

  // Parse date from TicketWeb format (20250623100000) to readable format
  const parseTicketWebDate = (dateString: string): string => {
    try {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      return `${month}/${day}/${year}`;
    } catch {
      return 'Date TBD';
    }
  };

  const fetchEventById = async (eventId: string) => {
    if (!eventId.trim()) {
      setError('Please enter a valid event ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const response = await axios.get(`/api/events?eventid=${eventId}`);
      
      // Check if events array exists and has data
      if (!response.data.events || response.data.events.length === 0) {
        setError('Event not found. Please check the event ID and try again.');
        setLoading(false);
        return;
      }

      const eventData: EventResponse = response.data.events[0];

      if (events.some((e) => e.id === eventData.eventid)) {
        setError('This event is already added to your newsletter');
        setLoading(false);
        return;
      }

      if (events.length >= 10) {
        setError('You have reached the maximum of 10 events per newsletter');
        setLoading(false);
        return;
      }

      const newEvent: Event = {
        id: eventData.eventid,
        name: eventData.eventname,
        date: parseTicketWebDate(eventData.dates.startdate),
        image: eventData.eventimages.large || 'https://via.placeholder.com/200x160?text=No+Image',
        url: eventData.eventurl,
        venue: `${eventData.venue.city}, ${eventData.venue.state}`,
      };

      setEvents([...events, newEvent]);
      setEventIdInput('');
      setSuccessMessage(`Added "${newEvent.name}" to your newsletter`);
    } catch (err) {
      console.error('API Error:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError('Event not found. Please check the event ID and try again.');
        } else if (err.message === 'Network Error') {
          setError('Network error. Please check your connection.');
        } else {
          setError('Failed to fetch event. Please try again.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeEvent = (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId));
  };

  const generateNewsletterHTML = useCallback(() => {
    let html = '<table class="row row-event" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0">';
    
    for (const event of events) {
      html += `<tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#000;color:#000;width:600px;margin:0 auto" width="600"><tbody><tr><td class="column column-1" width="33.333333333333336%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top"><table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td class="pad" style="width:100%"><div class="alignment" align="center"><div style="max-width:200px"><a href="${event.url}" target="_blank"><img src="${event.image}" style="display:block;height:auto;border:0;width:100%" width="200" alt="${event.name}" height="auto"></a></div></div></td></tr></table></td><td class="column column-2" width="50%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top"><table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td class="pad" style="text-align:center;width:100%"><h1 style="margin:0;color:#fff;direction:ltr;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:24px;font-weight:700;letter-spacing:normal;line-height:1.2;text-align:center;margin-top:0;margin-bottom:0;">${event.name}</h1></td></tr></table><table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation"><tr><td class="pad"><div style="color:#fff;direction:ltr;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:18px;font-weight:700;letter-spacing:0;line-height:1.2;text-align:center;"><p style="margin:0">${event.venue}</p></div></td></tr></table><table class="paragraph_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation"><tr><td class="pad"><div style="color:#fff;direction:ltr;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:18px;font-weight:400;letter-spacing:0;line-height:1.2;text-align:center;"><p style="margin:0">${event.date}</p></div></td></tr></table><table class="button_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation"><tr><td class="pad"><div class="alignment" align="center"><a href="${event.url}" target="_blank" style="color:#000000;text-decoration:none;"><span style="background-color: #ffffff; border-radius: 4px; color: #000000; display: inline-block; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 14px; font-weight: 400; padding-bottom: 5px; padding-top: 5px; padding-left: 20px; padding-right: 20px; text-align: center;"><span style="word-break: break-word; line-height: 28px;">Buy Tickets</span></span></a></div></td></tr></table></td></tr></tbody></table></td></tr></tbody>`;
    }

    html += '</table>';

    const fullHTML = `<!DOCTYPE html><html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"><head><title>Event Newsletter</title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0;padding:0}a[x-apple-data-detectors]{color:inherit!important;text-decoration:inherit!important}#MessageViewBody a{color:inherit;text-decoration:none}p{line-height:inherit}.desktop_hide,.desktop_hide table{mso-hide:all;display:none;max-height:0;overflow:hidden}.image_block img+div{display:none}sub,sup{font-size:75%;line-height:0}@media (max-width:620px){.mobile_hide{display:none}.row-content{width:100%!important}.stack .column{width:100%;display:block}.mobile_hide{min-height:0;max-height:0;max-width:0;overflow:hidden;font-size:0}.desktop_hide,.desktop_hide table{display:table!important;max-height:none!important}}</style></head><body class="body" style="background-color:#ebebeb;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none"><table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#ebebeb"><tbody><tr><td><table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#000;border-radius:0;color:#000;width:600px;margin:0 auto" width="600"><tbody><tr><td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top"><table class="text_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td class="pad" style="padding-left:10px;padding-right:10px;padding-top:25px"><div style="font-family:sans-serif"><div style="font-size:14px;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;mso-line-height-alt:16.8px;color:#555;line-height:1.2"><p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px"><span style="word-break: break-word; font-size: 16px;"><em><span style="word-break: break-word; color: #ffffff;">${newsletterTitle}</span></em></span></p><p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px"><span style="word-break: break-word; font-size: 46px;"><strong><span style="word-break: break-word; color: #ffffff;">${newsletterCity}</span></strong></span></p></div></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#000;border-radius:0;color:#000;width:600px;margin:0 auto" width="600"><tbody><tr><td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top"><table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td class="pad" style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:10px"><div style="font-family:sans-serif"><div style="font-size:14px;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;mso-line-height-alt:16.8px;color:#555;line-height:1.2"><p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px"><span style="word-break: break-word; font-size: 24px;"><strong><span style="word-break: break-word; color: #ffffff;">COMING SOON</span></strong></span></p></div></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table>${html}<tr><td><table class="row row-footer" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#ebebeb"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#000;color:#000;width:600px;margin:0 auto" width="600"><tbody><tr><td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-bottom:5px;padding-top:5px;"><table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation"><tr><td class="pad"><div style="font-family:sans-serif"><div style="font-size:12px;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;mso-line-height-alt:14.4px;color:#555;line-height:1.2"><p style="margin:0;text-align:center;font-size:10px;color:#ffffff;">FIND YOUR NEXT EVENT HERE</p><p style="margin:0;text-align:center;font-size:10px;color:#ffffff;margin-top:10px;">© 2026 Events. All rights reserved.</p></div></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html>`;

    return fullHTML;
  }, [events, newsletterTitle, newsletterCity]);

  const exportHTML = () => {
    const htmlContent = generateNewsletterHTML();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));
    element.setAttribute('download', `newsletter-${new Date().getTime()}.html`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchEventById(eventIdInput);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Event Newsletter Builder</h1>
          <p className="text-gray-400">Add up to 10 events by their ID, preview your newsletter, and export as HTML</p>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4 flex items-center gap-2">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded mb-4 flex items-center gap-2">
            <span>✓</span>
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4">Newsletter Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Newsletter Title</label>
                  <input
                    type="text"
                    value={newsletterTitle}
                    onChange={(e) => setNewsletterTitle(e.target.value)}
                    placeholder="e.g., THE WEEKLY MIX"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">City / Location</label>
                  <input
                    type="text"
                    value={newsletterCity}
                    onChange={(e) => setNewsletterCity(e.target.value)}
                    placeholder="e.g., DENVER"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2 border-t border-gray-700">
                  <h3 className="text-lg font-bold mb-3 pt-2">Add Events</h3>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Event ID</label>
                    <input
                      type="text"
                      value={eventIdInput}
                      onChange={(e) => setEventIdInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter event ID (e.g., 13829814)"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      disabled={loading || events.length >= 10}
                    />
                  </div>
                  <button
                    onClick={() => fetchEventById(eventIdInput)}
                    disabled={loading || events.length >= 10}
                    className="w-full mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition"
                  >
                    {loading ? 'Loading...' : 'Add Event'}
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-3">
                    Events added: <span className="font-bold text-white">{events.length}/10</span>
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(events.length / 10) * 100}%` }}
                    />
                  </div>
                </div>

                {events.length > 0 && (
                  <div className="pt-4 space-y-2">
                    <button
                      onClick={() => setPreviewMode(!previewMode)}
                      className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
                    >
                      {previewMode ? '👁️ Hide Preview' : '👁️ Show Preview'}
                    </button>
                    <button
                      onClick={exportHTML}
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
                    >
                      📥 Export HTML
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {events.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-12 text-center">
                <p className="text-gray-400 text-lg">No events added yet</p>
                <p className="text-gray-500 text-sm mt-2">Add event IDs to get started building your newsletter</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Added Events ({events.length}/10)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map((event, index) => (
                    <div
                      key={event.id}
                      className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition"
                    >
                      <div className="relative h-40 overflow-hidden bg-gray-900">
                        <img
                          src={event.image}
                          alt={event.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs font-semibold">
                          #{index + 1}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold mb-2 line-clamp-2">{event.name}</h3>
                        <div className="space-y-1 text-sm text-gray-400 mb-3">
                          <p>📅 {event.date}</p>
                          <p>📍 {event.venue}</p>
                          <p className="text-gray-500 text-xs">ID: {event.id}</p>
                        </div>
                        <button
                          onClick={() => removeEvent(event.id)}
                          className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-semibold transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {previewMode && events.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Newsletter Preview</h2>
            <div className="bg-white rounded overflow-hidden shadow-lg">
              <iframe
                srcDoc={generateNewsletterHTML()}
                title="Newsletter Preview"
                className="w-full border-0"
                style={{ height: '600px' }}
                sandbox=""
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventNewsletterBuilder;
