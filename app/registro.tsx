import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { s } from '../lib/styles';

export default function Registro() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const registrar = async () => {
    setError('');
    if (!email.trim()) return setError('El correo es obligatorio');
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres');
    if (password !== confirmar) return setError('Las contraseñas no coinciden');

    setCargando(true);
    const msg = await signUp(email.trim(), password);
    setCargando(false);
    if (msg) setError(msg);
    // Si no hay error, la sesión se inicia sola y la app pasa a la pantalla principal
  };

  return (
    <View style={[s.container, { justifyContent: 'center' }]}>
      <Text style={s.title}>Crear cuenta</Text>

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
        placeholder="Mínimo 6 caracteres"
        secureTextEntry
      />

      <Text style={s.label}>Confirmar contraseña</Text>
      <TextInput
        style={s.input}
        value={confirmar}
        onChangeText={setConfirmar}
        placeholder="Repite la contraseña"
        secureTextEntry
      />

      {error ? <Text style={s.error}>{error}</Text> : null}

      <Pressable style={s.btn} onPress={registrar} disabled={cargando}>
        {cargando ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Registrarme</Text>}
      </Pressable>

      <Link href="/login" style={s.link}>
        Ya tengo cuenta, volver al login
      </Link>
    </View>
  );
}