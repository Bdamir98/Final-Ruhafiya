import { NextRequest, NextResponse } from 'next/server';

// Admin settings API removed. Return 410 Gone for all methods.

export async function GET(_req: NextRequest) {
  return new NextResponse('Admin settings have been removed', { status: 410 });
}

export async function POST(_req: NextRequest) {
  return new NextResponse('Admin settings have been removed', { status: 410 });
}

export async function PUT(_req: NextRequest) {
  return new NextResponse('Admin settings have been removed', { status: 410 });
}
