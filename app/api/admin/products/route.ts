import { NextRequest, NextResponse } from 'next/server';
import { getProducts, saveProducts } from '@/lib/storage';

const ADMIN_PASSWORD = 'canaria2026';

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${ADMIN_PASSWORD}`;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const products = await getProducts();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 20;
  const start = (page - 1) * pageSize;

  return NextResponse.json({
    data: products.slice(start, start + pageSize),
    total: products.length,
    page,
    pageSize,
    totalPages: Math.ceil(products.length / pageSize),
  });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const products = await getProducts();
  const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);

  const newProduct = {
    id: maxId + 1,
    name: body.name,
    description: body.description || '',
    price: body.price,
    image: body.image || '',
    category: body.category,
    stock: body.stock || 0,
  };

  products.push(newProduct);
  await saveProducts(products);

  return NextResponse.json(newProduct, { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, ...updates } = body;
  const products = await getProducts();
  const index = products.findIndex(p => p.id === id);

  if (index === -1) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });

  products[index] = { ...products[index], ...updates };
  await saveProducts(products);

  return NextResponse.json(products[index]);
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id') || '');
  const products = await getProducts();
  const filtered = products.filter(p => p.id !== id);

  if (filtered.length === products.length) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
  }

  await saveProducts(filtered);
  return NextResponse.json({ message: 'Producto eliminado correctamente' });
}
