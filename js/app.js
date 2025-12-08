// Use embedded data from data-embedded.js
let itemsData = (typeof ITEMS_DATA !== 'undefined') ? ITEMS_DATA : [];
let autocompleteTimeout = null;
let currentCountry = 'USA';
// --- HELPER: Mobile Scroll Locking ---
function toggleMobileBodyLock(isLocked) {
    if (window.innerWidth < 1024) {
        document.body.style.overflow = isLocked ? 'hidden' : '';
    }
// --- HELPER: Convert Name to URL Slug ---
function toSlug(text) {
    return text.toString().toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}
}
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

// ---------------------------------------------------------
// AD PROVIDER CLASS
// ---------------------------------------------------------
class AdProvider {
    constructor() {
        this.inlineAdCounter = 0;
        this.lastRefreshTime = 0;
        this.minRefreshInterval = 30000; 
        this.clientId = 'ca-pub-8732422930809097'; 
        this.initTopBanner();
    }

    initTopBanner() {
        const adSlot = document.getElementById('ad-top-slot');
        if (adSlot) {
            adSlot.innerHTML = `
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="${this.clientId}"
                     data-ad-slot="3472136875" 
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            `;
            try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
        }
    }

    refreshInlineAd() {
        const now = Date.now();
        if (now - this.lastRefreshTime < this.minRefreshInterval) return;

        this.inlineAdCounter++;
        this.lastRefreshTime = now;
        
        const adContainer = document.getElementById('ad-inline-slot');
        if (adContainer) {
            adContainer.innerHTML = ''; // Clear old
            adContainer.innerHTML = `
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="${this.clientId}"
                     data-ad-slot="7464897364"
                     data-ad-format="rectangle"
                     data-full-width-responsive="true"></ins>
            `;
            try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
        }
    }
}
const adProvider = new AdProvider();

// ---------------------------------------------------------
// NAVIGATION MANAGER
// ---------------------------------------------------------
// ---------------------------------------------------------
// NAVIGATION MANAGER
// ---------------------------------------------------------
class NavigationManager {
    constructor() { this.scrollPositions = new Map(); }

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

pushState(itemId, itemName) {
        try {
            const url = new URL(window.location);
            // Delete category param as we are now viewing a specific item
            url.searchParams.delete('category'); 
            
            // Update item param with the SEO-friendly slug
            url.searchParams.set('item', toSlug(itemName));
            
            window.history.pushState({ itemId, itemName }, '', url);
        } catch (e) {}
    }

    pushCategoryState(category) {
        try {
            const url = new URL(window.location);
            url.searchParams.set('category', category);
            url.searchParams.delete('item');
            window.history.pushState({ category }, '', url);
        } catch (e) {}
    }

    loadFromURL() {
        try {
            const url = new URL(window.location);
            const itemParam = url.searchParams.get('item');
            const category = url.searchParams.get('category');

            if (itemParam) {
                let item;
                // CHECK: Is it a number (Old Link) or Text (New Link)?
                if (!isNaN(itemParam)) {
                    item = itemsData.find(i => i.id === parseInt(itemParam));
                } else {
                    // It is a Slug! Find the item by name
                    item = itemsData.find(i => toSlug(i.name) === itemParam);
                }

                if (item) { displayItemResult(item, false); return true; }
            } else if (category) {
                displayCategoryResults(category);
                return true;
            }
        } catch (e) {}
        return false;
    }
}
const navManager = new NavigationManager();

// ---------------------------------------------------------
// COUNTRY RULES DATA
// ---------------------------------------------------------
const countryRules = {
    'USA': { title: 'Important TSA Rules (United States)', rules: [{ title: '3-1-1 Liquids Rule', description: 'Carry-on liquids must be in containers of 3.4 oz (100ml) or less, all fitting in one quart-sized clear plastic bag.' }, { title: 'Lithium Batteries', description: 'Spare lithium batteries and power banks must be in carry-on luggage only. Maximum 100Wh without approval.' }, { title: 'Sharp Objects', description: 'Scissors under 4 inches allowed in carry-on. All knives must be checked.' }] },
    'China': { title: 'Important CAAC Rules (China)', rules: [{ title: 'Liquids Restriction', description: 'Maximum 100ml per container, total 1 liter allowed in carry-on.' }, { title: 'Power Banks (Critical!)', description: 'Power banks MUST have clear capacity marking and manufacturer logo. Unmarked power banks will be confiscated.' }, { title: 'Lighters & Matches', description: 'Lighters and matches are PROHIBITED in both carry-on and checked luggage in China.' }] },
    'EU': { title: 'Important EASA Rules (European Union)', rules: [{ title: 'Liquids, Aerosols & Gels', description: 'Maximum 100ml per container in a single 1-liter transparent bag.' }, { title: 'Lithium Batteries', description: 'Spare batteries in carry-on only. Power banks up to 100Wh allowed.' }, { title: 'Sharp Objects', description: 'Knives and scissors with blades over 6cm prohibited in carry-on.' }] },
    'UK': { title: 'Important UK Aviation Rules', rules: [{ title: 'Liquids Rule', description: 'Maximum 100ml per container in a single transparent bag.' }, { title: 'Electronic Devices', description: 'All electronic devices larger than phones must be screened separately.' }, { title: 'Prohibited Items', description: 'All knives, razor blades, and tools over 6cm prohibited in carry-on.' }] },
    'Canada': { title: 'Important CATSA Rules (Canada)', rules: [{ title: 'Liquids & Gels', description: 'Maximum 100ml per container in a single 1-liter clear, resealable bag.' }, { title: 'Lithium Batteries', description: 'Spare lithium batteries must be in carry-on.' }, { title: 'Tools', description: 'Tools must be less than 6cm from pivot point for carry-on.' }] },
    'Australia': { title: 'Important Australian Aviation Rules', rules: [{ title: 'Liquids, Aerosols & Gels', description: 'Maximum 100ml per container.' }, { title: 'Quarantine Rules', description: 'Strict quarantine on food, plants, and animal products. Heavy fines.' }] },
    'Japan': { title: 'Important Japanese Aviation Rules', rules: [{ title: 'Liquids Rule', description: 'Maximum 100ml per container in a transparent bag.' }, { title: 'Lithium Batteries', description: 'Spare batteries and power banks in carry-on only.' }] },
    'International': { title: 'General International Aviation Rules', rules: [{ title: 'Universal Liquids Rule', description: 'Most countries follow 100ml rule.' }, { title: 'Lithium Batteries', description: 'Globally: spare lithium batteries in carry-on only.' }, { title: 'Dangerous Goods', description: 'Flammable liquids, compressed gases, explosives prohibited everywhere.' }] }
};

// ---------------------------------------------------------
// INITIALIZATION
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    if (itemsData.length === 0) console.error("❌ ITEMS_DATA is empty.");

    initializeEventListeners();
    updateBagCounter(); 
    navManager.loadFromURL();
});

// Handle Browser Back Button
window.addEventListener('popstate', (event) => {
    if (event.state) {
        if (event.state.itemId) {
            const item = itemsData.find(i => i.id === parseInt(event.state.itemId));
            if (item) displayItemResult(item, false, true);
        } else if (event.state.category) {
            displayCategoryResults(event.state.category, true);
        } else if (event.state.home) {
            resetToHome();
        }
    } else {
        resetToHome();
    }
});

function resetToHome() {
    document.getElementById('middlePanel').classList.add('hidden');
    document.getElementById('rightPanel').classList.add('hidden');
    document.getElementById('rightPanel').innerHTML = ''; // Clear result
    
    // Restore welcome message if on Desktop
    if(window.innerWidth >= 1024) {
         document.getElementById('rightPanel').innerHTML = `
            <div class="welcome-message" id="welcomeMessage">
                <div class="welcome-icon"><i class="fa-solid fa-plane-circle-check"></i></div>
                <h2>Airport Carry-On Checker: Our Mission</h2>
                <p style="max-width: 500px; margin: 0 auto 25px; line-height: 1.6; font-size: 1.05rem; color: #4a5568;">
                    Traveling should be exciting, not stressful. Our mission is to provide <strong>instant, clear, and accurate information</strong> by aggregating data from major global security authorities, including the TSA (USA), EASA (Europe), and CATSA (Canada). 
                    <br><br>
                    This tool cross-references rules to help you pack with confidence. We are built on the pillars of <strong>Global Standards, Up-to-Date data, and Privacy.</strong>
                </p>
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="font-weight: 600; color: #667eea;">Select an item from the search bar or categories to get started →</p>
                </div>
            </div>

            <div style="margin-top: 30px; min-height: 600px; background: #f8f9fa; border: 1px dashed #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                 <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-8732422930809097"
                     data-ad-slot="3936050583"
                     data-ad-format="vertical"
                     data-full-width-responsive="true"></ins>
            </div>
            <script>
                 (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
            `;
    }
}

function initializeEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const popularTags = document.querySelectorAll('.popular-tag');
    const countrySelector = document.getElementById('countrySelector');
    const bagFAB = document.getElementById('bagFAB');

// --- FIX: MOBILE BACK BUTTON LOGIC ---
    const panelBackBtn = document.getElementById('panelBackBtn');
    if (panelBackBtn) {
        panelBackBtn.addEventListener('click', () => {
            // Hide middle panel
            const midPanel = document.getElementById('middlePanel');
            midPanel.classList.add('hidden');
            
            // Also hide right panel if open
            document.getElementById('rightPanel').classList.add('hidden');
            
            // Remove active state
            document.querySelectorAll('.category-item-card').forEach(c => c.classList.remove('active'));

            // ADD THIS: Unlock body scroll so main page works again
            toggleMobileBodyLock(false);
        });
    }

    if (bagFAB) bagFAB.addEventListener('click', showMyBagModal);

    countrySelector.addEventListener('change', (e) => {
        currentCountry = e.target.value;
        showCountryRules(currentCountry);
        adProvider.refreshInlineAd();
    });

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

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            displayCategoryResults(button.getAttribute('data-category'));
            adProvider.refreshInlineAd();
        });
    });

    popularTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const item = findBestMatch(tag.getAttribute('data-item'));
            if (item) { displayItemResult(item); adProvider.refreshInlineAd(); }
        });
    });

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
// DISPLAY ITEM (Fixed for Mobile Overlay)
// ---------------------------------------------------------
function displayItemResult(item, keepMiddlePanel = false, skipHistoryPush = false) {
    // 1. Setup Sources
    const countrySources = {
        'USA': { name: 'TSA.gov', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all' },
        'China': { name: 'CAAC / Customs', url: 'http://www.caac.gov.cn/en/SY/' },
        'EU': { name: 'EASA / Europa.eu', url: 'https://europa.eu/youreurope/citizens/travel/carry/luggage-restrictions/index_en.htm' },
        'UK': { name: 'GOV.UK', url: 'https://www.gov.uk/hand-luggage-restrictions' },
        'Canada': { name: 'CATSA', url: 'https://www.catsa-acsta.gc.ca/en/search/site' },
        'Australia': { name: 'Home Affairs', url: 'https://www.abf.gov.au/entering-and-leaving-australia/can-you-bring-it-in' },
        'Japan': { name: 'Narita/Gov', url: 'https://www.narita-airport.jp/en/security/restricted/' },
        'International': { name: 'ICAO', url: 'https://www.icao.int/Security/SFP/Pages/Passenger-Bag-Security.aspx' },
        'Thailand': { name: 'Thai Customs', url: 'https://www.customs.go.th/list_strc_simple_neted.php?ini_content=individual_160526_01&lang=en' },
        'Singapore': { name: 'ICA Singapore', url: 'https://www.ica.gov.sg/enter-transit-depart/entering-singapore/what-you-can-bring' },
        'Mexico': { name: 'Government of Mexico', url: 'https://www.gob.mx/aduanas' },
        'UAE': { name: 'UAE Government', url: 'https://u.ae/en/information-and-services/health-and-fitness/drugs-and-controlled-medicines' },
    };

    const scrollKey = `item-${item.id}`;
    navManager.saveScrollPosition(scrollKey);
    if (!skipHistoryPush) navManager.pushState(item.id, item.name);

    // 2. Manage Panels
    document.getElementById('welcomeMessage')?.classList.add('hidden');
    document.getElementById('countryRulesSection')?.classList.add('hidden');
    
    // Only hide Middle Panel if on Mobile
    if (!keepMiddlePanel && window.innerWidth < 1024) {
        document.getElementById('middlePanel').classList.add('hidden');
    }
// ADD THIS: Lock body scroll if on mobile
    toggleMobileBodyLock(true);
    // 3. Get Variants
    let variants = findItemVariants(item);
    variants = variants.filter((v, index, self) =>
        index === self.findIndex((t) => t.name.trim().toLowerCase() === v.name.trim().toLowerCase())
    );

    const getDisplayStatus = (itemToCheck) => {
        const restrictedCountries = itemToCheck.customs_restricted || []; 
        const isCustomsBanned = restrictedCountries.includes(currentCountry);
        return {
            carryOn: isCustomsBanned ? 'prohibited' : itemToCheck.carryOn,
            checked: isCustomsBanned ? 'prohibited' : itemToCheck.checked,
            isCustomsBanned: isCustomsBanned
        };
    };

    const currentStatus = getDisplayStatus(item);
    const allSameEffectiveRules = variants.every(v => {
        const s = getDisplayStatus(v);
        return s.carryOn === currentStatus.carryOn && s.checked === currentStatus.checked && v.note === item.note;
    });
    if (allSameEffectiveRules) variants = [item];

    // 4. Show Right Panel
    const rightPanel = document.getElementById('rightPanel');
    rightPanel.classList.remove('hidden'); 
    rightPanel.scrollTop = 0; // FIX: Ensure we start at top of item

    // 5. Build HTML
    let variantSelectorHTML = '';
    if (variants.length > 1) {
        const usedLabels = new Set();
        const optionsHTML = variants.map(v => {
            const match = v.name.match(/\(([^)]+)\)/);
            let name = match ? match[1] : v.name;
            if (!name || name.trim().length < 2) name = v.name;
            if (usedLabels.has(name.toLowerCase())) return '';
            usedLabels.add(name.toLowerCase());
            const vStatus = getDisplayStatus(v);
            const icon = vStatus.carryOn === 'allowed' ? '✅' : (vStatus.carryOn === 'prohibited' ? '❌' : '⚠️');
            return `<option value="${v.id}" ${v.id === item.id ? 'selected' : ''}>${name} ${icon}</option>`;
        }).join('');
        if (usedLabels.size > 1) {
            variantSelectorHTML = `<div class="variant-selector"><label>Select option:</label><select id="variantSelect" class="variant-select">${optionsHTML}</select></div>`;
        }
    }

    const finalCarryOnStatus = currentStatus.isCustomsBanned ? 'prohibited' : item.carryOn;
    const finalCheckedStatus = currentStatus.isCustomsBanned ? 'prohibited' : item.checked;
    const finalCarryOnText = currentStatus.isCustomsBanned ? '❌ Customs Ban' : formatStatus(item.carryOn);
    const finalCheckedText = currentStatus.isCustomsBanned ? '❌ Customs Ban' : formatStatus(item.checked);

    let customsWarningHTML = '';
    if (currentStatus.isCustomsBanned) {
        customsWarningHTML = `
            <div class="customs-warning-banner">
                <div class="customs-warning-icon">🛂</div>
                <div class="customs-warning-content">
                    <strong>BORDER CONTROL WARNING:</strong> ${item.name} is strictly <strong>PROHIBITED</strong> from entering ${currentCountry}.
                </div>
            </div>`;
    }

    const amazonLink = `https://www.amazon.com/s?k=travel+${encodeURIComponent(item.name)}&tag=canibringonpl-20`;
    const isSaved = savedItems.has(item.id);
    const bagBtnText = isSaved ? '✅ Saved' : '➕ Add to Bag';
    const bagBtnClass = isSaved ? 'action-btn saved' : 'action-btn';
    const sourceData = countrySources[currentCountry] || countrySources['International'];

    rightPanel.innerHTML = `
        <div class="result-card" id="resultCard">
            <button class="close-btn" id="closeResult">&times;</button>
            <h2 class="item-name">
                ${item.name} 
                <button class="share-icon" onclick="shareItemLink(${item.id})" title="Copy Link">🔗</button>
            </h2>

            ${variantSelectorHTML}

            <div class="status-grid">
                <div class="status-box carry-on">
                    <div class="status-icon">🎒</div>
                    <div class="status-label">Carry-On</div>
                    <div class="status-value ${finalCarryOnStatus}">${finalCarryOnText}</div>
                </div>
                <div class="status-box checked">
                    <div class="status-icon">🧳</div>
                    <div class="status-label">Checked Luggage</div>
                    <div class="status-value ${finalCheckedStatus}">${finalCheckedText}</div>
                </div>
            </div>

            ${customsWarningHTML}

            <div class="action-buttons-row">
                <a href="${amazonLink}" target="_blank" class="action-btn amazon-btn"><i class="fa-brands fa-amazon"></i> Shop on Amazon</a>
                <button class="${bagBtnClass}" onclick="toggleBagItem(${item.id})">${bagBtnText}</button>
            </div>

           <div class="item-note">
            ${currentStatus.isCustomsBanned 
                ? '<strong>⚠️ Do not pack this item. It is prohibited at your destination.</strong>' 
                : formatNoteToBulletPoints(item.note)
            }
            </div>
            
            <div style="margin-top: 15px; text-align: center; font-size: 0.8rem;">
                <a href="${sourceData.url}" target="_blank" style="color: #667eea; text-decoration: underline;">
                    ℹ️ Verify with official ${sourceData.name} website
                </a>
            </div>

  <div class="related-items" id="relatedItems"></div>
        </div>

        <div class="ad-inline" id="resultAd">
            <div class="ad-container"><div id="ad-inline-slot" class="ad-slot"></div></div>
        </div>

        <div style="margin-top: 30px; min-height: 600px; background: #f8f9fa; border: 1px dashed #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
             <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-8732422930809097"
                 data-ad-slot="3936050583"
                 data-ad-format="vertical"
                 data-full-width-responsive="true"></ins>
        </div>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    `;

    // Re-attach listeners
    if (variants.length > 1 && document.getElementById('variantSelect')) {
        document.getElementById('variantSelect').onchange = (e) => {
            const newItem = itemsData.find(i => i.id === parseInt(e.target.value));
            if (newItem) displayItemResult(newItem, keepMiddlePanel);
        };
    }

// CLOSE BUTTON LOGIC
    document.getElementById('closeResult')?.addEventListener('click', () => {
        rightPanel.classList.add('hidden');
        document.getElementById('searchInput').value = '';
        
        // Show middle panel again if we were browsing categories
        const midPanel = document.getElementById('middlePanel');
        // Check if middle panel has items populated
        if (midPanel && midPanel.querySelector('.category-item-card')) {
            midPanel.classList.remove('hidden');
            // We are still in an overlay, so keep Scroll Locked (true)
            toggleMobileBodyLock(true);
        } else {
            // We are going back to Home, so Unlock Scroll
            toggleMobileBodyLock(false);
        }
    });

    displayRelatedItems(item);
    adProvider.refreshInlineAd();
    injectSchema(item);
    updateSocialMeta(item);
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
    
    const midPanel = document.getElementById('middlePanel');
    midPanel.classList.remove('hidden');
    midPanel.scrollTop = 0; // Fix scroll on mobile
    // ADD THIS: Lock body scroll on mobile
    toggleMobileBodyLock(true);

    document.getElementById('welcomeMessage')?.classList.add('hidden');
    document.getElementById('countryRulesSection')?.classList.add('hidden');

    const items = itemsData.filter(i => i.category && i.category.includes(category));
    document.getElementById('categoryTitle').textContent = category.toUpperCase();
    document.getElementById('categoryCount').textContent = `${items.length} items`;

    items.sort((a, b) => {
        const getScore = (item) => {
            if (item.carryOn === 'allowed' && item.checked === 'allowed') return 4;
            if (item.carryOn === 'allowed') return 3;
            if (item.checked === 'allowed') return 2;
            if (item.carryOn === 'restricted' || item.checked === 'restricted') return 1;
            return 0;
        };
        return getScore(b) - getScore(a);
    });

    const list = document.getElementById('categoryItemsList');
    list.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'category-item-card';
        div.innerHTML = `
            <div class="category-item-name">${item.name}</div>
            <div class="category-item-status">
                <span class="${item.carryOn === 'allowed' ? 'status-allowed' : 'status-restricted'}">
                    🎒 ${formatStatus(item.carryOn)}
                </span>
            </div>`;

        div.onclick = () => {
            const isDesktop = window.innerWidth >= 1024; 
            displayItemResult(item, isDesktop);
        };
        list.appendChild(div);
    });
    
// Setup desktop view placeholder
    if (window.innerWidth >= 1024) {
        document.getElementById('rightPanel').innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon"><i class="fa-solid fa-plane-circle-check"></i></div>
                <h2>${category.charAt(0).toUpperCase() + category.slice(1)} Items</h2>
                <p style="margin-bottom: 20px; max-width: 450px; margin-left: auto; margin-right: auto; color: #4a5568;">
                    Our database is sourced from global aviation standards. Browse the list on the left and select an item to see specific rules tailored to your destination country.
                </p>
                <div style="margin-top: 20px; font-weight: 600; color: #667eea;">Select an item to view details →</div>
            </div>
            
            <div class="ad-inline"><div class="ad-container"><div id="ad-inline-slot" class="ad-slot"></div></div></div>

            <div style="margin-top: 30px; min-height: 600px; background: #f8f9fa; border: 1px dashed #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                 <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-8732422930809097"
                     data-ad-slot="3936050583"
                     data-ad-format="vertical"
                     data-full-width-responsive="true"></ins>
            </div>
            <script>
                 (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        `;
    }
    adProvider.refreshInlineAd();
}

function showCountryRules(country) {
    const rules = countryRules[country];
    if (!rules) return;
    const rightPanel = document.getElementById('rightPanel');
    
    // On Mobile: Hide middle panel so right panel overlay works
    if (window.innerWidth < 1024) {
        document.getElementById('middlePanel').classList.add('hidden');
    }
    
    rightPanel.classList.remove('hidden');
    rightPanel.scrollTop = 0;
    
    const cards = rules.rules.map(r => `<div class="info-card"><h4>${r.title}</h4><p>${r.description}</p></div>`).join('');
    
    // Add close button for mobile rules view
    const closeBtnHTML = window.innerWidth < 1024 ? '<button class="close-btn" id="closeResult">&times;</button>' : '';

    rightPanel.innerHTML = `
        <div class="country-rules-section">
            ${closeBtnHTML}
            <div class="country-disclaimer">⚠️ <strong>Note:</strong> Rules change. Verify with airline.</div>
            <h3>${rules.title}</h3>
            <div class="info-cards">${cards}</div>
        </div>
        <div class="ad-inline"><div class="ad-container"><div id="ad-inline-slot" class="ad-slot"></div></div></div>
    `;

// Add inside showCountryRules
    toggleMobileBodyLock(true); // Lock when opening rules

    document.getElementById('closeResult')?.addEventListener('click', () => {
        rightPanel.classList.add('hidden');
        toggleMobileBodyLock(false); // Unlock when closing rules
    });

    adProvider.refreshInlineAd();
}

// ---------------------------------------------------------
// MY BAG & SHARE FEATURES
// ---------------------------------------------------------
function toggleBagItem(id) {
    if (savedItems.has(id)) savedItems.delete(id);
    else savedItems.add(id);
    localStorage.setItem('myBag', JSON.stringify([...savedItems]));
    updateBagCounter();
    
    const item = itemsData.find(i => i.id === id);
    // Refresh if visible
    const rightPanel = document.getElementById('rightPanel');
    if (item && rightPanel && !rightPanel.classList.contains('hidden')) {
        const isDesktop = window.innerWidth >= 1024;
        displayItemResult(item, isDesktop, true);
    }
}

function updateBagCounter() {
    document.getElementById('bagCounter').textContent = savedItems.size;
}

function showMyBagModal() {
    const bagList = Array.from(savedItems).map(id => itemsData.find(i => i.id === id)).filter(i => i);
    const allowedCount = bagList.filter(i => i.carryOn === 'allowed').length;
    const restrictedCount = bagList.filter(i => i.carryOn === 'restricted').length;
    const prohibitedCount = bagList.filter(i => i.carryOn === 'prohibited').length;

    let content = '<h3>🎒 My Carry-On Bag</h3>';
    if (savedItems.size === 0) {
        content += '<p>Your bag is empty. Add items to track them!</p>';
    } else {
        content += `
            <div style="background:#f8f9fa; padding:10px; border-radius:5px; margin-bottom:15px; display:flex; justify-content:space-around; font-size:0.9em;">
                <span style="color:green">✅ ${allowedCount} Allowed</span>
                <span style="color:orange">⚠️ ${restrictedCount} Restricted</span>
                <span style="color:red">❌ ${prohibitedCount} Prohibited</span>
            </div>
            <ul style="list-style:none; padding:0;">`;
            
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
    const item = itemsData.find(i => i.id === id);
    if (!item) return;

    // Generate SEO-friendly URL
    const slug = toSlug(item.name);
    const url = `${window.location.origin}/?item=${slug}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => alert("Link copied! 📋")).catch(() => prompt("Copy link:", url));
    } else {
        prompt("Copy link:", url);
    }
}

window.showItemById = (id) => { 
    const item = itemsData.find(i => i.id === id); 
    if(item) {
        const isDesktop = window.innerWidth >= 1024;
        displayItemResult(item, isDesktop); 
    }
};
window.toggleBagItem = toggleBagItem;
window.shareItemLink = shareItemLink;
window.showMyBagModal = showMyBagModal;

// SEO Functions
function injectSchema(item) {
    const existing = document.getElementById('dynamic-schema');
    if (existing) existing.remove();
    const schemaData = {
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": [{ "@type": "Question", "name": `Can I bring ${item.name} on a plane?`, "acceptedAnswer": { "@type": "Answer", "text": `Carry-on: ${item.carryOn}. Checked: ${item.checked}.` } }]
    };
    const script = document.createElement('script');
    script.id = 'dynamic-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
}

function updateSocialMeta(item) {
    document.title = `Can I bring ${item.name} on a plane? | Carry-On Checker`;
    const setMeta = (prop, content) => {
        let el = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${prop}"]`);
        if (!el) { el = document.createElement('meta'); el.setAttribute(prop.startsWith('og:') ? 'property' : 'name', prop); document.head.appendChild(el); }
        el.setAttribute('content', content);
    };
    setMeta('og:title', `Can I bring ${item.name} on a plane?`);
    setMeta('description', `Check TSA rules for ${item.name}. Carry-on: ${item.carryOn}.`);
}