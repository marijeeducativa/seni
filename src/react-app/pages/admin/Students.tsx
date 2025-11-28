import AdminLayout from "@/react-app/components/AdminLayout";
import { useEffect, useState, useRef } from "react";
import { GraduationCap, Plus, Edit2, Trash2, X, Upload, ArrowRight, CheckSquare, Square } from "lucide-react";

interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  genero: string | null;
  fecha_nacimiento: string | null;
  grado_nivel: string | null;
  nivel_parvulo: string | null;
  nombre_tutor: string | null;
  telefono_tutor: string | null;
  email_tutor: string | null;
  direccion_tutor: string | null;
  is_active: number;
  id_curso_actual: number | null;
  curso_nombre: string | null;
  curso_seccion: string | null;
}

interface Curso {
  id: number;
  nombre_curso: string;
  nivel: string;
  seccion: string | null;
  descripcion: string | null;
}

interface CSVStudent {
  nombre: string;
  apellido: string;
  genero: string | null;
  fecha_nacimiento: string | null;
  nombre_tutor: string | null;
  telefono_tutor: string | null;
  email_tutor: string | null;
  direccion_tutor: string | null;
}

export default function AdminStudents() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [editingEstudiante, setEditingEstudiante] = useState<Estudiante | null>(null);
  const [uploadingCSV, setUploadingCSV] = useState(false);
  const [csvStudents, setCSVStudents] = useState<CSVStudent[]>([]);
  const [selectedCursoForCSV, setSelectedCursoForCSV] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set());
  const [targetCurso, setTargetCurso] = useState("");
  const [filterCurso, setFilterCurso] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    genero: "",
    fecha_nacimiento: "",
    id_curso_actual: "",
    nivel_parvulo: "",
    nombre_tutor: "",
    telefono_tutor: "",
    email_tutor: "",
    direccion_tutor: "",
  });

  useEffect(() => {
    fetchEstudiantes();
    fetchCursos();
  }, []);

  const fetchEstudiantes = async () => {
    try {
      const response = await fetch("/api/estudiantes");
      if (response.ok) {
        const data = await response.json();
        setEstudiantes(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching estudiantes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCursos = async () => {
    try {
      const response = await fetch("/api/cursos");
      if (response.ok) {
        const data = await response.json();
        setCursos(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching cursos:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingEstudiante ? `/api/estudiantes/${editingEstudiante.id}` : "/api/estudiantes";
    const method = editingEstudiante ? "PUT" : "POST";

    // Get selected course info to set grado_nivel
    let gradoNivel = "";
    if (formData.id_curso_actual) {
      const curso = cursos.find(c => c.id === Number(formData.id_curso_actual));
      if (curso) {
        gradoNivel = curso.nombre_curso;
        if (curso.seccion) {
          gradoNivel += ` - Sección ${curso.seccion}`;
        }
        // For Párvulo I, nivel_parvulo already includes "Párvulo I - " prefix
        if (curso.nombre_curso === "Párvulo I" && formData.nivel_parvulo) {
          gradoNivel = formData.nivel_parvulo;
          if (curso.seccion) {
            gradoNivel += ` - Sección ${curso.seccion}`;
          }
        }
      }
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          genero: formData.genero || null,
          fecha_nacimiento: formData.fecha_nacimiento || null,
          grado_nivel: gradoNivel || null,
          nivel_parvulo: formData.nivel_parvulo || null,
          id_curso_actual: formData.id_curso_actual ? Number(formData.id_curso_actual) : null,
          nombre_tutor: formData.nombre_tutor || null,
          telefono_tutor: formData.telefono_tutor || null,
          email_tutor: formData.email_tutor || null,
          direccion_tutor: formData.direccion_tutor || null,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // If creating a new student and course is selected, enroll them
        if (!editingEstudiante && formData.id_curso_actual) {
          await fetch(`/api/cursos/${formData.id_curso_actual}/estudiantes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_estudiante: result.id }),
          });
        }
        
        // If editing and course changed, update enrollment
        if (editingEstudiante && formData.id_curso_actual) {
          if (editingEstudiante.id_curso_actual !== Number(formData.id_curso_actual)) {
            // Remove from old course if exists
            if (editingEstudiante.id_curso_actual) {
              await fetch(`/api/cursos/${editingEstudiante.id_curso_actual}/estudiantes/${editingEstudiante.id}`, {
                method: "DELETE",
              });
            }
            
            // Enroll in new course
            await fetch(`/api/cursos/${formData.id_curso_actual}/estudiantes`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_estudiante: editingEstudiante.id }),
            });
          }
        }
        
        fetchEstudiantes();
        closeModal();
      } else {
        const error = await response.json();
        alert(error.error || "Error al guardar el estudiante");
      }
    } catch (error) {
      console.error("Error saving estudiante:", error);
      alert("Error al guardar el estudiante");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este estudiante?")) return;

    try {
      const response = await fetch(`/api/estudiantes/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchEstudiantes();
      }
    } catch (error) {
      console.error("Error deleting estudiante:", error);
    }
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCSV(true);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        alert("El archivo CSV está vacío");
        setUploadingCSV(false);
        return;
      }

      // Parse CSV header
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Expected headers
      const requiredHeaders = ['nombre', 'apellido'];
      const hasRequired = requiredHeaders.every(h => headers.includes(h));
      
      if (!hasRequired) {
        alert("El CSV debe contener las columnas: nombre, apellido (las demás son opcionales: fecha_nacimiento, nombre_tutor, telefono_tutor, email_tutor, direccion_tutor)");
        setUploadingCSV(false);
        return;
      }

      // Parse data rows
      const students: CSVStudent[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const student: any = {};
        
        headers.forEach((header, index) => {
          const value = values[index] || '';
          student[header] = value;
        });

        if (student.nombre && student.apellido) {
          students.push({
            nombre: student.nombre,
            apellido: student.apellido,
            genero: student.genero || null,
            fecha_nacimiento: student.fecha_nacimiento || null,
            nombre_tutor: student.nombre_tutor || null,
            telefono_tutor: student.telefono_tutor || null,
            email_tutor: student.email_tutor || null,
            direccion_tutor: student.direccion_tutor || null,
          });
        }
      }

      if (students.length === 0) {
        alert("No se encontraron estudiantes válidos en el CSV");
        setUploadingCSV(false);
        return;
      }

      setCSVStudents(students);
      setShowCSVModal(true);
    } catch (error) {
      console.error("Error uploading CSV:", error);
      alert("Error al procesar el archivo CSV");
    } finally {
      setUploadingCSV(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmCSVUpload = async () => {
    if (!selectedCursoForCSV) {
      alert("Debes seleccionar un curso y sección");
      return;
    }

    try {
      const studentsToUpload = csvStudents.map(s => ({
        ...s,
        id_curso_actual: Number(selectedCursoForCSV),
      }));

      const response = await fetch("/api/estudiantes/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estudiantes: studentsToUpload }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Se cargaron ${result.count} estudiantes exitosamente`);
        fetchEstudiantes();
        setShowCSVModal(false);
        setCSVStudents([]);
        setSelectedCursoForCSV("");
      } else {
        const error = await response.json();
        alert(error.error || "Error al cargar los estudiantes");
      }
    } catch (error) {
      console.error("Error uploading students:", error);
      alert("Error al cargar los estudiantes");
    }
  };

  const toggleStudentSelection = (id: number) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStudents(newSelected);
  };

  const toggleSelectAll = () => {
    const filteredEstudiantes = getFilteredEstudiantes();
    if (selectedStudents.size === filteredEstudiantes.length && filteredEstudiantes.length > 0) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredEstudiantes.map(e => e.id)));
    }
  };

  const getFilteredEstudiantes = () => {
    if (!filterCurso) {
      return estudiantes;
    }
    return estudiantes.filter(e => e.id_curso_actual === Number(filterCurso));
  };

  const handleBulkDelete = async () => {
    if (selectedStudents.size === 0) {
      alert("Debes seleccionar al menos un estudiante");
      return;
    }

    if (!confirm(`¿Estás seguro de que deseas eliminar ${selectedStudents.size} estudiante${selectedStudents.size > 1 ? 's' : ''}?`)) {
      return;
    }

    try {
      for (const estudianteId of selectedStudents) {
        await fetch(`/api/estudiantes/${estudianteId}`, { method: "DELETE" });
      }

      alert(`Se eliminaron ${selectedStudents.size} estudiantes exitosamente`);
      setSelectedStudents(new Set());
      fetchEstudiantes();
    } catch (error) {
      console.error("Error deleting students:", error);
      alert("Error al eliminar los estudiantes");
    }
  };

  const handleMoveStudents = async () => {
    if (!targetCurso) {
      alert("Debes seleccionar un curso de destino");
      return;
    }

    if (selectedStudents.size === 0) {
      alert("Debes seleccionar al menos un estudiante");
      return;
    }

    try {
      // Get course info for grado_nivel
      const curso = cursos.find(c => c.id === Number(targetCurso));
      if (!curso) return;

      const gradoNivel = `${curso.nombre_curso}${curso.seccion ? ` - Sección ${curso.seccion}` : ''}`;

      // Move each selected student
      for (const estudianteId of selectedStudents) {
        const estudiante = estudiantes.find(e => e.id === estudianteId);
        if (!estudiante) continue;

        // Update student record
        await fetch(`/api/estudiantes/${estudianteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: estudiante.nombre,
            apellido: estudiante.apellido,
            genero: estudiante.genero,
            fecha_nacimiento: estudiante.fecha_nacimiento,
            grado_nivel: gradoNivel,
            id_curso_actual: Number(targetCurso),
            nombre_tutor: estudiante.nombre_tutor,
            telefono_tutor: estudiante.telefono_tutor,
            email_tutor: estudiante.email_tutor,
            direccion_tutor: estudiante.direccion_tutor,
          }),
        });

        // Remove from old course if exists
        if (estudiante.id_curso_actual) {
          await fetch(`/api/cursos/${estudiante.id_curso_actual}/estudiantes/${estudianteId}`, {
            method: "DELETE",
          });
        }

        // Enroll in new course
        await fetch(`/api/cursos/${targetCurso}/estudiantes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_estudiante: estudianteId }),
        });
      }

      alert(`Se movieron ${selectedStudents.size} estudiantes exitosamente`);
      setShowMoveModal(false);
      setTargetCurso("");
      setSelectedStudents(new Set());
      fetchEstudiantes();
    } catch (error) {
      console.error("Error moving students:", error);
      alert("Error al mover los estudiantes");
    }
  };

  const openModal = (estudiante?: Estudiante) => {
    if (estudiante) {
      setEditingEstudiante(estudiante);
      setFormData({
        nombre: estudiante.nombre,
        apellido: estudiante.apellido,
        genero: estudiante.genero || "",
        fecha_nacimiento: estudiante.fecha_nacimiento || "",
        id_curso_actual: estudiante.id_curso_actual?.toString() || "",
        nivel_parvulo: estudiante.nivel_parvulo || "",
        nombre_tutor: estudiante.nombre_tutor || "",
        telefono_tutor: estudiante.telefono_tutor || "",
        email_tutor: estudiante.email_tutor || "",
        direccion_tutor: estudiante.direccion_tutor || "",
      });
    } else {
      setEditingEstudiante(null);
      setFormData({
        nombre: "",
        apellido: "",
        genero: "",
        fecha_nacimiento: "",
        id_curso_actual: "",
        nivel_parvulo: "",
        nombre_tutor: "",
        telefono_tutor: "",
        email_tutor: "",
        direccion_tutor: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEstudiante(null);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Estudiantes</h1>
            <p className="text-gray-600">Gestiona los estudiantes del sistema</p>
          </div>
          <div className="flex gap-3">
            {selectedStudents.size > 0 && (
              <>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
                >
                  <Trash2 className="w-5 h-5" />
                  Eliminar {selectedStudents.size} estudiante{selectedStudents.size > 1 ? 's' : ''}
                </button>
                <button
                  onClick={() => setShowMoveModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-2 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
                >
                  <ArrowRight className="w-5 h-5" />
                  Mover {selectedStudents.size} estudiante{selectedStudents.size > 1 ? 's' : ''}
                </button>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingCSV}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg disabled:opacity-50"
            >
              <Upload className="w-5 h-5" />
              {uploadingCSV ? "Cargando..." : "Cargar CSV"}
            </button>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Nuevo Estudiante
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por Curso y Sección
          </label>
          <select
            value={filterCurso}
            onChange={(e) => {
              setFilterCurso(e.target.value);
              setSelectedStudents(new Set());
            }}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Todos los cursos</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nombre_curso}
                {curso.seccion ? ` - Sección ${curso.seccion}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Formato CSV para carga masiva</h3>
          <p className="text-sm text-blue-800 mb-2">
            El archivo CSV debe contener las siguientes columnas (separadas por comas):
          </p>
          <code className="text-xs bg-white px-2 py-1 rounded text-blue-900 block">
            nombre,apellido,genero,fecha_nacimiento,nombre_tutor,telefono_tutor,email_tutor,direccion_tutor
          </code>
          <p className="text-xs text-blue-700 mt-2">
            Solo <strong>nombre</strong> y <strong>apellido</strong> son obligatorios. El campo <strong>genero</strong> debe ser "M" o "F".
            Después de cargar el CSV, podrás seleccionar el curso y sección para todos los estudiantes.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={toggleSelectAll}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {selectedStudents.size === getFilteredEstudiantes().length && getFilteredEstudiantes().length > 0 ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nombre Completo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Curso y Sección
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tutor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getFilteredEstudiantes().length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      <GraduationCap className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      {filterCurso ? "No hay estudiantes en este curso" : "No hay estudiantes registrados"}
                    </td>
                  </tr>
                ) : (
                  getFilteredEstudiantes().map((estudiante) => (
                    <tr key={estudiante.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleStudentSelection(estudiante.id)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          {selectedStudents.has(estudiante.id) ? (
                            <CheckSquare className="w-5 h-5 text-indigo-600" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {estudiante.nombre} {estudiante.apellido}
                        </div>
                        {estudiante.fecha_nacimiento && (
                          <div className="text-sm text-gray-500">
                            Nacimiento: {new Date(estudiante.fecha_nacimiento).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {estudiante.curso_nombre ? (
                          <div>
                            <div className="font-medium">{estudiante.curso_nombre}</div>
                            {estudiante.curso_seccion && (
                              <div className="text-xs text-gray-500">Sección {estudiante.curso_seccion}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Sin asignar</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {estudiante.nombre_tutor || <span className="text-gray-400 italic">-</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {estudiante.telefono_tutor && (
                          <div>{estudiante.telefono_tutor}</div>
                        )}
                        {estudiante.email_tutor && (
                          <div className="text-gray-500">{estudiante.email_tutor}</div>
                        )}
                        {!estudiante.telefono_tutor && !estudiante.email_tutor && (
                          <span className="text-gray-400 italic">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openModal(estudiante)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(estudiante.id)}
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

      {/* Edit/Create Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingEstudiante ? "Editar Estudiante" : "Nuevo Estudiante"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género
                </label>
                <select
                  value={formData.genero}
                  onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Seleccionar género</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    value={formData.fecha_nacimiento}
                    onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Curso y Sección *
                  </label>
                  <select
                    value={formData.id_curso_actual}
                    onChange={(e) => {
                      setFormData({ ...formData, id_curso_actual: e.target.value, nivel_parvulo: "" });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar curso y sección</option>
                    {cursos.map((curso) => (
                      <option key={curso.id} value={curso.id}>
                        {curso.nombre_curso}
                        {curso.seccion ? ` - Sección ${curso.seccion}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.id_curso_actual && cursos.find(c => c.id === Number(formData.id_curso_actual))?.nombre_curso === "Párvulo I" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nivel de Párvulo I *
                  </label>
                  <select
                    value={formData.nivel_parvulo}
                    onChange={(e) => setFormData({ ...formData, nivel_parvulo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar nivel</option>
                    <option value="Párvulo I - Nivel 1 (45 días a 6 meses)">Nivel 1 (45 días a 6 meses)</option>
                    <option value="Párvulo I - Nivel 2 (6 meses a 1 año)">Nivel 2 (6 meses a 1 año)</option>
                  </select>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Datos del Tutor</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Tutor
                    </label>
                    <input
                      type="text"
                      value={formData.nombre_tutor}
                      onChange={(e) => setFormData({ ...formData, nombre_tutor: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono del Tutor
                      </label>
                      <input
                        type="tel"
                        value={formData.telefono_tutor}
                        onChange={(e) => setFormData({ ...formData, telefono_tutor: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email del Tutor
                      </label>
                      <input
                        type="email"
                        value={formData.email_tutor}
                        onChange={(e) => setFormData({ ...formData, email_tutor: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección del Tutor
                    </label>
                    <textarea
                      value={formData.direccion_tutor}
                      onChange={(e) => setFormData({ ...formData, direccion_tutor: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>
                </div>
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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
                >
                  {editingEstudiante ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Upload Modal */}
      {showCSVModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Confirmar Carga de Estudiantes
              </h2>
              <button
                onClick={() => {
                  setShowCSVModal(false);
                  setCSVStudents([]);
                  setSelectedCursoForCSV("");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecciona el Curso y Sección para estos {csvStudents.length} estudiantes:
                </label>
                <select
                  value={selectedCursoForCSV}
                  onChange={(e) => setSelectedCursoForCSV(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">-- Selecciona un curso y sección --</option>
                  {cursos.map((curso) => (
                    <option key={curso.id} value={curso.id}>
                      {curso.nombre_curso}
                      {curso.seccion ? ` - Sección ${curso.seccion}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Estudiantes a cargar ({csvStudents.length}):
                </h3>
                <div className="space-y-2">
                  {csvStudents.map((student, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-gray-200">
                      <div className="font-medium text-gray-900">
                        {student.nombre} {student.apellido}
                      </div>
                      {student.nombre_tutor && (
                        <div className="text-sm text-gray-600">
                          Tutor: {student.nombre_tutor}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCSVModal(false);
                    setCSVStudents([]);
                    setSelectedCursoForCSV("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmCSVUpload}
                  disabled={!selectedCursoForCSV}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cargar Estudiantes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Move Students Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Mover Estudiantes
              </h2>
              <button
                onClick={() => {
                  setShowMoveModal(false);
                  setTargetCurso("");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Vas a mover <strong>{selectedStudents.size}</strong> estudiante{selectedStudents.size > 1 ? 's' : ''} a:
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curso y Sección de destino:
              </label>
              <select
                value={targetCurso}
                onChange={(e) => setTargetCurso(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-6"
              >
                <option value="">-- Selecciona un curso y sección --</option>
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nombre_curso}
                    {curso.seccion ? ` - Sección ${curso.seccion}` : ''}
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowMoveModal(false);
                    setTargetCurso("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleMoveStudents}
                  disabled={!targetCurso}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mover
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
