import { useAuth } from "@/react-app/contexts/AuthContext";
import { useNavigate } from "react-router";
import { LogOut, BookOpen, ClipboardList } from "lucide-react";

export default function TeacherDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mis Cursos</h3>
            <p className="text-gray-600 text-sm mb-4">
              Accede a los cursos asignados y gestiona a tus estudiantes
            </p>
            <p className="text-2xl font-bold text-gray-400">Próximamente</p>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Evaluaciones</h3>
            <p className="text-gray-600 text-sm mb-4">
              Realiza evaluaciones y genera boletines para tus estudiantes
            </p>
            <p className="text-2xl font-bold text-gray-400">Próximamente</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Sistema en Desarrollo</h3>
          <p className="text-gray-600 mb-4">
            El portal del maestro está en construcción. Pronto podrás acceder a todas las funcionalidades
            para gestionar tus cursos, realizar evaluaciones y generar boletines.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Funcionalidades próximas</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Visualización de cursos asignados</li>
              <li>• Evaluación de estudiantes por indicadores</li>
              <li>• Generación de boletines personalizados</li>
              <li>• Seguimiento del progreso de estudiantes</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
