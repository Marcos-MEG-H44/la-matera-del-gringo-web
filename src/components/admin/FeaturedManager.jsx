import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Star, Check, Edit2, X, Sparkles } from "lucide-react";

export default function FeaturedManager() {
  const { productos, toggleProductFeatured, updateProductPrice } = useData();

  const [editingPriceId, setEditingPriceId] = useState(null);
  const [editingPriceVal, setEditingPriceVal] = useState("");

  const productosDestacados = productos.filter((p) => p.destacado);
  const productosNoDestacados = productos.filter((p) => !p.destacado);

  const handleStartPrice = (prod) => {
    setEditingPriceId(prod.id);
    setEditingPriceVal(prod.precio.toString());
  };

  const handleSavePrice = (id) => {
    const val = Number(editingPriceVal);
    if (!isNaN(val) && val > 0) {
      updateProductPrice(id, val);
    }
    setEditingPriceId(null);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Cabecera */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD3] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Gestión de Destacados & Precios</span>
          </div>
          <h3 className="font-serif font-bold text-2xl text-[#5A3825]">
            Productos en Portada (⭐ Destacados)
          </h3>
          <p className="text-xs text-[#8C7A6B] mt-1">
            Los productos marcados como destacados aparecen con la insignia dorada especial en la tienda pública.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-4 py-2 bg-amber-50 text-amber-800 rounded-2xl text-xs font-bold border border-amber-200">
            {productosDestacados.length} Destacados Activos
          </span>
        </div>
      </div>

      {/* Grid de Productos Destacados Actuales */}
      <div className="space-y-4">
        <h4 className="font-serif font-bold text-lg text-[#5A3825] flex items-center space-x-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
          <span>Actualmente en Portada ({productosDestacados.length})</span>
        </h4>

        {productosDestacados.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-dashed border-[#C8BBAA] text-center text-[#8C7A6B]">
            <Star className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-semibold">No hay productos destacados seleccionados</p>
            <p className="text-xs mt-1">Selecciona uno o más productos de la lista inferior para destacarlos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosDestacados.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md border border-[#E8DFD3] flex flex-col justify-between group relative"
              >
                {/* IMAGEN DEL PRODUCTO (Centrada y Completa con object-contain) */}
                <div className="relative aspect-square bg-[#F8F5F0] flex items-center justify-center p-3 overflow-hidden">
                  <img
                    src={prod.imagen}
                    alt={prod.nombre}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-[#5A3825] text-[#D4AF37] text-xs font-bold px-2.5 py-1 rounded-md shadow">
                    ⭐ Destacado
                  </span>

                  <button
                    onClick={() => toggleProductFeatured(prod.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 text-amber-500 rounded-full hover:bg-white shadow cursor-pointer"
                    title="Quitar de destacados"
                  >
                    <Star className="w-4 h-4 fill-amber-400" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#9E816B] uppercase tracking-wider">
                      {prod.categoria}
                    </span>
                    <h5 className="font-serif font-bold text-sm text-[#382A24] mt-0.5 line-clamp-1">
                      {prod.nombre}
                    </h5>
                  </div>

                  {/* Edición Rápida de Precio */}
                  <div className="pt-2 border-t border-[#F0E8DD] flex items-center justify-between">
                    {editingPriceId === prod.id ? (
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-bold text-[#5A3825]">$</span>
                        <input
                          type="number"
                          value={editingPriceVal}
                          onChange={(e) => setEditingPriceVal(e.target.value)}
                          className="w-20 px-1.5 py-0.5 border border-[#5A3825] rounded text-xs font-bold"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSavePrice(prod.id)}
                          className="p-1 rounded bg-emerald-600 text-white cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setEditingPriceId(null)}
                          className="p-1 rounded bg-gray-200 text-gray-700 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => handleStartPrice(prod)}
                        className="cursor-pointer hover:bg-[#F5F0E8] px-2 py-1 rounded transition-colors group/p flex items-center space-x-1"
                        title="Cambio rápido de precio"
                      >
                        <span className="text-base font-bold text-[#5A3825]">
                          ${prod.precio.toLocaleString("es-AR")}
                        </span>
                        <Edit2 className="w-3 h-3 text-[#8C7A6B] opacity-0 group-hover/p:opacity-100" />
                      </div>
                    )}

                    <button
                      onClick={() => toggleProductFeatured(prod.id)}
                      className="text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lista para Agregar Más Productos a Destacados */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD3] shadow-xs space-y-4">
        <h4 className="font-serif font-bold text-lg text-[#5A3825]">
          Otros Productos Disponibles para Destacar
        </h4>
        <p className="text-xs text-[#8C7A6B]">
          Haz clic en la estrella para añadir cualquier producto a la portada de la tienda.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
          {productosNoDestacados.map((prod) => (
            <div
              key={prod.id}
              className="p-3 rounded-2xl border border-[#E8DFD3] bg-[#FDFBF7] flex items-center justify-between hover:border-[#5A3825] transition-all"
            >
              <div className="flex items-center space-x-3 truncate">
                <div className="w-12 h-12 rounded-lg bg-[#F8F5F0] border border-[#E8DFD3] flex items-center justify-center p-1 shrink-0 overflow-hidden">
                  <img
                    src={prod.imagen}
                    alt={prod.nombre}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-[#382A24] truncate">{prod.nombre}</p>
                  <span className="text-[11px] text-[#8C7A6B]">
                    ${prod.precio.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleProductFeatured(prod.id)}
                className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer shrink-0 ml-2"
                title="Marcar como Destacado"
              >
                <Star className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
