/**
 * STATE.JS - Centralized Application State & Event Bus
 * Leaf node: imports nothing. Used by all other modules.
 */

// --- Event Bus ---
const listeners = {};

function on(event, cb) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(cb);
}

function off(event, cb) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter(fn => fn !== cb);
}

function emit(event, data) {
    if (!listeners[event]) return;
    listeners[event].forEach(fn => {
        try { fn(data); } catch (e) { console.error(`Event "${event}" handler error:`, e); }
    });
}

// --- Shared Mutable State ---
const AppState = {
    currentCountry: 'USA',
    currentCategory: null,
    savedItems: new Set(),
    currentDestination: null,
    currentDestinationCode: null,
    searchIndex: new Map(),
    autocompleteTimeout: null,
    on,
    off,
    emit
};

// Load saved items from localStorage
if (localStorage.getItem('myBag')) {
    try {
        const savedIds = JSON.parse(localStorage.getItem('myBag'));
        savedIds.forEach(id => AppState.savedItems.add(id));
    } catch (e) {
        console.error('Error loading bag:', e);
    }
}

// --- Utility ---
function toSlug(text) {
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

export { AppState, toSlug };
