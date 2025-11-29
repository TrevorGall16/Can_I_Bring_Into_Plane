const fs = require('fs');
const path = require('path');

// CONFIGURATION
const DOMAIN = 'https://www.canibringonplane.com';
const DATA_FILE = './js/data-embedded.js';
const OUTPUT_FILE = './sitemap.xml';

try {
    console.log("📖 Reading data file...");
    let fileContent = fs.readFileSync(DATA_FILE, 'utf8');

    // 1. Hacky way to load the data without using 'module.exports'
    // We replace 'const ITEMS_DATA' with 'global.items' so we can access it after eval()
    // This assumes your data file starts with "const ITEMS_DATA = ["
    fileContent = fileContent.replace('const ITEMS_DATA', 'global.items');
    
    // Execute the file content to load the data into global.items
    eval(fileContent);

    if (!global.items || !Array.isArray(global.items)) {
        throw new Error("Could not load ITEMS_DATA. Check file format.");
    }

    console.log(`✅ Loaded ${global.items.length} items.`);

    // 2. Start building XML
    const today = new Date().toISOString().split('T')[0];
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${DOMAIN}/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>`;

    // 3. Loop through items and generate SLUGS matching app.js logic
    global.items.forEach(item => {
        // --- STRICT SLUG GENERATION (Matches app.js) ---
        const slug = item.name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphen
            .replace(/^-+|-+$/g, '');    // Trim start/end hyphens

        xml += `
    <url>
        <loc>${DOMAIN}/?item=${slug}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
    });

    xml += `
</urlset>`;

    // 4. Write file
    fs.writeFileSync(OUTPUT_FILE, xml);
    console.log(`🎉 Success! Sitemap generated at ${OUTPUT_FILE}`);
    console.log(`   - Total URLs: ${global.items.length + 1}`);
    console.log(`   - Example URL: ${DOMAIN}/?item=${global.items[32].name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);

} catch (error) {
    console.error("❌ Error generating sitemap:", error.message);
    console.log("Tip: Ensure js/data-embedded.js exists and uses 'const ITEMS_DATA = [...]'");
}