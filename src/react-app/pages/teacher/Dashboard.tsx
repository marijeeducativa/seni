import { useAuth } from "@/react-app/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, BookOpen, ClipboardList, Bell, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getAvisos } from "@/react-app/lib/supabase-helpers";

interface Aviso {
  id: number;
  titulo: string;
  contenido: string;
  target_rol: string;
  created_at: string;
}

export default function TeacherDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loadingAvisos, setLoadingAvisos] = useState(true);

  useEffect(() => {
    async function loadAvisos() {
      try {
        const data = await getAvisos();
        setAvisos(data || []);
      } catch (e) {
        console.error("Error loading avisos", e);
      } finally {
        setLoadingAvisos(false);
      }
    }
    loadAvisos();
  }, []);

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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido, {user?.nombre}
          </h2>
          <p className="text-gray-600">Portal para gestión de evaluaciones</p>
        </div>

        {/* NOTIFICATIONS SECTION */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            Avisos y Comunicados
          </h3>
          {loadingAvisos ? (
            <div className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
          ) : avisos.length > 0 ? (
            <div className="grid gap-4">
              {avisos.map(aviso => (
                <div key={aviso.id} className="bg-white border-l-4 border-indigo-500 shadow-sm rounded-r-xl p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900 text-lg">{aviso.titulo}</h4>
                    <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                      {new Date(aviso.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{aviso.contenido}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No hay avisos nuevos por el momento.</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div
            onClick={() => navigate('/teacher/cursos')}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mis Cursos</h3>
            <p className="text-gray-600 text-sm mb-4">
              Accede a los cursos asignados y gestiona a tus estudiantes
            </p>
            <span className="text-blue-600 font-medium text-sm group-hover:underline">Ver cursos &rarr;</span>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 opacity-60">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-500 mb-2">Reportes (Próximamente)</h3>
            <p className="text-gray-400 text-sm mb-4">
              Estadísticas y desempeño
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
