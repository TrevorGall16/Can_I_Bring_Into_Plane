/**
 * ADS.JS - Airport Carry-On Checker (Hybrid Monetization)
 * Integrates Adsterra (High CPM) + Amazon Native Fallbacks (AdBlock Proof)
 */

export const adProvider = {
    // 1. YOUR CONFIGURATION
    config: {
        adsterraKey: '1eb6f5f58fd51d48c864a2232bd79e77', // Your Real Key
        amazonTag: 'canibringonpl-20', // Your Amazon Tag
    },

    // 2. THE FALLBACK ADS (Load these if AdBlock is detected)
    fallbacks: {
        generic: {
            title: "Travel Smart",
            text: "Don't get your gear confiscated. Check TSA-approved lists.",
            btn: "Shop Travel Gear",
            icon: "✈️",
            color: "#eff6ff",
            query: "travel accessories"
        },
        liquids: {
            title: "Liquid Rules",
            text: "Bring your favorite shampoo. Get 100ml leak-proof bottles.",
            btn: "View Bottles",
            icon: "🧴",
            color: "#f0fdf4",
            query: "tsa approved travel bottles"
        },
        electronics: {
            title: "Stay Charged",
            text: "The only power banks allowed in carry-on bags.",
            btn: "Check Chargers",
            icon: "🔋",
            color: "#fff7ed",
            query: "power bank for airplane"
        }
    },

    // 3. INITIALIZATION (Called by ui.js)
    initStickyFooter: function() {
        const footer = document.getElementById('stickyFooterAd');
        // If your HTML doesn't have a footer div yet, this prevents errors
        if (!footer) return; 

        // Attempt to load Adsterra
        this.injectAdsterra(footer, '728', '90');

        // Check back in 2 seconds. If empty = AdBlock blocked it.
        setTimeout(() => {
            if (footer.clientHeight < 10 || footer.innerHTML.trim() === "") {
                console.log("🚫 AdBlock detected. Swapping to Native Fallback.");
                this.renderFallback(footer, 'generic');
            }
        }, 2500);
    },

    // 4. INJECT ADSTERRA (The high-paying ads)
    injectAdsterra: function(container, width, height) {
        try {
            container.innerHTML = '';
            const iframe = document.createElement('iframe');
            iframe.style.width = width + 'px';
            iframe.style.height = height + 'px';
            iframe.style.border = 'none';
            iframe.style.overflow = 'hidden';
            iframe.scrolling = 'no';
            container.appendChild(iframe);
            
            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(`
                <script type="text/javascript">
                    atOptions = { 
                        'key' : '${this.config.adsterraKey}', 
                        'format' : 'iframe', 
                        'height' : ${height}, 
                        'width' : ${width}, 
                        'params' : {} 
                    };
                <\/script>
                <script type="text/javascript" src="https://www.highperformanceformat.com/${this.config.adsterraKey}/invoke.js"><\/script>
            `);
            doc.close();
        } catch (e) {
            console.error("Adsterra Injection Failed:", e);
            this.renderFallback(container, 'generic');
        }
    },

    // 5. RENDER FALLBACK (The "Stealth" Amazon Card)
    renderFallback: function(container, type = 'generic') {
        const ad = this.fallbacks[type] || this.fallbacks.generic;
        const link = `https://www.amazon.com/s?k=${encodeURIComponent(ad.query)}&tag=${this.config.amazonTag}`;

        // This HTML looks like a helpful tip, not a spammy ad.
        container.innerHTML = `
            <a href="${link}" target="_blank" style="
                display: flex; 
                align-items: center; 
                justify-content: space-between;
                text-decoration: none; 
                color: #1e293b; 
                background: ${ad.color}; 
                border: 1px solid rgba(0,0,0,0.05);
                border-radius: 12px;
                padding: 12px 16px; 
                width: 100%; 
                box-sizing: border-box;
                font-family: inherit;
                box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                margin: 8px 0;
                transition: transform 0.2s;">
                
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="font-size: 24px; background:white; width:40px; height:40px; display:flex; align-items:center; justify-content:center; border-radius:50%; box-shadow:0 1px 3px rgba(0,0,0,0.1);">${ad.icon}</div>
                    <div style="text-align:left;">
                        <div style="font-weight: 800; font-size: 14px; color: #0f172a;">${ad.title}</div>
                        <div style="font-size: 12px; opacity: 0.8; color: #334155;">${ad.text}</div>
                    </div>
                </div>
                
                <div style="
                    background: #0f172a; 
                    color: white; 
                    padding: 8px 14px; 
                    border-radius: 99px; 
                    font-size: 11px; 
                    font-weight: bold;
                    white-space: nowrap;">
                    ${ad.btn} ➜
                </div>
            </a>
        `;
    }
};