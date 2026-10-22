import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Search,
  Phone,
  MapPin,
  Share2,
  Heart,
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  ChevronRight,
  Coffee,
  Info,
  Menu
} from "lucide-react";

// Componente para el ícono de Instagram (SVG propio para evitar errores de librería)
const InstagramIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// Datos de productos de ejemplo
const PRODUCTOS_INICIALES = [
  {
    id: 1,
    nombre: "Mate Imperial mixto",
    categoria: "mates",
    precio: 31500,
    destacado: true,
    descripcion: "Mate de calabaza Imperial Mixto, forrado en cuero vacuno legítimo, fleje de alpaca virola de acero. ",
    imagen: "/productos/mateimperialmixto.jpeg",
    stock: 8
  },
  {
    id: 2,
    nombre: "Mate Camionero",
    categoria: "mates",
    precio: 29000,
    destacado: true,
    descripcion: "Mate de calabaza Camionero, forrador en cuero vacuno legitimo, virola de acero.",
    imagen: "/productos/matecamionero.jpeg",
    stock: 15
  },
  {
    id: 3,
    nombre: "Termo dorado 1.2L Acero Inox",
    categoria: "termos",
    precio: 35000,
    destacado: false,
    descripcion: "Termo con doble pared de aislamiento al vacío. Mantiene el agua caliente durante más de 24 horas. Pico cebador de precisión.",
    imagen: "/productos/termodorado.jpeg",
    stock: 5
  },
  {
    id: 4,
    nombre: "Combo Matero El Gringo",
    categoria: "combos",
    precio: 64000,
    destacado: true,
    descripcion: "Incluye Mate Imperial Algarrobo con fleje de Alpaca y virola de acero + Bombilla Picoloro + Termo 1L acero inox + Luz p/bombilla +Matera simil cuero.",
    imagen: "/productos/comboElGringo.jpeg",
    stock: 3
  },
  {
    id: 5,
    nombre: "Mate Torpedo Algarrobo",
    categoria: "mates",
    precio: 22000,
    destacado: false,
    descripcion: "Mate torpedo tallado en madera maciza de algarrobo estacionado, curado tradicional con manteca y yerba, virola de acero.",
    imagen: "/productos/torpedoalgarrobo.jpeg",
    stock: 10
  },
  {
    id: 6,
    nombre: "Matera Canasta simil cuero",
    categoria: "combos",
    precio: 23500,
    destacado: false,
    descripcion: "Canasta matera simil cuero con divisores para termo, mate y yerbera. Muy resistente.",
    imagen: "/productos/canastasimilcuero.jpeg",
    stock: 6
  },
  {
    id: 7,
    nombre: "Bombilla chata acero, grabada",
    categoria: "bombillas",
    precio: 4200,
    destacado: false,
    descripcion: "Bombilla chata acero, grabada",
    imagen: "/productos/bombillachata.jpeg",
    stock: 10
  },
  {
    id: 8,
    nombre: "Combo Matero La Nona",
    categoria: "combos",
    precio: 61000,
    destacado: false,
    descripcion: "Incluye Mate Imperial Algarrobo con fleje de Alpaca y virola de acero + Bombilla Pico Loro + Termo 1 L blanco acero Inox + Matera simil cuero + Chau lata yerba y azucarera",
    imagen: "/productos/comboLaNona.jpeg",
    stock: 10
  }
];

export default function App() {
  const [categoriaSel, setCategoriaSel] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [productoModal, setProductoModal] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  // Filtrado de productos por búsqueda y categoría
  const productosFiltrados = useMemo(() => {
    return PRODUCTOS_INICIALES.filter((prod) => {
      const coincideCat = categoriaSel === "todos" || prod.categoria === categoriaSel;
      const coincideBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        prod.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      return coincideCat && coincideBusqueda;
    });
  }, [categoriaSel, busqueda]);

  // Funciones del Carrito
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const modificarCantidad = (id, delta) => {
    setCarrito((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nuevaCant = item.cantidad + delta;
            return nuevaCant > 0 ? { ...item, cantidad: nuevaCant } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const totalCarrito = useMemo(() => {
    return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }, [carrito]);

  const totalItems = useMemo(() => {
    return carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }, [carrito]);

  // Manejar Favoritos
  const toggleFavorito = (id) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Enviar pedido por WhatsApp
  const enviarPedidoWhatsApp = () => {
    if (carrito.length === 0) return;

    let mensaje = "¡Hola Marcos! Quiero realizar el siguiente pedido en *La Matera del Gringo*:\n\n";
    carrito.forEach((item) => {
      mensaje += `• *${item.nombre}* x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString("es-AR")}\n`;
    });
    mensaje += `\n*TOTAL: $${totalCarrito.toLocaleString("es-AR")}*\n\n¿Cómo coordinamos el pago y envío?`;

    const url = `https://wa.me/5492923410901?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C221E] font-sans">

      {/* NAVEGACIÓN SUPERIOR */}
      <header className="sticky top-0 z-40 bg-[#3B281C] text-[#F3EAD8] shadow-md border-b border-[#523A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo y Marca */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setCategoriaSel("todos"); setBusqueda(""); }}>
            <img
              src="/logo1.jpeg"
              alt="Logo La Matera del Gringo"
              className="w-12 h-12 object-contain rounded-full"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-wide text-[#F3EAD8]">
                La Matera del Gringo
              </h1>
              <p className="text-xs text-[#D4AF37] tracking-widest uppercase">
                Tradición "Más que mates, momentos"
              </p>
            </div>
          </div>

          {/* Buscador Escritorio */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Buscar mate, bombilla, termo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-[#2A1D14] text-[#F3EAD8] placeholder-[#9A8271] pl-10 pr-4 py-2 rounded-full border border-[#523A2A] focus:outline-none focus:border-[#D4AF37] text-sm"
            />
            <Search className="w-4 h-4 text-[#9A8271] absolute left-3.5 top-3" />
            {busqueda && (
              <button onClick={() => setBusqueda("")} className="absolute right-3 top-2.5 text-[#9A8271] hover:text-[#F3EAD8]">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Acciones */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCarritoAbierto(true)}
              className="relative p-2.5 bg-[#4A3425] hover:bg-[#5C4230] rounded-full transition-colors border border-[#6B4D38]"
              title="Ver Carrito"
            >
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#3B281C] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
              className="md:hidden p-2 rounded-lg bg-[#4A3425] text-[#F3EAD8]"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Buscador Móvil */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-[#2A1D14] text-[#F3EAD8] placeholder-[#9A8271] pl-10 pr-4 py-2 rounded-full border border-[#523A2A] text-sm"
            />
            <Search className="w-4 h-4 text-[#9A8271] absolute left-3.5 top-3" />
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <section className="relative bg-[#2A1D14] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=1200')` }}></div>
        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <span className="inline-block px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 rounded-full text-xs font-semibold tracking-wider uppercase">
            Mates Selección Especial
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#F3EAD8] leading-tight">
            El Ritual del Buen Mate Empieza Acá
          </h2>
          <p className="text-sm sm:text-lg text-[#D2C3B4] max-w-2xl mx-auto font-light">
            Mates de calabaza, madera de algarrobo, bombillas de alpaca y los mejores accesorios criollos hechos con pasión por Marcos.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <a
              href="#catalogo"
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C29F2F] text-[#3B281C] font-bold rounded-lg shadow-lg transition-all text-sm uppercase tracking-wider"
            >
              Ver Catálogo
            </a>
            <a
              href="https://wa.me/5492923410901"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg transition-all text-sm flex items-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>Consulta Directa</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECCIÓN CATÁLOGO */}
      <main id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Filtros por Categoría */}
        <div className="flex items-center justify-between border-b border-[#E6DCCF] pb-4 mb-8 overflow-x-auto">
          <div className="flex space-x-2 sm:space-x-4">
            {[
              { id: "todos", label: "Todos los Productos" },
              { id: "mates", label: "Mates" },
              { id: "bombillas", label: "Bombillas" },
              { id: "termos", label: "Termos" },
              { id: "combos", label: "Combos & Sets" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoriaSel(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${categoriaSel === cat.id
                  ? "bg-[#3B281C] text-[#D4AF37] shadow"
                  : "bg-[#EFE9DF] text-[#5C493C] hover:bg-[#E2D8C9]"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grilla de Productos */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-16 bg-[#F5F0E8] rounded-2xl border border-dashed border-[#C8BBAA]">
            <Coffee className="w-12 h-12 text-[#8C7A6B] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#3B281C]">No encontramos productos</h3>
            <p className="text-sm text-[#7A6859]">Prueba buscando otro término o cambiando de categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productosFiltrados.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#E8DFD3] flex flex-col group"
              >
                {/* Imagen del producto */}
                <div className="relative aspect-square overflow-hidden bg-[#F8F5F0]">
                  <img
                    src={prod.imagen}
                    alt={prod.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {prod.destacado && (
                    <span className="absolute top-3 left-3 bg-[#3B281C] text-[#D4AF37] text-xs font-bold px-2.5 py-1 rounded-md shadow">
                      Destacado
                    </span>
                  )}
                  <button
                    onClick={() => toggleFavorito(prod.id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-[#3B281C] hover:text-red-600 transition-colors shadow"
                  >
                    <Heart className={`w-4 h-4 ${favoritos.includes(prod.id) ? "fill-red-600 text-red-600" : ""}`} />
                  </button>
                </div>

                {/* Info del producto */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-bold text-[#9E816B] uppercase tracking-wider">
                      {prod.categoria}
                    </span>
                    <h3
                      onClick={() => setProductoModal(prod)}
                      className="text-lg font-serif font-bold text-[#2C221E] hover:text-[#7A5438] cursor-pointer transition-colors mt-1"
                    >
                      {prod.nombre}
                    </h3>
                    <p className="text-xs text-[#6E5C4F] line-clamp-2 mt-1">
                      {prod.descripcion}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F0E8DD] flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#8C7A6B] block">Precio</span>
                      <span className="text-xl font-bold text-[#3B281C]">
                        ${prod.precio.toLocaleString("es-AR")}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setProductoModal(prod)}
                        className="p-2.5 text-[#5C493C] hover:bg-[#F2EBDC] rounded-lg border border-[#D8CCBC] transition-colors"
                        title="Ver detalle"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => agregarAlCarrito(prod)}
                        className="px-3.5 py-2.5 bg-[#3B281C] hover:bg-[#523A2A] text-[#D4AF37] font-bold rounded-lg text-xs flex items-center space-x-1.5 transition-colors shadow"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Agregar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* SECCIÓN SOBRE EL EMPRENDIMIENTO */}
      <section className="bg-[#EFE9DF] border-t border-b border-[#D8CCBC] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#3B281C]">
            Sobre "La Matera del Gringo"
          </h3>
          <p className="text-sm sm:text-base text-[#5C493C] leading-relaxed">
            Hola, soy **Marcos Godoy**. Este proyecto nació de la pasión por la cultura Matera. Para ofrecerte piezas únicas que te acompañen en cada cebada, ya sea en el trabajo, la facultad o compartiendo con amigos.
          </p>
        </div>
      </section>

      {/* PIE DE PÁGINA */}
      <footer className="bg-[#2A1D14] text-[#D2C3B4] py-12 px-4 sm:px-6 lg:px-8 border-t border-[#3B281C]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h4 className="text-lg font-serif font-bold text-[#F3EAD8] mb-3">La Matera del Gringo</h4>
            <p className="text-xs text-[#9A8271] leading-relaxed">
              Venta de mates, bombillas, termos y accesorios materos de primera calidad.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F3EAD8] uppercase tracking-wider mb-3">Contacto Directo</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>+54 9 2923410901</span>
              </li>
              <li className="flex items-center space-x-2">
                <InstagramIcon className="w-4 h-4 text-[#D4AF37]" />
                <span>@mglamateradelgringo</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>Cnel Pringles, Buenos Aires, Argentina</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F3EAD8] uppercase tracking-wider mb-3">Horarios de Atención</h4>
            <p className="text-xs text-[#9A8271]">Lunes a Sábados de 09:00 a 19:00 hs.</p>
            <p className="text-xs text-[#9A8271] mt-1">Envíos a todo el país.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#3B281C] text-center text-xs text-[#7A6859]">
          © {new Date().getFullYear()} La Matera del Gringo. Desarrollado por Marcos.
        </div>
      </footer>

      {/* MODAL DETALLE PRODUCTO */}
      {productoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#D8CCBC]">
            <div className="relative aspect-video bg-[#F5F0E8]">
              <img src={productoModal.imagen} alt={productoModal.nombre} className="w-full h-full object-cover" />
              <button
                onClick={() => setProductoModal(null)}
                className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <span className="text-xs font-bold text-[#9E816B] uppercase tracking-wider">{productoModal.categoria}</span>
              <h3 className="text-2xl font-serif font-bold text-[#2C221E]">{productoModal.nombre}</h3>
              <p className="text-sm text-[#5C493C] leading-relaxed">{productoModal.descripcion}</p>
              <div className="flex items-center justify-between pt-4 border-t border-[#F0E8DD]">
                <span className="text-2xl font-bold text-[#3B281C]">${productoModal.precio.toLocaleString("es-AR")}</span>
                <button
                  onClick={() => {
                    agregarAlCarrito(productoModal);
                    setProductoModal(null);
                  }}
                  className="px-5 py-2.5 bg-[#3B281C] hover:bg-[#523A2A] text-[#D4AF37] font-bold rounded-lg text-sm flex items-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Agregar al Carrito</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR DEL CARRITO */}
      {carritoAbierto && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCarritoAbierto(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div className="p-5 bg-[#3B281C] text-[#F3EAD8] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-serif font-bold text-lg">Tu Carrito de Compras</h3>
                </div>
                <button onClick={() => setCarritoAbierto(false)} className="text-[#9A8271] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-[#F0E8DD]">
                {carrito.length === 0 ? (
                  <div className="text-center py-12 text-[#8C7A6B]">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold">El carrito está vacío</p>
                    <p className="text-xs">¡Agregá productos para realizar tu pedido!</p>
                  </div>
                ) : (
                  carrito.map((item) => (
                    <div key={item.id} className="pt-4 flex items-center space-x-4">
                      <img src={item.imagen} alt={item.nombre} className="w-16 h-16 object-cover rounded-lg border border-[#E8DFD3]" />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-[#2C221E]">{item.nombre}</h4>
                        <span className="text-xs text-[#8C7A6B]">${item.precio.toLocaleString("es-AR")}</span>
                        <div className="flex items-center space-x-2 mt-2">
                          <button onClick={() => modificarCantidad(item.id, -1)} className="p-1 rounded bg-[#EFE9DF] hover:bg-[#E2D8C9]">
                            <Minus className="w-3 h-3 text-[#3B281C]" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.cantidad}</span>
                          <button onClick={() => modificarCantidad(item.id, 1)} className="p-1 rounded bg-[#EFE9DF] hover:bg-[#E2D8C9]">
                            <Plus className="w-3 h-3 text-[#3B281C]" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold block text-[#3B281C]">
                          ${(item.precio * item.cantidad).toLocaleString("es-AR")}
                        </span>
                        <button onClick={() => eliminarDelCarrito(item.id)} className="text-red-500 hover:text-red-700 mt-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {carrito.length > 0 && (
                <div className="p-5 border-t border-[#E8DFD3] bg-[#FDFBF7] space-y-4">
                  <div className="flex justify-between text-base font-bold text-[#3B281C]">
                    <span>Total estimado:</span>
                    <span>${totalCarrito.toLocaleString("es-AR")}</span>
                  </div>
                  <button
                    onClick={enviarPedidoWhatsApp}
                    className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Enviar Pedido por WhatsApp</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}