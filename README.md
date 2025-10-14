# BlockHaven Exchange

A modern cryptocurrency exchange platform built with React, TypeScript, and Vite.

## Features

- Real-time cryptocurrency exchange rates
- Support for multiple cryptocurrencies
- User authentication and profiles
- Transaction tracking
- Admin dashboard
- Responsive design with dark/light theme support
- Chat support integration

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI, shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun package manager

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd blockhaven-exchange
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```bash
VITE_API_BASE_URL=your_backend_api_url
```

4. Start the development server:
```bash
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:9009`

## Building for Production

```bash
npm run build
# or
bun run build
```

This will create a `dist` folder with optimized production files.

## Preview Production Build

```bash
npm run preview
# or
bun run preview
```

## Deployment

The application can be deployed to any static hosting service like Vercel, Netlify, or AWS S3 + CloudFront.

### Environment Configuration

Make sure to set the following environment variables in your production environment:

- `VITE_API_BASE_URL`: Your backend API URL

## License

This project is proprietary software. All rights reserved.
