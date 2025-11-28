import AdminLayout from "@/react-app/components/AdminLayout";
import { useState } from "react";
import { Database, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function SeedIndicators() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSeed = async () => {
    if (!confirm("¿Estás seguro de que deseas cargar los indicadores? Esto puede tomar algunos momentos.")) {
      return;
    }

    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/seed-indicators", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setStatus("success");
        setMessage(`Indicadores cargados exitosamente. Total: ${data.count || "múltiples"} indicadores.`);
      } else {
        const error = await response.json();
        setStatus("error");
        setMessage(error.error || "Error al cargar los indicadores");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Error de conexión al cargar los indicadores");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cargar Indicadores</h1>
          <p className="text-gray-600">
            Carga los indicadores de evaluación para todos los cursos del nivel inicial
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Inicializar Indicadores</h2>
              <p className="text-gray-600">Base de datos de evaluación</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">¿Qué incluye esta carga?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Indicadores para Párvulo I (Nivel 1 y Nivel 2)</li>
              <li>• Indicadores para Párvulo II</li>
              <li>• Indicadores para Párvulo III</li>
              <li>• Indicadores para Prekinder</li>
              <li>• Indicadores para Kinder</li>
              <li>• Indicadores para Preprimario</li>
              <li>• Categorías por dominios de aprendizaje</li>
            </ul>
          </div>

          {status === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">Carga Exitosa</h4>
                <p className="text-sm text-green-800">{message}</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">Error en la Carga</h4>
                <p className="text-sm text-red-800">{message}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleSeed}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-4 rounded-lg transition-all shadow-lg disabled:opacity-50 font-medium text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Cargando Indicadores...
              </>
            ) : (
              <>
                <Database className="w-6 h-6" />
                Cargar Indicadores
              </>
            )}
          </button>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Esta acción no duplicará indicadores existentes
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
