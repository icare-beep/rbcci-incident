# RBCCI Operational Loss Events System

**Rural Bank of Calbayog City, Inc.**  
BSP Circular 900 · MORB Part Three, Chapter 5 · Basel II–III Framework

A fully browser-based operational loss event management system with:
- Incident Report Form (Sections A–F)
- Loss Event Log Register
- Quarterly Summary Analysis
- KRI Dashboard (10 indicators with RAG status)
- Operational Risk Category Mapping (8 RBCCI categories)
- Document Vault (scanned incident reports & supporting docs)
- Google Sheets + Google Drive sync

---

## Repository Structure

```
├── server.js                          # Express server (entry point)
├── package.json                       # Node dependencies
├── .gitignore
├── README.md
└── RBCCI_Operational_Loss_Forms.html  # The single-page application
```

---

## Local Development

### Prerequisites
- Node.js ≥ 18

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/rbcci-loss-events.git
cd rbcci-loss-events

# 2. Install dependencies
npm install

# 3. Run locally
npm run dev        # uses nodemon (auto-restart on changes)
# or
npm start          # plain node

# 4. Open in browser
open http://localhost:3000
```

---

## Deploy to Railway

### One-time setup

1. **Push this repo to GitHub**

```bash
git init
git add .
git commit -m "Initial commit — RBCCI Loss Events System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rbcci-loss-events.git
git push -u origin main
```

2. **Create a Railway project**
   - Go to [railway.app](https://railway.app) → **New Project**
   - Choose **Deploy from GitHub repo**
   - Select this repository
   - Railway auto-detects Node.js and runs `npm start`

3. **Set environment variable** *(optional)*

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |

   Railway → your service → **Variables** tab → add the above.

4. **Generate a public domain**
   - Railway → your service → **Settings** → **Networking** → **Generate Domain**
   - Your app will be live at `https://rbcci-loss-events-xxxx.up.railway.app`

5. **Add that domain to Google OAuth** *(required for Google Sync)*
   - [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
   - Edit your OAuth 2.0 Client ID
   - Under **Authorized JavaScript origins** add your Railway domain:
     ```
     https://rbcci-loss-events-xxxx.up.railway.app
     ```

---

## Google Sync Setup (inside the app)

Once the app is live, open the **☁ Google Sync** tab and follow the in-app guide:

| Step | What to do |
|---|---|
| 1 | Go to [Google Cloud Console](https://console.cloud.google.com) → create/select a project |
| 2 | Enable **Google Sheets API** and **Google Drive API** |
| 3 | Create an **OAuth 2.0 Client ID** (Web Application type) |
| 4 | Add your Railway URL to **Authorized JavaScript origins** |
| 5 | Create a **Google Spreadsheet** with these sheet tabs: `Loss Event Log`, `Quarterly Summary`, `KRI Dashboard`, `Category Mapping`, `Incident Report Form` |
| 6 | Create a **Google Drive folder** named `Document Vault` |
| 7 | Paste the **Client ID**, **Spreadsheet ID**, and **Folder ID** into the app and click Connect |

### What gets synced

| App Tab | Google Sheets Tab | Behavior |
|---|---|---|
| Incident Report | `Incident Report Form` | Appends a new row on every submission |
| Loss Event Log | `Loss Event Log` | Full refresh (clear + rewrite) |
| Quarterly Summary | `Quarterly Summary` | Computed totals by category & status |
| KRI Dashboard | `KRI Dashboard` | All 10 KRIs + RAG status |
| Category Mapping | `Category Mapping` | Basel II reference mapping table |
| Document Vault | Google Drive → `Document Vault/` folder | Uploads scanned files as PDF; Drive link written back to the log |

---

## Health Check

Railway pings `/health` to verify the service is running:

```
GET /health
→ { "status": "ok", "service": "RBCCI Operational Loss Events System", ... }
```

---

## Notes

- All form data is held **in-memory** in the browser session. Google Sync is the persistence layer — sync after every session.
- Scanned images (JPG/PNG) are automatically converted to PDF before uploading to Google Drive.
- The app is a **single HTML file** — no build step, no bundler, no framework dependencies.
- `NODE_ENV=production` enables response caching and HTTPS-upgrade headers.
