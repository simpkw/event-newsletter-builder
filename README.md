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
- A **TicketWeb API key** (required to fetch event data)

### Install dependencies

```bash
npm install
```

### Configure environment variables

Copy the example file and add your TicketWeb API key:

```bash
cp .env.example .env.local
```

Then open `.env.local` and set your key:

```
TICKETWEB_API_KEY=your_ticketweb_api_key_here
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

The app is a standard Next.js 14 project. It requires one environment variable (`TICKETWEB_API_KEY`) to be set in the Vercel dashboard so the serverless function can authenticate with the TicketWeb API.

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsimpkw%2Fevent-newsletter-builder)

### Manual deploy

1. Push this branch to GitHub (or merge the open PR into `main`).
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Vercel will auto-detect Next.js and set the build command to `next build`.
4. Before clicking **Deploy**, open **Environment Variables** and add:
   - **Name:** `TICKETWEB_API_KEY`
   - **Value:** your TicketWeb API key
5. Click **Deploy**.

You can also add or update the variable later under **Project Settings → Environment Variables**, then redeploy.

### What to test after deployment

- ✅ The page loads and the newsletter builder UI is fully functional.
- ✅ The **Newsletter Title** and **City / Location** fields can be edited.
- ✅ Enter a TicketWeb event ID (e.g. `13829814`) and click **Add Event** — the `/api/events` serverless function should proxy the TicketWeb API and return event data.
- ✅ **Show Preview** renders a live preview of the newsletter inside the page.
- ✅ **Export HTML** downloads an email-ready `.html` file.

> ⚠️ **Security note:** The TicketWeb API endpoint uses plain HTTP (`http://api.ticketweb.com`). This means your API key and response data are transmitted unencrypted between Vercel's servers and the TicketWeb API. Vercel serverless functions make these outbound requests server-side, so the key is never exposed to end-users in the browser; however, it is visible to any network intermediary between Vercel and TicketWeb. There is no HTTPS alternative available from TicketWeb at this time.

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
