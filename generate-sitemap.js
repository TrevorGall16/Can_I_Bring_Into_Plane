/**
 * Sitemap Generator for Can I Bring Into Plane
 * Usage: node scripts/generate_sitemap.js
 */

const fs = require('fs');
const path = require('path');

// CONFIGURATION
const SITE_URL = 'https://www.canibringonplane.com';

// PATHS (Using __dirname makes this robust no matter where you run it from)
const DATA_FILE_PATH = path.join(__dirname, 'js/data-embedded.js');
const OUTPUT_FILE_PATH = path.join(__dirname, 'sitemap.xml');

// ✅ CORRECTED SLUG LOGIC (Matches index.html exactly)
function createSlug(text) {
    return text.toString().toLowerCase()
        .replace(/&/g, 'and')      // Fixes "&" -> "and" (MISSING IN YOUR OLD SCRIPT)
        .replace(/\+/g, 'plus')    // Fixes "+" -> "plus" (MISSING IN YOUR OLD SCRIPT)
        .replace(/[()]/g, '')
        .replace(/\//g, '-')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

function generateSitemap() {
    console.log('🚀 Starting sitemap generation...');
    console.log(`📂 Reading data from: ${DATA_FILE_PATH}`);

    let fileContent;
    try {
        if (!fs.existsSync(DATA_FILE_PATH)) {
            throw new Error(`Data file not found at ${DATA_FILE_PATH}`);
        }
        fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    } catch (error) {
        console.error(`❌ Error reading data file:`, error.message);
        process.exit(1);
    }

    // Extract ITEMS_DATA
    let itemsData;
    try {
        const dataMatch = fileContent.match(/const ITEMS_DATA = (\[[\s\S]*?\]);/);
        if (!dataMatch) throw new Error('Could not find ITEMS_DATA array in file content');
        
        // Safe-ish eval for build script
        itemsData = eval('(' + dataMatch[1] + ')');
    } catch (error) {
        console.error('❌ Error parsing ITEMS_DATA:', error.message);
        process.exit(1);
    }

    console.log(`✅ Found ${itemsData.length} items`);

    const currentDate = getCurrentDate();
    
    // XML Header
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // 1. Static Pages - ADDED sitemap.html HERE
    const staticPages = ['', 'contact.html', 'privacy.html', 'sitemap.html'];
    
    staticPages.forEach(page => {
        const priority = page === '' ? '1.0' : '0.3';
        const url = page === '' ? SITE_URL + '/' : `${SITE_URL}/${page}`;
        sitemap += `  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>\n`;
    });

    // 2. Categories - ONLY visible categories from index.html
    // These match the data-category values in the visible UI buttons
    const VISIBLE_CATEGORIES = [
        'liquids', 'electronics', 'food', 'toiletries', 'medication',
        'tools', 'sports', 'baby', 'customs', 'camping', 'household',
        'art', 'weapons', 'hazardous'
    ];

    const allCategories = new Set();
    itemsData.forEach(item => {
        if (Array.isArray(item.category)) {
            item.category.forEach(c => allCategories.add(c));
        } else if (item.category) {
            allCategories.add(item.category);
        }
    });

    // Filter to only include visible categories
    const visibleCategories = [...allCategories].filter(cat =>
        VISIBLE_CATEGORIES.includes(cat)
    );

    console.log(`✅ Filtered categories: ${allCategories.size} total → ${visibleCategories.length} visible`);
    if (allCategories.size > visibleCategories.length) {
        const hidden = [...allCategories].filter(cat => !VISIBLE_CATEGORIES.includes(cat));
        console.log(`⚠️  Hidden categories (not in UI): ${hidden.join(', ')}`);
    }

    visibleCategories.forEach(cat => {
        const catUrl = `${SITE_URL}/?category=${cat}`;
        sitemap += `  <url>
    <loc>${catUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    });

    // 3. Items
    itemsData.forEach(item => {
        const slug = createSlug(item.name);
        const itemUrl = `${SITE_URL}/?item=${slug}`;
        
        sitemap += `  <url>
    <loc>${itemUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    });

    sitemap += `</urlset>`;

    try {
        fs.writeFileSync(OUTPUT_FILE_PATH, sitemap, 'utf8');
        console.log(`✅ Sitemap written to: ${OUTPUT_FILE_PATH}`);
        console.log(`   Total URLs: ${staticPages.length + visibleCategories.length + itemsData.length}`);
    } catch (error) {
         console.error(`❌ Error writing sitemap file:`, error.message);
         process.exit(1);
    }
}

generateSitemap();