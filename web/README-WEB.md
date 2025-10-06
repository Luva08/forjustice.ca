# Web Frontend - forjustice.ca

Next.js web application for the forjustice.ca platform.

## Features

- **Server-Side Rendering**: Fast initial page loads
- **Static Generation**: Optimized performance
- **API Routes**: Backend integration
- **Responsive Design**: Mobile-friendly UI
- **Security Headers**: Production-ready security

## Prerequisites

- Node.js 18+

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building

```bash
npm run build
npm start
```

## Testing

```bash
npm test
```

## Docker

Build the image:
```bash
docker build -t forjustice-web .
```

Run the container:
```bash
docker run -p 3000:8080 forjustice-web
```

## Pages

- `/` - Home page
- `/auth` - Login/Register
- More pages to be added...

## Environment Variables

See `.env.example` for required environment variables.

## Production Deployment

The app is configured for Cloud Run deployment with:
- Standalone output mode
- Optimized Docker image
- Security headers
- Health checks
