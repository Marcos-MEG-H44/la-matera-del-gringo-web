import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const DataContext = createContext(null);

const STORAGE_KEYS = {
  PRODUCTS: "matera_productos_v2",
  CATEGORIES: "matera_categorias_v2",
  PROMOTIONS: "matera_promociones_v2"
};

// Filtro estricto para asegurar que ningún producto o categoría contenga o muestre 'compañero/s'
export const noEsCompanero = (item) => {
  if (!item) return false;
  const texto = `${item.nombre || ""} ${item.descripcion || ""} ${item.categoria || ""} ${item.label || ""} ${item.id || ""}`;
  return !/compa[ñn]er/i.test(texto);
};

// Catálogo inicial con los 25 productos existentes
export const PRODUCTOS_INICIALES = [
  {
    id: 1,
    nombre: "Mate Imperial mixto.",
    categoria: "mates",
    precio: 31500,
    destacado: true,
    descripcion: "Mate de calabaza Imperial Mixto, forrado en cuero vacuno legítimo, fleje de alpaca virola de acero.",
    imagen: "/productos/mateimperialmixto.jpeg",
    stock: 8,
    activo: true
  },
  {
    id: 2,
    nombre: "Mate Camionero.",
    categoria: "mates",
    precio: 29000,
    destacado: true,
    descripcion: "Mate de calabaza Camionero, forrador en cuero vacuno legitimo, virola de acero.",
    imagen: "/productos/matecamionero.jpeg",
    stock: 15,
    activo: true
  },
  {
    id: 3,
    nombre: "Termo dorado 1.2L Acero Inox.",
    categoria: "termos",
    precio: 35000,
    destacado: false,
    descripcion: "Termo con doble pared de aislamiento al vacío. Mantiene el agua caliente durante más de 24 horas. Pico cebador de precisión.",
    imagen: "/productos/termodorado.jpeg",
    stock: 5,
    activo: true
  },
  {
    id: 4,
    nombre: "Combo Matero El Gringo.",
    categoria: "combos",
    precio: 64000,
    destacado: true,
    descripcion: "Incluye Mate Imperial Algarrobo con fleje de Alpaca y virola de acero + Bombilla Picoloro + Termo 1L acero inox + Luz p/bombilla +Matera simil cuero.",
    imagen: "/productos/comboElGringo.jpeg",
    stock: 3,
    activo: true
  },
  {
    id: 5,
    nombre: "Mate Torpedo Algarrobo.",
    categoria: "mates",
    precio: 22000,
    destacado: false,
    descripcion: "Mate torpedo tallado en madera maciza de algarrobo estacionado, curado tradicional con manteca y yerba, virola de acero.",
    imagen: "/productos/torpedoalgarrobo.jpeg",
    stock: 10,
    activo: true
  },
  {
    id: 6,
    nombre: "Matera Canasta simil cuero.",
    categoria: "combos",
    precio: 23500,
    destacado: false,
    descripcion: "Canasta matera simil cuero con divisores para termo, mate y yerbera. Muy resistente.",
    imagen: "/productos/canastasimilcuero.jpeg",
    stock: 6,
    activo: true
  },
  {
    id: 7,
    nombre: "Bombilla chata acero, grabada.",
    categoria: "bombillas",
    precio: 4200,
    destacado: false,
    descripcion: "Bombilla chata acero, grabada",
    imagen: "/productos/bombillachata.jpeg",
    stock: 10,
    activo: true
  },
  {
    id: 8,
    nombre: "Combo Matero La Nona.",
    categoria: "combos",
    precio: 61000,
    destacado: false,
    descripcion: "Incluye Mate Imperial Algarrobo con fleje de Alpaca y virola de acero + Bombilla Pico Loro + Termo 1 L blanco acero Inox + Matera simil cuero + Chau lata yerba y azucarera",
    imagen: "/productos/comboLaNona.jpeg",
    stock: 10,
    activo: true
  },
  {
    id: 9,
    nombre: "Mesita matera.",
    categoria: "accesorios",
    precio: 21000,
    destacado: false,
    descripcion: "Mesita portatil, madera de pino.",
    imagen: "/productos/mesitaMatera.jpeg",
    stock: 10,
    activo: true
  },
  {
    id: 10,
    nombre: "Grabados Personalizados.",
    categoria: "grabados",
    precio: 16000,
    destacado: false,
    descripcion: "Grabados personalizados de virolas de acero.",
    imagen: "/productos/grabadosVirolas.jpeg",
    stock: 10,
    activo: true
  },
  {
    id: 11,
    nombre: "Luz para bombilla.",
    categoria: "accesorios",
    precio: 6100,
    destacado: false,
    descripcion: "Luz para Bombilla.",
    imagen: "/productos/luzBombilla.jpeg",
    stock: 10,
    activo: true
  },
  {
    id: 12,
    nombre: "Mate Torpedo cuero.",
    categoria: "mates",
    precio: 22000,
    destacado: false,
    descripcion: "Mate torpedo calabaza forrado en cuero, virola de acero.",
    imagen: "/productos/torpedocuero.jpeg",
    stock: 10,
    activo: true
  },
  {
    id: 13,
    nombre: "Mate Criollo Negro.",
    categoria: "mates",
    precio: 22000,
    destacado: false,
    descripcion: "Mate Calabaza Negro con base de cuero.",
    imagen: "/productos/matecalabazanegro.jpeg",
    stock: 10,
    activo: true
  },
  {
    id: 14,
    nombre: "Mate Criollo redondo.",
    categoria: "mates",
    precio: 22000,
    destacado: false,
    descripcion: "Mate calabaza copa, con base de cuero.",
    imagen: "/productos/matecalabazacopa.jpeg",
    stock: 10,
    activo: true
  },
  {
    id: 15,
    nombre: "Mate Criollo.",
    categoria: "mates",
    precio: 22000,
    destacado: false,
    descripcion: "Mate calabaza liso.",
    imagen: "/productos/matecalabazablanco.jpeg",
    stock: 10,
    activo: true
  },
  {
    id: 16,
    nombre: "Mate 3D equipos",
    categoria: "mates",
    precio: 22000,
    destacado: false,
    descripcion: "Mate equipos de futbol 3D varios colores.",
    imagen: "/productos/mate3D.jpeg",
    stock: 10,
    activo: true
  },
  {
    id: 17,
    nombre: "Latas Azucar y Yerba.",
    categoria: "accesorios",
    precio: 6100,
    destacado: false,
    descripcion: "Latas Azucar y Yerba varios colores.",
    imagen: "/productos/latasAzucarYerba.jpeg",
    stock: 10,
    activo: true
  },
  {
    id: 18,
    nombre: "Termo negro 1.2L Acero Inox.",
    categoria: "termos",
    precio: 35000,
    destacado: false,
    descripcion: "Termo con doble pared de aislamiento al vacío. Mantiene el agua caliente durante más de 24 horas. Pico cebador de precisión.",
    imagen: "/productos/termonegro.jpeg",
    stock: 5,
    activo: true
  },
  {
    id: 19,
    nombre: "Termo 1L Acero Inox.",
    categoria: "termos",
    precio: 35000,
    destacado: false,
    descripcion: "Termo con doble pared de aislamiento al vacío. Mantiene el agua caliente durante más de 24 horas. Pico cebador de precisión.",
    imagen: "/productos/termoacero.jpeg",
    stock: 5,
    activo: true
  },
  {
    id: 20,
    nombre: "Termo 1 L Acero Inox Equipos.",
    categoria: "termos",
    precio: 35000,
    destacado: false,
    descripcion: "Termo con doble pared de aislamiento al vacío. Mantiene el agua caliente durante más de 24 horas. Pico cebador de precisión, Equipos.",
    imagen: "/productos/termoequipos.jpeg",
    stock: 5,
    activo: true
  },
  {
    id: 21,
    nombre: "Choops.",
    categoria: "accesorios",
    precio: 6100,
    destacado: false,
    descripcion: "Choops 750 cm3.",
    imagen: "/productos/chop.jpeg",
    stock: 10,
    activo: true
  },
  {
    id: 22,
    nombre: "Vaso Fernetero.",
    categoria: "accesorios",
    precio: 6100,
    destacado: false,
    descripcion: "Vaso Fernetero Rosa, ideal para grabados personalizados.",
    imagen: "/productos/vasorosa.jpeg",
    stock: 10,
    activo: true
  },
  {
    id: 23,
    nombre: "Vaso Fernetero Grabado.",
    categoria: "accesorios",
    precio: 6100,
    destacado: false,
    descripcion: "Vaso Fernetero Grabado varios equipos.",
    imagen: "/productos/vasograbado.jpeg",
    stock: 10,
    activo: true
  },
  {
    id: 24,
    nombre: "Botella Termica.",
    categoria: "accesorios",
    precio: 6100,
    destacado: false,
    descripcion: "Botella termica.",
    imagen: "/productos/botella.jpeg",
    stock: 10,
    activo: true
  },
  {
    id: 25,
    nombre: "Porta Termo.",
    categoria: "accesorios",
    precio: 6100,
    destacado: false,
    descripcion: "Porta termo simil cuero.",
    imagen: "/productos/portatermo.jpeg",
    stock: 10,
    activo: true
  }
];

export const CATEGORIAS_INICIALES = [
  { id: "mates", label: "Mates", count: 8 },
  { id: "bombillas", label: "Bombillas", count: 1 },
  { id: "termos", label: "Termos", count: 4 },
  { id: "accesorios", label: "Accesorios", count: 7 },
  { id: "grabados", label: "Grabados", count: 1 },
  { id: "combos", label: "Combos & Sets", count: 3 }
];

// Fechas dinámicas para promociones de ejemplo representativas
const hoy = new Date();
const formatFecha = (d) => d.toISOString().split("T")[0];

const fechaPasadaInicio = new Date(hoy);
fechaPasadaInicio.setDate(hoy.getDate() - 20);
const fechaPasadaFin = new Date(hoy);
fechaPasadaFin.setDate(hoy.getDate() - 5);

const fechaActivaInicio = new Date(hoy);
fechaActivaInicio.setDate(hoy.getDate() - 3);
const fechaActivaFin = new Date(hoy);
fechaActivaFin.setDate(hoy.getDate() + 7);

const fechaFuturaInicio = new Date(hoy);
fechaFuturaInicio.setDate(hoy.getDate() + 10);
const fechaFuturaFin = new Date(hoy);
fechaFuturaFin.setDate(hoy.getDate() + 25);

export const PROMOCIONES_INICIALES = [
  {
    id: 1,
    titulo: "Semana del Mate Criollo",
    producto_id: 1, // Mate Imperial mixto
    categoria: "mates",
    porcentaje_descuento: 15,
    fecha_inicio: formatFecha(fechaActivaInicio),
    fecha_fin: formatFecha(fechaActivaFin),
    activa: true
  },
  {
    id: 2,
    titulo: "Promo Especial Termos Dorados",
    producto_id: 3, // Termo dorado 1.2L
    categoria: "termos",
    porcentaje_descuento: 20,
    fecha_inicio: formatFecha(fechaFuturaInicio),
    fecha_fin: formatFecha(fechaFuturaFin),
    activa: true
  },
  {
    id: 3,
    titulo: "Lanzamiento Combos El Gringo",
    producto_id: 4,
    categoria: "combos",
    porcentaje_descuento: 10,
    fecha_inicio: formatFecha(fechaPasadaInicio),
    fecha_fin: formatFecha(fechaPasadaFin),
    activa: true
  }
];

export const DataProvider = ({ children }) => {
  // 1. Estado de Productos (Normalizando soporte multi-imagen y excluyendo cualquier 'compañero/s')
  const [productos, setProductos] = useState(() => {
    try {
      // Limpiar datos obsoletos de v1 si existían en el navegador
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem("matera_productos_v1");
        localStorage.removeItem("matera_categorias_v1");
      }
      const guardados = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (guardados) {
        const parsed = JSON.parse(guardados);
        return parsed
          .filter(noEsCompanero)
          .map((p) => ({
            ...p,
            imagenes: Array.isArray(p.imagenes) && p.imagenes.length > 0 ? p.imagenes : (p.imagen ? [p.imagen] : [])
          }));
      }
    } catch (e) {
      console.error("Error leyendo productos:", e);
    }
    return PRODUCTOS_INICIALES
      .filter(noEsCompanero)
      .map((p) => ({
        ...p,
        imagenes: [p.imagen]
      }));
  });

  // 2. Estado de Categorías (Excluyendo 'compañero/s')
  const [categorias, setCategorias] = useState(() => {
    try {
      const guardadas = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (guardadas) {
        const parsed = JSON.parse(guardadas);
        return parsed.filter(noEsCompanero);
      }
    } catch (e) {
      console.error("Error leyendo categorías:", e);
    }
    return CATEGORIAS_INICIALES.filter(noEsCompanero);
  });

  // 3. Estado de Promociones
  const [promociones, setPromociones] = useState(() => {
    try {
      const guardadas = localStorage.getItem(STORAGE_KEYS.PROMOTIONS);
      if (guardadas) return JSON.parse(guardadas);
    } catch (e) {
      console.error("Error leyendo promociones:", e);
    }
    return PROMOCIONES_INICIALES;
  });

  // Guardar en localStorage ante cambios (siempre filtrado)
  useEffect(() => {
    const limpios = productos.filter(noEsCompanero);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(limpios));
  }, [productos]);

  useEffect(() => {
    const limpios = categorias.filter(noEsCompanero);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(limpios));
  }, [categorias]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(promociones));
  }, [promociones]);

  // Sincronización inicial opcional con Supabase si está disponible
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const cargarDesdeSupabase = async () => {
      try {
        const { data: prods } = await supabase.from("productos").select("*");
        if (prods && prods.length > 0) {
          setProductos(prods.filter(noEsCompanero));
        }

        const { data: cats } = await supabase.from("categorias").select("*");
        if (cats && cats.length > 0) {
          setCategorias(cats.map(c => ({ id: c.id, label: c.nombre })).filter(noEsCompanero));
        }

        const { data: promos } = await supabase.from("promociones").select("*");
        if (promos && promos.length > 0) {
          setPromociones(promos);
        }
      } catch (err) {
        console.warn("No se pudo sincronizar con Supabase, usando almacenamiento local:", err);
      }
    };

    cargarDesdeSupabase();
  }, []);

  // Determinar estado de una promoción según fecha actual
  // Fecha actual < Fecha Inicio -> PROMOCIÓN PENDIENTE (🟡)
  // Fecha Inicio <= Fecha actual <= Fecha Fin -> PROMOCIÓN ACTIVA (🟢)
  // Fecha actual > Fecha Fin -> PROMOCIÓN FINALIZADA (🔴)
  const getPromotionStatus = (promo) => {
    if (!promo.activa) return "pausada";

    const hoyStr = new Date().toISOString().split("T")[0];
    const inicio = promo.fecha_inicio;
    const fin = promo.fecha_fin;

    if (hoyStr < inicio) return "pendiente";
    if (hoyStr >= inicio && hoyStr <= fin) return "activa";
    return "finalizada";
  };

  // Calcular precio con descuento si hay promoción activa aplicable
  const getDiscountedPrice = (producto) => {
    if (!producto) return { hasDiscount: false, finalPrice: 0, originalPrice: 0 };

    // Buscar si hay una promo activa específica para este producto o categoría
    const promoActiva = promociones.find((p) => {
      if (getPromotionStatus(p) !== "activa") return false;
      if (p.producto_id && Number(p.producto_id) === Number(producto.id)) return true;
      if (!p.producto_id && p.categoria && p.categoria === producto.categoria) return true;
      return false;
    });

    if (promoActiva) {
      const descuento = Number(promoActiva.porcentaje_descuento) || 0;
      const finalPrice = Math.round(producto.precio * (1 - descuento / 100));
      return {
        hasDiscount: true,
        discountPercent: descuento,
        originalPrice: producto.precio,
        finalPrice,
        promoTitle: promoActiva.titulo
      };
    }

    return {
      hasDiscount: false,
      discountPercent: 0,
      originalPrice: producto.precio,
      finalPrice: producto.precio,
      promoTitle: null
    };
  };

  // CRUD de Productos con soporte de múltiples imágenes
  const addProduct = async (nuevoProducto) => {
    const nextId = productos.length > 0 ? Math.max(...productos.map(p => Number(p.id) || 0)) + 1 : 1;
    const arrayImagenes = Array.isArray(nuevoProducto.imagenes) && nuevoProducto.imagenes.length > 0
      ? nuevoProducto.imagenes
      : (nuevoProducto.imagen ? [nuevoProducto.imagen] : []);
    const imagenPrincipal = arrayImagenes[0] || nuevoProducto.imagen || "/productos/mateimperialmixto.jpeg";

    const productoParaGuardar = {
      ...nuevoProducto,
      id: nextId,
      imagen: imagenPrincipal,
      imagenes: arrayImagenes.length > 0 ? arrayImagenes : [imagenPrincipal],
      precio: Number(nuevoProducto.precio) || 0,
      stock: Number(nuevoProducto.stock) || 0,
      destacado: Boolean(nuevoProducto.destacado),
      activo: nuevoProducto.activo !== undefined ? nuevoProducto.activo : true,
      created_at: new Date().toISOString()
    };

    setProductos((prev) => [productoParaGuardar, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("productos").insert([productoParaGuardar]);
      } catch (e) {
        console.error("Error guardando producto en Supabase:", e);
      }
    }

    return productoParaGuardar;
  };

  const updateProduct = async (id, datosActualizados) => {
    setProductos((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;

        let nuevasImagenes = datosActualizados.imagenes !== undefined
          ? datosActualizados.imagenes
          : (p.imagenes || [p.imagen]);

        let imagenPrincipal = datosActualizados.imagen !== undefined
          ? datosActualizados.imagen
          : (nuevasImagenes[0] || p.imagen);

        // Si se actualizó 'imagen' individual pero no 'imagenes', sincronizarlo
        if (datosActualizados.imagen && (!datosActualizados.imagenes || datosActualizados.imagenes.length === 0)) {
          nuevasImagenes = [datosActualizados.imagen, ...(p.imagenes || []).filter(img => img !== datosActualizados.imagen)];
        }

        return {
          ...p,
          ...datosActualizados,
          imagen: imagenPrincipal,
          imagenes: nuevasImagenes,
          precio: Number(datosActualizados.precio !== undefined ? datosActualizados.precio : p.precio)
        };
      })
    );

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("productos").update(datosActualizados).eq("id", id);
      } catch (e) {
        console.error("Error actualizando producto en Supabase:", e);
      }
    }
  };

  // Agregar una imagen adicional a un producto
  const addProductImage = async (productId, newImageUrl) => {
    if (!newImageUrl) return;
    const prod = productos.find((p) => p.id === productId);
    if (!prod) return;

    const imagenesActuales = Array.isArray(prod.imagenes) && prod.imagenes.length > 0
      ? prod.imagenes
      : (prod.imagen ? [prod.imagen] : []);

    const updatedImages = [...imagenesActuales, newImageUrl];
    await updateProduct(productId, { imagenes: updatedImages, imagen: updatedImages[0] });
  };

  // Eliminar una imagen de un producto
  const removeProductImage = async (productId, imageIndex) => {
    const prod = productos.find((p) => p.id === productId);
    if (!prod) return;

    const imagenesActuales = Array.isArray(prod.imagenes) && prod.imagenes.length > 0
      ? [...prod.imagenes]
      : (prod.imagen ? [prod.imagen] : []);

    if (imagenesActuales.length <= 1) {
      // Debe quedar al menos una imagen
      return false;
    }

    imagenesActuales.splice(imageIndex, 1);
    await updateProduct(productId, {
      imagenes: imagenesActuales,
      imagen: imagenesActuales[0]
    });
    return true;
  };

  // Establecer una imagen como principal (index 0)
  const setProductMainImage = async (productId, imageIndex) => {
    const prod = productos.find((p) => p.id === productId);
    if (!prod) return;

    const imagenesActuales = Array.isArray(prod.imagenes) && prod.imagenes.length > 0
      ? [...prod.imagenes]
      : (prod.imagen ? [prod.imagen] : []);

    if (imageIndex < 0 || imageIndex >= imagenesActuales.length) return;

    const [selectedImg] = imagenesActuales.splice(imageIndex, 1);
    const reordered = [selectedImg, ...imagenesActuales];

    await updateProduct(productId, {
      imagenes: reordered,
      imagen: selectedImg
    });
  };

  const deleteProduct = async (id) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
    // Eliminar también promociones asociadas a este producto
    setPromociones((prev) => prev.filter((pr) => Number(pr.producto_id) !== Number(id)));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("productos").delete().eq("id", id);
      } catch (e) {
        console.error("Error eliminando producto en Supabase:", e);
      }
    }
  };

  const toggleProductActive = (id) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activo: !p.activo } : p))
    );
  };

  const toggleProductFeatured = (id) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, destacado: !p.destacado } : p))
    );
  };

  const updateProductPrice = (id, nuevoPrecio) => {
    const precioNumerico = Number(nuevoPrecio);
    if (isNaN(precioNumerico) || precioNumerico < 0) return;
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, precio: precioNumerico } : p))
    );
  };

  // CRUD de Categorías
  const addCategory = (nuevaCat) => {
    const id = nuevaCat.id || nuevaCat.label.toLowerCase().replace(/\s+/g, "-");
    setCategorias((prev) => [...prev, { ...nuevaCat, id }]);
  };

  const updateCategory = (id, nuevaInfo) => {
    setCategorias((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...nuevaInfo } : c))
    );
  };

  const deleteCategory = (id) => {
    setCategorias((prev) => prev.filter((c) => c.id !== id));
  };

  // CRUD de Promociones
  const addPromotion = async (nuevaPromo) => {
    const nextId = promociones.length > 0 ? Math.max(...promociones.map(p => Number(p.id) || 0)) + 1 : 1;
    const promoParaGuardar = {
      ...nuevaPromo,
      id: nextId,
      porcentaje_descuento: Number(nuevaPromo.porcentaje_descuento) || 0,
      activa: nuevaPromo.activa !== undefined ? nuevaPromo.activa : true,
      created_at: new Date().toISOString()
    };

    setPromociones((prev) => [promoParaGuardar, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("promociones").insert([promoParaGuardar]);
      } catch (e) {
        console.error("Error guardando promo en Supabase:", e);
      }
    }

    return promoParaGuardar;
  };

  const updatePromotion = async (id, datosActualizados) => {
    setPromociones((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...datosActualizados } : p))
    );

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("promociones").update(datosActualizados).eq("id", id);
      } catch (e) {
        console.error("Error actualizando promo en Supabase:", e);
      }
    }
  };

  const deletePromotion = async (id) => {
    setPromociones((prev) => prev.filter((p) => p.id !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("promociones").delete().eq("id", id);
      } catch (e) {
        console.error("Error eliminando promo en Supabase:", e);
      }
    }
  };

  const togglePromotionActive = (id) => {
    setPromociones((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activa: !p.activa } : p))
    );
  };

  // Resetear a datos iniciales de fábrica si el usuario lo desea
  const resetToFactoryDefaults = () => {
    setProductos(PRODUCTOS_INICIALES);
    setCategorias(CATEGORIAS_INICIALES);
    setPromociones(PROMOCIONES_INICIALES);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.PROMOTIONS);
  };

  return (
    <DataContext.Provider
      value={{
        productos,
        categorias,
        promociones,
        getPromotionStatus,
        getDiscountedPrice,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
        toggleProductFeatured,
        updateProductPrice,
        addProductImage,
        removeProductImage,
        setProductMainImage,
        addCategory,
        updateCategory,
        deleteCategory,
        addPromotion,
        updatePromotion,
        deletePromotion,
        togglePromotionActive,
        resetToFactoryDefaults
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData debe utilizarse dentro de un DataProvider");
  }
  return context;
};
