# DIP N’ STICKS — website + backend
Information/brand site (no ordering or payments) with a zero-dependency Node backend.

## Data
JSON files in backend/db/ (auto-created, seeded from data/*.js). Back this folder up.

## Hosting
Needs a host that runs Node (VPS, Render, Railway, Fly.io…) with a persistent disk for backend/db. Set HTTPS=1 behind HTTPS and TRUST_PROXY=1 behind a proxy.
