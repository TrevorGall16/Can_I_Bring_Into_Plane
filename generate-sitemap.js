/**
 * AIRPORT CHECKER - SITEMAP GENERATOR (VM EDITION)
 * Uses Node.js Virtual Machine to safely execute and extract data.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// 1. CONFIG
const SITE_URL = 'https://www.canibringonplane.com';
const DESTINATIONS = ['JP', 'CN', 'AE', 'SG', 'TH', 'FR', 'IT', 'UK', 'MX', 'IN'];
const CATEGORIES = ['liquids', 'electronics', 'medication', 'food', 'batteries', 'vapes', 'tools', 'sports', 'household'];

// 2. LOAD DATA
let items = [];
try {
    const dataPath = path.join(__dirname, 'js/data.js');
    if (!fs.existsSync(dataPath)) throw new Error(`File not found: ${dataPath}`);
    
    console.log(`📖 Reading data from: ${dataPath}`);
    const rawCode = fs.readFileSync(dataPath, 'utf8');

    // PREPARE THE CODE FOR THE VM:
    // 1. Remove "import" statements (if any) to prevent crashes
    // 2. Change "export const ITEMS_DATA" to "var ITEMS_DATA" so the VM can capture it
    const cleanCode = rawCode
        .replace(/import\s+.*?;/g, '') 
        .replace(/export\s+const\s+ITEMS_DATA/, 'var ITEMS_DATA');

    // EXECUTE IN SANDBOX
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInNewContext(cleanCode, sandbox);

    if (!sandbox.ITEMS_DATA) {
        throw new Error("Script ran, but ITEMS_DATA was not found. Check your variable name in data.js.");
    }

    items = sandbox.ITEMS_DATA;
    console.log(`✅ Successfully loaded ${items.length} items.`);

} catch (error) {
    console.error(`❌ FATAL ERROR: ${error.message}`);
    process.exit(1);
}

// 3. SLUG HELPER (Matches your UI logic)
function toSlug(text) {
    return text.toString().toLowerCase()
        .replace(/&/g, 'and')
        .replace(/\+/g, 'plus')
        .replace(/[()]/g, '')
        .replace(/\//g, '-')      // Handles "Yogurt / Pudding" correctly
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

const currentDate = new Date().toISOString().split('T')[0];

// 4. GENERATE XML
console.log("🛠️ Building sitemap matrix...");
let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>1.0</priority>
  </url>`;

// Add Categories
CATEGORIES.forEach(cat => {
    xml += `
  <url>
    <loc>${SITE_URL}/?category=${cat}</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.8</priority>
  </url>`;
});

// Add Items + Destination Matrix
items.forEach(item => {
    const slug = toSlug(item.name);
    
    // Global Item Page
    xml += `
  <url>
    <loc>${SITE_URL}/?item=${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
  </url>`;

    // Destination combinations
    DESTINATIONS.forEach(dest => {
        xml += `
  <url>
    <loc>${SITE_URL}/?dest=${dest}&amp;item=${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
  </url>`;
    });
});

xml += `\n</urlset>`;

// 5. SAVE FILE
const outputPath = path.join(__dirname, 'sitemap.xml');
fs.writeFileSync(outputPath, xml);
console.log(`🚀 SUCCESS! sitemap.xml generated with ${items.length * (DESTINATIONS.length + 1) + CATEGORIES.length + 1} URLs.`);