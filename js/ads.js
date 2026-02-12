/**
 * ADS.JS - Airport Carry-On Checker (Final Robust Version)
 * Features: AdBlock "Bait" Detection + Native Amazon Fallbacks
 */

export const adProvider = {
    // 1. CONFIGURATION
    config: {
        adsterraKey: '1eb6f5f58fd51d48c864a2232bd79e77', // Your Real Key
        amazonTag: 'canibringonpl-20', // Your Amazon Tag
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

    // 3. DETECTOR: The "Bait" Trick (Fixes the White Bar issue)
    checkAdBlock: function(callback) {
        // Create a fake ad element that AdBlockers automatically hide
        const bait = document.createElement('div');
        bait.innerHTML = '&nbsp;';
        bait.className = 'adsbox pub_300x250 banner-ads';
        bait.style.position = 'absolute';
        bait.style.top = '-9999px';
        bait.style.left = '-9999px';
        document.body.appendChild(bait);

        // Wait 150ms to see if the browser deletes/hides it
        setTimeout(() => {
            const isBlocked = (bait.offsetHeight === 0 || bait.clientHeight === 0 || window.getComputedStyle(bait).display === 'none');
            document.body.removeChild(bait);
            if (callback) callback(isBlocked);
        }, 150);
    },

    // 4. INITIALIZATION (Called by ui.js)
    initStickyFooter: function() {
        const footer = document.getElementById('stickyFooterAd');
        if (!footer) return;

        // Run the Detector
        this.checkAdBlock((blocked) => {
            if (blocked) {
                console.log("🚫 AdBlock Detected (Bait Method). Loading Fallback.");
                this.renderFallback(footer, 'generic');
            } else {
                console.log("✅ No AdBlock. Loading Adsterra.");
                this.injectAdsterra(footer, '728', '90');
                
                // Safety Net: If Adsterra fails network-side, check if the box is empty
                setTimeout(() => {
                    if (footer.clientHeight < 10) { 
                        this.renderFallback(footer, 'generic');
                    }
                }, 3000);
            }
        });
    },

    // 5. INJECT ADSTERRA (The High-Paying Ads)
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
            console.error("Adsterra Injection Failed:", e);
            this.renderFallback(container, 'generic');
        }
    },

    // 6. RENDER FALLBACK (The Amazon Card)
    // REQUIRED for ui.js to work!
    renderFallback: function(container, type = 'generic') {
        const ad = this.fallbacks[type] || this.fallbacks.generic;
        const link = `https://www.amazon.com/s?k=${encodeURIComponent(ad.query)}&tag=${this.config.amazonTag}`;

        // Flexbox layout to fill the container perfectly
        container.innerHTML = `
            <a href="${link}" target="_blank" style="
                display: flex; 
                align-items: center; 
                justify-content: center;
                gap: 20px;
                text-decoration: none; 
                color: #1e293b; 
                background: ${ad.color}; 
                width: 100%; 
                height: 100%; 
                padding: 0 20px;
                box-sizing: border-box;
                font-family: system-ui, -apple-system, sans-serif;">
                
                <div style="font-size: 32px;">${ad.icon}</div>
                
                <div style="text-align:left; display: flex; flex-direction: column; justify-content: center;">
                    <div style="font-weight: 800; font-size: 16px; color: #0f172a;">${ad.title}</div>
                    <div style="font-size: 13px; opacity: 0.8; color: #334155;">${ad.text}</div>
                </div>
                
                <div style="
                    background: #0f172a; 
                    color: white; 
                    padding: 8px 16px; 
                    border-radius: 99px; 
                    font-size: 13px; 
                    font-weight: bold;
                    white-space: nowrap;
                    margin-left: auto;">
                    ${ad.btn} ➜
                </div>
            </a>
        `;
    }
};