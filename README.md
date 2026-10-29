# 🧉 La Matera del Gringo - Tienda Web & Panel de Administración

> **Plataforma web comercial completa para "La Matera del Gringo"**: catálogo artesanal interactivo, carrito sincronizado con WhatsApp, chat en vivo flotante, soporte de modo claro/oscuro (Dark Mode) y panel administrativo privado con gestión de productos, imágenes, precios, promociones calendarizadas y sincronización dual (Supabase + LocalStorage).

---

## 📌 Datos del Proyecto y Entorno

- **Repositorio Oficial en GitHub:** [https://github.com/Marcos-MEG-H44/la-matera-del-gringo-web](https://github.com/Marcos-MEG-H44/la-matera-del-gringo-web)
- **Ubicación Local en el Servidor/PC:** `C:\xampp\htdocs\la-matera-del-gringo`
- **Desarrollador / Propietario:** Marcos Godoy
- **Línea Oficial de WhatsApp para Pedidos:** [+54 9 2923 41-0901](https://wa.me/5492923410901)
- **Cuenta Oficial de Instagram:** [@mglamateradelgringo](https://instagram.com/mglamateradelgringo)
- **Ubicación Física:** Coronel Pringles, Provincia de Buenos Aires, Argentina

---

## 💻 Requisitos Previos y Entorno

Para ejecutar el proyecto en tu computadora necesitas tener instalados:
- **Node.js:** Versión 18.0 o superior (recomendado Node 20 LTS o Node 22).
- **npm:** Gestor de paquetes incluido con Node.js.
- **Git:** Para control de versiones y despliegue continuo.
- **Navegador Web Moderno:** Google Chrome, Microsoft Edge, Brave, Mozilla Firefox o Safari.

---

## 🚀 Guía Paso a Paso para Ejecutar el Proyecto Localmente

### Paso 1: Abrir la Terminal en la Carpeta del Proyecto
Abre PowerShell o CMD y dirígete al directorio local del proyecto:

```powershell
cd C:\xampp\htdocs\la-matera-del-gringo
```

### Paso 2: Instalar Dependencias del Proyecto
Si es la primera vez que clonas o descargas el proyecto, ejecuta:

```powershell
npm install
```
*Este comando instalará React 19, Vite 8, Tailwind CSS v4, Lucide React, React Router DOM v7 y el cliente de Supabase.*

### Paso 3: Iniciar el Servidor de Desarrollo
Para arrancar el entorno local con recarga rápida en vivo (Hot Module Replacement):

```powershell
npm run dev
```

Una vez ejecutado, la terminal mostrará la URL local:
```text
  VITE v8.3.5  ready in 240 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```
Abre en tu navegador **`http://localhost:5173/`** para ver la tienda pública.

### Paso 4: Comprobación de Compilación para Producción (Build)
Para verificar que todo el código fuente esté libre de errores y optimizado:

```powershell
npm run build
```
Los archivos finales se generarán en la carpeta `dist/`.

Para previsualizar localmente la compilación de producción:
```powershell
npm run preview
```

---

## 🛍️ Guía de Uso del Sitio Web Público (`/`)

### 1. Navegación y Filtros por Categoría
- En la parte superior del catálogo encontrarás la botonera de categorías:
  - **Todos los Productos:** Visualiza la totalidad del catálogo activo.
  - **Mates:** Mates imperiales mixtos, torpedo de algarrobo, criollos de calabaza pulida y mates 3D. *(Categoría depurada y protegida: exclusión garantizada de términos no deseados como "compañeros")*.
  - **Bombillas:** Bombillas de alpaca cincelada y acero quirúrgico.
  - **Termos:** Termos de acero inoxidable de 1L y 1.2L de alta retención térmica.
  - **Combos & Sets:** Sets completos materos criollos ("El Gringo", "La Nona").
  - **Accesorios:** Materas canasta de cuero vacuno, latas yerberas/azucareras, botellas térmicas, vasos ferneteros y chops.
  - **Grabados:** Servicios de personalización artesanal en virolas.

### 2. Buscador en Tiempo Real
- Caja de búsqueda ubicada en la barra superior (con vista adaptada para móvil y escritorio).
- Filtra instantáneamente por nombre de producto y por descripción detallada.

### 3. Selector de Modo Claro y Modo Oscuro (Dark / Light Mode)
- Ubicado en la barra de navegación pública (icono de Sol ☀️ / Luna 🌙).
- **Detección Automática:** Detecta si tu sistema operativo prefiere tema oscuro o claro.
- **Persistencia:** Tu elección se almacena en `localStorage` (`matera_theme_preference`), manteniéndose al refrescar la página o volver días después.
- **Contraste y Estética Cuero:**
  - *Modo Claro:* Fondo pergamino `#FDFBF7`, tarjetas blancas y tonos café cuero `#5A3825`.
  - *Modo Oscuro:* Fondo café noche `#120D0A`, tarjetas `#1B130E`, bordes `#38251B` y acentos dorados `#D4AF37`.

### 4. Visor Modal de Fotos Centradas y Completas
- Al hacer clic en cualquier tarjeta de producto se abre la ventana emergente de detalle.
- Las fotografías se muestran completas (`object-contain`), sin recortes indeseados en bordes o virolas.
- **Productos con múltiples imágenes:** Si el producto tiene varias fotos, dispondrás de flechas de navegación izquierda/derecha, contador numérico y tira de miniaturas en la base para alternar entre tomas.
- Se puede cerrar haciendo clic en la **X**, en el fondo o presionando la tecla **`Escape`**.

### 5. Carrito de Compras y Pedido por WhatsApp
- Agrega productos con un solo clic desde la tarjeta o desde el modal.
- El botón de carrito muestra un contador dinámico con la cantidad total de artículos.
- En la barra lateral del carrito puedes sumar, restar unidades o eliminar productos.
- Si un producto tiene un **Descuento Programado Activo**, el carrito aplicará automáticamente el precio de oferta.
- Al hacer clic en **"Enviar Pedido por WhatsApp"**, se abre una conversación directa con Marcos Godoy (+54 9 2923 41-0901) con un mensaje preformateado con el detalle exacto de productos, descuentos aplicados y total en pesos argentinos.

### 6. Widget Flotante de Chat en Vivo
- Ubicado en la esquina inferior derecha (`bottom-5 right-5`).
- Al pulsar el botón flotante se despliega una ventana de chat con encabezado azul `#0066FF`, indicador verde *"🟢 En línea"*, botón *"Vaciar"* y la notificación inicial *"Visitante se ha conectado al chat de consultas."*.
- Incluye botones con **Preguntas Frecuentes** para consultas rápidas con un solo clic.
- Al redactar tu mensaje y presionar **Enviar**, te redirige al chat de WhatsApp oficial con la consulta ya escrita.
- Presiona la tecla **`Escape`** o la **X** para minimizar el chat en cualquier momento.

---

## 🔐 Guía de Uso del Panel de Administración Privado (`/admin`)

### 1. Acceso y Autenticación
- **Ruta de Acceso:** `http://localhost:5173/admin/login` (o haz clic en el enlace discreto *"Acceso Administrativo"* en el pie de página del sitio).
- **Credenciales por Defecto:**
  - **Correo:** `admin@lamateradelgringo.com`
  - **Contraseña:** `admin`
  *(Incluye un botón práctico "Autocompletar credenciales" para ingresar en modo demo con un solo toque).*
- **Rutas Protegidas:** Si un usuario no autenticado intenta ingresar directamente a `/admin/dashboard`, el guard `ProtectedRoute` lo redirigirá inmediatamente al login guardando la URL de origen.

### 2. Módulos del Panel de Administración

#### 📊 A. Inicio (`DashboardHome`)
- Resumen de métricas: Total de productos, productos activos en tienda y productos destacados en portada.
- Métricas de promociones: Promociones activas (🟢), pendientes de fecha (🟡) y finalizadas (🔴).
- Alerta preventiva de **Stock Bajo** para productos con 5 o menos unidades disponibles.
- Botón **"Nuevo Producto"** de acceso directo.
- Botón **"Restaurar Datos de Fábrica"** para reestablecer los 25 productos iniciales en caso de pruebas.

#### 📦 B. Gestión de Productos (`ProductsManager`)
- **Tabla interactiva:** Muestra miniatura, nombre, categoría, stock, precio y estado (activo/inactivo).
- **Edición Rápida de Precio:** Haz clic en el icono de lápiz junto al precio para modificar el valor numérico en el acto sin abrir formularios.
- **Acciones:**
  - ⭐ Marcar o desmarcar producto como **Destacado** para la portada.
  - 👁️ Activar o pausar visibilidad en la tienda pública con switch instantáneo.
  - ✏️ Editar todos los atributos del producto.
  - 🗑️ Eliminar producto del catálogo.
- **Formulario de Carga / Edición:**
  - Validaciones de seguridad: Nombre obligatorio, precio mayor a cero, categoría válida y stock mayor o igual a cero.
  - **Gestión Multi-Imagen:** Permite subir múltiples imágenes (desde la PC o pegando URLs directas), reordenar qué imagen será la portada principal y eliminar fotos secundarias.
  - Sanitización automática contra inyecciones XSS.

#### 🗂️ C. Categorías (`CategoriesManager`)
- Listado de todas las categorías disponibles y contador de productos vinculados.
- Permite crear nuevas categorías y editar nombres existentes.
- Protección ante eliminación accidental: Si una categoría tiene productos asociados, solicita confirmación explícita.
- Regla de negocio: Bloqueo explícito del término "compañero/s" para mantener el estándar comercial.

#### 🖼️ D. Gestión de Imágenes (`ImageManager`)
- Selector de producto comercial.
- Galería visual con todas las fotografías cargadas de ese producto.
- **Carga desde tu Computadora:** Botón para seleccionar archivos JPG/PNG desde tu disco local y guardarlos en Base64 o Storage.
- **Carga por Enlace (URL):** Campo para ingresar enlaces de imágenes públicas.
- **Herramientas de Galería:** Zoom modal en alta resolución para inspección de calidad y selector de foto principal (índice 0).

#### ⭐ E. Productos Destacados (`FeaturedManager`)
- Vista enfocada exclusivamente en los productos marcados con estrella ⭐.
- Permite añadir o quitar productos de la sección destacada con un solo clic.

#### 🏷️ F. Descuentos y Promociones Programadas (`DiscountsManager`)
- **Simulador de Precios en Vivo:** A medida que seleccionas un producto y defines el porcentaje de descuento (ej. 15%), el panel calcula en tiempo real:
  - *Precio Original ($ANTES)*
  - *Monto de Ahorro*
  - *Precio Final de Oferta ($AHORA)*
- **Automatización por Fechas:**
  - Eliges `Fecha Inicio` y `Fecha Fin`.
  - El sistema clasifica automáticamente el estado:
    - `Fecha actual < Fecha Inicio` ➔ **🟡 PROMOCIÓN PENDIENTE** (no se aplica aún).
    - `Fecha Inicio <= Fecha actual <= Fecha Fin` ➔ **🟢 PROMOCIÓN ACTIVA** (se aplica de inmediato en catálogo y carrito con badge `-XX% OFF`).
    - `Fecha actual > Fecha Fin` ➔ **🔴 PROMOCIÓN FINALIZADA** (el producto vuelve a su precio normal sin borrar el registro histórico).

#### 📅 G. Calendario e Historial de Promociones (`PromoCalendar`)
- **Cuadrícula Mensual:** Vista de calendario donde cada día muestra indicadores visuales de promociones activas, pendientes y finalizadas.
- Haz clic en cualquier día del calendario para ver qué promociones aplican en esa fecha específica.
- **Historial Completo:** Tabla cronológica con buscador y filtro de estado para auditar promociones pasadas o en curso.

---

## 🗄️ Configuración y Migración a Supabase (Dual Sync)

La plataforma funciona al 100% en modo local (`localStorage`) sin necesidad de configurar ninguna base de datos externa. Si deseas conectar el backend PostgreSQL de **Supabase**:

1. Crea una cuenta y un proyecto en [Supabase](https://supabase.com/).
2. Dirígete a la sección **SQL Editor** en el panel de Supabase.
3. Copia y ejecuta todo el código del archivo [`supabase-schema.sql`](file:///C:/xampp/htdocs/la-matera-del-gringo/supabase-schema.sql).
4. Crea un archivo `.env.local` en la raíz del proyecto (`C:\xampp\htdocs\la-matera-del-gringo\.env.local`) basándote en `.env.example`:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
   VITE_ADMIN_EMAIL=admin@lamateradelgringo.com
   VITE_ADMIN_PASSWORD=admin
   ```
5. Al reiniciar `npm run dev`, la aplicación detectará las credenciales y activará la sincronización en la nube automáticamente (el indicador en el pie del panel cambiará a *"🟢 Supabase Conectado"*).

---

## 🌐 Pasos para Despliegue en Vercel (Hosting en la Nube)

1. **Subir los cambios más recientes a tu repositorio de GitHub:**
   ```powershell
   cd C:\xampp\htdocs\la-matera-del-gringo
   git add .
   git commit -m "feat: tienda completa con chat whatsapp, dark mode, seo y manual"
   git push origin main
   ```
2. **Importar el repositorio en Vercel:**
   - Inicia sesión en [Vercel](https://vercel.com/) con tu cuenta de GitHub.
   - Presiona **"Add New Project"**.
   - Selecciona el repositorio `Marcos-MEG-H44/la-matera-del-gringo-web`.
3. **Parámetros del Proyecto en Vercel:**
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Variables de Entorno (Opcional en Vercel):**
   - En la sección *Environment Variables*, puedes agregar:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_ADMIN_EMAIL`
     - `VITE_ADMIN_PASSWORD`
5. **Desplegar:** Presiona el botón **Deploy**. En menos de 1 minuto el sitio estará publicado con certificado SSL HTTPS gratuito y CDN global.

---

## 📁 Estructura Completa de Archivos del Proyecto

```text
la-matera-del-gringo/
├── public/                         # Recursos estáticos de acceso directo
│   ├── logo1.jpeg                  # Isologotipo oficial de la marca
│   ├── robots.txt                  # Directivas de rastreo SEO para buscadores
│   ├── sitemap.xml                 # Mapa de sitio XML para Google Search Console
│   └── productos/                  # 25 fotografías originales del catálogo
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminLayout.jsx      # Maquetado del panel, sidebar y Dark Mode
│   │   │   ├── CategoriesManager.jsx# Módulo CRUD de categorías comerciales
│   │   │   ├── DashboardHome.jsx    # Tablero de métricas, alertas y accesos rápidos
│   │   │   ├── DiscountsManager.jsx # Creador de descuentos programados por fecha
│   │   │   ├── FeaturedManager.jsx  # Gestor de productos ⭐ destacados en portada
│   │   │   ├── ImageManager.jsx     # Gestor de fotos (subida desde PC o URL, zoom)
│   │   │   ├── ProductsManager.jsx  # CRUD de productos con edición rápida de precio
│   │   │   ├── PromoCalendar.jsx    # Calendario mensual e historial de promociones
│   │   │   └── ProtectedRoute.jsx   # Guardia de rutas protegidas para rol ADMIN
│   │   ├── LiveChatWidget.jsx       # Widget flotante de chat en vivo con WhatsApp
│   │   └── ThemeToggle.jsx          # Botón selector accesible Modo Claro / Oscuro
│   ├── context/
│   │   ├── AuthContext.jsx          # Autenticación, sesión persistente y seguridad
│   │   ├── DataContext.jsx          # Estado global de catálogo, fotos, promos y sync
│   │   └── ThemeContext.jsx         # Proveedor de tema (Claro / Oscuro / Sistema)
│   ├── lib/
│   │   ├── sanitize.js              # Funciones de sanitización contra XSS y scripts
│   │   └── supabase.js              # Conector e inicializador de Supabase
│   ├── pages/
│   │   ├── AdminDashboardPage.jsx   # Enrutador principal de pestañas administrativas
│   │   ├── AdminLoginPage.jsx       # Pantalla de acceso con identidad de marca
│   │   └── StorePage.jsx            # Tienda pública principal con catálogo y carrito
│   ├── App.css
│   ├── App.jsx                      # Definición de rutas y envoltura de proveedores
│   ├── index.css                    # Estilos base, texturas y dark variant Tailwind v4
│   └── main.jsx                     # Punto de arranque de React 19
├── .env.example                     # Plantilla de variables de entorno seguras
├── index.html                       # HTML5 con SEO, Open Graph y Schema.org
├── supabase-schema.sql              # Script SQL con tablas, RLS y bucket de Storage
├── package.json                     # Scripts y dependencias oficiales
├── README.md                        # Guía integral y documentación técnica
└── vite.config.js                   # Configuración del empaquetador Vite 8
```

---

## 🛠️ Tecnologías Principales y Dependencias

- **React 19.3.1:** Biblioteca UI moderna con soporte para transiciones y concurrent mode.
- **Vite 8.3.5:** Empaquetador ultra veloz para desarrollo y compilación de producción.
- **Tailwind CSS v4.3.3:** Motor de diseño basado en utilidades con `@custom-variant dark`.
- **Lucide React 1.61.0:** Set completo de iconografía SVG accesible.
- **React Router DOM 7.18.5:** Enrutamiento SPA con historial y rutas protegidas.
- **Supabase JS 2.118.0:** SDK oficial para PostgreSQL, autenticación y storage en la nube.
