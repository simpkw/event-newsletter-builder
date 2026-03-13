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

## Deploying to Vercel

The app is a standard Next.js 14 project and deploys to Vercel with **zero configuration** — no environment variables required.

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsimpkw%2Fevent-newsletter-builder)

### Manual deploy

1. Push this branch to GitHub (or merge the open PR into `main`).
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Vercel will auto-detect Next.js and set the build command to `next build`. Click **Deploy**.

### What to test after deployment

- Open the deployed URL and confirm the page loads.
- Enter a TicketWeb event ID (e.g. `13829814`) and click **Add Event** — the `/api/events` serverless function should proxy the TicketWeb API and return event data.
- Add a few events, toggle **Show Preview**, and verify the newsletter renders inside the page.
- Click **Export HTML** and confirm the downloaded file opens correctly in a browser.

> **Note:** The TicketWeb API endpoint (`http://api.ticketweb.com`) uses plain HTTP. Vercel serverless functions make outbound requests server-side, so there is no mixed-content issue in the browser.

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
