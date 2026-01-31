/**
 * APP.JS - Airport Carry-On Checker
 * Main Entry Point - Initializes all modules
 *
 * ES6 Module Architecture:
 * - data.js: ITEMS_DATA array
 * - config.js: AFFILIATE_MAP, countryRules, countrySources
 * - ads.js: AdProvider class
 * - ui.js: NavigationManager, display functions, modals
 * - app.js: Main entry point (this file)
 */

import { ITEMS_DATA } from './data.js';
import { AFFILIATE_MAP, countryRules, countrySources } from './config.js';
import { adProvider } from './ads.js';
import {
    navManager,
    buildSearchIndex,
    initializeEventListeners,
    setupPopstateHandler,
    updateBagCounter,
    resetToHome,
    hideAutocomplete,
    toggleBagItem,
    showMyBagModal,
    shareItemLink,
    showItemById,
    clearAllBagItems
} from './ui.js';

// ---------------------------------------------------------
// GLOBAL EXPORTS (for onclick handlers in HTML)
// ---------------------------------------------------------
window.showItemById = showItemById;
window.toggleBagItem = toggleBagItem;
window.shareItemLink = shareItemLink;
window.showMyBagModal = showMyBagModal;
window.updateBagCounter = updateBagCounter;
window.hideAutocomplete = hideAutocomplete;
window.resetToHome = resetToHome;
window.clearAllBagItems = clearAllBagItems;

// ---------------------------------------------------------
// INITIALIZE ON DOM READY
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Airport Carry-On Checker...');

    // Build fast search index
    buildSearchIndex();

    // Setup event listeners
    initializeEventListeners();
    setupPopstateHandler();

    // Update bag counter
    updateBagCounter();

    // SEO: Ensure canonical exists on page load
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

    // Load initial state from URL
    navManager.loadFromURL();

    // Initialize ads
    adProvider.initStickyFooter();
    adProvider.initWelcomeAd();
    adProvider.checkAdBlock();

    console.log('✅ App initialized successfully');
    console.log(`📦 ${ITEMS_DATA.length} items loaded`);
});

console.log('🎯 App module loaded - ES6 Modular Architecture');
