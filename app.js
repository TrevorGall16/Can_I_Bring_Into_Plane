// Use embedded data from data-embedded.js
let itemsData = (typeof ITEMS_DATA !== 'undefined') ? ITEMS_DATA : [];
let autocompleteTimeout = null;
let currentCountry = 'USA';
let currentCategory = null;
let searchIndex = new Map();

/**
 * Builds a fast lookup index for items
 */
function buildSearchIndex() {
    searchIndex.clear();
    itemsData.forEach(item => {
        searchIndex.set(item.name.toLowerCase(), item);
        if (item.keywords) {
            item.keywords.forEach(kw => searchIndex.set(kw.toLowerCase(), item));
        }
    });
}

// Call this inside your DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
    buildSearchIndex();
    initializeEventListeners();
    updateBagCounter(); 
    navManager.loadFromURL();
});

// --- HELPER: Mobile Scroll Locking ---
function toggleMobileView(showResult) {
    if (window.innerWidth < 1024) {
        const leftPanel = document.querySelector('.left-panel');
        if (showResult) {
            leftPanel.classList.add('hidden'); // Hide Home
            window.scrollTo(0, 0); // Reset scroll to top
        } else {
            leftPanel.classList.remove('hidden'); // Show Home
        }
    }
}

// --- HELPER: Convert Name to URL Slug ---
function toSlug(text) {
    return text.toString().toLowerCase()
        .replace(/[()]/g, '')
        .replace(/\//g, '-')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Setup Set for Saved Items (My Bag)
let savedItems = new Set(); 
if (localStorage.getItem('myBag')) {
    try {
        const savedIds = JSON.parse(localStorage.getItem('myBag'));
        savedIds.forEach(id => savedItems.add(id));
    } catch (e) { console.error("Error loading bag:", e); }
}

// ---------------------------------------------------------
// RICH CONTENT CONTEXT
// ---------------------------------------------------------
function getCategoryContext(category, itemName) {
    const contexts = {
        'liquids': `<h4>💧 The 3-1-1 Liquid Rule Explained</h4><p>For <strong>${itemName}</strong>, standard airport security rules for liquids apply. You are generally limited to containers of 3.4oz (100ml) or less in your carry-on bag.</p>`,
        'electronics': `<h4>🔋 Battery & Fire Safety Rules</h4><p>When traveling with <strong>${itemName}</strong>, the primary concern is often the battery. Lithium-ion batteries have a risk of overheating (thermal runaway) and must be kept in the cabin.</p>`,
        'food': `<h4>🍎 X-Ray Screening & Customs</h4><p>Solid foods like <strong>${itemName}</strong> are generally allowed. Warning: International travel often bans fresh agricultural products.</p>`,
        'toiletries': `<h4>🧴 Packing Personal Care Items</h4><p>For <strong>${itemName}</strong>, ensure it complies with the liquids rule if it is a gel, paste, or aerosol.</p>`,
        'tools': `<h4>🛠️ Sharp Objects Policy</h4><p>Tools longer than 7 inches or those with sharp blades like <strong>${itemName}</strong> are generally prohibited in the cabin.</p>`,
        'weapons': `<h4>⚠️ Zero Tolerance Policy</h4><p>Items categorized as self-defense or weapons, such as <strong>${itemName}</strong>, are prohibited in the cabin.</p>`,
        'default': `<h4>ℹ️ General Security Advice</h4><p>When packing <strong>${itemName}</strong>, always prioritize safety and ease of inspection.</p>`
    };
    if (Array.isArray(category)) {
        for (let c of category) { if (contexts[c]) return contexts[c]; }
    }
    return contexts['default'];
}

// ---------------------------------------------------------
// AD PROVIDER
// ---------------------------------------------------------
class AdProvider {
    constructor() {
        this.lastRefreshTime = 0;
        this.clientId = 'ca-pub-8732422930809097'; 
        this.initTopBanner();
    }
    initTopBanner() {
        const adSlot = document.getElementById('ad-top-slot');
        if (adSlot) {
            adSlot.innerHTML = `<ins class="adsbygoogle" style="display:block" data-ad-client="${this.clientId}" data-ad-slot="3472136875" data-ad-format="auto" data-full-width-responsive="true"></ins>`;
            try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
        }
    }
    refreshInlineAd() {
        const now = Date.now();
        if (now - this.lastRefreshTime < 30000) return;
        this.lastRefreshTime = now;
        const adContainer = document.getElementById('ad-inline-slot');
        if (adContainer) {
            adContainer.innerHTML = ''; 
            adContainer.innerHTML = `<ins class="adsbygoogle" style="display:block" data-ad-client="${this.clientId}" data-ad-slot="7464897364" data-ad-format="rectangle" data-full-width-responsive="true"></ins>`;
            try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
        }
    }
}
const adProvider = new AdProvider();

// ---------------------------------------------------------
// NAVIGATION MANAGER
// ---------------------------------------------------------
class NavigationManager {
    constructor() { this.scrollPositions = new Map(); }
    saveScrollPosition(key) {
        const rightPanel = document.getElementById('rightPanel');
        if (rightPanel) {
            this.scrollPositions.set(key, rightPanel.scrollTop);

            // Memory leak prevention: Limit Map size to 20 entries
            if (this.scrollPositions.size > 20) {
                const firstKey = this.scrollPositions.keys().next().value;
                this.scrollPositions.delete(firstKey);
            }
        }
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
            const item = itemsData.find(i => i.id === itemId);
            url.searchParams.delete('category'); 
            url.searchParams.set('item', item.slug || toSlug(itemName)); 
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
                let item = !isNaN(itemParam) ? itemsData.find(i => i.id === parseInt(itemParam)) : itemsData.find(i => toSlug(i.name) === itemParam);
                if (item) { displayItemResult(item, false); return true; }
            } else if (category) {
                displayCategoryResults(category);
                return true;
            }
        } catch (e) {}
        
        // If nothing loaded and on desktop, show welcome
        if (window.innerWidth >= 1024) {
             resetToHome();
        }
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
// EVENT LISTENERS
// ---------------------------------------------------------
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
    // Hide panels
    document.getElementById('middlePanel').classList.add('hidden');
    document.getElementById('rightPanel').classList.add('hidden');
    document.getElementById('rightPanel').innerHTML = ''; 
    currentCategory = null;
    
    // CRITICAL: SHOW HOME PANEL ON MOBILE
    toggleMobileView(false); 

    // SEO FIX: Reset all metadata to homepage defaults (must match index.html)
    document.title = "Can I Bring This On A Plane? | Airport Carry-On Checker";

    // Reset canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://www.canibringonplane.com/');

    // Reset meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Can I bring this on a plane? Instantly check if items are allowed in carry-on cabin or checked luggage. Fast, simple airport security rules for travelers.');

    // Reset Open Graph tags (prevents social share corruption)
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Can I Bring This On A Plane? | Airport Carry-On Checker');

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', 'Instantly check TSA and airport security rules for any item. Carry-on vs Checked luggage guide.');

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', 'https://www.canibringonplane.com/');

    // Remove orphaned FAQ schema from previous item (prevents Google Schema mismatch)
    const existingSchema = document.getElementById('dynamic-schema');
    if (existingSchema) existingSchema.remove();

    // Desktop Welcome Message Logic
    if(window.innerWidth >= 1024) {
         const rightPanel = document.getElementById('rightPanel');
         rightPanel.classList.remove('hidden'); 
         rightPanel.innerHTML = `
            <div class="welcome-message" id="welcomeMessage">
                <div class="welcome-icon"><i class="fa-solid fa-plane-circle-check"></i></div>
                <h2>Airport Carry-On Checker</h2>
                
                <div style="text-align: left; max-width: 650px; margin: 0 auto; color: #4a5568; font-size: 0.95rem; line-height: 1.7;">
                    <p style="margin-bottom: 15px;">
                        Welcome to the ultimate tool for air travel preparation. Security regulations vary significantly by country (TSA, EASA, CAAC) and airline. This tool helps you instantly verify if an item is allowed in your <strong>Carry-On (Cabin Bag)</strong> or must be packed in your <strong>Checked Luggage</strong>.
                    </p>

                    <h3 style="color: #2d3748; font-size: 1.1rem; margin-top: 25px; margin-bottom: 10px;">✈️ Why Do Carry-On Rules Vary?</h3>
                    <p style="margin-bottom: 15px;">
                        Aviation security standards differ between countries and regulatory bodies. The <strong>TSA (Transportation Security Administration)</strong> governs U.S. airports, while <strong>EASA (European Aviation Safety Agency)</strong> sets rules for the European Union. China operates under the <strong>CAAC (Civil Aviation Administration of China)</strong>, which has unique restrictions on power banks and lighters. While the core principles remain similar worldwide—no explosives, no weapons, no large liquids—the specific size thresholds and enforcement strictness vary. For example, the U.S. TSA allows scissors with blades under 4 inches in carry-on, but many Asian and European airports lower this to 6 centimeters (2.4 inches). Always check your departure <em>and</em> arrival country's rules, as you must comply with both.
                    </p>

                    <h3 style="color: #2d3748; font-size: 1.1rem; margin-top: 25px; margin-bottom: 10px;">🛑 The "No-Go" Items (Universal Rules)</h3>
                    <p style="margin-bottom: 15px;">
                        Across almost all airports globally, the following items are strictly prohibited in the cabin:
                    </p>
                    <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 15px;">
                        <li><strong>Liquids over 100ml (3.4oz):</strong> Unless they are medically necessary or for a baby.</li>
                        <li><strong>Sharp Objects:</strong> Knives, box cutters, and scissors with blades longer than 4 inches (6cm in EU/Asia).</li>
                        <li><strong>Self-Defense Items:</strong> Pepper spray, tasers, and martial arts weapons are never allowed in the cabin.</li>
                    </ul>

                    <h3 style="color: #2d3748; font-size: 1.1rem; margin-top: 25px; margin-bottom: 10px;">🔋 The Lithium Battery Danger</h3>
                    <p style="margin-bottom: 15px;">
                        This is the most common mistake travelers make. <strong>Loose Lithium-Ion batteries and Power Banks are PROHIBITED in checked luggage</strong> due to fire risks. You MUST carry them with you in the cabin. If you pack them in checked baggage, security will likely remove them, and you may lose your item. Airlines universally prohibit lithium batteries in the cargo hold because cabin crew cannot access the hold during flight to extinguish a battery fire, which can reach temperatures exceeding 1,000°F (538°C). Power banks must be under 100 watt-hours (Wh) for carry-on without airline approval—most consumer power banks fall within this range, but always check the label.
                    </p>

                    <h3 style="color: #2d3748; font-size: 1.1rem; margin-top: 25px; margin-bottom: 10px;">💊 Medical & Baby Exceptions to the 3-1-1 Rule</h3>
                    <p style="margin-bottom: 15px;">
                        The famous <strong>3-1-1 Liquids Rule</strong>—3.4 ounces (100ml) per container, all fitting in 1 quart-sized bag, 1 bag per passenger—has critical exemptions. <strong>Prescription medications</strong> in liquid, gel, or aerosol form are allowed in reasonable quantities exceeding 3.4oz, but you must declare them to TSA officers at the checkpoint. Similarly, <strong>baby formula, breast milk, and juice for infants</strong> are exempt from the size limit. You do not need to travel with a baby to carry these items. Medical supplies like contact lens solution, eye drops, and liquid medications should be separated from your toiletry bag for faster screening. If you're traveling with life-sustaining medical devices (insulin pumps, EpiPens), inform security officers before screening begins.
                    </p>

                    <h3 style="color: #2d3748; font-size: 1.1rem; margin-top: 25px; margin-bottom: 10px;">🛍️ Duty-Free Liquids: The Sealed Bag Rule</h3>
                    <p style="margin-bottom: 15px;">
                        There is one major loophole to the 100ml liquid restriction: <strong>duty-free liquids purchased after the security checkpoint</strong>. Bottles of wine, perfume, or spirits bought in airport shops beyond security are allowed in carry-on, even if they exceed 100ml, as long as they remain in the <strong>sealed, tamper-evident bag</strong> provided by the retailer. This bag must show a receipt proving the purchase was made within the last 48 hours. However, if you have a connecting flight, this rule becomes tricky. If your layover requires you to re-clear security (common when entering the U.S. or changing terminals internationally), your duty-free liquids will be confiscated unless they are in checked baggage. Plan accordingly—many travelers lose expensive bottles of alcohol due to this rule.
                    </p>

                    <div style="background: #eef2ff; border-left: 4px solid #667eea; padding: 15px; margin-top: 20px; border-radius: 4px;">
                        <strong>How to use this tool:</strong> Use the search bar above or browse the categories to find specific rules for over 200+ common travel items. Select your departure country from the dropdown to see region-specific regulations.
                    </div>
                </div>
            </div>
            
            <div class="ad-container-vertical">
                 <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-8732422930809097" data-ad-slot="3936050583" data-ad-format="vertical" data-full-width-responsive="true"></ins>
            </div>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
            `;
    }
}

function initializeEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const popularTags = document.querySelectorAll('.popular-tag');
    const countrySelector = document.getElementById('countrySelector');
    const bagFAB = document.getElementById('bagFAB');
    const panelBackBtn = document.getElementById('panelBackBtn');

    if (panelBackBtn) {
        panelBackBtn.addEventListener('click', () => {
            resetToHome(); // Use reset function to handle mobile visibility
        });
    }

    if (bagFAB) bagFAB.addEventListener('click', showMyBagModal);

    countrySelector.addEventListener('change', (e) => {
        currentCountry = e.target.value;
        showCountryRules(currentCountry);
        adProvider.refreshInlineAd();
        if (currentCategory && !document.getElementById('middlePanel').classList.contains('hidden')) {
            displayCategoryResults(currentCategory, true);
        }
    });

    // Replacement for the current searchInput listener
    searchInput.addEventListener('input', (e) => {
        clearTimeout(autocompleteTimeout);
        // 300ms wait period before executing search
        autocompleteTimeout = setTimeout(() => { 
            handleSearch(e.target.value); 
        }, 300);
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
    // Return items where the name or a keyword contains the query
    return itemsData.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(lowerQuery);
        const keywordMatch = item.keywords && item.keywords.some(k => k.toLowerCase().includes(lowerQuery));
        return nameMatch || keywordMatch;
    }).sort((a, b) => {
        // Prioritize exact matches at the start of the word
        const aStart = a.name.toLowerCase().startsWith(lowerQuery);
        const bStart = b.name.toLowerCase().startsWith(lowerQuery);
        return (aStart === bStart) ? 0 : aStart ? -1 : 1;
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
        div.className = 'category-item-card';
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
// DISPLAY ITEM (Updated for Single-Column Mobile View)
// ---------------------------------------------------------
function displayItemResult(item, keepMiddlePanel = false, skipHistoryPush = false) {
    const countrySources = {
        'USA': { name: 'TSA.gov', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all' },
        'China': { name: 'CAAC / Customs', url: 'http://www.caac.gov.cn/en/SY/' },
        'EU': { name: 'EASA / Europa.eu', url: 'https://europa.eu/youreurope/citizens/travel/carry/luggage-restrictions/index_en.htm' },
        'UK': { name: 'GOV.UK', url: 'https://www.gov.uk/hand-luggage-restrictions' },
        'Canada': { name: 'CATSA', url: 'https://www.catsa-acsta.gc.ca/en/search/site' },
        'Australia': { name: 'Home Affairs', url: 'https://www.abf.gov.au/entering-and-leaving-australia/can-you-bring-it-in' },
        'Japan': { name: 'Narita/Gov', url: 'https://www.narita-airport.jp/en/security/restricted/' },
        'International': { name: 'ICAO', url: 'https://www.icao.int/Security/SFP/Pages/Passenger-Bag-Security.aspx' }
    };

    const scrollKey = `item-${item.id}`;
    navManager.saveScrollPosition(scrollKey);
    if (!skipHistoryPush) navManager.pushState(item.id, item.name);
    
    // Update SEO Tags
    updateSocialMeta(item);
    injectSchema(item);
    
    document.getElementById('welcomeMessage')?.classList.add('hidden');
    document.getElementById('countryRulesSection')?.classList.add('hidden');
    
    // CRITICAL: Hide middle panel on mobile so we see the result clearly
    if (!keepMiddlePanel && window.innerWidth < 1024) {
        document.getElementById('middlePanel').classList.add('hidden');
    }
    
    // CRITICAL: HIDE HOME SCREEN ON MOBILE
    toggleMobileView(true); 

    let variants = findItemVariants(item);
    // De-duplicate variants
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
    const rightPanel = document.getElementById('rightPanel');
    rightPanel.classList.remove('hidden'); 
    rightPanel.scrollTop = 0; 

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
    const richContext = getCategoryContext(item.category, item.name);

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
                <a href="${amazonLink}" target="_blank" class="action-btn amazon-btn">🛒 Shop on Amazon</a>
                <button class="${bagBtnClass} add-to-bag-btn" onclick="toggleBagItem(${item.id})">${bagBtnText}</button>
            </div>

           <div class="item-note">
            ${currentStatus.isCustomsBanned 
                ? '<strong>⚠️ Do not pack this item. It is prohibited at your destination.</strong>' 
                : formatNoteToBulletPoints(item.note)
            }
            </div>

            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; color: #444;">${richContext}</div>
            
            <div style="margin-top: 15px; text-align: center; font-size: 0.8rem;">
                <a href="${sourceData.url}" target="_blank" style="color: #667eea; text-decoration: underline;">
                    ℹ️ Verify with official ${sourceData.name} website
                </a>
            </div>

            <div class="related-items" id="relatedItems"></div>
        </div>
        <div class="ad-inline" id="resultAd"><div class="ad-container"><div id="ad-inline-slot" class="ad-slot"></div></div></div>
        <div class="ad-container-vertical">
             <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-8732422930809097" data-ad-slot="3936050583" data-ad-format="vertical" data-full-width-responsive="true"></ins>
        </div>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    `;

    if (variants.length > 1 && document.getElementById('variantSelect')) {
        document.getElementById('variantSelect').onchange = (e) => {
            const newItem = itemsData.find(i => i.id === parseInt(e.target.value));
            if (newItem) displayItemResult(newItem, keepMiddlePanel);
        };
    }

    document.getElementById('closeResult')?.addEventListener('click', () => {
        rightPanel.classList.add('hidden');
        document.getElementById('searchInput').value = '';
        
        // Mobile Logic: If going back from result, check if we came from a category
        const midPanel = document.getElementById('middlePanel');
        if (midPanel && midPanel.querySelector('.category-item-card')) {
            midPanel.classList.remove('hidden');
            // We are still in "View 2" (Category List), so keep home hidden
            toggleMobileView(true); 
        } else {
            // We are going all the way back to home
            toggleMobileView(false);
        }
    });

    displayRelatedItems(item);
    adProvider.refreshInlineAd();
}

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

// ---------------------------------------------------------
// DISPLAY CATEGORY (Updated for Single-Column Mobile View)
// ---------------------------------------------------------
function displayCategoryResults(category, skipHistoryPush = false) {
    if (!skipHistoryPush) navManager.pushCategoryState(category);
    currentCategory = category;

    const midPanel = document.getElementById('middlePanel');
    midPanel.classList.remove('hidden');
    midPanel.scrollTop = 0; 
    
    // CRITICAL: HIDE HOME SCREEN ON MOBILE
    toggleMobileView(true); 

    document.getElementById('welcomeMessage')?.classList.add('hidden');
    document.getElementById('countryRulesSection')?.classList.add('hidden');

    const items = itemsData.filter(i => i.category && i.category.includes(category));
    document.getElementById('categoryTitle').textContent = category.toUpperCase();
    document.getElementById('categoryCount').textContent = `${items.length} items`;

    items.sort((a, b) => {
        const getScore = (item) => {
            const isBanned = item.customs_restricted?.includes(currentCountry);
            const status = isBanned ? 'prohibited' : item.carryOn;
            if (status === 'allowed' && item.checked === 'allowed') return 4;
            if (status === 'allowed') return 3;
            if (item.checked === 'allowed') return 2;
            if (status === 'restricted' || item.checked === 'restricted') return 1;
            return 0; 
        };
        return getScore(b) - getScore(a);
    });

    const list = document.getElementById('categoryItemsList');
    list.innerHTML = '';
    items.forEach(item => {
        const isBanned = item.customs_restricted && item.customs_restricted.includes(currentCountry);
        let status = isBanned ? 'prohibited' : item.carryOn;
        let displayText = formatStatus(status);
        let displayClass = status === 'allowed' ? 'status-allowed' : (status === 'prohibited' ? 'status-prohibited' : 'status-restricted');

        if (isBanned) {
            displayText = '❌ Customs Ban';
            displayClass = 'status-prohibited';
        }

        const div = document.createElement('div');
        div.className = 'category-item-card';
        div.innerHTML = `
            <div class="category-item-name">${item.name}</div>
            <div class="category-item-status">
                <span class="${displayClass}">
                    🎒 ${displayText}
                </span>
            </div>`;

        div.onclick = () => {
            const isDesktop = window.innerWidth >= 1024; 
            displayItemResult(item, isDesktop);
        };
        list.appendChild(div);
    });
    
    if (window.innerWidth >= 1024) {
        document.getElementById('rightPanel').innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon"><i class="fa-solid fa-plane-circle-check"></i></div>
                <h2>${category.charAt(0).toUpperCase() + category.slice(1)} Items</h2>
                <p>Our database is sourced from global aviation standards.</p>
                <div style="margin-top: 20px; font-weight: 600; color: #667eea;">Select an item to view details →</div>
            </div>
            <div class="ad-inline"><div class="ad-container"><div id="ad-inline-slot" class="ad-slot"></div></div></div>
            <div class="ad-container-vertical">
                 <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-8732422930809097" data-ad-slot="3936050583" data-ad-format="vertical" data-full-width-responsive="true"></ins>
            </div>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        `;
    }
    adProvider.refreshInlineAd();
}

function showCountryRules(country) {
    const rules = countryRules[country];
    if (!rules) return;
    const rightPanel = document.getElementById('rightPanel');
    
    if (window.innerWidth < 1024) {
        document.getElementById('middlePanel').classList.add('hidden');
        toggleMobileView(true); // Hide home
    }
    
    rightPanel.classList.remove('hidden');
    rightPanel.scrollTop = 0;
    
    const cards = rules.rules.map(r => `<div class="info-card"><h4>${r.title}</h4><p>${r.description}</p></div>`).join('');
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

    document.getElementById('closeResult')?.addEventListener('click', () => {
        rightPanel.classList.add('hidden');
        // Mobile back logic
        if (window.innerWidth < 1024) toggleMobileView(false);
    });

    adProvider.refreshInlineAd();
}

function toggleBagItem(id) {
    if (savedItems.has(id)) savedItems.delete(id);
    else savedItems.add(id);
    localStorage.setItem('myBag', JSON.stringify([...savedItems]));
    updateBagCounter();
    const item = itemsData.find(i => i.id === id);
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
        content += `<div style="background:#f8f9fa; padding:10px; border-radius:5px; margin-bottom:15px; display:flex; justify-content:space-around; font-size:0.9em;"><span style="color:green">✅ ${allowedCount} Allowed</span><span style="color:orange">⚠️ ${restrictedCount} Restricted</span><span style="color:red">❌ ${prohibitedCount} Prohibited</span></div><ul style="list-style:none; padding:0;">`;
        bagList.forEach(item => {
            const icon = item.carryOn === 'allowed' ? '✅' : (item.carryOn === 'prohibited' ? '❌' : '⚠️');
            content += `<li style="padding:10px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center;"><span>${icon} <strong>${item.name}</strong></span><button onclick="toggleBagItem(${item.id}); showMyBagModal();" style="color:red; border:none; background:none; cursor:pointer;">Remove</button></li>`;
        });
        content += '</ul><button onclick="savedItems.clear(); localStorage.setItem(\'myBag\', \'[]\'); updateBagCounter(); showMyBagModal();" style="width:100%; padding:10px; background:#ffebee; color:red; border:none; border-radius:5px; margin-top:10px;">Clear All Items</button>';
    }
    
    let modal = document.getElementById('bagModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'bagModal';
        modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:2000; display:flex; justify-content:center; align-items:center;';
        document.body.appendChild(modal);
        modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
    }
    modal.innerHTML = `<div style="background:white; padding:20px; border-radius:10px; max-width:90%; width:400px; max-height:80vh; overflow-y:auto;">${content}<button onclick="document.getElementById('bagModal').remove()" style="margin-top:15px; width:100%; padding:10px; background:#eee; border:none; border-radius:5px; cursor:pointer;">Close</button></div>`;
}

function shareItemLink(id) {
    const item = itemsData.find(i => i.id === id);
    if (!item) return;
    const slug = toSlug(item.name);
    const url = `${window.location.origin}/?item=${slug}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => alert("Link copied! 📋")).catch(() => prompt("Copy link:", url));
    } else {
        prompt("Copy link:", url);
    }
}

// Global Exports
window.showItemById = (id) => { 
    const item = itemsData.find(i => i.id === id); 
    if(item) {
        const middlePanel = document.getElementById('middlePanel');
        const isMiddlePanelVisible = middlePanel && !middlePanel.classList.contains('hidden');
        displayItemResult(item, isMiddlePanelVisible); 
    }
};
window.toggleBagItem = toggleBagItem;
window.shareItemLink = shareItemLink;
window.showMyBagModal = showMyBagModal;

function injectSchema(item) {
    const existing = document.getElementById('dynamic-schema');
    if (existing) existing.remove();

    const cleanNote = item.note.replace(/[✅❌⚠️💡]/g, '').trim();
    
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": `Is ${item.name} allowed on a plane?`,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": `In carry-on luggage, ${item.name} is ${item.carryOn}. In checked bags, it is ${item.checked}. ${cleanNote}`
            }
        }]
    };

    const script = document.createElement('script');
    script.id = 'dynamic-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
}

/**
 * PHASE 2: Comprehensive SEO Tag Management
 * Updates document title, meta description, and Social Graph tags
 * Requirement: ADS_AND_INDEXING_GUIDELINES Section 5.3
 */
function updateSocialMeta(item) {
    const title = `Can I bring ${item.name} on a plane? - Airport Checker`;
    const description = `Find out if ${item.name} is allowed in carry-on or checked luggage. ${item.note.replace(/[✅❌⚠️💡]/g, '').substring(0, 150)}...`;
    
    document.title = title;
    
    // Helper to update or create meta tags
    const setMeta = (name, content, isProperty = false) => {
        const attr = isProperty ? 'property' : 'name';
        let el = document.querySelector(`meta[${attr}="${name}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute(attr, name);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content);
    };
    
    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    // Use the slug in the OG URL
    const slug = toSlug(item.name);
    setMeta('og:url', `https://www.canibringonplane.com/?item=${slug}`, true);

    // Update Canonical URL dynamically
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    // Use the slug in the canonical URL
    canonical.setAttribute('href', `https://www.canibringonplane.com/?item=${slug}`);
}