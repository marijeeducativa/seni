# SENI - Sistema de Evaluación Nivel Inicial

Sistema integral de gestión y evaluación para centros educativos de nivel inicial en República Dominicana.

## 📋 Descripción

SENI es una aplicación web completa diseñada para facilitar la gestión de evaluaciones y generación de boletines para estudiantes de nivel inicial (Párvulo, Prekinder, Kinder, Preprimario). El sistema permite a los maestros evaluar estudiantes según indicadores de logro del Ministerio de Educación y generar automáticamente boletines personalizados en formato imprimible.

## ✨ Características Principales

### Para Administradores
- 👥 **Gestión de Usuarios**: Crear y administrar cuentas de maestros
- 📚 **Gestión de Cursos**: Crear cursos con secciones y asignar maestros
- 🎓 **Gestión de Estudiantes**: Registro individual o masivo (importación desde Excel)
- 📊 **Gestión de Indicadores**: Administrar indicadores de evaluación por nivel

### Para Maestros
- ✅ **Evaluación de Estudiantes**: Matriz interactiva para evaluar indicadores por período
  - 3 períodos de evaluación
  - 3 niveles: Adquirido (L), En Proceso (P), Iniciado (I)
  - Evaluación rápida por indicador
- 📝 **Observaciones Periódicas**: Registrar cualidades destacadas y áreas de apoyo
- 📄 **Generación de Boletines**: 
  - Vista previa individual con logo del centro
  - Impresión masiva de todos los estudiantes del curso
  - Diseño adaptado automáticamente según el nivel
- 🔄 **Navegación Rápida**: Cambiar entre estudiantes sin salir de la pantalla

## 🏗️ Arquitectura Técnica

### Frontend
- **Framework**: React 18 + TypeScript
- **Enrutamiento**: React Router v6
- **Estilos**: TailwindCSS
- **Iconos**: Lucide React
- **Build Tool**: Vite

### Backend
- **Runtime**: Cloudflare Workers
- **Framework**: Hono (web framework ligero)
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth

### Estructura del Proyecto
```
├── src/
│   ├── react-app/           # Aplicación React
│   │   ├── components/      # Componentes reutilizables
│   │   ├── contexts/        # Context API (Auth)
│   │   ├── pages/           # Páginas de la aplicación
│   │   │   ├── admin/       # Dashboard administrativo
│   │   │   └── teacher/     # Dashboard de maestro
│   │   └── supabase.ts      # Cliente Supabase
│   └── worker/              # Cloudflare Worker (API)
│       ├── index.ts         # Rutas de API
│       └── supabase.ts      # Conexión a Supabase
├── supabase/
│   └── schema.sql           # Esquema de base de datos
└── public/                  # Archivos estáticos
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18 o superior
- npm o pnpm
- Cuenta en Supabase
- Cuenta en Cloudflare (para deployment)

### 1. Clonar el repositorio
```bash
git clone https://github.com/marijeeducativa/SENI.git
cd SENI
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.dev.vars` en la raíz del proyecto:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
```

Crea un archivo `.env` en la raíz para el frontend:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 4. Configurar la base de datos

Ejecuta el script SQL en tu proyecto de Supabase:
```bash
# El archivo schema.sql está en supabase/schema.sql
```

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📊 Base de Datos

### Tablas Principales

- **usuarios**: Administradores y maestros
- **estudiantes**: Información de estudiantes
- **cursos**: Cursos con secciones
- **estudiantes_cursos**: Relación estudiante-curso
- **indicadores**: Indicadores de evaluación
- **categorias_indicadores**: Dominios/categorías de indicadores
- **evaluaciones**: Evaluaciones de estudiantes por indicador y período
- **observaciones_periodicas**: Observaciones cualitativas por período
- **configuracion_centro**: Datos del centro educativo

## 🎨 Niveles Soportados

El sistema maneja diferentes estructuras de boletín según el nivel:

- **Párvulo I, II, III**: Matriz con categorías específicas
- **Prekinder**: Dominios del CNB
- **Kinder**: 5 dominios con distribución balanceada
  - Socioemocional
  - Artístico y Creativo
  - Psicomotor y de Salud
  - Descubrimiento del Mundo
  - Cognitivo
- **Preprimario**: Áreas de desarrollo

## 🔐 Seguridad

- Autenticación mediante Supabase Auth
- Row Level Security (RLS) en PostgreSQL
- Validación de permisos en cada endpoint
- Variables de entorno para datos sensibles (nunca en el código)
- Cookies HTTP-only para tokens de sesión

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Build
npm run build           # Compila para producción

# Deployment (Cloudflare)
npm run deploy          # Despliega el worker
npx wrangler pages deploy dist  # Despliega el frontend
```

## 📝 Flujo de Trabajo

### Para el Maestro:
1. Iniciar sesión
2. Seleccionar curso
3. Seleccionar estudiante
4. Evaluar indicadores por período
5. Agregar observaciones
6. Generar y descargar boletín

### Para el Administrador:
1. Iniciar sesión
2. Gestionar usuarios (maestros)
3. Crear cursos y asignar maestros
4. Registrar estudiantes
5. Asignar estudiantes a cursos

## 🐛 Solución de Problemas

### Las evaluaciones no se guardan
- Verificar que el servidor esté corriendo
- Revisar las credenciales de Supabase en `.dev.vars`
- Verificar permisos de la tabla `evaluaciones`

### Los boletines se ven cortados
- El sistema ajusta automáticamente el layout según la cantidad de indicadores
- Para Kinder, 5 indicadores del dominio Cognitivo se mueven a observaciones

### Error 401 al hacer login
- Verificar que `SUPABASE_ANON_KEY` esté correcta
- Verificar que el usuario existe en Supabase Auth

## 🤝 Contribuir

Este es un proyecto privado para uso interno del centro educativo.

## 📄 Licencia

Proyecto privado - Todos los derechos reservados

## 👥 Autores

- **Marije Educativa** - Desarrollo y mantenimiento

## 📞 Contacto

Para soporte o consultas: marijeeducativa@gmail.com

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2024
