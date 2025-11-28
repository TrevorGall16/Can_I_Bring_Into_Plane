\# Airport Delay Advisor — Ad Strategy \& Revenue Optimization Document



This document outlines \*\*best practices and rules\*\* for implementing ads on the Airport Delay Advisor website to \*\*maximize revenue\*\* while maintaining a clean user experience. Another AI can use this to place ads correctly in the existing layout.



---



\## 1. General Principles



\* Ads should \*\*never overwhelm the user\*\*.

\* Maintain \*\*fast loading times\*\*.

\* \*\*One major ad and one smaller ad\*\* is optimal for revenue.

\* Use user-friendly placements to avoid accidental clicks and ensure good UX.

\* Page changes (country selection, category switch, popular item selection) can trigger \*\*new ad impressions\*\*, which is beneficial for revenue.



---



\## 2. Recommended Ad Placements



\### \*\*2.1 Top Banner (Smaller Ad)\*\*



\* Location: Below the header, above the search bar or main content.

\* Size: Standard banner (320x50 mobile, 728x90 desktop)

\* Behavior: Sticky only if it doesn’t cover primary content.

\* Purpose: Continuous impression on page load.



\### \*\*2.2 Inline / Larger Ad\*\*



\* Location: Between main sections (e.g., after airport selection or category tiles).

\* Size: Medium rectangle (300x250) or responsive leaderboard.

\* Behavior: Reloads when user selects a new category, country, or popular item.

\* Purpose: Capture fresh impressions as content changes.



\### \*\*2.3 Avoid Multiple Banners\*\*



\* Do not stack multiple banners vertically.

\* Avoid putting multiple large ads in a single viewport.

\* Focus revenue on \*\*fewer, better-placed ads\*\*.



---



\## 3. Revenue Maximization Strategy



1\. \*\*Leverage interactions:\*\* Every time a user selects a new country or category, \*\*refresh the inline/larger ad\*\* to generate a new impression.

2\. \*\*Avoid ad fatigue:\*\* Do not refresh the smaller top banner too often; only reload the larger inline ad.

3\. \*\*Dynamic content triggers:\*\* Treat user selections like “soft page loads” to trigger ad refreshes.

4\. \*\*Optimal sizing:\*\* Use standard, high-CTR ad sizes: 320x50, 300x250, 728x90.

5\. \*\*Test placements:\*\* Monitor performance to adjust which ad generates better impressions without harming UX.



---



\## 4. Technical Notes for Implementation



\* Use \*\*AdProvider\*\* abstraction to manage ads.

\* Preload both ad units to avoid blank spots.

\* Ensure \*\*safe height reserved\*\* to prevent layout jumps.

\* Lazy load ads if content scrolls.

\* Track interactions with an internal counter to avoid too frequent ad refreshes.



---



\## 5. Summary of Rules for AI Implementation



\* Place \*\*only two ads\*\* per page: one small top banner, one inline/larger ad.

\* Refresh inline ad on category/country/item change.

\* Do not refresh top banner unnecessarily.

\* Maintain clean UI, fast loading, and avoid clutter.

\* Ensure ad units are modular and reusable in code.



---



This document provides the complete \*\*ad placement strategy\*\* for the Airport Delay Advisor site to maximize revenue without compromising user experience.



