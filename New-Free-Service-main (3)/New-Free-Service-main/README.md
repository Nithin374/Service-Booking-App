# Free Service (Full-Stack Project)

This project includes:
- Frontend: React + Vite (`frontend`)
- Backend: Express + MongoDB (`backend`)
- Database: Auto In-Memory MongoDB fallback for local demo startup

## Quick Start (Single Command)

1. Create backend env file from example:

```bash
copy backend\\.env.example backend\\.env
```

From project root:

```bash
npm run install:all
npm run dev
```

This starts both frontend and backend together.

Or run everything in one command:

```bash
npm run run:all
```

Windows one-click with browser auto-open:

```bash
npm run run:all:open
```

## Access Links

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api/services`
- Health Check: `http://localhost:5000/api/health`
- DB Connection Check: `http://localhost:5000/api/db-info`

## Authentication Test Accounts

When backend starts with local/in-memory DB, seed data creates:

- Admin:
  - Email: `admin@gmail.com`
  - Password: `password123`
- Customer:
  - Email: `customer@gmail.com`
  - Password: `password123`

## Notes

- Backend environment file: `backend/.env`
- Default backend port: `5000`
- If Vite says port `5173` is in use, it will move to `5174` or next available port.

## MongoDB Atlas Setup (Store Real Data)

1. In MongoDB Atlas, create a cluster (free tier is fine).
2. Go to `Database Access` and create a DB user.
3. Go to `Network Access` and allow your IP address (or `0.0.0.0/0` for testing only).
4. In Atlas, click `Connect` -> `Drivers`, then copy your `mongodb+srv` connection string.
5. Update `backend/.env` with your Atlas URI:

```bash
MONGODB_URI=mongodb+srv://<dbUser>:<dbPassword>@<cluster-url>/free-service?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
JWT_SECRET=your_strong_secret_here
```

6. Restart backend (or `npm run dev` from root).

Important behavior:
- Backend now connects automatically in this order:
  1. `MONGODB_URI` (Atlas if provided)
  2. Local MongoDB (`mongodb://127.0.0.1:27017/free-service`) for Compass/laptop
  3. In-memory MongoDB (auto-seeded) as last fallback
- Check `http://localhost:5000/api/db-info` and look at `source`:
  - `atlas` means cloud Atlas is active
  - `local` means your local MongoDB/Compass database is active
  - `in-memory` means temporary demo DB is active
