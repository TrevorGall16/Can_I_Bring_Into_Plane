## 1. Global Layout
* **Header:** Minimal height (60px). Logo (Left) + Search Bar (Center/Prominent).
* **Main Content:**
    * *State A (Home):* Welcome Message + Quick Guide + FAQ Block (SEO).
    * *State B (Result):* Item Result Card + "Contextual" Shopping Block.
* **Floating Action Button (FAB):** Bottom-Right. Fixed position. "My Checklist" (Clipboard Icon).
* **Footer:** Minimal links. "Data refreshed [Date]".

## 2. Component Inventory

### A. The Search Bar
* **Behavior:** Instant search (keyup). No "Enter" required.
* **State:** Shows "Clear" button (X) when typed.
* **Mobile:** Expands to 100% width on focus.

### B. The Result Card (`#resultCard`)
* **Container:** Centered, max-width 600px. White background, soft shadow.
* **Header:** Item Name (H1) + Share Icon.
* **Status Indicators (Grid):**
    * **Carry-On Box:** Icon (Backpack) + Text (Allowed/Prohibited).
    * **Checked Box:** Icon (Suitcase) + Text (Allowed/Prohibited).
* **Badges:**
    * ✅ **Allowed:** Green background (`#dcfce7`), Dark Green text (`#166534`).
    * ❌ **Prohibited:** Red background (`#fee2e2`), Dark Red text (`#991b1b`).
    * ⚠️ **Restricted:** Amber background (`#fef3c7`), Dark Amber text (`#92400e`).
* **Action Button:** "➕ Add to Checklist" (Changes to "✅ On Checklist").
* **Shopping Block:** "Recommended for this item" (Light Blue background `#eff6ff`).

### C. The Checklist Modal (`#bagModal`)
* **Title:** "Pre-Flight Compliance Report" (Psychology: Official).
* **List Items:**
    * Left: Status Icon (✅/❌).
    * Center: Item Name.
    * Right: Remove Button (Trash icon).
* **Empty State:** "Your checklist is empty. Search for items to add them."
* **Footer:** "Print / Share" button.

### D. The SEO Content Block
* **Placement:** Inside `#welcomeMessage`, below the main buttons.
* **Content:** "How We Verify Rules" + 3 Accordion FAQs.
* **Interaction:** Must hide automatically when a user searches or clicks a category.

## 3. Interaction Rules
* **Search Trigger:** Hides `#welcomeMessage` and `#categoryItemsList` immediately. Shows `#resultCard`.
* **Category Click:** Hides `#resultCard`. Shows `#categoryItemsList` (Grid of items).
* **Checklist Add:**
    * 1. Updates `localStorage`.
    * 2. Animates FAB (Badge count jumps).
    * 3. Changes button text to "✅ On Checklist".
* **Back Button:** Must be intercepted by JS to close Modals/Result Cards before navigating back history.

## 4. Responsive Logic
* **Mobile (< 768px):**
    * Search bar is full width.
    * Result Card takes 100% width.
    * FAB is bottom-right (20px margin).
* **Desktop (> 768px):**
    * Search bar is 50% width.
    * Result Card is centered (600px max).
    * Category Grid is 3 columns.

## 5. Accessibility Rules
* **Contrast:** All text must pass WCAG AA (Contrast ratio 4.5:1).
* **Keyboard Nav:** Search results must be selectable via Arrow Keys + Enter.
* **ARIA:**
    * Results: `role="region" aria-live="polite"`.
    * Modal: `role="dialog" aria-modal="true"`.