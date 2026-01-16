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

document.addEventListener('DOMContentLoaded', () => {
    buildSearchIndex();
    initializeEventListeners();
    updateBagCounter(); 
    navManager.loadFromURL();
    // Initialize sticky footer ad
    adProvider.initStickyFooter();
    adProvider.initWelcomeAd(); 
    adProvider.checkAdBlock();
});

// --- HELPER: Toggle between Welcome and Result views ---
function toggleMobileView(showResult) {
    const welcomeContent = document.getElementById('welcomeMessage');
    if (showResult) {
        welcomeContent?.classList.add('hidden');
            } else {
        welcomeContent?.classList.remove('hidden');
    }
}

// --- HELPER: Convert Name to URL Slug ---
function toSlug(text) {
    return text.toString().toLowerCase()
        .replace(/&/g, 'and')      // Fixes "Insulin & Syringes" -> "insulin-and-syringes"
        .replace(/\+/g, 'plus')    // Fixes items with "+"
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
        'music': `<h4>🎵 Musical Instruments Rule</h4><p>Small instruments like <strong>${itemName}</strong> are allowed as carry-on IF they fit in the overhead bin. If the bin is full, they must be checked.</p>`,
        'fashion': `<h4>👗 High-Value Clothing</h4><p>For items like <strong>${itemName}</strong>, we recommend carry-on to prevent theft or loss. Wedding dresses can often be hung in the flight attendant closet.</p>`,
        'weapons': `<h4>⚠️ Zero Tolerance Policy</h4><p>Items categorized as self-defense or weapons, such as <strong>${itemName}</strong>, are prohibited in the cabin.</p>`,
        'default': `<h4>ℹ️ General Security Advice</h4><p>When packing <strong>${itemName}</strong>, always prioritize safety and ease of inspection.</p>`
    };
    if (Array.isArray(category)) {
        for (let c of category) { if (contexts[c]) return contexts[c]; }
    }
    return contexts['default'];
}

// ---------------------------------------------------------
// AD PROVIDER (Adsterra Integration)
// ---------------------------------------------------------
// ---------------------------------------------------------
// AD PROVIDER (Adsterra Integration)
// ---------------------------------------------------------
class AdProvider {
    constructor() {
        this.lastRefreshTime = 0;
        this.initTopBanner();
    }
    
    initTopBanner() {
        const adSlot = document.getElementById('ad-top-slot');
        if (adSlot) {
            adSlot.innerHTML = '';
            const iframe = document.createElement('iframe');
            iframe.style.width = '728px';
            iframe.style.height = '90px';
            iframe.style.border = 'none';
            iframe.style.overflow = 'hidden';
            iframe.scrolling = 'no';
            adSlot.appendChild(iframe);
            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(`
                <script type="text/javascript">
                    atOptions = { 'key' : '1eb6f5f58fd51d48c864a2232bd79e77', 'format' : 'iframe', 'height' : 90, 'width' : 728, 'params' : {} };
                <\/script>
                <script type="text/javascript" src="https://www.highperformanceformat.com/1eb6f5f58fd51d48c864a2232bd79e77/invoke.js"><\/script>
            `);
            doc.close();
        }
    }

    initWelcomeAd() {
        const adSlot = document.getElementById('ad-welcome-slot');
        if (!adSlot) return;
        if (adSlot.children.length > 0) return;

        const iframe = document.createElement('iframe');
        iframe.style.width = '300px';
        iframe.style.height = '250px';
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';
        iframe.scrolling = 'no';
        adSlot.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`
            <script type="text/javascript">
                atOptions = { 'key' : '1cdec3e45ca4d17202a0a9d38b08a542', 'format' : 'iframe', 'height' : 250, 'width' : 300, 'params' : {} };
            <\/script>
            <script type="text/javascript" src="https://repelaffinityworlds.com/1cdec3e45ca4d17202a0a9d38b08a542/invoke.js"><\/script>
        `);
        doc.close();
    }

    initStickyFooter() {
        if (!document.getElementById('ad-sticky-footer')) {
            const footerAd = document.createElement('div');
            footerAd.id = 'ad-sticky-footer';
            footerAd.style.cssText = 'position:fixed; bottom:0; left:0; width:100%; background:white; z-index:9999; text-align:center; border-top:1px solid #ddd; display:flex; justify-content:center; align-items:center; padding-top:5px; padding-bottom:5px; box-shadow: 0 -2px 5px rgba(0,0,0,0.1);';
            
            const closeBtn = document.createElement('button');
            closeBtn.innerText = '×';
            closeBtn.style.cssText = 'position:absolute; top:-20px; right:5px; background:#333; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; line-height:18px; font-size:14px;';
            closeBtn.onclick = () => footerAd.style.display = 'none';
            footerAd.appendChild(closeBtn);
            
            const iframe = document.createElement('iframe');
            iframe.style.width = '320px';
            iframe.style.height = '50px';
            iframe.style.border = 'none';
            iframe.style.overflow = 'hidden';
            iframe.scrolling = 'no';
            footerAd.appendChild(iframe);
            document.body.appendChild(footerAd);

            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(`
                <script type="text/javascript">
                    atOptions = { 'key' : 'e9b5cd97e61a665c3e6310d0c16893ff', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };
                <\/script>
                <script type="text/javascript" src="https://www.highperformanceformat.com/e9b5cd97e61a665c3e6310d0c16893ff/invoke.js"><\/script>
            `);
            doc.close();
        }
    }

    refreshInlineAd() {
        return; 
    }

    checkAdBlock() {
        setTimeout(() => {
            const adSlots = [ document.getElementById('ad-inline-slot'), document.getElementById('ad-welcome-slot') ];
            adSlots.forEach(slot => {
                if (!slot) return;
                const isBlocked = slot.clientHeight === 0 || slot.innerHTML.trim() === '' || window.getComputedStyle(slot).display === 'none';
                if (isBlocked) {
                    slot.style.display = 'flex';
                    slot.style.flexDirection = 'column';
                    slot.style.justifyContent = 'center';
                    slot.style.alignItems = 'center';
                    slot.style.height = 'auto';
                    slot.style.minHeight = '200px';
                    slot.style.background = '#f0f9ff';
                    slot.style.border = '1px dashed #bae6fd';
                    slot.style.borderRadius = '12px';
                    slot.style.padding = '20px';
                    slot.innerHTML = `
                        <div style="text-align: center; color: #475569;">
                            <i class="fa-solid fa-heart" style="color: #ef4444; font-size: 1.5rem; margin-bottom: 10px;"></i>
                            <p style="font-weight: 600; margin-bottom: 8px;">Support this free tool</p>
                            <p style="font-size: 0.85rem; margin-bottom: 16px; color: #64748b;">AdBlocker detected. That's okay! You can still support us by checking out these travel deals.</p>
                            <a href="https://www.amazon.com/s?k=travel+accessories&tag=canibringonpl-20" target="_blank" 
                               style="background: #0061ff; color: white; padding: 10px 20px; border-radius: 99px; text-decoration: none; font-size: 0.9rem; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; transition: transform 0.2s;">
                               <i class="fa-brands fa-amazon"></i> Shop Travel Gear
                            </a>
                        </div>
                    `;
                }
            });
        }, 2500);
    }
}
const adProvider = new AdProvider();

// ---------------------------------------------------------
// NAVIGATION MANAGER
// ---------------------------------------------------------
class NavigationManager {
    constructor() { this.scrollPositions = new Map(); }
    saveScrollPosition(key) {
        // Fix Memory Leak: Limit map size
        if (this.scrollPositions.size > 20) {
             const firstKey = this.scrollPositions.keys().next().value;
             this.scrollPositions.delete(firstKey);
        }
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
            const item = itemsData.find(i => i.id === itemId);
            url.searchParams.delete('category'); 
            // Fixed: Use toSlug logic directly to be safe
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
            const rulesParam = url.searchParams.get('rules'); // NEW

            if (itemParam) {
                let item = !isNaN(itemParam) ? itemsData.find(i => i.id === parseInt(itemParam)) : itemsData.find(i => toSlug(i.name) === itemParam);
                if (item) { displayItemResult(item, false); return true; }
            } else if (category) {
                displayCategoryResults(category);
                return true;
            } else if (rulesParam) {
                // NEW: Handle Country Landing Page
                const countryName = Object.keys(countryRules).find(c => c.toLowerCase() === rulesParam.toLowerCase());
                if (countryName) {
                    currentCountry = countryName;
                    const selector = document.getElementById('countrySelector');
                    if(selector) selector.value = countryName;
                    showCountryRules(countryName);
                    return true;
                }
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
    'USA': { title: 'Important TSA Rules (United States)', rules: [{ title: '3-1-1 Liquids Rule', description: 'Carry-on liquids must be in containers of 3.4 oz (100ml) or less, all fitting in one quart-sized clear plastic bag.' }, { title: 'Lithium Batteries', description: 'Spare lithium batteries and power banks must be in carry-on luggage only. Maximum 100Wh without approval.' }, { title: 'Sharp Objects', description: 'Scissors under 4 inches allowed in carry-on. All knives must be checked. Tools under 7 inches generally allowed.' }] },
    'China': { title: 'Important CAAC Rules (China)', rules: [{ title: 'Liquids Restriction', description: 'Maximum 100ml per container, total 1 liter allowed in carry-on.' }, { title: 'Power Banks (Critical!)', description: 'Power banks MUST have clear capacity marking and manufacturer logo. Unmarked power banks will be confiscated.' }, { title: 'Lighters & Matches', description: 'Lighters and matches are PROHIBITED in both carry-on and checked luggage in China.' }] },
    'EU': { title: 'Important EASA Rules (European Union)', rules: [{ title: 'Liquids, Aerosols & Gels', description: 'Maximum 100ml per container in a single 1-liter transparent bag.' }, { title: 'Lithium Batteries', description: 'Spare batteries in carry-on only. Power banks up to 100Wh allowed. 100-160Wh requires airline approval.' }, { title: 'Sharp Objects', description: 'Knives and scissors with blades over 6cm prohibited in carry-on. Must be in checked luggage.' }] },
    'UK': { title: 'Important UK Aviation Rules', rules: [{ title: 'Liquids Rule', description: 'Maximum 100ml per container in a single transparent bag.' }, { title: 'Electronic Devices', description: 'All electronic devices larger than phones must be screened separately.' }, { title: 'Prohibited Items', description: 'All knives, razor blades, and tools over 6cm prohibited in carry-on.' }] },
    'Canada': { title: 'Important CATSA Rules (Canada)', rules: [{ title: 'Liquids & Gels', description: 'Maximum 100ml per container in a single 1-liter clear, resealable bag. Exceptions for medications and baby formula.' }, { title: 'Lithium Batteries', description: 'Spare lithium batteries must be in carry-on.' }, { title: 'Tools', description: 'Tools must be less than 6cm from pivot point for carry-on.' }] },
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
    // Hide result panels
    document.getElementById('middlePanel')?.classList.add('hidden');
    document.getElementById('resultCard')?.classList.add('hidden');
    document.getElementById('categoryResults')?.classList.add('hidden');
    document.getElementById('countryRulesSection')?.classList.add('hidden');
    document.getElementById('resultAd')?.classList.add('hidden');

    currentCategory = null;

    // Show welcome content
    toggleMobileView(false);

    document.title = "Airport Carry-On Checker - Can I Bring This On A Plane?";

    // SEO FIX: Reset canonical to homepage
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://www.canibringonplane.com/');

    // SEO FIX: Reset OG tags
    const setMeta = (name, content, isProperty = false) => {
        const attr = isProperty ? 'property' : 'name';
        let el = document.querySelector(`meta[${attr}="${name}"]`);
        if (el) el.setAttribute('content', content);
    };
    setMeta('description', 'Instantly check TSA and airport security rules for over 200 items.');
    setMeta('og:title', 'Airport Carry-On Checker - Can I Bring This On A Plane?', true);
    setMeta('og:description', 'Instantly check TSA and airport security rules for over 200 items.', true);
    setMeta('og:url', 'https://www.canibringonplane.com/', true);

    // SEO FIX: Remove Orphaned Schema
    const existingSchema = document.getElementById('dynamic-schema');
    if (existingSchema) existingSchema.remove();

    // Clear URL params
    try {
        const url = new URL(window.location);
        url.searchParams.delete('item');
        url.searchParams.delete('category');
        window.history.pushState({ home: true }, '', url);
    } catch (e) {}
}

function initializeEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const categoryButtons = document.querySelectorAll('.category-chip');
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

function displayAutocomplete(matches) {
    const autocompleteResults = document.getElementById('autocompleteResults');
    autocompleteResults.innerHTML = matches.map(item => `
        <div class="autocomplete-item" onclick="showItemById(${item.id}); hideAutocomplete();">
            <span class="autocomplete-icon">${item.carryOn === 'allowed' ? '✅' : (item.carryOn === 'prohibited' ? '❌' : '⚠️')}</span>
            <span class="autocomplete-name">${item.name}</span>
        </div>
    `).join('');
    autocompleteResults.classList.remove('hidden');
}

function searchItems(query) {
    const lowerQuery = query.toLowerCase();
    return itemsData.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(lowerQuery);
        const keywordMatch = item.keywords && item.keywords.some(k => k.toLowerCase().includes(lowerQuery));
        return nameMatch || keywordMatch;
    }).sort((a, b) => {
        const aStart = a.name.toLowerCase().startsWith(lowerQuery);
        const bStart = b.name.toLowerCase().startsWith(lowerQuery);
        return (aStart === bStart) ? 0 : aStart ? -1 : 1;
    });
}

function findBestMatch(query) {
    const matches = searchItems(query);
    return matches.length > 0 ? matches[0] : null;
}

function displayRelatedItems(currentItem) {
    const relatedItemsDiv = document.getElementById('relatedItems');
    const related = itemsData.filter(i => i.id !== currentItem.id && currentItem.category?.some(c => i.category.includes(c))).slice(0, 6);
    
    if (related.length === 0) { relatedItemsDiv.innerHTML = ''; return; }
    
    // SEO FIX: Use <a> tags instead of spans
    const html = '<h4>Related:</h4><div style="display: flex; flex-wrap: wrap; gap: 8px;">' + 
    related.map(i => `
        <a href="?item=${toSlug(i.name)}" 
           class="related-tag" 
           onclick="event.preventDefault(); showItemById(${i.id});"
           style="text-decoration: none; color: inherit;">
           ${i.name}
        </a>
    `).join('') + 
    '</div>';
    
    relatedItemsDiv.innerHTML = html;
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
        'International': { name: 'ICAO', url: 'https://www.icao.int/Security/SFP/Pages/Passenger-Bag-Security.aspx' },
        'Thailand': { name: 'Thai Customs', url: 'https://www.customs.go.th/list_strc_simple_neted.php?ini_content=individual_160526_01&lang=en' },
        'Singapore': { name: 'ICA Singapore', url: 'https://www.ica.gov.sg/enter-transit-depart/entering-singapore/what-you-can-bring' },
        'Mexico': { name: 'Government of Mexico', url: 'https://www.gob.mx/aduanas' },
        'UAE': { name: 'UAE Government', url: 'https://u.ae/en/information-and-services/health-and-fitness/drugs-and-controlled-medicines' },
    };

    const scrollKey = `item-${item.id}`;
    navManager.saveScrollPosition(scrollKey);
    if (!skipHistoryPush) navManager.pushState(item.id, item.name);
    // PHASE 2 FIX: Update SEO Tags and Canonical URL
    updateSocialMeta(item);
    injectSchema(item);
    
    document.getElementById('welcomeMessage')?.classList.add('hidden');
    document.getElementById('countryRulesSection')?.classList.add('hidden');

    // Hide category panel when showing item result (unless on desktop with keepMiddlePanel)
    if (!keepMiddlePanel) {
        document.getElementById('middlePanel')?.classList.add('hidden');
    }

    // Hide welcome content
    toggleMobileView(true); 

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
    const resultCard = document.getElementById('resultCard');
    resultCard.classList.remove('hidden');
setTimeout(() => {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
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

    resultCard.innerHTML = `
        <button class="close-btn" id="closeResult">&times;</button>
        <h2 class="item-name">
            ${item.name}
            <button class="share-icon" onclick="shareItemLink(${item.id})" title="Copy Link" style="background:none;border:none;cursor:pointer;font-size:1rem;">🔗</button>
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
            <a href="${amazonLink}" target="_blank" class="action-btn amazon-btn">
               <i class="fa-brands fa-amazon" style="margin-right: 5px;"></i> Shop on Amazon
            </a>
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
            <a href="${sourceData.url}" target="_blank" style="color: #0061ff; text-decoration: underline;">
                ℹ️ Verify with official ${sourceData.name} website
            </a>
        </div>

        <div class="related-items" id="relatedItems"></div>
    `;

    // Show inline ad
    const resultAd = document.getElementById('resultAd');
    if (resultAd) resultAd.classList.remove('hidden');

    if (variants.length > 1 && document.getElementById('variantSelect')) {
        document.getElementById('variantSelect').onchange = (e) => {
            const newItem = itemsData.find(i => i.id === parseInt(e.target.value));
            if (newItem) displayItemResult(newItem, keepMiddlePanel);
        };
    }

    document.getElementById('closeResult')?.addEventListener('click', () => {
        resultCard.classList.add('hidden');
        document.getElementById('resultAd')?.classList.add('hidden');
        document.getElementById('searchInput').value = '';

        // Check if we came from a category
        const midPanel = document.getElementById('middlePanel');
        if (midPanel && !midPanel.classList.contains('hidden')) {
            // Stay on category view
        } else {
            // Go back to home
            resetToHome();
        }
    });

    displayRelatedItems(item);
    adProvider.refreshInlineAd();
    
    // Refresh Vertical Ad (The Fix)
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
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

// ---------------------------------------------------------
// DISPLAY CATEGORY (Updated for Single-Column Mobile View)
// ---------------------------------------------------------
function displayCategoryResults(category, skipHistoryPush = false) {
    if (!skipHistoryPush) navManager.pushCategoryState(category);
    currentCategory = category;

    const midPanel = document.getElementById('middlePanel');
    midPanel.classList.remove('hidden');
    window.scrollTo(0, 0);

    // Hide other content
    toggleMobileView(true);
    document.getElementById('resultCard')?.classList.add('hidden');
    document.getElementById('resultAd')?.classList.add('hidden');
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

        const link = document.createElement('a');
        link.className = 'category-item-card';
        link.href = `?item=${toSlug(item.name)}`; // Google can now see this URL
        link.style.textDecoration = 'none';      // Remove underline
        link.innerHTML = `
            <div class="category-item-name">${item.name}</div>
            <div class="category-item-status">
                <span class="${displayClass}">
                    🎒 ${displayText}
                </span>
            </div>`;

        // Keep the "Instant" feel by preventing the page reload
        link.onclick = (e) => {
            e.preventDefault(); 
            const isDesktop = window.innerWidth >= 1024; 
            displayItemResult(item, isDesktop);
        };
        list.appendChild(link);
    });
    
    // Refresh inline ad
    adProvider.refreshInlineAd();
}

function showCountryRules(country) {
    const rules = countryRules[country];
    if (!rules) return;

    // Hide other content
    toggleMobileView(true);
    document.getElementById('middlePanel')?.classList.add('hidden');
    document.getElementById('resultCard')?.classList.add('hidden');
    document.getElementById('resultAd')?.classList.add('hidden');

    const countrySection = document.getElementById('countryRulesSection');
    countrySection.classList.remove('hidden');
    window.scrollTo(0, 0);

    const cards = rules.rules.map(r => `<div class="info-item"><div><h3>${r.title}</h3><p>${r.description}</p></div></div>`).join('');

    countrySection.innerHTML = `
        <div class="info-card">
            <button class="close-btn" id="closeCountryRules">&times;</button>
            <div style="background:#fef3c7;padding:12px;border-radius:8px;margin-bottom:16px;font-size:0.875rem;color:#92400e;">
                ⚠️ <strong>Note:</strong> Rules change frequently. Always verify with your airline.
            </div>
            <h2 class="info-card-title"><i class="fa-solid fa-earth-americas"></i> ${rules.title}</h2>
            <div class="info-grid">${cards}</div>
        </div>
    `;

    document.getElementById('closeCountryRules')?.addEventListener('click', () => {
        countrySection.classList.add('hidden');
        toggleMobileView(false);
    });

    adProvider.refreshInlineAd();
}

function toggleBagItem(id) {
    if (savedItems.has(id)) savedItems.delete(id);
    else savedItems.add(id);
    localStorage.setItem('myBag', JSON.stringify([...savedItems]));
    updateBagCounter();
    const item = itemsData.find(i => i.id === id);
    const resultCard = document.getElementById('resultCard');
    if (item && resultCard && !resultCard.classList.contains('hidden')) {
        const midPanel = document.getElementById('middlePanel');
        const keepMiddlePanel = midPanel && !midPanel.classList.contains('hidden');
        displayItemResult(item, keepMiddlePanel, true);
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

// SEO Functions
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

console.log('✅ App initialized with Ads & Features!');