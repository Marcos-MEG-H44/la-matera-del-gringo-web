import React from "react";
import { useData } from "../../context/DataContext";
import {
  Package,
  Star,
  Percent,
  Layers,
  AlertTriangle,
  PlusCircle,
  Calendar,
  CheckCircle2,
  RotateCcw
} from "lucide-react";

export default function DashboardHome({ setActiveTab, onOpenNewProductModal }) {
  const { productos, categorias, promociones, getPromotionStatus, resetToFactoryDefaults } = useData();

  const totalProductos = productos.length;
  const productosActivos = productos.filter((p) => p.activo).length;
  const productosDestacados = productos.filter((p) => p.destacado).length;

  const promosActivas = promociones.filter((p) => getPromotionStatus(p) === "activa");
  const promosPendientes = promociones.filter((p) => getPromotionStatus(p) === "pendiente");
  const promosFinalizadas = promociones.filter((p) => getPromotionStatus(p) === "finalizada");

  const stockBajo = productos.filter((p) => p.stock <= 5);

  const handleReset = () => {
    if (window.confirm("¿Seguro que deseas restaurar los 25 productos y promociones de fábrica?")) {
      resetToFactoryDefaults();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Bienvenida y Estado (Marrón más claro #5A3825) */}
      <div className="bg-gradient-to-r from-[#5A3825] to-[#7A523A] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#8C6045] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="inline-block px-3 py-1 bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/50 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            Panel de Control
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F3EAD8]">
            ¡Hola, Marcos!
          </h2>
          <p className="text-sm text-[#E0D0C1] mt-1">
            Gestiona los productos, precios, fotos y promociones de <strong>La Matera del Gringo</strong> en tiempo real.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onOpenNewProductModal}
            className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#C29F2F] text-[#5A3825] font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow flex items-center space-x-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nuevo Producto</span>
          </button>
          <button
            onClick={() => setActiveTab("descuentos")}
            className="px-4 py-2.5 bg-[#6E4933] hover:bg-[#7D553D] text-[#F3EAD8] font-bold rounded-xl text-xs uppercase tracking-wider transition-all border border-[#8C6045] flex items-center space-x-2 cursor-pointer"
          >
            <Percent className="w-4 h-4 text-[#D4AF37]" />
            <span>Nueva Promo</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Productos */}
        <div
          onClick={() => setActiveTab("productos")}
          className="bg-white p-5 rounded-2xl border border-[#E8DFD3] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider">Productos</span>
            <div className="p-2.5 rounded-xl bg-[#F5F0E8] group-hover:bg-[#5A3825] group-hover:text-[#D4AF37] text-[#5A3825] transition-colors">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-serif font-bold text-[#5A3825]">{totalProductos}</span>
            <span className="text-xs text-[#8C7A6B] ml-2">({productosActivos} activos)</span>
          </div>
          <div className="mt-2 text-xs text-[#8C7A6B] flex items-center">
            <span>Gestionar catálogo completo →</span>
          </div>
        </div>

        {/* Destacados */}
        <div
          onClick={() => setActiveTab("destacados")}
          className="bg-white p-5 rounded-2xl border border-[#E8DFD3] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider">⭐ Destacados</span>
            <div className="p-2.5 rounded-xl bg-amber-50 group-hover:bg-[#5A3825] group-hover:text-[#D4AF37] text-amber-600 transition-colors">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-serif font-bold text-[#5A3825]">{productosDestacados}</span>
            <span className="text-xs text-[#8C7A6B] ml-2">en portada</span>
          </div>
          <div className="mt-2 text-xs text-[#8C7A6B] flex items-center">
            <span>Administrar destacados →</span>
          </div>
        </div>

        {/* Promociones Activas */}
        <div
          onClick={() => setActiveTab("descuentos")}
          className="bg-white p-5 rounded-2xl border border-[#E8DFD3] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider">Promociones</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 group-hover:bg-[#5A3825] group-hover:text-[#D4AF37] text-emerald-600 transition-colors">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-serif font-bold text-emerald-700">{promosActivas.length}</span>
            <span className="text-xs text-[#8C7A6B] ml-2">activas hoy</span>
          </div>
          <div className="mt-2 text-xs text-[#8C7A6B] flex items-center">
            <span>{promosPendientes.length} programadas / {promosFinalizadas.length} finalizadas</span>
          </div>
        </div>

        {/* Categorías */}
        <div
          onClick={() => setActiveTab("categorias")}
          className="bg-white p-5 rounded-2xl border border-[#E8DFD3] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider">Categorías</span>
            <div className="p-2.5 rounded-xl bg-[#F5F0E8] group-hover:bg-[#5A3825] group-hover:text-[#D4AF37] text-[#5A3825] transition-colors">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-serif font-bold text-[#5A3825]">{categorias.length}</span>
            <span className="text-xs text-[#8C7A6B] ml-2">secciones</span>
          </div>
          <div className="mt-2 text-xs text-[#8C7A6B] flex items-center">
            <span>Ver categorías →</span>
          </div>
        </div>
      </div>

      {/* Grid de 2 Columnas: Promos Activas & Alerta de Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Promociones Activas en Tiempo Real */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8DFD3] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#F0E8DD]">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="font-serif font-bold text-lg text-[#5A3825]">
                  Promociones Activas en la Tienda
                </h3>
              </div>
              <button
                onClick={() => setActiveTab("descuentos")}
                className="text-xs font-bold text-[#D4AF37] hover:underline cursor-pointer"
              >
                Ver todas ({promociones.length})
              </button>
            </div>

            <div className="mt-4 divide-y divide-[#F0E8DD]">
              {promosActivas.length === 0 ? (
                <div className="py-8 text-center text-[#8C7A6B]">
                  <Percent className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-semibold">No hay promociones activas hoy</p>
                  <p className="text-xs mt-1">Crea un descuento programado para atraer más clientes.</p>
                </div>
              ) : (
                promosActivas.map((promo) => {
                  const prod = productos.find((p) => Number(p.id) === Number(promo.producto_id));
                  const precioOriginal = prod ? prod.precio : 0;
                  const precioPromo = Math.round(precioOriginal * (1 - promo.porcentaje_descuento / 100));

                  return (
                    <div key={promo.id} className="py-3.5 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-sm border border-emerald-200">
                          -{promo.porcentaje_descuento}%
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#382A24]">{promo.titulo}</h4>
                          <p className="text-xs text-[#8C7A6B]">
                            {prod ? prod.nombre : `Categoría: ${promo.categoria}`} • Hasta {promo.fecha_fin}
                          </p>
                        </div>
                      </div>

                      {prod && (
                        <div className="text-right">
                          <span className="text-xs line-through text-[#8C7A6B] block">
                            ${precioOriginal.toLocaleString("es-AR")}
                          </span>
                          <span className="text-sm font-bold text-emerald-700">
                            ${precioPromo.toLocaleString("es-AR")}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0E8DD] mt-4">
            <button
              onClick={() => setActiveTab("calendario")}
              className="text-xs font-bold text-[#5A3825] hover:text-[#D4AF37] flex items-center space-x-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Ver cronograma en el Calendario de Promociones →</span>
            </button>
          </div>
        </div>

        {/* Productos con Stock Bajo con Foto Centrada y Completa */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8DFD3] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#F0E8DD]">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif font-bold text-lg text-[#5A3825]">
                  Alerta de Stock (≤ 5 unidades)
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                {stockBajo.length} productos
              </span>
            </div>

            <div className="mt-4 divide-y divide-[#F0E8DD] max-h-64 overflow-y-auto">
              {stockBajo.length === 0 ? (
                <div className="py-8 text-center text-[#8C7A6B]">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500 opacity-80" />
                  <p className="text-sm font-semibold">Stock en óptimas condiciones</p>
                  <p className="text-xs mt-1">Todos los productos cuentan con más de 5 unidades.</p>
                </div>
              ) : (
                stockBajo.map((prod) => (
                  <div key={prod.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-lg bg-[#F8F5F0] border border-[#E8DFD3] flex items-center justify-center p-0.5 overflow-hidden shrink-0">
                        <img
                          src={prod.imagen}
                          alt={prod.nombre}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#382A24]">{prod.nombre}</h4>
                        <span className="text-[11px] text-[#8C7A6B] capitalize">{prod.categoria}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">
                        {prod.stock} disponibles
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0E8DD] mt-4 flex justify-between items-center">
            <button
              onClick={() => setActiveTab("productos")}
              className="text-xs font-bold text-[#5A3825] hover:text-[#D4AF37] cursor-pointer"
            >
              Ir a Gestión de Productos →
            </button>
            <button
              onClick={handleReset}
              className="text-[11px] text-[#8C7A6B] hover:text-red-600 flex items-center space-x-1 cursor-pointer"
              title="Restaurar datos iniciales si fue modificado en pruebas"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restaurar catálogo inicial</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
