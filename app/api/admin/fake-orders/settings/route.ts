import { NextRequest, NextResponse } from 'next/server';

// Fake order detection settings API removed. Return 410 Gone for all methods.

export async function GET() {
  return new NextResponse('Fake order settings have been removed', { status: 410 });
}

export async function POST(_req: NextRequest) {
  return new NextResponse('Fake order settings have been removed', { status: 410 });
}
