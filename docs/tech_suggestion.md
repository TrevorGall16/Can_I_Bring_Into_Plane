Airport Delay Advisor — Technology Stack \& Build Specification

This document defines the recommended technology stack, tools, and architecture for building the Airport Delay Advisor website. The goal is to ensure the site is free, lightweight, fast, and manageable by a single developer.



1\. Core Requirements

Mobile-first responsive website





Single-page app (SPA) or lightweight dynamic HTML





Minimal external dependencies





Free to use technologies





Easy to maintain by a solo developer







2\. Recommended Tech Stack

Frontend

HTML5 \& CSS3: Basic structure and styling.





TailwindCSS (optional): Rapid styling with utility classes, responsive design.





Vanilla JavaScript: Minimal interactivity, autocomplete, tile updates.





Optional Lightweight Framework: Alpine.js for reactive elements (easy SPA behavior, no build step needed).





Backend / Data Handling

Static JSON file for airport delay data (initial MVP): no backend needed.





Optional Node.js / Express server: Only if live updates or data aggregation are required.





Fetch API: JavaScript to read JSON data or call API endpoints.





Data Sources

Start with a curated manual JSON dataset for ~100 airports.





Optional: Integrate public airport delay APIs later.





Hosting

GitHub Pages: Free, supports static websites.





Optional later: Netlify or Vercel for serverless functions.





Version Control

GitHub repository mandatory (track code, assets, and deploy to Pages).





Icons \& Assets

Use free icon libraries: Heroicons, Feather Icons.





All assets stored locally to minimize load time.





Fonts

Use Google Fonts (one single family) or local font to reduce requests.







3\. Project Structure

/airport-delay-advisor

&nbsp; /assets

&nbsp;   /icons

&nbsp;   /flags

&nbsp; /data

&nbsp;   airports.json

&nbsp; /css

&nbsp;   styles.css

&nbsp; /js

&nbsp;   app.js

&nbsp; index.html



Keep all modules separate: HTML, CSS, JS, JSON.





Make all code modular for easy maintenance.







4\. Performance Guidelines

Page load < 1 second.





No heavy libraries.





Avoid CDN dependencies when possible.





Lazy load images/icons if needed.







5\. Development Notes

Start with static version → single JSON dataset.





Implement search autocomplete locally.





Add responsive grid for delay indicators.





Test on mobile and desktop simultaneously.





Push every session to GitHub.







6\. Optional Future Enhancements

Use serverless functions to fetch live data.





Add caching for offline speed.





Add more airports gradually.





Implement ads via lightweight ad scripts without slowing page.







This document gives a complete, solo-developer-friendly blueprint for building the Airport Delay Advisor website using free, simple, and maintainable technologies.





