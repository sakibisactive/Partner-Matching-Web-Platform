# ⚡ Quick Reference: Installation & Setup Commands

This file contains all the commands and code snippets you need to get started quickly.

---

## 🚀 Quick Setup Commands (Copy-Paste Ready)

### 1️⃣ Create Next.js Project (5 minutes)

```bash
# Navigate to your workspace
cd /home/sakib/myProjects/Partner-Matching-Web-Platform

# Create Next.js project
npx create-next-app@latest nextjs-soulsync \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --turbopack \
  --no-git

# Navigate into project
cd nextjs-soulsync

# Install additional dependencies
npm install @reduxjs/toolkit react-redux axios socket.io-client \
  bcryptjs jsonwebtoken framer-motion recharts zod react-hook-form

# Start development server
npm run dev
```

**Expected Output:**
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

### 2️⃣ Setup Environment Variables

**Create `.env.local` in nextjs-soulsync root:**

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/soulsync

# Server
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
REFRESH_TOKEN_SECRET=your_refresh_token_secret_min_32_chars

# Cloudinary (optional - for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Brevo)
BREVO_API_KEY=your_brevo_key
MAIL_FROM=noreply@soulsync.com
```

---

### 3️⃣ Supabase Setup (10 minutes)

```bash
# Install Supabase
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# Add to .env.local:
cat >> .env.local << 'EOF'

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
EOF
```

**Steps in Supabase Console:**

```
1. Visit: https://supabase.com/dashboard
2. Create new project:
   - Name: soulsync
   - Password: Strong password
   - Region: Choose closest to you
3. Copy URL and keys from project settings
4. Run SQL schema (see schema.sql in INTEGRATION_GUIDE.md)
```

---

### 4️⃣ Firebase Setup (10 minutes)

```bash
# Install Firebase
npm install firebase

# Add to .env.local:
cat >> .env.local << 'EOF'

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
EOF
```

**Steps in Firebase Console:**

```
1. Visit: https://console.firebase.google.com
2. Create new project (soulsync)
3. Create web app
4. Copy config from project settings
5. Enable Authentication (Email/Password, Google)
6. Create Firestore Database
7. Create Storage bucket
```

---

### 5️⃣ Coolify Deployment Setup (15 minutes)

#### On Your Server:

```bash
# Connect to your VPS
ssh root@your_server_ip

# Install Coolify
curl -fsSL https://get.coollabs.io/coolify/install.sh | bash

# Wait for installation (2-5 minutes)
# Access at: https://your_server_ip:3000
```

#### In Your Next.js Project:

```bash
# Create Dockerfile
cat > Dockerfile << 'EOF'
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
EOF

# Create .dockerignore
cat > .dockerignore << 'EOF'
node_modules
.next
.git
.gitignore
README.md
.env.local
.env.*.local
coverage
.env
EOF

# Build and test locally
docker build -t soulsync .
docker run -p 3000:3000 soulsync
```

---

## 📁 Project Structure Setup

### Copy Components from Current Project

```bash
# From your nextjs-soulsync directory

# Copy React components
cp -r ../client/src/components ./src/app/components

# Copy hooks
cp -r ../client/src/hooks ./src/hooks

# Copy styles
cp ../client/src/index.css ./src/styles/globals.css

# Copy Redux (state management)
cp -r ../client/src/redux ./src/redux

# Copy types/interfaces
cp -r ../client/src/types ./src/types 2>/dev/null || echo "Types folder doesn't exist, create as needed"
```

### Project Structure After Setup

```
nextjs-soulsync/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes (replaces Express)
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts
│   │   │   │   └── logout/
│   │   │   │       └── route.ts
│   │   │   ├── profile/
│   │   │   ├── matches/
│   │   │   └── messages/
│   │   ├── (routes)/               # Page groups
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/
│   │   │   └── admin/
│   │   ├── components/             # Shared components
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── hooks/                      # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useSocket.ts
│   │   └── useSupabase.ts
│   ├── lib/                        # Utilities
│   │   ├── firebase.ts
│   │   ├── supabase.ts
│   │   ├── db.ts                   # Database connection
│   │   └── models/                 # Mongoose models (if using MongoDB)
│   ├── redux/                      # Redux store
│   ├── styles/
│   │   └── globals.css
│   └── types/                      # TypeScript types
├── public/
├── .env.local
├── Dockerfile
├── .dockerignore
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 📝 Database Connection Examples

### MongoDB Connection (Keep Current)

**File: `src/lib/db.ts`**

```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => {
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
```

### Use in API Route

```typescript
import { connectDB } from '@/lib/db';

export async function GET(request: Request) {
  await connectDB();
  // Query database...
}
```

---

### Supabase Connection

**File: `src/lib/supabase.ts`**

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getServerSupabase() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

---

### Firebase Connection

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

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

---

## � Prisma Setup (Optional but Recommended for Supabase)

### Why Prisma?
- **Type-safe queries** - TypeScript knows your database schema
- **Auto-complete** - IDE suggests fields automatically
- **Auto-migrations** - Manage database changes easily
- **Less SQL strings** - Write JavaScript instead of SQL

### When to Use:
✅ **Use Prisma if:** Using Supabase (PostgreSQL)
❌ **Skip Prisma if:** Using Firebase, or prefer raw SQL

### Installation

```bash
# Install Prisma
npm install @prisma/client
npm install -D prisma

# Initialize Prisma
npx prisma init
```

### Configure Database URL

**Edit `.env.local`:**

```bash
# For Supabase
DATABASE_URL="postgresql://user:password@db.xxx.supabase.co:5432/postgres"
```

### Create Database Schema

**File: `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Profile {
  id    String   @id @default(cuid())
  name  String
  email String   @unique
  age   Int
  bio   String?
  
  matches      Match[] @relation("user1")
  matchedBy    Match[] @relation("user2")
  likes        Like[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Match {
  id                  String   @id @default(cuid())
  user1               Profile  @relation("user1", fields: [user1Id], references: [id])
  user1Id             String
  user2               Profile  @relation("user2", fields: [user2Id], references: [id])
  user2Id             String
  compatibilityScore  Float
  status              String   @default("pending")
  
  createdAt DateTime @default(now())
  @@unique([user1Id, user2Id])
}

model Like {
  id          String   @id @default(cuid())
  profile     Profile  @relation(fields: [profileId], references: [id])
  profileId   String
  likedUserId String
  createdAt   DateTime @default(now())
  
  @@unique([profileId, likedUserId])
}
```

### Create Prisma Client

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

### Run Migration

```bash
# Create initial migration
npx prisma migrate dev --name init

# This will:
# 1. Create tables in Supabase
# 2. Generate TypeScript types
# 3. Create migration files
```

### Use Prisma in API Routes

```typescript
// app/api/matches/route.ts
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get('userId')
  
  // Type-safe! IDE auto-complete works
  const matches = await prisma.match.findMany({
    where: {
      user1Id: userId,
      compatibilityScore: { gte: 75 }
    },
    include: {
      user2: { select: { id: true, name: true, photo: true } }
    },
    orderBy: { compatibilityScore: 'desc' }
  })
  
  return Response.json({ matches })
}
```

### Common Prisma Commands

```bash
# View database in UI (useful for debugging)
npx prisma studio

# Generate client after schema changes
npx prisma generate

# Create new migration after schema changes
npx prisma migrate dev --name add_new_field

# Push schema to database (for CI/CD)
npx prisma db push

# Reset database (warning: deletes all data!)
npx prisma migrate reset
```

---

## �🔄 Supabase vs Firebase: Practical Operations

### Fetching User Data (Complex Query)

#### Supabase (SQL)
```typescript
// Simple, powerful SQL queries
export async function getUserWithMatches(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      matches:matches_user1_fkey(
        id,
        user2:profiles!matches_user2_id_fkey(name, age, photo),
        compatibility_score,
        status
      )
    `)
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

// One query does everything! ✅
```

#### Firebase (NoSQL)
```typescript
// Must fetch in steps
export async function getUserWithMatches(userId: string) {
  // 1. Fetch user
  const userSnap = await getDoc(doc(db, 'profiles', userId))
  const user = userSnap.data()
  
  // 2. Fetch all matches for user
  const matchesSnap = await getDocs(
    query(collection(db, 'matches'), where('user1_id', '==', userId))
  )
  
  // 3. Fetch each user2's details (N+1 problem!)
  const matches = await Promise.all(
    matchesSnap.docs.map(async (matchDoc) => {
      const match = matchDoc.data()
      const user2Snap = await getDoc(doc(db, 'profiles', match.user2_id))
      return { ...match, user2: user2Snap.data() }
    })
  )
  
  return { ...user, matches }
}

// Multiple queries needed ⚠️
```

---

### Creating Record with Validation

#### Supabase (Database Constraints)
```typescript
// Supabase handles validation at DB level
export async function createLike(userId: string, likedUserId: string) {
  const { data, error } = await supabase
    .from('likes')
    .insert({
      user_id: userId,
      liked_user_id: likedUserId,
      created_at: new Date()
      // Constraints handle:
      // - user_id, liked_user_id NOT NULL
      // - No duplicate likes (UNIQUE constraint)
      // - Foreign key validation
    })
    .select()
  
  if (error) {
    if (error.code === '23505') return { error: 'Already liked' }
    throw error
  }
  return { data }
}
```

#### Firebase (Manual Validation)
```typescript
// Must validate in code first
export async function createLike(userId: string, likedUserId: string) {
  // Validate manually
  if (!userId || !likedUserId) throw new Error('Missing IDs')
  if (userId === likedUserId) throw new Error('Cannot like yourself')
  
  // Check if already liked (separate query!)
  const existingSnap = await getDocs(
    query(collection(db, 'likes'),
      where('user_id', '==', userId),
      where('liked_user_id', '==', likedUserId)
    )
  )
  
  if (!existingSnap.empty) return { error: 'Already liked' }
  
  // Now insert
  const docRef = await addDoc(collection(db, 'likes'), {
    user_id: userId,
    liked_user_id: likedUserId,
    created_at: new Date()
  })
  
  return { data: { id: docRef.id } }
}
```

---

### Real-time Subscriptions

#### Supabase (Subscription)
```typescript
// Listen for changes on messages table
export function subscribeToMessages(chatId: string) {
  return supabase
    .from('messages')
    .on('INSERT', (payload) => {
      if (payload.new.chat_id === chatId) {
        console.log('New message:', payload.new)
      }
    })
    .subscribe()
}

// Unsubscribe when done
subscription.unsubscribe()
```

#### Firebase (Listener)
```typescript
// Listen for changes on messages collection
export function subscribeToMessages(chatId: string) {
  return onSnapshot(
    query(
      collection(db, 'messages'),
      where('chat_id', '==', chatId)
    ),
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          console.log('New message:', change.doc.data())
        }
      })
    }
  )
}

// Unsubscribe when done
unsubscribe()
```

---

### When to Use Each

**Choose Supabase if:**
- You're doing complex matching queries (JOINs, aggregations)
- You need database constraints and validations
- You have relational data (users → likes → matches)
- You want cost control with large databases

**Choose Firebase if:**
- You want simplicity and fast prototyping
- Your data is mostly independent documents
- You need strong mobile app integration
- You're in Google ecosystem

**Use Both if:**
- Supabase for matching algorithm, reports, complex queries
- Firebase for real-time chat, notifications, presence

---

## 🔐 Authentication Examples

### Next.js + JWT Auth

**File: `src/app/api/auth/register/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/lib/models/User';
import { connectDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

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
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    // Generate JWT tokens
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

    // Set secure cookies
    const response = NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
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
import { connectDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Find user with password field selected
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
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

    // Set cookies
    const response = NextResponse.json(
      {
        message: 'Login successful',
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

---

### Supabase Auth

```typescript
// Install
npm install @supabase/supabase-js

// Sign up
const { error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
});

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password',
});

// Logout
await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

---

### Firebase Auth

```typescript
// Install
npm install firebase

// Sign up
import { createUserWithEmailAndPassword } from 'firebase/auth';

await createUserWithEmailAndPassword(auth, email, password);

// Login
import { signInWithEmailAndPassword } from 'firebase/auth';

await signInWithEmailAndPassword(auth, email, password);

// Logout
import { signOut } from 'firebase/auth';

await signOut(auth);

// Get current user
import { onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, (user) => {
  console.log('Current user:', user);
});
```

---

## 📊 Real-Time Features Setup

### Supabase Real-time Subscriptions

```typescript
// Listen to messages in real-time
const channel = supabase
  .channel('messages')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'messages',
    },
    (payload) => {
      console.log('New message:', payload.new);
    }
  )
  .subscribe();

// Cleanup
channel.unsubscribe();
```

### Firebase Real-time Listeners

```typescript
import { onSnapshot, collection, query, where } from 'firebase/firestore';

const q = query(
  collection(db, 'messages'),
  where('matchId', '==', matchId)
);

onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      console.log('New message:', change.doc.data());
    }
  });
});
```

### Socket.IO (if keeping)

```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('new_message', (message) => {
  console.log('New message:', message);
});

socket.emit('send_message', {
  matchId: '123',
  content: 'Hello!',
});
```

---

## 📦 Deployment Commands

### 🎯 Deploy COMPLETELY FREE (Recommended for Learning)

#### Option 1: Vercel (Best for Next.js - FREE - Frontend + Backend Combined)

```bash
# This is the easiest! Vercel made Next.js
# It deploys BOTH your frontend AND backend API Routes as serverless functions!

npm i -g vercel
vercel

# Follow prompts, click deploy
# Your app is live at: https://your-project.vercel.app

# Your API routes automatically become serverless functions:
# /app/api/auth/login → https://your-project.vercel.app/api/auth/login
# /app/api/users → https://your-project.vercel.app/api/users
# etc.

# FREE tier includes:
#   - Unlimited frontend deployments
#   - Unlimited serverless function calls (with fair use)
#   - Auto SSL/HTTPS
#   - Database connections to MongoDB/Supabase/Firebase
#   - Custom domains
#   - Environment variables
```

#### Option 2: Railway (FREE - $5/month credit)

```bash
# Visit: https://railway.app
# Sign in with GitHub
# Create new project
# Connect your GitHub repo
# Add environment variables
# Railway auto-deploys on every push!
# FREE: $5/month credit (enough for dev/learning)
```

#### Option 3: AWS EC2 (FREE - 12 months)

```bash
# Visit: https://aws.amazon.com/free
# Create account, get t2.micro instance FREE for 12 months
# Then follow Coolify setup below
```

#### Option 4: Oracle Cloud (FREE - Always Free)

```bash
# Visit: https://www.oracle.com/cloud/free
# Sign up, get 2 ARM instances FOREVER (no expiry)
# Perfect for Coolify deployment!
# Then follow Coolify setup below
```

### Deploy to Vercel (Easiest - Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Deploy to Coolify (Self-hosted)

```bash
# Build locally first
npm run build
npm start

# Create Dockerfile (already created above)

# Push to GitHub
git add .
git commit -m "Add Next.js migration"
git push origin main

# In Coolify Dashboard:
# 1. Create new project
# 2. Add GitHub repository
# 3. Set environment variables
# 4. Click Deploy!
```

### Deploy to Docker (Local Testing)

```bash
# Build
docker build -t soulsync .

# Run
docker run -p 3000:3000 \
  -e MONGODB_URI="mongodb://..." \
  -e JWT_SECRET="your_secret" \
  soulsync

# Push to Docker Hub
docker tag soulsync yourusername/soulsync:latest
docker push yourusername/soulsync:latest
```

---

## ✅ Verification Checklist

After setup, verify everything works:

```bash
# [ ] Next.js starts
npm run dev
# Visit http://localhost:3000

# [ ] API routes work
curl http://localhost:3000/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'

# [ ] Database connects
# Check console for no errors

# [ ] Environment variables loaded
curl http://localhost:3000/api/health
# Should return { "status": "ok" }

# [ ] Build works
npm run build
npm start
# Should start on http://localhost:3000

# [ ] Components render
# Visit app routes in browser
```

---

## 🐛 Debugging Tips

### Enable Debug Logging

```typescript
// Add to your API routes
console.log('Received request:', request.method);
console.log('Body:', await request.json());
console.log('Database connected:', mongoose.connection.readyState);
```

### View Build Errors

```bash
# Detailed build output
npm run build 2>&1 | tee build.log

# Next.js diagnostics
npx next telemetry enable  # For better error reporting
npm run build
```

### Check Environment Variables

```bash
# In a route
export async function GET() {
  return NextResponse.json({
    mongodb: !!process.env.MONGODB_URI,
    jwt: !!process.env.JWT_SECRET,
    supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    firebase: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}
```

---

## 📞 Getting Help

If something doesn't work:

1. **Check the logs**: `npm run build` or browser console
2. **Verify environment variables**: Make sure all are set in `.env.local`
3. **Test database connection**: Try connecting separately
4. **Check documentation**: Refer to INTEGRATION_GUIDE.md
5. **Search GitHub issues**: Most problems are already solved
6. **Ask in communities**:
   - Next.js: https://github.com/vercel/next.js/discussions
   - Supabase: https://discord.gg/bnncdZpByc
   - Firebase: Stack Overflow with `firebase` tag

---

**Last Updated**: 2026-09-10
**Version**: 1.0

---

### Ready to Start? 🚀

Pick one path and start with step 1:

1. **Create Next.js project** (Step 1️⃣)
2. **Setup environment** (Step 2️⃣)
3. **Choose database** (Step 3️⃣ or 4️⃣)
4. **Deploy** (See Deployment Commands)

Good luck! 💪
