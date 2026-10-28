import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Check,
  X,
  AlertCircle,
  Upload,
  Images
} from "lucide-react";

export default function ProductsManager({ isNewModalOpen, setIsNewModalOpen }) {
  const {
    productos,
    categorias,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    toggleProductFeatured,
    updateProductPrice
  } = useData();

  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [editingProduct, setEditingProduct] = useState(null);

  // Estado para edición rápida de precio in-line
  const [quickPriceEditId, setQuickPriceEditId] = useState(null);
  const [quickPriceValue, setQuickPriceValue] = useState("");

  // Input auxiliar para agregar foto por URL en el formulario
  const [urlFotoExtra, setUrlFotoExtra] = useState("");

  // Estado del formulario (para nuevo o edición con soporte multi-imagen)
  const initialFormState = {
    nombre: "",
    categoria: "mates",
    precio: "",
    stock: 10,
    destacado: false,
    activo: true,
    descripcion: "",
    imagen: "/productos/mateimperialmixto.jpeg",
    imagenes: ["/productos/mateimperialmixto.jpeg"]
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState("");

  // Filtrado
  const productosFiltrados = productos.filter((prod) => {
    const matchCat = categoriaFiltro === "todas" || prod.categoria === categoriaFiltro;
    const matchSearch =
      prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      prod.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return matchCat && matchSearch;
  });

  // Abrir modal para crear
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setUrlFotoExtra("");
    setFormError("");
    setIsNewModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    const listaImagenes = Array.isArray(prod.imagenes) && prod.imagenes.length > 0
      ? prod.imagenes
      : [prod.imagen || "/productos/mateimperialmixto.jpeg"];

    setFormData({
      nombre: prod.nombre,
      categoria: prod.categoria,
      precio: prod.precio,
      stock: prod.stock,
      destacado: prod.destacado,
      activo: prod.activo !== undefined ? prod.activo : true,
      descripcion: prod.descripcion,
      imagen: listaImagenes[0],
      imagenes: listaImagenes
    });
    setUrlFotoExtra("");
    setFormError("");
    setIsNewModalOpen(true);
  };

  // Agregar foto al array de imágenes del formulario
  const handleAddImageToForm = (imgUrl) => {
    if (!imgUrl || !imgUrl.trim()) return;
    setFormData((prev) => {
      const arr = [...(prev.imagenes || [])];
      if (!arr.includes(imgUrl.trim())) {
        arr.push(imgUrl.trim());
      }
      return {
        ...prev,
        imagenes: arr,
        imagen: arr[0]
      };
    });
    setUrlFotoExtra("");
  };

  // Eliminar foto del formulario
  const handleRemoveImageFromForm = (index) => {
    if (formData.imagenes.length <= 1) {
      setFormError("El producto debe tener al menos una imagen.");
      return;
    }
    setFormData((prev) => {
      const arr = [...prev.imagenes];
      arr.splice(index, 1);
      return {
        ...prev,
        imagenes: arr,
        imagen: arr[0]
      };
    });
  };

  // Marcar como foto principal (index 0)
  const handleSetMainImage = (index) => {
    if (index === 0) return;
    setFormData((prev) => {
      const arr = [...prev.imagenes];
      const [img] = arr.splice(index, 1);
      arr.unshift(img);
      return {
        ...prev,
        imagenes: arr,
        imagen: arr[0]
      };
    });
  };

  // Validaciones del formulario
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.nombre.trim()) {
      setFormError("El nombre del producto es obligatorio.");
      return;
    }

    const precioNum = Number(formData.precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      setFormError("El precio debe ser un número mayor a cero.");
      return;
    }

    if (!formData.categoria) {
      setFormError("Debe seleccionar una categoría válida.");
      return;
    }

    const stockNum = Number(formData.stock);
    if (isNaN(stockNum) || stockNum < 0) {
      setFormError("El stock no puede ser un número negativo.");
      return;
    }

    if (!formData.imagenes || formData.imagenes.length === 0) {
      setFormError("Debe proporcionar al menos una imagen para el producto.");
      return;
    }

    const dataToSave = {
      ...formData,
      precio: precioNum,
      stock: stockNum,
      imagen: formData.imagenes[0]
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, dataToSave);
    } else {
      await addProduct(dataToSave);
    }

    setIsNewModalOpen(false);
  };

  // Manejar edición rápida de precio
  const handleStartQuickPrice = (prod) => {
    setQuickPriceEditId(prod.id);
    setQuickPriceValue(prod.precio.toString());
  };

  const handleSaveQuickPrice = (id) => {
    const val = Number(quickPriceValue);
    if (!isNaN(val) && val > 0) {
      updateProductPrice(id, val);
    }
    setQuickPriceEditId(null);
  };

  // Manejar carga local de imagen (convertir a Base64 y agregar a la galería)
  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleAddImageToForm(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Barra de Filtros y Acción Principal */}
      <div className="bg-white p-5 rounded-2xl border border-[#E8DFD3] shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
          {/* Buscador */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-sm text-[#382A24] focus:outline-none focus:border-[#5A3825]"
            />
            <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-3" />
            {busqueda && (
              <button
                onClick={() => setBusqueda("")}
                className="absolute right-3 top-3 text-[#8C7A6B] hover:text-[#5A3825] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtro por Categoría */}
          <div className="relative min-w-[160px]">
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-sm text-[#382A24] focus:outline-none focus:border-[#5A3825] capitalize cursor-pointer"
            >
              <option value="todas">Todas las Categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botón Agregar Producto */}
        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#5A3825] hover:bg-[#6E4933] text-[#D4AF37] font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Producto</span>
        </button>
      </div>

      {/* Tabla de Productos con Fotos Centradas y Completas */}
      <div className="bg-white rounded-3xl border border-[#E8DFD3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#382A24]">
            <thead className="bg-[#F5F0E8] text-[#6B5344] text-xs font-bold uppercase tracking-wider border-b border-[#E8DFD3]">
              <tr>
                <th className="py-4 px-4">Producto</th>
                <th className="py-4 px-4">Categoría</th>
                <th className="py-4 px-4">Precio (ARS)</th>
                <th className="py-4 px-4">Stock</th>
                <th className="py-4 px-4 text-center">⭐ Destacado</th>
                <th className="py-4 px-4 text-center">Estado</th>
                <th className="py-4 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DD]">
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#8C7A6B]">
                    No se encontraron productos coincidentes con los filtros.
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((prod) => {
                  const tieneMultiples = Array.isArray(prod.imagenes) && prod.imagenes.length > 1;

                  return (
                    <tr key={prod.id} className="hover:bg-[#FDFBF7] transition-colors">
                      {/* Info / Foto (Centrada y Completa) */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center p-1.5 bg-[#F5F0E8] border border-[#E8DFD3] shrink-0 overflow-hidden relative">
                            <img
                              src={prod.imagen}
                              alt={prod.nombre}
                              className="max-h-full max-w-full object-contain"
                            />
                            {tieneMultiples && (
                              <span className="absolute bottom-0 right-0 bg-[#5A3825] text-[#D4AF37] text-[9px] font-bold px-1 rounded-tl">
                                +{prod.imagenes.length}
                              </span>
                            )}
                          </div>
                          <div className="max-w-xs">
                            <p className="font-bold text-[#382A24] truncate">{prod.nombre}</p>
                            <p className="text-xs text-[#8C7A6B] line-clamp-1">{prod.descripcion}</p>
                            {tieneMultiples && (
                              <span className="text-[10px] text-[#9E816B] font-semibold">
                                {prod.imagenes.length} fotos en galería
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 bg-[#EFE9DF] text-[#6B5344] rounded-lg text-xs font-semibold uppercase tracking-wider">
                          {prod.categoria}
                        </span>
                      </td>

                      {/* Precio con Edición Rápida */}
                      <td className="py-3 px-4">
                        {quickPriceEditId === prod.id ? (
                          <div className="flex items-center space-x-1.5">
                            <input
                              type="number"
                              min="1"
                              value={quickPriceValue}
                              onChange={(e) => setQuickPriceValue(e.target.value)}
                              className="w-24 px-2 py-1 border border-[#5A3825] rounded-lg text-sm font-bold text-[#5A3825] focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveQuickPrice(prod.id)}
                              className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                              title="Guardar precio"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setQuickPriceEditId(null)}
                              className="p-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                              title="Cancelar"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => handleStartQuickPrice(prod)}
                            className="inline-flex items-center space-x-1.5 cursor-pointer hover:bg-[#F5F0E8] px-2 py-1 rounded-lg transition-colors group"
                            title="Click para cambio rápido de precio"
                          >
                            <span className="font-bold text-[#5A3825]">
                              ${prod.precio.toLocaleString("es-AR")}
                            </span>
                            <Edit2 className="w-3 h-3 text-[#8C7A6B] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            prod.stock <= 5
                              ? "bg-amber-100 text-amber-800"
                              : "bg-[#EFE9DF] text-[#6B5344]"
                          }`}
                        >
                          {prod.stock} u.
                        </span>
                      </td>

                      {/* Destacado Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleProductFeatured(prod.id)}
                          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                            prod.destacado
                              ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                              : "text-gray-300 hover:text-amber-400"
                          }`}
                          title={prod.destacado ? "Destacado (Click para quitar)" : "No destacado (Click para destacar)"}
                        >
                          <Star className={`w-5 h-5 ${prod.destacado ? "fill-amber-400" : ""}`} />
                        </button>
                      </td>

                      {/* Estado Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleProductActive(prod.id)}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                            prod.activo
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-500 line-through"
                          }`}
                          title={prod.activo ? "Visible en la tienda" : "Oculto en la tienda"}
                        >
                          {prod.activo ? "Activo" : "Inactivo"}
                        </button>
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-2 text-[#6B5344] hover:bg-[#F2EBDC] rounded-lg transition-colors cursor-pointer"
                            title="Editar producto"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`¿Deseas eliminar "${prod.nombre}" permanentemente?`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar producto"
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

      {/* Modal Formulario Agregar / Editar Producto (Con soporte de múltiples imágenes) */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl border border-[#D8CCBC]">
            {/* Header del Modal */}
            <div className="p-6 bg-[#5A3825] text-[#F3EAD8] flex items-center justify-between border-b border-[#7A523A]">
              <h3 className="font-serif font-bold text-lg">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-[#B59C8B] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#6B5344] uppercase tracking-wider mb-1">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Mate Imperial Algarrobo Especial"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-sm text-[#382A24] focus:outline-none focus:border-[#5A3825]"
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-xs font-bold text-[#6B5344] uppercase tracking-wider mb-1">
                    Categoría *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-sm text-[#382A24] focus:outline-none focus:border-[#5A3825] capitalize cursor-pointer"
                  >
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Precio */}
                <div>
                  <label className="block text-xs font-bold text-[#6B5344] uppercase tracking-wider mb-1">
                    Precio (ARS) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="35000"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-sm text-[#382A24] focus:outline-none focus:border-[#5A3825]"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-xs font-bold text-[#6B5344] uppercase tracking-wider mb-1">
                    Stock Disponible *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="10"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-sm text-[#382A24] focus:outline-none focus:border-[#5A3825]"
                  />
                </div>

                {/* Switches de Destacado y Activo */}
                <div className="flex items-center space-x-6 pt-5">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.destacado}
                      onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                      className="w-4 h-4 accent-[#5A3825] rounded"
                    />
                    <span className="text-xs font-bold text-[#6B5344]">⭐ Producto Destacado</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.activo}
                      onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                      className="w-4 h-4 accent-emerald-700 rounded"
                    />
                    <span className="text-xs font-bold text-emerald-800">Visible en Tienda</span>
                  </label>
                </div>

                {/* Descripción */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#6B5344] uppercase tracking-wider mb-1">
                    Descripción del Producto
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Detalles sobre materiales, medidas, grabado y uso..."
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-sm text-[#382A24] focus:outline-none focus:border-[#5A3825]"
                  ></textarea>
                </div>

                {/* SECCIÓN MÚLTIPLES IMÁGENES: Centradas, Completas y Gestionables */}
                <div className="sm:col-span-2 pt-2 border-t border-[#F0E8DD]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#6B5344] uppercase tracking-wider flex items-center space-x-1.5">
                      <Images className="w-4 h-4 text-[#D4AF37]" />
                      <span>Galería de Imágenes del Producto ({formData.imagenes?.length || 0})</span>
                    </label>
                    <span className="text-[11px] text-[#8C7A6B]">
                      Puedes agregar varias fotos. La primera será la principal.
                    </span>
                  </div>

                  {/* Grilla de Miniaturas actuales con object-contain */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#FDFBF7] rounded-2xl border border-[#E8DFD3] mb-3">
                    {formData.imagenes?.map((imgUrl, index) => (
                      <div
                        key={index}
                        className="relative rounded-xl border border-[#D8CCBC] bg-white p-1 flex flex-col items-center group overflow-hidden"
                      >
                        <div className="w-full h-24 flex items-center justify-center overflow-hidden bg-[#F5F0E8] rounded-lg">
                          <img
                            src={imgUrl}
                            alt={`Foto ${index + 1}`}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {/* Badge Principal */}
                        {index === 0 ? (
                          <span className="absolute top-2 left-2 bg-[#5A3825] text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded shadow">
                            Principal
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetMainImage(index)}
                            className="absolute top-2 left-2 bg-white/90 hover:bg-[#5A3825] hover:text-[#D4AF37] text-[#5A3825] text-[10px] font-bold px-1.5 py-0.5 rounded shadow transition-colors cursor-pointer"
                            title="Hacer foto principal"
                          >
                            Hacer Principal
                          </button>
                        )}

                        {/* Botón Eliminar Foto */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImageFromForm(index)}
                          className="absolute top-2 right-2 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded cursor-pointer shadow"
                          title="Eliminar foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Acciones para agregar más fotos (URL o Subir archivo) */}
                  <div className="flex flex-col sm:flex-row gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Pegar URL o ruta de imagen adicional..."
                      value={urlFotoExtra}
                      onChange={(e) => setUrlFotoExtra(e.target.value)}
                      className="flex-1 w-full px-3 py-2 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-xs text-[#382A24] focus:outline-none focus:border-[#5A3825]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddImageToForm(urlFotoExtra)}
                      disabled={!urlFotoExtra.trim()}
                      className="w-full sm:w-auto px-4 py-2 bg-[#6E4933] hover:bg-[#5A3825] text-[#F3EAD8] rounded-xl text-xs font-bold transition-all disabled:opacity-40 cursor-pointer shrink-0"
                    >
                      + Agregar URL
                    </button>

                    <label className="w-full sm:w-auto px-4 py-2 bg-[#EFE9DF] hover:bg-[#E2D8C9] text-[#5A3825] rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center space-x-1.5 transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Subir de PC</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="pt-4 border-t border-[#F0E8DD] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-[#8C7A6B] hover:bg-[#F2EBDC] rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#5A3825] hover:bg-[#6E4933] text-[#D4AF37] font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow cursor-pointer"
                >
                  {editingProduct ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
