import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import {
  ShoppingBag,
  Search,
  Phone,
  MapPin,
  Heart,
  X,
  Plus,
  Minus,
  Trash2,
  Coffee,
  Info,
  Menu,
  ShieldCheck,
  Tag,
  ChevronLeft,
  ChevronRight,
  Images
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

export default function StorePage() {
  const { productos, categorias, getDiscountedPrice } = useData();
  const { isAdmin } = useAuth();

  const [categoriaSel, setCategoriaSel] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [productoModal, setProductoModal] = useState(null);
  const [modalImgIndex, setModalImgIndex] = useState(0);
  const [favoritos, setFavoritos] = useState([]);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  // Filtrado de productos por búsqueda, categoría y estado activo
  const productosFiltrados = useMemo(() => {
    return productos.filter((prod) => {
      // Si el producto está inactivo en el admin, no se muestra en la tienda pública
      if (prod.activo === false) return false;

      const coincideCat = categoriaSel === "todos" || prod.categoria === categoriaSel;
      const coincideBusqueda =
        prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        prod.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      return coincideCat && coincideBusqueda;
    });
  }, [productos, categoriaSel, busqueda]);

  // Funciones del Carrito (con soporte de precios promocionales activos)
  const agregarAlCarrito = (producto) => {
    const discountInfo = getDiscountedPrice(producto);
    const precioUnitario = discountInfo.hasDiscount ? discountInfo.finalPrice : producto.precio;

    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [
        ...prev,
        {
          ...producto,
          precioEfectivo: precioUnitario,
          precioOriginal: producto.precio,
          hasDiscount: discountInfo.hasDiscount,
          discountPercent: discountInfo.discountPercent,
          cantidad: 1
        }
      ];
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
    return carrito.reduce((acc, item) => {
      const p = item.precioEfectivo !== undefined ? item.precioEfectivo : item.precio;
      return acc + p * item.cantidad;
    }, 0);
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

  // Abrir Modal de Producto
  const handleOpenModal = (prod) => {
    setProductoModal(prod);
    setModalImgIndex(0);
  };

  // Imágenes del producto actual en el modal
  const imagenesDelModal = useMemo(() => {
    if (!productoModal) return [];
    if (Array.isArray(productoModal.imagenes) && productoModal.imagenes.length > 0) {
      return productoModal.imagenes;
    }
    return productoModal.imagen ? [productoModal.imagen] : [];
  }, [productoModal]);

  // Navegar entre fotos del modal
  const handlePrevImg = () => {
    if (imagenesDelModal.length <= 1) return;
    setModalImgIndex((prev) => (prev > 0 ? prev - 1 : imagenesDelModal.length - 1));
  };

  const handleNextImg = () => {
    if (imagenesDelModal.length <= 1) return;
    setModalImgIndex((prev) => (prev < imagenesDelModal.length - 1 ? prev + 1 : 0));
  };

  // Enviar pedido por WhatsApp
  const enviarPedidoWhatsApp = () => {
    if (carrito.length === 0) return;

    let mensaje = "¡Hola Marcos! Quiero realizar el siguiente pedido en *La Matera del Gringo*:\n\n";
    carrito.forEach((item) => {
      const p = item.precioEfectivo !== undefined ? item.precioEfectivo : item.precio;
      const promoText = item.hasDiscount ? ` (Oferta -${item.discountPercent}%)` : "";
      mensaje += `• *${item.nombre}* x${item.cantidad}${promoText} - $${(p * item.cantidad).toLocaleString("es-AR")}\n`;
    });
    mensaje += `\n*TOTAL: $${totalCarrito.toLocaleString("es-AR")}*\n\n¿Cómo coordinamos el pago y envío?`;

    const url = `https://wa.me/5492923410901?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#382A24] font-sans selection:bg-[#D4AF37]/30 selection:text-[#5A3825]">
      {/* BARRA SUPERIOR ADMIN DISCRETA (Si ya inició sesión) */}
      {isAdmin && (
        <div className="bg-[#452C1E] text-[#D4AF37] px-4 py-1.5 text-xs flex justify-between items-center border-b border-[#5A3825]">
          <span className="flex items-center space-x-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Modo Administrador Activo</span>
          </span>
          <Link
            to="/admin/dashboard"
            className="hover:underline font-bold text-[#F3EAD8]"
          >
            Ir al Panel de Control →
          </Link>
        </div>
      )}

      {/* NAVEGACIÓN SUPERIOR (Marrón más claro #5A3825) */}
      <header className="sticky top-0 z-40 bg-[#5A3825] text-[#F3EAD8] shadow-md border-b border-[#7A523A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo y Marca */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => {
              setCategoriaSel("todos");
              setBusqueda("");
            }}
          >
            <img
              src="/logo1.jpeg"
              alt="Logo La Matera del Gringo"
              className="w-12 h-12 object-contain rounded-full border border-[#D4AF37]"
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
              className="w-full bg-[#452C1E] text-[#F3EAD8] placeholder-[#B59C8B] pl-10 pr-4 py-2 rounded-full border border-[#7A523A] focus:outline-none focus:border-[#D4AF37] text-sm"
            />
            <Search className="w-4 h-4 text-[#B59C8B] absolute left-3.5 top-3" />
            {busqueda && (
              <button
                onClick={() => setBusqueda("")}
                className="absolute right-3 top-2.5 text-[#B59C8B] hover:text-[#F3EAD8] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Acciones */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCarritoAbierto(true)}
              className="relative p-2.5 bg-[#6E4933] hover:bg-[#7D553D] rounded-full transition-colors border border-[#8C6045] cursor-pointer"
              title="Ver Carrito"
            >
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#5A3825] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
              className="md:hidden p-2 rounded-lg bg-[#6E4933] text-[#F3EAD8] cursor-pointer"
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
              className="w-full bg-[#452C1E] text-[#F3EAD8] placeholder-[#B59C8B] pl-10 pr-4 py-2 rounded-full border border-[#7A523A] text-sm"
            />
            <Search className="w-4 h-4 text-[#B59C8B] absolute left-3.5 top-3" />
          </div>
        </div>
      </header>

      {/* HERO BANNER (Marrón más cálido y luminoso) */}
      <section className="relative bg-[#452C1E] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=1200')`
          }}
        ></div>
        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <span className="inline-block px-3 py-1 bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/50 rounded-full text-xs font-semibold tracking-wider uppercase">
            Mates Selección Especial
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#F3EAD8] leading-tight">
            El Ritual del Buen Mate Empieza Acá
          </h2>
          <p className="text-sm sm:text-lg text-[#E0D0C1] max-w-2xl mx-auto font-light">
            Mates de calabaza, madera de algarrobo, bombillas de alpaca y los mejores accesorios criollos hechos con pasión por <strong>Marcos Godoy</strong>.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <a
              href="#catalogo"
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C29F2F] text-[#5A3825] font-bold rounded-lg shadow-lg transition-all text-sm uppercase tracking-wider cursor-pointer"
            >
              Ver Catálogo
            </a>
            <a
              href="https://wa.me/5492923410901"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg transition-all text-sm flex items-center space-x-2 cursor-pointer"
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
            <button
              onClick={() => setCategoriaSel("todos")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                categoriaSel === "todos"
                  ? "bg-[#5A3825] text-[#D4AF37] shadow font-bold"
                  : "bg-[#EFE9DF] text-[#6B5344] hover:bg-[#E2D8C9]"
              }`}
            >
              Todos los Productos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoriaSel(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  categoriaSel === cat.id
                    ? "bg-[#5A3825] text-[#D4AF37] shadow font-bold"
                    : "bg-[#EFE9DF] text-[#6B5344] hover:bg-[#E2D8C9]"
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
            <h3 className="text-lg font-bold text-[#5A3825]">No encontramos productos</h3>
            <p className="text-sm text-[#7A6859]">
              Prueba buscando otro término o cambiando de categoría.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productosFiltrados.map((prod) => {
              const discountInfo = getDiscountedPrice(prod);
              const hasDiscount = discountInfo.hasDiscount;
              const tieneMultiplesFotos = Array.isArray(prod.imagenes) && prod.imagenes.length > 1;

              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow border border-[#E8DFD3] flex flex-col group"
                >
                  {/* IMAGEN DEL PRODUCTO (Centrada y Completa con object-contain) */}
                  <div
                    onClick={() => handleOpenModal(prod)}
                    className="relative aspect-square overflow-hidden bg-[#F8F5F0] flex items-center justify-center p-3 cursor-pointer"
                  >
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badges: Destacado, Descuento y Multi-Fotos */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                      {prod.destacado && (
                        <span className="bg-[#5A3825] text-[#D4AF37] text-xs font-bold px-2.5 py-1 rounded-md shadow">
                          ⭐ Destacado
                        </span>
                      )}
                      {hasDiscount && (
                        <span className="bg-emerald-700 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow flex items-center space-x-1">
                          <Tag className="w-3 h-3" />
                          <span>-{discountInfo.discountPercent}% OFF</span>
                        </span>
                      )}
                    </div>

                    {/* Indicador de más fotos */}
                    {tieneMultiplesFotos && (
                      <span className="absolute bottom-3 left-3 bg-[#5A3825]/85 text-[#F3EAD8] text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center space-x-1 shadow">
                        <Images className="w-3 h-3 text-[#D4AF37]" />
                        <span>{prod.imagenes.length} fotos</span>
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorito(prod.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/85 backdrop-blur-sm rounded-full text-[#5A3825] hover:text-red-600 transition-colors shadow cursor-pointer"
                      title="Agregar a favoritos"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favoritos.includes(prod.id) ? "fill-red-600 text-red-600" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Info del producto */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-xs font-bold text-[#9E816B] uppercase tracking-wider">
                        {prod.categoria}
                      </span>
                      <h3
                        onClick={() => handleOpenModal(prod)}
                        className="text-lg font-serif font-bold text-[#382A24] hover:text-[#8F5D38] cursor-pointer transition-colors mt-1"
                      >
                        {prod.nombre}
                      </h3>
                      <p className="text-xs text-[#6B5344] line-clamp-2 mt-1">
                        {prod.descripcion}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#F0E8DD] flex items-center justify-between">
                      <div>
                        {hasDiscount ? (
                          <div>
                            <span className="text-[11px] text-[#8C7A6B] line-through block">
                              ${prod.precio.toLocaleString("es-AR")}
                            </span>
                            <span className="text-xl font-bold text-emerald-800">
                              ${discountInfo.finalPrice.toLocaleString("es-AR")}
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-xs text-[#8C7A6B] block">Precio</span>
                            <span className="text-xl font-bold text-[#5A3825]">
                              ${prod.precio.toLocaleString("es-AR")}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenModal(prod)}
                          className="p-2.5 text-[#6B5344] hover:bg-[#F2EBDC] rounded-lg border border-[#D8CCBC] transition-colors cursor-pointer"
                          title="Ver detalle"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => agregarAlCarrito(prod)}
                          className="px-3.5 py-2.5 bg-[#5A3825] hover:bg-[#6E4933] text-[#D4AF37] font-bold rounded-lg text-xs flex items-center space-x-1.5 transition-colors shadow cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Agregar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* SECCIÓN SOBRE EL EMPRENDIMIENTO */}
      <section className="bg-[#EFE9DF] border-t border-b border-[#D8CCBC] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#5A3825]">
            Sobre "La Matera del Gringo"
          </h3>
          <p className="text-sm sm:text-base text-[#6B5344] leading-relaxed">
            Hola, soy <strong>Marcos Godoy</strong>. Este proyecto nació de la pasión por la cultura
            Matera. Para ofrecerte piezas únicas que te acompañen en cada cebada, ya sea en el
            trabajo, la facultad o compartiendo con amigos.
          </p>
        </div>
      </section>

      {/* PIE DE PÁGINA (Marrón más cálido y accesible) */}
      <footer className="bg-[#452C1E] text-[#E0D0C1] py-12 px-4 sm:px-6 lg:px-8 border-t border-[#5A3825]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h4 className="text-lg font-serif font-bold text-[#F3EAD8] mb-3">La Matera del Gringo</h4>
            <p className="text-xs text-[#B59C8B] leading-relaxed">
              Venta de mates, bombillas, termos y accesorios materos de primera calidad.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F3EAD8] uppercase tracking-wider mb-3">
              Contacto Directo
            </h4>
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
            <h4 className="text-sm font-bold text-[#F3EAD8] uppercase tracking-wider mb-3">
              Horarios de Atención
            </h4>
            <p className="text-xs text-[#B59C8B]">Lunes a Sábados de 09:00 a 19:00 hs.</p>
            <p className="text-xs text-[#B59C8B] mt-1">Envíos a todo el país.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#5A3825] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9E816B] gap-4">
          <div>
            © {new Date().getFullYear()} La Matera del Gringo. Desarrollado por Marcos.
          </div>
          <div>
            <Link
              to="/admin/login"
              className="inline-flex items-center space-x-1.5 text-[#D4AF37] hover:underline transition-colors font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Acceso Administrativo</span>
            </Link>
          </div>
        </div>
      </footer>

      {/* MODAL DETALLE PRODUCTO CON VISOR DE MÚLTIPLES FOTOS CENTRADAS Y COMPLETAS */}
      {productoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#D8CCBC]">
            {/* VISOR DE FOTO: Centrado y Completo (object-contain) */}
            <div className="relative h-72 sm:h-84 bg-[#F5F0E8] flex items-center justify-center p-4 overflow-hidden border-b border-[#E8DFD3]">
              <img
                src={imagenesDelModal[modalImgIndex] || productoModal.imagen}
                alt={productoModal.nombre}
                className="max-h-full max-w-full object-contain drop-shadow-sm transition-all duration-300"
              />

              {/* Botón Cerrar */}
              <button
                onClick={() => setProductoModal(null)}
                className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Flechas de navegación para múltiples fotos */}
              {imagenesDelModal.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-[#5A3825] shadow-md transition-all cursor-pointer"
                    title="Foto anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-[#5A3825] shadow-md transition-all cursor-pointer"
                    title="Foto siguiente"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {modalImgIndex + 1} / {imagenesDelModal.length}
                  </span>
                </>
              )}
            </div>

            {/* Tira de Miniaturas (si tiene más de 1 foto) */}
            {imagenesDelModal.length > 1 && (
              <div className="flex gap-2 p-3 bg-[#FDFBF7] border-b border-[#E8DFD3] overflow-x-auto">
                {imagenesDelModal.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setModalImgIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 flex items-center justify-center p-1 bg-white shrink-0 cursor-pointer transition-all ${
                      modalImgIndex === idx
                        ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-sm"
                        : "border-[#E8DFD3] opacity-65 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt="" className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Info del Producto */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#9E816B] uppercase tracking-wider">
                  {productoModal.categoria}
                </span>
                {getDiscountedPrice(productoModal).hasDiscount && (
                  <span className="bg-emerald-700 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow">
                    -{getDiscountedPrice(productoModal).discountPercent}% OFF
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#382A24]">{productoModal.nombre}</h3>
              <p className="text-sm text-[#6B5344] leading-relaxed">{productoModal.descripcion}</p>
              <div className="flex items-center justify-between pt-4 border-t border-[#F0E8DD]">
                <div>
                  {getDiscountedPrice(productoModal).hasDiscount ? (
                    <div>
                      <span className="text-xs text-[#8C7A6B] line-through block">
                        ${productoModal.precio.toLocaleString("es-AR")}
                      </span>
                      <span className="text-2xl font-bold text-emerald-800">
                        ${getDiscountedPrice(productoModal).finalPrice.toLocaleString("es-AR")}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-[#5A3825]">
                      ${productoModal.precio.toLocaleString("es-AR")}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    agregarAlCarrito(productoModal);
                    setProductoModal(null);
                  }}
                  className="px-5 py-2.5 bg-[#5A3825] hover:bg-[#6E4933] text-[#D4AF37] font-bold rounded-xl text-sm flex items-center space-x-2 shadow transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Agregar al Carrito</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR DEL CARRITO (Marrón más claro #5A3825) */}
      {carritoAbierto && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setCarritoAbierto(false)}
          ></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div className="p-5 bg-[#5A3825] text-[#F3EAD8] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-serif font-bold text-lg">Tu Carrito de Compras</h3>
                </div>
                <button
                  onClick={() => setCarritoAbierto(false)}
                  className="text-[#B59C8B] hover:text-white cursor-pointer"
                >
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
                  carrito.map((item) => {
                    const precioUnit = item.precioEfectivo !== undefined ? item.precioEfectivo : item.precio;

                    return (
                      <div key={item.id} className="pt-4 flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-xl border border-[#E8DFD3] bg-[#F8F5F0] flex items-center justify-center p-1 shrink-0 overflow-hidden">
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-[#382A24]">{item.nombre}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-[#8C7A6B]">
                              ${precioUnit.toLocaleString("es-AR")}
                            </span>
                            {item.hasDiscount && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                -{item.discountPercent}%
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => modificarCantidad(item.id, -1)}
                              className="p-1 rounded bg-[#EFE9DF] hover:bg-[#E2D8C9] cursor-pointer"
                            >
                              <Minus className="w-3 h-3 text-[#5A3825]" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.cantidad}</span>
                            <button
                              onClick={() => modificarCantidad(item.id, 1)}
                              className="p-1 rounded bg-[#EFE9DF] hover:bg-[#E2D8C9] cursor-pointer"
                            >
                              <Plus className="w-3 h-3 text-[#5A3825]" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold block text-[#5A3825]">
                            ${(precioUnit * item.cantidad).toLocaleString("es-AR")}
                          </span>
                          <button
                            onClick={() => eliminarDelCarrito(item.id)}
                            className="text-red-500 hover:text-red-700 mt-2 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {carrito.length > 0 && (
                <div className="p-5 border-t border-[#E8DFD3] bg-[#FDFBF7] space-y-4">
                  <div className="flex justify-between text-base font-bold text-[#5A3825]">
                    <span>Total estimado:</span>
                    <span>${totalCarrito.toLocaleString("es-AR")}</span>
                  </div>
                  <button
                    onClick={enviarPedidoWhatsApp}
                    className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
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
