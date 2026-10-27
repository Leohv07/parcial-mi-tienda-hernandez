import { supabase } from '../lib/supabase';
import { productsRepo } from '../db/repositories/products';

export async function syncProducts(userId: string): Promise<{ subidos: number; bajados: number }> {
  // 1. BAJAR: traer los productos del usuario e insertar los que no existan localmente
  const { data, error } = await supabase.from('products').select('*').eq('user_id', userId);
  if (error) throw new Error(error.message);

  let bajados = 0;
  for (const remoto of data ?? []) {
    const local = await productsRepo.getByClientId(remoto.client_id);
    if (!local) {
      await productsRepo.insertFromCloud({
        clientId: remoto.client_id,
        name: remoto.name,
        quantity: remoto.quantity,
        price: remoto.price,
        updatedAt: new Date(remoto.updated_at),
      });
      bajados++;
    }
  }

  // 2. SUBIR: upsert de los pendientes por client_id (no duplica)
  const pendientes = await productsRepo.getPending();
  let subidos = 0;
  for (const p of pendientes) {
    const { error: upError } = await supabase.from('products').upsert(
      {
        client_id: p.clientId,
        name: p.name,
        quantity: p.quantity,
        price: p.price,
        updated_at: p.updatedAt.toISOString(),
      },
      { onConflict: 'client_id' }
    );
    if (upError) throw new Error(upError.message);

    // syncedAt = el updatedAt que se subió
    await productsRepo.markSynced(p.id, p.updatedAt);
    subidos++;
  }

  return { subidos, bajados };
}