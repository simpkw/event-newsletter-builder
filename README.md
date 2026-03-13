# event-newsletter-builder

Event Newsletter Builder — Pull events from the TicketWeb API and export a ready-to-send HTML email newsletter.

## Features

- Look up events by TicketWeb event ID
- Add up to 10 events per newsletter
- Configurable newsletter title and city/location
- Live in-browser preview of the generated email
- One-click HTML export (email-client–ready table layout)

## Getting Started

### Prerequisites

- Node.js 18 or later

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Usage

1. Enter a **Newsletter Title** and **City / Location** in the settings panel (defaults: "THE WEEKLY MIX" / "DENVER").
2. Type a TicketWeb **Event ID** (e.g. `13829814`) and click **Add Event** or press Enter.
3. Repeat for up to 10 events.
4. Click **Show Preview** to see a live render of the newsletter inside the page.
5. Click **Export HTML** to download the email-ready `.html` file.

## Project Structure

```
app/
  components/
    EventNewsletterBuilder.tsx   # Main UI component
  api/
    events/
      route.ts                   # Next.js API route — proxies TicketWeb API
  layout.tsx
  page.tsx
  globals.css
```
