## 1. AdSense Compliance (High-Value Rule)
To prevent "Low Value Content" rejection:
* **Mandatory Content:** The homepage MUST contain the "Methodology & FAQ" text block.
* **Rich Results:** Every item view must inject distinct `title`, `meta description`, and `canonical` tags.

## 2. Ads Strategy (High-Margin Pivot)
* **Primary Revenue:** Contextual Affiliates (High CPA).
    * *Electronics* → eSIMs (Airalo) & Tech Insurance.
    * *Health* → Medical Insurance (SafetyWing).
    * *General* → Trip Protection.
* **Secondary Revenue:** Amazon Associates (Low CPA).
    * Only used for physical goods (Liquids, Bags) where high-margin alternatives don't exist.
* **Display Ads:**
    * *Top Slot:* 320x50 (Mobile) / 728x90 (Desktop).
    * *Inline Slot:* 300x250 (Inside Result Card).

## 3. Indexing Strategy
* **Zero Soft 404s:**
    * Browser URL: `/?item=toothpaste`
    * Canonical Tag: `<link rel="canonical" href="https://site.com/?item=toothpaste">`
    * *Rule:* If the item exists in DB, it is a valid page. If not, redirect to Home.
* **Sitemap:** Generated via `sitemap.html`. Must use absolute links (`/?item=slug`).

## 4. Schema Markup
* **Type:** `FAQPage`.
* **Trigger:** Injected dynamically when an item is viewed.
* **Questions:**
    1.  "Can I bring [Item] in carry-on?"
    2.  "Can I bring [Item] in checked luggage?"
    3.  "What are the rules for [Item]?"