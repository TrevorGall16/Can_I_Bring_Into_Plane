/**
 * SITEMAP GENERATOR - Virtual Page Expansion
 * ==========================================
 * Run this script in the browser console to generate sitemap XML
 * for all Item + Country combinations.
 *
 * Usage:
 *   1. Open https://www.canibringonplane.com/ in browser
 *   2. Open DevTools Console (F12)
 *   3. Copy & paste this entire script
 *   4. Call: generateSitemap() or downloadSitemap()
 */

(function() {
    'use strict';

    const BASE_URL = 'https://www.canibringonplane.com';
    const YEAR = new Date().getFullYear();
    const TODAY = new Date().toISOString().split('T')[0];

    // Destination codes (must match destinations.js)
    const DESTINATIONS = ['JP', 'FR', 'IT', 'UK', 'TH', 'CN', 'SG', 'IN', 'AE', 'MX'];

    // Category list (must match index.html)
    const CATEGORIES = [
        'liquids', 'electronics', 'food', 'toiletries', 'medication',
        'tools', 'sports', 'baby', 'customs', 'camping', 'music',
        'fashion', 'household', 'art', 'weapons', 'hazardous'
    ];

    // Try to get items from global scope (if page has loaded data.js)
    function getItems() {
        if (typeof ITEMS_DATA !== 'undefined') {
            return ITEMS_DATA;
        }
        console.warn('⚠️ ITEMS_DATA not found. Run this on the live site.');
        return [];
    }

    // Convert item name to URL slug
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

    // Generate XML for a single URL
    function urlEntry(loc, priority = '0.5', changefreq = 'monthly') {
        return `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    }

    // Generate full sitemap XML
    function generateSitemap() {
        const items = getItems();
        const entries = [];

        console.log('🚀 Generating sitemap...');
        console.log(`📦 Items: ${items.length}`);
        console.log(`🌍 Destinations: ${DESTINATIONS.length}`);
        console.log(`📂 Categories: ${CATEGORIES.length}`);

        // 1. Homepage (highest priority)
        entries.push(urlEntry(BASE_URL + '/', '1.0', 'daily'));

        // 2. Category pages
        CATEGORIES.forEach(cat => {
            entries.push(urlEntry(`${BASE_URL}/?category=${cat}`, '0.8', 'weekly'));
        });

        // 3. Destination pages
        DESTINATIONS.forEach(dest => {
            entries.push(urlEntry(`${BASE_URL}/?dest=${dest}`, '0.8', 'weekly'));
        });

        // 4. Category + Destination combinations (Virtual Pages)
        CATEGORIES.forEach(cat => {
            DESTINATIONS.forEach(dest => {
                entries.push(urlEntry(`${BASE_URL}/?category=${cat}&dest=${dest}`, '0.6', 'monthly'));
            });
        });

        // 5. Individual item pages
        items.forEach(item => {
            const slug = toSlug(item.name);
            entries.push(urlEntry(`${BASE_URL}/?item=${slug}`, '0.7', 'monthly'));
        });

        // 6. Item + Destination combinations (High-value virtual pages)
        items.forEach(item => {
            const slug = toSlug(item.name);
            DESTINATIONS.forEach(dest => {
                entries.push(urlEntry(`${BASE_URL}/?item=${slug}&dest=${dest}`, '0.5', 'monthly'));
            });
        });

        // Build final XML
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

        // Stats
        const stats = {
            total: entries.length,
            homepage: 1,
            categories: CATEGORIES.length,
            destinations: DESTINATIONS.length,
            categoryDestCombos: CATEGORIES.length * DESTINATIONS.length,
            items: items.length,
            itemDestCombos: items.length * DESTINATIONS.length
        };

        console.log('\n📊 SITEMAP STATISTICS:');
        console.log(`   Homepage: ${stats.homepage}`);
        console.log(`   Categories: ${stats.categories}`);
        console.log(`   Destinations: ${stats.destinations}`);
        console.log(`   Category+Dest: ${stats.categoryDestCombos}`);
        console.log(`   Items: ${stats.items}`);
        console.log(`   Item+Dest: ${stats.itemDestCombos}`);
        console.log(`   ─────────────────`);
        console.log(`   TOTAL URLs: ${stats.total}`);
        console.log('\n✅ Sitemap generated! Call downloadSitemap() to download.');

        // Store for download
        window._generatedSitemap = xml;
        window._sitemapStats = stats;

        return xml;
    }

    // Download sitemap as file
    function downloadSitemap() {
        if (!window._generatedSitemap) {
            console.log('⚠️ No sitemap generated. Running generateSitemap() first...');
            generateSitemap();
        }

        const blob = new Blob([window._generatedSitemap], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sitemap-${TODAY}.xml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log(`✅ Downloaded: sitemap-${TODAY}.xml`);
    }

    // Preview sitemap in console
    function previewSitemap(limit = 20) {
        if (!window._generatedSitemap) {
            generateSitemap();
        }
        const lines = window._generatedSitemap.split('\n').slice(0, limit * 6);
        console.log(lines.join('\n'));
        console.log(`\n... showing first ${limit} entries. Call downloadSitemap() for full file.`);
    }

    // Generate stats only (quick check)
    function sitemapStats() {
        const items = getItems();
        const catDestCombos = CATEGORIES.length * DESTINATIONS.length;
        const itemDestCombos = items.length * DESTINATIONS.length;
        const total = 1 + CATEGORIES.length + DESTINATIONS.length + catDestCombos + items.length + itemDestCombos;

        console.log('\n📊 POTENTIAL SITEMAP SIZE:');
        console.log(`   ${items.length} items × ${DESTINATIONS.length} destinations = ${itemDestCombos} virtual pages`);
        console.log(`   ${CATEGORIES.length} categories × ${DESTINATIONS.length} destinations = ${catDestCombos} virtual pages`);
        console.log(`   ─────────────────`);
        console.log(`   TOTAL INDEXABLE URLs: ${total.toLocaleString()}`);
        return total;
    }

    // Expose functions globally
    window.generateSitemap = generateSitemap;
    window.downloadSitemap = downloadSitemap;
    window.previewSitemap = previewSitemap;
    window.sitemapStats = sitemapStats;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🗺️  SITEMAP GENERATOR LOADED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Commands:');
    console.log('  sitemapStats()    - Quick URL count estimate');
    console.log('  generateSitemap() - Build full sitemap XML');
    console.log('  previewSitemap()  - Preview first 20 entries');
    console.log('  downloadSitemap() - Download sitemap.xml file');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

})();
