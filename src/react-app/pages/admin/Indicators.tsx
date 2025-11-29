import AdminLayout from "@/react-app/components/AdminLayout";
import { useEffect, useState } from "react";
import { ClipboardList, Plus, Edit2, Trash2, X, Filter } from "lucide-react";
import { getIndicadores, getCategorias, createIndicador, updateIndicador, deleteIndicador, createCategoria } from "@/react-app/lib/supabase-helpers";

interface Categoria {
  id: number;
  nombre_categoria: string;
  descripcion: string | null;
}

interface Indicador {
  id: number;
  descripcion: string;
  id_categoria: number | null;
  nombre_categoria: string | null;
  niveles_aplicables: string | null;
  tipo_evaluacion: string | null;
  orden: number;
  is_active: number;
}

const CURSOS_NIVELES = [
  "Párvulo I - Nivel 1 (45 días a 6 meses)",
  "Párvulo I - Nivel 2 (6 meses a 1 año)",
  "Párvulo II",
  "Párvulo III",
  "Prekinder",
  "Kinder",
  "Preprimario",
];

export default function AdminIndicators() {
  const [indicadores, setIndicadores] = useState<Indicador[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingIndicador, setEditingIndicador] = useState<Indicador | null>(null);
  const [filterCurso, setFilterCurso] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");

  const [formData, setFormData] = useState({
    descripcion: "",
    id_categoria: "",
    niveles_aplicables: "",
    tipo_evaluacion: "cualitativa",
    orden: "0",
  });

  const [categoryFormData, setCategoryFormData] = useState({
    nombre_categoria: "",
    descripcion: "",
  });

  useEffect(() => {
    fetchCategorias();
    fetchIndicadores();
  }, []);

  const fetchCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  const fetchIndicadores = async () => {
    try {
      const data = await getIndicadores();
      setIndicadores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching indicadores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const indicadorData = {
        ...formData,
        id_categoria: formData.id_categoria ? Number(formData.id_categoria) : null,
        orden: Number(formData.orden),
      };

      if (editingIndicador) {
        await updateIndicador(editingIndicador.id, indicadorData);
      } else {
        await createIndicador(indicadorData);
      }

      fetchIndicadores();
      closeModal();
    } catch (error: any) {
      console.error("Error saving indicador:", error);
      alert(error.message || "Error al guardar el indicador");
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createCategoria(categoryFormData);
      fetchCategorias();
      setShowCategoryModal(false);
      setCategoryFormData({ nombre_categoria: "", descripcion: "" });
    } catch (error: any) {
      console.error("Error saving category:", error);
      alert(error.message || "Error al guardar la categoría");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este indicador?")) return;

    try {
      await deleteIndicador(id);
      fetchIndicadores();
    } catch (error: any) {
      console.error("Error deleting indicador:", error);
      alert(error.message || "Error al eliminar el indicador");
    }
  };

  const openModal = (indicador?: Indicador) => {
    if (indicador) {
      setEditingIndicador(indicador);
      setFormData({
        descripcion: indicador.descripcion,
        id_categoria: indicador.id_categoria?.toString() || "",
        niveles_aplicables: indicador.niveles_aplicables || "",
        tipo_evaluacion: indicador.tipo_evaluacion || "cualitativa",
        orden: indicador.orden.toString(),
      });
    } else {
      setEditingIndicador(null);
      setFormData({
        descripcion: "",
        id_categoria: "",
        niveles_aplicables: "",
        tipo_evaluacion: "cualitativa",
        orden: "0",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingIndicador(null);
  };

  const filteredIndicadores = indicadores.filter((ind) => {
    if (filterCurso && ind.niveles_aplicables && !ind.niveles_aplicables.includes(filterCurso)) {
      return false;
    }
    if (filterCategoria && ind.id_categoria !== Number(filterCategoria)) {
      return false;
    }
    return true;
  });

  const groupedIndicadores = filteredIndicadores.reduce((acc, ind) => {
    const categoria = ind.nombre_categoria || "Sin categoría";
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(ind);
    return acc;
  }, {} as Record<string, Indicador[]>);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Indicadores</h1>
            <p className="text-gray-600">Gestiona los indicadores de evaluación</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Nueva Categoría
            </button>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Nuevo Indicador
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por Curso
                </label>
                <select
                  value={filterCurso}
                  onChange={(e) => setFilterCurso(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los cursos</option>
                  {CURSOS_NIVELES.map((curso) => (
                    <option key={curso} value={curso}>
                      {curso}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por Categoría
                </label>
                <select
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre_categoria}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Indicators grouped by category */}
        <div className="space-y-6">
          {Object.entries(groupedIndicadores).map(([categoria, inds]) => (
            <div key={categoria} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">{categoria}</h2>
                <p className="text-indigo-100 text-sm">{inds.length} indicador(es)</p>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {inds.map((ind) => (
                    <div
                      key={ind.id}
                      className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-gray-900 leading-relaxed">{ind.descripcion}</p>
                        <div className="flex gap-4 mt-2">
                          {ind.niveles_aplicables && (
                            <span className="text-xs text-gray-500">
                              <strong>Niveles:</strong> {ind.niveles_aplicables}
                            </span>
                          )}
                          {ind.tipo_evaluacion && (
                            <span className="text-xs text-gray-500">
                              <strong>Tipo:</strong> {ind.tipo_evaluacion}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => openModal(ind)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ind.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {Object.keys(groupedIndicadores).length === 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
              <ClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No hay indicadores registrados</p>
            </div>
          )}
        </div>
      </div>

      {/* Indicator Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingIndicador ? "Editar Indicador" : "Nuevo Indicador"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría (Dominio)
                </label>
                <select
                  value={formData.id_categoria}
                  onChange={(e) => setFormData({ ...formData, id_categoria: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre_categoria}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveles Aplicables
                </label>
                <select
                  value={formData.niveles_aplicables}
                  onChange={(e) => setFormData({ ...formData, niveles_aplicables: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar nivel</option>
                  {CURSOS_NIVELES.map((curso) => (
                    <option key={curso} value={curso}>
                      {curso}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Evaluación
                </label>
                <select
                  value={formData.tipo_evaluacion}
                  onChange={(e) => setFormData({ ...formData, tipo_evaluacion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="cualitativa">Cualitativa</option>
                  <option value="cuantitativa">Cuantitativa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orden
                </label>
                <input
                  type="number"
                  value={formData.orden}
                  onChange={(e) => setFormData({ ...formData, orden: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                >
                  {editingIndicador ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Nueva Categoría</h2>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  value={categoryFormData.nombre_categoria}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, nombre_categoria: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={categoryFormData.descripcion}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, descripcion: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
