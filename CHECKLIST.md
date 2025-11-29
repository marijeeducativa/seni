# ✅ CHECKLIST: Configurar Login en Vercel

## 🎯 Objetivo
Hacer que el login funcione en https://seni-nine.vercel.app/

## 📝 Pasos a Seguir

### ✅ Paso 1: Código Actualizado (YA HECHO)
- [x] Arreglada función API `/api/users/me`
- [x] Actualizado frontend para usar rutas correctas
- [x] Código subido a GitHub
- [x] Vercel está desplegando automáticamente

### ⏳ Paso 2: Configurar Variables de Entorno en Vercel (PENDIENTE)

Ve a: https://vercel.com/dashboard → Tu Proyecto → Settings → Environment Variables

Agrega estas 4 variables:

| Variable Name | Valor | Dónde Encontrarlo |
|--------------|-------|-------------------|
| `VITE_SUPABASE_URL` | https://xxx.supabase.co | Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | eyJhbGc... | Supabase → Settings → API → anon public key |
| `SUPABASE_URL` | https://xxx.supabase.co | Mismo que VITE_SUPABASE_URL |
| `SUPABASE_SERVICE_ROLE_KEY` | eyJhbGc... | Supabase → Settings → API → service_role key ⚠️ |

**IMPORTANTE:**
- ✅ Marca las 3 opciones: Production, Preview, Development
- ⚠️ El `service_role` key es SECRETO, nunca lo compartas
- 📋 Copia y pega con cuidado, sin espacios extra

### ⏳ Paso 3: Re-desplegar (PENDIENTE)

Después de agregar las variables de entorno:

**Opción A - Automático:**
Vercel detectará el push y desplegará automáticamente

**Opción B - Manual:**
1. Ve a Vercel Dashboard → Deployments
2. Click en (...) del último deployment
3. Click en "Redeploy"
4. Desmarca "Use existing Build Cache"

### ⏳ Paso 4: Verificar (PENDIENTE)

1. Espera a que termine el deployment (1-2 minutos)
2. Ve a https://seni-nine.vercel.app/
3. Intenta hacer login
4. ✅ Debería funcionar!

## 🔍 ¿Cómo Saber si Funcionó?

### ✅ Señales de Éxito:
- Puedes iniciar sesión sin errores
- Te redirige al dashboard correcto
- No ves errores en la consola del navegador

### ❌ Si No Funciona:

1. **Verifica las variables de entorno:**
   - Ve a Vercel → Settings → Environment Variables
   - Confirma que las 4 variables estén ahí
   - Verifica que no haya typos

2. **Revisa los logs:**
   - Ve a Vercel → Deployments → [último] → Functions
   - Click en `/api/users/me`
   - Busca mensajes de error

3. **Prueba el endpoint directamente:**
   - Abre: https://seni-nine.vercel.app/api/users/me
   - Deberías ver: `{"error":"Not authenticated"}` (esto es correcto!)

## 📞 Necesitas Ayuda?

Si después de configurar las variables de entorno el login sigue sin funcionar:
1. Abre las DevTools (F12)
2. Ve a la pestaña Network
3. Intenta hacer login
4. Busca la llamada a `/api/users/me`
5. Comparte el error que veas

## 🎉 ¿Todo Funcionó?

Una vez que el login funcione, tu aplicación estará completamente operativa en Vercel!

Próximos pasos opcionales:
- Configurar un dominio personalizado
- Agregar más funciones API según necesites
- Configurar analytics y monitoring
