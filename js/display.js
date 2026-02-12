/**
 * DISPLAY.JS - Item/Category Rendering, Formatting, Cards
 * Extracted from ui.js
 */

import { ITEMS_DATA } from './data.js';
import { AFFILIATE_MAP, countryRules, countrySources } from './config.js';
import { AppState, toSlug } from './state.js';
import { navManager } from './router.js';
import { updateSocialMeta, injectSchema, injectCategorySchema, updatePageSEO, removeSchemas } from './seo.js';
import { findItemVariants } from './search.js';
import { adProxy } from './ad-proxy.js';

// --- Helpers ---

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

function sortCategoryChips() {
    const container = document.querySelector('.category-strip-inner');
    if (!container) return;

    const chips = Array.from(container.querySelectorAll('.category-chip'));
    if (chips.length === 0) return;

    chips.sort((a, b) => {
        const textA = a.textContent.trim().toLowerCase();
        const textB = b.textContent.trim().toLowerCase();
        return textA.localeCompare(textB);
    });

    chips.forEach(chip => container.appendChild(chip));
}

// --- Display Item Result ---

function displayItemResult(item, keepMiddlePanel = false, skipHistoryPush = false) {
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
        const isCustomsBanned = restrictedCountries.includes(AppState.currentCountry);
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
                    <strong>BORDER CONTROL WARNING:</strong> ${item.name} is strictly <strong>PROHIBITED</strong> from entering ${AppState.currentCountry}.
                </div>
            </div>`;
    }

    const cat = Array.isArray(item.category) ? item.category[0] : item.category;
    let affiliates = AFFILIATE_MAP[cat] || AFFILIATE_MAP['default'];
    if (!affiliates) affiliates = AFFILIATE_MAP['default'];

    const isSaved = AppState.savedItems.has(item.id);
    const bagBtnText = isSaved ? '✅ On Checklist' : '➕ Add to Checklist';
    const bagBtnClass = isSaved ? 'action-btn saved' : 'action-btn';
    const sourceData = countrySources[AppState.currentCountry] || countrySources['International'];
    const richContext = getCategoryContext(item.category, item.name);

    resultCard.innerHTML = `
        <button class="close-btn" id="closeResult">&times;</button>
        <h2 class="item-name">
            ${item.name}
            <button class="share-icon" data-action="share-item" data-id="${item.id}" title="Copy Link" style="background:none;border:none;cursor:pointer;font-size:1rem;">🔗</button>
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
            <button class="${bagBtnClass} add-to-bag-btn" data-action="toggle-bag" data-id="${item.id}" style="width:100%; justify-content:center;">
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

        removeSchemas();

        const midPanel = document.getElementById('middlePanel');
        if (midPanel && !midPanel.classList.contains('hidden')) {
            // Stay on category view
        } else {
            // Import resetToHome dynamically to avoid circular dep
            import('./router.js').then(m => m.resetToHome());
        }
    });

    displayRelatedItems(item);
    AppState.emit('item:displayed', { item });

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
           data-action="show-item"
           data-id="${i.id}"
           style="text-decoration: none; color: inherit;">
           ${i.name}
        </a>
    `).join('') +
        '</div>';

    relatedItemsDiv.innerHTML = html;
}

// --- Contextual Ads Map ---

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

// --- Display Category Results ---

function displayCategoryResults(category, skipHistoryPush = false) {
    if (!skipHistoryPush) navManager.pushCategoryState(category);

    const displayTitle = category.charAt(0).toUpperCase() + category.slice(1);
    const dest = AppState.currentDestination;
    const destCode = AppState.currentDestinationCode;
    const year = new Date().getFullYear();

    let pageTitle, queryParam;
    if (dest) {
        pageTitle = `Can I bring ${displayTitle} to ${dest.name}? - Rules ${year}`;
        queryParam = `?category=${category}&dest=${destCode}`;
    } else {
        pageTitle = `${displayTitle} on a Plane - TSA Carry-On Rules ${year}`;
        queryParam = `?category=${category}`;
    }

    updatePageSEO(pageTitle, queryParam);

    const elementsToHide = [
        'welcomeMessage', 'quickGuide', 'popularSearches',
        'travelMustHaves', 'securityGuide', 'howItWorks',
        'resultCard', 'resultAd', 'destinationReport', 'homeContent'
    ];
    elementsToHide.forEach(id => document.getElementById(id)?.classList.add('hidden'));

    const midPanel = document.getElementById('middlePanel');
    if (midPanel) midPanel.classList.remove('hidden');
    window.scrollTo(0, 0);

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

    const items = ITEMS_DATA.filter(i => i.category && i.category.includes(category));

    const titleEl = document.getElementById('categoryTitle');
    const countEl = document.getElementById('categoryCount');
    if (titleEl) titleEl.textContent = category.toUpperCase();
    if (countEl) countEl.textContent = `${items.length} items`;

    items.sort((a, b) => {
        const getScore = (item) => {
            if (destCode && item.customs_restricted?.includes(destCode)) return 0;
            if (item.carryOn === 'allowed' && item.checked === 'allowed') return 3;
            if (item.carryOn === 'prohibited' && item.checked === 'prohibited') return 1;
            return 2;
        };
        return getScore(b) - getScore(a);
    });

    injectCategorySchema(category, items);

    const list = document.getElementById('categoryItemsList');
    if (!list) return;
    list.innerHTML = '';

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

    items.forEach((item, index) => renderItemCard(item, list, destCode, index));

    AppState.emit('category:displayed', { category });
}

// --- Show Country Rules ---

function showCountryRules(country) {
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

    AppState.emit('country:displayed', { country });
}

// --- Show Item By ID ---

function showItemById(id) {
    const item = ITEMS_DATA.find(i => i.id === id);
    if (item) {
        const middlePanel = document.getElementById('middlePanel');
        const isMiddlePanelVisible = middlePanel && !middlePanel.classList.contains('hidden');
        displayItemResult(item, isMiddlePanelVisible);
    }
}

// --- Render Item Card ---

function renderItemCard(item, container, destCode, index = 0) {
    let bg = 'linear-gradient(to top, #f0fdf4 0%, #ffffff 100%)';
    let border = '#86efac';
    let banner = '';

    const isBanned = destCode && item.customs_restricted?.includes(destCode);

    if (isBanned) {
        bg = 'linear-gradient(to top, #fef2f2 0%, #ffffff 100%)';
        border = '#ef4444';
        const cName = AppState.currentDestination ? AppState.currentDestination.name.toUpperCase() : 'THIS COUNTRY';
        banner = `<div style="background:#ef4444; color:white; font-size:0.6rem; padding:3px 8px; position:absolute; top:0; right:0; border-radius:0 0 0 6px; font-weight:bold;">⛔ BANNED IN ${cName}</div>`;
    } else if (item.carryOn === 'prohibited') {
        bg = 'linear-gradient(to top, #fff1f2, #fff)';
        border = '#fda4af';
    }

    const div = document.createElement('div');
    div.className = 'category-card';
    div.setAttribute('data-action', 'show-item');
    div.setAttribute('data-id', item.id);
    div.style.cssText = `position:relative; background:${bg}; border:1px solid ${border}; border-radius:12px; padding:16px; margin-bottom:12px; cursor:pointer; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 4px rgba(0,0,0,0.02); animation: slideUp 0.3s ease-out forwards;`;

    div.innerHTML = `
        ${banner}
        <div style="display:flex; align-items:center; gap:10px;">
            <div style="font-size:1.5rem;">${item.icon || '✈️'}</div>
            <div>
                <h3 style="margin:0; font-size:1rem; font-weight:700; color:#1e293b;">${item.name}</h3>
                <div style="font-size:0.75rem; color:#64748b;">${item.category[0].toUpperCase()}</div>
            </div>
        </div>
        <div style="text-align:right;">
            <div style="font-size:0.75rem; font-weight:600; color:${item.carryOn === 'allowed' ? '#166534' : '#991b1b'}">
                ${item.carryOn === 'allowed' ? '✅ Cabin' : '❌ Cabin'}
            </div>
        </div>
    `;
    container.appendChild(div);

    // Native ad injection every 5th item
    if ((index + 1) % 5 === 0) {
        const adSlot = document.createElement('div');
        adSlot.className = 'native-ad-container';
        const adType = item.category.includes('liquids') ? 'liquids' :
                       item.category.includes('electronics') ? 'electronics' : 'generic';
        adProxy.renderFallback(adSlot, adType);
        container.appendChild(adSlot);
    }
}

export {
    toggleMobileView,
    formatStatus,
    formatNoteToBulletPoints,
    addBoldToKeywords,
    getCategoryContext,
    displayItemResult,
    displayRelatedItems,
    CONTEXTUAL_ADS,
    getContextualAd,
    displayCategoryResults,
    showCountryRules,
    showItemById,
    renderItemCard,
    sortCategoryChips
};
