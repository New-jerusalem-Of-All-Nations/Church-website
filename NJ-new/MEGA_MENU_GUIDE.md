# Mega Menu Implementation Guide

## Overview
This document describes the mobile-first, fully responsive mega menu implementation for the NJIM church website navigation.

## Architecture

### Components Updated

#### 1. **MegaMenu.jsx** - Core mega menu component
- **Responsibilities**:
  - Manages mega menu state (expanded/collapsed)
  - Detects mobile vs desktop breakpoint
  - Handles keyboard events (Escape, Tab)
  - Manages focus
  - Handles clicks outside menu
  
- **Key Features**:
  - Responsive state management (tracks window resize)
  - Mobile: Toggle-based expansion
  - Desktop: Hover-based dropdown
  - Full keyboard navigation support
  - ARIA attributes for accessibility

#### 2. **Navbar.jsx** - Navigation container
- **Responsibilities**:
  - Renders navigation links
  - Imports and displays MegaMenu component
  - Handles outer-click detection
  - Closes mobile menu when links are clicked
  
- **Note**: MegaMenu now handles all its own state independently

#### 3. **Header.jsx** - Header wrapper
- **Responsibilities**:
  - Manages overall header state
  - Handles scroll effects
  - Handles mobile menu toggle button
  - Keyboard support for Escape key

## Behavior by Device

### Mobile (0px - 991px)

#### Ministries Menu
```
Default State: Collapsed
└─ Tap "Ministries" → Expands
   └─ Tap "Ministries" → Collapses
   └─ Click outside → Collapses
   └─ Press Escape → Collapses
   └─ Click a ministry link → Collapses & navigates
```

#### Visual Indicators
- Dropdown arrow (▼) is visible
- Arrow rotates 180° when expanded
- Background color changes on hover/active
- Smooth height transition when expanding/collapsing

### Desktop (992px+)

#### Ministries Menu
```
Default State: Hidden
└─ Hover "Ministries" → Appears (with animation)
   └─ Move mouse away → Disappears (with animation)
   └─ Hover over menu → Stays open
   └─ Click a ministry link → Disappears & navigates
```

#### Visual Design
- No dropdown arrow visible
- Appears below trigger button
- Grid layout: 3 columns (Community Groups, Outreach, Education) + 1 featured column (Children's Ministry)
- Smooth fade-in animation
- Invisible bridge between trigger and menu prevents closing on hover gap

### Tablet (768px - 991px)
- Uses mobile behavior (toggle-based)
- Optimized spacing for tablet screen size

## Styling Details

### Mobile Menu Expansion

**Collapsed State:**
```css
.mega-menu {
  max-height: 0;
  overflow: hidden;
  pointer-events: none;
}
```

**Expanded State:**
```css
.mega-menu.expanded {
  max-height: 1200px;
  overflow: visible;
  pointer-events: auto;
}
```

**Benefits:**
- ✅ No layout shift (smooth height transition)
- ✅ Better animation performance than display: none/block
- ✅ Prevents clicking hidden menu items
- ✅ Smooth transition animation

### Desktop Menu Positioning

**Without Hover:**
```css
.mega-menu {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
```

**On Hover:**
```css
.mega-menu-item:hover .mega-menu {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
```

**Features:**
- ✅ Invisible bridge (`::before` pseudo-element) prevents menu from closing when moving from trigger to menu
- ✅ Fade-in animation using opacity
- ✅ Centered positioning with `transform: translateX(-50%)`
- ✅ Responsive width using `max(950px, 90vw)`

### Grid Layout (Desktop)

```css
.mega-menu-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr) 1.2fr;
}
```

**Structure:**
```
┌─────────────────────────┬─────────────────────────┬─────────────────────────┬──────────────────┐
│ Community Groups        │ Outreach                │ Education               │ Featured Column  │
├─────────────────────────┼─────────────────────────┼─────────────────────────┼──────────────────┤
│ • Men's Ministry        │ • Local Missions        │ • Foundation Class      │ [Image]          │
│ • Women's Ministry      │ • Global Missions       │ • Sunday School         │ Children's Min.  │
│ • Youth Group           │ • Community Service     │                         │ Programs avail.  │
│ • Blog                  │                         │                         │ [Learn More →]   │
└─────────────────────────┴─────────────────────────┴─────────────────────────┴──────────────────┘
```

## Accessibility Features

### Keyboard Navigation

| Key | Action |
|-----|--------|
| **Tab** | Navigate through menu items (mobile & desktop) |
| **Escape** | Close mobile mega menu |
| **Enter/Space** | Trigger menu on "Ministries" button (mobile) |
| **Hover** | Open mega menu on desktop |

### ARIA Attributes

```html
<button
  class="ministries-trigger"
  aria-expanded="true|false"
  aria-haspopup="true"
  aria-label="Ministries menu"
>
  Ministries
</button>

<div
  class="mega-menu"
  role="menu"
>
  <a role="menuitem">Ministry Link</a>
</div>
```

### Focus Management

- Focus outline visible on all interactive elements
- Focus trap on mobile menu (Tab cycles through items)
- Focus returns to trigger when menu closes
- `focus-visible` styles for keyboard users only

## Responsive Breakpoints

### Mobile First (0px - 591px)
- 280px sidebar width
- 16px padding on menu items
- Vertical stack layout
- Full toggle functionality

### Small Tablet (592px - 767px)
- 320px sidebar width
- 18px padding on menu items
- Enhanced spacing

### Tablet (768px - 991px)
- Still uses mobile toggle behavior
- Optimized spacing for tablet

### Desktop (992px+)
- Horizontal navigation bar (position: static)
- Mega menu appears on hover
- Grid layout for mega menu content
- Enhanced spacing and typography

## State Management Flow

```
Header
├─ isMobileMenuOpen (boolean)
│  ├─ toggleMobileMenu() → toggles isMobileMenuOpen
│  └─ closeMobileMenu() → sets to false
│
└─ Navbar
   └─ MegaMenu
      ├─ isMinistryExpanded (boolean)
      ├─ isMobile (boolean) - tracks viewport
      │
      ├─ Handlers:
      │  ├─ handleMegaMenuClick() → toggles on mobile
      │  ├─ handleMegaMenuMouseEnter() → opens on desktop hover
      │  ├─ handleMegaMenuMouseLeave() → closes on desktop hover
      │  └─ handleLinkClick() → closes mobile menu after navigation
      │
      └─ Event Listeners:
         ├─ resize → updates isMobile
         ├─ keydown → Escape to close, Tab for focus management
         └─ click → close on outside click
```

## Testing Guide

### Mobile Testing (360px - 767px)

1. **Tap Menu Item**
   - [ ] Tap "Ministries" → menu expands
   - [ ] Dropdown arrow rotates down (▼)
   - [ ] Menu shows all 4 columns
   
2. **Close Menu**
   - [ ] Tap "Ministries" again → menu collapses
   - [ ] Tap outside menu → menu collapses
   - [ ] Press Escape → menu collapses
   
3. **Navigate**
   - [ ] Tap any ministry link → closes menu and navigates
   - [ ] All links are tappable (minimum 44px height)
   
4. **Keyboard**
   - [ ] Tab through menu items
   - [ ] Shift+Tab to go back
   - [ ] Escape to close and return focus

### Desktop Testing (992px+)

1. **Hover to Open**
   - [ ] Hover over "Ministries" → menu appears
   - [ ] Menu fades in smoothly
   - [ ] Menu displays grid with 4 columns
   
2. **Hover to Close**
   - [ ] Move cursor away from menu → menu disappears
   - [ ] Menu fades out smoothly
   
3. **Hover to Stay Open**
   - [ ] Hover from trigger to menu without gap → stays open
   - [ ] Can move inside menu area → stays open
   
4. **Click Navigation**
   - [ ] Click any ministry link → navigates correctly
   - [ ] Menu closes after navigation

### Responsive Testing

1. **Resize from Mobile to Desktop**
   - [ ] At 991px: Toggle behavior
   - [ ] At 992px: Switch to hover behavior
   - [ ] No console errors during resize
   
2. **Resize from Desktop to Mobile**
   - [ ] At 993px: Hover behavior
   - [ ] At 991px: Switch to toggle behavior
   - [ ] Menu closes automatically if open

## Performance Optimizations

1. **CSS Transitions** - Hardware-accelerated transforms and opacity changes
2. **Event Delegation** - Uses single listener for outside clicks
3. **Responsive State** - Debounced resize listener tracking
4. **No Layout Shift** - Uses max-height instead of display toggling

## Browser Support

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Safari iOS (Latest)
- ✅ Chrome Android
- ⚠️ IE11 (Limited support - no focus-visible)

## Customization

### Adjust Mobile Breakpoint
In `MegaMenu.jsx` and media queries in `index.css`:
```javascript
// Change from 992px to desired breakpoint
const setIsMobile = (window.innerWidth <= 992)
```

### Add More Ministry Columns
In `MegaMenu.jsx`, add to `ministriesList`:
```javascript
{
  column: 'New Column',
  items: [
    { label: 'Link 1', path: '/path' },
    { label: 'Link 2', path: '/path' },
  ],
}
```

### Change Menu Width (Desktop)
In `index.css` desktop media query:
```css
.mega-menu {
  width: max(1000px, 90vw); /* Change 950px */
}
```

### Adjust Colors
Update CSS variables in `:root`:
```css
--brand-gold: #f0ad4e;
--brand-dark: #1a1a1a;
--brand-light: #f8f9fa;
```

## Troubleshooting

### Menu doesn't close on mobile
- Check that `isMobileMenuOpen` state is passed correctly
- Verify click handler is attached
- Check Escape key listener

### Menu appears on wrong breakpoint
- Verify `window.innerWidth <= 992` matches media query
- Check Redux/state management isn't interfering
- Clear browser cache

### Hover menu stays open
- Verify `:hover` pseudo-class isn't being overridden
- Check for `pointer-events: none` when menu is closed
- Ensure `::before` bridge has correct height

### Focus issues
- Verify `aria-expanded` is updating correctly
- Check `focus-visible` styles aren't hidden by outline: none
- Test with keyboard (Tab key)

## Files Modified

1. **MegaMenu.jsx** - Complete rewrite for new behavior
2. **Navbar.jsx** - Simplified state management
3. **Header.jsx** - Added keyboard support
4. **index.css** - Enhanced responsive styles and mega menu CSS

## Next Steps

- [ ] Add smooth transitions to mega menu appearance
- [ ] Add loading states for ministry pages
- [ ] Add breadcrumb navigation in mega menu
- [ ] Create icon indicators for ministry categories
- [ ] Add analytics tracking for menu clicks
- [ ] Implement submenu multilevel navigation

---

**Last Updated**: March 12, 2026
**Version**: 1.0 - Mobile-First Mega Menu
