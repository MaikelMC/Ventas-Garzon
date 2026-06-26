import { Product, Order } from './types';

const BLOB_FOLDER = 'data/';

function getBlobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

async function getJsonFromBlob(filename: string): Promise<any> {
  try {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: `${BLOB_FOLDER}${filename}` });
    if (blobs.length === 0) return null;
    const response = await fetch(blobs[0].downloadUrl);
    if (!response.ok) throw new Error('File not found');
    return await response.json();
  } catch {
    return null;
  }
}

async function saveJsonToBlob(filename: string, data: any): Promise<void> {
  const { put } = await import('@vercel/blob');
  await put(`${BLOB_FOLDER}${filename}`, JSON.stringify(data, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  });
}

async function getJsonFromLocal(filename: string): Promise<any> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'data', filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function saveJsonToLocal(filename: string, data: any): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const dir = path.join(process.cwd(), 'data');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), JSON.stringify(data, null, 2), 'utf-8');
}

function useBlob(): boolean {
  return !!getBlobToken();
}

export async function getProducts(): Promise<Product[]> {
  if (useBlob()) {
    const data = await getJsonFromBlob('products.json');
    return data || [];
  }
  const data = await getJsonFromLocal('products.json');
  return data || [];
}

export async function saveProducts(products: Product[]): Promise<void> {
  if (useBlob()) {
    await saveJsonToBlob('products.json', products);
  } else {
    await saveJsonToLocal('products.json', products);
  }
}

export async function getOrders(): Promise<Order[]> {
  if (useBlob()) {
    const data = await getJsonFromBlob('orders.json');
    return data || [];
  }
  const data = await getJsonFromLocal('orders.json');
  return data || [];
}

export async function saveOrders(orders: Order[]): Promise<void> {
  if (useBlob()) {
    await saveJsonToBlob('orders.json', orders);
  } else {
    await saveJsonToLocal('orders.json', orders);
  }
}

export async function uploadImageToBlob(file: File, filename: string): Promise<string> {
  if (useBlob()) {
    const { put } = await import('@vercel/blob');
    const blob = await put(`${BLOB_FOLDER}images/${filename}`, file, {
      access: 'public',
      contentType: file.type,
    });
    return blob.url;
  }
  return '';
}

export async function uploadImageBufferToBlob(buffer: Buffer, filename: string, contentType: string): Promise<string> {
  if (useBlob()) {
    const { put } = await import('@vercel/blob');
    const blob = await put(`${BLOB_FOLDER}images/${filename}`, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: true,
    });
    return blob.url;
  }
  return '';
}
