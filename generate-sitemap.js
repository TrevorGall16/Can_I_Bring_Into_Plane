#!/usr/bin/env node

/**
 * Sitemap Generator for Can I Bring Into Plane
 * Follows SEO_TRAFFIC_PROTOCOL.md (Protocol A - Vanilla Lite)
 * Usage: node scripts/generate-sitemap.js (from root)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://www.canibringonplane.com';

// Paths - Assumes running from project root
// If running from scripts folder, adjust manually or cd to root first
const DATA_FILE_PATH = path.join(process.cwd(), 'js', 'data-embedded.js');
const OUTPUT_FILE_PATH = path.join(process.cwd(), 'sitemap.xml');

// Standard Slug Logic (Must match app.js toSlug exactly)
function createSlug(text) {
    return text.toString().toLowerCase()
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
            throw new Error(`Data file not found at ${DATA_FILE_PATH}. Are you running from the project root?`);
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
        
        // Safe-ish eval for build script to parse the array structure
        // We wrap it in parenthesis to ensure it evaluates as an expression
        itemsData = eval('(' + dataMatch[1] + ')');
    } catch (error) {
        console.error('❌ Error parsing ITEMS_DATA:', error.message);
        process.exit(1);
    }

    console.log(`✅ Found ${itemsData.length} items`);

    const currentDate = getCurrentDate();
    
    // Header
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // 1. Homepage
    sitemap += `  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>\n`;

    // 2. Categories
    const categories = new Set();
    itemsData.forEach(item => {
        if (Array.isArray(item.category)) {
            item.category.forEach(c => categories.add(c));
        } else if (item.category) {
            categories.add(item.category);
        }
    });

    categories.forEach(cat => {
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
        
        // Boost priority for high-traffic items if needed, default 0.8
        const priority = 0.8;

        sitemap += `  <url>
    <loc>${itemUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>\n`;
    });

    sitemap += `</urlset>`;

    try {
        fs.writeFileSync(OUTPUT_FILE_PATH, sitemap, 'utf8');
        console.log(`✅ Sitemap written to: ${OUTPUT_FILE_PATH}`);
        console.log(`   Total URLs: ${1 + categories.size + itemsData.length}`);
    } catch (error) {
         console.error(`❌ Error writing sitemap file:`, error.message);
         process.exit(1);
    }
}

generateSitemap();