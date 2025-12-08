import AdminLayout from "@/react-app/components/AdminLayout";
import { useEffect, useState } from "react";

import { BookOpen, User, Save, CheckCircle, ChevronRight, ArrowLeft } from "lucide-react";
import { getCursos, getEstudiantes, getObservaciones, saveObservacion } from "@/react-app/lib/supabase-helpers";

interface Curso {
    id: number;
    nombre_curso: string;
    nivel: string;
    seccion: string | null;
    maestro_nombre: string | null;
    anio_escolar?: string;
}

interface Estudiante {
    id: number;
    nombre: string;
    apellido: string;
}

interface ObservacionData {
    cualidades_destacar: string;
    necesita_apoyo: string;
}

const PERIODOS = ["1er Período", "2do Período", "3er Período"];

export default function AdminObservationReview() {

    const [viewState, setViewState] = useState<'courses' | 'students' | 'edit'>('courses');
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
    const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
    const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null);
    const [observaciones, setObservaciones] = useState<Record<number, ObservacionData>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);

    useEffect(() => {
        fetchCursos();
    }, []);

    const fetchCursos = async () => {
        try {
            const data = await getCursos();
            setCursos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCurso = async (curso: Curso) => {
        setSelectedCurso(curso);
        setLoading(true);
        try {
            const allStudents = await getEstudiantes();
            // Filter manually since getEstudiantes returns all (optimized in backend ideally)
            const cursoStudents = allStudents.filter((e: any) => e.id_curso_actual === curso.id);
            setEstudiantes(cursoStudents);
            setViewState('students');
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectEstudiante = async (estudiante: Estudiante) => {
        setSelectedEstudiante(estudiante);
        setLoading(true);
        try {
            const data = await getObservaciones(estudiante.id);
            const obsMap: Record<number, ObservacionData> = {};

            // Initialize empty
            PERIODOS.forEach((_, idx) => {
                obsMap[idx] = { cualidades_destacar: "", necesita_apoyo: "" };
            });

            if (Array.isArray(data)) {
                data.forEach((obs: any) => {
                    const pIdx = PERIODOS.indexOf(obs.periodo_evaluacion);
                    if (pIdx !== -1) {
                        obsMap[pIdx] = {
                            cualidades_destacar: obs.cualidades_destacar || "",
                            necesita_apoyo: obs.necesita_apoyo || ""
                        };
                    }
                });
            }
            setObservaciones(obsMap);
            setViewState('edit');
        } catch (error) {
            console.error("Error fetching observations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleObservacionChange = (periodoIndex: number, field: 'cualidades_destacar' | 'necesita_apoyo', value: string) => {
        setObservaciones(prev => ({
            ...prev,
            [periodoIndex]: {
                ...prev[periodoIndex],
                [field]: value
            }
        }));
        setSavedSuccess(false);
    };

    const handleSaveAll = async () => {
        if (!selectedEstudiante) return;
        setSaving(true);
        try {
            const promises = PERIODOS.map((periodo, idx) => {
                const obs = observaciones[idx];
                // Only save if content exists or we want to overwrite empty? 
                // Saving whatever is in the state ensures sync.
                return saveObservacion({
                    id_estudiante: selectedEstudiante.id,
                    periodo_evaluacion: periodo,
                    cualidades_destacar: obs.cualidades_destacar,
                    necesita_apoyo: obs.necesita_apoyo
                });
            });

            await Promise.all(promises);
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 3000);
        } catch (error) {
            console.error("Error saving observations:", error);
            alert("Error al guardar cambios");
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        if (viewState === 'edit') {
            setViewState('students');
            setSelectedEstudiante(null);
        } else if (viewState === 'students') {
            setViewState('courses');
            setSelectedCurso(null);
            setEstudiantes([]);
        }
    };

    const getNextStudentId = () => {
        if (!selectedEstudiante || estudiantes.length === 0) return null;
        const currentIndex = estudiantes.findIndex(e => e.id === selectedEstudiante.id);
        if (currentIndex === -1 || currentIndex === estudiantes.length - 1) return null;
        return estudiantes[currentIndex + 1];
    };

    const handleNextStudent = () => {
        const nextStudent = getNextStudentId();
        if (nextStudent) {
            handleSelectEstudiante(nextStudent);
        }
    };

    // --- RENDERERS ---

    const renderCourses = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.map(curso => (
                <div
                    key={curso.id}
                    onClick={() => handleSelectCurso(curso)}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                            <BookOpen className="w-6 h-6 text-indigo-600" />
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-600">
                            {curso.anio_escolar || 'N/A'}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{curso.nombre_curso}</h3>
                    <p className="text-sm text-gray-500 mb-4">{curso.seccion ? `Sección ${curso.seccion}` : 'Sin sección'}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 border-t pt-3">
                        <User className="w-4 h-4" />
                        <span>{curso.maestro_nombre || 'Sin maestro asignado'}</span>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderStudents = () => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-700">Estudiantes de {selectedCurso?.nombre_curso}</h3>
                <span className="text-sm text-gray-500">{estudiantes.length} estudiantes</span>
            </div>
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {estudiantes.map(est => (
                    <div
                        key={est.id}
                        onClick={() => handleSelectEstudiante(est)}
                        className="p-4 hover:bg-indigo-50 cursor-pointer flex justify-between items-center group transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs">
                                {est.nombre.charAt(0)}{est.apellido.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{est.nombre} {est.apellido}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                    </div>
                ))}
            </div>
        </div>
    );

    const renderEdit = () => (
        <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex justify-between items-center sticky top-4 z-10 shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-indigo-900">{selectedEstudiante?.nombre} {selectedEstudiante?.apellido}</h3>
                    <p className="text-sm text-indigo-700">{selectedCurso?.nombre_curso} - Revisión de Observaciones</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSaveAll}
                        disabled={saving}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50"
                    >
                        {saving ? (
                            <span className="animate-spin">⌛</span>
                        ) : savedSuccess ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {savedSuccess ? 'Guardado' : 'Guardar Cambios'}
                    </button>
                    {getNextStudentId() && (
                        <button
                            onClick={handleNextStudent}
                            className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
                            title="Siguiente Estudiante"
                        >
                            <span>Siguiente</span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {PERIODOS.map((periodo, idx) => (
                    <div key={periodo} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center gap-2">
                            <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
                            <h4 className="font-bold text-gray-800">{periodo}</h4>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                    Cualidades a Destacar
                                </label>
                                <textarea
                                    value={observaciones[idx]?.cualidades_destacar || ''}
                                    onChange={(e) => handleObservacionChange(idx, 'cualidades_destacar', e.target.value)}
                                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm leading-relaxed resize-y"
                                    placeholder="Escriba aquí..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                    Necesita Apoyo En
                                </label>
                                <textarea
                                    value={observaciones[idx]?.necesita_apoyo || ''}
                                    onChange={(e) => handleObservacionChange(idx, 'necesita_apoyo', e.target.value)}
                                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm leading-relaxed resize-y"
                                    placeholder="Escriba aquí..."
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto pb-12">
                <div className="mb-8 flex items-center gap-4">
                    {viewState !== 'courses' && (
                        <button
                            onClick={handleBack}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            title="Volver"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </button>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Supervisión de Observaciones</h1>
                        <p className="text-gray-500 mt-1">
                            {viewState === 'courses' && 'Selecciona un curso para comenzar la revisión'}
                            {viewState === 'students' && 'Selecciona un estudiante para revisar sus observaciones'}
                            {viewState === 'edit' && 'Edita y corrige las observaciones del estudiante'}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <>
                        {viewState === 'courses' && renderCourses()}
                        {viewState === 'students' && renderStudents()}
                        {viewState === 'edit' && renderEdit()}
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
