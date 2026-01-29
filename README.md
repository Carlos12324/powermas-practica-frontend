# PowerMas Frontend

Frontend para el sistema de gestión de beneficiarios PowerMas, construido con React + TypeScript + Vite.

## Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **TailwindCSS** - Framework de estilos
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- API Backend ejecutándose (ASP.NET Core) o puedes usar el link del deployado en Render.

## Instalación

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
# Crea un archivo .env en la raíz
echo "VITE_API_BASE_URL=http://localhost:5005" > .env

# O usa el backend de producción
echo "VITE_API_BASE_URL=https://powermas-practica-backend.onrender.com" > .env
```

## Variables de entorno

| Variable | Descripción | Valor ejemplo |
|----------|-------------|---------------|
| `VITE_API_BASE_URL` | URL base de la API backend | `http://localhost:5005` (local) o `https://powermas-practica-backend.onrender.com` (prod) |

## Desarrollo

Inicia el servidor de desarrollo:

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## Build

Genera la versión de producción:

```bash
npm run build
```

Los archivos se generarán en el directorio `dist/`

## Estructura del proyecto

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

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Redirige a `/beneficiarios` |
| `/beneficiarios` | Listado de beneficiarios |
| `/beneficiarios/nuevo` | Crear nuevo beneficiario |
| `/beneficiarios/:id/editar` | Editar beneficiario |
| `/documentos-identidad` | Listado de tipos de documento |
| `/dashboard` | Próximamente |
| `/configuracion` | Próximamente |

## Funcionalidades

- CRUD de Beneficiarios: listar, buscar, crear, editar y eliminar (con confirmación).
- Carga de Documentos de Identidad desde `GET /api/documentos-identidad/activos` para poblar el selector.
- Validaciones en formulario: requeridos, sexo `M/F`, número de documento según reglas del tipo seleccionado y fecha de nacimiento no futura.
- Manejo de errores: muestra `ProblemDetails.detail` cuando la API responde `application/problem+json`.

## Notas

- Si aparece un error de CORS, verifica que el backend permita solicitudes desde `http://localhost:5173`.
- Los IDs pueden no ser consecutivos debido a que en SQL Server se usan columnas `IDENTITY` (comportamiento esperado).


## API Endpoints

El frontend consume los siguientes endpoints:

### Beneficiarios
- `GET /api/beneficiarios` - Listar todos
- `GET /api/beneficiarios/{id}` - Obtener por ID
- `POST /api/beneficiarios` - Crear
- `PUT /api/beneficiarios/{id}` - Actualizar
- `DELETE /api/beneficiarios/{id}` - Eliminar

### Documentos de Identidad
- `GET /api/documentos-identidad/activos` - Listar activos

##  Estilos

El proyecto utiliza TailwindCSS 4 con la configuración por defecto. Los estilos personalizados se encuentran en `src/index.css`.

## Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run lint     # Ejecutar ESLint
npm run preview  # Preview del build
```
