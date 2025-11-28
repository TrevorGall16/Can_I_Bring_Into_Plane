// Use embedded data from data-embedded.js
let itemsData = ITEMS_DATA;
let autocompleteTimeout = null;
let currentCountry = 'USA';

// Ad Provider - manages ad refreshes and prevents too frequent refreshes
class AdProvider {
    constructor() {
        this.inlineAdCounter = 0;
        this.lastRefreshTime = 0;
        this.minRefreshInterval = 1000; // Minimum 1 second between refreshes
    }

    // Refresh inline ad (called on category/country/item changes)
    refreshInlineAd() {
        const now = Date.now();

        // Prevent too frequent refreshes
        if (now - this.lastRefreshTime < this.minRefreshInterval) {
            return;
        }

        this.inlineAdCounter++;
        this.lastRefreshTime = now;

        // In a real implementation, this would reload the ad unit
        // For now, we just update the counter to show the ad is refreshing
        console.log(`📢 Inline ad refreshed (impression #${this.inlineAdCounter})`);

        // Find all inline ads and update them (if they exist)
        const inlineAds = document.querySelectorAll('.ad-inline .ad-placeholder');
        inlineAds.forEach(ad => {
            // Add a subtle animation to indicate refresh
            ad.style.opacity = '0.7';
            setTimeout(() => {
                ad.style.opacity = '1';
            }, 200);
        });
    }

    // Get current ad counter (useful for debugging)
    getImpressionCount() {
        return this.inlineAdCounter;
    }
}

// Initialize ad provider
const adProvider = new AdProvider();

// Country-specific rules database (copy from previous)
const countryRules = {
    'USA': {
        title: 'Important TSA Rules (United States)',
        rules: [
            { title: '3-1-1 Liquids Rule', description: 'Carry-on liquids must be in containers of 3.4 oz (100ml) or less, all fitting in one quart-sized clear plastic bag.' },
            { title: 'Lithium Batteries', description: 'Spare lithium batteries and power banks must be in carry-on luggage only. Maximum 100Wh without approval.' },
            { title: 'Sharp Objects', description: 'Scissors under 4 inches allowed in carry-on. All knives must be checked. Tools under 7 inches generally allowed.' }
        ]
    },
    'China': {
        title: 'Important CAAC Rules (China)',
        rules: [
            { title: 'Liquids Restriction', description: 'Maximum 100ml per container, total 1 liter allowed in carry-on. Must be in sealed, transparent bag.' },
            { title: 'Power Banks (Critical!)', description: 'Power banks MUST have clear capacity marking and manufacturer logo. Unmarked power banks will be confiscated. Maximum 160Wh with airline approval.' },
            { title: 'Lighters & Matches', description: 'Lighters and matches are PROHIBITED in both carry-on and checked luggage in China.' }
        ]
    },
    'EU': {
        title: 'Important EASA Rules (European Union)',
        rules: [
            { title: 'Liquids, Aerosols & Gels', description: 'Maximum 100ml per container. All containers must fit in a single 1-liter transparent, resealable bag.' },
            { title: 'Lithium Batteries', description: 'Spare batteries in carry-on only. Power banks up to 100Wh allowed. 100-160Wh requires airline approval.' },
            { title: 'Sharp Objects', description: 'Knives and scissors with blades over 6cm prohibited in carry-on. Must be in checked luggage.' }
        ]
    },
    'UK': {
        title: 'Important UK Aviation Rules',
        rules: [
            { title: 'Liquids Rule', description: 'Maximum 100ml per container in a single transparent bag (20cm x 20cm). Duty-free liquids must remain sealed.' },
            { title: 'Electronic Devices', description: 'All electronic devices larger than phones must be screened separately. Power banks in carry-on only.' },
            { title: 'Prohibited Items', description: 'All knives, razor blades, and tools over 6cm prohibited in carry-on.' }
        ]
    },
    'Canada': {
        title: 'Important CATSA Rules (Canada)',
        rules: [
            { title: 'Liquids & Gels', description: 'Maximum 100ml per container in a single 1-liter clear, resealable bag. Exceptions for medications and baby formula.' },
            { title: 'Lithium Batteries', description: 'Spare lithium batteries must be in carry-on. Maximum 100Wh without approval.' },
            { title: 'Tools & Sharp Objects', description: 'Tools must be less than 6cm from pivot point for carry-on. Scissors under 6cm allowed.' }
        ]
    },
    'Australia': {
        title: 'Important Australian Aviation Rules',
        rules: [
            { title: 'Liquids, Aerosols & Gels', description: 'Maximum 100ml per container. All containers in a single 1-liter transparent bag.' },
            { title: 'Quarantine Rules', description: 'Strict quarantine on food, plants, and animal products. Heavy fines for non-declaration.' },
            { title: 'Lithium Batteries', description: 'Spare batteries in carry-on only. Maximum 100Wh per battery.' }
        ]
    },
    'Japan': {
        title: 'Important Japanese Aviation Rules',
        rules: [
            { title: 'Liquids Rule', description: 'Maximum 100ml per container in a transparent bag. Total volume not exceeding 1 liter.' },
            { title: 'Lithium Batteries', description: 'Spare batteries and power banks in carry-on only. Maximum 100Wh without approval.' },
            { title: 'Sharp Objects', description: 'Scissors and knives with blades under 6cm may be allowed at security discretion.' }
        ]
    },
    'International': {
        title: 'General International Aviation Rules',
        rules: [
            { title: 'Universal Liquids Rule', description: 'Most countries follow 100ml rule: containers max 100ml in 1-liter transparent bag.' },
            { title: 'Lithium Batteries', description: 'Globally: spare lithium batteries in carry-on only. Typical limit 100Wh.' },
            { title: 'Dangerous Goods', description: 'Flammable liquids, compressed gases, explosives prohibited everywhere.' }
        ]
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log(`✅ Loaded ${itemsData.length} items from embedded data`);
    initializeEventListeners();
});

// Initialize event listeners
function initializeEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const popularTags = document.querySelectorAll('.popular-tag');
    const adClose = document.querySelector('.ad-close');
    const countrySelector = document.getElementById('countrySelector');

    // Country selector change - show rules when changed
    countrySelector.addEventListener('change', (e) => {
        currentCountry = e.target.value;
        console.log('Country changed to:', currentCountry);
        showCountryRules(currentCountry);
        adProvider.refreshInlineAd(); // Refresh ad on country change
    });

    // Search input
    searchInput.addEventListener('input', (e) => {
        clearTimeout(autocompleteTimeout);
        autocompleteTimeout = setTimeout(() => {
            handleSearch(e.target.value);
        }, 300);
    });

    // Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const value = e.target.value.trim();
            if (value) {
                const item = findBestMatch(value);
                if (item) {
                    displayItemResult(item);
                    hideAutocomplete();
                }
            }
        }
    });

    // Close result (note: this is handled dynamically now in displayItemResult)

    // Category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            displayCategoryResults(category);
            adProvider.refreshInlineAd(); // Refresh ad on category selection
        });
    });

    // Popular tags
    popularTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const itemName = tag.getAttribute('data-item');
            const item = findBestMatch(itemName);
            if (item) {
                displayItemResult(item);
                adProvider.refreshInlineAd(); // Refresh ad on popular item click
            }
        });
    });

    // Close autocomplete when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            hideAutocomplete();
        }
    });
}

// Handle search
function handleSearch(query) {
    const autocompleteResults = document.getElementById('autocompleteResults');

    if (query.trim().length < 2) {
        hideAutocomplete();
        return;
    }

    const matches = searchItems(query);
    console.log(`Found ${matches.length} matches for "${query}"`);

    if (matches.length === 0) {
        autocompleteResults.innerHTML = '<div class="autocomplete-item">No items found</div>';
        autocompleteResults.classList.remove('hidden');
        return;
    }

    displayAutocomplete(matches.slice(0, 5));
}

// Search items
function searchItems(query) {
    const lowerQuery = query.toLowerCase();
    return itemsData.filter(item => {
        if (item.name.toLowerCase().includes(lowerQuery)) return true;
        if (item.keywords && item.keywords.some(k => k.toLowerCase().includes(lowerQuery))) return true;
        return false;
    }).sort((a, b) => {
        const aMatch = a.name.toLowerCase().startsWith(lowerQuery);
        const bMatch = b.name.toLowerCase().startsWith(lowerQuery);
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
    });
}

// Find best match
function findBestMatch(query) {
    const matches = searchItems(query);
    return matches.length > 0 ? matches[0] : null;
}

// Display autocomplete
function displayAutocomplete(items) {
    const autocompleteResults = document.getElementById('autocompleteResults');
    autocompleteResults.innerHTML = '';

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'autocomplete-item';
        div.textContent = item.name;
        div.addEventListener('click', () => {
            displayItemResult(item);
            hideAutocomplete();
            document.getElementById('searchInput').value = '';
        });
        autocompleteResults.appendChild(div);
    });

    autocompleteResults.classList.remove('hidden');
}

// Hide autocomplete
function hideAutocomplete() {
    document.getElementById('autocompleteResults').classList.add('hidden');
}

// Display item result
function displayItemResult(item, keepMiddlePanel = false) {
    // Hide welcome message and country rules if they exist
    const welcomeMsg = document.getElementById('welcomeMessage');
    if (welcomeMsg) welcomeMsg.classList.add('hidden');

    const countryRulesSection = document.getElementById('countryRulesSection');
    if (countryRulesSection) countryRulesSection.classList.add('hidden');

    // Hide middle panel unless we're browsing a category
    if (!keepMiddlePanel) {
        document.getElementById('middlePanel').classList.add('hidden');
    }

    // Find variants of this item
    const variants = findItemVariants(item);

    // Get right panel and build the result card HTML
    const rightPanel = document.getElementById('rightPanel');

    // If item has variants, build selector HTML
    let variantSelectorHTML = '';
    if (variants.length > 1) {
        variantSelectorHTML = `
            <div class="variant-selector" id="variantSelector">
                <label for="variantSelect">Select option:</label>
                <select id="variantSelect" class="variant-select">
                    ${variants.map(variant => {
                        const match = variant.name.match(/\(([^)]+)\)/);
                        const variantDesc = match ? match[1] : variant.name;
                        const selected = variant.id === item.id ? 'selected' : '';
                        return `<option value="${variant.id}" ${selected}>${variantDesc}</option>`;
                    }).join('')}
                </select>
            </div>
        `;
    }

    // Build the complete item result HTML
    rightPanel.innerHTML = `
        <div class="result-card" id="resultCard">
            ${keepMiddlePanel ? '' : '<button class="close-btn" id="closeResult">&times;</button>'}
            <h2 class="item-name">${item.name}</h2>

            ${variantSelectorHTML}

            <div class="status-grid">
                <div class="status-box carry-on">
                    <div class="status-icon">🎒</div>
                    <div class="status-label">Carry-On</div>
                    <div class="status-value ${item.carryOn}">${formatStatus(item.carryOn)}</div>
                </div>

                <div class="status-box checked">
                    <div class="status-icon">🧳</div>
                    <div class="status-label">Checked Luggage</div>
                    <div class="status-value ${item.checked}">${formatStatus(item.checked)}</div>
                </div>
            </div>

            <div class="item-note">${formatNoteToBulletPoints(item.note)}</div>
            <div class="related-items" id="relatedItems"></div>
        </div>

        <div class="ad-inline" id="resultAd">
            <div class="ad-container">
                <span class="ad-label">🔖 AD (DEBUG) - Inline 300x250 - Refreshes on interaction</span>
                <div class="ad-placeholder ad-rectangle">
                    <p>💼 Ad Space - 300x250 Rectangle</p>
                    <p class="ad-subtext">Replace with real ad network code</p>
                </div>
            </div>
        </div>
    `;

    // Add event listener for variant selector if it exists
    if (variants.length > 1) {
        const variantSelect = document.getElementById('variantSelect');
        variantSelect.addEventListener('change', (e) => {
            const newItemId = parseInt(e.target.value);
            const newItem = itemsData.find(i => i.id === newItemId);
            if (newItem) {
                displayItemResult(newItem, keepMiddlePanel);
            }
        });
    }

    // Add event listener for close button if it exists
    if (!keepMiddlePanel) {
        const closeBtn = document.getElementById('closeResult');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                rightPanel.innerHTML = `
                    <div class="welcome-message">
                        <div class="welcome-icon">🔍</div>
                        <h2>Search for any item</h2>
                        <p>Type an item name in the search box or browse by category to see if it's allowed on your flight.</p>
                        <p class="welcome-note">Results will appear here →</p>
                    </div>
                `;
                document.getElementById('searchInput').value = '';
            });
        }
    }

    // Display related items
    displayRelatedItems(item);
}

// Find variants of an item (similar items with different sizes/types)
function findItemVariants(item) {
    // Extract base name (remove parentheses content)
    const baseName = item.name.replace(/\s*\([^)]*\)/g, '').trim();

    // Find all items that share the same base name
    const variants = itemsData.filter(i => {
        const iBaseName = i.name.replace(/\s*\([^)]*\)/g, '').trim();
        return iBaseName.toLowerCase() === baseName.toLowerCase();
    });

    return variants;
}

// Setup variant selector dropdown
function setupVariantSelector(selectedItem, variants) {
    const variantSelector = document.getElementById('variantSelector');
    const variantSelect = document.getElementById('variantSelect');

    // Clear existing options
    variantSelect.innerHTML = '';

    // Add options for each variant
    variants.forEach(variant => {
        const option = document.createElement('option');
        option.value = variant.id;

        // Extract the variant description (content in parentheses)
        const match = variant.name.match(/\(([^)]+)\)/);
        const variantDesc = match ? match[1] : variant.name;

        option.textContent = variantDesc;
        if (variant.id === selectedItem.id) {
            option.selected = true;
        }
        variantSelect.appendChild(option);
    });

    // Show the selector
    variantSelector.classList.remove('hidden');

    // Add change event listener
    variantSelect.onchange = (e) => {
        const newItemId = parseInt(e.target.value);
        const newItem = itemsData.find(i => i.id === newItemId);
        if (newItem) {
            updateItemDisplay(newItem);
        }
    };
}

// Update the display with item details
function updateItemDisplay(item) {
    // Update item name
    document.getElementById('itemName').textContent = item.name;

    // Carry-on status
    const carryOnStatus = document.getElementById('carryOnStatus');
    carryOnStatus.textContent = formatStatus(item.carryOn);
    carryOnStatus.className = `status-value ${item.carryOn}`;

    // Checked status
    const checkedStatus = document.getElementById('checkedStatus');
    checkedStatus.textContent = formatStatus(item.checked);
    checkedStatus.className = `status-value ${item.checked}`;

    // Note - Convert to bullet points
    const itemNote = document.getElementById('itemNote');
    if (item.note) {
        itemNote.innerHTML = formatNoteToBulletPoints(item.note);
        itemNote.style.display = 'block';
    } else {
        itemNote.style.display = 'none';
    }
}

// Add bold formatting to important keywords
function addBoldToKeywords(text) {
    // List of keywords to make bold
    const keywords = [
        'CRITICAL', 'Critical', 'WARNING', 'Warning', 'VERIFY', 'Verify',
        'ALWAYS', 'Always', 'NEVER', 'Never', 'MUST', 'Must',
        'PROHIBITED', 'Prohibited', 'REQUIRED', 'Required',
        'DANGEROUS', 'Dangerous', 'IMPORTANT', 'Important',
        'RESTRICTED', 'Restricted', 'NOT ALLOWED', 'Not allowed',
        'CONFISCATED', 'Confiscated', 'ILLEGAL', 'Illegal',
        'CARRY-ON', 'CHECKED', 'INTERNATIONAL', 'EXCEPTION', 'REQUIREMENTS',
        'TIP', 'TIPS', 'ALLOWED', 'NOT', 'NO', 'YES'
    ];

    let result = text;
    keywords.forEach(keyword => {
        // Use word boundaries to avoid partial matches
        const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
        result = result.replace(regex, '<strong>$1</strong>');
    });

    return result;
}

// Convert note text to bullet points
function formatNoteToBulletPoints(note) {
    // Split by common delimiters that indicate separate points
    // Look for: ✅ ❌ ⚠️ 💡 📞 🚨 and numbered lists (1), (2), etc.
    let points = [];

    // Split by emoji markers or numbered points
    const segments = note.split(/(?=✅|❌|⚠️|💡|📞|🚨|👶|🎒|🧳|\(\d+\))/);

    segments.forEach(segment => {
        segment = segment.trim();
        if (segment) {
            points.push(segment);
        }
    });

    // If no splitting occurred (no emojis), try splitting by sentences
    if (points.length <= 1) {
        // Split by period followed by space and capital letter or emoji
        points = note.split(/\.\s+(?=[A-Z✅❌⚠️💡📞🚨])/);
        points = points.map(p => p.trim()).filter(p => p);
        // Add period back if removed
        points = points.map(p => p.endsWith('.') || p.endsWith('!') || p.endsWith('?') ? p : p + '.');
    }

    // Apply bold formatting to keywords in each point
    points = points.map(point => addBoldToKeywords(point));

    // If we have multiple points, create a bullet list
    if (points.length > 1) {
        let html = '<ul>';
        points.forEach(point => {
            if (point.trim()) {
                html += `<li>${point}</li>`;
            }
        });
        html += '</ul>';
        return html;
    } else {
        // Single point, return as is with bold formatting
        return `<p>${addBoldToKeywords(note)}</p>`;
    }
}

// Format status
function formatStatus(status) {
    const map = {
        'allowed': '✅ Allowed',
        'prohibited': '❌ Not Allowed',
        'restricted': '⚠️ Restricted'
    };
    return map[status] || status;
}

// Display related items
function displayRelatedItems(currentItem) {
    const relatedItemsDiv = document.getElementById('relatedItems');
    const related = itemsData.filter(item => {
        if (item.id === currentItem.id) return false;
        if (currentItem.category && item.category) {
            return currentItem.category.some(cat => item.category.includes(cat));
        }
        return false;
    }).slice(0, 6);

    if (related.length === 0) {
        relatedItemsDiv.innerHTML = '';
        return;
    }

    let html = '<h4>Related Items:</h4><div>';
    related.forEach(item => {
        html += `<span class="related-tag" onclick="showItemById(${item.id})">${item.name}</span>`;
    });
    html += '</div>';
    relatedItemsDiv.innerHTML = html;
}

// Show item by ID
function showItemById(itemId) {
    const item = itemsData.find(i => i.id === itemId);
    if (item) displayItemResult(item);
}

// Display category results in middle panel
function displayCategoryResults(category) {
    console.log('Displaying category:', category);

    // Show middle panel, hide welcome message
    const middlePanel = document.getElementById('middlePanel');
    const rightPanel = document.getElementById('rightPanel');

    // Hide welcome message if it exists
    const welcomeMsg = document.getElementById('welcomeMessage');
    if (welcomeMsg) welcomeMsg.classList.add('hidden');

    // Hide country rules if they exist
    const countryRules = document.getElementById('countryRulesSection');
    if (countryRules) countryRules.classList.add('hidden');

    const categoryTitle = document.getElementById('categoryTitle');
    const categoryCount = document.getElementById('categoryCount');
    const categoryItemsList = document.getElementById('categoryItemsList');

    // Filter items
    const items = itemsData.filter(item => item.category && item.category.includes(category));
    console.log(`Found ${items.length} items in "${category}"`);

    // Sort items: allowed in both → allowed in one → not allowed in either
    items.sort((a, b) => {
        const aScore = (a.carryOn === 'allowed' ? 2 : 0) + (a.checked === 'allowed' ? 2 : 0) +
                      (a.carryOn === 'restricted' ? 1 : 0) + (a.checked === 'restricted' ? 1 : 0);
        const bScore = (b.carryOn === 'allowed' ? 2 : 0) + (b.checked === 'allowed' ? 2 : 0) +
                      (b.carryOn === 'restricted' ? 1 : 0) + (b.checked === 'restricted' ? 1 : 0);
        return bScore - aScore; // Higher score = more allowed = higher in list
    });

    // Update title
    const categoryNames = {
        'liquids': '💧 Liquids',
        'electronics': '📱 Electronics',
        'food': '🍎 Food & Snacks',
        'toiletries': '🧴 Toiletries',
        'medication': '💊 Medication',
        'tools': '🔧 Tools',
        'sports': '⚽ Sports Equipment',
        'baby': '👶 Baby Items'
    };

    categoryTitle.textContent = categoryNames[category] || category;
    categoryCount.textContent = `${items.length} items`;

    // Display items in middle panel
    categoryItemsList.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'category-item-card';
        div.onclick = () => {
            // Remove active class from all items
            document.querySelectorAll('.category-item-card').forEach(card => {
                card.classList.remove('active');
            });
            // Add active class to clicked item
            div.classList.add('active');
            // Show item details in right panel
            displayItemResult(item, true); // true = keep middle panel visible
            adProvider.refreshInlineAd(); // Refresh ad on item click
        };

        const statusCarryOn = item.carryOn === 'allowed' ? 'status-allowed' :
                             item.carryOn === 'restricted' ? 'status-restricted' : 'status-prohibited';
        const statusChecked = item.checked === 'allowed' ? 'status-allowed' :
                             item.checked === 'restricted' ? 'status-restricted' : 'status-prohibited';

        div.innerHTML = `
            <div class="category-item-name">${item.name}</div>
            <div class="category-item-status">
                <span class="${statusCarryOn}">🎒 ${formatStatus(item.carryOn)}</span>
                <span class="${statusChecked}">🧳 ${formatStatus(item.checked)}</span>
            </div>
        `;
        categoryItemsList.appendChild(div);
    });

    // Show middle panel
    middlePanel.classList.remove('hidden');

    // Show a message in right panel prompting to select an item
    rightPanel.innerHTML = `
        <div class="welcome-message">
            <div class="welcome-icon">👈</div>
            <h2>Select an item</h2>
            <p>Click on an item from the ${categoryNames[category]} category to see details.</p>
        </div>
    `;
}

// Show country rules (only when country changes)
function showCountryRules(country) {
    const rulesData = countryRules[country];
    if (!rulesData) return;

    // Get the right panel and rebuild it with country rules
    const rightPanel = document.getElementById('rightPanel');

    // Build the country rules HTML
    let rulesCardsHTML = '';
    rulesData.rules.forEach(rule => {
        rulesCardsHTML += `
            <div class="info-card">
                <h4>${rule.title}</h4>
                <p>${rule.description}</p>
            </div>
        `;
    });

    // Completely rebuild right panel with country rules
    rightPanel.innerHTML = `
        <div class="country-rules-section" id="countryRulesSection">
            <!-- Disclaimer Banner -->
            <div class="country-disclaimer">
                <strong>⚠️ Important Disclaimer:</strong> This information is for general guidance only. We are NOT responsible for any misinformation or outdated data. Rules change frequently. <strong>ALWAYS verify with your airline and airport before travel.</strong> Failure to comply may result in confiscation or denied boarding.
            </div>

            <h3 id="rulesTitle">${rulesData.title}</h3>
            <div class="info-cards">
                ${rulesCardsHTML}
            </div>

            <div class="verify-reminder">
                📞 <strong>Always verify:</strong> Call your airline, check their website, or contact the airport security directly before your flight.
            </div>
        </div>
    `;

    // Hide middle panel when showing country rules
    document.getElementById('middlePanel').classList.add('hidden');

    console.log(`Showing rules for ${country}`);
}

// Make globally accessible
window.showItemById = showItemById;

console.log('✅ App initialized! No server needed - works offline!');
