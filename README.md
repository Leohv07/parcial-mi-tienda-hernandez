# Parcial: Mi Tienda

**Estudiante:** Leonardo Hernández
**Código:** PENDIENTE

## Cómo ejecutar
1. Copiar .env.example como .env y llenar URL y publishable key de Supabase.
2. Ejecutar en el SQL Editor de Supabase el script de la tabla products con RLS y desactivar Confirm email.
3. npm install --legacy-peer-deps
4. npx expo start

## Capturas
![Login](capturas/01-login.png)
![Registro](capturas/02-registro.png)

## Estado
Funciona y probado: login, registro con validaciones, rutas protegidas con Stack.Protected y sesión persistente en SecureStore.
Implementado sin alcanzar a probar por tiempo: CRUD local con SQLite y Drizzle, lista reactiva, totales, indicador de pendientes y sincronización con Supabase. Faltaron las capturas 03 a 07.
