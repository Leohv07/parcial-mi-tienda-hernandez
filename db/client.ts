import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

// enableChangeListener es necesario para que useLiveQuery sea reactivo
const expoDb = openDatabaseSync('mitienda.db', { enableChangeListener: true });

export const db = drizzle(expoDb, { schema });