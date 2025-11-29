import AdminLayout from "@/react-app/components/AdminLayout";
import { Users, GraduationCap, BookOpen, ClipboardCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { getStats } from "@/react-app/lib/supabase-helpers";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    usuarios: 0,
    estudiantes: 0,
    cursos: 0,
    evaluaciones: 0,
  });

  useEffect(() => {
    getStats()
      .then((data) => setStats(data))
      .catch(() => { });
  }, []);

  const statCards = [
    { label: "Usuarios", value: stats.usuarios, icon: Users, color: "from-blue-500 to-blue-600" },
    { label: "Estudiantes", value: stats.estudiantes, icon: GraduationCap, color: "from-green-500 to-green-600" },
    { label: "Cursos", value: stats.cursos, icon: BookOpen, color: "from-purple-500 to-purple-600" },
    { label: "Evaluaciones", value: stats.evaluaciones, icon: ClipboardCheck, color: "from-orange-500 to-orange-600" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Resumen del sistema de evaluación</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Bienvenido a SENI</h2>
          <p className="text-gray-600 mb-4">
            Sistema de Evaluación para el Nivel Inicial. Desde aquí puedes gestionar usuarios,
            estudiantes, cursos e indicadores de evaluación.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Próximas características</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Gestión completa de estudiantes y cursos</li>
              <li>• Sistema de indicadores de evaluación</li>
              <li>• Generación de boletines personalizados</li>
              <li>• Reportes y estadísticas avanzadas</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
