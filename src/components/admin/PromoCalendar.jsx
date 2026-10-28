import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Search
} from "lucide-react";

export default function PromoCalendar() {
  const { promociones, productos, getPromotionStatus } = useData();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayPromos, setSelectedDayPromos] = useState(null);
  const [activeView, setActiveView] = useState("calendario"); // 'calendario' o 'historial'
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busquedaHistorial, setBusquedaHistorial] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  // Días en el mes actual
  const primerDiaMes = new Date(year, month, 1).getDay();
  // Ajustar para que lunes sea 0, domingo sea 6
  const primerDiaAjustado = primerDiaMes === 0 ? 6 : primerDiaMes - 1;
  const totalDiasMes = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayPromos(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayPromos(null);
  };

  const formatDayStr = (dia) => {
    const dStr = dia.toString().padStart(2, "0");
    const mStr = (month + 1).toString().padStart(2, "0");
    return `${year}-${mStr}-${dStr}`;
  };

  // Obtener promociones que abarcan una fecha
  const getPromosForDate = (dateStr) => {
    return promociones.filter((p) => {
      return dateStr >= p.fecha_inicio && dateStr <= p.fecha_fin;
    });
  };

  // Filtrado de Historial
  const historialFiltrado = promociones.filter((p) => {
    const status = getPromotionStatus(p);
    const matchEstado = filtroEstado === "todos" || status === filtroEstado;
    const prod = productos.find((prodItem) => Number(prodItem.id) === Number(p.producto_id));
    const prodName = prod ? prod.nombre.toLowerCase() : "";
    const matchBusqueda =
      p.titulo.toLowerCase().includes(busquedaHistorial.toLowerCase()) ||
      prodName.includes(busquedaHistorial.toLowerCase());
    return matchEstado && matchBusqueda;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Selector de Vista: Calendario vs Historial */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-xs">
        <div>
          <h3 className="font-serif font-bold text-2xl text-[#5A3825] flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-[#D4AF37]" />
            <span>Calendario e Historial de Promociones</span>
          </h3>
          <p className="text-xs text-[#8C7A6B] mt-1">
            Visualización temporal y registro cronológico de todas las promociones comerciales.
          </p>
        </div>

        <div className="flex bg-[#EFE9DF] p-1 rounded-2xl">
          <button
            onClick={() => setActiveView("calendario")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === "calendario"
                ? "bg-[#5A3825] text-[#D4AF37] shadow"
                : "text-[#6B5344] hover:text-[#5A3825]"
            }`}
          >
            Vista Calendario
          </button>
          <button
            onClick={() => setActiveView("historial")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === "historial"
                ? "bg-[#5A3825] text-[#D4AF37] shadow"
                : "text-[#6B5344] hover:text-[#5A3825]"
            }`}
          >
            Registro Histórico
          </button>
        </div>
      </div>

      {activeView === "calendario" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendario Grid Mensual */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD3] shadow-xs space-y-6">
            {/* Header del Mes */}
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-xl text-[#5A3825]">
                {meses[month]} {year}
              </h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-xl bg-[#F5F0E8] hover:bg-[#EFE9DF] text-[#5A3825] cursor-pointer"
                  title="Mes anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-xl bg-[#F5F0E8] hover:bg-[#EFE9DF] text-[#5A3825] cursor-pointer"
                  title="Mes siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Referencia de Colores */}
            <div className="flex flex-wrap gap-4 text-xs font-bold border-y border-[#F0E8DD] py-3">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-[#6B5344]">🟢 Activas</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="text-[#6B5344]">🟡 Próximas / Pendientes</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="text-[#6B5344]">🔴 Finalizadas</span>
              </div>
            </div>

            {/* Días de la Semana */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#8C7A6B] uppercase">
              {diasSemana.map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Celdas del Calendario */}
            <div className="grid grid-cols-7 gap-2">
              {/* Espacios vacíos antes del 1er día */}
              {Array.from({ length: primerDiaAjustado }).map((_, i) => (
                <div key={`empty-${i}`} className="h-20 bg-gray-50/40 rounded-xl"></div>
              ))}

              {/* Días del mes */}
              {Array.from({ length: totalDiasMes }).map((_, i) => {
                const dia = i + 1;
                const dateStr = formatDayStr(dia);
                const promosDelDia = getPromosForDate(dateStr);
                const isSelected = selectedDayPromos?.dateStr === dateStr;

                const tieneActiva = promosDelDia.some((p) => getPromotionStatus(p) === "activa");
                const tienePendiente = promosDelDia.some((p) => getPromotionStatus(p) === "pendiente");
                const tieneFinalizada = promosDelDia.some((p) => getPromotionStatus(p) === "finalizada");

                return (
                  <div
                    key={dia}
                    onClick={() => setSelectedDayPromos({ dia, dateStr, promos: promosDelDia })}
                    className={`h-20 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-[#5A3825] ring-2 ring-[#D4AF37] bg-[#FDFBF7]"
                        : promosDelDia.length > 0
                        ? "border-[#D8CCBC] bg-white hover:border-[#5A3825]"
                        : "border-[#E8DFD3]/60 bg-white hover:bg-[#FDFBF7]"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#5A3825]">{dia}</span>
                      {promosDelDia.length > 0 && (
                        <span className="text-[10px] font-bold text-[#8C7A6B]">
                          {promosDelDia.length}p
                        </span>
                      )}
                    </div>

                    {/* Indicadores de promociones */}
                    <div className="flex flex-col gap-1 overflow-hidden">
                      {tieneActiva && (
                        <div className="h-1.5 w-full bg-emerald-500 rounded-full" title="Promoción Activa"></div>
                      )}
                      {tienePendiente && (
                        <div className="h-1.5 w-full bg-amber-400 rounded-full" title="Promoción Próxima / Pendiente"></div>
                      )}
                      {tieneFinalizada && (
                        <div className="h-1.5 w-full bg-red-400 rounded-full" title="Promoción Finalizada"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel Lateral de Detalle del Día Seleccionado */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD3] shadow-xs flex flex-col justify-between">
            <div>
              <div className="pb-4 border-b border-[#F0E8DD]">
                <h4 className="font-serif font-bold text-lg text-[#5A3825]">
                  Detalle de la Fecha
                </h4>
                <p className="text-xs text-[#8C7A6B]">
                  {selectedDayPromos
                    ? `Promociones para el ${selectedDayPromos.dateStr}`
                    : "Haz clic en cualquier día del calendario para ver sus promociones."}
                </p>
              </div>

              <div className="mt-4 space-y-4">
                {!selectedDayPromos ? (
                  <div className="py-12 text-center text-[#8C7A6B]">
                    <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-semibold">Selecciona una fecha</p>
                    <p className="text-xs mt-1">Podrás ver qué productos están en oferta ese día.</p>
                  </div>
                ) : selectedDayPromos.promos.length === 0 ? (
                  <div className="py-12 text-center text-[#8C7A6B]">
                    <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500 opacity-60" />
                    <p className="text-sm font-semibold">Sin promociones en esta fecha</p>
                    <p className="text-xs mt-1">Los productos se venden a precio normal.</p>
                  </div>
                ) : (
                  selectedDayPromos.promos.map((p) => {
                    const status = getPromotionStatus(p);
                    const prod = productos.find((pr) => Number(pr.id) === Number(p.producto_id));

                    return (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl border border-[#E8DFD3] bg-[#FDFBF7] space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold text-sm text-[#382A24]">{p.titulo}</h5>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              status === "activa"
                                ? "bg-emerald-100 text-emerald-800"
                                : status === "pendiente"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {status === "activa" && "🟢 ACTIVA"}
                            {status === "pendiente" && "🟡 PENDIENTE"}
                            {status === "finalizada" && "🔴 FINALIZADA"}
                          </span>
                        </div>

                        <div className="text-xs text-[#6B5344] space-y-1">
                          <div>
                            <strong>Aplica a:</strong> {prod ? prod.nombre : `Categoría ${p.categoria}`}
                          </div>
                          <div>
                            <strong>Descuento:</strong> -{p.porcentaje_descuento}% OFF
                          </div>
                          <div>
                            <strong>Periodo:</strong> {p.fecha_inicio} al {p.fecha_fin}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#F0E8DD] mt-6 text-center text-xs text-[#8C7A6B]">
              Los cambios de estado se sincronizan automáticamente con la tienda pública.
            </div>
          </div>
        </div>
      ) : (
        /* Vista de Historial Completo */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD3] shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="font-serif font-bold text-xl text-[#5A3825]">
                Historial Completo de Promociones Realizadas
              </h4>
              <p className="text-xs text-[#8C7A6B]">
                Registro de todas las promociones vigentes, pasadas y programadas en la plataforma.
              </p>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por título o producto..."
                  value={busquedaHistorial}
                  onChange={(e) => setBusquedaHistorial(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-xs text-[#382A24] focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-[#8C7A6B] absolute left-3 top-2.5" />
              </div>

              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-xs text-[#382A24] focus:outline-none cursor-pointer"
              >
                <option value="todos">Todos los Estados</option>
                <option value="activa">🟢 Activas</option>
                <option value="pendiente">🟡 Próximas</option>
                <option value="finalizada">🔴 Finalizadas</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-[#F0E8DD]">
            {historialFiltrado.length === 0 ? (
              <div className="py-12 text-center text-[#8C7A6B]">
                No se encontraron promociones que coincidan con la búsqueda.
              </div>
            ) : (
              historialFiltrado.map((p) => {
                const status = getPromotionStatus(p);
                const prod = productos.find((pr) => Number(pr.id) === Number(p.producto_id));
                const precioOrig = prod ? prod.precio : 0;
                const precioProm = Math.round(precioOrig * (1 - p.porcentaje_descuento / 100));

                return (
                  <div key={p.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#F5F0E8] text-[#5A3825] flex items-center justify-center font-bold text-sm shrink-0 border border-[#E8DFD3]">
                        -{p.porcentaje_descuento}%
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h5 className="font-bold text-sm text-[#382A24]">{p.titulo}</h5>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              status === "activa"
                                ? "bg-emerald-100 text-emerald-800"
                                : status === "pendiente"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {status === "activa" && "🟢 ACTIVA"}
                            {status === "pendiente" && "🟡 PENDIENTE"}
                            {status === "finalizada" && "🔴 FINALIZADA"}
                          </span>
                        </div>
                        <p className="text-xs text-[#8C7A6B] mt-0.5">
                          {prod ? prod.nombre : `Categoría: ${p.categoria}`} • Vigencia: {p.fecha_inicio} al {p.fecha_fin}
                        </p>
                      </div>
                    </div>

                    {prod && (
                      <div className="text-right shrink-0">
                        <span className="text-xs line-through text-[#8C7A6B] block">
                          ${precioOrig.toLocaleString("es-AR")}
                        </span>
                        <span className="text-base font-bold text-emerald-700">
                          ${precioProm.toLocaleString("es-AR")}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
