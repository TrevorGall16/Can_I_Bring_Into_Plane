/**
 * ADS.JS - Airport Carry-On Checker
 * Contains: AdProvider class for Adsterra integration
 *
 * ES6 Module - Use: import { adProvider } from './ads.js'
 */

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

    /**
     * CRITICAL: Flash/New Div Ad Refresh Logic
     * 1. Clear the existing ad slot innerHTML
     * 2. Create a fresh container div
     * 3. Add visual placeholder (for debugging)
     * 4. Flash effect for visual confirmation
     */
   refreshInlineAd() {
        const slotId = 'ad-inline-slot';
        const slot = document.getElementById(slotId);
        
        if (!slot) return;

        console.log("💰 Monetization: Refreshing Ad Slot...");

        // 1. CLEAR existing ad
        slot.innerHTML = '';

        // 2. CREATE new wrapper
        const newContainer = document.createElement('div');
        newContainer.style.textAlign = 'center';
        
        // 3. CREATE the Ad Iframe (Adsterra)
        const iframe = document.createElement('iframe');
        iframe.style.width = '300px';
        iframe.style.height = '250px';
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';
        iframe.scrolling = 'no';
        
        newContainer.appendChild(iframe);
        slot.appendChild(newContainer);

        // 4. WRITE the Ad Script into the Iframe
        try {
            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(`
                <script type="text/javascript">
                    atOptions = { 'key' : '1cdec3e45ca4d17202a0a9d38b08a542', 'format' : 'iframe', 'height' : 250, 'width' : 300, 'params' : {} };
                <\/script>
                <script type="text/javascript" src="//www.highperformanceformat.com/1cdec3e45ca4d17202a0a9d38b08a542/invoke.js"><\/script>
                <style>body{margin:0;padding:0;}</style>
            `);
            doc.close();
        } catch (e) {
            console.warn('Ad refresh error:', e);
        }
    }

    checkAdBlock() {
        setTimeout(() => {
            const adSlots = [
                document.getElementById('ad-inline-slot'),
                document.getElementById('ad-welcome-slot')
            ];
            adSlots.forEach(slot => {
                if (!slot) return;
                const isBlocked = slot.clientHeight === 0 ||
                    slot.innerHTML.trim() === '' ||
                    window.getComputedStyle(slot).display === 'none';

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

// Create singleton instance
export const adProvider = new AdProvider();

console.log('📺 Ads module loaded');
