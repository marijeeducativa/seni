import AdminLayout from "@/react-app/components/AdminLayout";
import { useEffect, useState } from "react";
import { BookOpen, Plus, Edit2, Trash2, X } from "lucide-react";
import { getCursos, getUsuarios } from "@/react-app/lib/supabase-helpers";
import { supabase } from "@/react-app/supabase";

interface Curso {
  id: number;
  nombre_curso: string;
  nivel: string;
  seccion: string | null;
  id_maestro: number | null;
  maestro_nombre: string | null;
  descripcion: string | null;
  anio_escolar: string | null;
  is_active: number;
}

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  rol: string;
}

const CURSOS_PREDEFINIDOS = [
  { nombre_curso: "Párvulo I", nivel: "Nivel Inicial", descripcion: "45 días a 1 año" },
  { nombre_curso: "Párvulo II", nivel: "Nivel Inicial", descripcion: "1 a 2 años" },
  { nombre_curso: "Párvulo III", nivel: "Nivel Inicial", descripcion: "2 a 3 años" },
  { nombre_curso: "Prekinder", nivel: "Nivel Inicial", descripcion: "3 a 4 años" },
  { nombre_curso: "Kinder", nivel: "Nivel Inicial", descripcion: "4 a 5 años" },
  { nombre_curso: "Preprimario", nivel: "Nivel Inicial", descripcion: "5 a 6 años" },
];

export default function AdminCourses() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [maestros, setMaestros] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [formData, setFormData] = useState({
    curso_predefinido: "",
    nombre_curso: "",
    nivel: "Nivel Inicial",
    seccion: "",
    id_maestro: "",
    descripcion: "",
    anio_escolar: new Date().getFullYear().toString(),
  });

  useEffect(() => {
    fetchCursos();
    fetchMaestros();
  }, []);

  const fetchCursos = async () => {
    try {
      const data = await getCursos();
      setCursos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaestros = async () => {
    try {
      const data = await getUsuarios();
      setMaestros(Array.isArray(data) ? data.filter((u: Usuario) => u.rol === "maestro") : []);
    } catch (error) {
      console.error("Error fetching maestros:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingCurso ? `/api/cursos/${editingCurso.id}` : "/api/cursos";
    const method = editingCurso ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id_maestro: formData.id_maestro ? Number(formData.id_maestro) : null,
        }),
      });

      if (response.ok) {
        fetchCursos();
        closeModal();
      } else {
        const error = await response.json();
        alert(error.error || "Error al guardar el curso");
      }
    } catch (error) {
      console.error("Error saving curso:", error);
      alert("Error al guardar el curso");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este curso?")) return;

    try {
      const response = await fetch(`/api/cursos/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchCursos();
      }
    } catch (error) {
      console.error("Error deleting curso:", error);
    }
  };

  const handleCursoChange = (cursoNombre: string) => {
    const cursoPredefinido = CURSOS_PREDEFINIDOS.find(c => c.nombre_curso === cursoNombre);
    if (cursoPredefinido) {
      setFormData({
        ...formData,
        curso_predefinido: cursoNombre,
        nombre_curso: cursoPredefinido.nombre_curso,
        nivel: cursoPredefinido.nivel,
        descripcion: cursoPredefinido.descripcion,
      });
    }
  };

  const openModal = (curso?: Curso) => {
    if (curso) {
      setEditingCurso(curso);
      const cursoPredefinido = CURSOS_PREDEFINIDOS.find(c => c.nombre_curso === curso.nombre_curso);
      setFormData({
        curso_predefinido: cursoPredefinido ? curso.nombre_curso : "",
        nombre_curso: curso.nombre_curso,
        nivel: curso.nivel,
        seccion: curso.seccion || "",
        id_maestro: curso.id_maestro?.toString() || "",
        descripcion: curso.descripcion || "",
        anio_escolar: curso.anio_escolar || new Date().getFullYear().toString(),
      });
    } else {
      setEditingCurso(null);
      setFormData({
        curso_predefinido: "",
        nombre_curso: "",
        nivel: "Nivel Inicial",
        seccion: "",
        id_maestro: "",
        descripcion: "",
        anio_escolar: new Date().getFullYear().toString(),
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCurso(null);
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cursos</h1>
            <p className="text-gray-600">Gestiona los cursos del sistema</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nuevo Curso
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Curso
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nivel
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sección
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Maestro
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Año Escolar
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cursos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      No hay cursos registrados
                    </td>
                  </tr>
                ) : (
                  cursos.map((curso) => (
                    <tr key={curso.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{curso.nombre_curso}</div>
                        {curso.descripcion && (
                          <div className="text-sm text-gray-500">{curso.descripcion}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{curso.nivel}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {curso.seccion || <span className="text-gray-400 italic">-</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {curso.maestro_nombre || (
                          <span className="text-gray-400 italic">Sin asignar</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {curso.anio_escolar || "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openModal(curso)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(curso.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCurso ? "Editar Curso" : "Nuevo Curso"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!editingCurso && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seleccionar Curso *
                  </label>
                  <select
                    value={formData.curso_predefinido}
                    onChange={(e) => handleCursoChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Selecciona un curso --</option>
                    {CURSOS_PREDEFINIDOS.map((curso) => (
                      <option key={curso.nombre_curso} value={curso.nombre_curso}>
                        {curso.nombre_curso} - {curso.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {editingCurso && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Curso *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre_curso}
                      onChange={(e) => setFormData({ ...formData, nombre_curso: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nivel *</label>
                    <input
                      type="text"
                      value={formData.nivel}
                      onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      readOnly
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sección *</label>
                <input
                  type="text"
                  value={formData.seccion}
                  onChange={(e) => setFormData({ ...formData, seccion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: A, B, C"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maestra *</label>
                <select
                  value={formData.id_maestro}
                  onChange={(e) => setFormData({ ...formData, id_maestro: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona una maestra --</option>
                  {maestros.map((maestro) => (
                    <option key={maestro.id} value={maestro.id}>
                      {maestro.nombre} {maestro.apellido}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Año Escolar
                </label>
                <input
                  type="text"
                  value={formData.anio_escolar}
                  onChange={(e) => setFormData({ ...formData, anio_escolar: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2024-2025"
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
                  {editingCurso ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
