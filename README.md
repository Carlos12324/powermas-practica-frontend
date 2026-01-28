# PowerMas Frontend

Frontend para el sistema de gestión de beneficiarios PowerMas, construido con React + TypeScript + Vite.

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **TailwindCSS** - Framework de estilos
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP

## 📋 Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- API Backend ejecutándose (ASP.NET Core)

## 🛠️ Instalación

1. Clona el repositorio e ingresa al directorio:

```bash
cd powermas-frontend
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno:

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con la URL de tu API
# VITE_API_BASE_URL=http://localhost:5005
```

## 🔧 Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_API_BASE_URL` | URL base de la API | `http://localhost:5005` |

## 💻 Desarrollo

Inicia el servidor de desarrollo:

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 🏗️ Build

Genera la versión de producción:

```bash
npm run build
```

Los archivos se generarán en el directorio `dist/`

## 📁 Estructura del proyecto

```
src/
├── api/                    # Cliente HTTP y servicios de API
│   ├── apiClient.ts        # Configuración de Axios
│   ├── beneficiariosApi.ts # Endpoints de beneficiarios
│   └── documentosApi.ts    # Endpoints de documentos
├── components/
│   ├── layout/             # Componentes de layout
│   │   ├── AppLayout.tsx
│   │   └── Sidebar.tsx
│   └── ui/                 # Componentes reutilizables
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Select.tsx
│       └── Toast.tsx
├── pages/                  # Páginas de la aplicación
│   ├── BeneficiarioCreatePage.tsx
│   ├── BeneficiarioEditPage.tsx
│   ├── BeneficiariosListPage.tsx
│   ├── ComingSoonPage.tsx
│   └── DocumentosIdentidadPage.tsx
├── routes/
│   └── AppRouter.tsx       # Configuración de rutas
├── types/                  # Definiciones de TypeScript
│   ├── beneficiarios.ts
│   ├── documentos.ts
│   └── problemDetails.ts
├── utils/                  # Utilidades
│   ├── formatDate.ts
│   └── validators.ts
├── App.tsx
├── index.css
└── main.tsx
```

## 🛣️ Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Redirige a `/beneficiarios` |
| `/beneficiarios` | Listado de beneficiarios |
| `/beneficiarios/nuevo` | Crear nuevo beneficiario |
| `/beneficiarios/:id/editar` | Editar beneficiario |
| `/documentos-identidad` | Listado de tipos de documento |
| `/dashboard` | Próximamente |
| `/configuracion` | Próximamente |

## 📡 API Endpoints

El frontend consume los siguientes endpoints:

### Beneficiarios
- `GET /api/beneficiarios` - Listar todos
- `GET /api/beneficiarios/{id}` - Obtener por ID
- `POST /api/beneficiarios` - Crear
- `PUT /api/beneficiarios/{id}` - Actualizar
- `DELETE /api/beneficiarios/{id}` - Eliminar

### Documentos de Identidad
- `GET /api/documentos-identidad/activos` - Listar activos

## 🎨 Estilos

El proyecto utiliza TailwindCSS 4 con la configuración por defecto. Los estilos personalizados se encuentran en `src/index.css`.

## 📝 Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run lint     # Ejecutar ESLint
npm run preview  # Preview del build
```
