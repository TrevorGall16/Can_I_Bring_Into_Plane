# 2. TECH_STACK.md

## 1. Primary Stack Selection
**Selection:** **PATH A (Vanilla JS / Client-Side)**
**Justification:** The dataset is small (< 500 items). React/Next.js would add unnecessary complexity and build time. We need instant load times on poor airport WiFi.

## 2. Folder Structure
```text
/
├── index.html              # Entry point (Logic + UI + Routing)
├── sitemap.html            # User-facing HTML sitemap
├── robots.txt              # Crawl instructions
├── css/
│   └── styles.css          # Single CSS file (No pre-processor)
├── js/
│   ├── data-embedded.js    # The Database (Items + Affiliate Logic)
│   └── app.js              # (Optional: If logic grows, extract here. Currently inside index.html)
└── assets/                 # Favicons and static images

3. Data Structures (data-embedded.js)
Single Source of Truth: ITEMS_DATA array.

Affiliate Logic: AFFILIATE_MAP object maps categories to high-margin offers.

4. API & Logic Layer
No Backend: All logic runs in the browser.

Routing: Custom history.pushState router.

Rule: On load, check window.location.search (e.g., ?item=razor).

Rule: If found, render result card immediately & inject SEO tags.

Persistence: localStorage used for "My Checklist".

5. Performance Budgets
Total Page Weight: < 150KB (Gzipped).

First Contentful Paint: < 0.8s.

External Scripts: Lazy load all Ads/Analytics.