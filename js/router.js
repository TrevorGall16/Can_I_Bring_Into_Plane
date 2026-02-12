/**
 * ROUTER.JS - Navigation Manager & Reset to Home
 * Extracted from ui.js
 */

import { AppState, toSlug } from './state.js';
import { removeSchemas } from './seo.js';

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
}

const navManager = new NavigationManager();

function resetToHome() {
    document.getElementById('middlePanel')?.classList.add('hidden');
    document.getElementById('resultCard')?.classList.add('hidden');
    document.getElementById('categoryResults')?.classList.add('hidden');
    document.getElementById('countryRulesSection')?.classList.add('hidden');
    document.getElementById('resultAd')?.classList.add('hidden');

    AppState.currentCategory = null;

    // Show welcome content
    const welcomeContent = document.getElementById('welcomeMessage');
    welcomeContent?.classList.remove('hidden');

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

    removeSchemas();

    try {
        const url = new URL(window.location);
        url.searchParams.delete('item');
        url.searchParams.delete('category');
        window.history.pushState({ home: true }, '', url);
    } catch (e) { }

    AppState.emit('home:reset');
}

export { NavigationManager, navManager, resetToHome };
