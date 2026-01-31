/**
 * UI.JS - Airport Carry-On Checker
 * Contains: NavigationManager, display functions, modals, SEO helpers
 *
 * ES6 Module - Use: import { navManager, ... } from './ui.js'
 */

import { ITEMS_DATA } from './data.js';
import { AFFILIATE_MAP, countryRules, countrySources } from './config.js';
import { adProvider } from './ads.js';
import { DESTINATIONS } from './destinations.js';

// ---------------------------------------------------------
// STATE
// ---------------------------------------------------------
let currentCountry = 'USA';
let currentCategory = null;
let savedItems = new Set();
let searchIndex = new Map();
let autocompleteTimeout = null;
// ---------------------------------------------------------
// INITIALIZATION (The Engine Starter)
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Airport Carry-On Checker...');

    // ========== FAILSAFE WINDOW BINDINGS ==========
    // Bind BEFORE any other code runs to ensure onclick handlers work
    window.showItemById = showItemById;
    window.toggleBagItem = toggleBagItem;
    window.shareItemLink = shareItemLink;
    window.showMyBagModal = showMyBagModal;
    window.updateBagCounter = updateBagCounter;
    window.hideAutocomplete = hideAutocomplete;
    window.resetToHome = resetToHome;
    window.clearAllBagItems = clearAllBagItems;
    window.displayCategoryResults = displayCategoryResults;
    window.openDestinationModal = openDestinationModal;
    window.selectDestination = selectDestination;
    window.minimizeDestinationReport = minimizeDestinationReport;
    window.closeDestinationReport = minimizeDestinationReport;
    window.openItemModal = openItemModal;
    window.handleSearch = handleSearch;
    window.navManager = navManager;

    // ========== 1. BUILD SEARCH INDEX ==========
    buildSearchIndex();

    // ========== 2. SETUP HISTORY/NAVIGATION ==========
    setupPopstateHandler();

    // ========== 3. UPDATE BAG COUNTER ==========
    updateBagCounter();

    // ========== 4. SEO: CANONICAL URL ==========
    const url = new URL(window.location);
    if (!url.searchParams.get('item') && !url.searchParams.get('category')) {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', 'https://www.canibringonplane.com/');
    }

    // ========== 5. LOAD FROM URL (Deep Links) ==========
    const loaded = navManager.loadFromURL();

    // ========== 6. SETUP EVENT LISTENERS ==========
    initializeEventListeners();

    // ========== 7. SEARCH INPUT LISTENER ==========
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (!query) {
                hideAutocomplete();
                return;
            }
            handleSearch(query);
        });
    }

    // ========== 8. MODAL CLOSE BUTTONS ==========
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
        });
    });

    // ========== 9. CATEGORY CHIPS (Horizontal Strip) ==========
    sortCategoryChips(); // Sort A-Z for better UX
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const category = chip.dataset.category;
            if (category) displayCategoryResults(category);
        });
    });

    // ========== 10. POPULAR TAGS ==========
    document.querySelectorAll('.popular-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const itemName = tag.dataset.item;
            if (itemName) {
                const item = ITEMS_DATA.find(i => i.name.toLowerCase().includes(itemName.toLowerCase()));
                if (item) showItemById(item.id);
            }
        });
    });

    // ========== 11. BAG FAB BUTTON ==========
    const bagFAB = document.getElementById('bagFAB');
    if (bagFAB) {
        bagFAB.addEventListener('click', showMyBagModal);
    }

    // ========== 12. INITIALIZE ADS ==========
    if (adProvider) {
        adProvider.initStickyFooter();
        adProvider.initWelcomeAd();
        adProvider.checkAdBlock();
    }

    // ========== 13. LOAD SAVED DESTINATION ==========
    const savedDest = localStorage.getItem('selectedDestination');
    if (savedDest && DESTINATIONS[savedDest]) {
        window.currentDestination = DESTINATIONS[savedDest];
        window.currentDestinationCode = savedDest;
        const btn = document.querySelector('.dest-btn span');
        if (btn) btn.innerText = DESTINATIONS[savedDest].name;
    }

    console.log('✅ App initialized successfully');
});
// Load saved items from localStorage
if (localStorage.getItem('myBag')) {
    try {
        const savedIds = JSON.parse(localStorage.getItem('myBag'));
        savedIds.forEach(id => savedItems.add(id));
    } catch (e) {
        console.error("Error loading bag:", e);
    }
}

// ---------------------------------------------------------
// SEO HELPERS
// ---------------------------------------------------------
function updateMetaTag(property, content) {
    // Handle both name and property attributes
    let meta = document.querySelector(`meta[property="${property}"]`) ||
               document.querySelector(`meta[name="${property}"]`);
    if (meta) {
        meta.setAttribute('content', content);
    }
}

function resetPageTitle() {
    document.title = 'Can I Bring This On A Plane? | Airport Carry-On Checker';
    updateMetaTag('og:title', 'Can I Bring This On A Plane? | Airport Carry-On Checker');
    updateMetaTag('og:description', 'Instantly check TSA and airport security rules for any item.');
}

// ---------------------------------------------------------
// SEARCH INDEX
// ---------------------------------------------------------
export function buildSearchIndex() {
    searchIndex.clear();
    ITEMS_DATA.forEach(item => {
        searchIndex.set(item.name.toLowerCase(), item);
        if (item.keywords) {
            item.keywords.forEach(kw => searchIndex.set(kw.toLowerCase(), item));
        }
    });
}

// ---------------------------------------------------------
// HELPERS
// ---------------------------------------------------------

// Sort category chips alphabetically (A-Z)
function sortCategoryChips() {
    const container = document.querySelector('.category-strip-inner');
    if (!container) return;

    const chips = Array.from(container.querySelectorAll('.category-chip'));
    if (chips.length === 0) return;

    // Sort by text content (A-Z)
    chips.sort((a, b) => {
        const textA = a.textContent.trim().toLowerCase();
        const textB = b.textContent.trim().toLowerCase();
        return textA.localeCompare(textB);
    });

    // Re-append in sorted order
    chips.forEach(chip => container.appendChild(chip));
    console.log('📋 Category chips sorted A-Z');
}

export function toSlug(text) {
    return text.toString().toLowerCase()
        .replace(/&/g, 'and')
        .replace(/\+/g, 'plus')
        .replace(/[()]/g, '')
        .replace(/\//g, '-')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

function toggleMobileView(showResult) {
    const welcomeContent = document.getElementById('welcomeMessage');
    if (showResult) {
        welcomeContent?.classList.add('hidden');
    } else {
        welcomeContent?.classList.remove('hidden');
    }
}

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
        for (let c of category) {
            if (contexts[c]) return contexts[c];
        }
    }
    return contexts['default'];
}

function formatStatus(status) {
    const map = {
        'allowed': '✅ Allowed',
        'prohibited': '❌ Not Allowed',
        'restricted': '⚠️ Restricted'
    };
    return map[status] || status;
}

function formatNoteToBulletPoints(note) {
    let points = [];
    const segments = note.split(/(?=✅|❌|⚠️|💡|📞|🚨)/);
    segments.forEach(s => {
        if (s.trim()) points.push(s.trim());
    });
    if (points.length <= 1) return `<p>${addBoldToKeywords(note)}</p>`;
    return `<ul>${points.map(p => `<li>${addBoldToKeywords(p)}</li>`).join('')}</ul>`;
}

function addBoldToKeywords(text) {
    const keywords = ['CRITICAL', 'WARNING', 'ALWAYS', 'NEVER', 'MUST', 'PROHIBITED', 'REQUIRED', 'RESTRICTED', 'CARRY-ON', 'CHECKED'];
    let result = text;
    keywords.forEach(k => {
        result = result.replace(new RegExp(`\\b(${k})\\b`, 'gi'), '<strong>$1</strong>');
    });
    return result;
}

// ---------------------------------------------------------
// NAVIGATION MANAGER
// ---------------------------------------------------------
class NavigationManager {
    constructor() {
        this.scrollPositions = new Map();
    }

    saveScrollPosition(key) {
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
            setTimeout(() => {
                rightPanel.scrollTop = this.scrollPositions.get(key);
            }, 50);
        }
    }

    pushState(itemId, itemName) {
        try {
            const url = new URL(window.location);
            url.searchParams.delete('category');
            url.searchParams.set('item', toSlug(itemName));
            window.history.pushState({ itemId, itemName }, '', url);
        } catch (e) { }
    }

    pushCategoryState(category) {
        try {
            const url = new URL(window.location);
            url.searchParams.set('category', category);
            url.searchParams.delete('item');
            window.history.pushState({ category }, '', url);
        } catch (e) { }
    }

    loadFromURL() {
        try {
            const url = new URL(window.location);
            const itemParam = url.searchParams.get('item');
            const category = url.searchParams.get('category');
            const rulesParam = url.searchParams.get('rules');

            if (itemParam) {
                let item = !isNaN(itemParam)
                    ? ITEMS_DATA.find(i => i.id === parseInt(itemParam))
                    : ITEMS_DATA.find(i => toSlug(i.name) === itemParam);
                if (item) {
                    displayItemResult(item, false);
                    return true;
                }
            } else if (category) {
                displayCategoryResults(category);
                return true;
            } else if (rulesParam) {
                const countryName = Object.keys(countryRules).find(c => c.toLowerCase() === rulesParam.toLowerCase());
                if (countryName) {
                    currentCountry = countryName;
                    const selector = document.getElementById('countrySelector');
                    if (selector) selector.value = countryName;
                    showCountryRules(countryName);
                    return true;
                }
            }
        } catch (e) { }

        if (window.innerWidth >= 1024) {
            resetToHome();
        }
        return false;
    }
}

export const navManager = new NavigationManager();

// ---------------------------------------------------------
// RESET TO HOME
// ---------------------------------------------------------
export function resetToHome() {
    document.getElementById('middlePanel')?.classList.add('hidden');
    document.getElementById('resultCard')?.classList.add('hidden');
    document.getElementById('categoryResults')?.classList.add('hidden');
    document.getElementById('countryRulesSection')?.classList.add('hidden');
    document.getElementById('resultAd')?.classList.add('hidden');

    currentCategory = null;
    toggleMobileView(false);

    document.title = "Airport Carry-On Checker - Can I Bring This On A Plane?";

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://www.canibringonplane.com/');

    const setMeta = (name, content, isProperty = false) => {
        const attr = isProperty ? 'property' : 'name';
        let el = document.querySelector(`meta[${attr}="${name}"]`);
        if (el) el.setAttribute('content', content);
    };
    setMeta('description', 'Instantly check TSA and airport security rules for over 200 items.');
    setMeta('og:title', 'Airport Carry-On Checker - Can I Bring This On A Plane?', true);
    setMeta('og:description', 'Instantly check TSA and airport security rules for over 200 items.', true);
    setMeta('og:url', 'https://www.canibringonplane.com/', true);

    const existingSchema = document.getElementById('dynamic-schema');
    if (existingSchema) existingSchema.remove();

    try {
        const url = new URL(window.location);
        url.searchParams.delete('item');
        url.searchParams.delete('category');
        window.history.pushState({ home: true }, '', url);
    } catch (e) { }
}

// ---------------------------------------------------------
// SEARCH FUNCTIONS
// ---------------------------------------------------------
function searchItems(query) {
    const lowerQuery = query.toLowerCase();
    return ITEMS_DATA.filter(item => {
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

function findItemVariants(item) {
    const baseName = item.name.replace(/\s*\([^)]*\)/g, '').trim();
    return ITEMS_DATA.filter(i => i.name.replace(/\s*\([^)]*\)/g, '').trim().toLowerCase() === baseName.toLowerCase());
}

export function hideAutocomplete() {
    document.getElementById('autocompleteResults').classList.add('hidden');
}

function displayAutocomplete(matches) {
    const autocompleteResults = document.getElementById('autocompleteResults');
    autocompleteResults.innerHTML = matches.map(item => `
        <div class="autocomplete-item" onclick="window.showItemById(${item.id}); window.hideAutocomplete();">
            <span class="autocomplete-icon">${item.carryOn === 'allowed' ? '✅' : (item.carryOn === 'prohibited' ? '❌' : '⚠️')}</span>
            <span class="autocomplete-name">${item.name}</span>
        </div>
    `).join('');
    autocompleteResults.classList.remove('hidden');
}

function handleSearch(query) {
    const autocompleteResults = document.getElementById('autocompleteResults');
    if (query.trim().length < 2) {
        hideAutocomplete();
        return;
    }
    const matches = searchItems(query);
    if (matches.length === 0) {
        autocompleteResults.innerHTML = '<div class="autocomplete-item">No items found</div>';
        autocompleteResults.classList.remove('hidden');
        return;
    }
    displayAutocomplete(matches.slice(0, 5));
}

// ---------------------------------------------------------
// DISPLAY ITEM RESULT (Revenue Optimized)
// ---------------------------------------------------------
export function displayItemResult(item, keepMiddlePanel = false, skipHistoryPush = false) {
    const scrollKey = `item-${item.id}`;
    navManager.saveScrollPosition(scrollKey);
    if (!skipHistoryPush) navManager.pushState(item.id, item.name);

    updateSocialMeta(item);
    injectSchema(item);

    document.getElementById('welcomeMessage')?.classList.add('hidden');
    document.getElementById('countryRulesSection')?.classList.add('hidden');

    if (!keepMiddlePanel) {
        document.getElementById('middlePanel')?.classList.add('hidden');
    }

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

    // --- 💰 HIGH MARGIN LOGIC STARTS HERE ---
    // 1. Get the category (or default)
    const cat = Array.isArray(item.category) ? item.category[0] : item.category;
    // 2. Lookup affiliates (Use 'default' if category not found)
    let affiliates = AFFILIATE_MAP[cat] || AFFILIATE_MAP['default'];
    // 3. Fallback just in case
    if (!affiliates) affiliates = AFFILIATE_MAP['default'];

    const isSaved = savedItems.has(item.id);
    // REBRAND: "Checklist" instead of "Bag"
    const bagBtnText = isSaved ? '✅ On Checklist' : '➕ Add to Checklist';
    const bagBtnClass = isSaved ? 'action-btn saved' : 'action-btn';
    const sourceData = countrySources[currentCountry] || countrySources['International'];
    const richContext = getCategoryContext(item.category, item.name);

    resultCard.innerHTML = `
        <button class="close-btn" id="closeResult">&times;</button>
        <h2 class="item-name">
            ${item.name}
            <button class="share-icon" onclick="window.shareItemLink(${item.id})" title="Copy Link" style="background:none;border:none;cursor:pointer;font-size:1rem;">🔗</button>
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
            <button class="${bagBtnClass} add-to-bag-btn" onclick="window.toggleBagItem(${item.id})" style="width:100%; justify-content:center;">
                ${bagBtnText}
            </button>
        </div>

        <div class="item-note">
        ${currentStatus.isCustomsBanned
            ? '<strong>⚠️ Do not pack this item. It is prohibited at your destination.</strong>'
            : formatNoteToBulletPoints(item.note)
        }
        </div>

        <div class="affiliate-box" style="margin-top: 20px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h4 style="margin-top:0; color:#334155; font-size:0.9rem;"><i class="fa-solid fa-star"></i> Recommended for Travel</h4>
            <div class="affiliate-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top:10px;">
                ${affiliates.map(aff => `
                    <a href="https://www.amazon.com/s?k=${encodeURIComponent(aff.query)}&tag=canibringonpl-20" target="_blank" class="affiliate-link" style="display:flex; align-items:center; gap:8px; background:white; padding:8px 12px; border-radius:6px; text-decoration:none; color:#333; border:1px solid #cbd5e1; font-size:0.85rem; font-weight:500;">
                        <div class="aff-icon" style="color:#2563eb;"><i class="fa-solid ${aff.icon}"></i></div>
                        <span>${aff.name}</span>
                        <i class="fa-solid fa-chevron-right arrow" style="margin-left:auto; color:#94a3b8; font-size:0.7rem;"></i>
                    </a>
                `).join('')}
            </div>
        </div>

        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; color: #444;">${richContext}</div>

        <div style="margin-top: 15px; text-align: center; font-size: 0.8rem;">
            <a href="${sourceData.url}" target="_blank" style="color: #0061ff; text-decoration: underline;">
                ℹ️ Verify with official ${sourceData.name} website
            </a>
        </div>

        <div class="related-items" id="relatedItems"></div>
        <div id="ad-inline-slot" class="ad-slot" style="margin-top:20px;"></div>
    `;

    const resultAd = document.getElementById('resultAd');
    if (resultAd) resultAd.classList.remove('hidden');

    if (variants.length > 1 && document.getElementById('variantSelect')) {
        document.getElementById('variantSelect').onchange = (e) => {
            const newItem = ITEMS_DATA.find(i => i.id === parseInt(e.target.value));
            if (newItem) displayItemResult(newItem, keepMiddlePanel);
        };
    }

    document.getElementById('closeResult')?.addEventListener('click', () => {
        resultCard.classList.add('hidden');
        document.getElementById('resultAd')?.classList.add('hidden');
        document.getElementById('searchInput').value = '';

        // SEO: Clean up dynamic schemas
        removeSchemas();

        const midPanel = document.getElementById('middlePanel');
        if (midPanel && !midPanel.classList.contains('hidden')) {
            // Stay on category view
        } else {
            resetToHome();
        }
    });

    displayRelatedItems(item);
    adProvider.refreshInlineAd();

    try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) { }
}

function displayRelatedItems(currentItem) {
    const relatedItemsDiv = document.getElementById('relatedItems');
    const related = ITEMS_DATA.filter(i =>
        i.id !== currentItem.id && currentItem.category?.some(c => i.category.includes(c))
    ).slice(0, 6);

    if (related.length === 0) {
        relatedItemsDiv.innerHTML = '';
        return;
    }

    const html = '<h4>Related:</h4><div style="display: flex; flex-wrap: wrap; gap: 8px;">' +
        related.map(i => `
        <a href="?item=${toSlug(i.name)}"
           class="related-tag"
           onclick="event.preventDefault(); window.showItemById(${i.id});"
           style="text-decoration: none; color: inherit;">
           ${i.name}
        </a>
    `).join('') +
        '</div>';

    relatedItemsDiv.innerHTML = html;
}

// ---------------------------------------------------------
// SEO HELPER (Paste this right above displayCategoryResults)
// ---------------------------------------------------------
function updatePageSEO(title, queryParam) {
    // 1. Update Browser Tab Title
    document.title = title;
    
    // 2. Update URL (Cleanly)
    if (window.history.pushState) {
        const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}${queryParam}`;
        window.history.pushState({path: newUrl}, '', newUrl);
    }

    // 3. Update Meta Tags (Safety Wrapped)
    try {
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const twTitle = document.querySelector('meta[name="twitter:title"]');
        if (ogTitle) ogTitle.content = title;
        if (twTitle) twTitle.content = title;
    } catch (e) { console.warn('Meta tag update failed', e); }
}

// ---------------------------------------------------------
// CONTEXTUAL MONETIZATION MAP
// ---------------------------------------------------------
const CONTEXTUAL_ADS = {
    medication: {
        icon: '🏥',
        title: 'Travel Medical Insurance',
        subtitle: 'Cover confiscated meds & medical emergencies abroad',
        url: 'https://safetywing.com/nomad-insurance/?referenceID=canibringonplane',
        variant: 'insurance'
    },
    electronics: {
        icon: '🛡️',
        title: 'Protect Your Electronics',
        subtitle: 'TSA-approved locks & padded laptop sleeves',
        url: 'https://www.amazon.com/s?k=tsa+approved+laptop+sleeve&tag=canibringonpl-20',
        variant: 'protection'
    },
    liquids: {
        icon: '🧴',
        title: 'TSA-Approved Travel Bottles',
        subtitle: '3.4oz leak-proof containers that pass security',
        url: 'https://www.amazon.com/s?k=tsa+approved+toiletry+bottles&tag=canibringonpl-20',
        variant: 'travel-bag'
    },
    toiletries: {
        icon: '✈️',
        title: 'Clear Toiletry Bags',
        subtitle: 'TSA-compliant quart bags for smooth screening',
        url: 'https://www.amazon.com/s?k=tsa+approved+clear+toiletry+bag&tag=canibringonpl-20',
        variant: 'travel-bag'
    },
    baby: {
        icon: '👶',
        title: 'Travel Baby Gear',
        subtitle: 'Portable formula dispensers & diaper bags',
        url: 'https://www.amazon.com/s?k=travel+baby+gear+airplane&tag=canibringonpl-20',
        variant: 'baby-gear'
    },
    camping: {
        icon: '🏕️',
        title: 'Packable Camping Gear',
        subtitle: 'TSA-friendly multi-tools & compact stoves',
        url: 'https://www.amazon.com/s?k=tsa+friendly+camping+gear&tag=canibringonpl-20',
        variant: 'camping'
    },
    food: {
        icon: '🍱',
        title: 'Travel Snack Containers',
        subtitle: 'Leak-proof containers for in-flight meals',
        url: 'https://www.amazon.com/s?k=travel+food+container+airplane&tag=canibringonpl-20',
        variant: 'travel-bag'
    },
    sports: {
        icon: '🎒',
        title: 'Sports Equipment Bags',
        subtitle: 'Padded bags that protect gear in checked luggage',
        url: 'https://www.amazon.com/s?k=sports+equipment+travel+bag&tag=canibringonpl-20',
        variant: 'protection'
    },
    tools: {
        icon: '🔧',
        title: 'TSA Multi-Tool Guide',
        subtitle: 'Which tools can fly? Check our expert picks',
        url: 'https://www.amazon.com/s?k=tsa+compliant+multi+tool&tag=canibringonpl-20',
        variant: 'protection'
    },
    weapons: {
        icon: '🛂',
        title: 'Travel Insurance for Confiscation',
        subtitle: 'Get covered if items are seized at security',
        url: 'https://safetywing.com/nomad-insurance/?referenceID=canibringonplane',
        variant: 'insurance'
    },
    hazardous: {
        icon: '⚠️',
        title: 'Know Before You Go',
        subtitle: 'Travel insurance for unexpected confiscations',
        url: 'https://safetywing.com/nomad-insurance/?referenceID=canibringonplane',
        variant: 'insurance'
    },
    music: {
        icon: '🎸',
        title: 'Instrument Flight Cases',
        subtitle: 'Protective cases approved for cabin storage',
        url: 'https://www.amazon.com/s?k=instrument+flight+case+carry+on&tag=canibringonpl-20',
        variant: 'protection'
    },
    fashion: {
        icon: '👗',
        title: 'Garment Travel Bags',
        subtitle: 'Keep suits & dresses wrinkle-free in transit',
        url: 'https://www.amazon.com/s?k=garment+bag+carry+on+travel&tag=canibringonpl-20',
        variant: 'travel-bag'
    },
    household: {
        icon: '🏠',
        title: 'Packing Cubes & Organizers',
        subtitle: 'Maximize luggage space for household items',
        url: 'https://www.amazon.com/s?k=packing+cubes+travel+organizer&tag=canibringonpl-20',
        variant: 'travel-bag'
    },
    art: {
        icon: '🎨',
        title: 'Art Supply Travel Cases',
        subtitle: 'Protect brushes, paints & supplies in transit',
        url: 'https://www.amazon.com/s?k=art+supply+travel+case&tag=canibringonpl-20',
        variant: 'protection'
    },
    customs: {
        icon: '🛂',
        title: 'Customs Declaration Help',
        subtitle: 'Travel insurance that covers duty disputes',
        url: 'https://safetywing.com/nomad-insurance/?referenceID=canibringonplane',
        variant: 'insurance'
    }
};

function getContextualAd(category) {
    return CONTEXTUAL_ADS[category] || null;
}

/// ---------------------------------------------------------
// DISPLAY CATEGORY RESULTS (Fixed)
// ---------------------------------------------------------
export function displayCategoryResults(category, skipHistoryPush = false) {
    if (!skipHistoryPush && window.navManager) window.navManager.pushCategoryState(category);

    // 1. SEO UPDATE - Dynamic Virtual Page Title
    const displayTitle = category.charAt(0).toUpperCase() + category.slice(1);
    const dest = window.currentDestination;
    const destCode = window.currentDestinationCode; // <--- DEFINED HERE (1st time)
    const year = new Date().getFullYear();

    // Build SEO-optimized title
    let pageTitle, queryParam;
    if (dest) {
        pageTitle = `Can I bring ${displayTitle} to ${dest.name}? - Rules ${year}`;
        queryParam = `?category=${category}&dest=${destCode}`;
    } else {
        pageTitle = `${displayTitle} on a Plane - TSA Carry-On Rules ${year}`;
        queryParam = `?category=${category}`;
    }
    
    // Safety check for updatePageSEO
    if (typeof updatePageSEO === 'function') {
        updatePageSEO(pageTitle, queryParam);
    }

    // 2. UI CLEANUP
    const elementsToHide = [
        'welcomeMessage', 'quickGuide', 'popularSearches', 
        'travelMustHaves', 'securityGuide', 'howItWorks',
        'resultCard', 'resultAd', 'destinationReport', 'homeContent'
    ];
    elementsToHide.forEach(id => document.getElementById(id)?.classList.add('hidden'));

    const midPanel = document.getElementById('middlePanel');
    if (midPanel) midPanel.classList.remove('hidden');
    window.scrollTo(0, 0);

    // 3. STICKY BAR LOGIC
    const sticky = document.getElementById('stickyDestBar');
    if (sticky && dest) {
        sticky.classList.remove('hidden');
        sticky.style.display = 'flex';
        sticky.style.border = `2px solid ${dest.theme?.bg || '#e2e8f0'}`;
        sticky.style.background = '#ffffff';
        
        const flagEl = document.getElementById('stickyFlag');
        const textEl = document.getElementById('stickyText');
        if (flagEl) flagEl.innerText = dest.flag;
        if (textEl) textEl.innerHTML = `Mode: <strong style="color:${dest.theme?.color}">${dest.name}</strong>`;
    }

    // 4. FILTER & SORT
    const items = ITEMS_DATA.filter(i => i.category && i.category.includes(category));
    
    const titleEl = document.getElementById('categoryTitle');
    const countEl = document.getElementById('categoryCount');
    if (titleEl) titleEl.textContent = category.toUpperCase();
    if (countEl) countEl.textContent = `${items.length} items`;

    // --- DELETE THE DUPLICATE LINE THAT WAS HERE ---
    // We already have 'destCode' from the top of the function.

    items.sort((a, b) => {
        const getScore = (item) => {
            // Priority 0: Banned in Destination (Bottom)
            if (destCode && item.customs_restricted?.includes(destCode)) return 0;
            
            // Priority 3: Fully Safe (Top)
            if (item.carryOn === 'allowed' && item.checked === 'allowed') return 3;
            
            // Priority 1: Prohibited (Low)
            if (item.carryOn === 'prohibited' && item.checked === 'prohibited') return 1;
            
            // Priority 2: Mixed/Restricted (Middle)
            return 2;
        };
        return getScore(b) - getScore(a); 
    });

    // 📊 SEO: Inject Category Schema
    if (typeof injectCategorySchema === 'function') injectCategorySchema(category, items);

    // 5. RENDER GRID
    const list = document.getElementById('categoryItemsList');
    if (!list) return;
    list.innerHTML = '';

    // 💰 CONTEXTUAL MONETIZATION
    if (typeof getContextualAd === 'function') {
        const contextualAd = getContextualAd(category);
        if (contextualAd) {
            const adCard = document.createElement('a');
            adCard.href = contextualAd.url;
            adCard.target = '_blank';
            adCard.rel = 'noopener sponsored';
            adCard.className = `contextual-ad-card ${contextualAd.variant}`;
            adCard.innerHTML = `
                <div class="contextual-ad-icon">${contextualAd.icon}</div>
                <div class="contextual-ad-content">
                    <h4>${contextualAd.title}</h4>
                    <p>${contextualAd.subtitle}</p>
                </div>
                <div class="contextual-ad-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            `;
            list.appendChild(adCard);
        }
    }
    
 items.forEach(item => renderItemCard(item, list, destCode));
 }



// ---------------------------------------------------------
// SHOW COUNTRY RULES
// ---------------------------------------------------------
export function showCountryRules(country) {
    const rules = countryRules[country];
    if (!rules) return;

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

// ---------------------------------------------------------
// BAG (CHECKLIST) FUNCTIONS
// ---------------------------------------------------------
export function toggleBagItem(id) {
    if (savedItems.has(id)) savedItems.delete(id);
    else savedItems.add(id);
    localStorage.setItem('myBag', JSON.stringify([...savedItems]));
    updateBagCounter();

    const item = ITEMS_DATA.find(i => i.id === id);
    const resultCard = document.getElementById('resultCard');
    if (item && resultCard && !resultCard.classList.contains('hidden')) {
        const midPanel = document.getElementById('middlePanel');
        const keepMiddlePanel = midPanel && !midPanel.classList.contains('hidden');
        displayItemResult(item, keepMiddlePanel, true);
    }
}

export function updateBagCounter() {
    document.getElementById('bagCounter').textContent = savedItems.size;
}

export function showMyBagModal() {
    const bagList = Array.from(savedItems).map(id => ITEMS_DATA.find(i => i.id === id)).filter(i => i);

    // 🧠 SMART LOGIC: Check for country-banned items
    const getItemStatus = (item) => {
        // Check if item is banned in the selected destination
        if (window.currentDestinationCode && item.customs_restricted) {
            if (item.customs_restricted.includes(window.currentDestinationCode)) {
                return { status: 'banned', badge: '⛔', label: `BANNED IN ${window.currentDestination.name.toUpperCase()}` };
            }
        }
        // Default carry-on status
        if (item.carryOn === 'allowed') return { status: 'allowed', badge: '✅', label: 'OK' };
        if (item.carryOn === 'prohibited') return { status: 'prohibited', badge: '❌', label: 'NO' };
        return { status: 'restricted', badge: '⚠️', label: 'CHECK' };
    };

    // Count items by status (including banned)
    let allowedCount = 0, restrictedCount = 0, prohibitedCount = 0, bannedCount = 0;
    bagList.forEach(item => {
        const { status } = getItemStatus(item);
        if (status === 'banned') bannedCount++;
        else if (status === 'allowed') allowedCount++;
        else if (status === 'restricted') restrictedCount++;
        else prohibitedCount++;
    });

    // 🌍 COMPLIANCE HEADER (New)
    let complianceHeader = '';
    if (window.currentDestination) {
        complianceHeader = `
            <div class="compliance-header">
                Checking rules for: <strong>${window.currentDestination.flag} ${window.currentDestination.name}</strong>
            </div>`;
    }

    let content = `
        <h2 style="margin:0 0 15px 0; font-size:1.25rem;">
            <i class="fa-solid fa-clipboard-check"></i> Pre-Flight Compliance
        </h2>
        ${complianceHeader}
    `;

    if (savedItems.size === 0) {
        content += `
            <div class="empty-bag-state" style="text-align:center; padding:30px 0;">
                <i class="fa-solid fa-clipboard-list" style="font-size:3rem; color:#cbd5e1; margin-bottom:15px;"></i>
                <p>Your checklist is empty.</p>
                <p style="font-size:0.9rem; color:#64748b;">Add items to verify compliance.</p>
            </div>`;
    } else {
        // Stats bar with banned count if applicable
        let statsHtml = `<span style="color:green">✅ ${allowedCount}</span>`;
        statsHtml += `<span style="color:orange">⚠️ ${restrictedCount}</span>`;
        statsHtml += `<span style="color:red">❌ ${prohibitedCount}</span>`;
        if (bannedCount > 0) {
            statsHtml += `<span style="color:#991b1b; font-weight:700;">⛔ ${bannedCount} BANNED</span>`;
        }

        content += `<div style="background:#f8f9fa; padding:10px; border-radius:5px; margin-bottom:15px; display:flex; justify-content:space-around; font-size:0.9em; flex-wrap:wrap; gap:8px;">${statsHtml}</div><ul style="list-style:none; padding:0; margin:0;">`;

        bagList.forEach(item => {
            const { status, badge, label } = getItemStatus(item);
            const isBanned = status === 'banned';

            const badgeStyle = isBanned
                ? 'background:#fee2e2;color:#991b1b;padding:2px 6px;border-radius:4px;font-size:0.75rem;margin-right:8px;font-weight:700;'
                : (status === 'allowed'
                    ? 'background:#dcfce7;color:#166534;padding:2px 6px;border-radius:4px;font-size:0.75rem;margin-right:8px;'
                    : (status === 'prohibited'
                        ? 'background:#fee2e2;color:#991b1b;padding:2px 6px;border-radius:4px;font-size:0.75rem;margin-right:8px;'
                        : 'background:#fef3c7;color:#92400e;padding:2px 6px;border-radius:4px;font-size:0.75rem;margin-right:8px;'));

            const rowStyle = isBanned
                ? 'padding:10px; border-bottom:1px solid #fca5a5; background:#fef2f2; display:flex; justify-content:space-between; align-items:flex-start;'
                : 'padding:10px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center;';

            let warningHtml = '';
            if (isBanned) {
                warningHtml = `<div class="bag-warning" style="font-size:0.75rem; color:#dc2626; font-weight:700; margin-top:4px;">❌ ${label}</div>`;
            }

            content += `
                <li style="${rowStyle}">
                    <div>
                        <div class="bag-main-row" style="display:flex; align-items:center; gap:10px;">
                            <span style="${badgeStyle}">${badge} ${isBanned ? 'BAN' : label}</span>
                            <strong>${item.name}</strong>
                        </div>
                        ${warningHtml}
                    </div>
                    <button onclick="window.toggleBagItem(${item.id}); window.showMyBagModal();" style="color:red; border:none; background:none; cursor:pointer; flex-shrink:0;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </li>`;
        });

        content += '</ul><button onclick="window.clearAllBagItems();" style="width:100%; padding:10px; background:#ffebee; color:red; border:none; border-radius:5px; margin-top:10px; cursor:pointer;">Clear All Items</button>';
    }

    let modal = document.getElementById('bagModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'bagModal';
        modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:2000; display:flex; justify-content:center; align-items:center;';
        document.body.appendChild(modal);
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }
    modal.innerHTML = `<div style="background:white; padding:20px; border-radius:10px; max-width:90%; width:400px; max-height:80vh; overflow-y:auto;">${content}<button onclick="document.getElementById('bagModal').remove()" style="margin-top:15px; width:100%; padding:10px; background:#eee; border:none; border-radius:5px; cursor:pointer;">Close</button></div>`;
}

export function clearAllBagItems() {
    savedItems.clear();
    localStorage.setItem('myBag', '[]');
    updateBagCounter();
    showMyBagModal();
}

export function shareItemLink(id) {
    const item = ITEMS_DATA.find(i => i.id === id);
    if (!item) return;
    const slug = toSlug(item.name);
    const url = `${window.location.origin}/?item=${slug}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => alert("Link copied! 📋")).catch(() => prompt("Copy link:", url));
    } else {
        prompt("Copy link:", url);
    }
}

// ---------------------------------------------------------
// SEO FUNCTIONS - Enhanced JSON-LD Schema
// ---------------------------------------------------------
function injectSchema(item) {
    // Remove existing schemas
    document.querySelectorAll('[data-dynamic-schema]').forEach(el => el.remove());

    const cleanNote = item.note.replace(/[✅❌⚠️💡🚨📞]/g, '').trim();
    const slug = toSlug(item.name);
    const pageUrl = `https://www.canibringonplane.com/?item=${slug}`;

    // Get destination context
    const dest = window.currentDestination;
    const destCode = window.currentDestinationCode;
    const isDestBanned = destCode && item.customs_restricted?.includes(destCode);

    // Build status text
    const carryOnStatus = item.carryOn === 'allowed' ? 'Yes, allowed' :
                          item.carryOn === 'prohibited' ? 'No, prohibited' : 'Restricted';
    const checkedStatus = item.checked === 'allowed' ? 'Yes, allowed' :
                          item.checked === 'prohibited' ? 'No, prohibited' : 'Restricted';

    // Build destination-aware answer
    let answerText = `Carry-on: ${carryOnStatus}. Checked luggage: ${checkedStatus}. ${cleanNote}`;
    if (dest && isDestBanned) {
        answerText = `WARNING: ${item.name} is BANNED in ${dest.name}. Do not pack this item when traveling to ${dest.name}. ${answerText}`;
    } else if (dest) {
        answerText = `When traveling to ${dest.name}: ${answerText}`;
    }

    // 1. FAQPage Schema (Multiple Questions)
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": dest
                    ? `Can I bring ${item.name} on a plane to ${dest.name}?`
                    : `Can I bring ${item.name} on a plane?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": answerText
                }
            },
            {
                "@type": "Question",
                "name": `Is ${item.name} allowed in carry-on luggage?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${carryOnStatus}. ${item.carryOn === 'allowed'
                        ? `You can pack ${item.name} in your carry-on bag.`
                        : item.carryOn === 'prohibited'
                        ? `${item.name} is not allowed in the cabin. You must check it or leave it at home.`
                        : `${item.name} has restrictions. Check with your airline for specific rules.`}`
                }
            },
            {
                "@type": "Question",
                "name": `Can I put ${item.name} in checked baggage?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${checkedStatus}. ${item.checked === 'allowed'
                        ? `You can pack ${item.name} in your checked luggage.`
                        : item.checked === 'prohibited'
                        ? `${item.name} is prohibited in checked bags due to safety regulations.`
                        : `${item.name} may be allowed with certain conditions. Verify with your airline.`}`
                }
            }
        ]
    };

    // Add destination-specific FAQ if destination selected
    if (dest && isDestBanned) {
        faqSchema.mainEntity.push({
            "@type": "Question",
            "name": `Is ${item.name} legal in ${dest.name}?`,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": `No. ${item.name} is prohibited by ${dest.name} customs and border control. Attempting to bring this item may result in confiscation, fines, or legal penalties.`
            }
        });
    }

    // 2. BreadcrumbList Schema
    const category = Array.isArray(item.category) ? item.category[0] : item.category;
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.canibringonplane.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": category ? category.charAt(0).toUpperCase() + category.slice(1) : "Items",
                "item": `https://www.canibringonplane.com/?category=${category || 'all'}`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": item.name,
                "item": pageUrl
            }
        ]
    };

    // 3. WebPage Schema with ItemReviewed
    const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": dest
            ? `Can I bring ${item.name} to ${dest.name}? - Airport Security Rules`
            : `Can I bring ${item.name} on a plane? - Airport Security Rules`,
        "description": `Find out if ${item.name} is allowed in carry-on or checked luggage. ${cleanNote.substring(0, 150)}`,
        "url": pageUrl,
        "inLanguage": "en-US",
        "isPartOf": {
            "@type": "WebSite",
            "name": "Can I Bring On Plane",
            "url": "https://www.canibringonplane.com/"
        },
        "about": {
            "@type": "Thing",
            "name": item.name,
            "description": `Travel security information for ${item.name}`
        },
        "dateModified": new Date().toISOString().split('T')[0]
    };

    // 4. HowTo Schema (for restricted items)
    let howToSchema = null;
    if (item.carryOn === 'restricted' || item.checked === 'restricted') {
        howToSchema = {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": `How to pack ${item.name} for air travel`,
            "description": `Step-by-step guide for traveling with ${item.name}`,
            "step": [
                {
                    "@type": "HowToStep",
                    "name": "Check airline policy",
                    "text": `Contact your airline to confirm their specific policy for ${item.name}.`
                },
                {
                    "@type": "HowToStep",
                    "name": "Review TSA guidelines",
                    "text": `Verify current TSA rules as they may change. ${cleanNote.substring(0, 100)}`
                },
                {
                    "@type": "HowToStep",
                    "name": "Pack appropriately",
                    "text": item.carryOn === 'allowed'
                        ? `Place ${item.name} in your carry-on bag for easy screening.`
                        : `Pack ${item.name} in checked luggage if allowed, or consider alternatives.`
                }
            ]
        };
    }

    // Inject all schemas
    const schemas = [faqSchema, breadcrumbSchema, webPageSchema];
    if (howToSchema) schemas.push(howToSchema);

    schemas.forEach((schema, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-dynamic-schema', 'true');
        script.id = `dynamic-schema-${index}`;
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
    });
}

// Remove all dynamic schemas (call on modal close)
function removeSchemas() {
    document.querySelectorAll('[data-dynamic-schema]').forEach(el => el.remove());
}

// Inject schema for category pages (ItemList + CollectionPage)
function injectCategorySchema(category, items) {
    removeSchemas(); // Clear existing

    const displayName = category.charAt(0).toUpperCase() + category.slice(1);
    const pageUrl = `https://www.canibringonplane.com/?category=${category}`;
    const dest = window.currentDestination;

    // 1. CollectionPage Schema
    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": dest
            ? `${displayName} Allowed on Planes to ${dest.name}`
            : `${displayName} Allowed on Planes - TSA Rules`,
        "description": `Complete guide to ${category} items allowed in carry-on and checked luggage. ${items.length} items with TSA rules.`,
        "url": pageUrl,
        "inLanguage": "en-US",
        "isPartOf": {
            "@type": "WebSite",
            "name": "Can I Bring On Plane",
            "url": "https://www.canibringonplane.com/"
        },
        "numberOfItems": items.length
    };

    // 2. ItemList Schema (top 10 items for rich results)
    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": `${displayName} - Airport Security Rules`,
        "description": `List of ${category} items and their carry-on/checked status`,
        "numberOfItems": Math.min(items.length, 10),
        "itemListElement": items.slice(0, 10).map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "url": `https://www.canibringonplane.com/?item=${toSlug(item.name)}`,
            "description": `Carry-on: ${item.carryOn}. Checked: ${item.checked}.`
        }))
    };

    // 3. BreadcrumbList Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.canibringonplane.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": displayName,
                "item": pageUrl
            }
        ]
    };

    // 4. FAQPage for category (common questions)
    const categoryFAQs = {
        liquids: [
            { q: "What is the TSA 3-1-1 liquid rule?", a: "Liquids must be in containers of 3.4oz (100ml) or less, all fitting in one quart-sized clear bag." },
            { q: "Can I bring a water bottle through security?", a: "Empty water bottles are allowed. Full bottles must be emptied before the checkpoint." }
        ],
        electronics: [
            { q: "Do laptops need to be removed at security?", a: "Yes, laptops must be removed from bags and placed in a separate bin for X-ray screening." },
            { q: "Are power banks allowed on planes?", a: "Power banks under 100Wh are allowed in carry-on only. They are prohibited in checked bags." }
        ],
        medication: [
            { q: "Can I bring prescription medication on a plane?", a: "Yes, prescription medication is allowed in carry-on. Keep it in original containers with labels." },
            { q: "Is there a limit on liquid medication?", a: "Medically necessary liquids are exempt from the 3.4oz rule. Declare them at security." }
        ],
        food: [
            { q: "Can I bring food through airport security?", a: "Solid foods are generally allowed. Liquids, gels, and spreads must follow the 3-1-1 rule." },
            { q: "Can I bring snacks on the plane?", a: "Yes, most packaged snacks are allowed in carry-on luggage." }
        ],
        tools: [
            { q: "Are scissors allowed on planes?", a: "Scissors under 4 inches from the pivot point are allowed in carry-on." },
            { q: "Can I bring a screwdriver on a plane?", a: "Screwdrivers under 7 inches are allowed in carry-on. Larger tools must be checked." }
        ]
    };

    const faqs = categoryFAQs[category];
    let faqSchema = null;
    if (faqs && faqs.length > 0) {
        faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        };
    }

    // Inject all schemas
    const schemas = [collectionSchema, itemListSchema, breadcrumbSchema];
    if (faqSchema) schemas.push(faqSchema);

    schemas.forEach((schema, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-dynamic-schema', 'true');
        script.id = `dynamic-schema-cat-${index}`;
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
    });
}

// Inject schema for destination pages (TravelGuide + FAQPage)
function injectDestinationSchema(dest, code) {
    removeSchemas(); // Clear existing

    const pageUrl = `https://www.canibringonplane.com/?dest=${code}`;

    // 1. TravelGuide/Article Schema
    const travelGuideSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": `${dest.name} Travel Rules - What You Can and Cannot Bring`,
        "description": dest.intro,
        "url": pageUrl,
        "inLanguage": "en-US",
        "author": {
            "@type": "Organization",
            "name": "Can I Bring On Plane",
            "url": "https://www.canibringonplane.com/"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Can I Bring On Plane",
            "url": "https://www.canibringonplane.com/"
        },
        "dateModified": new Date().toISOString().split('T')[0],
        "about": {
            "@type": "Country",
            "name": dest.name
        }
    };

    // 2. FAQPage for destination
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `What items are banned in ${dest.name}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${dest.name} strictly prohibits: ${dest.banned.join(', ')}. Attempting to bring these items may result in confiscation, fines, or legal action.`
                }
            },
            {
                "@type": "Question",
                "name": `What are the duty-free limits for ${dest.name}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Duty-free limits for ${dest.name}: Alcohol - ${dest.dutyFree.alcohol}. Tobacco - ${dest.dutyFree.tobacco}. Exceeding these limits may incur customs duties.`
                }
            },
            {
                "@type": "Question",
                "name": `Is ${dest.name} strict about customs enforcement?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${dest.name} has a ${dest.risk} risk level for customs enforcement. ${dest.intro}`
                }
            }
        ]
    };

    // 3. BreadcrumbList Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.canibringonplane.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": `${dest.name} Travel Rules`,
                "item": pageUrl
            }
        ]
    };

    // Inject all schemas
    const schemas = [travelGuideSchema, faqSchema, breadcrumbSchema];

    schemas.forEach((schema, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-dynamic-schema', 'true');
        script.id = `dynamic-schema-dest-${index}`;
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
    });
}

function updateSocialMeta(item) {
    const title = `Can I bring ${item.name} on a plane? - Airport Checker`;
    const description = `Find out if ${item.name} is allowed in carry-on or checked luggage. ${item.note.replace(/[✅❌⚠️💡]/g, '').substring(0, 150)}...`;

    document.title = title;

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
    const slug = toSlug(item.name);
    setMeta('og:url', `https://www.canibringonplane.com/?item=${slug}`, true);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://www.canibringonplane.com/?item=${slug}`);
}

// ---------------------------------------------------------
// EVENT LISTENERS (Safe Version)
// ---------------------------------------------------------
export function initializeEventListeners() {
    // 1. Search Input (Safe Check)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            if (window.handleSearch) window.handleSearch(e.target.value);
        });
    }

    // 2. Modal Close Buttons (Safe Check)
    document.querySelectorAll('.close-modal, .modal-overlay').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target === el || e.target.classList.contains('close-modal')) {
                document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
            }
        });
    });

    // 3. REMOVED: Old Country Dropdown Listeners
    // We deleted the old 'countrySelect' listeners here because that HTML is gone.
    // This prevents the "Cannot read properties of null" error.
}
// ---------------------------------------------------------
// POPSTATE HANDLER
// ---------------------------------------------------------
export function setupPopstateHandler() {
    window.addEventListener('popstate', (event) => {
        if (event.state) {
            if (event.state.itemId) {
                const item = ITEMS_DATA.find(i => i.id === parseInt(event.state.itemId));
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
}

// ---------------------------------------------------------
// SHOW ITEM BY ID (Global Helper)
// ---------------------------------------------------------
export function showItemById(id) {
    const item = ITEMS_DATA.find(i => i.id === id);
    if (item) {
        const middlePanel = document.getElementById('middlePanel');
        const isMiddlePanelVisible = middlePanel && !middlePanel.classList.contains('hidden');
        displayItemResult(item, isMiddlePanelVisible);
    }
}

// ---------------------------------------------------------
// DESTINATION MODAL FUNCTIONS (Phase 2)
// ---------------------------------------------------------
export function openDestinationModal() {
    const modal = document.getElementById('destinationModal');
    const grid = document.getElementById('destGrid');

    if (!modal) return;

    // Dynamically populate countries from DESTINATIONS
    if (grid && grid.children.length === 0) {
        grid.innerHTML = Object.entries(DESTINATIONS).map(([code, dest]) => {
            // Determine risk class for visual accent
            const riskClass = dest.risk === 'Very High' ? 'dest-veryhigh' :
                              dest.risk === 'High' ? 'dest-high' : 'dest-medium';

            return `
                <div class="dest-card ${riskClass}"
                     onclick="window.selectDestination('${code}')"
                     style="border-left: 4px solid ${dest.theme.color};">
                    <span class="flag">${dest.flag}</span>
                    <span>${dest.name}</span>
                </div>
            `;
        }).join('');
    }

    modal.classList.remove('hidden');
}

export function selectDestination(code) {
    const dest = DESTINATIONS[code];
    if (dest) {
        // Update State - STORE THE CODE GLOBALLY
        localStorage.setItem('selectedDestination', code);
        window.currentDestination = dest;
        window.currentDestinationCode = code; // Store 'JP', 'TH', etc.

        // SEO: Dynamic Virtual Page Title & Meta (Aggressive for Google indexing)
        const year = new Date().getFullYear();
        document.title = `What Can I Bring to ${dest.name}? - Banned Items & Rules ${year}`;
        updateMetaTag('og:title', `${dest.name} Travel Rules ${year} - What's Banned? ${dest.flag}`);
        updateMetaTag('og:description', `Complete guide to ${dest.name} customs rules. Banned items: ${dest.banned.slice(0, 3).join(', ')}. Duty-free limits and more.`);
        updateMetaTag('twitter:title', `${dest.name} Travel Rules ${year} ${dest.flag}`);
        updateMetaTag('twitter:description', dest.intro);
        updateMetaTag('description', `${dest.name} travel rules ${year}: What items are banned? Duty-free limits, customs regulations, and TSA guidelines for flying to ${dest.name}.`);

        // Update URL without reload
        const url = new URL(window.location);
        url.searchParams.set('dest', code);
        window.history.pushState({ dest: code }, '', url);

        // Update UI
        renderDestinationReport(dest);
        document.getElementById('destinationModal').classList.add('hidden');

        // Update Button Text
        const btn = document.querySelector('.dest-btn span');
        if (btn) btn.innerText = dest.name;

        // Re-run checks if bag modal is open
        const bagModal = document.getElementById('bagModal');
        if (bagModal) showMyBagModal();

        // 📊 SEO: Inject Destination Schema
        injectDestinationSchema(dest, code);

        console.log('✈️ Destination selected:', dest.name, dest.flag);
    }
}

export function renderDestinationReport(dest) {
    const container = document.getElementById('destinationReport');
    const welcome = document.getElementById('welcomeMessage');
    const middlePanel = document.getElementById('middlePanel');
    const sticky = document.getElementById('stickyDestBar');

    if (!container) return;

    // FOCUS MODE: Hide other views
    if (welcome) welcome.classList.add('hidden');
    if (middlePanel) middlePanel.classList.add('hidden');
    if (sticky) sticky.classList.add('hidden'); // Hide sticky while in full report

    container.classList.remove('hidden');

    // Apply Dynamic Theme Border
    container.style.borderColor = dest.theme?.color || '#e2e8f0';

    container.innerHTML = `
        <div class="report-header" style="border-bottom-color: ${dest.theme?.border || '#e2e8f0'}">
            <h2 style="color: ${dest.theme?.color || '#1e293b'}">
                <span style="font-size:1.5rem">${dest.flag}</span> ${dest.name} Rules
            </h2>
            <div class="report-header-actions">
                <span class="risk-badge risk-${dest.risk.replace(/\s+/g, '')}">Risk: ${dest.risk}</span>
            </div>
        </div>
        <div class="report-body">
            <p style="margin-bottom:20px; color:#475569; font-size:0.95rem;">${dest.intro}</p>

            <div class="red-zone">
                <div class="zone-title"><i class="fa-solid fa-ban"></i> STRICTLY BANNED</div>
                <div class="banned-tags">
                    ${dest.banned.map(item => `<span class="ban-tag">${item}</span>`).join('')}
                </div>

                <div class="monetization-row">
                    <a href="https://safetywing.com/nomad-insurance/" target="_blank" class="aff-btn btn-insurance">
                        <i class="fa-solid fa-user-shield"></i> Don't risk fines. Get Travel Insurance.
                    </a>
                </div>
            </div>

            <div class="blue-zone">
                <div class="zone-title"><i class="fa-solid fa-gift"></i> DUTY FREE LIMITS</div>
                <div class="duty-grid">
                    <div class="duty-item">
                        <span class="duty-label"><i class="fa-solid fa-wine-bottle"></i> Alcohol</span>
                        <span class="duty-val">${dest.dutyFree.alcohol}</span>
                    </div>
                    <div class="duty-item">
                        <span class="duty-label"><i class="fa-solid fa-smoking"></i> Tobacco</span>
                        <span class="duty-val">${dest.dutyFree.tobacco}</span>
                    </div>
                </div>

                <div class="monetization-row">
                    <a href="https://www.airalo.com/" target="_blank" class="aff-btn btn-esim">
                        <i class="fa-solid fa-wifi"></i> Avoid roaming fees. Get ${dest.name} eSIM.
                    </a>
                </div>
            </div>

            <button onclick="window.minimizeDestinationReport()" class="btn-browse" style="background: ${dest.theme?.color || '#2563eb'}">
                <i class="fa-solid fa-magnifying-glass"></i> Browse Items for ${dest.name}
            </button>
        </div>
    `;

    // Scroll to report
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// NEW: Minimize to Sticky Bar (keeps destination active)
export function minimizeDestinationReport() {
    const container = document.getElementById('destinationReport');
    const welcome = document.getElementById('welcomeMessage');
    const sticky = document.getElementById('stickyDestBar');
    const dest = window.currentDestination;

    // Hide Report
    if (container) container.classList.add('hidden');

    // Show Welcome (default browse mode)
    if (welcome) welcome.classList.remove('hidden');

    // Show Sticky Bar with full themed border
    if (sticky && dest) {
        sticky.classList.remove('hidden');
        sticky.classList.add('themed');
        // Apply full colored border (left, right, bottom)
        sticky.style.borderColor = dest.theme?.color || '#2563eb';
        sticky.style.setProperty('--theme-bg', dest.theme?.bg || '#eff6ff');
        sticky.style.background = `linear-gradient(to right, ${dest.theme?.bg || '#eff6ff'}, white)`;
        document.getElementById('stickyFlag').innerText = dest.flag;
        document.getElementById('stickyText').innerHTML = `Mode: <strong>${dest.name}</strong>`;
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// LEGACY: Full close (clears destination entirely)
export function closeDestinationReport() {
    const container = document.getElementById('destinationReport');
    const welcome = document.getElementById('welcomeMessage');
    const sticky = document.getElementById('stickyDestBar');

    if (container) container.classList.add('hidden');
    if (welcome) welcome.classList.remove('hidden');
    if (sticky) sticky.classList.add('hidden');

    // Reset button text
    const btn = document.querySelector('.dest-btn span');
    if (btn) btn.innerText = 'Select Destination';

    window.currentDestination = null;
    window.currentDestinationCode = null;
}
// ---------------------------------------------------------
// HELPER ALIASES
// ---------------------------------------------------------
function openItemModal(id) {
    showItemById(id);
}

// ---------------------------------------------------------
// MODULE-LEVEL WINDOW BINDINGS (Backup for early access)
// Primary bindings are in DOMContentLoaded above
// ---------------------------------------------------------
window.displayCategoryResults = displayCategoryResults;
window.openDestinationModal = openDestinationModal;
window.selectDestination = selectDestination;
window.minimizeDestinationReport = minimizeDestinationReport;
window.closeDestinationReport = minimizeDestinationReport;
window.showMyBagModal = showMyBagModal;
window.toggleBagItem = toggleBagItem;
window.clearAllBagItems = clearAllBagItems;
window.openItemModal = openItemModal;
window.showItemById = showItemById;
window.resetToHome = resetToHome;
window.shareItemLink = shareItemLink;
window.hideAutocomplete = hideAutocomplete;
window.updateBagCounter = updateBagCounter;
window.handleSearch = handleSearch;
window.navManager = navManager;

console.log('🎨 UI module loaded');
// ---------------------------------------------------------
// HELPER: RENDER ITEM CARD (The Missing Paintbrush)
// ---------------------------------------------------------
function renderItemCard(item, container, destCode) {
    let bg = 'linear-gradient(to top, #f0fdf4 0%, #ffffff 100%)'; // Green default
    let border = '#86efac';
    let banner = '';

    const isBanned = destCode && item.customs_restricted?.includes(destCode);
    
    if (isBanned) {
        bg = 'linear-gradient(to top, #fef2f2 0%, #ffffff 100%)'; // Red
        border = '#ef4444';
        const cName = window.currentDestination ? window.currentDestination.name.toUpperCase() : 'THIS COUNTRY';
        banner = `<div style="background:#ef4444; color:white; font-size:0.6rem; padding:3px 8px; position:absolute; top:0; right:0; border-radius:0 0 0 6px; font-weight:bold;">⛔ BANNED IN ${cName}</div>`;
    } else if (item.carryOn === 'prohibited') {
        bg = 'linear-gradient(to top, #fff1f2, #fff)'; // Pink
        border = '#fda4af';
    }

    const div = document.createElement('div');
    div.className = 'category-card'; // Enables Animation
    div.onclick = () => window.openItemModal(item.id);
    div.style.cssText = `position:relative; background:${bg}; border:1px solid ${border}; border-radius:12px; padding:16px; margin-bottom:12px; cursor:pointer; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 4px rgba(0,0,0,0.02); animation: slideUp 0.3s ease-out forwards;`;
    
    div.innerHTML = `
        ${banner}
        <div><h3 style="margin:0; font-size:1rem; font-weight:700;">${item.name}</h3></div>
        <div style="font-size:0.75rem; font-weight:600;">${item.carryOn === 'allowed' ? '✅ Cabin' : '❌ Cabin'}</div>
    `;
    container.appendChild(div);
}
