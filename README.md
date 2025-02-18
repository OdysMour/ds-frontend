# Pet Insurance Management System Frontend

## Overview

A modern web application built with Svelte 5 and TypeScript that provides a user-friendly interface for managing pet insurance services. The application includes features for user authentication, animal management, and administrative controls.

## Technologies

- Svelte 5
- TypeScript
- TailwindCSS
- Bun
- Zod (for schema validation)
- Vite

## Prerequisites

- Bun (latest version)
- Node.js 18+ (for certain development tools)

## Project Structure

```
src/
├── lib/                 # Shared libraries and utilities
│   ├── api/            # API client implementations
│   ├── images/         # Static images
│   ├── api.ts          # Base API configuration
│   ├── auth.ts         # Authentication utilities
│   ├── config.ts       # Application configuration
│   ├── schemas.ts      # Zod validation schemas
│   └── types.ts        # TypeScript type definitions
│
├── routes/             # SvelteKit routes
│   ├── admin/         # Admin-only pages
│   ├── animals/       # Animal management pages
│   ├── profile/       # User profile pages
│   ├── signin/        # Authentication pages
│   └── signup/        # Registration pages
│
└── app.html           # HTML template
```

## Getting Started

1. Clone the repository

2. Install dependencies:
   ```bash
   bun install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   bun run dev
   ```

The application will be available at `http://localhost:5173`

## Environment Variables

Required environment variables:

```env
PUBLIC_API_URL=http://localhost:8080/api
PUBLIC_RATE_LIMIT=100
```

## Available Scripts

```bash
# Development
bun run dev         # Start development server
bun run build       # Build for production
bun run preview     # Preview production build
bun run check       # Type-check TypeScript
bun run lint        # Run ESLint
bun run format      # Format code with Prettier
```

## Features

### Authentication

- User registration
- Login/Logout functionality
- JWT token management
- Protected routes
- Role-based access control

### Animal Management

- List all registered animals
- Add new animals
- View detailed animal information
- Update animal details
- Record health checks

### Admin Features

- User management
- System-wide animal management
- Access control management

## Component Development

### Styling

The project uses TailwindCSS for styling. Custom styles can be added in:

```
src/app.css               # Global styles
src/routes/*/*.svelte    # Component-specific styles
```

### Type Safety

- TypeScript for type checking
- Zod schemas for runtime validation
- Type-safe API calls

### State Management

- Svelte stores for global state
- SvelteKit form actions for form handling
- Server-side rendering for improved performance

## API Integration

The frontend communicates with the backend through a RESTful API:

```typescript
// Example API call using the custom client
import { api } from '$lib/api';

const getAnimals = async () => {
  const response = await api.get('/animals');
  return response.data;
};
```

## Error Handling

The application includes comprehensive error handling for:

- API errors
- Form validation
- Authentication failures
- Network issues
- Rate limiting

## Performance Optimization

- Route-based code splitting
- Image optimization
- Lazy loading
- Service worker for offline support

## Testing

```bash
bun run test        # Run unit tests
bun run test:e2e   # Run end-to-end tests
```

## Production Deployment

1. Build the application:
   ```bash
   bun run build
   ```

2. The built application will be in the `build` directory

3. Deploy the contents of the `build` directory to your hosting provider

## Browser Support

The application supports modern browsers that implement ES2020+ features.

## Contributing

1. Create a new branch for your feature
2. Write tests for new functionality
3. Ensure all tests pass
4. Submit a pull request

## License

This project is licensed under the MIT License.
