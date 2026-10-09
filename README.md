# DIP N’ STICKS — website + backend
Information/brand site (no ordering or payments) with a zero-dependency Node backend.

## Run
    node backend/server.js        (Node 18+, nothing to install)
Site: http://localhost:3000 · Admin: http://localhost:3000/admin
On first run an admin password is printed in the terminal (or set ADMIN_PASSWORD, see .env.example). Change it in Admin → Settings.

## What the backend does
- Reviews: visitors submit name + stars + text (no Google account). You approve them, then they appear on Home and Reviews. You can reply publicly, reject or delete.
- Contact messages: inbox with read/unread; optional push alert via NOTIFY_URL (e.g. ntfy.sh).
- Menu, offers, coming-soon, hours, phone, WhatsApp, social links, announcement bar: edited in Admin and live instantly.
- Newsletter: footer signup, subscriber list, CSV export.
- Analytics: simple page-view counts (7-day chart, top pages).
- Backup: one-click JSON download.
- Security: scrypt-hashed password, signed HttpOnly cookie, login and form rate limits, spam honeypots, input validation, link validation, request size limit, hidden backend files, CSRF header check.

## How it connects
The server answers /data/site.js, menu.js, offers.js and reviews.js with live database content, so the pages need no changes. Without the server (opening the HTML files directly) the static files in data/ are used as a fallback.

## Data
JSON files in backend/db/ (auto-created, seeded from data/*.js). Back this folder up.

## Hosting
Needs a host that runs Node (VPS, Render, Railway, Fly.io…) with a persistent disk for backend/db. Set HTTPS=1 behind HTTPS and TRUST_PROXY=1 behind a proxy.
