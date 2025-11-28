import { useAuth } from "@/react-app/contexts/AuthContext";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { LogOut, ArrowLeft, Users, UserPlus, X, ClipboardList, FileStack } from "lucide-react";

interface Curso {
  id: number;
  nombre_curso: string;
  nivel: string;
  seccion: string | null;
  descripcion: string | null;
  anio_escolar: string | null;
}

interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string | null;
  grado_nivel: string | null;
  nombre_tutor: string | null;
  telefono_tutor: string | null;
  fecha_inscripcion: string | null;
}

interface EstudianteDisponible {
  id: number;
  nombre: string;
  apellido: string;
  grado_nivel: string | null;
}

export default function TeacherCourseDetail() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [curso, setCurso] = useState<Curso | null>(null);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [estudiantesDisponibles, setEstudiantesDisponibles] = useState<EstudianteDisponible[]>([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState("");

  useEffect(() => {
    fetchCursoData();
  }, [id]);

  const fetchCursoData = async () => {
    try {
      // Fetch course info
      const cursosResponse = await fetch("/api/teacher/cursos", {
        credentials: "include",
      });
      if (cursosResponse.ok) {
        const cursos = await cursosResponse.json();
        const cursoActual = cursos.find((c: Curso) => c.id === Number(id));
        if (cursoActual) {
          setCurso(cursoActual);
        }
      }

      // Fetch students in this course
      const estudiantesResponse = await fetch(`/api/teacher/cursos/${id}/estudiantes`, {
        credentials: "include",
      });
      if (estudiantesResponse.ok) {
        const data = await estudiantesResponse.json();
        setEstudiantes(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEstudiantesDisponibles = async () => {
    try {
      const response = await fetch("/api/estudiantes", {
        credentials: "include",
      });
      if (response.ok) {
        const todos = await response.json();
        // Filter out students already in this course
        const disponibles = todos.filter(
          (e: EstudianteDisponible) => !estudiantes.find((est) => est.id === e.id)
        );
        setEstudiantesDisponibles(disponibles);
      }
    } catch (error) {
      console.error("Error fetching available students:", error);
    }
  };

  const handleAddEstudiante = async () => {
    if (!selectedEstudiante) return;

    try {
      const response = await fetch(`/api/cursos/${id}/estudiantes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id_estudiante: Number(selectedEstudiante) }),
      });

      if (response.ok) {
        setShowAddModal(false);
        setSelectedEstudiante("");
        fetchCursoData();
      } else {
        const error = await response.json();
        alert(error.error || "Error al agregar estudiante");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Error al agregar estudiante");
    }
  };

  const handleRemoveEstudiante = async (estudianteId: number) => {
    if (!confirm("¿Estás seguro de que deseas remover este estudiante del curso?")) return;

    try {
      const response = await fetch(`/api/cursos/${id}/estudiantes/${estudianteId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        fetchCursoData();
      }
    } catch (error) {
      console.error("Error removing student:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const openAddModal = () => {
    fetchEstudiantesDisponibles();
    setShowAddModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-gray-500">Curso no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SENI</h1>
                <p className="text-xs text-gray-500">Portal del Maestro</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.nombre} {user.apellido}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a mis cursos
        </button>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {curso.nombre_curso}
                {curso.seccion && (
                  <span className="ml-3 text-2xl text-indigo-600">Sección {curso.seccion}</span>
                )}
              </h2>
              {curso.descripcion && (
                <p className="text-gray-600 mb-2">{curso.descripcion}</p>
              )}
              {curso.anio_escolar && (
                <p className="text-sm text-gray-500">Año escolar: {curso.anio_escolar}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/teacher/cursos/${id}/boletines-masivos`)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                title="Imprimir boletines de todos los estudiantes"
              >
                <FileStack className="w-5 h-5" />
                Imprimir Todos
              </button>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
              >
                <UserPlus className="w-5 h-5" />
                Agregar Estudiante
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Estudiantes ({estudiantes.length})
              </h3>
            </div>
          </div>

          {estudiantes.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No hay estudiantes inscritos en este curso</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Fecha de Nacimiento
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tutor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {estudiantes.map((estudiante) => (
                    <tr key={estudiante.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {estudiante.nombre} {estudiante.apellido}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {estudiante.fecha_nacimiento
                          ? new Date(estudiante.fecha_nacimiento).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {estudiante.nombre_tutor || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {estudiante.telefono_tutor || "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => navigate(`/teacher/cursos/${id}/estudiantes/${estudiante.id}/evaluar`)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            <ClipboardList className="w-4 h-4" />
                            Evaluar
                          </button>
                          <button
                            onClick={() => handleRemoveEstudiante(estudiante.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remover del curso"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Agregar Estudiante</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Estudiante
              </label>
              <select
                value={selectedEstudiante}
                onChange={(e) => setSelectedEstudiante(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">-- Selecciona un estudiante --</option>
                {estudiantesDisponibles.map((est) => (
                  <option key={est.id} value={est.id}>
                    {est.nombre} {est.apellido}
                    {est.grado_nivel && ` - ${est.grado_nivel}`}
                  </option>
                ))}
              </select>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddEstudiante}
                  disabled={!selectedEstudiante}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
