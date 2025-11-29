// Use embedded data from data-embedded.js
// This relies on <script src="js/data-embedded.js"></script> in index.html
let itemsData = (typeof ITEMS_DATA !== 'undefined') ? ITEMS_DATA : [];
let autocompleteTimeout = null;
let currentCountry = 'USA';

// Setup Set for Saved Items (My Bag)
let savedItems = new Set(); 

// Load saved items from localStorage on startup
if (localStorage.getItem('myBag')) {
    try {
        const savedIds = JSON.parse(localStorage.getItem('myBag'));
        savedIds.forEach(id => savedItems.add(id));
    } catch (e) {
        console.error("Error loading saved bag:", e);
    }
}

<<<<<<< HEAD
// ---------------------------------------------------------
// AD PROVIDER CLASS (Real AdSense Integration)
// ---------------------------------------------------------
=======
// Save items to localStorage
function saveSavedItems() {
    localStorage.setItem('myCarryOnBag', JSON.stringify([...savedItems]));
}

// Toggle item in bag
function toggleItemInBag(itemId) {
    if (savedItems.has(itemId)) {
        savedItems.delete(itemId);
    } else {
        savedItems.add(itemId);
    }
    saveSavedItems();
}

// Update bag button state
function updateBagButton(itemId) {
    const btn = document.getElementById('addToBagBtn');
    if (!btn) return;

    if (savedItems.has(itemId)) {
        btn.innerHTML = '<span class="btn-icon">➖</span><span class="btn-text">Remove from Bag</span>';
        btn.classList.add('in-bag');
    } else {
        btn.innerHTML = '<span class="btn-icon">➕</span><span class="btn-text">Add to My Bag</span>';
        btn.classList.remove('in-bag');
    }
}

// Update FAB counter
function updateBagFAB() {
    const fab = document.getElementById('bagFAB');
    if (fab) {
        const counter = fab.querySelector('.bag-counter');
        if (counter) {
            counter.textContent = savedItems.size;
        }
    }
}

// Share item result
function shareItemResult(item) {
    const slug = seoManager.createSlug(item.name);
    const url = `${window.location.origin}${window.location.pathname}?item=${slug}`;
    const text = `Check if ${item.name} is allowed on a plane: ${url}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('✅ Link copied to clipboard!');
        }).catch(() => {
            showToast('❌ Failed to copy link');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('✅ Link copied to clipboard!');
        } catch (err) {
            showToast('❌ Failed to copy link');
        }
        document.body.removeChild(textArea);
    }
}

// Show toast notification
function showToast(message) {
    // Remove existing toast if any
    const existingToast = document.getElementById('toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast show';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Open bag modal
function openBagModal() {
    const bagItems = itemsData.filter(item => savedItems.has(item.id));

    // Count by status
    const allowed = bagItems.filter(item => item.carryOn === 'allowed' && item.checked === 'allowed').length;
    const restricted = bagItems.filter(item => item.carryOn === 'restricted' || item.checked === 'restricted').length;
    const prohibited = bagItems.filter(item => item.carryOn === 'prohibited' && item.checked === 'prohibited').length;

    let itemsHTML = '';
    if (bagItems.length === 0) {
        itemsHTML = '<div class="empty-bag">🎒 Your bag is empty. Start adding items!</div>';
    } else {
        bagItems.forEach(item => {
            const statusIcon = (item.carryOn === 'allowed' && item.checked === 'allowed') ? '✅' :
                             (item.carryOn === 'prohibited' && item.checked === 'prohibited') ? '❌' : '⚠️';
            itemsHTML += `
                <div class="bag-item">
                    <span class="bag-item-status">${statusIcon}</span>
                    <span class="bag-item-name">${item.name}</span>
                    <button class="bag-item-remove" onclick="removeFromBagAndUpdate(${item.id})">Remove</button>
                </div>
            `;
        });
    }

    const summaryHTML = bagItems.length > 0 ? `
        <div class="bag-summary">
            <strong>Summary:</strong>
            ${allowed > 0 ? `<span class="summary-allowed">${allowed} Allowed</span>` : ''}
            ${restricted > 0 ? `<span class="summary-restricted">${restricted} Restricted</span>` : ''}
            ${prohibited > 0 ? `<span class="summary-prohibited">${prohibited} Prohibited</span>` : ''}
        </div>
    ` : '';

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'bagModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>🎒 My Carry-On Bag</h2>
                <button class="modal-close" id="closeBagModal">&times;</button>
            </div>
            ${summaryHTML}
            <div class="bag-items-list">
                ${itemsHTML}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add event listener to close button
    document.getElementById('closeBagModal').addEventListener('click', () => {
        modal.remove();
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Remove from bag and update UI
function removeFromBagAndUpdate(itemId) {
    savedItems.delete(itemId);
    saveSavedItems();
    updateBagFAB();

    // Close and reopen modal to update
    const modal = document.getElementById('bagModal');
    if (modal) {
        modal.remove();
        openBagModal();
    }
}

// Make globally accessible
window.removeFromBagAndUpdate = removeFromBagAndUpdate;

// Ad Provider - manages ad refreshes and prevents too frequent refreshes
>>>>>>> a9a616004d6dfffbd551b9f3d7b27552fb2ea1cf
class AdProvider {
    constructor() {
        this.inlineAdCounter = 0;
        this.lastRefreshTime = 0;
        this.minRefreshInterval = 30000; // 30 seconds wait between refreshes
        this.clientId = 'ca-pub-8732422930809097'; // Your Real ID
        
        // Initialize Top Banner Ad immediately
        this.initTopBanner();
    }

    initTopBanner() {
        const adSlot = document.getElementById('ad-top-slot');
        if (adSlot) {
            adSlot.innerHTML = `
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="${this.clientId}"
                     data-ad-slot="1234567890" 
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            `;
            // Push the ad to Google
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("AdSense error (Top):", e);
            }
        }
    }

    // Refresh inline ad (called on category/country/item changes)
    refreshInlineAd() {
        const now = Date.now();

        // 1. Rate Limiting Check (AdSense Policy Compliance)
        if (now - this.lastRefreshTime < this.minRefreshInterval) {
            return; // Too soon to refresh
        }

        this.inlineAdCounter++;
        this.lastRefreshTime = now;
        console.log(`📢 Inline ad refreshed (impression #${this.inlineAdCounter})`);

        // 2. Find the ad container
        const adContainer = document.getElementById('ad-inline-slot');
        
        if (adContainer) {
            // 3. Destroy old ad (clear HTML)
            adContainer.innerHTML = '';

            // 4. Inject new AdSense Unit (Rectangle)
            // Note: Once you create the 'Inline Ad' in AdSense dashboard, replace "0987654321" below with that ID
            adContainer.innerHTML = `
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="${this.clientId}"
                     data-ad-slot="0987654321" 
                     data-ad-format="rectangle"
                     data-full-width-responsive="true"></ins>
            `;

            // 5. Trigger Google's script to fill the slot
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("AdSense refresh error (Inline):", e);
            }
        }
    }
}

// Initialize ad provider
const adProvider = new AdProvider();

<<<<<<< HEAD
// ---------------------------------------------------------
// NAVIGATION MANAGER (History & Back Button)
// ---------------------------------------------------------
=======
// SEO Manager - handles dynamic meta tags for search engine optimization
class SEOManager {
    // Create URL-friendly slug from item name
    createSlug(itemName) {
        return itemName
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim();
    }

    // Update page title and meta description for SEO
    updateMetaTags(item) {
        // Update page title
        const title = `Can I bring ${item.name} on a plane? | Airport Carry-On Rules`;
        document.title = title;

        // Update meta description
        const status = item.carryOn === 'allowed' ? 'allowed' :
                      item.carryOn === 'restricted' ? 'restricted' : 'not allowed';
        const description = `Find out if ${item.name} is ${status} in carry-on luggage. Get instant TSA and international airport security rules for ${item.name}.`;

        // Find or create meta description tag
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = description;

        // Update Open Graph tags for social sharing (optional but helps SEO)
        this.updateOpenGraphTags(item, title, description);
    }

    // Update Open Graph meta tags for better social media sharing
    updateOpenGraphTags(item, title, description) {
        const ogTags = {
            'og:title': title,
            'og:description': description,
            'og:type': 'website',
            'og:url': window.location.href
        };

        Object.entries(ogTags).forEach(([property, content]) => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute('property', property);
                document.head.appendChild(tag);
            }
            tag.content = content;
        });
    }

    // Reset to default meta tags
    resetMetaTags() {
        document.title = 'Can I Bring This On A Plane? | Airport Carry-On Checker';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = 'Can I bring this on a plane? Instantly check if items are allowed in carry-on or checked luggage. Fast, simple airport security rules for travelers.';
        }
    }
}

const seoManager = new SEOManager();

// Navigation state manager for History API and deep linking
>>>>>>> a9a616004d6dfffbd551b9f3d7b27552fb2ea1cf
class NavigationManager {
    constructor() {
        this.scrollPositions = new Map();
    }

    saveScrollPosition(key) {
        const rightPanel = document.getElementById('rightPanel');
        if (rightPanel) this.scrollPositions.set(key, rightPanel.scrollTop);
    }

    restoreScrollPosition(key) {
        const rightPanel = document.getElementById('rightPanel');
        if (rightPanel && this.scrollPositions.has(key)) {
            setTimeout(() => { rightPanel.scrollTop = this.scrollPositions.get(key); }, 50);
        }
    }

<<<<<<< HEAD
    pushState(itemId, itemName) {
        const url = new URL(window.location);
        url.searchParams.set('item', itemId);
        window.history.pushState({ itemId, itemName }, '', url);
=======
    // Update URL without page reload (using slug for better SEO)
    pushState(itemId, itemName) {
        const url = new URL(window.location);
        const slug = seoManager.createSlug(itemName);
        url.searchParams.set('item', slug);
        window.history.pushState(
            { itemId, itemName, slug, timestamp: Date.now() },
            '',
            url
        );
>>>>>>> a9a616004d6dfffbd551b9f3d7b27552fb2ea1cf
    }

    pushCategoryState(category) {
        const url = new URL(window.location);
        url.searchParams.set('category', category);
        url.searchParams.delete('item');
        window.history.pushState({ category }, '', url);
    }

    loadFromURL() {
        const url = new URL(window.location);
        const itemParam = url.searchParams.get('item');
        const category = url.searchParams.get('category');

<<<<<<< HEAD
        if (itemId) {
            const item = itemsData.find(i => i.id === parseInt(itemId));
            if (item) { displayItemResult(item, false); return true; }
=======
        if (itemParam) {
            // Try to find by slug first (for SEO-friendly URLs)
            let item = itemsData.find(i => seoManager.createSlug(i.name) === itemParam);

            // Fallback to ID for backward compatibility
            if (!item) {
                const itemId = parseInt(itemParam);
                if (!isNaN(itemId)) {
                    item = itemsData.find(i => i.id === itemId);
                }
            }

            if (item) {
                displayItemResult(item, false);
                return true;
            }
>>>>>>> a9a616004d6dfffbd551b9f3d7b27552fb2ea1cf
        } else if (category) {
            displayCategoryResults(category);
            return true;
        }
        return false;
    }
}

const navManager = new NavigationManager();

// ---------------------------------------------------------
// COUNTRY RULES DATA
// ---------------------------------------------------------
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

// ---------------------------------------------------------
// INITIALIZATION
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Safety check for data
    if (itemsData.length === 0) {
        console.error("❌ ITEMS_DATA is empty. Check if data-embedded.js is loaded correctly.");
    } else {
        console.log(`✅ Loaded ${itemsData.length} items from embedded data`);
    }

    // CSS :has() fallback for older browsers
    if (!CSS.supports('selector(:has(*))')) {
        const observer = new MutationObserver(() => {
            const middlePanel = document.getElementById('middlePanel');
            const container = document.querySelector('.three-column-container');
            if (middlePanel && container) {
                if (middlePanel.classList.contains('hidden')) {
                    container.style.gridTemplateColumns = '350px 1fr';
                } else {
                    container.style.gridTemplateColumns = '350px 300px 1fr';
                }
            }
        });
        const middlePanel = document.getElementById('middlePanel');
        if (middlePanel) observer.observe(middlePanel, { attributes: true, attributeFilter: ['class'] });
    }

    initializeEventListeners();
    updateBagCounter(); // Initialize bag count
    navManager.loadFromURL();
});

// Handle Back Button
window.addEventListener('popstate', (event) => {
    if (event.state) {
        if (event.state.itemId) {
            const item = itemsData.find(i => i.id === parseInt(event.state.itemId));
            if (item) displayItemResult(item, false, true);
        } else if (event.state.category) {
            displayCategoryResults(event.state.category, true);
        } else if (event.state.home) {
            const rightPanel = document.getElementById('rightPanel');
<<<<<<< HEAD
            document.getElementById('middlePanel').classList.add('hidden');
=======
            const middlePanel = document.getElementById('middlePanel');

            if (middlePanel) middlePanel.classList.add('hidden');

            // Restore welcome message
>>>>>>> a9a616004d6dfffbd551b9f3d7b27552fb2ea1cf
            rightPanel.innerHTML = `
                <div class="welcome-message" id="welcomeMessage">
                    <div class="welcome-icon">🔍</div>
                    <h2>Search for any item</h2>
<<<<<<< HEAD
                    <p>Type an item name in the search box...</p>
                </div>`;
=======
                    <p>Type an item name in the search box or browse by category to see if it's allowed on your flight.</p>
                    <p class="welcome-note">Results will appear here →</p>
                </div>
            `;

            // Reset meta tags to default
            seoManager.resetMetaTags();
>>>>>>> a9a616004d6dfffbd551b9f3d7b27552fb2ea1cf
        }
    } else {
        navManager.loadFromURL();
    }
});

function initializeEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const popularTags = document.querySelectorAll('.popular-tag');
    const countrySelector = document.getElementById('countrySelector');
    const bagFAB = document.getElementById('bagFAB');

    // "My Bag" Click
    if (bagFAB) {
        bagFAB.addEventListener('click', showMyBagModal);
    }

    // Country change
    countrySelector.addEventListener('change', (e) => {
        currentCountry = e.target.value;
        showCountryRules(currentCountry);
        adProvider.refreshInlineAd();
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        clearTimeout(autocompleteTimeout);
        autocompleteTimeout = setTimeout(() => { handleSearch(e.target.value); }, 300);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const item = findBestMatch(e.target.value.trim());
            if (item) { displayItemResult(item); hideAutocomplete(); }
        }
    });

    // Categories
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            displayCategoryResults(button.getAttribute('data-category'));
            adProvider.refreshInlineAd();
        });
    });

    // Popular tags
    popularTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const item = findBestMatch(tag.getAttribute('data-item'));
            if (item) { displayItemResult(item); adProvider.refreshInlineAd(); }
        });
    });

    // Close autocomplete on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) hideAutocomplete();
    });
}

// ---------------------------------------------------------
// SEARCH & LOGIC
// ---------------------------------------------------------
function handleSearch(query) {
    const autocompleteResults = document.getElementById('autocompleteResults');
    if (query.trim().length < 2) { hideAutocomplete(); return; }

    const matches = searchItems(query);
    if (matches.length === 0) {
        autocompleteResults.innerHTML = '<div class="autocomplete-item">No items found</div>';
        autocompleteResults.classList.remove('hidden');
        return;
    }
    displayAutocomplete(matches.slice(0, 5));
}

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

function findBestMatch(query) {
    const matches = searchItems(query);
    return matches.length > 0 ? matches[0] : null;
}

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

function hideAutocomplete() {
    document.getElementById('autocompleteResults').classList.add('hidden');
}

// ---------------------------------------------------------
// DISPLAY ITEM (The Core Function)
// ---------------------------------------------------------
function displayItemResult(item, keepMiddlePanel = false, skipHistoryPush = false) {
    const scrollKey = `item-${item.id}`;
    navManager.saveScrollPosition(scrollKey);

    if (!skipHistoryPush) navManager.pushState(item.id, item.name);

<<<<<<< HEAD
    document.getElementById('welcomeMessage')?.classList.add('hidden');
    document.getElementById('countryRulesSection')?.classList.add('hidden');
    if (!keepMiddlePanel) document.getElementById('middlePanel').classList.add('hidden');
=======
    // Update SEO meta tags for this item (CRITICAL for Google indexing)
    seoManager.updateMetaTags(item);

    // Hide welcome message and country rules if they exist
    const welcomeMsg = document.getElementById('welcomeMessage');
    if (welcomeMsg) welcomeMsg.classList.add('hidden');
>>>>>>> a9a616004d6dfffbd551b9f3d7b27552fb2ea1cf

    const variants = findItemVariants(item);
    const rightPanel = document.getElementById('rightPanel');

    // Build Variant Dropdown
    let variantSelectorHTML = '';
    if (variants.length > 1) {
        variantSelectorHTML = `
            <div class="variant-selector">
                <label>Select option:</label>
                <select id="variantSelect" class="variant-select">
                    ${variants.map(v => {
                        const name = v.name.match(/\(([^)]+)\)/) ? v.name.match(/\(([^)]+)\)/)[1] : v.name;
                        return `<option value="${v.id}" ${v.id === item.id ? 'selected' : ''}>${name}</option>`;
                    }).join('')}
                </select>
            </div>`;
    }

    // Customs Warning
    let customsWarningHTML = '';
    if (item.customs_restricted && item.customs_restricted.includes(currentCountry)) {
        customsWarningHTML = `
            <div class="customs-warning-banner">
                <div class="customs-warning-icon">🚨</div>
                <div class="customs-warning-content">
                    <strong>CUSTOMS WARNING:</strong> BANNED entering ${currentCountry}. Discard before Customs.
                </div>
            </div>`;
    }

    // Amazon & Bag Buttons
    const amazonLink = `https://www.amazon.com/s?k=travel+${encodeURIComponent(item.name)}&tag=canibring-20`;
    const isSaved = savedItems.has(item.id);
    const bagBtnText = isSaved ? '✅ Saved to Bag' : '➕ Add to Bag';
    const bagBtnClass = isSaved ? 'action-btn saved' : 'action-btn';

    // RENDER HTML
    rightPanel.innerHTML = `
        <div class="result-card" id="resultCard">
            ${keepMiddlePanel ? '' : '<button class="close-btn" id="closeResult">&times;</button>'}
            <h2 class="item-name">
                ${item.name} 
                <button class="share-icon" onclick="shareItemLink(${item.id})" title="Copy Link">🔗</button>
            </h2>

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

            ${customsWarningHTML}

            <div class="action-buttons-row">
                <a href="${amazonLink}" target="_blank" class="action-btn amazon-btn">🛒 Shop on Amazon</a>
                <button class="${bagBtnClass}" onclick="toggleBagItem(${item.id})">${bagBtnText}</button>
            </div>

            <div class="item-note">${formatNoteToBulletPoints(item.note)}</div>
            <div class="related-items" id="relatedItems"></div>
        </div>

        <!-- Ad Slot Container (Must exist for AdProvider) -->
        <div class="ad-inline" id="resultAd">
            <div class="ad-container">
                <div id="ad-inline-slot" class="ad-slot"></div>
            </div>
        </div>
    `;

    // Re-attach listeners
    if (variants.length > 1) {
        document.getElementById('variantSelect').onchange = (e) => {
            const newItem = itemsData.find(i => i.id === parseInt(e.target.value));
            if (newItem) displayItemResult(newItem, keepMiddlePanel);
        };
    }

    if (!keepMiddlePanel) {
        document.getElementById('closeResult')?.addEventListener('click', () => {
            rightPanel.innerHTML = `<div class="welcome-message"><div class="welcome-icon">🔍</div><h2>Search for any item</h2></div>`;
            document.getElementById('searchInput').value = '';
        });
    }

    displayRelatedItems(item);
    adProvider.refreshInlineAd(); // Trigger Ad
    navManager.restoreScrollPosition(scrollKey);
}

// ---------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------
function findItemVariants(item) {
    const baseName = item.name.replace(/\s*\([^)]*\)/g, '').trim();
    return itemsData.filter(i => i.name.replace(/\s*\([^)]*\)/g, '').trim().toLowerCase() === baseName.toLowerCase());
}

function formatStatus(status) {
    const map = { 'allowed': '✅ Allowed', 'prohibited': '❌ Not Allowed', 'restricted': '⚠️ Restricted' };
    return map[status] || status;
}

function formatNoteToBulletPoints(note) {
    let points = [];
    const segments = note.split(/(?=✅|❌|⚠️|💡|📞|🚨)/);
    segments.forEach(s => { if(s.trim()) points.push(s.trim()); });
    
    if (points.length <= 1) return `<p>${addBoldToKeywords(note)}</p>`;
    return `<ul>${points.map(p => `<li>${addBoldToKeywords(p)}</li>`).join('')}</ul>`;
}

function addBoldToKeywords(text) {
    const keywords = ['CRITICAL', 'WARNING', 'ALWAYS', 'NEVER', 'MUST', 'PROHIBITED', 'REQUIRED', 'RESTRICTED', 'CARRY-ON', 'CHECKED'];
    let result = text;
    keywords.forEach(k => { result = result.replace(new RegExp(`\\b(${k})\\b`, 'gi'), '<strong>$1</strong>'); });
    return result;
}

function displayRelatedItems(currentItem) {
    const relatedItemsDiv = document.getElementById('relatedItems');
    const related = itemsData.filter(i => i.id !== currentItem.id && currentItem.category?.some(c => i.category.includes(c))).slice(0, 6);
    if (related.length === 0) { relatedItemsDiv.innerHTML = ''; return; }
    relatedItemsDiv.innerHTML = '<h4>Related:</h4><div>' + related.map(i => `<span class="related-tag" onclick="showItemById(${i.id})">${i.name}</span>`).join('') + '</div>';
}

function displayCategoryResults(category, skipHistoryPush = false) {
    if (!skipHistoryPush) navManager.pushCategoryState(category);
    
    document.getElementById('middlePanel').classList.remove('hidden');
    document.getElementById('welcomeMessage')?.classList.add('hidden');
    document.getElementById('countryRulesSection')?.classList.add('hidden');

    const items = itemsData.filter(i => i.category && i.category.includes(category));
    document.getElementById('categoryTitle').textContent = category.toUpperCase();
    document.getElementById('categoryCount').textContent = `${items.length} items`;

    const list = document.getElementById('categoryItemsList');
    list.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'category-item-card';
        div.innerHTML = `
            <div class="category-item-name">${item.name}</div>
            <div class="category-item-status">
                <span class="${item.carryOn === 'allowed' ? 'status-allowed' : 'status-restricted'}">🎒 ${formatStatus(item.carryOn)}</span>
            </div>`;
        div.onclick = () => displayItemResult(item, true);
        list.appendChild(div);
    });
    
    document.getElementById('rightPanel').innerHTML = `<div class="welcome-message"><h2>Select an item</h2></div>`;
    adProvider.refreshInlineAd();
}

function showCountryRules(country) {
    const rules = countryRules[country];
    if (!rules) return;
    const rightPanel = document.getElementById('rightPanel');
    document.getElementById('middlePanel').classList.add('hidden');
    
    const cards = rules.rules.map(r => `<div class="info-card"><h4>${r.title}</h4><p>${r.description}</p></div>`).join('');
    
    rightPanel.innerHTML = `
        <div class="country-rules-section">
            <div class="country-disclaimer">⚠️ <strong>Note:</strong> Rules change. Verify with airline.</div>
            <h3>${rules.title}</h3>
            <div class="info-cards">${cards}</div>
        </div>
        <div class="ad-inline"><div class="ad-container"><div id="ad-inline-slot" class="ad-slot"></div></div></div>
    `;
    adProvider.refreshInlineAd();
}

// ---------------------------------------------------------
// MY BAG & SHARE FEATURES
// ---------------------------------------------------------
function toggleBagItem(id) {
    if (savedItems.has(id)) {
        savedItems.delete(id);
    } else {
        savedItems.add(id);
    }
    localStorage.setItem('myBag', JSON.stringify([...savedItems]));
    updateBagCounter();
    
    // Re-render current item button if visible
    const item = itemsData.find(i => i.id === id);
    if (item && document.getElementById('resultCard')) displayItemResult(item, !document.getElementById('middlePanel').classList.contains('hidden'), true);
}

function updateBagCounter() {
    document.getElementById('bagCounter').textContent = savedItems.size;
}

function showMyBagModal() {
    // Calculate summary statistics
    const bagList = Array.from(savedItems).map(id => itemsData.find(i => i.id === id)).filter(i => i);
    const allowedCount = bagList.filter(i => i.carryOn === 'allowed').length;
    const restrictedCount = bagList.filter(i => i.carryOn === 'restricted').length;
    const prohibitedCount = bagList.filter(i => i.carryOn === 'prohibited').length;

    // Improved modal with summary
    let content = '<h3>🎒 My Carry-On Bag</h3>';
    
    if (savedItems.size === 0) {
        content += '<p>Your bag is empty. Add items to track them!</p>';
    } else {
        // Add Summary Section
        content += `
            <div style="background:#f8f9fa; padding:10px; border-radius:5px; margin-bottom:15px; display:flex; justify-content:space-around; font-size:0.9em;">
                <span style="color:green">✅ ${allowedCount} Allowed</span>
                <span style="color:orange">⚠️ ${restrictedCount} Restricted</span>
                <span style="color:red">❌ ${prohibitedCount} Prohibited</span>
            </div>
        `;

        content += '<ul style="list-style:none; padding:0;">';
        bagList.forEach(item => {
            const icon = item.carryOn === 'allowed' ? '✅' : (item.carryOn === 'prohibited' ? '❌' : '⚠️');
            content += `<li style="padding:10px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center;">
                <span>${icon} <strong>${item.name}</strong></span>
                <button onclick="toggleBagItem(${item.id}); showMyBagModal();" style="color:red; border:none; background:none; cursor:pointer;">Remove</button>
            </li>`;
        });
        content += '</ul>';
        content += `<button onclick="savedItems.clear(); localStorage.setItem('myBag', '[]'); updateBagCounter(); showMyBagModal();" style="width:100%; padding:10px; background:#ffebee; color:red; border:none; border-radius:5px; margin-top:10px;">Clear All Items</button>`;
    }
    
    // Create overlay if not exists
    let modal = document.getElementById('bagModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'bagModal';
        modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:2000; display:flex; justify-content:center; align-items:center;';
        document.body.appendChild(modal);
        
        modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
    }
    
    modal.innerHTML = `
        <div style="background:white; padding:20px; border-radius:10px; max-width:90%; width:400px; max-height:80vh; overflow-y:auto; box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            ${content}
            <button onclick="document.getElementById('bagModal').remove()" style="margin-top:15px; width:100%; padding:10px; background:#eee; border:none; border-radius:5px; cursor:pointer;">Close</button>
        </div>
    `;
}

function shareItemLink(id) {
    const url = `${window.location.origin}/?item=${id}`;
    // Use modern API with fallback
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            alert("Link copied to clipboard! 📋");
        }).catch(err => {
            console.error('Failed to copy: ', err);
            prompt("Copy this link:", url);
        });
    } else {
        prompt("Copy this link:", url);
    }
}

// Global Exports
window.showItemById = (id) => { const item = itemsData.find(i => i.id === id); if(item) displayItemResult(item); };
window.toggleBagItem = toggleBagItem;
window.shareItemLink = shareItemLink;
window.showMyBagModal = showMyBagModal;

console.log('✅ App initialized with Ads & Features!');