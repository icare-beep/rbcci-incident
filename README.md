# RBCCI – Operational Loss Events System

> **Rural Bank of Calbayog City, Inc.**  
> BSP Circular 900 / MORB Part Three, Chapter 5 / Basel II–III Framework

A browser-based operational loss event management system for RBCCI, covering incident reporting, loss event logging, quarterly analysis, KRI dashboards, document vault, Google Sheets/Drive sync, and quarterly summary reports with PDF export.

---

## Project Structure

```
rbcci-operational-loss-system/
├── public/
│   └── index.html          ← The full single-page application
├── server.js               ← Express static file server
├── package.json
├── .gitignore
└── README.md
```

---

## Quick Start (Local)

### 1. Clone the repository

```bash
git clone https://github.com/<your-org>/rbcci-operational-loss-system.git
cd rbcci-operational-loss-system
```

### 2. Place the app file

Move or copy `RBCCI_Operational_Loss_Forms_Final.html` into the `public/` folder and rename it:

```bash
mkdir -p public
cp RBCCI_Operational_Loss_Forms_Final.html public/index.html
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the server

```bash
# Production
npm start

# Development (auto-restarts on file changes)
npm run dev
```

Open your browser at **http://localhost:3000**

---

## Environment Variables

| Variable   | Default       | Description                          |
|------------|---------------|--------------------------------------|
| `PORT`     | `3000`        | Port the server listens on           |
| `NODE_ENV` | `development` | Set to `production` on live servers  |

Create a `.env` file in the project root (never commit this file):

```env
PORT=3000
NODE_ENV=production
```

---

## Deploying to Railway

1. Push this repository to GitHub.
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**.
3. Select your repository.
4. Railway auto-detects Node.js and runs `npm start`.
5. Set environment variables in Railway's **Variables** tab:
   - `NODE_ENV=production`
6. Your app will be live at the Railway-provided domain (e.g. `https://rbcci-xyz.up.railway.app`).
7. Copy that domain into **Google Cloud Console → Authorized JavaScript origins** for Google OAuth to work.

---

## Deploying to Render

1. Push this repository to GitHub.
2. Go to [render.com](https://render.com) → **New** → **Web Service**.
3. Connect your GitHub repo.
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** `NODE_ENV=production`
5. Click **Create Web Service**.

---

## Google Sync Setup (optional)

The app can sync data to Google Sheets and upload documents to Google Drive.

1. Go to [Google Cloud Console](https://console.cloud.google.com) → create or select a project.
2. Enable **Google Sheets API** and **Google Drive API**.
3. Create an **OAuth 2.0 Client ID** (Web Application) and an **API Key**.
4. Add your deployed app URL to **Authorized JavaScript origins**.
5. Create a Google Spreadsheet with these exact tab names:
   ```
   Loss Event Log, Quarterly Summary, KRI Dashboard, Category Mapping, Incident Report Form
   ```
6. Create a Google Drive folder named **Document Vault** and copy its ID from the URL.
7. In the app, go to **☁ Google Sync** → paste your Client ID, API Key, Spreadsheet ID, and Folder ID → click **Save & Connect**.

---

## Health Check

```
GET /health
```

Returns:

```json
{
  "status": "ok",
  "app": "RBCCI Operational Loss Events System",
  "version": "1.0.0",
  "env": "production",
  "uptime": "42s"
}
```

---

## License

Private and confidential. For internal use by Rural Bank of Calbayog City, Inc. only.
