#!/usr/bin/env node

/**
 * Sitemap Generator for Can I Bring Into Plane
 *
 * This script generates a sitemap.xml file containing all items from ITEMS_DATA
 * Google will use this to index all 120+ item pages for better SEO
 *
 * Usage: node generate-sitemap.js
 * Output: sitemap.xml in the same directory
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://www.canibringonplane.com'; // Your actual domain from CNAME
const DATA_FILE = path.join(__dirname, 'js', 'data-embedded.js');
const OUTPUT_FILE = path.join(__dirname, 'sitemap.xml');

// Create URL-friendly slug from item name (matches SEOManager.createSlug in app.js)
function createSlug(itemName) {
    return itemName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
}

// Format date to ISO 8601 (YYYY-MM-DD) for sitemap
function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

// Main function
function generateSitemap() {
    console.log('🚀 Starting sitemap generation...');

    // Read the data-embedded.js file
    let fileContent;
    try {
        fileContent = fs.readFileSync(DATA_FILE, 'utf8');
    } catch (error) {
        console.error('❌ Error reading data file:', error.message);
        console.error(`   Make sure ${DATA_FILE} exists`);
        process.exit(1);
    }

    // Extract ITEMS_DATA from the file
    // The file contains: const ITEMS_DATA = [...]
    let itemsData;
    try {
        // Use eval to extract the data (safe since we control the file)
        const dataMatch = fileContent.match(/const ITEMS_DATA = (\[[\s\S]*?\]);/);
        if (!dataMatch) {
            throw new Error('Could not find ITEMS_DATA in file');
        }
        itemsData = eval(dataMatch[1]);
    } catch (error) {
        console.error('❌ Error parsing ITEMS_DATA:', error.message);
        process.exit(1);
    }

    console.log(`✅ Found ${itemsData.length} items in database`);

    // Generate sitemap XML
    const currentDate = getCurrentDate();
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

`;

    // Add each item as a URL
    itemsData.forEach(item => {
        const slug = createSlug(item.name);
        const itemUrl = `${SITE_URL}/?item=${slug}`;

        sitemapContent += `  <!-- ${item.name} -->
  <url>
    <loc>${itemUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

`;
    });

    // Add category pages
    const categories = [
        'liquids',
        'electronics',
        'food',
        'toiletries',
        'medication',
        'tools',
        'sports',
        'baby',
        'customs'
    ];

    categories.forEach(category => {
        const categoryUrl = `${SITE_URL}/?category=${category}`;
        sitemapContent += `  <!-- Category: ${category} -->
  <url>
    <loc>${categoryUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

`;
    });

    sitemapContent += `</urlset>`;

    // Write sitemap.xml
    try {
        fs.writeFileSync(OUTPUT_FILE, sitemapContent, 'utf8');
        console.log(`✅ Sitemap generated successfully!`);
        console.log(`   Output: ${OUTPUT_FILE}`);
        console.log(`   Total URLs: ${itemsData.length + categories.length + 1}`);
        console.log('');
        console.log('📝 Next Steps:');
        console.log('   1. Update SITE_URL in this script with your actual domain');
        console.log('   2. Upload sitemap.xml to your website root directory');
        console.log('   3. Submit to Google Search Console: https://search.google.com/search-console');
        console.log('   4. Verify ownership and submit sitemap URL');
        console.log('');
        console.log('🎯 SEO Tip: Re-run this script whenever you add/remove items from ITEMS_DATA');
    } catch (error) {
        console.error('❌ Error writing sitemap.xml:', error.message);
        process.exit(1);
    }
}

// Run the generator
generateSitemap();
