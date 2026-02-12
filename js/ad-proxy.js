/**
 * AD-PROXY.JS - Crash-Proof Ad Loader
 * Provides a Proxy that swallows errors if ads.js fails to load.
 */

const real = {};
let ready = false;
const readyCallbacks = [];

const adProxy = new Proxy(real, {
    get(target, prop) {
        if (prop in target) return target[prop];
        return () => {};
    }
});

// Lazy-load ads.js — swallow errors on failure
import('./ads.js').then(m => {
    const provider = m.adProvider;
    for (const key of Object.keys(provider)) {
        if (typeof provider[key] === 'function') {
            real[key] = provider[key].bind(provider);
        } else {
            real[key] = provider[key];
        }
    }
    ready = true;
    readyCallbacks.forEach(cb => { try { cb(); } catch (e) {} });
    readyCallbacks.length = 0;
}).catch(err => {
    console.warn('Ads module failed to load:', err);
});

function onAdsReady(cb) {
    if (ready) { try { cb(); } catch (e) {} }
    else readyCallbacks.push(cb);
}

export { adProxy, onAdsReady };
