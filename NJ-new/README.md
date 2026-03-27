# NJIM - New Jerusalem Church Website

A modern, responsive React-based website for New Jerusalem Church built with Vite.

## Features

- **Responsive Design**: Mobile-first approach with breakpoints for all device sizes
- **Component-Based Architecture**: Modular React components for easy maintenance
- **Smooth Animations**: Fade-in effects and smooth transitions
- **Interactive Elements**: 
  - Dynamic sermon carousel
  - Newsletter subscription
  - Contact form
  - Cookie consent banner
  - Mobile-responsive navigation

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Navigation header with mega menu
│   ├── Hero.jsx            # Hero section with call-to-action
│   ├── About.jsx           # Church information section
│   ├── Sermons.jsx         # Latest sermons carousel
│   ├── Events.jsx          # Upcoming events listing
│   ├── WatchSermon.jsx     # YouTube integration section
│   ├── Contact.jsx         # Contact form and information
│   ├── Newsletter.jsx      # Newsletter subscription
│   ├── Footer.jsx          # Footer with links
│   └── CookieBanner.jsx    # Cookie consent banner
├── App.jsx                 # Main App component
├── main.jsx                # React entry point
└── index.css              # Global styles and CSS variables
```

## What's Included

### Components

1. **Header** - Fixed navigation bar with logo, menu items, and responsive hamburger menu
2. **Hero** - Full-screen hero section with church scripture and call-to-action buttons
3. **About** - Church welcome section with mission statement
4. **Sermons** - Auto-rotating sermon carousel with titles and descriptions
5. **Events** - Upcoming church events with dates and times
6. **WatchSermon** - YouTube channel promotion section
7. **Contact** - Contact form and church information
8. **Newsletter** - Email subscription form with consent checkbox
9. **Footer** - Quick links, social media, and service times
10. **CookieBanner** - GDPR-compliant cookie consent banner

### Styling

- **CSS Variables** for brand colors and measurements
- **Responsive breakpoints** for mobile (< 576px), tablet (< 768px), and desktop
- **Modern animations** including fade-in effects and hover states
- **Accessibility features** including reduced motion preferences

### Color Scheme

- **Gold**: `#f0ad4e` (Brand primary)
- **Dark**: `#1a1a1a` (Text and backgrounds)
- **Light**: `#f8f9fa` (Light backgrounds)
- **Gray**: `#6c757d` (Secondary text)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server

The app runs on `http://localhost:5173` by default.

## Key Features Explained

### Responsive Hero
The hero section displays a full-screen background with centered content on desktop and stacked content on mobile.

### Dynamic Sermon Carousel
Sermons automatically rotate every 5 seconds or can be manually navigated.

### Intersection Observer
Sections fade in as they come into view using the Intersection Observer API.

### Mobile Navigation
Responsive hamburger menu that toggles on mobile devices.

### Accessibility
- Semantic HTML structure
- ARIA labels where appropriate
- Reduced motion preferences respected
- Keyboard navigation support

## Customization

### Updating Church Information

Update the following in their respective components:
- Church name and address in `Footer.jsx`
- Service times in `Footer.jsx` and `Events.jsx`
- Contact details in `Contact.jsx`
- Social media links in `Footer.jsx`

### Adding New Sermons

Update the `sermons` array in `Sermons.jsx`:

```jsx
const sermons = [
  {
    id: 1,
    title: 'Sermon Title',
    description: 'Sermon description',
    thumbnail: 'image-url',
    date: 'Date'
  },
  // Add more sermons...
]
```

### Changing Colors

Modify CSS variables in `index.css`:

```css
:root {
  --brand-gold: #f0ad4e;
  --brand-dark: #1a1a1a;
  /* ... other variables */
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Code splitting via Vite
- Image optimization recommendations
- CSS minification
- Tree shaking of unused code

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

### Deploy to Netlify, Vercel, or GitHub Pages

1. Push your code to GitHub
2. Connect your repository to a hosting platform
3. Set build command: `npm run build`
4. Set publish directory: `dist`

## License

© 2025 NJIM - The Holy City of God. All Rights Reserved.

## Support

For issues or feature requests, please contact the development team.
