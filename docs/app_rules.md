1. Project Identity & North Star
Project Name: Can I Bring This On A Plane?

Internal ID: com.studio.canibring

Strategic North Star: "This site is a Pre-Flight Compliance Report, not just a search engine."

Rule: UI must feel authoritative, calming, and "official."

Rule: We prioritize Retention (Checklist) over generic browsing.

2. Technology & Architecture Rules
Stack Strategy: Path A (Vanilla JS + HTML + CSS).

Build System: STRICTLY NONE.

No npm run build.

No Webpack/Vite/Parcel.

No React/Vue/Angular.

Routing:

Must use history.pushState for virtual navigation.

Zero Soft 404s: App must parse ?item=slug on load and render the correct content immediately.

Dependencies:

Forbidden: jQuery, Bootstrap, Large Animation Libraries.

Allowed: FontAwesome (CDN), Google Fonts (Inter).

3. Development Workflow (AI & Human)
Read Before Write: AI must read index.html and styles.css fully before proposing changes.

Atomic Changes: Do not rewrite the entire index.html if only changing one function. Use precise "Search & Replace" instructions.

Mobile First: All CSS must be written for Mobile (320px+) first, then media query for Desktop (768px+).

No "Placeholder" Code: Do not write // ... rest of code. Always provide the complete functional block.

4. Data Integrity Rules (ITEMS_DATA)
Single Source: All item data lives in the ITEMS_DATA array within the JS.

Slug Inviolability: Once an item is published with a slug (e.g., razor-blade), it cannot be changed without a 301 redirect strategy (to preserve SEO).

Status States:

allowed (Visual: Green/Check)

restricted (Visual: Amber/Warning)

prohibited (Visual: Red/Cross)

Monetization Mapping (AFFILIATE_MAP):

Every item category MUST map to a key in AFFILIATE_MAP.

Revenue Rule: If the category is "Electronics" or "Valuables", the primary affiliate MUST be High-Margin (eSIM/Insurance), not Low-Margin (Cables).

5. UI/UX "Anxiety Relief" Standards
Color Psychology:

Use Blues (#2563eb) and Greens (#16a34a) for safety/trust.

Use Red (#dc2626) only for "Prohibited" status.

Anti-Pattern: Do not use "Alarmist" colors (bright orange/red) for general UI elements.

Language Protocol:

Forbidden: "Add to Bag" (Shopping context).

Mandatory: "Add to Checklist" (Compliance context).

Forbidden: "Buy this" (Sales context).

Mandatory: "Recommended Gear" or "Travel Protection" (Service context).

Feedback: Every user action (Save, Click, Copy) must have immediate visual feedback (Toast, Icon change).

6. SEO & Traffic Protocols
Canonical Tags: Must be dynamic. A view of /?item=razor must inject <link rel="canonical" href=".../?item=razor"> to prevent duplicate content flags.

Schema Markup: JSON-LD FAQPage must be injected for every item view to target "People Also Ask" snippets.

Title Tags: Format: Can I bring [Item] on a plane? - [Year] Rules.

7. Error Handling & Stability
Null Checks: Always check if document.getElementById('...') exists before modifying it (prevent console errors on partial renders or missing modals).

Fallback Logic: If AFFILIATE_MAP has no match for a category, fall back to "Default" (Travel Insurance/Adapter).

Offline Capability: The app logic (search/filtering) must function 100% offline after the initial load.

8. Git & Version Control
Commit Format: type: message

feat: add esim affiliate logic

fix: canonical tag generation

style: update checklist modal icons

content: add new liquid rules

Rule: Never push code that breaks ITEMS_DATA syntax (e.g., trailing commas in JSON). Validation is mandatory.