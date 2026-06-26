import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/storage';

export async function GET(req: NextRequest) {
  const products = await getProducts();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 50;

  let filtered = products;
  if (category) filtered = filtered.filter(p => p.category === category);

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const data = filtered.slice((page - 1) * pageSize, page * pageSize);

  return NextResponse.json({ data, total, page, pageSize, totalPages });
}
