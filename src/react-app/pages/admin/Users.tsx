import AdminLayout from "@/react-app/components/AdminLayout";
import { Plus, Pencil, Trash2, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Usuario } from "@/shared/types";
import UserModal from "@/react-app/components/UserModal";

export default function AdminUsers() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("/api/usuarios", {
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Error fetching users:", response.statusText);
        setUsuarios([]);
        return;
      }
      const data = await response.json();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      return;
    }

    try {
      await fetch(`/api/usuarios/${id}`, { 
        method: "DELETE",
        credentials: "include",
      });
      fetchUsuarios();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user: Usuario) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    fetchUsuarios();
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
            <p className="text-gray-600">Administra los usuarios del sistema</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" />
            Nuevo Usuario
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
            <p className="text-gray-500">Cargando usuarios...</p>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
            <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay usuarios registrados</h3>
            <p className="text-gray-600 mb-6">Comienza agregando tu primer usuario</p>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Agregar Usuario
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {usuario.nombre.charAt(0)}
                            {usuario.apellido.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {usuario.nombre} {usuario.apellido}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{usuario.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            usuario.rol === "administrador"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {usuario.rol === "administrador" ? "Administrador" : "Maestro"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            usuario.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {usuario.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(usuario)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center gap-1"
                        >
                          <Pencil className="w-4 h-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(usuario.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isModalOpen && (
          <UserModal
            user={editingUser}
            onClose={handleModalClose}
          />
        )}
      </div>
    </AdminLayout>
  );
}
