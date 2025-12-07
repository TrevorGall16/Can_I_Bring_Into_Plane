# test✈️ Airport Carry-On Checker

A lightweight, fast-loading website that helps travelers instantly find out if items are allowed in carry-on or checked luggage.

## Features

- **✨ Works Offline**: No server needed! Data embedded directly in JavaScript
- **Split-Screen Layout**: Search/categories on left, results on right (desktop)
- **Instant Search**: Search 120+ common travel items with autocomplete
- **Clear Results**: Shows carry-on and checked luggage status
- **Country-Specific Rules**: Select from 8 countries (USA, China, EU, UK, Canada, Australia, Japan, International)
- **Category Browsing**: Browse items by category (Liquids, Electronics, Food, Tools, etc.)
- **Mobile-First Design**: Fully responsive layout
- **Fast Loading**: Loads instantly, no dependencies

## Usage

**✨ No Server Required!** Just double-click `index.html` - it works immediately!

### Quick Start

1. Clone the repository
2. **Double-click `index.html`** to open in any browser
3. Start searching items or browse categories

### Optional: With Server

If you prefer a local server:
```bash
python3 -m http.server 8000
```
Visit `http://localhost:8000`

### Deploying

This site can be deployed to:
- GitHub Pages (free)
- Netlify (free)
- Vercel (free)
- Any static web hosting

## Project Structure

```
/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styling
├── js/
│   └── app.js          # JavaScript functionality
├── data/
│   └── items.json      # 120+ item database
├── docs/               # Project documentation
└── README.md
```

## Technologies Used

- HTML5
- CSS3 (Mobile-first responsive design)
- Vanilla JavaScript (No frameworks)
- JSON for data storage

## Data Source

Based on TSA (Transportation Security Administration) guidelines. Rules may vary by airline and country. Always verify with your specific airline before travel.

## License


Free to use and modify.
