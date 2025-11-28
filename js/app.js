// Global variables
let itemsData = [];
let autocompleteTimeout = null;

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initializeEventListeners();
});

// Load items from JSON
async function loadData() {
    try {
        const response = await fetch('data/items.json');
        const data = await response.json();
        itemsData = data.items;
        console.log(`Loaded ${itemsData.length} items`);
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load data. Please refresh the page.');
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

    if (query.trim().length < 2) {
        hideAutocomplete();
        return;
    }

    const matches = searchItems(query);

    if (matches.length === 0) {
        hideAutocomplete();
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
    const categoryResults = document.getElementById('categoryResults');
    const categoryTitle = document.getElementById('categoryTitle');
    const categoryItemsList = document.getElementById('categoryItemsList');

    // Filter items by category
    const items = itemsData.filter(item =>
        item.category && item.category.includes(category)
    );

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

    // Hide categories section and show results
    document.querySelector('.categories-section').classList.add('hidden');
    categoryResults.classList.remove('hidden');

    // Scroll to results
    categoryResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Make showItemById globally accessible
window.showItemById = showItemById;
