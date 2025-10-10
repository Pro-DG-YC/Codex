# American Auto Network LLC Website Starter

A no-build, mobile-first website starter for **American Auto Network LLC**, an Auction Access concierge service. Edit plain HTML, CSS, JSON, and CSV files without any tooling.

## Contents

```
/                    # Static pages
/css/styles.css      # Custom styles layered on PicoCSS
/js/                 # Vanilla JavaScript modules
/data/               # Editable content (site info, inventory, team, testimonials)
/assets/             # Replaceable logo, favicon, hero, and vehicle placeholders
/tools/csv-to-json.js# Helper to convert CSV inventory to JSON
```

## 1. Open the site locally

Because the pages load JSON via `fetch`, use a simple local server (double-clicking files will block the requests).

- **Option A:** Python (ships with macOS/Linux)
  ```bash
  python -m http.server 8000
  ```
  Then visit `http://localhost:8000/` in your browser.
- **Option B:** VS Code Live Server or any static hosting tool.
- **Option C:** Netlify/Vercel/GitHub Pages (see Deployment section).

## 2. Update concierge details

Edit `data/site.json`:

```json
{
  "dealerName": "American Auto Network LLC",
  "phone": "(555) 123-4567",
  "email": "sales@example.com",
  "address": "1234 Main St, Your City, ST 00000",
  "hours": {
    "monday": "9:00 AM – 6:00 PM",
    "tuesday": "9:00 AM – 6:00 PM",
    "wednesday": "9:00 AM – 6:00 PM",
    "thursday": "9:00 AM – 6:00 PM",
    "friday": "9:00 AM – 6:00 PM",
    "saturday": "10:00 AM – 4:00 PM",
    "sunday": "Closed"
  },
  "social": {
    "facebook": "https://facebook.com/yourpage",
    "instagram": "https://instagram.com/yourpage",
    "tiktok": "https://www.tiktok.com/@yourpage"
  },
  "mapEmbedUrl": "https://www.google.com/maps/embed?..."
}
```

- Keep the same keys—only update the text.
- Update `mapEmbedUrl` by copying the Google Maps embed link (Share ➜ Embed a map).
- Once saved, refresh any page to see the updates.

## 3. Manage access plans & sample listings

### Option A: Edit JSON directly (recommended)

1. Open `data/inventory.json`.
2. Each vehicle is an object inside the `"vehicles"` array.
3. Keep every field—even if blank—so filters and comparison tools keep working.
4. Replace image paths with your own auction imagery inside `/assets/vehicles/` or link to hosted URLs.
5. Update `slug` with something unique (lowercase with dashes). Example: `auction-access-georgia-fast-track`.
- Field reference (aligns with site filters):
  - `make` ➜ state coverage
  - `model` ➜ access plan name
  - `trim` ➜ concierge tier or bundle
  - `mileage` ➜ estimated processing days
  - `bodyStyle` ➜ delivery method
  - `drivetrain` ➜ support level
  - `transmission` ➜ processing speed
  - `engine` ➜ documentation package
  - `fuelType` ➜ primary support channel


### Option B: Edit CSV (spreadsheet friendly)

1. Open `data/inventory.csv` in Excel, Numbers, or Google Sheets.
2. Keep the header row intact. Separate multiple features with `|` and multiple image URLs with `;`.
3. After saving, convert the CSV back into JSON:
   - **Browser console:**
     ```js
     fetch('/data/inventory.csv')
       .then(r => r.text())
       .then(csv => convertInventory(csv))
       .then(json => navigator.clipboard.writeText(json));
     ```
     Paste the copied JSON into `data/inventory.json`.
   - **Node.js:**
     ```bash
     node tools/csv-to-json.js data/inventory.csv > data/inventory.json
     ```
4. Refresh `inventory.html` to confirm plans and sample listings load correctly.

### Auction imagery

- Replace placeholder SVGs in `/assets/vehicles/` with your own marketing imagery (JPG/PNG/WebP recommended). Keep filenames consistent or update the paths in JSON/CSV.
- Use optimized images (≤ 200 KB) for best performance.

## 4. Update testimonials & team

- `data/testimonials.json` ➜ Update `quote`, `name`, `rating` (1–5), and `source` with Auction Access success stories.
- `data/team.json` ➜ Update `name`, `title`, `bio`, `experience`, `languages`, and `photo` path.
- Both pages load data dynamically—just save and refresh.

## 5. Customize text, colors, branding, and messaging

- Replace the logo at `/assets/logo.svg` and favicon at `/assets/icons/favicon.svg` with your own artwork (keep the filenames or update `<link rel="icon">`).
- Update hero artwork `/assets/hero.svg` with photography or marketing graphics.
- Adjust colors in `css/styles.css` by editing the CSS variables at the top:
  ```css
  :root {
    --brand: #0B5CAD;
    --accent: #E63946;
    --neutral: #1F2937;
  }
  ```
- Search for `[[EDIT THIS]]` throughout the HTML and JSON files to find placeholder content.

## 6. Forms & integrations

Forms currently show a success message in the browser console (no backend required). To connect to a service:

1. Replace the `<form>` tag or add hidden inputs required by your provider (e.g., HubSpot, Mailchimp).
2. Paste the vendor's embed script where indicated, or point the `action` attribute to their endpoint.
3. Remove or modify the example JavaScript in `js/forms.js` if your provider handles validation.

## 7. Structured data, SEO, and accessibility

- AutomotiveBusiness schema lives in `index.html`. Update business details to match your actual info.
- Plan detail pages now generate `Service` schema automatically from `inventory.json`.
- `sitemap.xml` and `robots.txt` are ready—replace `https://example.com/` with your live domain before deploying.
- A skip link, focus styles, ARIA labels, and semantic headings are included. Validate pages via [W3C Validator](https://validator.w3.org/).

## 8. Optional extras

- Saved plans and compare drawer use browser `localStorage`—try the buttons on access plan cards.
- To reset saved data, clear browser storage (`localStorage.removeItem('aann-saved')`).
- Add more CTAs or update component styles in `css/styles.css`.

## 9. Deploy to the web

### GitHub Pages
1. Push this folder to a GitHub repository.
2. In repo settings ➜ Pages ➜ Deploy from branch (main, root).
3. Update URLs in `sitemap.xml` and `robots.txt` to your new domain.

### Netlify
1. Drag-and-drop the folder onto https://app.netlify.com/drop.
2. Netlify auto-detects static sites—no build command needed.
3. Set redirect rules if you prefer pretty URLs (optional).

### Vercel
1. Import the repo into Vercel (framework: "Other").
2. Leave build command empty and output directory `/`.

## 10. Troubleshooting

- **JSON fails to load locally:** Start a local server (see section 1).
- **Filters not showing options:** Make sure every plan entry includes the required keys (even if empty string).
- **Images not appearing:** Verify file paths, spelling, and case sensitivity.
- **Need help editing:** Look for `[[EDIT THIS]]` markers or consult comments in CSS/JS.

Enjoy customizing your Auction Access concierge website! 🚗
