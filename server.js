'use strict';

// ─────────────────────────────────────────────────────────────────────────────
//  RBCCI – Operational Loss Events System
//  server.js — Express static file server
//  BSP Circular 900 / MORB Part Three, Chapter 5 / Basel II–III Framework
// ─────────────────────────────────────────────────────────────────────────────

const express     = require('express');
const helmet      = require('helmet');
const compression = require('compression');
const path        = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const ENV  = process.env.NODE_ENV || 'development';

// ─── SECURITY HEADERS ────────────────────────────────────────────────────────
// Helmet sets sensible HTTP headers. We relax CSP enough for:
//  - Google Fonts (styles + fonts)
//  - Cloudflare CDN (jsPDF, jsPDF-AutoTable)
//  - Google APIs (Sheets + Drive OAuth)
//  - Google Accounts (sign-in popup)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc:  ["'self'"],
        scriptSrc:   [
          "'self'",
          "'unsafe-inline'",           // inline <script> blocks in the HTML
          "https://cdnjs.cloudflare.com",
          "https://apis.google.com",
          "https://accounts.google.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
        fontSrc:  ["'self'", "https://fonts.gstatic.com"],
        imgSrc:   ["'self'", "data:", "blob:"],
        connectSrc: [
          "'self'",
          "https://sheets.googleapis.com",
          "https://www.googleapis.com",
          "https://oauth2.googleapis.com",
          "https://accounts.google.com",
        ],
        frameSrc:  ["https://accounts.google.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: ENV === 'production' ? [] : null,
      },
    },
    // Allow Google OAuth popup
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  })
);

// ─── COMPRESSION ─────────────────────────────────────────────────────────────
app.use(compression());

// ─── STATIC FILES ────────────────────────────────────────────────────────────
// Serve everything in /public as static assets.
// The main app is public/index.html.
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: ENV === 'production' ? '1d' : 0,  // cache 1 day in prod
    etag:   true,
    index:  'index.html',
  })
);

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
// Used by Railway / Render / Docker health probes.
app.get('/health', (_req, res) => {
  res.status(200).json({
    status:  'ok',
    app:     'RBCCI Operational Loss Events System',
    version: require('./package.json').version,
    env:     ENV,
    uptime:  Math.floor(process.uptime()) + 's',
  });
});

// ─── SPA FALLBACK ────────────────────────────────────────────────────────────
// Any route not matched above returns index.html so deep-links work
// if the app is ever extended with client-side routing.
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── ERROR HANDLER ───────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[RBCCI Server Error]', err.stack || err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── START ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('─────────────────────────────────────────────────');
  console.log('  RBCCI Operational Loss Events System');
  console.log(`  Environment : ${ENV}`);
  console.log(`  Listening on: http://localhost:${PORT}`);
  console.log('─────────────────────────────────────────────────');
});

module.exports = app; // exported for testing
