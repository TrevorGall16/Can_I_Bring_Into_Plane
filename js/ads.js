/**
 * ADS.JS - Airport Carry-On Checker (Crash-Proof Version)
 * Includes all functions required by ui.js (initWelcomeAd, refreshInlineAd, etc.)
 */

export const adProvider = {
    // 1. CONFIGURATION
    config: {
        adsterraKey: '1eb6f5f58fd51d48c864a2232bd79e77', 
        amazonTag: 'canibringonpl-20', 
    },

    // 2. FALLBACK CONTENT (Amazon Cards)
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

    // 3. DETECTOR: The "Bait" Trick
    checkAdBlock: function(callback) {
        const bait = document.createElement('div');
        bait.innerHTML = '&nbsp;';
        bait.className = 'adsbox pub_300x250 banner-ads';
        bait.style.position = 'absolute';
        bait.style.top = '-9999px';
        bait.style.left = '-9999px';
        document.body.appendChild(bait);

        setTimeout(() => {
            const isBlocked = (bait.offsetHeight === 0 || bait.clientHeight === 0 || window.getComputedStyle(bait).display === 'none');
            document.body.removeChild(bait);
            if (callback && typeof callback === 'function') callback(isBlocked);
        }, 150);
    },

    // 4. INITIALIZATION (Called by ui.js)
    initStickyFooter: function() {
        const footer = document.getElementById('stickyFooterAd');
        if (!footer) return;

        this.checkAdBlock((blocked) => {
            if (blocked) {
                console.log("🚫 AdBlock Detected. Loading Fallback.");
                this.renderFallback(footer, 'generic');
            } else {
                this.injectAdsterra(footer, '728', '90');
                // Safety Net
                setTimeout(() => {
                    if (footer.clientHeight < 10) this.renderFallback(footer, 'generic');
                }, 3000);
            }
        });
    },

    // --- 🔥 NEW: MISSING FUNCTIONS ADDED BELOW ---

    // REQUIRED by ui.js line 122
initWelcomeAd: function() {
        const slot = document.getElementById('ad-welcome-slot');
        if (slot) {
            this.injectAdsterra(slot, '300', '250');
            console.log("✅ Welcome Ad Injected");
        }
    },

    // REQUIRED by ui.js line 486
refreshInlineAd: function() {
        const slot = document.getElementById('ad-inline-slot');
        if (slot) {
            this.injectAdsterra(slot, '300', '250');
            console.log("✅ Inline Ad Injected");
        }
    },

    // ---------------------------------------------

    // 5. INJECT ADSTERRA
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
                <body style="margin:0;padding:0;">
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
                </body>
            `);
            doc.close();
        } catch (e) {
            this.renderFallback(container, 'generic');
        }
    },

    // 6. RENDER FALLBACK
    renderFallback: function(container, type = 'generic') {
        const ad = this.fallbacks[type] || this.fallbacks.generic;
        const link = `https://www.amazon.com/s?k=${encodeURIComponent(ad.query)}&tag=${this.config.amazonTag}`;

        container.innerHTML = `
            <a href="${link}" target="_blank" style="
                display: flex; align-items: center; justify-content: center; gap: 20px;
                text-decoration: none; color: #1e293b; background: ${ad.color}; 
                width: 100%; height: 100%; padding: 0 20px; box-sizing: border-box;
                font-family: system-ui, -apple-system, sans-serif;">
                <div style="font-size: 32px;">${ad.icon}</div>
                <div style="text-align:left; display: flex; flex-direction: column; justify-content: center;">
                    <div style="font-weight: 800; font-size: 16px; color: #0f172a;">${ad.title}</div>
                    <div style="font-size: 13px; opacity: 0.8; color: #334155;">${ad.text}</div>
                </div>
                <div style="background: #0f172a; color: white; padding: 8px 16px; 
                    border-radius: 99px; font-size: 13px; font-weight: bold; 
                    white-space: nowrap; margin-left: auto;">${ad.btn} ➜</div>
            </a>
        `;
    }
};