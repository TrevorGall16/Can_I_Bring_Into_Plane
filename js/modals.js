/**
 * MODALS.JS - Bag/Checklist Modal & Destination Modal/Report
 * Extracted from ui.js
 */

import { ITEMS_DATA } from './data.js';
import { DESTINATIONS } from './destinations.js';
import { AppState, toSlug } from './state.js';
import { displayItemResult } from './display.js';
import { updateMetaTag, injectDestinationSchema } from './seo.js';

// --- Bag/Checklist Functions ---

function toggleBagItem(id) {
    if (AppState.savedItems.has(id)) AppState.savedItems.delete(id);
    else AppState.savedItems.add(id);
    localStorage.setItem('myBag', JSON.stringify([...AppState.savedItems]));
    updateBagCounter();

    const item = ITEMS_DATA.find(i => i.id === id);
    const resultCard = document.getElementById('resultCard');
    if (item && resultCard && !resultCard.classList.contains('hidden')) {
        const midPanel = document.getElementById('middlePanel');
        const keepMiddlePanel = midPanel && !midPanel.classList.contains('hidden');
        displayItemResult(item, keepMiddlePanel, true);
    }
}

function updateBagCounter() {
    document.getElementById('bagCounter').textContent = AppState.savedItems.size;
}

function showMyBagModal() {
    const bagList = Array.from(AppState.savedItems).map(id => ITEMS_DATA.find(i => i.id === id)).filter(i => i);

    const getItemStatus = (item) => {
        if (AppState.currentDestinationCode && item.customs_restricted) {
            if (item.customs_restricted.includes(AppState.currentDestinationCode)) {
                return { status: 'banned', badge: '⛔', label: `BANNED IN ${AppState.currentDestination.name.toUpperCase()}` };
            }
        }
        if (item.carryOn === 'allowed') return { status: 'allowed', badge: '✅', label: 'OK' };
        if (item.carryOn === 'prohibited') return { status: 'prohibited', badge: '❌', label: 'NO' };
        return { status: 'restricted', badge: '⚠️', label: 'CHECK' };
    };

    let allowedCount = 0, restrictedCount = 0, prohibitedCount = 0, bannedCount = 0;
    bagList.forEach(item => {
        const { status } = getItemStatus(item);
        if (status === 'banned') bannedCount++;
        else if (status === 'allowed') allowedCount++;
        else if (status === 'restricted') restrictedCount++;
        else prohibitedCount++;
    });

    let complianceHeader = '';
    if (AppState.currentDestination) {
        complianceHeader = `
            <div class="compliance-header">
                Checking rules for: <strong>${AppState.currentDestination.flag} ${AppState.currentDestination.name}</strong>
            </div>`;
    }

    let content = `
        <h2 style="margin:0 0 15px 0; font-size:1.25rem;">
            <i class="fa-solid fa-clipboard-check"></i> Pre-Flight Compliance
        </h2>
        ${complianceHeader}
    `;

    if (AppState.savedItems.size === 0) {
        content += `
            <div class="empty-bag-state" style="text-align:center; padding:30px 0;">
                <i class="fa-solid fa-clipboard-list" style="font-size:3rem; color:#cbd5e1; margin-bottom:15px;"></i>
                <p>Your checklist is empty.</p>
                <p style="font-size:0.9rem; color:#64748b;">Add items to verify compliance.</p>
            </div>`;
    } else {
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
                    <button data-action="toggle-bag-refresh" data-id="${item.id}" style="color:red; border:none; background:none; cursor:pointer; flex-shrink:0;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </li>`;
        });

        content += `</ul><button data-action="clear-bag" style="width:100%; padding:10px; background:#ffebee; color:red; border:none; border-radius:5px; margin-top:10px; cursor:pointer;">Clear All Items</button>`;
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
    modal.innerHTML = `<div style="background:white; padding:20px; border-radius:10px; max-width:90%; width:400px; max-height:80vh; overflow-y:auto;">${content}<button data-action="remove-bag-modal" style="margin-top:15px; width:100%; padding:10px; background:#eee; border:none; border-radius:5px; cursor:pointer;">Close</button></div>`;
}

function clearAllBagItems() {
    AppState.savedItems.clear();
    localStorage.setItem('myBag', '[]');
    updateBagCounter();
    showMyBagModal();
}

function shareItemLink(id) {
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

// --- Destination Functions ---

function openDestinationModal() {
    const modal = document.getElementById('destinationModal');
    const grid = document.getElementById('destGrid');

    if (!modal) return;

    if (grid && grid.children.length === 0) {
        grid.innerHTML = Object.entries(DESTINATIONS).map(([code, dest]) => {
            const riskClass = dest.risk === 'Very High' ? 'dest-veryhigh' :
                              dest.risk === 'High' ? 'dest-high' : 'dest-medium';

            return `
                <div class="dest-card ${riskClass}"
                     data-action="select-destination"
                     data-code="${code}"
                     style="border-left: 4px solid ${dest.theme.color}; cursor:pointer;">
                    <span class="flag">${dest.flag}</span>
                    <span>${dest.name}</span>
                </div>
            `;
        }).join('');
    }

    modal.classList.remove('hidden');
}

function selectDestination(code, options = {}) {
    const {
        pushHistory = true,
        showReport = true
    } = options;

    const dest = DESTINATIONS[code];
    if (dest) {
        localStorage.setItem('selectedDestination', code);
        AppState.currentDestination = dest;
        AppState.currentDestinationCode = code;

        const year = new Date().getFullYear();
        document.title = `What Can I Bring to ${dest.name}? - Banned Items & Rules ${year}`;
        updateMetaTag('og:title', `${dest.name} Travel Rules ${year} - What's Banned? ${dest.flag}`);
        updateMetaTag('og:description', `Complete guide to ${dest.name} customs rules. Banned items: ${dest.banned.slice(0, 3).join(', ')}. Duty-free limits and more.`);
        updateMetaTag('twitter:title', `${dest.name} Travel Rules ${year} ${dest.flag}`);
        updateMetaTag('twitter:description', dest.intro);
        updateMetaTag('description', `${dest.name} travel rules ${year}: What items are banned? Duty-free limits, customs regulations, and TSA guidelines for flying to ${dest.name}.`);

        if (pushHistory) {
            const url = new URL(window.location);
            url.searchParams.set('dest', code);
            window.history.pushState({ dest: code }, '', url);
        }

        if (showReport) {
            renderDestinationReport(dest);
        }
        document.getElementById('destinationModal')?.classList.add('hidden');

        const btn = document.querySelector('.dest-btn span');
        if (btn) btn.innerText = dest.name;

        const bagModal = document.getElementById('bagModal');
        if (bagModal) showMyBagModal();

        injectDestinationSchema(dest, code);

        AppState.emit('destination:selected', { dest, code });
    }
}

function renderDestinationReport(dest) {
    const container = document.getElementById('destinationReport');
    const welcome = document.getElementById('welcomeMessage');
    const middlePanel = document.getElementById('middlePanel');
    const sticky = document.getElementById('stickyDestBar');

    if (!container) return;

    if (welcome) welcome.classList.add('hidden');
    if (middlePanel) middlePanel.classList.add('hidden');
    if (sticky) sticky.classList.add('hidden');

    container.classList.remove('hidden');

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

            <button data-action="minimize-destination" class="btn-browse" style="background: ${dest.theme?.color || '#2563eb'}">
                <i class="fa-solid fa-magnifying-glass"></i> Browse Items for ${dest.name}
            </button>
        </div>
    `;

    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function minimizeDestinationReport() {
    const container = document.getElementById('destinationReport');
    const welcome = document.getElementById('welcomeMessage');
    const sticky = document.getElementById('stickyDestBar');
    const dest = AppState.currentDestination;

    if (container) container.classList.add('hidden');
    if (welcome) welcome.classList.remove('hidden');

    if (sticky && dest) {
        sticky.classList.remove('hidden');
        sticky.classList.add('themed');
        sticky.style.borderColor = dest.theme?.color || '#2563eb';
        sticky.style.setProperty('--theme-bg', dest.theme?.bg || '#eff6ff');
        sticky.style.background = `linear-gradient(to right, ${dest.theme?.bg || '#eff6ff'}, white)`;
        document.getElementById('stickyFlag').innerText = dest.flag;
        document.getElementById('stickyText').innerHTML = `Mode: <strong>${dest.name}</strong>`;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeDestinationReport() {
    const container = document.getElementById('destinationReport');
    const welcome = document.getElementById('welcomeMessage');
    const sticky = document.getElementById('stickyDestBar');

    if (container) container.classList.add('hidden');
    if (welcome) welcome.classList.remove('hidden');
    if (sticky) sticky.classList.add('hidden');

    const btn = document.querySelector('.dest-btn span');
    if (btn) btn.innerText = 'Select Destination';

    AppState.currentDestination = null;
    AppState.currentDestinationCode = null;
}

export {
    toggleBagItem,
    updateBagCounter,
    showMyBagModal,
    clearAllBagItems,
    shareItemLink,
    openDestinationModal,
    selectDestination,
    renderDestinationReport,
    minimizeDestinationReport,
    closeDestinationReport
};
