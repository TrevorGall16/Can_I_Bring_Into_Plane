/**
 * SEARCH.JS - Search Index, Autocomplete, and Search Handlers
 * Extracted from ui.js
 */

import { ITEMS_DATA } from './data.js';
import { AppState } from './state.js';

function buildSearchIndex() {
    AppState.searchIndex.clear();
    ITEMS_DATA.forEach(item => {
        AppState.searchIndex.set(item.name.toLowerCase(), item);
        if (item.keywords) {
            item.keywords.forEach(kw => AppState.searchIndex.set(kw.toLowerCase(), item));
        }
    });
}

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

function hideAutocomplete() {
    document.getElementById('autocompleteResults').classList.add('hidden');
}

function displayAutocomplete(matches) {
    const autocompleteResults = document.getElementById('autocompleteResults');
    autocompleteResults.innerHTML = matches.map(item => `
        <div class="autocomplete-item" data-action="show-item" data-id="${item.id}">
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

export { buildSearchIndex, searchItems, findBestMatch, findItemVariants, handleSearch, displayAutocomplete, hideAutocomplete };
