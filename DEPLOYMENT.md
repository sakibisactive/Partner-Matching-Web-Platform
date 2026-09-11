# 🚀 SoulSync Deployment & Integration Guide

SoulSync is powered by:
- **Frontend (`client/`)**: Next.js 15 (App Router) + React 19 + Redux Toolkit + Tailwind CSS + Framer Motion
- **Backend (`server/`)**: Express.js + TypeScript + WebSockets (Socket.IO) + MongoDB
- **PostgreSQL & Database**: Supabase PostgreSQL managed with Prisma ORM
- **Realtime & Cloud Suite**: Firebase Firestore, Auth, and Cloud Storage
- **Self-Hosted Deployment**: Coolify Docker Compose stack

---

## 🛠️ Local Development

### 1. Backend (`server/`)
```bash
cd server
npm install
npm run db:push        # Syncs Supabase PostgreSQL schema with Prisma
npm run dev            # Starts backend on http://localhost:5000
```

### 2. Frontend (`client/`)
```bash
cd client
npm install
npm run dev            # Starts Next.js app on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) to view SoulSync.
Visit [http://localhost:3000/prisma-demo](http://localhost:3000/prisma-demo) to inspect live Supabase, Firebase, and Prisma integration status!

---

## 🚢 Coolify VPS Deployment

### Option A: 1-Click Docker Compose (Recommended)
1. In your Coolify dashboard, select **Create Service** or **Docker Compose Application**.
2. Select your GitHub repository: `https://github.com/sakibisactive/Partner-Matching-Web-Platform`.
3. Coolify will detect `docker-compose.yml` and `coolify.yaml` in the root directory.
4. Add environment variables under the Coolify environment settings (or use `.env`).
5. Expose port `3000` for public internet access (your domain, e.g. `soulsync.yourdomain.com`).
6. Port `5000` (`soulsync-api`) is networked internally to `soulsync-web` automatically!

### Option B: Individual Coolify Applications
If you prefer running frontend and backend as two independent Coolify services:
- **Backend Service**:
  - Base Directory: `/server`
  - Build Pack: `Dockerfile`
  - Port: `5000`
  - Health check path: `/api/health`
- **Frontend Service**:
  - Base Directory: `/client`
  - Build Pack: `Dockerfile`
  - Port: `3000`
  - Health check path: `/api/health`

---

## 🔑 Environment Variables Reference

### Client (`client/.env.local`)
- `NEXT_PUBLIC_APP_NAME`: `SoulSync`
- `NEXT_PUBLIC_APP_URL`: `http://localhost:3000`
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: `http://localhost:5000/api`)
- `NEXT_PUBLIC_SOCKET_URL`: Backend Socket.IO URL (default: `http://localhost:5000`)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public publishable key
- `NEXT_PUBLIC_FIREBASE_*`: Firebase configuration keys

### Server (`server/.env`)
- `PORT`: `5000`
- `MONGO_URI`: MongoDB connection string
- `DATABASE_URL`: Supabase PostgreSQL pooler connection URL
- `DIRECT_URL`: Supabase PostgreSQL session connection URL
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase secret service role key
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `JWT_SECRET`: JWT token signature secret
