# event-newsletter-builder

Event Newsletter Builder — Pull events from the Ticketmaster Discovery API and export a ready-to-send HTML email newsletter.

## Features

- Look up events by Ticketmaster event ID
- Add up to 10 events per newsletter
- Configurable newsletter title and city/location
- Live in-browser preview of the generated email
- One-click HTML export (email-client–ready table layout)

## Getting Started

### Prerequisites

- Node.js 18 or later
- A free Ticketmaster API key — register at [developer.ticketmaster.com](https://developer.ticketmaster.com/)

### API key setup

Copy the example env file and add your key:

```bash
cp .env.local.example .env.local
# then edit .env.local and set TICKETMASTER_API_KEY=<your key>
```

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
2. Type a Ticketmaster **Event ID** and click **Add Event** or press Enter.
3. Repeat for up to 10 events.
4. Click **Show Preview** to see a live render of the newsletter inside the page.
5. Click **Export HTML** to download the email-ready `.html` file.

## Deploying to Vercel

The app is a standard Next.js 14 project. Before deploying, you need to add your Ticketmaster API key as an environment variable in Vercel.

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsimpkw%2Fevent-newsletter-builder&env=TICKETMASTER_API_KEY&envDescription=Ticketmaster%20Discovery%20API%20key%20from%20developer.ticketmaster.com)

### Manual deploy

1. Push this branch to GitHub (or merge the open PR into `main`).
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Under **Environment Variables**, add `TICKETMASTER_API_KEY` with your key.
4. Vercel will auto-detect Next.js and set the build command to `next build`. Click **Deploy**.

### What to test after deployment

- Open the deployed URL and confirm the page loads.
- Enter a Ticketmaster event ID and click **Add Event** — the `/api/events` serverless function should proxy the Ticketmaster Discovery API and return event data.
- Add a few events, toggle **Show Preview**, and verify the newsletter renders inside the page.
- Click **Export HTML** and confirm the downloaded file opens correctly in a browser.

## Project Structure

```
app/
  components/
    EventNewsletterBuilder.tsx   # Main UI component
  api/
    events/
      route.ts                   # Next.js API route — proxies Ticketmaster Discovery API
  layout.tsx
  page.tsx
  globals.css
```
