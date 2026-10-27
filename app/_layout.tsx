import { Stack } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../drizzle/migrations';
import { db } from '../db/client';
import { AuthProvider, useAuth } from '../context/AuthContext';

function Cargando() {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

function RootNavigator() {
  const { session, loading } = useAuth();
  if (loading) return <Cargando />;

  return (
    <Stack>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="login" options={{ title: 'Iniciar sesión' }} />
        <Stack.Screen name="registro" options={{ title: 'Registro' }} />
      </Stack.Protected>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="index" options={{ title: 'Mi Tienda' }} />
        <Stack.Screen name="producto" options={{ title: 'Producto' }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text>Error en la migración: {error.message}</Text>
      </View>
    );
  }
  if (!success) return <Cargando />;

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}