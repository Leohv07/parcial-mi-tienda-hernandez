import * as SecureStore from 'expo-secure-store';

// SecureStore limita el tamaño por valor, así que la sesión se guarda en fragmentos
const CHUNK_SIZE = 1800;

async function removeItem(key: string): Promise<void> {
  const countStr = await SecureStore.getItemAsync(`${key}_count`);
  if (countStr) {
    const count = parseInt(countStr, 10);
    for (let i = 0; i < count; i++) {
      await SecureStore.deleteItemAsync(`${key}_${i}`);
    }
    await SecureStore.deleteItemAsync(`${key}_count`);
  }
}

async function getItem(key: string): Promise<string | null> {
  const countStr = await SecureStore.getItemAsync(`${key}_count`);
  if (!countStr) return null;
  const count = parseInt(countStr, 10);
  let value = '';
  for (let i = 0; i < count; i++) {
    const part = await SecureStore.getItemAsync(`${key}_${i}`);
    if (part === null) return null;
    value += part;
  }
  return value;
}

async function setItem(key: string, value: string): Promise<void> {
  await removeItem(key);
  const chunks: string[] = [];
  for (let i = 0; i < value.length; i += CHUNK_SIZE) {
    chunks.push(value.slice(i, i + CHUNK_SIZE));
  }
  for (let i = 0; i < chunks.length; i++) {
    await SecureStore.setItemAsync(`${key}_${i}`, chunks[i]);
  }
  await SecureStore.setItemAsync(`${key}_count`, String(chunks.length));
}

export const secureStorage = { getItem, setItem, removeItem };