import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { productsRepo } from '../db/repositories/products';
import { s } from '../lib/styles';

const esEnteroValido = (v: string) => /^\d+$/.test(v.trim());

export default function ProductoForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editando = !!id;

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(editando);

  useEffect(() => {
    if (!id) return;
    productsRepo.getById(Number(id)).then((p) => {
      if (p) {
        setName(p.name);
        setQuantity(String(p.quantity));
        setPrice(String(p.price));
      }
      setCargando(false);
    });
  }, [id]);

  const guardar = async () => {
    setError('');
    if (!name.trim()) return setError('El nombre es obligatorio');
    if (!esEnteroValido(quantity)) return setError('La cantidad debe ser un número entero mayor o igual a 0');
    if (!esEnteroValido(price)) return setError('El precio debe ser un número entero mayor o igual a 0');

    const data = {
      name: name.trim(),
      quantity: parseInt(quantity, 10),
      price: parseInt(price, 10),
    };

    if (editando) await productsRepo.update(Number(id), data);
    else await productsRepo.create(data);

    router.back();
  };

  if (cargando) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={s.container}>
      <Stack.Screen options={{ title: editando ? 'Editar producto' : 'Nuevo producto' }} />

      <Text style={s.label}>Nombre</Text>
      <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Ej: Arroz Diana 500 g" />

      <Text style={s.label}>Cantidad (unidades)</Text>
      <TextInput style={s.input} value={quantity} onChangeText={setQuantity} placeholder="0" keyboardType="number-pad" />

      <Text style={s.label}>Precio (pesos)</Text>
      <TextInput style={s.input} value={price} onChangeText={setPrice} placeholder="0" keyboardType="number-pad" />

      {error ? <Text style={s.error}>{error}</Text> : null}

      <Pressable style={s.btn} onPress={guardar}>
        <Text style={s.btnText}>{editando ? 'Guardar cambios' : 'Agregar producto'}</Text>
      </Pressable>
    </View>
  );
}