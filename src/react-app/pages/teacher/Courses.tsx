import { useAuth } from "@/react-app/contexts/AuthContext";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { LogOut, BookOpen, Users } from "lucide-react";

interface Curso {
  id: number;
  nombre_curso: string;
  nivel: string;
  seccion: string | null;
  descripcion: string | null;
  anio_escolar: string | null;
}

export default function TeacherCourses() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      const response = await fetch("/api/teacher/cursos", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setCursos(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Mis Cursos</h2>
          <p className="text-gray-600">Selecciona un curso para ver y evaluar estudiantes</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Cargando cursos...</div>
          </div>
        ) : cursos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No tienes cursos asignados
            </h3>
            <p className="text-gray-500">
              Contacta al administrador para que te asigne cursos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.map((curso) => (
              <div
                key={curso.id}
                onClick={() => navigate(`/teacher/cursos/${curso.id}`)}
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl hover:border-indigo-200 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  {curso.seccion && (
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                      Sección {curso.seccion}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {curso.nombre_curso}
                </h3>
                
                {curso.descripcion && (
                  <p className="text-sm text-gray-600 mb-3">{curso.descripcion}</p>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>Ver estudiantes</span>
                </div>

                {curso.anio_escolar && (
                  <p className="text-xs text-gray-400 mt-3">
                    Año escolar: {curso.anio_escolar}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
