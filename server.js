'use strict';

const express     = require('express');
const helmet      = require('helmet');
const compression = require('compression');
const cors        = require('cors');
const path        = require('path');
const fs          = require('fs');

// ─────────────────────────────────────────
// Config
// ─────────────────────────────────────────
const PORT     = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd   = NODE_ENV === 'production';

const app = express();

// ─────────────────────────────────────────
// Security — Helmet with relaxed CSP
// (allows Google APIs, Fonts, and the
//  Google Identity Services OAuth popup)
// ─────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc:     ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",          // inline <script> blocks in the HTML
          'https://accounts.google.com',
          'https://apis.google.com',
          'https://ssl.gstatic.com',
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
        ],
        fontSrc: [
          "'self'",
          'https://fonts.gstatic.com',
        ],
        imgSrc: [
          "'self'",
          'data:',
          'blob:',
        ],
        connectSrc: [
          "'self'",
          'https://sheets.googleapis.com',
          'https://www.googleapis.com',
          'https://oauth2.googleapis.com',
          'https://accounts.google.com',
        ],
        frameSrc: [
          "'self'",
          'https://accounts.google.com',
          'blob:',                    // PDF iframe preview
        ],
        workerSrc: ["'self'", 'blob:'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: isProd ? [] : null,
      },
    },
    // Allow the Google OAuth popup to open
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  })
);

// ─────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────
app.use(compression());   // gzip all responses
app.use(cors());          // allow API calls from same origin
app.use(express.json());

// ─────────────────────────────────────────
// Resolve the HTML file path
// Works whether server.js lives beside the
// HTML or in a sub-folder.
// ─────────────────────────────────────────
const HTML_FILE = (function findHtml() {
  const candidates = [
    path.join(__dirname, 'RBCCI_Operational_Loss_Forms.html'),
    path.join(__dirname, 'public', 'RBCCI_Operational_Loss_Forms.html'),
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'public', 'index.html'),
  ];
  for (const f of candidates) {
    if (fs.existsSync(f)) return f;
  }
  return null;
})();

// ─────────────────────────────────────────
// Static assets (if you add a /public dir)
// ─────────────────────────────────────────
const PUBLIC_DIR = path.join(__dirname, 'public');
if (fs.existsSync(PUBLIC_DIR)) {
  app.use(
    express.static(PUBLIC_DIR, {
      maxAge: isProd ? '1d' : 0,
      etag: true,
    })
  );
}

// ─────────────────────────────────────────
// Health-check — Railway uses this to
// confirm the service is alive
// ─────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status:  'ok',
    service: 'RBCCI Operational Loss Events System',
    env:     NODE_ENV,
    time:    new Date().toISOString(),
  });
});

// ─────────────────────────────────────────
// Main route — serve the single-page app
// ─────────────────────────────────────────
app.get('/', (req, res) => {
  if (!HTML_FILE) {
    return res.status(404).send(
      '<h2>Setup incomplete</h2>' +
      '<p>Place <code>RBCCI_Operational_Loss_Forms.html</code> ' +
      'in the same folder as <code>server.js</code> (or inside a ' +
      '<code>public/</code> sub-folder) and redeploy.</p>'
    );
  }
  // Cache: no-store in dev, short cache in prod
  res.setHeader(
    'Cache-Control',
    isProd ? 'public, max-age=300' : 'no-store'
  );
  res.sendFile(HTML_FILE);
});

// Catch-all — redirect everything else to root
// (supports future client-side routing if needed)
app.get('*', (_req, res) => res.redirect('/'));

// ─────────────────────────────────────────
// Error handler
// ─────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ─────────────────────────────────────────
// Start
// ─────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log('─────────────────────────────────────────');
  console.log(' RBCCI Operational Loss Events System');
  console.log('─────────────────────────────────────────');
  console.log(` ENV  : ${NODE_ENV}`);
  console.log(` PORT : ${PORT}`);
  console.log(` HTML : ${HTML_FILE || '⚠  NOT FOUND — add the HTML file'}`);
  console.log('─────────────────────────────────────────');
});
