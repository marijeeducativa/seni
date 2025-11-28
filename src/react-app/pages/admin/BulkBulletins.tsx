import AdminLayout from "@/react-app/components/AdminLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FileStack, Printer } from "lucide-react";

interface Curso {
  id: number;
  nombre_curso: string;
  nivel: string;
  seccion: string | null;
  anio_escolar: string | null;
  maestro_nombre: string | null;
}

export default function AdminBulkBulletins() {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      const response = await fetch("/api/cursos", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setCursos(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintBulletins = (cursoId: number) => {
    navigate(`/admin/cursos/${cursoId}/boletines-masivos`);
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileStack className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Impresión Masiva de Boletines</h1>
          </div>
          <p className="text-gray-600">Selecciona una sección para imprimir todos los boletines</p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h2 className="text-lg font-bold text-gray-900">Seleccionar Sección</h2>
            <p className="text-sm text-gray-600 mt-1">
              Haz clic en "Imprimir" para generar todos los boletines de una sección
            </p>
          </div>

          {cursos.length === 0 ? (
            <div className="p-12 text-center">
              <FileStack className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No hay cursos registrados</p>
            </div>
          ) : (
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
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cursos.map((curso) => (
                    <tr key={curso.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{curso.nombre_curso}</div>
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
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handlePrintBulletins(curso.id)}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                        >
                          <Printer className="w-4 h-4" />
                          Imprimir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Instrucciones</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Selecciona la sección haciendo clic en el botón "Imprimir"</li>
            <li>• Se cargarán todos los boletines de los estudiantes en esa sección</li>
            <li>• Una vez cargados, podrás imprimirlos todos de una vez</li>
            <li>• Cada boletín se imprimirá en hojas separadas automáticamente</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
