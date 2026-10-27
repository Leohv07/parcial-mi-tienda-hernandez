import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { productsRepo } from '../db/repositories/products';
import type { Product } from '../db/schema';

export function isPending(p: Product): boolean {
  return p.syncedAt == null || p.syncedAt.getTime() < p.updatedAt.getTime();
}

export function formatPesos(n: number): string {
  return '$' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function useProducts() {
  const { data } = useLiveQuery(productsRepo.allQuery());
  const products = data ?? [];

  const totalUnits = products.reduce((acc, p) => acc + p.quantity, 0);
  const totalValue = products.reduce((acc, p) => acc + p.quantity * p.price, 0);
  const pendingCount = products.filter(isPending).length;

  return { products, totalUnits, totalValue, pendingCount };
}