import { View, Text, Pressable } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { s } from '../lib/styles';

export default function Principal() {
  const { session, signOut } = useAuth();
  return (
    <View style={s.container}>
      <Text>Sesión: {session?.user.email}</Text>
      <Pressable style={s.btn} onPress={signOut}>
        <Text style={s.btnText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}