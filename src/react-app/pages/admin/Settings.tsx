import AdminLayout from "@/react-app/components/AdminLayout";
import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Save, Building2 } from "lucide-react";

interface ConfiguracionCentro {
  id?: number;
  nombre_centro: string;
  codigo_centro: string;
  direccion: string;
  telefono: string;
  email: string;
  regional: string;
  distrito: string;
  logo_minerd_url: string;
  logo_centro_url: string;
  director_nombre: string;
  anio_escolar_actual: string;
}

export default function Settings() {
  const [config, setConfig] = useState<ConfiguracionCentro>({
    nombre_centro: "",
    codigo_centro: "",
    direccion: "",
    telefono: "",
    email: "",
    regional: "",
    distrito: "",
    logo_minerd_url: "",
    logo_centro_url: "",
    director_nombre: "",
    anio_escolar_actual: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/configuracion-centro");
      if (response.ok) {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          setConfig(data);
        }
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage("");

    try {
      const response = await fetch("/api/configuracion-centro", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setSaveMessage("Configuración guardada exitosamente");
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        const error = await response.json();
        alert(error.error || "Error al guardar la configuración");
      }
    } catch (error) {
      console.error("Error saving config:", error);
      alert("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Configuración del Centro</h1>
          </div>
          <p className="text-gray-600">Datos oficiales de la institución educativa</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica del centro */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Información del Centro</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Centro
                  </label>
                  <input
                    type="text"
                    value={config.nombre_centro}
                    onChange={(e) => setConfig({ ...config, nombre_centro: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Ej: Colegio San José"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código del Centro
                  </label>
                  <input
                    type="text"
                    value={config.codigo_centro}
                    onChange={(e) => setConfig({ ...config, codigo_centro: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Ej: 12345"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={config.direccion}
                  onChange={(e) => setConfig({ ...config, direccion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Dirección completa del centro"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={config.telefono}
                    onChange={(e) => setConfig({ ...config, telefono: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="(809) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={config.email}
                    onChange={(e) => setConfig({ ...config, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="contacto@centro.edu.do"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Regional
                  </label>
                  <input
                    type="text"
                    value={config.regional}
                    onChange={(e) => setConfig({ ...config, regional: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Ej: Regional 10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distrito
                  </label>
                  <input
                    type="text"
                    value={config.distrito}
                    onChange={(e) => setConfig({ ...config, distrito: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Ej: Distrito 10-01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Director(a)
                  </label>
                  <input
                    type="text"
                    value={config.director_nombre}
                    onChange={(e) => setConfig({ ...config, director_nombre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Nombre completo del director"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Año Escolar Actual
                  </label>
                  <input
                    type="text"
                    value={config.anio_escolar_actual}
                    onChange={(e) => setConfig({ ...config, anio_escolar_actual: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Ej: 2024-2025"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* URLs de logos */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Logos del Sistema</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL del Logo del MINERD
                </label>
                <input
                  type="url"
                  value={config.logo_minerd_url}
                  onChange={(e) => setConfig({ ...config, logo_minerd_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://ejemplo.com/logo-minerd.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL del logo oficial del Ministerio de Educación de República Dominicana
                </p>
                {config.logo_minerd_url && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Vista previa:</p>
                    <img 
                      src={config.logo_minerd_url} 
                      alt="Logo MINERD" 
                      className="h-16 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL del Logo del Centro
                </label>
                <input
                  type="url"
                  value={config.logo_centro_url}
                  onChange={(e) => setConfig({ ...config, logo_centro_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://ejemplo.com/logo-centro.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL del logo de tu escuela o colegio
                </p>
                {config.logo_centro_url && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Vista previa:</p>
                    <img 
                      src={config.logo_centro_url} 
                      alt="Logo Centro" 
                      className="h-16 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {saveMessage && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <Save className="w-5 h-5" />
              {saveMessage}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? "Guardando..." : "Guardar Configuración"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
