## 1. The Item Object
Each item in `ITEMS_DATA` must follow this schema:

```javascript
{
    id: 1,
    name: "Disposable Razor",
    slug: "disposable-razor", // URL-friendly ID
    category: "toiletries",   // Maps to Affiliate Logic
    carryOn: "allowed",       // 'allowed', 'restricted', 'prohibited'
    checked: "allowed",
    note: "Blades must be permanently attached.",
    keywords: ["shaving", "grooming", "blade"] // For search algo,
    customs_restricted: ["sg", "th"] // ISO codes (e.g., Singapore, Thailand)
}
2. The Affiliate Map Object (High Margin)
Defines which high-margin offers appear for which category.

JavaScript
const AFFILIATE_MAP = {
    'electronics': [
        // High Margin: eSIM & Insurance
        { name: 'eSIM Data Plan', query: 'esim...', icon: 'fa-wifi' },
        { name: 'Tech Insurance', query: 'insurance...', icon: 'fa-shield' }
    ],
    'liquids': [
        // Low Margin: Bottles (Amazon)
        { name: 'Travel Bottles', query: 'travel bottles', icon: 'fa-bottle' }
    ],
    'default': [
        // Catch-all High Margin
        { name: 'Travel Insurance', query: 'safetywing', icon: 'fa-shield' }
    ]
};
3. Validation Rules
Unique Slugs: No two items can share a slug.

Valid Categories: Category must exist in AFFILIATE_MAP keys, or it falls back to 'default'.

Safe HTML: The note field may contain bold tags <strong> but no scripts.