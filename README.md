# 🧉 La Matera del Gringo - Tienda Web & Panel de Administración

Sitio web oficial, catálogo digital y panel de administración privado de **La Matera del Gringo**, emprendimiento artesanal dedicado a la venta de mates, bombillas de alpaca, termos, combos personalizados y accesorios criollos, desarrollado con un diseño elegante, cálido y tradicional.

---

## 📌 Datos del Proyecto y Entorno

- **Repositorio en GitHub:** [https://github.com/Marcos-MEG-H44/la-matera-del-gringo-web](https://github.com/Marcos-MEG-H44/la-matera-del-gringo-web)
- **Ubicación Local:** `C:\xampp\htdocs\la-matera-del-gringo`
- **Desarrollador / Propietario:** Marcos Godoy
- **Contacto / WhatsApp:** [+54 9 2923410901](https://wa.me/5492923410901)
- **Instagram:** [@mglamateradelgringo](https://instagram.com/mglamateradelgringo)

---

## 🛠️ Tech Stack & Tecnologías

- **Frontend Core:** [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Enrutamiento:** [React Router DOM v7](https://reactrouter.com/)
- **Estilos & Diseño:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Paleta de Colores de Identidad (Tonalidad Cuero Cálido):**
  - Fondo pergamino cálido: `#FDFBF7`
  - Cuero cálido medio / Encabezados: `#5A3825` (marrón más claro, cálido y elegante)
  - Fondo secundario / Pie de página: `#452C1E`
  - Superficies y botones secundarios: `#6E4933`
  - Acentos dorados / Calidad: `#D4AF37`
  - Cuero medio / Marcas secundarias: `#9E816B`
  - Bordes y divisores: `#7A523A` / `#E8DFD3`
- **Visualización de Imágenes (Centradas y Completas):**
  - Renderizado con `object-contain` para que ningún mate, bombilla o termo sufra cortes indeseados.
  - Soporte de múltiples fotos por producto (`imagenes: []`), con visor en carrusel y tira de miniaturas en el modal público, y gestión completa (agregar, reordenar y eliminar) desde el panel de administración.
- **Backend / Persistencia (Dual Sync):**
  - **Supabase:** PostgreSQL, Row Level Security (RLS), Supabase Storage y Supabase Auth.
  - **Local Fallback:** Persistencia inmediata en `localStorage` con inicialización del catálogo completo de 25 productos, para garantizar funcionamiento offline y desarrollo sin fricción.

---

## 🔐 Acceso al Panel de Administración

- **Ruta de Acceso:** `/admin/login` (o enlace discreto *"Acceso Administrativo"* en el pie de página).
- **Ruta del Dashboard:** `/admin/dashboard` (Protegida por guard de autenticación).
- **Credenciales Administrativas Iniciales:**
  - **Correo:** `admin@lamateradelgringo.com`
  - **Contraseña:** `admin`
  *(En la pantalla de login se incluye un botón de un clic para autocompletar credenciales en modo de prueba).*

---

## 🗺️ Hoja de Ruta y Estado de Fases

| Fase | Estado | Módulos & Logros Alcanzados |
| :--- | :---: | :--- |
| **Fase 0: Inicio & Documentación** | ✅ Completada | Estructuración del README, congelamiento de funcionalidades existentes y análisis de stack. |
| **Fase 1: Usuario Admin & Seguridad** | ✅ Completada | Contexto `AuthContext`, protección de rutas con `ProtectedRoute`, redirección automática y soporte dual Supabase/Local. |
| **Fase 2: Dashboard UI Moderno** | ✅ Completada | `AdminLayout` con navegación responsiva (sidebar colapsable), métricas ejecutivas, alertas de stock bajo y accesos rápidos en `DashboardHome`. |
| **Fase 3: Gestión de Productos (CRUD)** | ✅ Completada | `ProductsManager`: tabla con fotos, búsqueda, filtro de categorías, switch activo/inactivo, modal con validaciones completas (nombre obligatorio, precio > 0, categoría, stock). |
| **Fase 4: Gestión de Imágenes** | ✅ Completada | `ImageManager`: carga de fotos desde PC (Base64) o URL, previsualización en tiempo real antes de guardar, galería interactiva y zoom modal sin tocar código fuente. |
| **Fase 5: Precios Rápidos & Destacados** | ✅ Completada | `FeaturedManager` y tabla CRUD: edición in-line de precios con impacto inmediato en tienda, selector de ⭐ Destacados reflejados con badge en el catálogo público. |
| **Fase 6: Descuentos Programados por Fecha** | ✅ Completada | `DiscountsManager`: simulador en vivo de precios ($ANTES / % OFF / $AHORA), selector de fechas y automatización de estados (🟢 Activa, 🟡 Pendiente, 🔴 Finalizada) reflejado en catálogo y carrito. |
| **Fase 7: Calendario e Historial de Promociones** | ✅ Completada | `PromoCalendar`: cuadrícula mensual con indicadores por día (🟢, 🟡, 🔴), panel inspector de fecha y registro histórico cronológico con buscador y filtros. |

---

## 🗄️ Configuración y Migración a Supabase (Opcional)

El proyecto incluye el archivo `supabase-schema.sql` listo para ser ejecutado en Supabase:

1. Crear un proyecto en [Supabase](https://supabase.com/).
2. Ir a la sección **SQL Editor** y ejecutar el contenido de `supabase-schema.sql`.
3. Crear un archivo `.env` en la raíz (`C:\xampp\htdocs\la-matera-del-gringo\.env`) con las credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```
4. El sistema detectará automáticamente las variables y pasará del almacenamiento local a la base de datos PostgreSQL de Supabase.

---

## 💻 Guía de Instalación y Ejecución Local

```bash
# 1. Abrir la terminal en la carpeta del proyecto
cd C:\xampp\htdocs\la-matera-del-gringo

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor local de desarrollo
npm run dev

# 4. Compilar para producción y verificar integridad
npm run build
```

La aplicación estará accesible en `http://localhost:5173`.

---

## 🌐 Pasos para Despliegue en Vercel

1. **Subir los cambios a GitHub:**
   ```bash
   git add .
   git commit -m "feat: panel de administración integral y catálogo reactivo"
   git push origin main
   ```
2. **Importar en Vercel:**
   - Iniciar sesión en [Vercel](https://vercel.com/).
   - Click en **"Add New Project"** e importar el repositorio `Marcos-MEG-H44/la-matera-del-gringo-web`.
3. **Configuración de Proyecto:**
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Variables de Entorno (Environment Variables):**
   - Configurar opcionalmente si se utiliza Supabase:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
5. **Desplegar:** Click en **Deploy**.

---

## 📁 Estructura de Archivos del Proyecto

```text
la-matera-del-gringo/
├── public/                         # Recursos estáticos públicos
│   ├── logo1.jpeg                  # Logotipo oficial
│   └── productos/                  # 25 fotografías del catálogo inicial
├── src/
│   ├── components/
│   │   └── admin/
│   │       ├── AdminLayout.jsx      # Maquetado del panel, sidebar y navegación
│   │       ├── CategoriesManager.jsx# Gestión y contador de categorías
│   │       ├── DashboardHome.jsx    # Métricas, promociones activas y stock bajo
│   │       ├── DiscountsManager.jsx # Descuentos automáticos $ANTES / % OFF / $AHORA
│   │       ├── FeaturedManager.jsx  # Control de productos ⭐ destacados en portada
│   │       ├── ImageManager.jsx     # Previsualización y subida de imágenes
│   │       ├── ProductsManager.jsx  # CRUD productos con edición rápida de precio
│   │       ├── PromoCalendar.jsx    # Calendario mensual e historial de promociones
│   │       └── ProtectedRoute.jsx   # Guardia de seguridad con rol ADMIN
│   ├── context/
│   │   ├── AuthContext.jsx          # Autenticación, sesión persistente y roles
│   │   └── DataContext.jsx          # Estado de productos, promociones y categorías
│   ├── lib/
│   │   └── supabase.js              # Inicialización segura del cliente Supabase
│   ├── pages/
│   │   ├── AdminDashboardPage.jsx   # Página del Panel de Administración
│   │   ├── AdminLoginPage.jsx       # Login administrativo con identidad de marca
│   │   └── StorePage.jsx            # Tienda pública con carrito WhatsApp y promos
│   ├── App.css
│   ├── App.jsx                      # Configuración de rutas y Providers
│   ├── index.css                    # Estilos globales y Tailwind CSS v4
│   └── main.jsx                     # Punto de entrada de React 19
├── supabase-schema.sql              # Esquema SQL con tablas, RLS y Storage
├── package.json
├── README.md                        # Documentación completa y guía de desarrollo
└── vite.config.js
```
