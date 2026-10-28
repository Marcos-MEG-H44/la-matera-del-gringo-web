import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Layers, Plus, Trash2, Edit2, AlertCircle, Check } from "lucide-react";

export default function CategoriesManager() {
  const { categorias, productos, addCategory, updateCategory, deleteCategory } = useData();

  const [newCatLabel, setNewCatLabel] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [error, setError] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    setError("");

    if (!newCatLabel.trim()) {
      setError("El nombre de la categoría no puede estar vacío.");
      return;
    }

    const id = newCatLabel.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    if (categorias.some((c) => c.id === id)) {
      setError("Ya existe una categoría con un identificador similar.");
      return;
    }

    addCategory({ id, label: newCatLabel.trim() });
    setNewCatLabel("");
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setEditingLabel(cat.label);
  };

  const handleSaveEdit = (id) => {
    if (!editingLabel.trim()) return;
    updateCategory(id, { label: editingLabel.trim() });
    setEditingId(null);
  };

  const handleDelete = (cat) => {
    const prodsInCat = productos.filter((p) => p.categoria === cat.id);
    if (prodsInCat.length > 0) {
      if (!window.confirm(`La categoría "${cat.label}" tiene ${prodsInCat.length} productos asociados. ¿Seguro que deseas eliminarla?`)) {
        return;
      }
    }
    deleteCategory(cat.id);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Formulario Crear Categoría */}
      <div className="bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-xs">
        <h3 className="font-serif font-bold text-lg text-[#5A3825] mb-2 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-[#D4AF37]" />
          <span>Nueva Categoría de Catálogo</span>
        </h3>
        <p className="text-xs text-[#8C7A6B] mb-4">
          Crea nuevas categorías para clasificar tus mates, bombillas o nuevos productos comerciales.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Nombre de categoría (ej. Cuchillos Criollos)"
            value={newCatLabel}
            onChange={(e) => setNewCatLabel(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-sm text-[#382A24] focus:outline-none focus:border-[#5A3825]"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#5A3825] hover:bg-[#6E4933] text-[#D4AF37] font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Categoría</span>
          </button>
        </form>
      </div>

      {/* Listado de Categorías */}
      <div className="bg-white rounded-3xl border border-[#E8DFD3] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#F0E8DD]">
          <h4 className="font-serif font-bold text-[#5A3825]">Categorías Existentes ({categorias.length})</h4>
        </div>

        <div className="divide-y divide-[#F0E8DD]">
          {categorias.map((cat) => {
            const count = productos.filter((p) => p.categoria === cat.id).length;
            const isEditing = editingId === cat.id;

            return (
              <div key={cat.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#FDFBF7] transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F0E8] text-[#5A3825] flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5 text-[#8C7A6B]" />
                  </div>

                  {isEditing ? (
                    <div className="flex items-center space-x-2 flex-1 max-w-xs">
                      <input
                        type="text"
                        value={editingLabel}
                        onChange={(e) => setEditingLabel(e.target.value)}
                        className="px-3 py-1.5 border border-[#5A3825] rounded-lg text-sm font-bold text-[#5A3825] focus:outline-none w-full"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(cat.id)}
                        className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                        title="Guardar"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h5 className="font-bold text-[#382A24]">{cat.label}</h5>
                      <span className="text-xs text-[#8C7A6B]">
                        Identificador: <code className="bg-[#EFE9DF] px-1.5 py-0.5 rounded text-[11px] text-[#6B5344]">{cat.id}</code>
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-[#EFE9DF] text-[#6B5344] rounded-full text-xs font-bold">
                    {count} {count === 1 ? "producto" : "productos"}
                  </span>

                  <div className="flex items-center space-x-1">
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="p-2 text-[#6B5344] hover:bg-[#F2EBDC] rounded-lg transition-colors cursor-pointer"
                        title="Editar nombre"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar categoría"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
