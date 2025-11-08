# Les Jokers d'Aubagne Roller Hockey Club

## Overview

This is a web application for Les Jokers d'Aubagne, a roller hockey club established in 1997 in Aubagne, France. The application serves as the club's digital presence, providing information about the club, team categories, news/events, a merchandise shop with shopping cart functionality, and contact information. The site targets families and potential players aged 6-25 years old, showcasing the club's offerings across youth and adult categories.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**Routing**: Client-side routing implemented with Wouter, a lightweight React router. The application has a simple route structure with dedicated pages for Home, Club information, Shop, and Contact.

**UI Component System**: shadcn/ui component library built on Radix UI primitives, providing accessible, customizable components with Tailwind CSS styling. Components follow the "new-york" style variant with custom theming based on the club's purple and yellow colors.

**Design System**: 
- Typography uses Montserrat for headers/CTAs and Inter for body text
- Spacing follows Tailwind's 4px-based scale
- Custom CSS variables for theming with light/dark mode support
- Responsive design with mobile-first approach using Tailwind breakpoints

**State Management**: 
- TanStack Query (React Query) for server state management with custom query client configuration
- React Context API for client-side state (CartContext for shopping cart functionality)
- Local component state using React hooks

**Styling**: Tailwind CSS with custom configuration extending the default theme. Custom utilities for elevation effects (hover-elevate, active-elevate-2) and color system based on HSL values for dynamic theming.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript support via tsx in development.

**Build Strategy**: 
- Client: Vite builds the React application to `dist/public`
- Server: esbuild bundles the Express server to `dist/index.js`
- Development: Vite dev server with HMR integrated as Express middleware

**Storage Layer**: Currently uses in-memory storage (MemStorage class) implementing a defined IStorage interface. The interface is designed to be easily swappable with a database-backed implementation. Includes basic user CRUD operations with UUID-based identifiers.

**API Design**: RESTful API structure with routes prefixed with `/api`. The routing system is set up in `server/routes.ts` but routes are not yet implemented, providing a clean foundation for future API endpoints.

**Session Management**: Infrastructure includes connect-pg-simple for potential PostgreSQL-backed sessions, though not currently active.

### Data Storage Solutions

**Database Setup**: Drizzle ORM configured for PostgreSQL with the Neon serverless driver. Schema defined in `shared/schema.ts` with a users table as the initial structure. Database migrations are output to the `migrations` directory.

**Schema Design**: 
- Type-safe schema definitions using Drizzle ORM
- Zod schemas generated from Drizzle schemas for runtime validation
- Shared types between client and server via the `@shared` module alias

**Current State**: Database connection configured but the application currently uses in-memory storage. The storage interface pattern allows seamless migration to database-backed storage when needed.

### External Dependencies

**UI Component Libraries**:
- Radix UI primitives for accessible, unstyled components
- Lucide React for iconography
- embla-carousel-react for carousel functionality
- cmdk for command palette patterns
- date-fns for date manipulation

**Development Tools**:
- Replit-specific plugins for development experience (vite-plugin-runtime-error-modal, vite-plugin-cartographer, vite-plugin-dev-banner)
- TypeScript for type safety across the entire stack
- PostCSS with Tailwind CSS and Autoprefixer for styling

**Database & ORM**:
- @neondatabase/serverless for PostgreSQL connection
- Drizzle ORM for type-safe database queries
- drizzle-kit for schema migrations
- drizzle-zod for schema validation

**Form Management**:
- React Hook Form infrastructure via @hookform/resolvers (configured but not extensively used yet)

**Asset Management**: Static assets stored in `attached_assets` directory with generated images for team photos, products, and hero sections. Images are imported using Vite's asset handling via the `@assets` alias.

**Design Guidelines**: Material Design principles referenced in `design_guidelines.md` with inspiration from modern sports club websites. Purple and yellow club colors are intended to be implemented throughout the color system.