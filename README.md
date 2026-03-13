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
- A **Ticketmaster API key** — get a free key at [developer.ticketmaster.com](https://developer.ticketmaster.com/)

### Install dependencies

```bash
npm install
```

### Configure environment variables

Copy the example file and add your Ticketmaster API key:

```bash
cp .env.example .env.local
```

Then open `.env.local` and set your key:

```
TICKETMASTER_API_KEY=your_ticketmaster_api_key_here
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
2. Find an event on [ticketmaster.com](https://www.ticketmaster.com/) and copy its **Event ID** from the URL (e.g. the URL `https://www.ticketmaster.com/event/Z7r9jZ1AdJfpk` gives ID `Z7r9jZ1AdJfpk`). Click **Add Event** or press Enter.
3. Repeat for up to 10 events.
4. Click **Show Preview** to see a live render of the newsletter inside the page.
5. Click **Export HTML** to download the email-ready `.html` file.

## Deploying to Vercel

The app is a standard Next.js 14 project. It requires one environment variable (`TICKETMASTER_API_KEY`) to be set in the Vercel dashboard so the serverless function can authenticate with the Ticketmaster Discovery API.

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsimpkw%2Fevent-newsletter-builder)

### Manual deploy

1. Push this branch to GitHub (or merge the open PR into `main`).
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Vercel will auto-detect Next.js and set the build command to `next build`.
4. Before clicking **Deploy**, open **Environment Variables** and add:
   - **Name:** `TICKETMASTER_API_KEY`
   - **Value:** your Ticketmaster API key
5. Click **Deploy**.

You can also add or update the variable later under **Project Settings → Environment Variables**, then redeploy.

### What to test after deployment

- ✅ The page loads and the newsletter builder UI is fully functional.
- ✅ The **Newsletter Title** and **City / Location** fields can be edited.
- ✅ Find a Ticketmaster event ID (e.g. from a URL like `https://www.ticketmaster.com/event/Z7r9jZ1AdJfpk`) and click **Add Event** — the `/api/events` serverless function proxies the Ticketmaster Discovery API and returns event data.
- ✅ **Show Preview** renders a live preview of the newsletter inside the page.
- ✅ **Export HTML** downloads an email-ready `.html` file.

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
