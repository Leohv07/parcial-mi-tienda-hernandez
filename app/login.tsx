import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { s } from '../lib/styles';

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const ingresar = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Escribe tu correo y tu contraseña');
      return;
    }
    setCargando(true);
    const msg = await signIn(email.trim(), password);
    setCargando(false);
    if (msg) setError(msg);
  };

  return (
    <View style={[s.container, { justifyContent: 'center' }]}>
      <Text style={s.title}>🛒 Mi Tienda</Text>

      <Text style={s.label}>Correo</Text>
      <TextInput
        style={s.input}
        value={email}
        onChangeText={setEmail}
        placeholder="correo@ejemplo.com"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={s.label}>Contraseña</Text>
      <TextInput
        style={s.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        secureTextEntry
      />

      {error ? <Text style={s.error}>{error}</Text> : null}

      <Pressable style={s.btn} onPress={ingresar} disabled={cargando}>
        {cargando ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Ingresar</Text>}
      </Pressable>

      <Link href="/registro" style={s.link}>
        ¿No tienes cuenta? Regístrate
      </Link>
    </View>
  );
}