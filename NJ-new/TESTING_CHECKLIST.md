# Mega Menu Testing Checklist

## Quick Start
Run `npm run dev` to start the development server, then open `http://localhost:5173` (or the port shown in terminal).

Resize your browser to test different breakpoints:
- **Mobile**: 360px - 767px width
- **Tablet**: 768px - 991px width  
- **Desktop**: 992px and above

---

## MOBILE TESTING (Width: 360px - 767px)

### ✅ Visual Appearance
- [ ] Header displays hamburger menu icon (three horizontal lines)
- [ ] "Ministries" item shows dropdown arrow (▼)
- [ ] Navbar slides in from right when hamburger is clicked
- [ ] Navigation items are vertically stacked
- [ ] Text is readable at mobile size

### ✅ Tap to Expand/Collapse
- [ ] Tap "Ministries" link → Mega menu expands
- [ ] All 4 columns are visible (Community Groups, Outreach, Education, Children's Ministry)
- [ ] Dropdown arrow rotates to point down (▼)
- [ ] Tap "Ministries" again → Menu collapses
- [ ] Dropdown arrow rotates back up

### ✅ Alternative Close Methods
- [ ] Click outside the mega menu → Menu collapses
- [ ] Press Escape key → Menu collapses
- [ ] Click any ministry link → Menu collapses and navigates to that page
- [ ] Hamburger menu closes → Mega menu also closes

### ✅ Touch Targets & Usability
- [ ] Each menu item is at least 44px tall (accessibility standard)
- [ ] Adequate spacing between items (no accidental double-clicks)
- [ ] No horizontal scrolling when menu is open
- [ ] Menu doesn't exceed screen height (or has scroll if needed)

### ✅ Keyboard Navigation (Mobile)
- [ ] Tab through "Ministries" button → Button is focusable
- [ ] Click/Press Ministries → Menu opens
- [ ] Tab through menu items → Focus cycles through visible links
- [ ] Shift+Tab → Focus goes backwards
- [ ] Escape key → Menu closes, focus returns to "Ministries" button
- [ ] When menu is closed, Tab continues to next nav item

### ✅ Visual Feedback
- [ ] Hover effect on menu items (change color to gold)
- [ ] Focus outline visible on keyboard navigation
- [ ] Background color change on hover
- [ ] Smooth animation when expanding/collapsing

### ✅ Animation Quality
- [ ] Menu expands without jerky animation
- [ ] Menu collapses smoothly
- [ ] No flash or FOUC (Flash of Unstyled Content)
- [ ] Transition duration feels natural (not too fast or slow)

---

## TABLET TESTING (Width: 768px - 991px)

### ✅ Behavior (Should behave like Mobile)
- [ ] Hamburger menu still visible
- [ ] "Ministries" uses toggle behavior (not hover)
- [ ] Tap to expand/collapse works
- [ ] Escape key closes menu
- [ ] All mobile features work

### ✅ Layout
- [ ] Content has proper padding/margins
- [ ] No overflow or horizontal scrolling
- [ ] Touch targets remain adequate (44px+)
- [ ] Mega menu is readable at tablet width

---

## DESKTOP TESTING (Width: 992px and above)

### ✅ Visual Appearance
- [ ] Hamburger menu is hidden
- [ ] Navigation items are horizontal
- [ ] "Ministries" no longer shows dropdown arrow
- [ ] All nav items in single row
- [ ] Header layout is clean and horizontal

### ✅ Hover to Open
- [ ] Move mouse over "Ministries" → Mega menu appears
- [ ] Menu fades in smoothly (not instant)
- [ ] Menu appears below "Ministries" button
- [ ] Menu is horizontally centered
- [ ] Menu shows 4-column grid layout

### ✅ Mega Menu Structure
- [ ] **Left Column**: "Community Groups" with 4 items
  - [ ] Men's Ministry
  - [ ] Women's Ministry
  - [ ] Youth Group
  - [ ] Blog
- [ ] **Middle Column 1**: "Outreach" with 3 items
  - [ ] Local Missions
  - [ ] Global Missions
  - [ ] Community Service
- [ ] **Middle Column 2**: "Education" with 2 items
  - [ ] Foundation Class
  - [ ] Sunday School
- [ ] **Right Column**: "Children's Ministry" featured section
  - [ ] Has image/thumbnail
  - [ ] Shows title "Children's Ministry"
  - [ ] Has description text "Programs available for all ages."
  - [ ] Has "Learn More →" button
  - [ ] Different background color than other columns

### ✅ Hover Behavior
- [ ] Moving from trigger to menu without gap → Menu stays open
- [ ] Moving cursor around inside menu → Menu stays open
- [ ] Moving cursor away from entire menu area → Menu closes
- [ ] Menu closes smoothly with fade animation (not instant)

### ✅ Hover Responsiveness
- [ ] Moving back to hover area starts fade-in again
- [ ] Rapid hover in/out doesn't cause lag
- [ ] Multiple hoverings work consistently
- [ ] No "flickering" on the border

### ✅ Click Navigation
- [ ] Click any ministry link → Navigates to page correctly
- [ ] Menu closes after clicking
- [ ] "Learn More →" button is clickable and navigates

### ✅ Keyboard Navigation (Desktop)
- [ ] Tab through nav items → "Ministries" is focusable
- [ ] Focus over "Ministries" → Does NOT auto-open menu (hover only)
- [ ] Tab to a ministry link inside open menu → Focus visible on link
- [ ] Can navigate all links with Tab/Shift+Tab
- [ ] Escape key → Menu closes

### ✅ Visual Polish
- [ ] Grid columns are evenly sized
- [ ] Text alignment is consistent
- [ ] Links have hover color change (gold)
- [ ] Column separators are subtle but visible
- [ ] Font sizes are appropriate
- [ ] Spacing/padding looks balanced

### ✅ Animation Quality
- [ ] Menu appears with smooth fade-in
- [ ] Menu disappears with smooth fade-out
- [ ] No jarring color changes
- [ ] No text shift or layout movement

---

## RESPONSIVE TRANSITION TESTING

### ✅ Resizing from Mobile → Desktop (360px → 1440px)
- [ ] At 767px: Mobile toggle behavior active
- [ ] At 768px: Still uses toggle (tablet breakpoint)
- [ ] At 991px: Still uses toggle, close to desktop
- [ ] At 992px: **Switches to hover behavior**
- [ ] At 1440px: Wide desktop view works correctly
- [ ] No console errors during resize
- [ ] No menu gets "stuck" open

### ✅ Resizing from Desktop → Mobile (1440px → 360px)
- [ ] At 1440px: Desktop hover behavior works
- [ ] At 993px: Still in desktop mode
- [ ] At 992px: **Switches to mobile toggle behavior**
- [ ] At 768px: Full mobile experience
- [ ] At 360px: Mobile responsive works
- [ ] Menu closes automatically when resizing
- [ ] No console errors

---

## ACCESSIBILITY TESTING

### ✅ Screen Reader Testing
- [ ] "Ministries" button announces correctly
- [ ] `aria-expanded` changes announcement when menu opens/closes
- [ ] Links inside menu are announced properly
- [ ] Menu role is announced as "menu"
- [ ] Links announced as "menuitem"

### ✅ Keyboard-Only Navigation
- [ ] Can access entire menu using only Tab key
- [ ] Can open menu with spacebar (on button)
- [ ] Focus outline is visible on all elements
- [ ] Focus order is logical (left to right, top to bottom)
- [ ] Escape key closes menu without issues

### ✅ Focus Management
- [ ] When menu opens → focus can move into menu
- [ ] When menu closes → focus returns to trigger button
- [ ] Shift+Tab goes backwards through items
- [ ] Last item + Tab → Either wraps or goes to next nav item

### ✅ Color Contrast
- [ ] Text meets WCAG AA contrast standards (4.5:1)
- [ ] Hover states provide sufficient contrast
- [ ] Disabled states (if any) are readable

### ✅ Motion & Animation
- [ ] All animations can be disabled with `prefers-reduced-motion`
- [ ] Content is accessible with animations disabled
- [ ] No seizure-inducing flashing animations

---

## BROWSER COMPATIBILITY TESTING

### ✅ Desktop Browsers
- [ ] Chrome (Latest)
- [ ] Firefox (Latest)
- [ ] Safari (Latest)
- [ ] Edge (Latest)

### ✅ Mobile Browsers
- [ ] Safari iOS (Latest)
- [ ] Chrome Mobile (Latest)
- [ ] Firefox Mobile (Latest)
- [ ] Samsung Internet (Latest)

### ✅ Feature Support
- [ ] CSS Grid works correctly
- [ ] CSS Transitions work smoothly
- [ ] `focus-visible` works (or graceful fallback)
- [ ] `aria-expanded` is supported

---

## PERFORMANCE TESTING

### ✅ Animation Performance
- [ ] Menu animations run at 60fps (smooth)
- [ ] No lag when hovering rapidly
- [ ] No performance issues with many open/close cycles
- [ ] Resize events don't cause stutter

### ✅ Load Time
- [ ] Page loads quickly with mega menu CSS
- [ ] JavaScript for mega menu is minimal
- [ ] No jank on initial page load
- [ ] CSS transitions don't block rendering

### ✅ Memory Usage
- [ ] No memory leaks with repeated open/close
- [ ] Event listeners are cleaned up properly
- [ ] Navigating away and back doesn't duplicate listeners

---

## EDGE CASES & SPECIAL SCENARIOS

### ✅ Very Small Mobile (320px width)
- [ ] Menu doesn't overflow or scroll horizontally
- [ ] Text remains readable
- [ ] Touch targets are still large enough
- [ ] All columns visible in menu (may need scroll vertically)

### ✅ Landscape Mobile (568px × 320px)
- [ ] Layout adjusts properly
- [ ] Elements don't overlap
- [ ] Menu is still accessible

### ✅ Very Large Desktop (2560px width)
- [ ] Mega menu width is reasonable (not full width)
- [ ] Text and spacing scale appropriately
- [ ] No broken layout

### ✅ Network/Slow Device
- [ ] Menu opens even if CSS takes time to load
- [ ] No blocking JavaScript
- [ ] Graceful degradation if JavaScript fails

### ✅ User Changes Settings
- [ ] Window has `resize` event listener working
- [ ] Menu closes when breakpoint crosses
- [ ] State resets appropriately
- [ ] No stale state bugs

---

## VISUAL REGRESSION TESTING

### ✅ Compare Before & After
- [ ] Take screenshots at mobile, tablet, desktop sizes
- [ ] Compare alignment, spacing, colors
- [ ] Check that everything matches design mockups
- [ ] Verify no unexpected style changes

---

## Bugs to Check For

### Common Issues
- [ ] Menu content not clickable when displayed
- [ ] Menu stays open after clicking link
- [ ] Focus doesn't return to button after close
- [ ] Arrow doesn't animate properly
- [ ] Hover bridge allows unintended closing
- [ ] Layout shifts when menu opens/closes
- [ ] Dropdown arrow visible on desktop (should be hidden)
- [ ] Mobile menu includes desktop styles by accident

---

## Test Results Summary

### Device: _________________
### Browser: ________________
### Resolution: _____________
### Date: ___________________

**Total Tests**: XX  
**Passed**: ✅ XX  
**Failed**: ❌ XX  

### Issues Found:
- [ ] Issue 1
- [ ] Issue 2
- [ ] Issue 3

### Notes:
```
[Add any additional notes or observations]
```

---

**Remember**: Test on actual devices when possible, not just browser emulation!
