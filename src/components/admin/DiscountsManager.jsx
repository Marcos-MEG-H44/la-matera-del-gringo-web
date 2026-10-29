import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import {
  Percent,
  Plus,
  AlertCircle,
  Trash2,
  Power
} from "lucide-react";
import { sanitizeText } from "../../lib/sanitize";

export default function DiscountsManager() {
  const {
    promociones,
    productos,
    categorias,
    getPromotionStatus,
    addPromotion,
    deletePromotion,
    togglePromotionActive
  } = useData();

  const hoyStr = new Date().toISOString().split("T")[0];

  // Estado del formulario
  const [titulo, setTitulo] = useState("");
  const [tipoDestino, setTipoDestino] = useState("producto"); // 'producto' o 'categoria'
  const [productoId, setProductoId] = useState(productos[0]?.id || "");
  const [categoria, setCategoria] = useState("mates");
  const [porcentaje, setPorcentaje] = useState(15);
  const [fechaInicio, setFechaInicio] = useState(hoyStr);

  const fechaFinDefault = new Date();
  fechaFinDefault.setDate(fechaFinDefault.getDate() + 7);
  const [fechaFin, setFechaFin] = useState(fechaFinDefault.toISOString().split("T")[0]);

  const [formError, setFormError] = useState("");

  // Producto seleccionado para el cálculo
  const selectedProd = productos.find((p) => Number(p.id) === Number(productoId));
  const precioOriginal = selectedProd ? selectedProd.precio : 0;
  const precioDescuento = Math.round(precioOriginal * (1 - porcentaje / 100));
  const montoAhorro = precioOriginal - precioDescuento;

  // Proyección de estado según fechas ingresadas
  const getProjectedStatus = () => {
    if (!fechaInicio || !fechaFin) return null;
    if (hoyStr < fechaInicio) return { status: "pendiente", label: "🟡 Se programará como PENDIENTE", color: "text-amber-700 bg-amber-50 border-amber-200" };
    if (hoyStr >= fechaInicio && hoyStr <= fechaFin) return { status: "activa", label: "🟢 Se activará INMEDIATAMENTE en la tienda", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    return { status: "finalizada", label: "🔴 Fecha ya vencida (FINALIZADA)", color: "text-red-700 bg-red-50 border-red-200" };
  };

  const projected = getProjectedStatus();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!titulo.trim()) {
      setFormError("El título de la promoción es obligatorio.");
      return;
    }

    if (porcentaje <= 0 || porcentaje > 95) {
      setFormError("El porcentaje de descuento debe estar entre 1% y 95%.");
      return;
    }

    if (!fechaInicio || !fechaFin) {
      setFormError("Debes seleccionar fecha de inicio y fin.");
      return;
    }

    if (fechaInicio > fechaFin) {
      setFormError("La fecha de fin no puede ser anterior a la fecha de inicio.");
      return;
    }

    await addPromotion({
      titulo: sanitizeText(titulo),
      producto_id: tipoDestino === "producto" ? Number(productoId) : null,
      categoria: tipoDestino === "categoria" ? categoria : null,
      porcentaje_descuento: Number(porcentaje),
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      activa: true
    });

    // Reset formulario
    setTitulo("");
    setFormError("");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Sección Formulario de Creación con Simulador Automático */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD3] shadow-xs">
        <div className="flex items-center space-x-3 pb-4 border-b border-[#F0E8DD] mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-[#5A3825]">
              Crear Descuento o Promoción Programada
            </h3>
            <p className="text-xs text-[#8C7A6B]">
              Define el % de rebaja y las fechas. El sistema activará y desactivará el precio especial de forma 100% automática.
            </p>
          </div>
        </div>

        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda: Parámetros del Descuento */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#6B5344] uppercase tracking-wider mb-1">
                Título de la Promoción *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Oferta Fin de Semana Matero / 20% OFF en Termos"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-sm text-[#382A24] focus:outline-none focus:border-[#5A3825]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Selector de Aplicación */}
              <div>
                <label className="block text-xs font-bold text-[#6B5344] uppercase tracking-wider mb-1">
                  Aplicar Descuento A:
                </label>
                <div className="flex space-x-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setTipoDestino("producto")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      tipoDestino === "producto"
                        ? "bg-[#5A3825] text-[#D4AF37]"
                        : "bg-[#EFE9DF] text-[#6B5344]"
                    }`}
                  >
                    Producto Específico
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoDestino("categoria")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      tipoDestino === "categoria"
                        ? "bg-[#5A3825] text-[#D4AF37]"
                        : "bg-[#EFE9DF] text-[#6B5344]"
                    }`}
                  >
                    Toda la Categoría
                  </button>
                </div>

                {tipoDestino === "producto" ? (
                  <select
                    value={productoId}
                    onChange={(e) => setProductoId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-xs text-[#382A24] focus:outline-none cursor-pointer"
                  >
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} (${p.precio.toLocaleString("es-AR")})
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-xs text-[#382A24] focus:outline-none cursor-pointer capitalize"
                  >
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* % de Descuento */}
              <div>
                <label className="block text-xs font-bold text-[#6B5344] uppercase tracking-wider mb-1">
                  Porcentaje de Descuento (% OFF) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="90"
                    required
                    value={porcentaje}
                    onChange={(e) => setPorcentaje(Number(e.target.value))}
                    className="w-full pl-3 pr-10 py-2 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-base font-bold text-[#5A3825] focus:outline-none"
                  />
                  <span className="absolute right-3.5 top-2.5 text-sm font-bold text-[#8C7A6B]">%</span>
                </div>
              </div>
            </div>

            {/* Fechas de Inicio y Fin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#6B5344] uppercase tracking-wider mb-1">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  required
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-xs text-[#382A24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5344] uppercase tracking-wider mb-1">
                  Fecha de Fin *
                </label>
                <input
                  type="date"
                  required
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-xs text-[#382A24] focus:outline-none"
                />
              </div>
            </div>

            {/* Banner de Proyección de Estado Automático */}
            {projected && (
              <div className={`p-3 rounded-xl border text-xs font-bold ${projected.color}`}>
                {projected.label}
              </div>
            )}
          </div>

          {/* Columna Derecha: Simulador de Precios ($ANTES / % OFF / $AHORA) con Foto Centrada y Completa */}
          <div className="bg-[#FDFBF7] rounded-2xl p-5 border border-[#E8DFD3] flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider block mb-3">
                Simulación del Precio Promocional
              </span>

              {selectedProd && tipoDestino === "producto" ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 pb-3 border-b border-[#E8DFD3]">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center p-1 bg-[#F5F0E8] border border-[#D8CCBC] overflow-hidden shrink-0">
                      <img
                        src={selectedProd.imagen}
                        alt={selectedProd.nombre}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[#382A24] line-clamp-1">{selectedProd.nombre}</h5>
                      <span className="text-[10px] text-[#8C7A6B] uppercase">{selectedProd.categoria}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-[#8C7A6B]">
                      <span>Precio normal ($ANTES):</span>
                      <span className="line-through">${precioOriginal.toLocaleString("es-AR")}</span>
                    </div>

                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Descuento aplicado:</span>
                      <span>-{porcentaje}% OFF (-${montoAhorro.toLocaleString("es-AR")})</span>
                    </div>

                    <div className="pt-2 border-t border-[#E8DFD3] flex justify-between items-baseline">
                      <span className="text-sm font-bold text-[#5A3825]">Precio Tienda ($AHORA):</span>
                      <span className="text-2xl font-serif font-bold text-emerald-700">
                        ${precioDescuento.toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-[#8C7A6B]">
                  <p>Aplica a todos los productos de la categoría <strong>{categoria}</strong>.</p>
                  <p className="mt-2 text-emerald-700 font-bold text-sm">Descuento: -{porcentaje}% OFF</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="mt-6 w-full py-3 bg-[#5A3825] hover:bg-[#6E4933] text-[#D4AF37] font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Guardar y Programar Promoción</span>
            </button>
          </div>
        </form>
      </div>

      {/* Listado de Promociones con Estados Automáticos */}
      <div className="bg-white rounded-3xl border border-[#E8DFD3] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#F0E8DD] flex justify-between items-center">
          <div>
            <h4 className="font-serif font-bold text-lg text-[#5A3825]">
              Listado de Promociones ({promociones.length})
            </h4>
            <p className="text-xs text-[#8C7A6B]">
              Control en tiempo real de promociones Activas (🟢), Próximas (🟡) y Finalizadas (🔴).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#382A24]">
            <thead className="bg-[#F5F0E8] text-[#6B5344] text-xs font-bold uppercase tracking-wider border-b border-[#E8DFD3]">
              <tr>
                <th className="py-4 px-4">Promoción</th>
                <th className="py-4 px-4">Aplica A</th>
                <th className="py-4 px-4">Descuento</th>
                <th className="py-4 px-4">Vigencia (Inicio - Fin)</th>
                <th className="py-4 px-4 text-center">Estado Automático</th>
                <th className="py-4 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DD]">
              {promociones.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[#8C7A6B]">
                    No hay promociones registradas.
                  </td>
                </tr>
              ) : (
                promociones.map((promo) => {
                  const status = getPromotionStatus(promo);
                  const prod = productos.find((p) => Number(p.id) === Number(promo.producto_id));

                  return (
                    <tr key={promo.id} className="hover:bg-[#FDFBF7] transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#382A24] block">{promo.titulo}</span>
                        <span className="text-[11px] text-[#8C7A6B]">ID #{promo.id}</span>
                      </td>

                      <td className="py-3 px-4">
                        {prod ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center p-0.5 bg-[#F5F0E8] border border-[#E8DFD3] shrink-0 overflow-hidden">
                              <img
                                src={prod.imagen}
                                alt={prod.nombre}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <span className="text-xs font-semibold text-[#382A24] truncate max-w-xs">
                              {prod.nombre}
                            </span>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 bg-[#EFE9DF] text-[#6B5344] rounded text-xs font-semibold capitalize">
                            Categoría: {promo.categoria}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200">
                          -{promo.porcentaje_descuento}% OFF
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-xs space-y-0.5 text-[#6B5344]">
                          <div><span className="text-[#8C7A6B]">Desde:</span> {promo.fecha_inicio}</div>
                          <div><span className="text-[#8C7A6B]">Hasta:</span> {promo.fecha_fin}</div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        {status === "activa" && (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                            <span>🟢 ACTIVA</span>
                          </span>
                        )}
                        {status === "pendiente" && (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                            <span>🟡 PENDIENTE</span>
                          </span>
                        )}
                        {status === "finalizada" && (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                            <span>🔴 FINALIZADA</span>
                          </span>
                        )}
                        {status === "pausada" && (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                            <span>⏸️ PAUSADA</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => togglePromotionActive(promo.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              promo.activa
                                ? "text-[#6B5344] hover:bg-[#F2EBDC]"
                                : "text-emerald-700 hover:bg-emerald-50"
                            }`}
                            title={promo.activa ? "Pausar promoción" : "Reanudar promoción"}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`¿Deseas eliminar la promoción "${promo.titulo}"?`)) {
                                deletePromotion(promo.id);
                              }
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar promoción"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
