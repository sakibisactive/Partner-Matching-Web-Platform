import { NextResponse } from 'next/server';
import { getSupabaseStatus } from '../../../lib/supabase';
import { getFirebaseStatus } from '../../../lib/firebase';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    framework: 'Next.js 15 (App Router)',
    app: 'SoulSync Partner Matching Platform',
    supabase: getSupabaseStatus(),
    firebase: getFirebaseStatus(),
    timestamp: new Date().toISOString(),
  });
}
