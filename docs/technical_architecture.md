# Airport Carry-On Checker - Technical Architecture Documentation

This document provides a complete technical overview of the Airport Carry-On Checker website architecture, file structure, and implementation details for AI assistants or developers working on this project.

---

## Project Overview

A client-side only web application that helps travelers check if items are allowed in carry-on or checked luggage. The site works completely offline with no server or backend required.

**Key Technical Characteristics:**
- Pure client-side JavaScript (no frameworks)
- Embedded data (no API calls or CORS issues)
- Three-column responsive grid layout
- Ad-optimized revenue strategy

---

## File Structure

```
/Can_I_Bring_Into_Plane/
├── index.html                 # Main HTML file
├── css/
│   └── styles.css            # All styles (no CSS preprocessors)
├── js/
│   ├── data-embedded.js      # Item database (120+ items)
│   └── app.js                # Main application logic
├── docs/
│   ├── ads_revenue.md        # Ad placement strategy
│   └── technical_architecture.md  # This file
└── ads_revenue.md            # (duplicate, see docs/)
```

---

## Architecture Pattern

### 1. Data Layer (`js/data-embedded.js`)

**Purpose:** Contains all item data embedded as a JavaScript constant to avoid CORS issues.

**Structure:**
```javascript
const ITEMS_DATA = [
    {
        id: 1,
        name: "Water Bottle (empty)",
        carryOn: "allowed",      // Values: "allowed", "restricted", "prohibited"
        checked: "allowed",
        note: "✅ Must be empty...",
        category: ["liquids"],   // Array of categories
        keywords: ["bottle", "water"]
    },
    // ... 120+ more items
];
```

**Important Notes:**
- Data is loaded BEFORE app.js (see index.html script order)
- Each item has precise measurements (100ml, 3.4oz, exact dimensions)
- Notes include emoji markers (✅ ❌ ⚠️ 💡 📞 🚨) for bullet-point parsing
- Categories: liquids, electronics, food, toiletries, medication, tools, sports, baby

### 2. Application Logic (`js/app.js`)

**Key Components:**

#### A. AdProvider Class
```javascript
class AdProvider {
    refreshInlineAd()  // Called on user interactions
    getImpressionCount()
}
```
- Manages ad refreshes with rate limiting (min 1 second between refreshes)
- Triggers on: category selection, country change, item clicks, popular tag clicks
- Provides visual feedback (opacity animation)

#### B. Global State
```javascript
let itemsData = ITEMS_DATA;  // From data-embedded.js
let currentCountry = 'USA';   // Current country selection
let autocompleteTimeout = null;
const adProvider = new AdProvider();
```

#### C. Country Rules Database
Embedded object with rules for 8 countries/regions:
- USA (TSA), China (CAAC), EU (EASA), UK, Canada (CATSA), Australia, Japan, International

#### D. Core Functions

**Search & Autocomplete:**
- `handleSearch(query)` - Debounced search with 300ms delay
- `searchItems(query)` - Filters items by name/keywords
- `displayAutocomplete(items)` - Shows top 5 matches

**Display Functions:**
- `displayItemResult(item, keepMiddlePanel)` - Shows item details in right panel
  - Completely rebuilds right panel HTML
  - Creates variant selector if item has size/type variations
  - Dynamically attaches event listeners after HTML render
  - Uses `keepMiddlePanel=true` when browsing categories

- `displayCategoryResults(category)` - Shows category items in middle panel
  - Filters items by category
  - Creates clickable item cards
  - Shows item status badges (allowed/restricted/prohibited)

- `showCountryRules(country)` - Displays country-specific rules
  - Rebuilds right panel with country rules
  - Hides middle panel

**Utility Functions:**
- `formatNoteToBulletPoints(note)` - Converts notes to bullet lists
  - Splits by emoji markers (✅ ❌ ⚠️ etc.)
  - Fallback: splits by sentences if no emojis
  - Returns `<ul><li>` HTML if multiple points

- `findItemVariants(item)` - Finds items with same base name
  - Example: "Water Bottle (empty)" and "Water Bottle (full)"

- `formatStatus(status)` - Converts status to emoji + text

### 3. Layout System (`index.html` + `css/styles.css`)

#### Three-Column Grid Architecture

```html
<div class="three-column-container">
    <!-- LEFT: 350px - Search, categories, popular tags -->
    <div class="left-panel">...</div>

    <!-- MIDDLE: 300px - Category items list (hidden by default) -->
    <div class="middle-panel hidden" id="middlePanel">...</div>

    <!-- RIGHT: 1fr - Item details or welcome message -->
    <div class="right-panel" id="rightPanel">...</div>
</div>
```

**CSS Grid:**
```css
.three-column-container {
    display: grid;
    grid-template-columns: 350px 300px 1fr;
}

/* Auto-collapse when middle panel hidden */
.three-column-container:has(.middle-panel.hidden) {
    grid-template-columns: 350px 1fr;
}
```

#### Responsive Behavior
- Desktop: Three columns (when middle panel visible) or two columns
- Mobile (<968px): Single column stack
- Middle panel: Auto-shows when category selected, hides on direct search

---

## Ad Implementation

### Ad Strategy (see `ads_revenue.md`)

**Two Ads Total:**
1. **Top Banner** - 728x90 (desktop) / 320x50 (mobile)
   - Location: Below header, above main content
   - Behavior: Static, never refreshes
   - Reserved height to prevent layout jumps

2. **Inline Ad** - 300x250 rectangle
   - Location: Inside right panel, below item details
   - Behavior: Refreshes on user interactions
   - Triggers: category change, country change, item click, popular tag click

**Ad Refresh Logic:**
```javascript
// Triggered by:
categoryButtons click → displayCategoryResults() → adProvider.refreshInlineAd()
countrySelector change → showCountryRules() → adProvider.refreshInlineAd()
category item click → displayItemResult() → adProvider.refreshInlineAd()
popular tag click → displayItemResult() → adProvider.refreshInlineAd()
```

**Rate Limiting:**
- Minimum 1 second between refreshes
- Prevents ad fatigue and excessive impressions

---

## Dynamic HTML Rendering Pattern

**Critical Understanding:** The right panel HTML is completely rebuilt on each interaction.

**Problem This Solves:**
- Original static HTML elements (welcomeMessage, resultCard, etc.) get destroyed
- Subsequent DOM queries for these elements return null
- Solution: Always use null checks before accessing DOM elements

**Pattern:**
```javascript
function displayItemResult(item, keepMiddlePanel) {
    // 1. Safely hide elements (may not exist)
    const welcomeMsg = document.getElementById('welcomeMessage');
    if (welcomeMsg) welcomeMsg.classList.add('hidden');

    // 2. Completely rebuild panel
    rightPanel.innerHTML = `<div class="result-card">...</div>`;

    // 3. Attach event listeners AFTER HTML is rendered
    const variantSelect = document.getElementById('variantSelect');
    variantSelect.addEventListener('change', ...);
}
```

**Why This Matters:**
- Previous bug: Code tried to access elements before checking existence → JavaScript errors halted execution
- Current fix: Always check `if (element)` before accessing

---

## Data Flow

### User Interaction Flow Examples

**1. Category Browse:**
```
User clicks "Liquids" category button
  → displayCategoryResults('liquids')
  → Filters items by category
  → Builds item cards in middle panel
  → Shows middle panel
  → Shows prompt in right panel
  → adProvider.refreshInlineAd()

User clicks "Shampoo" in middle panel
  → displayItemResult(shampoo, keepMiddlePanel=true)
  → Right panel rebuilds with item details
  → Middle panel stays visible
  → Item card gets "active" class
  → adProvider.refreshInlineAd()
```

**2. Direct Search:**
```
User types "laptop"
  → handleSearch() with 300ms debounce
  → searchItems('laptop')
  → displayAutocomplete() shows matches

User clicks autocomplete result
  → displayItemResult(laptop, keepMiddlePanel=false)
  → Right panel shows laptop details
  → Middle panel hides
  → Search input clears
```

**3. Country Change:**
```
User selects "China"
  → countrySelector change event
  → currentCountry = 'China'
  → showCountryRules('China')
  → Right panel rebuilds with CAAC rules
  → Middle panel hides
  → adProvider.refreshInlineAd()
```

---

## State Management

**No framework state management.** State is tracked through:

1. **Global Variables:**
   - `currentCountry` - Selected country
   - `itemsData` - All items (never mutates)
   - `adProvider.inlineAdCounter` - Ad impression count

2. **DOM Classes:**
   - `.hidden` - Controls visibility
   - `.active` - Highlights selected category item
   - Panel visibility determines layout (via CSS `:has()`)

3. **Function Parameters:**
   - `keepMiddlePanel` - Tells displayItemResult to preserve middle panel
   - Determines navigation context (browsing vs. direct search)

---

## CSS Architecture

### Key Patterns

**1. Status Classes:**
```css
.status-allowed { background: #d4edda; color: #155724; }
.status-restricted { background: #fff3cd; color: #856404; }
.status-prohibited { background: #f8d7da; color: #721c24; }
```

**2. Layout Classes:**
- `.three-column-container` - Main grid
- `.left-panel`, `.middle-panel`, `.right-panel` - Grid columns
- `.category-item-card` - Clickable items in middle panel
- `.result-card` - Item details display

**3. Ad Classes:**
- `.ad-banner-top` - Fixed height (110px desktop, 80px mobile)
- `.ad-inline` - Flexible, appears in right panel
- `.ad-placeholder` - Demo placeholder (replaced with real ads)

---

## Event Handling

### Static Event Listeners (set in `initializeEventListeners()`)
- Search input (with debounce)
- Country selector change
- Category buttons (8 buttons)
- Popular tags (10+ tags)

### Dynamic Event Listeners (set after HTML render)
- Variant selector dropdown (in displayItemResult)
- Close button (in displayItemResult)
- Category item cards (in displayCategoryResults)
- Related item tags (onclick attribute)

**Critical:** Dynamic listeners must be attached AFTER `innerHTML` is set, not before.

---

## Common Gotchas & Solutions

### 1. "Element is null" Errors
**Cause:** Trying to access DOM elements that were destroyed by `innerHTML`
**Solution:** Always use null checks:
```javascript
const elem = document.getElementById('foo');
if (elem) elem.classList.add('hidden');
```

### 2. Event Listeners Not Firing
**Cause:** Setting `element.onclick` before `element.innerHTML`
**Solution:** Set onclick AFTER innerHTML, or use addEventListener after appending to DOM

### 3. Middle Panel Doesn't Show/Hide Correctly
**Cause:** Forgetting to add/remove `.hidden` class
**Solution:** Check all display functions toggle `middlePanel.classList`

### 4. Ads Not Refreshing
**Cause:** Rate limiting (< 1 second since last refresh)
**Solution:** Check console for "📢 Inline ad refreshed" logs

### 5. Bullet Points Not Showing
**Cause:** Item notes don't have emoji markers
**Solution:** Ensure notes use ✅ ❌ ⚠️ etc. or proper sentence structure

---

## Development Workflow

### Testing Changes

1. **Data Changes:** Edit `js/data-embedded.js`
   - Add new items to ITEMS_DATA array
   - Follow existing structure (id, name, carryOn, checked, note, category, keywords)

2. **UI Changes:** Edit `css/styles.css`
   - Three-column layout responsive rules at bottom of file
   - Test mobile view (<768px) and tablet view (<968px)

3. **Logic Changes:** Edit `js/app.js`
   - Always add null checks for DOM elements
   - Attach dynamic event listeners after innerHTML
   - Test ad refreshes in console

### Debugging Tips

**Enable Verbose Logging:**
```javascript
console.log(`Found ${matches.length} matches for "${query}"`);
console.log('Displaying category:', category);
console.log(`📢 Inline ad refreshed (impression #${count})`);
```

**Check Ad Impressions:**
```javascript
console.log(adProvider.getImpressionCount());
```

**Verify Item Variants:**
```javascript
const variants = findItemVariants(item);
console.log('Variants:', variants);
```

---

## Performance Considerations

### Current Optimizations

1. **Debounced Search** - 300ms delay prevents excessive filtering
2. **Ad Rate Limiting** - Max 1 refresh per second
3. **Embedded Data** - No network requests, works offline
4. **Lazy Rendering** - Only visible panel content is rendered

### Potential Improvements

1. Virtual scrolling for categories with 50+ items
2. Search index for faster keyword matching
3. Lazy load country rules (currently all embedded)
4. Service worker for true offline PWA

---

## Browser Compatibility

**Target:** Modern browsers (2020+)

**Required Features:**
- CSS Grid
- CSS `:has()` selector (for auto-collapse)
- ES6 classes
- Template literals
- Arrow functions

**Fallbacks Needed:**
- `:has()` not supported in older browsers → manual JS column switching

---

## Extending the Application

### Adding a New Item

1. Open `js/data-embedded.js`
2. Add to `ITEMS_DATA` array:
```javascript
{
    id: 121, // Next available ID
    name: "New Item Name",
    carryOn: "allowed",
    checked: "allowed",
    note: "✅ Allowed. ⚠️ Must meet requirements.",
    category: ["category-name"],
    keywords: ["keyword1", "keyword2"]
}
```

### Adding a New Category

1. Update HTML: Add button in `index.html`:
```html
<button class="category-btn" data-category="new-category">🎯 New Category</button>
```

2. Update JS: Add to `categoryNames` object in `displayCategoryResults()`:
```javascript
const categoryNames = {
    // ... existing
    'new-category': '🎯 New Category'
};
```

3. Update items: Add `"new-category"` to relevant items' category arrays

### Adding a New Country

1. Add to `countryRules` object in `js/app.js`:
```javascript
'NewCountry': {
    title: 'Important Rules (Country)',
    rules: [
        { title: 'Rule Name', description: 'Details...' }
    ]
}
```

2. Add option to country selector in `index.html`:
```html
<option value="NewCountry">🇫🇷 Country Name</option>
```

---

## Security Considerations

**Current Security Posture:**
- No user input is stored or transmitted
- No backend or database
- Search input is filtered (case-insensitive string matching only)
- No eval() or innerHTML injection risks (all content is hardcoded)

**Potential Risks:**
- None (static client-side only)

---

## Summary for AI Assistants

**When working on this project:**

1. **Always read before editing** - Use Read tool before Edit/Write
2. **Check for null elements** - DOM elements may not exist after innerHTML rebuilds
3. **Preserve middle panel state** - Use `keepMiddlePanel` parameter correctly
4. **Test ad refreshes** - Ensure adProvider.refreshInlineAd() is called on interactions
5. **Follow emoji conventions** - Use ✅ ❌ ⚠️ for bullet-point formatting
6. **Maintain responsive design** - Test three-column, two-column, and mobile layouts
7. **No frameworks** - Pure vanilla JavaScript, no React/Vue/Angular
8. **No build process** - Direct HTML/CSS/JS, works by opening index.html

**File Edit Priority:**
- Data changes → `js/data-embedded.js`
- Layout changes → `css/styles.css`
- Logic changes → `js/app.js`
- Structure changes → `index.html`

**Common Tasks:**
- Add item: Edit `data-embedded.js` only
- Fix layout: Edit `styles.css` only
- Fix interaction: Edit `app.js` (with null checks!)
- Change structure: Edit `index.html` + update JS selectors

---

*Last Updated: 2024-11-28*
*Version: 3.0 (Three-column layout with ad optimization)*
