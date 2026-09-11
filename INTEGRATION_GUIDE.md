# 🚀 Integration Guide: Next.js, Coolify, Firebase & Supabase
## SoulSync Partner Matching Platform - Learning Journey

---

## 📚 Table of Contents
1. [Overview](#overview)
2. [Current Project Structure](#current-project-structure)
3. [Integration Paths](#integration-paths)
4. [Next.js Integration](#nextjs-integration)
5. [Supabase Integration](#supabase-integration)
6. [Firebase Integration](#firebase-integration)
7. [Coolify Deployment](#coolify-deployment)
8. [Learning Roadmap](#learning-roadmap)

---

## Overview

Your current stack (MERN - Vite + React + Express + MongoDB) can be enhanced by learning:

| Technology | Purpose | When to Use |
|-----------|---------|------------|
| **Next.js** | Full-stack React framework with SSR/SSG, API routes, built-in routing | Replace Vite + separate backend |
| **Supabase** | Open-source Firebase alternative (PostgreSQL + Auth + Realtime) | Replace MongoDB + JWT + custom auth |
| **Firebase** | Google's BaaS platform (Auth, Firestore, Storage, Hosting) | Cloud-based backend alternative |
| **Coolify** | Self-hosted Docker deployment platform | Deploy on your own server (like Vercel/Railway) |

---

## Current Project Structure

```
Partner-Matching-Web-Platform/
├── client/                 # React 19 + Vite (frontend)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── redux/          # State management
│       └── App.tsx
├── server/                 # Express.js + Node.js (backend)
│   └── src/
│       ├── controllers/
│       ├── models/         # MongoDB schemas
│       ├── routes/
│       └── server.ts
└── docs/
```

**Tech Details:**
- Frontend: React 19, Redux Toolkit, TailwindCSS, Socket.IO client
- Backend: Express.js, MongoDB with Mongoose, Socket.IO server
- Database: MongoDB (Atlas or local)
- Auth: JWT + bcryptjs

---

## Integration Paths

### 🎯 Path 1: Next.js Only (Recommended for Learning)
**Best for:** Learning modern full-stack development
- Merge `client/` and `server/` into single Next.js app
- Use Next.js API routes instead of Express
- Keep MongoDB (or switch to Supabase/Firebase)
- **Learning curve:** ⭐⭐⭐ (3/5)
- **Time to implement:** 2-4 weeks

### 🎯 Path 2: Next.js + Supabase (Production Ready)
**Best for:** Learning modern DB & Auth patterns
- Use Next.js with Supabase's PostgreSQL + Auth + Realtime
- Replace MongoDB, JWT, and custom auth
- Full managed backend
- **Learning curve:** ⭐⭐⭐⭐ (4/5)
- **Time to implement:** 3-5 weeks

### 🎯 Path 3: Next.js + Firebase (Google Ecosystem)
**Best for:** Learning Google Cloud services
- Use Next.js with Firebase (Firestore, Auth, Hosting)
- Managed services from Google
- Real-time database capabilities
- **Learning curve:** ⭐⭐⭐⭐ (4/5)
- **Time to implement:** 3-5 weeks

### 🎯 Path 4: Full Stack Migration (Advanced)
**Best for:** Comprehensive learning
- Next.js + Supabase + Firebase + Coolify deployment
- Learn multiple stacks, pick best components
- **Learning curve:** ⭐⭐⭐⭐⭐ (5/5)
- **Time to implement:** 6-8 weeks

---

# Part 1: Next.js Integration

## What is Next.js?

Next.js is a React framework that adds:
- **File-based routing** (no React Router needed)
- **API routes** (backend in `/api` folder)
- **SSR/SSG** (Server-side rendering, Static generation)
- **Built-in optimizations** (Image, Font, Code splitting)
- **Deployment ready** (Works with Vercel, Coolify, any Node.js server)

### Current Stack vs Next.js Stack

```
CURRENT (Vite + Express)
┌─────────────────────┐
│  React 19 (Vite)    │  Separate frontend build
│  Localhost: 5173    │
└─────────────────────┘
          ⬇
┌─────────────────────┐
│  Express.js Server  │  Separate backend
│  Localhost: 5000    │
└─────────────────────┘
          ⬇
┌─────────────────────┐
│  MongoDB Atlas      │
└─────────────────────┘

NEXT.JS (Unified)
┌─────────────────────┐
│  Next.js App        │  All in one: Pages + API routes
│  Localhost: 3000    │
├─────────────────────┤
│  API Routes (/api)  │
└─────────────────────┘
          ⬇
┌─────────────────────┐
│  MongoDB/Supabase   │
└─────────────────────┘
```

---

## Step-by-Step: Next.js Integration

### ✅ Step 1: Create New Next.js Project

```bash
# In your workspace root
cd /home/sakib/myProjects/Partner-Matching-Web-Platform

# Create new Next.js app
npx create-next-app@latest nextjs-app --typescript --tailwind --eslint

# Answer the prompts:
# ✔ Would you like to use TypeScript? › Yes
# ✔ Would you like to use ESLint? › Yes
# ✔ Would you like to use Tailwind CSS? › Yes
# ✔ Would you like your code inside a `src/` directory? › Yes
# ✔ Would you like to use App Router? › Yes
# ✔ Would you like to use Turbopack? › Yes (experimental, for faster builds)
# ✔ Would you like to customize the import alias? › No
```

### ✅ Step 2: Project Structure After Creation

```
nextjs-app/
├── src/
│   ├── app/                    # App Router (replaces pages/)
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── api/                # API routes (replaces Express)
│   │   │   └── auth/           # Auth endpoints
│   │   ├── user/               # User pages
│   │   ├── admin/              # Admin pages
│   │   └── components/         # Shared components
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Utilities
│   ├── styles/                 # Global styles
│   └── types/                  # TypeScript types
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── next.config.ts              # Next.js config
├── tailwind.config.ts          # Tailwind config
└── tsconfig.json
```

### ✅ Step 3: Install Dependencies

```bash
cd nextjs-app

# Core packages
npm install \
  @reduxjs/toolkit \
  react-redux \
  axios \
  socket.io-client \
  bcryptjs \
  jsonwebtoken \
  mongoose \
  framer-motion \
  recharts \
  zod \
  react-hook-form \
  @hookform/resolvers

# Dev dependencies
npm install --save-dev \
  @types/bcryptjs \
  @types/jsonwebtoken \
  @types/node
```

### ✅ Step 4: Environment Variables

Create `.env.local`:

```bash
# Database
NEXT_PUBLIC_API_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your-super-secret-key-change-this
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (Brevo/Nodemailer)
BREVO_API_KEY=your_brevo_key
MAIL_FROM=noreply@soulsync.com
```

### ✅ Step 5: Copy Frontend Components

```bash
# Copy your React components from client/src/
cp -r ../client/src/components nextjs-app/src/app/
cp -r ../client/src/contexts nextjs-app/src/
cp -r ../client/src/hooks nextjs-app/src/
cp -r ../client/src/redux nextjs-app/src/

# Copy styles
cp ../client/src/index.css nextjs-app/src/styles/globals.css
```

### ✅ Step 6: Create API Routes (Replace Express)

Replace Express backend with Next.js API routes:

**File: `src/app/api/auth/register/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    );

    // Set secure cookies
    const response = NextResponse.json(
      { user: { id: user._id, email: user.email, name: user.name } },
      { status: 201 }
    );

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
```

**File: `src/app/api/auth/login/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    );

    // Set cookies and return
    const response = NextResponse.json(
      {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
```

**File: `src/app/api/middleware/auth.ts`** (Middleware for protected routes)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest) => {
    const user = verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return handler(request, user);
  };
}
```

### ✅ Step 7: Migrate Pages

**File: `src/app/page.tsx`** (Landing Page)

```typescript
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <h1 className="text-5xl font-bold text-white mb-4">SoulSync</h1>
      <p className="text-xl text-slate-300 mb-8">Find Your Perfect Partner Match</p>
      <div className="flex gap-4">
        <Link href="/register">
          <Button>Get Started</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>
      </div>
    </main>
  );
}
```

### ✅ Step 8: Socket.IO Setup (Real-time Features)

**File: `src/lib/socket.ts`**

```typescript
import io from 'socket.io-client';

export const initSocket = () => {
  return io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });
};
```

**File: `src/hooks/useSocket.ts`**

```typescript
import { useEffect, useRef } from 'react';
import { initSocket } from '@/lib/socket';
import type { Socket } from 'socket.io-client';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = initSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef.current;
}
```

### ✅ Step 9: Running Next.js Locally

```bash
cd nextjs-app

# Development
npm run dev
# App runs on http://localhost:3000

# Build for production
npm run build

# Start production server
npm start
```

---

# 🔄 Supabase vs Firebase: Practical Comparison

## 📊 Side-by-Side Comparison

| Aspect | Supabase | Firebase | Best For |
|--------|----------|----------|----------|
| **Database Type** | PostgreSQL (SQL, relational) | Firestore (NoSQL, document-based) | Supabase: Complex queries, Relational data, Firebase: Simple structure, Real-time updates |
| **Architecture** | Open-source, self-hosted or managed | Closed-source, Google-managed only | Supabase: Control & flexibility, Firebase: Simplicity |
| **Query Capability** | Full SQL power (`WHERE`, `JOIN`, aggregations) | Limited queries, must fetch & filter in code | Supabase: Complex analytics, Firebase: Simple CRUD |
| **Real-time** | Subscriptions (WebSocket) | Listeners (automatic) | Both good, Firebase is simpler |
| **Authentication** | Built-in + Social OAuth | Built-in + Social OAuth | Both similar |
| **Storage** | S3-compatible file storage | Google Cloud Storage | Both similar |
| **Pricing Model** | Free tier + usage-based (PostgreSQL bytes) | Free tier + usage-based (Firestore reads/writes) | Supabase cheaper for large DBs, Firebase for high-traffic |
| **Scalability** | Horizontal scaling, managed | Auto-scales, serverless | Firebase easier, Supabase more control |
| **Learning Curve** | SQL knowledge helpful | Easier for beginners | Firebase easier if new to databases |
| **Vendor Lock-in** | Low (open-source, can self-host) | High (Google only) | Supabase: More freedom |

---

## 🛠️ Practical Code Examples

### Scenario 1: Fetch User's Matches (Your Use Case)

#### Supabase (SQL - Complex Query)
```typescript
// app/api/matches/route.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)

export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get('userId')
  
  // SQL: Join users with matches, filter by compatibility score
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      user2:profiles!matches_user2_id_fkey(id, name, age, bio, photo),
      compatibility_score
    `)
    .eq('user1_id', userId)
    .eq('status', 'active')
    .gte('compatibility_score', 75)
    .order('compatibility_score', { ascending: false })
  
  return Response.json({ matches: data })
}
```

#### Firebase (NoSQL - Simpler but More Code)
```typescript
// app/api/matches/route.ts
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'

const db = getFirestore(initializeApp(firebaseConfig))

export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get('userId')
  
  // Query 1: Get all matches for this user
  const matchesRef = collection(db, 'matches')
  const q = query(
    matchesRef,
    where('user1_id', '==', userId),
    where('status', '==', 'active')
  )
  
  const matchDocs = await getDocs(q)
  
  // Query 2: For each match, fetch user2 details (N+1 query!)
  const matches = await Promise.all(
    matchDocs.docs.map(async (doc) => {
      const match = doc.data()
      const userRef = doc(collection(db, 'profiles'), match.user2_id)
      const userSnap = await getDoc(userRef)
      return { ...match, user2: userSnap.data() }
    })
  )
  
  // Filter in code (Firebase doesn't have native >=)
  const filtered = matches.filter(m => m.compatibility_score >= 75)
  
  return Response.json({ matches: filtered })
}
```

**Key Difference:**
- **Supabase:** One SQL query with JOINs, filtering, ordering → Efficient
- **Firebase:** Multiple queries, filtering in code → Slower for large data

---

### Scenario 2: Real-time Chat Messages

#### Supabase (Subscription Model)
```typescript
// lib/useRealtimeMessages.ts
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, 
                             process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export function useRealtimeMessages(chatId: string) {
  const [messages, setMessages] = useState([])
  
  useEffect(() => {
    // Subscribe to new messages
    const subscription = supabase
      .from('messages')
      .on('*', (payload) => {
        if (payload.new.chat_id === chatId) {
          setMessages(prev => [...prev, payload.new])
        }
      })
      .subscribe()
    
    return () => subscription.unsubscribe()
  }, [chatId])
  
  return messages
}
```

#### Firebase (Listener Model)
```typescript
// lib/useRealtimeMessages.ts
import { useEffect, useState } from 'react'
import { onSnapshot, collection, query, where } from 'firebase/firestore'

export function useRealtimeMessages(chatId: string) {
  const [messages, setMessages] = useState([])
  
  useEffect(() => {
    // Listen for changes
    const q = query(
      collection(db, 'messages'),
      where('chat_id', '==', chatId)
    )
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()))
    })
    
    return unsubscribe
  }, [chatId])
  
  return messages
}
```

**Key Difference:**
- **Supabase:** Webhook-style (just push updates)
- **Firebase:** Listener-style (automatic updates)
- **Result:** Both very similar in practice

---

### Scenario 3: Update User Profile with Validation

#### Supabase (SQL Constraints)
```typescript
// app/api/profile/update/route.ts
export async function POST(req: Request) {
  const { userId, name, age, bio } = await req.json()
  
  // Database handles validation with constraints
  const { data, error } = await supabase
    .from('profiles')
    .update({
      name,
      age: age > 18 ? age : null, // Validation in app
      bio,
      updated_at: new Date()
    })
    .eq('id', userId)
  
  // SQL Constraints prevent:
  // - age < 18
  // - name is empty
  // - duplicate emails (UNIQUE constraint)
  
  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json({ success: true })
}
```

#### Firebase (No Built-in Validation)
```typescript
// app/api/profile/update/route.ts
export async function POST(req: Request) {
  const { userId, name, age, bio } = await req.json()
  
  // Must validate in code first!
  if (!name || name.length === 0) {
    return Response.json({ error: 'Name required' }, { status: 400 })
  }
  if (age < 18) {
    return Response.json({ error: 'Must be 18+' }, { status: 400 })
  }
  
  const userRef = doc(db, 'profiles', userId)
  await updateDoc(userRef, {
    name,
    age,
    bio,
    updated_at: new Date()
  })
  
  return Response.json({ success: true })
}
```

**Key Difference:**
- **Supabase:** Constraints enforced at database level
- **Firebase:** Validation must be done in application code
- **Result:** Supabase more robust, Firebase more flexible

---

## 📍 When to Use What

### Use **Supabase** When:
✅ You have **complex relationships** between data (users → matches → messages → likes)
✅ You need **complex queries** (aggregations, JOINs, GROUP BY)
✅ You want **database-level validation** (constraints, triggers)
✅ You need **cost control** with large databases
✅ You want to **self-host** or avoid vendor lock-in
✅ You're familiar with **SQL**

**Your Project Fit:** ⭐⭐⭐⭐⭐ **PERFECT** - Matching platform needs complex queries!

### Use **Firebase** When:
✅ You want **simplicity** and fast prototyping
✅ You have **simple document structures** (users, posts, comments)
✅ You want **automatic scaling** without thinking about it
✅ You're building **mobile-first apps** (native SDK support)
✅ You want **integration with Google services** (Analytics, BigQuery)
✅ Your app has **simple real-time needs**

**Your Project Fit:** ⭐⭐⭐ **OKAY** - Works but complex queries are harder

---

## 🎯 Using Both Together (Hybrid Approach)

### Real-World Scenario: Best of Both Worlds

```
┌─────────────────────────────┐
│     Next.js App             │
├─────────────────────────────┤
│ Real-time Chat              │  ← Firebase (simple, fast real-time)
│ User Authentication         │  ← Either works
│ Matching Algorithm Results  │  ← Supabase (complex queries)
│ Like/Unlike Actions         │  ← Either works
│ Admin Reports & Analytics   │  ← Supabase (complex queries)
└─────────────────────────────┘
       ↙                ↖
   Firebase         Supabase
   (Firestore)      (PostgreSQL)
```

### Example: Hybrid Setup Code

```typescript
// lib/databases.ts
import { createClient } from '@supabase/supabase-js'
import { initializeApp } from 'firebase/app'

// PostgreSQL via Supabase (for complex queries)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Firestore via Firebase (for real-time)
export const firebaseApp = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
})

// Use them where appropriate:
export const matchApi = {
  // Complex matching algorithm → Supabase
  async getMatches(userId: string) {
    return supabase
      .from('matches')
      .select('*, user2:profiles!(...)')
      .eq('user1_id', userId)
  }
}

export const chatApi = {
  // Real-time messaging → Firebase
  subscribeToChat(chatId: string, callback: Function) {
    return onSnapshot(
      query(collection(getFirestore(firebaseApp), 'messages'),
            where('chat_id', '==', chatId)),
      callback
    )
  }
}
```

### Pros & Cons of Hybrid Approach

| Aspect | Pros | Cons |
|--------|------|------|
| **Complexity** | Use best tool per feature | More setup & maintenance |
| **Cost** | Optimize spending per DB | Paying for two services |
| **Learning** | Learn both technologies | Steeper learning curve |
| **Performance** | Perfect for each use case | Context switching in code |

**Recommendation:** Start with ONE database (Supabase recommended), switch to hybrid only if needed!

---

# 🔐 Prisma: The Game-Changer for Supabase

## What is Prisma?

**Prisma is an ORM (Object-Relational Mapping)** - it's a type-safe query builder for databases. Think of it as a translator between your JavaScript code and SQL.

| Without Prisma | With Prisma |
|----------------|------------|
| Write SQL strings | Write JavaScript objects |
| No type checking | Full TypeScript support |
| Easy to make mistakes | IDE auto-complete |
| Manual migrations | Auto-generated migrations |

### Code Comparison

#### Without Prisma (Raw Supabase)
```typescript
// You write SQL-like queries, no type safety
const { data, error } = await supabase
  .from('profiles')
  .select('*, matches:matches_user1_fkey(id, name, age)')
  .eq('id', userId)
  .single()

// TypeScript doesn't know what fields exist on 'data'
console.log(data.name) // Could be wrong type or not exist
```

#### With Prisma
```typescript
// Type-safe, auto-complete works
const user = await prisma.profile.findUnique({
  where: { id: userId },
  include: {
    matches: {
      select: { id: true, name: true, age: true }
    }
  }
})

// TypeScript knows exactly what fields exist
console.log(user.name) // ✅ Correct type, IDE auto-complete
```

---

## Database Support & Compatibility

### ✅ **Works Great With:**
- **Supabase** (PostgreSQL) - Perfect match!
- **PostgreSQL** - Full support
- **MySQL** - Full support
- **MongoDB** - Limited support (newer)

### ❌ **Does NOT Work With:**
- **Firebase / Firestore** - NoSQL (use Firebase SDK instead)

---

## Should You Use Prisma?

### ✅ Use Prisma If:
- You're using **Supabase** (recommended!)
- You want **type-safe database queries**
- You're building a **production app**
- You want **auto-migrations**
- You prefer **cleaner code** over SQL strings

### ❌ Skip Prisma If:
- You're using **Firebase** (not compatible)
- You're doing **quick prototyping**
- You prefer **raw SQL** (that's OK too!)
- You want **minimal dependencies**

---

## Quick Setup: Prisma + Supabase

### ✅ Step 1: Install Prisma

```bash
npm install @prisma/client
npm install -D prisma

# Initialize Prisma
npx prisma init
```

### ✅ Step 2: Configure `.env.local`

```bash
# .env.local
DATABASE_URL="postgresql://user:password@host:5432/soulsync"
```

### ✅ Step 3: Define Your Schema

**File: `prisma/schema.prisma`**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Profile {
  id    String   @id @default(cuid())
  name  String
  email String   @unique
  age   Int
  bio   String?
  photo String?

  // Relations
  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String
  
  matches      Match[] @relation("user1")
  matchedBy    Match[] @relation("user2")
  likes        Like[]
  messages     Message[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Match {
  id                  String   @id @default(cuid())
  user1               Profile  @relation("user1", fields: [user1Id], references: [id], onDelete: Cascade)
  user1Id             String
  user2               Profile  @relation("user2", fields: [user2Id], references: [id], onDelete: Cascade)
  user2Id             String
  
  compatibilityScore  Float
  status              String   @default("pending") // pending, accepted, rejected
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([user1Id, user2Id])
}

model Like {
  id          String   @id @default(cuid())
  profile     Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  profileId   String
  likedUserId String
  
  createdAt DateTime @default(now())
  
  @@unique([profileId, likedUserId])
}

model Message {
  id        String   @id @default(cuid())
  content   String
  senderId  String
  sender    Profile  @relation(fields: [senderId], references: [id], onDelete: Cascade)
  chatId    String
  
  createdAt DateTime @default(now())
}
```

### ✅ Step 4: Run Migration

```bash
# Creates tables in your Supabase database
npx prisma migrate dev --name init

# This generates TypeScript types automatically!
```

### ✅ Step 5: Use in Your App

**File: `lib/prisma.ts`**

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**File: `app/api/matches/route.ts`**

```typescript
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get('userId')
  
  // Type-safe query with auto-complete!
  const matches = await prisma.match.findMany({
    where: {
      user1Id: userId,
      status: 'active',
      compatibilityScore: { gte: 75 }
    },
    include: {
      user2: {
        select: { id: true, name: true, age: true, photo: true }
      }
    },
    orderBy: { compatibilityScore: 'desc' }
  })
  
  return Response.json({ matches })
}
```

---

## Prisma vs Supabase SDK vs Raw SQL

| Aspect | Prisma | Supabase SDK | Raw SQL |
|--------|--------|-------------|---------|
| **Type Safety** | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐ Basic | ❌ None |
| **Auto-complete** | ⭐⭐⭐⭐⭐ Full IDE support | ⭐⭐⭐ Partial | ❌ None |
| **Learning Curve** | ⭐⭐⭐ Medium | ⭐⭐ Easy | ⭐⭐⭐⭐ Hard |
| **Migrations** | ⭐⭐⭐⭐⭐ Managed | ⭐⭐ Manual | ⭐⭐ Manual |
| **Performance** | ⭐⭐⭐⭐ Good | ⭐⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Best |
| **Flexibility** | ⭐⭐⭐ Good | ⭐⭐⭐⭐ Great | ⭐⭐⭐⭐⭐ Perfect |
| **Setup Time** | ⭐⭐ Moderate | ⭐ Quick | ⭐ Quick |

---

## Real-World Example: Complex Query with Prisma

### Before (Supabase SDK)
```typescript
// Messy, error-prone
const { data } = await supabase
  .from('matches')
  .select(`
    *,
    user2:profiles!matches_user2_id_fkey(id, name, age, photo),
    likes:likes(id)
  `)
  .eq('user1_id', userId)
  .gte('compatibility_score', 75)
  .order('compatibility_score', { ascending: false })
```

### After (Prisma)
```typescript
// Clean, type-safe
const matches = await prisma.match.findMany({
  where: {
    user1Id: userId,
    compatibilityScore: { gte: 75 }
  },
  include: {
    user2: true,
    likes: { select: { id: true } }
  },
  orderBy: { compatibilityScore: 'desc' }
})

// Type: Match[] with full TypeScript support!
```

---

## 🎯 Recommendation for Your Project

| Setup | Recommendation |
|-------|-----------------|
| **Supabase Only** | ✅ Use Prisma! Makes queries much cleaner |
| **Firebase Only** | ❌ Skip Prisma, use Firebase SDK |
| **Supabase + Firebase (Hybrid)** | ✅ Use Prisma for Supabase, Firebase SDK for Firebase |

**For your Partner Matching Platform:** Use Prisma + Supabase for complex matching queries, it's the sweet spot! 🎉

---

# Part 2: Supabase Integration

## What is Supabase?

Supabase is an open-source Firebase alternative built on PostgreSQL:

| Feature | Supabase | Your Current Stack |
|---------|----------|------------------|
| **Database** | PostgreSQL (SQL) | MongoDB (NoSQL) |
| **Authentication** | Built-in Auth UI | Custom JWT + bcrypt |
| **Real-time** | Subscriptions & Broadcasts | Socket.IO |
| **Storage** | File storage | Cloudinary |
| **Hosting** | Managed or self-hosted | Self-hosted |

### Key Benefits for Learning

```
✅ Learn PostgreSQL & SQL (industry standard)
✅ Use managed authentication (stop building auth)
✅ Real-time subscriptions (instead of Socket.IO)
✅ API Auto-generated from database schema
✅ Free tier for learning
```

---

## Step-by-Step: Supabase Integration

### ✅ Step 1: Create Supabase Account & Project

```bash
# Visit: https://supabase.com/dashboard

# Steps:
# 1. Sign up with GitHub/Google
# 2. Create new project
#    - Project name: soulsync
#    - Password: strong-secure-password
#    - Region: Choose closest to you
# 3. Copy these from project settings:
#    - Project URL
#    - Anon Key
#    - Service Role Key
```

### ✅ Step 2: Install Supabase Client

```bash
cd nextjs-app

npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### ✅ Step 3: Setup Environment Variables

Add to `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

### ✅ Step 4: Create Database Schema (SQL)

In Supabase SQL Editor, run this schema:

**File: `database-schema.sql`** (Save and run in Supabase)

```sql
-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  age INT,
  bio TEXT,
  role VARCHAR(50) DEFAULT 'user', -- 'user', 'admin', 'moderator'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gender VARCHAR(50),
  location VARCHAR(255),
  interests TEXT[], -- Array of interest tags
  photos TEXT[], -- Array of photo URLs
  lifestyle_preferences JSONB, -- Smoking, drinking, exercise preferences
  age_preference_min INT,
  age_preference_max INT,
  location_preference_radius FLOAT,
  bio_detailed TEXT,
  compatibility_score FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Interests Table
CREATE TABLE IF NOT EXISTS interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50), -- Sports, Music, Entertainment, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Interests (Many-to-Many)
CREATE TABLE IF NOT EXISTS user_interests (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interest_id UUID NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, interest_id)
);

-- Likes Table
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  liker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  liked_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_super_like BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(liker_id, liked_user_id)
);

-- Matches Table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_id_2 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  compatibility_score FLOAT,
  match_status VARCHAR(50), -- 'new', 'active', 'expired'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id_1, user_id_2)
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chats Table
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions Table (for personality matching)
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Question Responses (for matching algorithm)
CREATE TABLE IF NOT EXISTS user_question_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  response INT, -- 1-5 Likert scale
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports Table (for admin moderation)
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason VARCHAR(255),
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row-Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Users can only view their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);
```

### ✅ Step 5: Initialize Supabase Client

**File: `src/lib/supabase.ts`**

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// For server-side operations
export const supabaseServer = () => {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
};
```

### ✅ Step 6: Migrate to Supabase Auth (Replace JWT)

**File: `src/app/api/auth/signup/route.ts`** (Using Supabase Auth)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    const supabase = supabaseServer();

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
      });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Create user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email,
          name,
          role: 'user',
        },
      ])
      .select();

    if (userError) {
      return NextResponse.json(
        { error: userError.message },
        { status: 400 }
      );
    }

    // Send confirmation email
    await supabase.auth.resendOtp({
      email,
      type: 'signup',
    });

    return NextResponse.json(
      {
        message: 'Sign up successful. Check your email for confirmation.',
        user: userData[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    );
  }
}
```

### ✅ Step 7: Create Supabase Client Hook

**File: `src/hooks/useSupabase.ts`**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Session } from '@supabase/supabase-js';

export function useSupabase() {
  const [supabase] = useState(() =>
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, [supabase]);

  return { supabase, session, loading };
}
```

### ✅ Step 8: Real-time Subscriptions (Replace Socket.IO)

**File: `src/hooks/useRealtimeMessages.ts`**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from './useSupabase';

export function useRealtimeMessages(matchId: string) {
  const { supabase } = useSupabase();
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!matchId) return;

    // Subscribe to messages
    const channel = supabase
      .channel(`match_${matchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id ? payload.new : msg
              )
            );
          }
        }
      )
      .subscribe();

    // Load initial messages
    supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setMessages(data || []);
      });

    return () => {
      channel.unsubscribe();
    };
  }, [matchId, supabase]);

  return messages;
}
```

---

# Part 3: Firebase Integration

## What is Firebase?

Firebase is Google's comprehensive app development platform:

| Service | Purpose |
|---------|---------|
| **Authentication** | Built-in auth with social logins |
| **Firestore** | NoSQL database (JSON-like) |
| **Storage** | File storage (images, videos) |
| **Functions** | Serverless backend functions |
| **Hosting** | Automatic HTTPS deployment |
| **Realtime Database** | Real-time JSON database |

### Firebase vs Supabase vs Your Current Stack

```
             MongoDB      Supabase          Firebase
Database     NoSQL        SQL (PostgreSQL)  NoSQL (Firestore)
Auth         Custom JWT   Managed OAuth    Managed OAuth
Real-time    Socket.IO    Subscriptions    Listeners
Storage      Cloudinary   S3-like          Google Cloud Storage
Hosting      Manual       Self-hosted      Vercel-like
```

---

## Step-by-Step: Firebase Integration

### ✅ Step 1: Create Firebase Project

```bash
# Visit: https://console.firebase.google.com

# Steps:
# 1. Click "Create a project"
# 2. Project name: soulsync
# 3. Disable Google Analytics
# 4. Click "Create project"
# 5. Wait for provisioning...
```

### ✅ Step 2: Setup Firebase Services

In Firebase Console:

**Authentication:**
```
1. Go to Authentication → Sign-in method
2. Enable: Email/Password
3. Enable: Google
4. Enable: GitHub (optional)
```

**Firestore Database:**
```
1. Go to Firestore Database
2. Create database → Production mode
3. Choose your region
4. Create
```

**Storage:**
```
1. Go to Storage
2. Get started → Use default bucket
```

### ✅ Step 3: Get Firebase Config

In Project Settings → Your Apps → Web App:

```javascript
// Copy this config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### ✅ Step 4: Install Firebase SDK

```bash
npm install firebase
```

### ✅ Step 5: Initialize Firebase

**File: `src/lib/firebase.ts`**

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### ✅ Step 6: Environment Variables for Firebase

Add to `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### ✅ Step 7: Firebase Authentication Hook

**File: `src/hooks/useFirebaseAuth.ts`**

```typescript
'use client';

import { useEffect, useState } from 'react';
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
} from 'firebase/auth';

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string) => {
    try {
      setError(null);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { user, loading, error, signup, login, logout };
}
```

### ✅ Step 8: Firestore Schema (Collections)

**Collections to create in Firestore:**

```
users/
  {userId}
    - email: string
    - name: string
    - age: number
    - createdAt: timestamp
    - role: string

profiles/
  {userId}
    - gender: string
    - interests: array
    - photos: array
    - bio: string
    - location: string

matches/
  {matchId}
    - user1Id: string
    - user2Id: string
    - compatibility: number
    - createdAt: timestamp

messages/
  {matchId}
    {messageId}
      - senderId: string
      - content: string
      - timestamp: timestamp
      - read: boolean
```

### ✅ Step 9: Firestore Hooks

**File: `src/hooks/useFirestore.ts`**

```typescript
'use client';

import { useEffect, useState } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  QuerySnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useFirestoreDoc(collectionName: string, docId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docId) return;

    const unsubscribe = onSnapshot(
      doc(db, collectionName, docId),
      (doc) => {
        if (doc.exists()) {
          setData(doc.data());
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, docId]);

  const updateData = async (updates: any) => {
    try {
      await updateDoc(doc(db, collectionName, docId), updates);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { data, loading, error, updateData };
}

export function useFirestoreQuery(
  collectionName: string,
  constraints: any[] = []
) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName]);

  return { data, loading, error };
}
```

### ✅ Step 10: Firebase File Upload

**File: `src/lib/firebaseStorage.ts`**

```typescript
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadProfilePhoto(
  userId: string,
  file: File
): Promise<string> {
  const fileRef = ref(storage, `profiles/${userId}/${file.name}`);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return url;
}

export async function uploadChatImage(
  matchId: string,
  file: File
): Promise<string> {
  const fileRef = ref(storage, `chats/${matchId}/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return url;
}
```

---

# Part 4: Coolify Deployment

## What is Coolify?

Coolify is a **free, open-source** self-hosted deployment platform (like Heroku, Vercel, but on your own server):

```
Coolify Costs: FREE ✅
Server Costs: $6-10/month (one-time cost for unlimited apps)

Benefits:
✅ Coolify platform = 100% FREE & open-source
✅ Only pay for your VPS server (much cheaper than Heroku)
✅ Unlimited apps and databases on your server
✅ Full control over your data
✅ Pay once for server, not per app (vs Vercel/Heroku)
✅ Docker-based (easy scaling)
✅ Works with Next.js, Node.js, MongoDB, PostgreSQL, etc.
```

---

## Step-by-Step: Coolify Deployment

### ✅ Step 1: Get a Server

You'll need a VPS (Virtual Private Server). **Many free options available:**

**FREE Options (With Free Tier/Credits):**
- **AWS EC2**: Free tier = 750 hours/month for 12 months (t2.micro, 1GB RAM)
- **Oracle Cloud**: Always-free tier = 2x ARM instances (unlimited)
- **Google Cloud**: $300 free credits for 90 days
- **Azure**: Free tier + $200 credits
- **Railway**: Free tier with $5/month credit
- **Fly.io**: Free tier available
- **Vercel**: FREE for Next.js deployment (easiest!)
- **Render**: Free tier with auto-sleep

**Paid Options (Very Cheap After Free Tier):**
- **DigitalOcean**: $6/month (after free trial)
- **Hetzner**: €4/month (very affordable)
- **Linode**: $5/month
- **UpCloud**: From $5/month

**Requirements:**
- OS: Ubuntu 20.04 or newer
- CPU: 2 cores minimum
- RAM: 2GB minimum (4GB recommended)
- Storage: 20GB minimum

**Best Free Option for Learning:**
👉 **Vercel (for Next.js)** - Deploy BOTH frontend + backend directly, no server setup needed!
👉 **Railway or Fly.io** - Good free tier + easy Coolify setup for self-hosting

### ⚠️ Important: Vercel Does Backend Too!

When using Next.js with Vercel:
- **Frontend** = Your React pages (hosted on Vercel)
- **Backend** = Your API Routes in `/app/api/*` (run as serverless functions on Vercel)
- **Both deploy together** to the same Vercel project

So when your app calls `https://your-project.vercel.app/api/login`, it's hitting a serverless function backend endpoint! You don't need a separate backend server.

### ✅ Step 2: Install Coolify on Server

SSH into your server and run:

```bash
# Connect to your server
ssh root@your_server_ip

# Install Coolify
curl -fsSL https://get.coollabs.io/coolify/install.sh | bash

# Coolify will run on port 3000
# Access at: https://your_server_ip:3000
```

### ✅ Step 3: Configure Coolify Web UI

```
1. Go to https://your_server_ip:3000
2. Create admin account
3. Add your SSH key (for automatic deployments)
4. Configure Docker settings (leave defaults)
```

### ✅ Step 4: Prepare Your App for Deployment

**File: `Dockerfile` (root of nextjs-app)**

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build Next.js
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
```

**File: `.dockerignore`**

```
node_modules
.next
.git
.gitignore
README.md
.env.local
.env.*.local
coverage
.env
```

### ✅ Step 5: Setup Environment in Coolify

```
In Coolify Dashboard:
1. Projects → Create New Project → "soulsync"
2. Add Environment → "production"
3. Add Resource → Application
   - Name: next-app
   - Publish Port: 3000
   - Source: GitHub (connect your repo)
   - Branch: main
   
4. Configure Environment Variables:
   - MONGODB_URI=...
   - JWT_SECRET=...
   - NEXT_PUBLIC_API_URL=https://your-domain.com
   - ... (all your .env variables)

5. Add Resource → Database
   - Type: MongoDB
   - Name: mongo-db
   
6. Connect and deploy!
```

### ✅ Step 6: Setup Custom Domain

```
1. In Coolify → Applications → next-app
2. Click "Add Custom Domain"
3. Enter: soulsync.yourdomain.com
4. Add DNS record to your domain provider:
   - Type: CNAME
   - Name: soulsync
   - Value: your-server-ip

5. Generate SSL certificate (Coolify does auto with Let's Encrypt)
```

### ✅ Step 7: GitHub Integration (CI/CD)

```bash
# In Coolify:
1. Settings → Integrations → GitHub
2. Authorize GitHub app
3. Select your repo
4. Branch: main
5. Auto-deploy on push enabled

# Now every push to main = automatic deployment!
```

---

# Learning Roadmap

## Week 1-2: Next.js Foundations

### Learning Goals:
- [ ] Understand App Router vs Pages Router
- [ ] Create API routes
- [ ] Migrate Express endpoints to Next.js API routes
- [ ] Setup middleware and auth
- [ ] Deploy on Vercel (free, easiest start)

### Tasks:
```bash
# Day 1-2: Setup & Learn
npx create-next-app@latest --typescript --tailwind
Read: https://nextjs.org/docs/app

# Day 3-4: API Routes
# Copy your Express auth routes to /api/auth/
# Test with Postman

# Day 5: Authentication
# Implement login/register with next-auth
npm install next-auth

# Day 6-7: Database Connection
# Connect MongoDB to Next.js
# Migrate models to next-app
```

### Resources:
- **Official**: https://nextjs.org/learn
- **Free Course**: https://www.youtube.com/watch?v=wm5gMKuwSYk (Learn Next.js in 1 hour)
- **Docs**: https://nextjs.org/docs

---

## Week 3-4: Database & Auth (Choose One)

### Option A: MongoDB + Mongoose (Familiar)
```bash
# Keep MongoDB, just use Next.js
npm install mongoose
# Copy your models to lib/models/
# Use in /api routes
```

### Option B: Supabase (Recommended for Learning SQL)
```bash
# Switch from MongoDB to PostgreSQL
npm install @supabase/supabase-js
# Learn SQL, RLS, Auth
# Real-time subscriptions
```

### Option C: Firebase (Google Ecosystem)
```bash
# Try Firestore (NoSQL like MongoDB)
npm install firebase
# Use Firebase Auth
# Learn Google Cloud ecosystem
```

### Learning Roadmap:
```
Day 1-2: Create database schema
Day 3-4: Setup authentication
Day 5-6: Implement real-time features
Day 7: Add storage (images)
```

---

## Week 5-6: Real-Time Features

### Replace Socket.IO with Built-in Features

**Option 1: Supabase Real-time**
```typescript
// Instead of Socket.IO
const channel = supabase
  .channel('messages')
  .on('postgres_changes', { ... })
  .subscribe()
```

**Option 2: Firebase Listeners**
```typescript
// Instead of Socket.IO
onSnapshot(query(collection(db, 'messages')), (snapshot) => {
  // Real-time updates
})
```

### Learning Goals:
- [ ] Understand real-time subscription patterns
- [ ] Implement chat/messaging
- [ ] Build notifications system
- [ ] Handle connection states

---

## Week 7-8: Deployment

### Local Testing with Docker
```bash
# Build image
docker build -t soulsync .

# Run container
docker run -p 3000:3000 soulsync

# Test at localhost:3000
```

### Deploy to Coolify
```
1. Get VPS server ($6-10/month)
2. Install Coolify
3. Connect GitHub repository
4. Configure environment variables
5. Deploy! (auto CI/CD)
```

### Alternative: Free Tier Options (Learning)
- **Vercel** (Next.js creators): FREE tier, best for Next.js, unlimited bandwidth
- **Fly.io**: Free tier available, easy deployment
- **Railway**: Free $5/month credit + pay-as-you-go
- **Render**: Free tier with auto-sleep (respins after 30 min)
- **AWS EC2**: Free tier 750 hours/month for 12 months
- **Oracle Cloud**: Always-free tier (unlimited, no expiry)

---

# Complete Implementation Timeline

## Full Migration (12 Weeks)

```
PHASE 1: Next.js Setup (Week 1-2)
├── Create Next.js project
├── Migrate React components
├── Setup project structure
└── Test locally

PHASE 2: API Migration (Week 3)
├── Create API routes
├── Migrate Express endpoints
├── Implement middleware
└── Test all endpoints

PHASE 3: Authentication (Week 4)
├── Choose: JWT, Supabase, or Firebase
├── Implement auth endpoints
├── Setup protected routes
└── Add role-based access

PHASE 4: Database (Week 5-6)
├── Option A: Keep MongoDB
├── Option B: Migrate to Supabase (PostgreSQL)
├── Option C: Switch to Firebase
└── Migrate schemas & data

PHASE 5: Real-Time Features (Week 7-8)
├── Replace Socket.IO if using Supabase/Firebase
├── Implement messaging
├── Add notifications
└── Test real-time updates

PHASE 6: File Storage (Week 9)
├── Setup Firebase Storage / Supabase Storage
├── Implement image upload
├── Add image optimization
└── Test file management

PHASE 7: Testing & Optimization (Week 10)
├── Unit tests
├── Integration tests
├── Performance optimization
└── Security audit

PHASE 8: Deployment (Week 11-12)
├── Setup Coolify on VPS
├── Configure database
├── Setup CI/CD
└── Deploy to production
```

---

# Quick Start (Minimal: 2 Weeks)

If you just want to learn **one thing** at a time:

## Week 1: Next.js Basic App

```bash
# 1. Create app
npx create-next-app@latest nextjs-demo --typescript --tailwind

# 2. Copy your components
cp -r client/src/components nextjs-demo/src/app/

# 3. Create simple pages
# src/app/page.tsx (home)
# src/app/login/page.tsx (login)

# 4. Create one API route
# src/app/api/auth/login/route.ts

# 5. Run and test
npm run dev
# Visit localhost:3000
```

## Week 2: Deploy Free

```bash
# Deploy to Vercel (1 click)
npm install -g vercel
vercel

# Your app is live! 🎉
```

---

# Troubleshooting

## Common Issues & Solutions

### Next.js Issues

**Problem: Module not found**
```bash
# Solution: Check imports, use @/ alias
import Component from '@/components/Button'  ✅
import Component from '../../../components/Button'  ❌
```

**Problem: API routes not working**
```bash
# Make sure:
# 1. File is in src/app/api/*/route.ts
# 2. Export GET, POST, etc functions
# 3. Use NextRequest, NextResponse types

export async function POST(request: NextRequest) {
  // Implementation
}
```

### Database Issues

**MongoDB Connection:**
```bash
# Check URI format
mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Enable network access in MongoDB Atlas
# IP Address: 0.0.0.0/0 (or specific IP)
```

**Supabase Connection:**
```bash
# Check credentials
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### Deployment Issues

**Coolify Docker Build Fails:**
```bash
# Check Dockerfile is in root
# Check .dockerignore excludes node_modules
# View logs: Coolify → Logs
```

**Cold Start on Vercel:**
```bash
# Use production build locally to test
npm run build
npm start

# Check build time
# Optimize dependencies
```

---

# Resources & Learning Links

## Official Documentation
- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Firebase**: https://firebase.google.com/docs
- **Coolify**: https://coolify.io/docs

## Video Tutorials
- **Next.js**: https://www.youtube.com/watch?v=wm5gMKuwSYk
- **Supabase**: https://www.youtube.com/watch?v=I6nnp9qKJ7A
- **Firebase**: https://www.youtube.com/watch?v=jCQeLEH60Gg
- **Coolify**: https://www.youtube.com/watch?v=EEqnhBl7aVU

## Interactive Courses
- **Next.js**: Vercel's official course (free)
- **Supabase**: https://www.youtube.com/c/supabase
- **Firebase**: Google Cloud Skills Boost

## Communities
- **Next.js**: https://github.com/vercel/next.js/discussions
- **Supabase**: https://discord.gg/bnncdZpByc
- **Firebase**: https://stackoverflow.com (tag: firebase)

---

# Real credentials: where to get them and what to use

This project is already wired for a practical hybrid setup:

- Use Supabase Auth for login/register by default.
- Use Firebase only for realtime messaging demo and optional push/notification features.
- Use Prisma only when you have a real PostgreSQL connection (Supabase Postgres or another Postgres instance).
- Use Coolify only on a VPS you control; it is not something already installed in this environment.

## 1) Supabase: where to get the values

Go to the Supabase Dashboard for your project:

1. Open https://supabase.com
2. Create or open a project.
3. In the left sidebar, click Project Settings.
4. Open the API tab.
5. Copy these values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

Important rules:

- Public keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) can be used in the browser.
- Service role key is server-only. Never expose it to the frontend.
- The service role key bypasses Row Level Security (RLS), so it is powerful and should be used only in trusted server code.

### Supabase DB URL and password

1. Go to Project Settings → Database.
2. Look for Connection string / Connection pooling / Session mode.
3. Copy the PostgreSQL connection string.
4. Your password is the Postgres password shown or reset from the database settings.

Example:

```bash
DATABASE_URL="postgresql://postgres.[project-ref]:[your-password]@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[your-password]@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"
```

If Prisma is not working, the usual issue is that:

- the database password is wrong
- the project is paused or not active
- you are using the wrong pooler URL
- the database is not reachable from your current environment

## 2) Firebase: where to get the values

1. Open https://console.firebase.google.com/
2. Select your project.
3. Click the gear icon → Project settings.
4. Go to the General tab.
5. Scroll to Your apps.
6. If there is a web app, click the web icon (`</>`).
7. Copy the config object:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};
```

Then map them to:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

Important:

- Firebase web config is public and safe to put in the browser.
- Private Firebase admin credentials (service account JSON) must stay only on the server.

## 3) What auth should you use?

For this project, my recommendation is:

- Use Supabase Auth for user login/register.
- Use Firebase only for chat / realtime features.

Why this is the best practical match:

- Supabase Auth is easier if you plan to use Postgres + Prisma and want SQL-based profiles and relational data.
- Firebase Auth is good if you want Google ecosystem auth and you do not want to manage a separate database auth layer.
- But for SoulSync, you are already using Supabase as the main data and auth platform, so Supabase Auth is the cleaner default.

In other words:

- login/register = Supabase Auth
- chat messaging = Firebase Firestore
- database profiles = Prisma + Supabase Postgres

This gives you a very practical architecture without forcing one tool to do everything.

## 4) Prisma: when to use it and what it needs

Prisma is useful when you want:

- type-safe database queries
- easier schema management
- better CRUD patterns
- future migrations and relational models

It is not mandatory for every project. You can use Prisma with:

- Supabase Postgres
- a local Postgres
- a managed Postgres elsewhere

You need a real `DATABASE_URL` for it to work:

```bash
DATABASE_URL="postgresql://postgres:password@host:5432/postgres?schema=public"
DIRECT_URL="postgresql://postgres:password@host:5432/postgres"
```

If you do not have a real Postgres database yet, Prisma will keep showing "not configured" or connection-related failures.

## 5) Coolify: how to check if you have it

On this machine, Coolify is not installed. That means:

- there is no local Coolify binary
- there is no active Coolify container or service in this environment
- you would need to install it on your VPS or some remote machine

To check on your own machine:

```bash
which coolify
coolify --version
```

If it is not installed, you can install it on a VPS/server by following the official Coolify docs and Docker setup.

Typical free/self-hosted approach:

- VPS: smallest affordable instance, often $5-10/month
- Install Docker
- Install Coolify
- Connect GitHub repo
- Deploy your Next.js app with environment variables

You do not need a paid Vercel account just to learn.

## 6) Vercel: frontend or backend?

Vercel is best for frontend and Next.js app hosting.

It can host:

- Next.js frontend
- API routes
- serverless functions

It is not the best place for everything if you want to self-host a full app on your own VPS with Docker and custom infra. That is where Coolify is useful.

In practice:

- Vercel = easiest and free for frontend/Next.js
- Coolify = self-hosted VPS deployment workflow
- Express backend = can still run on a VPS or another Node runtime

## 7) Recommended stack for your project

For SoulSync, the most practical setup is:

- Frontend: Next.js
- Authentication: Supabase Auth
- Database: Supabase Postgres + Prisma
- Realtime chat: Firebase Firestore
- Deployment: Coolify on VPS
- Legacy API bridge: Express backend proxied through Next.js

This gives you a solid learning path without overcomplicating the app.

## 8) What to do next

1. Create or open your Supabase project
2. Copy all public + server keys into the `.env` file
3. Copy your Postgres URL and password
4. Create your Firebase project and add web config
5. Decide on auth: use Supabase Auth as default
6. Run Prisma `db push` once you have a valid `DATABASE_URL`
7. Start the Next.js app locally
8. Deploy the app through Coolify on a VPS

If you do not want to use real secrets yet, keep the app running in local demo mode while you learn how the stack works.

---

# Summary

This guide provides **4 possible integration paths**:

1. **Next.js Only** ⭐⭐⭐ (Best starting point)
   - Merge frontend + backend
   - Keep MongoDB
   - Learn modern full-stack

2. **Next.js + Supabase** ⭐⭐⭐⭐ (Recommended)
   - Learn PostgreSQL & SQL
   - Managed auth & real-time
   - Professional database

3. **Next.js + Firebase** ⭐⭐⭐⭐ (Google Cloud)
   - Learn GCP ecosystem
   - Firestore (NoSQL)
   - Easy deployment

4. **Full Migration** ⭐⭐⭐⭐⭐ (Advanced)
   - All technologies combined
   - Pick best components
   - Production ready

Start with **Week 1 Quick Start** and gradually integrate other technologies as you learn!

---

**Created**: 2026-09-10
**Last Updated**: 2026-09-10
**Version**: 1.0

---

### Next Steps

1. **Choose your path** (Next.js recommended)
2. **Follow Week 1-2 roadmap** (start small)
3. **Deploy to Vercel** (free, easy)
4. **Learn gradually** (one technology at a time)
5. **Refer back to this guide** for specific implementations

Good luck on your learning journey! 🚀
