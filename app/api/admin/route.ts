import { NextRequest, NextResponse } from 'next/server';
import { getOrders } from '@/lib/storage';

const ADMIN_PASSWORD = 'canaria2026';

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${ADMIN_PASSWORD}`;
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password === ADMIN_PASSWORD) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
