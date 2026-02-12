/**
 * GENERATE-SITEMAP.JS — Node.js Sitemap Generator
 * Reads real data from js/data.js and js/destinations.js via VM sandbox.
 *
 * URL patterns (matching router.js):
 *   /                          Home
 *   /?item=slug                Item page
 *   /?category=slug            Category page
 *   /?dest=CODE                Destination page
 *   /?dest=CODE&item=slug      Matrix (high-value only)
 *
 * Run:  node generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SITE_URL = 'https://www.canibringonplane.com';
const today = new Date().toISOString().split('T')[0];

// ---------------------------------------------------------------------------
// 1. VM loader — safely executes ES6 module files and extracts the export
// ---------------------------------------------------------------------------
function loadExport(file, varName) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

    const code = fs.readFileSync(filePath, 'utf8')
        .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')   // strip imports
        .replace(/export\s+const\s+/g, 'var ');              // export const → var

    const ctx = { console };   // provide console so data.js's console.log works
    vm.createContext(ctx);
    vm.runInNewContext(code, ctx);

    if (!ctx[varName]) throw new Error(`${varName} not found in ${file}`);
    return ctx[varName];
}

// ---------------------------------------------------------------------------
// 2. Load real data
// ---------------------------------------------------------------------------
const items        = loadExport('js/data.js', 'ITEMS_DATA');
const destinations = loadExport('js/destinations.js', 'DESTINATIONS');
const destCodes    = Object.keys(destinations);

console.log(`Loaded ${items.length} items, ${destCodes.length} destinations`);

// Extract every unique category from the items array (no hardcoding)
const categories = [...new Set(items.flatMap(i => i.category || []))].sort();
console.log(`${categories.length} categories: ${categories.join(', ')}`);

// ---------------------------------------------------------------------------
// 3. Slug helper — mirrors state.js toSlug() exactly
// ---------------------------------------------------------------------------
function toSlug(text) {
    return text.toString().toLowerCase()
        .replace(/&/g, 'and')
        .replace(/\+/g, 'plus')
        .replace(/[()]/g, '')
        .replace(/\//g, '-')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// ---------------------------------------------------------------------------
// 4. Destination ↔ customs_restricted mapping
//    Only generate matrix URLs when an item is customs-relevant for that dest.
// ---------------------------------------------------------------------------
const DEST_COUNTRIES = {
    FR: ['France', 'EU'],
    IT: ['Italy', 'EU'],
    UK: ['UK'],
    JP: ['Japan'],
    TH: ['Thailand'],
    CN: ['China'],
    SG: ['Singapore'],
    IN: ['India'],
    AE: ['UAE'],
    MX: ['Mexico']
};

// ---------------------------------------------------------------------------
// 5. Build URL list
// ---------------------------------------------------------------------------
const urls = [];

function add(loc, priority, changefreq) {
    let entry = `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>`;
    if (changefreq) entry += `\n    <changefreq>${changefreq}</changefreq>`;
    entry += '\n  </url>';
    urls.push(entry);
}

// Home
add(`${SITE_URL}/`, '1.0');

// Categories
categories.forEach(cat => add(`${SITE_URL}/?category=${cat}`, '0.8'));

// Destinations (standalone)
destCodes.forEach(code => add(`${SITE_URL}/?dest=${code}`, '0.7'));

// Items + high-value destination matrix
items.forEach(item => {
    const slug = item.slug || toSlug(item.name);

    // Item page
    add(`${SITE_URL}/?item=${slug}`, '0.6', 'monthly');

    // Matrix: only when item.customs_restricted mentions this destination's countries
    if (item.customs_restricted && item.customs_restricted.length) {
        destCodes.forEach(code => {
            const names = DEST_COUNTRIES[code] || [];
            if (names.some(n => item.customs_restricted.includes(n))) {
                add(`${SITE_URL}/?dest=${code}&amp;item=${slug}`, '0.5', 'monthly');
            }
        });
    }
});

// ---------------------------------------------------------------------------
// 6. Write sitemap.xml
// ---------------------------------------------------------------------------
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), xml);
console.log(`sitemap.xml generated: ${urls.length} URLs`);
