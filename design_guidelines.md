# Design Guidelines: Les Jokers d'Aubagne Roller Hockey Club

## Design Approach

**Reference-Based Approach**: Drawing inspiration from modern sports club websites (Nike Training Club, local sports associations) combined with Material Design principles for structure. Focus on energy, community, and accessibility for ages 6-25.

**Color Notes**: User requested purple tones reflecting club colors (purple and yellow) - to be implemented in color system phase.

## Typography System

**Font Stack**: 
- Primary: "Montserrat" (Bold, SemiBold, Medium) - Headers, navigation, CTAs
- Secondary: "Inter" (Regular, Medium) - Body text, captions

**Hierarchy**:
- H1: text-5xl lg:text-6xl font-bold (Hero headlines)
- H2: text-4xl lg:text-5xl font-bold (Section titles)
- H3: text-2xl lg:text-3xl font-semibold (Sub-sections)
- Body: text-base lg:text-lg (Content)
- Small: text-sm (Captions, metadata)

## Layout System

**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16, 20
- Component padding: p-6 to p-8
- Section spacing: py-16 lg:py-20
- Card gaps: gap-6 to gap-8
- Tight elements: space-y-4

**Container Strategy**:
- Max-width: max-w-7xl
- Page padding: px-4 md:px-8
- Content sections: max-w-4xl for text-heavy areas

## Core Components

### Navigation
- Sticky header with club logo (left), horizontal menu (center), CTA button "Nous Rejoindre" (right)
- Mobile: Hamburger menu with full-screen overlay
- Height: h-16 lg:h-20

### Hero Section (Home)
- Large hero image showcasing team action shots or youth players
- Overlay with club name, tagline, and primary CTA
- Height: 70vh with dynamic content positioning
- Dual CTAs: "Voir les Actualités" and "Nous Contacter"

### News/Events Cards
- 3-column grid (lg:grid-cols-3 md:grid-cols-2 grid-cols-1)
- Card structure: Image top (aspect-video), date badge (absolute top-right), title, excerpt, "Lire plus" link
- Rounded corners: rounded-xl
- Shadow: shadow-lg on hover

### Team Categories Section
- Age group cards: 6-10 ans, 11-14 ans, 15-18 ans, Adultes (19-25 ans)
- Icon + title + description format
- 2x2 grid on desktop, stack on mobile

### Contact Page Components
- Two-column layout (lg:grid-cols-2)
- Left: Contact form (name, email, phone, message, category dropdown)
- Right: Info cards - Training schedule table, address with map embed placeholder, social media links
- Form inputs: rounded-lg, p-4 spacing

### Footer
- Three columns: Quick links, Training schedule summary, Contact info + social icons
- Newsletter signup form integrated
- Club founding year "Depuis 1997" badge
- Mobile: stacks vertically

## Images

**Hero Image**: Action shot of roller hockey players mid-game or youth team group photo. Full-width, 70vh height with gradient overlay for text legibility.

**News Cards**: Event photos, match highlights, training sessions - aspect ratio 16:9.

**Team Categories**: Sport-themed icons or silhouettes representing different age groups.

**Contact Page**: Optional map integration showing club location at 13bis Avenue Fallen, Aubagne.

## Component Details

### Buttons
- Primary: Large touch targets (px-8 py-3), rounded-full, font-semibold
- Secondary: Outlined version with border-2
- Buttons on images: backdrop-blur-sm bg-white/20 treatment

### Info Cards
- Background: Subtle card elevation
- Padding: p-6 lg:p-8
- Border radius: rounded-xl
- Icon size: w-12 h-12 for category icons

### Schedule Table
- Striped rows for readability
- Columns: Day, Time, Category, Location
- Mobile: Card-based layout instead of table

### Match/Event Badges
- Pill-shaped: rounded-full px-4 py-1
- For dates, categories, status (Prochain Match, Événement Passé)

## Animations

**Minimal Approach**:
- Smooth page transitions only
- Card hover: subtle lift (transform scale-105) with shadow increase
- Button hover: slight scale (scale-105)
- No scroll-triggered animations
- No complex hero animations

## Page-Specific Layouts

### Home Page
1. Hero with large image
2. Upcoming matches/events (featured 3-card row)
3. Club presentation (2-column: text + image)
4. Age categories grid
5. Latest news (6-card grid)
6. CTA section "Rejoignez Les Jokers"
7. Footer

### Contact Page
1. Page header (small banner)
2. Contact form + info (2-column)
3. Training schedule section
4. Map/directions
5. Footer

## Accessibility
- Form labels always visible (not placeholder-only)
- Focus states: ring-2 ring-offset-2
- Contrast ratios WCAG AA compliant
- Touch targets minimum 44x44px
- Alt text for all images