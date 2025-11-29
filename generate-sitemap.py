#!/usr/bin/env python3

"""
Sitemap Generator for Can I Bring Into Plane

This script generates a sitemap.xml file containing all items from ITEMS_DATA
Google will use this to index all 120+ item pages for better SEO

Usage: python3 generate-sitemap.py
Output: sitemap.xml in the same directory

Note: This script requires Node.js to parse the JavaScript data file.
      Alternatively, use generate-sitemap.js (Node.js version) directly.
"""

import json
import re
import subprocess
from datetime import date
from pathlib import Path

# Configuration
SITE_URL = 'https://www.canibringonplane.com'  # Your actual domain from CNAME
DATA_FILE = Path(__file__).parent / 'js' / 'data-embedded.js'
OUTPUT_FILE = Path(__file__).parent / 'sitemap.xml'


def create_slug(item_name):
    """Create URL-friendly slug from item name (matches SEOManager.createSlug in app.js)"""
    slug = item_name.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)  # Remove special chars
    slug = re.sub(r'\s+', '-', slug)  # Replace spaces with hyphens
    slug = re.sub(r'-+', '-', slug)  # Replace multiple hyphens
    return slug.strip()


def get_current_date():
    """Get current date in ISO 8601 format (YYYY-MM-DD)"""
    return date.today().isoformat()


def extract_items_data():
    """Extract ITEMS_DATA from JavaScript file using Node.js"""
    # Create a temporary Node.js script to parse and output JSON
    temp_script = '''
    const fs = require('fs');
    const vm = require('vm');
    const dataFile = ''' + f"'{DATA_FILE}'" + ''';
    const content = fs.readFileSync(dataFile, 'utf8');
    const context = { console, require, module, exports };
    vm.createContext(context);
    vm.runInContext(content, context);
    console.log(JSON.stringify(context.ITEMS_DATA));
    '''

    try:
        # Run Node.js to parse the JavaScript and get JSON output
        result = subprocess.run(
            ['node', '-e', temp_script],
            capture_output=True,
            text=True,
            check=True
        )
        items_data = json.loads(result.stdout)
        return items_data
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f'Failed to parse JavaScript file with Node.js: {e.stderr}')
    except FileNotFoundError:
        raise RuntimeError(
            'Node.js not found. Please install Node.js or use generate-sitemap.js instead.'
        )


def generate_sitemap():
    """Main function to generate sitemap.xml"""
    print('🚀 Starting sitemap generation...')

    # Extract items data using Node.js
    try:
        items_data = extract_items_data()
    except Exception as e:
        print(f'❌ Error parsing ITEMS_DATA: {e}')
        return False

    print(f'✅ Found {len(items_data)} items in database')

    # Generate sitemap XML
    current_date = get_current_date()
    sitemap_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <!-- Homepage -->',
        '  <url>',
        f'    <loc>{SITE_URL}/</loc>',
        f'    <lastmod>{current_date}</lastmod>',
        '    <changefreq>weekly</changefreq>',
        '    <priority>1.0</priority>',
        '  </url>',
        ''
    ]

    # Add each item as a URL
    for item in items_data:
        slug = create_slug(item['name'])
        item_url = f'{SITE_URL}/?item={slug}'

        sitemap_lines.extend([
            f'  <!-- {item["name"]} -->',
            '  <url>',
            f'    <loc>{item_url}</loc>',
            f'    <lastmod>{current_date}</lastmod>',
            '    <changefreq>monthly</changefreq>',
            '    <priority>0.8</priority>',
            '  </url>',
            ''
        ])

    # Add category pages
    categories = [
        'liquids',
        'electronics',
        'food',
        'toiletries',
        'medication',
        'tools',
        'sports',
        'baby',
        'customs'
    ]

    for category in categories:
        category_url = f'{SITE_URL}/?category={category}'
        sitemap_lines.extend([
            f'  <!-- Category: {category} -->',
            '  <url>',
            f'    <loc>{category_url}</loc>',
            f'    <lastmod>{current_date}</lastmod>',
            '    <changefreq>monthly</changefreq>',
            '    <priority>0.7</priority>',
            '  </url>',
            ''
        ])

    sitemap_lines.append('</urlset>')

    # Write sitemap.xml
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write('\n'.join(sitemap_lines))
    except Exception as e:
        print(f'❌ Error writing sitemap.xml: {e}')
        return False

    print(f'✅ Sitemap generated successfully!')
    print(f'   Output: {OUTPUT_FILE}')
    print(f'   Total URLs: {len(items_data) + len(categories) + 1}')
    print('')
    print('📝 Next Steps:')
    print('   1. Update SITE_URL in this script with your actual domain')
    print('   2. Upload sitemap.xml to your website root directory')
    print('   3. Submit to Google Search Console: https://search.google.com/search-console')
    print('   4. Verify ownership and submit sitemap URL')
    print('')
    print('🎯 SEO Tip: Re-run this script whenever you add/remove items from ITEMS_DATA')

    return True


if __name__ == '__main__':
    generate_sitemap()
