// Vercel KV wrapper - falls back to in-memory for local dev
import type { Product, User, Order, DiscountCode } from './types';

let kv: any = null;

async function getKV() {
  if (kv) return kv;
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return memoryStore;
  }
  try {
    const { kv: vercelKv } = await import('@vercel/kv');
    kv = vercelKv;
    return kv;
  } catch {
    return memoryStore;
  }
}

const memStore: Record<string, any> = {};
const memoryStore = {
  get: async (key: string) => memStore[key] ?? null,
  set: async (key: string, val: any) => { memStore[key] = val; return 'OK'; },
  del: async (key: string) => { delete memStore[key]; return 1; },
  sadd: async (key: string, ...members: string[]) => {
    if (!memStore[key]) memStore[key] = new Set<string>();
    members.forEach(m => memStore[key].add(m));
    return members.length;
  },
  smembers: async (key: string) => {
    if (!memStore[key]) return [];
    return Array.from(memStore[key] as Set<string>);
  },
  srem: async (key: string, ...members: string[]) => {
    if (!memStore[key]) return 0;
    members.forEach(m => memStore[key].delete(m));
    return members.length;
  },
};

export async function kvGet<T>(key: string): Promise<T | null> {
  const store = await getKV();
  return store.get(key);
}

export async function kvSet(key: string, value: any): Promise<void> {
  const store = await getKV();
  await store.set(key, value);
}

export async function kvDel(key: string): Promise<void> {
  const store = await getKV();
  await store.del(key);
}

export async function kvSAdd(key: string, ...members: string[]): Promise<void> {
  const store = await getKV();
  await store.sadd(key, ...members);
}

export async function kvSMembers(key: string): Promise<string[]> {
  const store = await getKV();
  return store.smembers(key) ?? [];
}

export async function kvSRem(key: string, ...members: string[]): Promise<void> {
  const store = await getKV();
  await store.srem(key, ...members);
}

export async function getProduct(id: string): Promise<Product | null> {
  return kvGet<Product>(`product:${id}`);
}

export async function saveProduct(product: Product): Promise<void> {
  await kvSet(`product:${product.id}`, product);
  await kvSAdd('products:all', product.id);
}

export async function deleteProduct(id: string): Promise<void> {
  await kvDel(`product:${id}`);
  await kvSRem('products:all', id);
}

export async function getAllProducts(): Promise<Product[]> {
  const ids = await kvSMembers('products:all');
  const products = await Promise.all(ids.map(id => getProduct(id)));
  return (products.filter(Boolean) as Product[]).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const id = await kvGet<string>(`user:email:${email.toLowerCase()}`);
  if (!id) return null;
  return kvGet<User>(`user:${id}`);
}

export async function getUserById(id: string): Promise<User | null> {
  return kvGet<User>(`user:${id}`);
}

export async function saveUser(user: User): Promise<void> {
  await kvSet(`user:${user.id}`, user);
  await kvSet(`user:email:${user.email.toLowerCase()}`, user.id);
}

export async function saveOrder(order: Order): Promise<void> {
  await kvSet(`order:${order.id}`, order);
  await kvSAdd('orders:all', order.id);
  if (order.userId) {
    await kvSAdd(`orders:user:${order.userId}`, order.id);
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  return kvGet<Order>(`order:${id}`);
}

export async function getAllOrders(): Promise<Order[]> {
  const ids = await kvSMembers('orders:all');
  const orders = await Promise.all(ids.map(id => getOrder(id)));
  return (orders.filter(Boolean) as Order[]).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getDiscount(code: string): Promise<DiscountCode | null> {
  return kvGet<DiscountCode>(`discount:${code.toUpperCase()}`);
}

export async function saveDiscount(discount: DiscountCode): Promise<void> {
  await kvSet(`discount:${discount.code.toUpperCase()}`, discount);
  await kvSAdd('discounts:all', discount.code.toUpperCase());
}

export async function deleteDiscount(code: string): Promise<void> {
  await kvDel(`discount:${code.toUpperCase()}`);
  await kvSRem('discounts:all', code.toUpperCase());
}

export async function getAllDiscounts(): Promise<DiscountCode[]> {
  const codes = await kvSMembers('discounts:all');
  const discounts = await Promise.all(codes.map(c => getDiscount(c)));
  return discounts.filter(Boolean) as DiscountCode[];
}

export async function seedIfEmpty() {
  const ids = await kvSMembers('products:all');
  if (ids.length > 0) return;

  const { v4: uuidv4 } = await import('uuid');
  const products: Product[] = [
    {
      id: uuidv4(), name: "Vintage Levi's 501 Jeans", price: 89, originalPrice: 120,
      category: 'Bottoms', images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600'],
      description: "Klassische Levi's 501 aus den 90ern. Stonewash-Optik, leichte Distressing-Details.",
      stock: 3, tags: ['denim', 'jeans', '90s'], featured: true, createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(), name: 'Oversized Flannel Shirt', price: 45, originalPrice: 65,
      category: 'Tops', images: ['https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600'],
      description: 'Weiches Flanellhemd im Oversized-Schnitt. Perfekt für den Layered-Look.',
      stock: 5, tags: ['flannel', 'shirt', 'grunge'], featured: true, createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(), name: 'Vintage Champion Hoodie', price: 75, originalPrice: 95,
      category: 'Tops', images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600'],
      description: 'Originales Champion-Hoodie aus den frühen 2000ern. Reverse Weave Material.',
      stock: 2, tags: ['champion', 'hoodie', 'streetwear'], featured: false, createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(), name: 'Corduroy Blazer', price: 110, originalPrice: 150,
      category: 'Outerwear', images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4462?w=600'],
      description: 'Eleganter Cord-Blazer aus den 70ern. Braun mit goldenen Knöpfen.',
      stock: 1, tags: ['blazer', 'corduroy', '70s'], featured: true, createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(), name: 'Vintage Band Tee', price: 35, originalPrice: 50,
      category: 'Tops', images: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600'],
      description: 'Originalshirt aus den 90ern. Verblasste Prints, authentisches Feeling.',
      stock: 8, tags: ['band tee', 't-shirt', '90s'], featured: false, createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(), name: 'Leather Bomber Jacket', price: 195, originalPrice: 280,
      category: 'Outerwear', images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'],
      description: 'Echtes Leder, Vintage-Bomber aus den 80ern. Zeitlose Silhouette.',
      stock: 1, tags: ['leather', 'bomber', '80s'], featured: true, createdAt: new Date().toISOString(),
    },
  ];

  for (const p of products) {
    await saveProduct(p);
  }
}
