import { useState } from 'react';
import { View, Text, FlatList, Pressable, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useProducts, isPending, formatPesos } from '../hooks/useProducts';
import { productsRepo } from '../db/repositories/products';
import { syncProducts } from '../services/sync';
import { s } from '../lib/styles';

export default function Principal() {
  const { session, signOut } = useAuth();
  const { products, totalUnits, totalValue, pendingCount } = useProducts();
  const [mensaje, setMensaje] = useState('');
  const [sincronizando, setSincronizando] = useState(false);

  const sincronizar = async () => {
    if (!session) return;
    setSincronizando(true);
    setMensaje('');
    try {
      const r = await syncProducts(session.user.id);
      setMensaje(`✅ ${r.subidos} subidos, ${r.bajados} bajados`);
    } catch (e: any) {
      setMensaje(`❌ No se pudo sincronizar: ${e?.message ?? 'sin conexión'}`);
    } finally {
      setSincronizando(false);
    }
  };

  const confirmarEliminar = (id: number, name: string) => {
    Alert.alert('Eliminar producto', `¿Seguro que quieres eliminar "${name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => productsRepo.remove(id) },
    ]);
  };

  return (
    <View style={s.container}>
      <Text style={st.usuario}>👤 {session?.user.email}</Text>

      <View style={st.resumen}>
        <Text style={st.resumenText}>Unidades: {totalUnits}</Text>
        <Text style={st.resumenText}>Valor: {formatPesos(totalValue)}</Text>
        <Text style={st.resumenText}>Pendientes de subir: {pendingCount}</Text>
      </View>

      <View style={st.fila}>
        <Pressable style={[s.btn, st.flex]} onPress={() => router.push('/producto')}>
          <Text style={s.btnText}>+ Agregar</Text>
        </Pressable>
        <Pressable style={[s.btn, st.flex, { backgroundColor: '#16a34a' }]} onPress={sincronizar} disabled={sincronizando}>
          {sincronizando ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>⟳ Sincronizar</Text>}
        </Pressable>
      </View>

      {mensaje ? <Text style={st.mensaje}>{mensaje}</Text> : null}

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={st.vacio}>No hay productos. Agrega el primero.</Text>}
        renderItem={({ item }) => {
          const pendiente = isPending(item);
          return (
            <Pressable
              style={st.item}
              onPress={() => router.push({ pathname: '/producto', params: { id: String(item.id) } })}
              onLongPress={() => confirmarEliminar(item.id, item.name)}
            >
              <View style={st.flex}>
                <Text style={st.nombre}>{item.name}</Text>
                <Text>
                  {item.quantity} und × {formatPesos(item.price)}
                </Text>
              </View>
              <Text style={[st.badge, pendiente ? st.pendiente : st.nube]}>
                {pendiente ? '⏳ Pendiente' : '☁️ En la nube'}
              </Text>
            </Pressable>
          );
        }}
      />

      <Text style={st.ayuda}>Toca un producto para editarlo, mantenlo presionado para eliminarlo.</Text>

      <Pressable style={[s.btn, { backgroundColor: '#dc2626' }]} onPress={signOut}>
        <Text style={s.btnText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

const st = StyleSheet.create({
  usuario: { color: '#555' },
  resumen: { backgroundColor: '#eff6ff', padding: 12, borderRadius: 8, gap: 4 },
  resumenText: { fontSize: 16, fontWeight: '600' },
  fila: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
  mensaje: { textAlign: 'center', fontWeight: '600' },
  vacio: { textAlign: 'center', color: '#777', marginTop: 20 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  nombre: { fontSize: 17, fontWeight: 'bold' },
  badge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, overflow: 'hidden', fontSize: 12 },
  pendiente: { backgroundColor: '#fef3c7', color: '#92400e' },
  nube: { backgroundColor: '#dcfce7', color: '#166534' },
  ayuda: { textAlign: 'center', color: '#777', fontSize: 12 },
});