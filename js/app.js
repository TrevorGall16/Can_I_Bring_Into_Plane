/**
 * APP.JS - Entry Point
 * Delegated events, initialization, event bus wiring.
 */

import { ITEMS_DATA } from './data.js';
import { countryRules } from './config.js';
import { DESTINATIONS } from './destinations.js';
import { AppState, toSlug } from './state.js';
import { adProxy, onAdsReady } from './ad-proxy.js';
import { navManager, resetToHome } from './router.js';
import { buildSearchIndex, handleSearch, hideAutocomplete } from './search.js';
import {
    displayItemResult,
    displayCategoryResults,
    showCountryRules,
    showItemById,
    sortCategoryChips
} from './display.js';
import {
    toggleBagItem,
    updateBagCounter,
    showMyBagModal,
    clearAllBagItems,
    shareItemLink,
    openDestinationModal,
    selectDestination,
    minimizeDestinationReport
} from './modals.js';

// --- Event Bus -> Ad Proxy Wiring ---
AppState.on('item:displayed', () => adProxy.refreshInlineAd());
AppState.on('country:displayed', () => adProxy.refreshInlineAd());

// --- Delegated Click Handler ---
const ACTION_MAP = {
    'show-item': (el) => {
        showItemById(parseInt(el.dataset.id));
        hideAutocomplete();
    },
    'show-item-by-name': (el) => {
        const itemName = el.dataset.item;
        if (itemName) {
            const item = ITEMS_DATA.find(i => i.name.toLowerCase().includes(itemName.toLowerCase()));
            if (item) showItemById(item.id);
        }
    },
    'toggle-bag': (el) => toggleBagItem(parseInt(el.dataset.id)),
    'toggle-bag-refresh': (el) => {
        toggleBagItem(parseInt(el.dataset.id));
        showMyBagModal();
    },
    'share-item': (el) => shareItemLink(parseInt(el.dataset.id)),
    'show-bag': () => showMyBagModal(),
    'clear-bag': () => clearAllBagItems(),
    'reset-home': (el, e) => {
        e.preventDefault();
        resetToHome();
    },
    'show-category': (el) => displayCategoryResults(el.dataset.category),
    'open-destination': () => openDestinationModal(),
    'select-destination': (el) => selectDestination(el.dataset.code),
    'minimize-destination': () => minimizeDestinationReport(),
    'close-modal': (el) => {
        const overlay = el.closest('.modal-overlay');
        if (overlay) overlay.classList.add('hidden');
    },
    'remove-bag-modal': () => document.getElementById('bagModal')?.remove()
};

document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;
    const handler = ACTION_MAP[action];
    if (handler) handler(el, e);
});

// Close autocomplete on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) hideAutocomplete();
});

// --- loadFromURL (inline to avoid circular deps) ---
function loadFromURL() {
    try {
        const url = new URL(window.location);
        const destCode = url.searchParams.get('dest');
        const itemParam = url.searchParams.get('item');
        const category = url.searchParams.get('category');
        const rulesParam = url.searchParams.get('rules');

        if (destCode && DESTINATIONS[destCode]) {
            const hasContentParams = Boolean(itemParam || category);
            selectDestination(destCode, { pushHistory: false, showReport: !hasContentParams });
        }

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
                AppState.currentCountry = countryName;
                const selector = document.getElementById('countrySelector');
                if (selector) selector.value = countryName;
                showCountryRules(countryName);
                return true;
            }
        } else if (destCode && DESTINATIONS[destCode]) {
            return true;
        }
    } catch (e) { }

    if (window.innerWidth >= 1024) {
        resetToHome();
    }
    return false;
}

// --- Popstate Handler ---
function setupPopstateHandler() {
    window.addEventListener('popstate', (event) => {
        if (event.state) {
            if (event.state.itemId) {
                const item = ITEMS_DATA.find(i => i.id === parseInt(event.state.itemId));
                if (item) displayItemResult(item, false, true);
            } else if (event.state.category) {
                displayCategoryResults(event.state.category, true);
            } else if (event.state.dest) {
                selectDestination(event.state.dest, { pushHistory: false, showReport: true });
            } else if (event.state.home) {
                resetToHome();
            }
        } else {
            resetToHome();
        }
    });
}

// --- DOMContentLoaded Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Build search index
    buildSearchIndex();

    // 2. Setup history/navigation
    setupPopstateHandler();

    // 3. Update bag counter
    updateBagCounter();

    // 4. SEO: Canonical URL
    const url = new URL(window.location);
    const hasVirtualParams = ['item', 'category', 'dest', 'rules']
        .some(param => url.searchParams.get(param));

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }

    canonical.setAttribute(
        'href',
        hasVirtualParams
            ? `${window.location.origin}${window.location.pathname}${window.location.search}`
            : 'https://www.canibringonplane.com/'
    );

    // 5. Load from URL (Deep Links)
    loadFromURL();

    // 6. Search input listener
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

    // 7. Sort category chips A-Z
    sortCategoryChips();

    // 8. Initialize ads (crash-proof)
    onAdsReady(() => {
        adProxy.initStickyFooter();
        adProxy.initWelcomeAd();
        adProxy.checkAdBlock();
    });

    // 9. Load saved destination
    const savedDest = localStorage.getItem('selectedDestination');
    if (savedDest && DESTINATIONS[savedDest]) {
        AppState.currentDestination = DESTINATIONS[savedDest];
        AppState.currentDestinationCode = savedDest;
        const btn = document.querySelector('.dest-btn span');
        if (btn) btn.innerText = DESTINATIONS[savedDest].name;
    }
});
