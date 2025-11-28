# ✈️ Airport Carry-On Checker

A lightweight, fast-loading website that helps travelers instantly find out if items are allowed in carry-on or checked luggage.

## Features

- **Instant Search**: Search 120+ common travel items with autocomplete
- **Clear Results**: Shows carry-on and checked luggage status with TSA guidelines
- **Category Browsing**: Browse items by category (Liquids, Electronics, Food, Tools, etc.)
- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **Fast Loading**: Minimal dependencies, loads in under 1 second
- **No Backend Required**: Static website using JSON data

## Usage

Simply open `index.html` in a web browser, or host it on any static web server.

### Running Locally

1. Clone the repository
2. Open `index.html` in your browser, or
3. Start a local server:
   ```bash
   python3 -m http.server 8000
   ```
4. Visit `http://localhost:8000`

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