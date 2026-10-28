import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import {
  Image as ImageIcon,
  Upload,
  Check,
  Search,
  ZoomIn,
  X,
  Plus,
  Trash2,
  Images
} from "lucide-react";

export default function ImageManager() {
  const { productos, addProductImage, removeProductImage, setProductMainImage } = useData();

  const [selectedProduct, setSelectedProduct] = useState(productos[0] || null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [modalZoomImg, setModalZoomImg] = useState(null);

  // Mantener sincronizado el producto seleccionado con los datos globales
  const currentProd = productos.find((p) => p.id === selectedProduct?.id) || productos[0] || null;
  const imagenesDelProducto = Array.isArray(currentProd?.imagenes) && currentProd.imagenes.length > 0
    ? currentProd.imagenes
    : (currentProd?.imagen ? [currentProd.imagen] : []);

  // Manejar subida de archivo desde la computadora para agregar a la galería
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !currentProd) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      await addProductImage(currentProd.id, reader.result);
      setSuccessMsg(`¡Nueva foto agregada con éxito a "${currentProd.nombre}"!`);
      setTimeout(() => setSuccessMsg(""), 3500);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Agregar imagen vía URL a la galería
  const handleAddUrlImage = async () => {
    if (!currentProd || !newImageUrl.trim()) return;

    await addProductImage(currentProd.id, newImageUrl.trim());
    setNewImageUrl("");
    setSuccessMsg(`¡Nueva foto agregada con éxito a "${currentProd.nombre}"!`);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    setNewImageUrl("");
    setSuccessMsg("");
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Sección Superior: Gestión de Galería del Producto */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD3] shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0E8DD] mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#F5F0E8] text-[#5A3825]">
              <ImageIcon className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#5A3825]">
                Gestor de Imágenes y Galerías de Productos
              </h3>
              <p className="text-xs text-[#8C7A6B]">
                Carga múltiples fotos por producto, organízalas y previsualízalas completas y centradas.
              </p>
            </div>
          </div>
        </div>

        {currentProd ? (
          <div className="space-y-6">
            {/* Selector de Producto */}
            <div className="max-w-md">
              <label className="block text-xs font-bold text-[#6B5344] uppercase tracking-wider mb-1">
                Seleccionar Producto para Gestionar sus Fotos:
              </label>
              <select
                value={currentProd.id}
                onChange={(e) => {
                  const prod = productos.find((p) => p.id === Number(e.target.value));
                  if (prod) handleSelectProduct(prod);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-sm text-[#382A24] focus:outline-none focus:border-[#5A3825] cursor-pointer"
              >
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} (${p.precio.toLocaleString("es-AR")}) — {p.imagenes?.length || 1} fotos
                  </option>
                ))}
              </select>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Galería actual del producto seleccionado */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold text-[#6B5344] uppercase tracking-wider flex items-center space-x-1.5">
                  <Images className="w-4 h-4 text-[#D4AF37]" />
                  <span>Fotos de "{currentProd.nombre}" ({imagenesDelProducto.length})</span>
                </h4>
                <span className="text-[11px] text-[#8C7A6B]">
                  * Las imágenes se despliegan 100% completas y centradas en el catálogo.
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {imagenesDelProducto.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-2xl border-2 border-[#D8CCBC] bg-white p-2 flex flex-col items-center justify-between group overflow-hidden shadow-xs"
                  >
                    {/* Contenedor de Imagen Centrada y Completa */}
                    <div className="w-full h-36 flex items-center justify-center p-1 bg-[#F8F5F0] rounded-xl overflow-hidden">
                      <img
                        src={imgUrl}
                        alt={`Foto ${idx + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Botón Zoom */}
                    <button
                      onClick={() => setModalZoomImg(imgUrl)}
                      className="absolute bottom-12 right-3 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg cursor-pointer"
                      title="Ampliar vista"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>

                    {/* Badges y Acciones */}
                    <div className="w-full pt-2 flex items-center justify-between">
                      {idx === 0 ? (
                        <span className="px-2 py-0.5 bg-[#5A3825] text-[#D4AF37] text-[10px] font-bold rounded">
                          Principal
                        </span>
                      ) : (
                        <button
                          onClick={() => setProductMainImage(currentProd.id, idx)}
                          className="text-[10px] font-bold text-[#5A3825] hover:text-[#D4AF37] hover:underline cursor-pointer"
                        >
                          Hacer Principal
                        </button>
                      )}

                      {imagenesDelProducto.length > 1 && (
                        <button
                          onClick={() => removeProductImage(currentProd.id, idx)}
                          className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                          title="Eliminar esta foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agregar más fotos al producto seleccionado */}
            <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#E8DFD3] space-y-3">
              <span className="text-xs font-bold text-[#6B5344] uppercase tracking-wider block">
                + Agregar Otra Foto a Este Producto
              </span>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="URL externa o ruta (ej. /productos/...)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#D8CCBC] bg-white text-xs text-[#382A24] focus:outline-none focus:border-[#5A3825]"
                />

                <button
                  onClick={handleAddUrlImage}
                  disabled={!newImageUrl.trim()}
                  className="px-4 py-2.5 bg-[#5A3825] hover:bg-[#6E4933] text-[#D4AF37] font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow cursor-pointer disabled:opacity-40 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar URL</span>
                </button>

                <label className="px-4 py-2.5 bg-[#EFE9DF] hover:bg-[#E2D8C9] text-[#5A3825] rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center space-x-2 transition-colors shrink-0">
                  <Upload className="w-4 h-4 text-[#D4AF37]" />
                  <span>Subir de PC</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#8C7A6B]">No hay productos cargados en el sistema.</p>
        )}
      </div>

      {/* Galería Visual Global con Imágenes Completas */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD3] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="font-serif font-bold text-lg text-[#5A3825]">
              Catálogo de Productos ({productos.length})
            </h4>
            <p className="text-xs text-[#8C7A6B]">
              Haz clic en cualquier producto para inspeccionar o sumar fotos a su galería.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-xs text-[#382A24] focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-[#8C7A6B] absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-2">
          {productosFiltrados.map((prod) => {
            const isSelected = currentProd?.id === prod.id;
            const cantFotos = prod.imagenes?.length || 1;

            return (
              <div
                key={prod.id}
                onClick={() => handleSelectProduct(prod)}
                className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all bg-[#F8F5F0] aspect-square flex flex-col justify-between p-2 ${
                  isSelected
                    ? "border-[#D4AF37] shadow-lg scale-102 ring-2 ring-[#D4AF37]/50"
                    : "border-[#E8DFD3] hover:border-[#5A3825]"
                }`}
              >
                {/* Imagen Centrada y Completa */}
                <div className="w-full flex-1 flex items-center justify-center p-1 overflow-hidden">
                  <img
                    src={prod.imagen}
                    alt={prod.nombre}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="mt-1 pt-1 border-t border-[#E8DFD3]/60 bg-white/80 backdrop-blur-xs p-1.5 rounded-lg">
                  <p className="text-[#382A24] text-[11px] font-bold truncate leading-tight">
                    {prod.nombre}
                  </p>
                  <div className="flex justify-between items-center mt-0.5">
                    <span className="text-[10px] text-[#5A3825] font-semibold">
                      ${prod.precio.toLocaleString("es-AR")}
                    </span>
                    <span className="text-[9px] bg-[#EFE9DF] text-[#6B5344] px-1.5 py-0.2 rounded font-bold">
                      {cantFotos} {cantFotos === 1 ? "foto" : "fotos"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Zoom */}
      {modalZoomImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setModalZoomImg(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-white rounded-3xl overflow-hidden p-4 shadow-2xl flex items-center justify-center">
            <img
              src={modalZoomImg}
              alt="Zoom"
              className="max-h-[75vh] max-w-full object-contain rounded-xl"
            />
            <button
              onClick={() => setModalZoomImg(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black/90 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
