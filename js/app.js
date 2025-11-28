// Use embedded data from data-embedded.js
let itemsData = ITEMS_DATA;
let autocompleteTimeout = null;
let currentCountry = 'USA';

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
    const closeResult = document.getElementById('closeResult');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const popularTags = document.querySelectorAll('.popular-tag');
    const adClose = document.querySelector('.ad-close');
    const countrySelector = document.getElementById('countrySelector');

    // Country selector change - show rules when changed
    countrySelector.addEventListener('change', (e) => {
        currentCountry = e.target.value;
        console.log('Country changed to:', currentCountry);
        showCountryRules(currentCountry);
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

    // Close result
    closeResult.addEventListener('click', () => {
        document.getElementById('resultCard').classList.add('hidden');
        document.getElementById('categoryResults').classList.add('hidden');
        document.getElementById('countryRulesSection').classList.add('hidden');
        document.getElementById('resultAd').classList.add('hidden');
        document.getElementById('welcomeMessage').classList.remove('hidden');
        document.getElementById('searchInput').value = '';
    });

    // Category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            displayCategoryResults(category);
        });
    });

    // Popular tags
    popularTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const itemName = tag.getAttribute('data-item');
            const item = findBestMatch(itemName);
            if (item) displayItemResult(item);
        });
    });

    // Close sticky ad
    if (adClose) {
        adClose.addEventListener('click', () => {
            document.querySelector('.ad-banner-bottom').style.display = 'none';
        });
    }

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
function displayItemResult(item) {
    // Hide welcome and category results
    document.getElementById('welcomeMessage').classList.add('hidden');
    document.getElementById('categoryResults').classList.add('hidden');
    document.getElementById('countryRulesSection').classList.add('hidden');

    // Show result card
    const resultCard = document.getElementById('resultCard');
    document.getElementById('itemName').textContent = item.name;

    // Carry-on status
    const carryOnStatus = document.getElementById('carryOnStatus');
    carryOnStatus.textContent = formatStatus(item.carryOn);
    carryOnStatus.className = `status-value ${item.carryOn}`;

    // Checked status
    const checkedStatus = document.getElementById('checkedStatus');
    checkedStatus.textContent = formatStatus(item.checked);
    checkedStatus.className = `status-value ${item.checked}`;

    // Note
    const itemNote = document.getElementById('itemNote');
    if (item.note) {
        itemNote.textContent = `ℹ️ ${item.note}`;
        itemNote.style.display = 'block';
    } else {
        itemNote.style.display = 'none';
    }

    // Related items
    displayRelatedItems(item);

    // Show result and ad
    resultCard.classList.remove('hidden');
    document.getElementById('resultAd').classList.remove('hidden');
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

// Display category results
function displayCategoryResults(category) {
    console.log('Displaying category:', category);

    // Hide welcome and result card
    document.getElementById('welcomeMessage').classList.add('hidden');
    document.getElementById('resultCard').classList.add('hidden');
    document.getElementById('resultAd').classList.add('hidden');
    document.getElementById('countryRulesSection').classList.add('hidden');

    const categoryResults = document.getElementById('categoryResults');
    const categoryTitle = document.getElementById('categoryTitle');
    const categoryCount = document.getElementById('categoryCount');
    const categoryItemsList = document.getElementById('categoryItemsList');

    // Filter items
    const items = itemsData.filter(item => item.category && item.category.includes(category));
    console.log(`Found ${items.length} items in "${category}"`);

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

    // Display items
    categoryItemsList.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'category-item';
        div.onclick = () => displayItemResult(item);
        div.innerHTML = `
            <h4>${item.name}</h4>
            <div class="category-item-status">
                <span class="status-value ${item.carryOn}">Carry-on: ${formatStatus(item.carryOn)}</span>
                <span class="status-value ${item.checked}">Checked: ${formatStatus(item.checked)}</span>
            </div>
        `;
        categoryItemsList.appendChild(div);
    });

    categoryResults.classList.remove('hidden');
}

// Show country rules (only when country changes)
function showCountryRules(country) {
    const rulesData = countryRules[country];
    if (!rulesData) return;

    const rulesSection = document.getElementById('countryRulesSection');
    const rulesTitle = document.getElementById('rulesTitle');
    const rulesContainer = document.getElementById('countrySpecificRules');

    rulesTitle.textContent = rulesData.title;
    rulesContainer.innerHTML = '';

    rulesData.rules.forEach(rule => {
        const card = document.createElement('div');
        card.className = 'info-card';
        card.innerHTML = `<h4>${rule.title}</h4><p>${rule.description}</p>`;
        rulesContainer.appendChild(card);
    });

    // Hide other sections
    document.getElementById('welcomeMessage').classList.add('hidden');
    document.getElementById('resultCard').classList.add('hidden');
    document.getElementById('categoryResults').classList.add('hidden');
    document.getElementById('resultAd').classList.add('hidden');

    // Show rules section
    rulesSection.classList.remove('hidden');

    console.log(`Showing rules for ${country}`);
}

// Make globally accessible
window.showItemById = showItemById;

console.log('✅ App initialized! No server needed - works offline!');
