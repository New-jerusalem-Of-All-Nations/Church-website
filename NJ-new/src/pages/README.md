# Pages Directory

This directory contains full page components for the NJIM church website.

## Available Pages

### GivingPage
A complete giving/donations page with:
- Hero section with background image
- Three giving options cards (With Message, Give Now, International Giving)
- Bank details section with transfer information

**Usage:**
```jsx
import GivingPage from './pages/GivingPage'

// Use in your router:
<Route path="/giving" component={GivingPage} />

// Or import and render directly:
<GivingPage />
```

### To Enable Routing

1. Install React Router:
```bash
npm install react-router-dom
```

2. Update `src/App.jsx`:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './App-home' // Rename current App to App-home
import GivingPage from './pages/GivingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/giving" element={<GivingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

3. The Header navigation will automatically link to `/giving`

## Page Components

All pages consistently use:
- Same Header component
- Same Footer component
- CookieBanner for consent
- Responsive design matching site theme
