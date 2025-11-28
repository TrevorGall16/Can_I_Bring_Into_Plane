// Global variables
let itemsData = [];
let autocompleteTimeout = null;
let currentCountry = 'USA'; // Default country

// Country-specific rules database
const countryRules = {
    'USA': {
        title: 'Important TSA Rules (United States)',
        rules: [
            {
                title: '3-1-1 Liquids Rule',
                description: 'Carry-on liquids must be in containers of 3.4 oz (100ml) or less, all fitting in one quart-sized clear plastic bag.'
            },
            {
                title: 'Lithium Batteries',
                description: 'Spare lithium batteries and power banks must be in carry-on luggage only. Maximum 100Wh without approval.'
            },
            {
                title: 'Sharp Objects',
                description: 'Scissors under 4 inches allowed in carry-on. All knives must be checked. Tools under 7 inches generally allowed.'
            }
        ],
        specialNotes: {
            'Power Bank': 'Must be under 100Wh. Label must be clearly visible.',
            'Lighter': 'Only one disposable lighter allowed.',
            'Medications': 'Prescription label recommended but not required.'
        }
    },
    'China': {
        title: 'Important CAAC Rules (China)',
        rules: [
            {
                title: 'Liquids Restriction',
                description: 'Maximum 100ml per container, total 1 liter allowed in carry-on. Must be in sealed, transparent bag.'
            },
            {
                title: 'Power Banks (Critical!)',
                description: 'Power banks MUST have clear capacity marking and manufacturer logo. Unmarked power banks will be confiscated. Maximum 160Wh with airline approval.'
            },
            {
                title: 'Lighters & Matches',
                description: 'Lighters and matches are PROHIBITED in both carry-on and checked luggage in China.'
            }
        ],
        specialNotes: {
            'Power Bank': '⚠️ MUST have capacity marking (mAh or Wh) and brand logo clearly visible. Unmarked power banks will be confiscated!',
            'Lighter': '❌ Completely prohibited in China - both carry-on and checked!',
            'E-Cigarette': 'Allowed in carry-on only. Cannot be charged or used onboard.'
        }
    },
    'EU': {
        title: 'Important EASA Rules (European Union)',
        rules: [
            {
                title: 'Liquids, Aerosols & Gels',
                description: 'Maximum 100ml per container. All containers must fit in a single 1-liter transparent, resealable bag.'
            },
            {
                title: 'Lithium Batteries',
                description: 'Spare batteries in carry-on only. Power banks up to 100Wh allowed. 100-160Wh requires airline approval.'
            },
            {
                title: 'Sharp Objects',
                description: 'Knives and scissors with blades over 6cm prohibited in carry-on. Must be in checked luggage.'
            }
        ],
        specialNotes: {
            'Power Bank': 'Maximum 100Wh without approval. Must be in carry-on.',
            'Alcohol': 'Duty-free alcohol must remain sealed in security bag until final destination.'
        }
    },
    'UK': {
        title: 'Important UK Aviation Rules',
        rules: [
            {
                title: 'Liquids Rule',
                description: 'Maximum 100ml per container in a single transparent bag (20cm x 20cm). Duty-free liquids must remain sealed.'
            },
            {
                title: 'Electronic Devices',
                description: 'All electronic devices larger than phones must be screened separately. Power banks in carry-on only.'
            },
            {
                title: 'Prohibited Items',
                description: 'All knives, razor blades, and tools over 6cm prohibited in carry-on.'
            }
        ],
        specialNotes: {
            'Power Bank': 'Maximum 100Wh. Must be in carry-on luggage.',
            'Food Items': 'Fresh products from outside EU may be restricted.'
        }
    },
    'Canada': {
        title: 'Important CATSA Rules (Canada)',
        rules: [
            {
                title: 'Liquids & Gels',
                description: 'Maximum 100ml per container in a single 1-liter clear, resealable bag. Exceptions for medications and baby formula.'
            },
            {
                title: 'Lithium Batteries',
                description: 'Spare lithium batteries must be in carry-on. Maximum 100Wh without approval.'
            },
            {
                title: 'Tools & Sharp Objects',
                description: 'Tools must be less than 6cm from pivot point for carry-on. Scissors under 6cm allowed.'
            }
        ],
        specialNotes: {
            'Cannabis': 'Legal in Canada but prohibited on flights and across borders.',
            'Power Bank': 'Must be in carry-on. Maximum 100Wh.'
        }
    },
    'Australia': {
        title: 'Important Australian Aviation Rules',
        rules: [
            {
                title: 'Liquids, Aerosols & Gels',
                description: 'Maximum 100ml per container. All containers in a single 1-liter transparent bag.'
            },
            {
                title: 'Quarantine Rules',
                description: 'Strict quarantine on food, plants, and animal products. Heavy fines for non-declaration.'
            },
            {
                title: 'Lithium Batteries',
                description: 'Spare batteries in carry-on only. Maximum 100Wh per battery.'
            }
        ],
        specialNotes: {
            'Food Items': '⚠️ Most food items prohibited due to strict biosecurity. Declare everything!',
            'Power Bank': 'Must be in carry-on, under 100Wh.'
        }
    },
    'Japan': {
        title: 'Important Japanese Aviation Rules',
        rules: [
            {
                title: 'Liquids Rule',
                description: 'Maximum 100ml per container in a transparent bag. Total volume not exceeding 1 liter.'
            },
            {
                title: 'Lithium Batteries',
                description: 'Spare batteries and power banks in carry-on only. Maximum 100Wh without approval.'
            },
            {
                title: 'Sharp Objects',
                description: 'Scissors and knives with blades under 6cm may be allowed at security discretion.'
            }
        ],
        specialNotes: {
            'Power Bank': 'Must be in carry-on. Clear capacity marking required.',
            'Medications': 'Some medications require special documentation. Check before travel.'
        }
    },
    'International': {
        title: 'General International Aviation Rules',
        rules: [
            {
                title: 'Universal Liquids Rule',
                description: 'Most countries follow 100ml rule: containers max 100ml in 1-liter transparent bag.'
            },
            {
                title: 'Lithium Batteries',
                description: 'Globally: spare lithium batteries in carry-on only. Typical limit 100Wh.'
            },
            {
                title: 'Dangerous Goods',
                description: 'Flammable liquids, compressed gases, explosives prohibited everywhere.'
            }
        ],
        specialNotes: {
            'General': 'Always check your specific airline and destination country rules before travel.',
            'Documentation': 'Keep receipts and prescriptions for medications and expensive electronics.'
        }
    }
};

// Load data when page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page loaded, starting data fetch...');
    await loadData();
    initializeEventListeners();
    updateCountryRules(currentCountry); // Initialize with default country
    console.log('Initialization complete!');
});

// Load items from JSON
async function loadData() {
    try {
        console.log('Fetching items.json...');
        const response = await fetch('data/items.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        itemsData = data.items;
        console.log(`✅ Successfully loaded ${itemsData.length} items`);

        // Hide loading indicator if any
        const loader = document.getElementById('loadingIndicator');
        if (loader) loader.style.display = 'none';

        return true;
    } catch (error) {
        console.error('❌ Error loading data:', error);
        alert('Failed to load data. Please make sure you are running this from a web server (not opening the file directly). Try: python3 -m http.server 8000');
        return false;
    }
}

// Initialize all event listeners
function initializeEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const closeResult = document.getElementById('closeResult');
    const closeCategoryResults = document.getElementById('closeCategoryResults');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const popularTags = document.querySelectorAll('.popular-tag');
    const adClose = document.querySelector('.ad-close');
    const countrySelector = document.getElementById('countrySelector');

    // Country selector change
    countrySelector.addEventListener('change', (e) => {
        currentCountry = e.target.value;
        console.log('Country changed to:', currentCountry);
        updateCountryRules(currentCountry);
    });

    // Search input with autocomplete
    searchInput.addEventListener('input', (e) => {
        clearTimeout(autocompleteTimeout);
        autocompleteTimeout = setTimeout(() => {
            handleSearch(e.target.value);
        }, 300);
    });

    // Handle Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const value = e.target.value.trim();
            if (value) {
                clearTimeout(autocompleteTimeout);
                const item = findBestMatch(value);
                if (item) {
                    displayItemResult(item);
                    hideAutocomplete();
                }
            }
        }
    });

    // Close result card
    closeResult.addEventListener('click', () => {
        document.getElementById('resultCard').classList.add('hidden');
        document.getElementById('resultAd').classList.add('hidden');
        document.getElementById('searchInput').value = '';
    });

    // Close category results
    closeCategoryResults.addEventListener('click', () => {
        document.getElementById('categoryResults').classList.add('hidden');
        document.querySelector('.categories-section').classList.remove('hidden');
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
            if (item) {
                displayItemResult(item);
            }
        });
    });

    // Close sticky ad
    if (adClose) {
        adClose.addEventListener('click', () => {
            document.querySelector('.ad-banner-bottom').style.display = 'none';
            document.body.style.paddingBottom = '0';
        });
    }

    // Close autocomplete when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            hideAutocomplete();
        }
    });
}

// Handle search with autocomplete
function handleSearch(query) {
    const autocompleteResults = document.getElementById('autocompleteResults');

    console.log('Search query:', query);
    console.log('Items data length:', itemsData.length);

    if (query.trim().length < 2) {
        hideAutocomplete();
        return;
    }

    const matches = searchItems(query);
    console.log(`Found ${matches.length} matches for "${query}"`);

    if (matches.length === 0) {
        // Show "no results" message
        autocompleteResults.innerHTML = '<div class="autocomplete-item">No items found</div>';
        autocompleteResults.classList.remove('hidden');
        return;
    }

    displayAutocomplete(matches.slice(0, 5)); // Show top 5 matches
}

// Search items by name and keywords
function searchItems(query) {
    const lowerQuery = query.toLowerCase();

    return itemsData.filter(item => {
        // Search in name
        if (item.name.toLowerCase().includes(lowerQuery)) {
            return true;
        }

        // Search in keywords
        if (item.keywords && item.keywords.some(keyword =>
            keyword.toLowerCase().includes(lowerQuery)
        )) {
            return true;
        }

        return false;
    }).sort((a, b) => {
        // Prioritize exact name matches
        const aNameMatch = a.name.toLowerCase().startsWith(lowerQuery);
        const bNameMatch = b.name.toLowerCase().startsWith(lowerQuery);

        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;

        return 0;
    });
}

// Find best match for a query
function findBestMatch(query) {
    const matches = searchItems(query);
    return matches.length > 0 ? matches[0] : null;
}

// Display autocomplete results
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

// Display item result card
function displayItemResult(item) {
    const resultCard = document.getElementById('resultCard');
    const resultAd = document.getElementById('resultAd');

    // Populate item details
    document.getElementById('itemName').textContent = item.name;

    // Carry-on status
    const carryOnStatus = document.getElementById('carryOnStatus');
    carryOnStatus.textContent = formatStatus(item.carryOn);
    carryOnStatus.className = `status-value ${item.carryOn}`;

    // Checked luggage status
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

    // Show result card and ad
    resultCard.classList.remove('hidden');
    resultAd.classList.remove('hidden');

    // Scroll to result
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Format status text
function formatStatus(status) {
    const statusMap = {
        'allowed': '✅ Allowed',
        'prohibited': '❌ Not Allowed',
        'restricted': '⚠️ Restricted'
    };
    return statusMap[status] || status;
}

// Display related items
function displayRelatedItems(currentItem) {
    const relatedItemsDiv = document.getElementById('relatedItems');

    // Find items in same categories
    const relatedItems = itemsData.filter(item => {
        if (item.id === currentItem.id) return false;

        // Check if they share any categories
        if (currentItem.category && item.category) {
            return currentItem.category.some(cat => item.category.includes(cat));
        }

        return false;
    }).slice(0, 6); // Show max 6 related items

    if (relatedItems.length === 0) {
        relatedItemsDiv.innerHTML = '';
        return;
    }

    let html = '<h4>Related Items:</h4><div>';

    relatedItems.forEach(item => {
        html += `<span class="related-tag" onclick="showItemById(${item.id})">${item.name}</span>`;
    });

    html += '</div>';
    relatedItemsDiv.innerHTML = html;
}

// Show item by ID (for related items)
function showItemById(itemId) {
    const item = itemsData.find(i => i.id === itemId);
    if (item) {
        displayItemResult(item);
    }
}

// Display category results
function displayCategoryResults(category) {
    console.log('Displaying category:', category);
    console.log('Total items in database:', itemsData.length);

    const categoryResults = document.getElementById('categoryResults');
    const categoryTitle = document.getElementById('categoryTitle');
    const categoryItemsList = document.getElementById('categoryItemsList');

    // Filter items by category
    const items = itemsData.filter(item =>
        item.category && item.category.includes(category)
    );

    console.log(`Found ${items.length} items in category "${category}"`);

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

    // Display items
    categoryItemsList.innerHTML = '';

    if (items.length === 0) {
        categoryItemsList.innerHTML = '<p style="padding: 20px; text-align: center;">No items found in this category.</p>';
    } else {
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'category-item';
            div.onclick = () => {
                displayItemResult(item);
                document.getElementById('categoryResults').classList.add('hidden');
                document.querySelector('.categories-section').classList.remove('hidden');
            };

            div.innerHTML = `
                <h4>${item.name}</h4>
                <div class="category-item-status">
                    <span class="status-value ${item.carryOn}">
                        Carry-on: ${formatStatus(item.carryOn)}
                    </span>
                    <span class="status-value ${item.checked}">
                        Checked: ${formatStatus(item.checked)}
                    </span>
                </div>
            `;

            categoryItemsList.appendChild(div);
        });
    }

    // Hide categories section and show results
    document.querySelector('.categories-section').classList.add('hidden');
    categoryResults.classList.remove('hidden');

    // Scroll to results
    categoryResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Make showItemById globally accessible
window.showItemById = showItemById;

// Update country-specific rules display
function updateCountryRules(country) {
    const rulesData = countryRules[country];
    if (!rulesData) {
        console.error('No rules found for country:', country);
        return;
    }

    // Update title
    const rulesTitle = document.getElementById('rulesTitle');
    if (rulesTitle) {
        rulesTitle.textContent = rulesData.title;
    }

    // Update rules cards
    const rulesContainer = document.getElementById('countrySpecificRules');
    if (!rulesContainer) return;

    rulesContainer.innerHTML = '';

    rulesData.rules.forEach(rule => {
        const card = document.createElement('div');
        card.className = 'info-card';
        card.innerHTML = `
            <h4>${rule.title}</h4>
            <p>${rule.description}</p>
        `;
        rulesContainer.appendChild(card);
    });

    console.log(`Updated rules for ${country}`);
}
