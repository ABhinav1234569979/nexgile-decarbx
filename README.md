# Nexgile-DecarbX – Environmental Intelligence Platform

A full-stack MVP carbon accounting and environmental intelligence dashboard.

## Tech Stack
- **Frontend:** React + Vite, Tailwind CSS, React Router, Recharts, Axios, lucide-react
- **Backend:** Node.js + Express, JWT auth, bcrypt, SQLite (better-sqlite3)

## Project Structure
```
nexgile-decarbx/
  backend/
    db/           # connection.js, init.js (schema + seed)
    middleware/    # auth.js (JWT verification)
    routes/        # auth, emissions, facilities, suppliers, products, insights, compliance
    server.js
    package.json
  frontend/
    src/
      api/         # axios instance
      context/     # AuthContext
      components/  # Sidebar, Layout, StatCard, ProtectedRoute
      pages/        # Login, Dashboard, Emissions, Facilities, Suppliers, Products, Insights, Compliance, Profile
    package.json
```

## Setup & Run

### 1. Backend
```bash
cd backend
npm install
npm run seed     # creates + seeds decarbx.db (run once, or anytime to reset data)
npm run dev       # starts API on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev       # starts app on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## Demo Accounts
| Role | Email | Password |
|---|---|---|
| Admin | admin@nexgile.com | admin123 |
| Sustainability Manager | manager@nexgile.com | manager123 |
| Analyst | analyst@nexgile.com | analyst123 |

## Notes
- The database file (`backend/db/decarbx.db`) is created by `npm run seed`. Re-run it anytime to reset to demo data.
- JWT secret and expiry are set in `backend/.env` — change `JWT_SECRET` before any real deployment.
- AI Insights are **rule-based** (no external AI API): they read live emissions/supplier data and apply simple threshold logic.
- CORS is locked to `http://localhost:5173` — update `backend/server.js` if you serve the frontend elsewhere.
