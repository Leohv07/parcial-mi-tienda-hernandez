import * as Crypto from 'expo-crypto';
import { desc, eq, isNull, lt, or } from 'drizzle-orm';
import { db } from '../client';
import { products } from '../schema';

export type ProductInput = {
  name: string;
  quantity: number;
  price: number;
};

export const productsRepo = {
  // Consulta base que usa useLiveQuery en el hook
  allQuery() {
    return db.select().from(products).orderBy(desc(products.updatedAt));
  },

  async getById(id: number) {
    const rows = await db.select().from(products).where(eq(products.id, id));
    return rows[0] ?? null;
  },

  async getByClientId(clientId: string) {
    const rows = await db.select().from(products).where(eq(products.clientId, clientId));
    return rows[0] ?? null;
  },

  async create(data: ProductInput) {
    await db.insert(products).values({
      ...data,
      clientId: Crypto.randomUUID(),
      updatedAt: new Date(),
      syncedAt: null,
    });
  },

  async update(id: number, data: ProductInput) {
    await db
      .update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(products.id, id));
  },

  async remove(id: number) {
    await db.delete(products).where(eq(products.id, id));
  },

  // Pendiente: nunca sincronizado, o modificado después de la última sincronización
  async getPending() {
    return db
      .select()
      .from(products)
      .where(or(isNull(products.syncedAt), lt(products.syncedAt, products.updatedAt)));
  },

  // Producto que viene de la nube: queda marcado como sincronizado
  async insertFromCloud(p: { clientId: string; name: string; quantity: number; price: number; updatedAt: Date }) {
    await db.insert(products).values({ ...p, syncedAt: p.updatedAt });
  },

  async markSynced(id: number, syncedAt: Date) {
    await db.update(products).set({ syncedAt }).where(eq(products.id, id));
  },
};