import { useAuth } from "@/react-app/contexts/AuthContext";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState, useRef } from "react";
import { LogOut, ArrowLeft, ChevronLeft, ChevronRight, FileText, Edit2, MessageSquare } from "lucide-react";

interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string | null;
  nivel_parvulo: string | null;
}

interface Curso {
  id: number;
  nombre_curso: string;
  seccion: string | null;
}

interface Indicador {
  id: number;
  descripcion: string;
  id_categoria: number | null;
  nombre_categoria: string | null;
  tipo_evaluacion: string | null;
  orden: number;
}

interface EvaluacionData {
  [periodoIndex: number]: {
    [indicadorId: number]: string | null; // "Adquirido" | "En Proceso" | "Iniciado" | null
  };
}

interface VisualMarksData {
  [periodoIndex: number]: {
    [indicadorId: number]: boolean; // true if should show "Adquirido" mark visually
  };
}

interface ObservacionData {
  cualidades_destacar: string;
  necesita_apoyo: string;
}

const PERIODOS = ["1er Período", "2do Período", "3er Período"];
const NIVEL_LABELS: Record<string, string> = {
  "Adquirido": "L",
  "En Proceso": "P",
  "Iniciado": "I"
};
const NIVEL_COLORS: Record<string, string> = {
  "Adquirido": "bg-green-500 border-green-600 text-white",
  "En Proceso": "bg-yellow-400 border-yellow-500 text-gray-900",
  "Iniciado": "bg-red-500 border-red-600 text-white"
};



const PARVULO_II_INDICATORS: Record<string, string> = {
  // Relaciones Socioafectivas
  "Reconoce objetos y espacios habituales.": "Reconoce objetos y espacios habituales.",
  "Usa normas sociales en interacciones (si se solicita).": "Usa normas sociales en interacciones.",
  "Expresa sentimientos y afectos hacia otros.": "Expresa sentimientos y afectos hacia otros.",
  "Juega explorando el ambiente con seguridad.": "Juega explorando el ambiente con seguridad.",
  "Decide qué actividad le gusta o no realizar.": "Decide qué actividad le gusta o no realizar.",
  "Se identifica a sí mismo y a otros en fotos/imágenes.": "Se identifica a sí mismo y a otros en fotos/imágenes.",
  "Responde y expresa su nombre.": "Responde y expresa su nombre.",
  "Tolera que otros usen juguetes u objetos comunes.": "Tolera que otros usen juguetes u objetos comunes.",

  // Lenguaje Parte I
  "Reconoce objetos/personas al ser nombrados.": "Reconoce objetos/personas al ser nombrados.",
  "Sigue instrucciones simples de rutina.": "Sigue instrucciones simples de rutina.",
  "Responde preguntas simples.": "Responde preguntas simples.",

  // Lenguaje Parte II
  "Imita sonidos/movimientos de cuentos y canciones.": "Imita sonidos/movimientos de cuentos y canciones.",
  "Expresa necesidades con palabras/gestos/frases.": "Expresa necesidades con palabras/gestos/frases.",
  "Nombra objetos y acciones mientras juega.": "Nombra objetos y acciones mientras juega.",
  "Elige e imita leer libros ilustrados.": "Elige e imita leer libros ilustrados.",
  "Formula preguntas al explorar libros.": "Formula preguntas al explorar libros.",

  // Descubrimiento
  "Controla su cuerpo al pararse sin apoyo.": "Controla su cuerpo al pararse sin apoyo.",
  "Manipula objetos para producir sonidos (ritmo).": "Manipula objetos para producir sonidos (ritmo).",
  "Usa manos para orientar pelotas/objetos.": "Usa manos para orientar pelotas/objetos.",
  "Coordina ojo-pie/ojo-mano (patear, atrapar).": "Coordina ojo-pie/ojo-mano (patear, atrapar).",
  "Expresa ideas gráficamente (garabateo).": "Expresa ideas gráficamente (garabateo).",
  "Realiza juegos de arrastre, empuje y golpeo.": "Realiza juegos de arrastre, empuje y golpeo."
};

const normalizeString = (str: string) => {
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") // remove punctuation
    .replace(/\s+/g, " ") // collapse whitespace
    .trim();
};

export default function EvaluateStudent() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { id: cursoId, estudianteId } = useParams();

  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [currentEstudianteIndex, setCurrentEstudianteIndex] = useState(0);
  const [curso, setCurso] = useState<Curso | null>(null);
  const [indicadores, setIndicadores] = useState<Indicador[]>([]);
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionData>({});
  const [visualMarks, setVisualMarks] = useState<VisualMarksData>({}); // Visual-only marks for future periods
  const [observaciones, setObservaciones] = useState<Record<number, ObservacionData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPeriodoFilter, setSelectedPeriodoFilter] = useState(PERIODOS[0]);
  const observacionesRef = useRef<HTMLDivElement>(null);

  const currentEstudiante = estudiantes[currentEstudianteIndex];
  const selectedPeriodoIndex = PERIODOS.indexOf(selectedPeriodoFilter);

  const scrollToObservaciones = () => {
    observacionesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    fetchInitialData();
  }, [cursoId]);

  useEffect(() => {
    if (currentEstudiante) {
      fetchIndicadoresForStudent();
      fetchEvaluaciones();
      fetchObservaciones();
    }
  }, [currentEstudiante]);

  const fetchIndicadoresForStudent = async () => {
    if (!currentEstudiante || !curso) return;

    try {
      // For Párvulo I, use student-specific level; otherwise use course name
      let searchPattern = curso.nombre_curso;
      if (["Párvulo I", "Parvulo I", "Párvulo 1", "Parvulo 1"].includes(curso.nombre_curso) && currentEstudiante.nivel_parvulo) {
        searchPattern = currentEstudiante.nivel_parvulo;
      }

      const indicadoresResponse = await fetch(
        `/api/teacher/estudiantes/${currentEstudiante.id}/indicadores?curso=${encodeURIComponent(searchPattern)}`,
        { credentials: "include" }
      );

      if (indicadoresResponse.ok) {
        const data = await indicadoresResponse.json();
        let sortedData = Array.isArray(data) ? data.sort((a: any, b: any) => a.orden - b.orden) : [];

        // Apply strict filtering and categorization for Párvulo I
        if (["Párvulo I", "Parvulo I", "Párvulo 1", "Parvulo 1"].includes(curso.nombre_curso)) {
          // Define buckets
          const relacionesList = [
            // Etapa 1
            "Expresa necesidades y sentimientos (llanto, gestos).",
            "Muestra agrado ante demostraciones de afecto.",
            "Imita reacciones que ve en sus cuidadores.",
            "Explora su entorno cercano con apoyo.",
            "Reacciona al escuchar su nombre.",
            // Etapa 2
            "Expresa sentimientos/necesidades con vocalizaciones.",
            "Reacciona ante afecto de familiares y extraños.",
            "Demuestra apego y se separa por corto tiempo.",
            "Participa en higiene y alimentación.",
            "Reconoce su imagen en diferentes representaciones.",
            "Reconoce por su nombre a miembros de su familia.",
            "Explora por sí solo y reconoce objetos.",
            "Imita normas sociales en interacciones."
          ];

          const lenguajeList = [
            // Etapa 1
            "Presta atención a la interacción comunicativa.",
            "Crea significados a partir de la narración del adulto.",
            "Expresa necesidades con gestos globales y contacto visual.",
            "Observa con interés objetos e imágenes.",
            // Etapa 2
            "Imita gestos/expresiones para necesidades.",
            "Usa espontáneamente gestos con pares/adultos.",
            "Comprende informaciones durante la conversación.",
            "Interactúa con libros e imágenes literarias."
          ];

          const descubrimientoList = [
            // Etapa 1
            "Sostiene la cabeza y busca sonidos.",
            "Percibe partes de su cuerpo mediante masajes.",
            "Juega con manos y pies usando juguetes.",
            "Manifiesta emociones espontáneamente (movimientos).",
            "Realiza expresiones faciales ante situaciones.",
            "Empuja su cuerpo con las piernas.",
            "Gira su cuerpo 360 grados (abdomen).",
            "Arrastra su cuerpo (patrón cruzado).",
            "Alcanza objetos boca abajo impulsándose.",
            "Balancea su cuerpo de derecha a izquierda.",
            "Desplaza su cuerpo gateando/arrastrándose.",
            "Manifiesta alegría al verse en espejo.",
            // Etapa 2
            "Se pone de pie con apoyo.",
            "Mantiene el equilibrio de sentado a parado.",
            "Toca partes de su cuerpo imitando al adulto.",
            "Imita movimientos sencillos de manos/brazos.",
            "Desplaza su cuerpo gateando.",
            "Gira su cuerpo rodando.",
            "Arrastra su cuerpo reptando.",
            "Alcanza objetos impulsándose.",
            "Interactúa con juguetes y objetos cotidianos.",
            "Entra y saca objetos de una caja.",
            "Aprieta y suelta objetos blandos."
          ];

          // Helper to check if indicator matches a list of strings
          const isInList = (ind: any, list: string[]) => {
            const descNorm = normalizeString(ind.descripcion);
            return list.some(item => {
              const itemNorm = normalizeString(item);
              return descNorm === itemNorm || descNorm.includes(itemNorm) || itemNorm.includes(descNorm);
            });
          };

          // Categorize indicators
          const relaciones = sortedData
            .filter((ind: any) => isInList(ind, relacionesList))
            .map((ind: any) => ({ ...ind, nombre_categoria: "RELACIONES SOCIOAFECTIVAS" }));

          const lenguaje = sortedData
            .filter((ind: any) => isInList(ind, lenguajeList))
            .map((ind: any) => ({ ...ind, nombre_categoria: "LENGUAJE E INTERACCIÓN" }));

          const descubrimiento = sortedData
            .filter((ind: any) => isInList(ind, descubrimientoList))
            .map((ind: any) => ({ ...ind, nombre_categoria: "DESCUBRIMIENTO DEL CUERPO Y ENTORNO" }));

          // Find any indicators that didn't match any list
          const categorizedIds = new Set([
            ...relaciones.map((i: any) => i.id),
            ...lenguaje.map((i: any) => i.id),
            ...descubrimiento.map((i: any) => i.id)
          ]);

          const others = sortedData.filter((ind: any) => !categorizedIds.has(ind.id));

          // Sort
          const sortFn = (a: any, b: any) => a.orden - b.orden;
          relaciones.sort(sortFn);
          lenguaje.sort(sortFn);
          descubrimiento.sort(sortFn);
          others.sort(sortFn);

          sortedData = [...relaciones, ...lenguaje, ...descubrimiento, ...others];
        }

        // Apply strict filtering and categorization for Párvulo II
        if (curso.nombre_curso === "Párvulo II" || curso.nombre_curso === "Parvulo II") {
          // Filter indicators to ONLY include those in the whitelist (using strict normalized matching)
          const validIndicators = sortedData.filter((ind: any) => {
            const currentDescNorm = normalizeString(ind.descripcion);

            const matchesValue = Object.values(PARVULO_II_INDICATORS).some(val =>
              normalizeString(val) === currentDescNorm
            );
            if (matchesValue) return true;

            const matchesKey = Object.keys(PARVULO_II_INDICATORS).some(key =>
              normalizeString(key) === currentDescNorm
            );
            return matchesKey;
          });

          // Define exact lists for each section
          const relacionesList = [
            "Reconoce objetos y espacios habituales.",
            "Usa normas sociales en interacciones (si se solicita).",
            "Usa normas sociales en interacciones.",
            "Expresa sentimientos y afectos hacia otros.",
            "Juega explorando el ambiente con seguridad.",
            "Decide qué actividad le gusta o no realizar.",
            "Se identifica a sí mismo y a otros en fotos/imágenes.",
            "Responde y expresa su nombre.",
            "Tolera que otros usen juguetes u objetos comunes."
          ];

          const lenguaje1List = [
            "Reconoce objetos/personas al ser nombrados.",
            "Sigue instrucciones simples de rutina.",
            "Responde preguntas simples."
          ];

          const lenguaje2List = [
            "Imita sonidos/movimientos de cuentos y canciones.",
            "Expresa necesidades con palabras/gestos/frases.",
            "Nombra objetos y acciones mientras juega.",
            "Elige e imita leer libros ilustrados.",
            "Formula preguntas al explorar libros."
          ];

          const descubrimientoList = [
            "Controla su cuerpo al pararse sin apoyo.",
            "Manipula objetos para producir sonidos (ritmo).",
            "Usa manos para orientar pelotas/objetos.",
            "Coordina ojo-pie/ojo-mano (patear, atrapar).",
            "Expresa ideas gráficamente (garabateo).",
            "Realiza juegos de arrastre, empuje y golpeo."
          ];

          // Helper to check if indicator belongs to a list
          const isInList = (ind: any, list: string[]) => {
            const descNorm = normalizeString(ind.descripcion);
            return list.some(item => {
              const itemNorm = normalizeString(item);
              return descNorm === itemNorm || descNorm.includes(itemNorm) || itemNorm.includes(descNorm);
            });
          };

          // Distribute valid indicators into buckets
          const relacionesSocioafectivas = validIndicators
            .filter((ind: any) => isInList(ind, relacionesList))
            .map((ind: any) => ({ ...ind, nombre_categoria: "RELACIONES SOCIOAFECTIVAS E IDENTIDAD" }));

          const lenguajeParte1 = validIndicators
            .filter((ind: any) => isInList(ind, lenguaje1List))
            .map((ind: any) => ({ ...ind, nombre_categoria: "LENGUAJE E INTERACCIÓN (Parte I)" }));

          const lenguajeParte2 = validIndicators
            .filter((ind: any) => isInList(ind, lenguaje2List))
            .map((ind: any) => ({ ...ind, nombre_categoria: "LENGUAJE E INTERACCIÓN (Parte II)" }));

          const descubrimientoEntorno = validIndicators
            .filter((ind: any) => isInList(ind, descubrimientoList))
            .map((ind: any) => ({ ...ind, nombre_categoria: "DESCUBRIMIENTO DEL CUERPO Y ENTORNO" }));

          // Sort each bucket
          const sortFn = (a: any, b: any) => a.orden - b.orden;
          relacionesSocioafectivas.sort(sortFn);
          descubrimientoEntorno.sort(sortFn);

          // Explicit sort for Lenguaje 1 and 2
          const sortByList = (list: string[]) => (a: any, b: any) => {
            const idxA = list.findIndex(l => normalizeString(l) === normalizeString(a.descripcion));
            const idxB = list.findIndex(l => normalizeString(l) === normalizeString(b.descripcion));
            return idxA - idxB;
          };
          lenguajeParte1.sort(sortByList(lenguaje1List));
          lenguajeParte2.sort(sortByList(lenguaje2List));

          // Combine all indicators in the correct order
          sortedData = [
            ...relacionesSocioafectivas,
            ...lenguajeParte1,
            ...lenguajeParte2,
            ...descubrimientoEntorno
          ];
        }

        setIndicadores(sortedData);
      }
    } catch (error) {
      console.error("Error fetching indicators for student:", error);
    }
  };

  const fetchInitialData = async () => {
    try {
      // Fetch course info
      const cursosResponse = await fetch("/api/teacher/cursos", {
        credentials: "include",
      });
      if (cursosResponse.ok) {
        const cursos = await cursosResponse.json();
        const cursoActual = cursos.find((c: Curso) => c.id === Number(cursoId));
        if (cursoActual) {
          setCurso(cursoActual);
        }
      }

      // Fetch all students in this course
      const estudiantesResponse = await fetch(`/api/teacher/cursos/${cursoId}/estudiantes`, {
        credentials: "include",
      });
      if (estudiantesResponse.ok) {
        const estudiantesData = await estudiantesResponse.json();
        setEstudiantes(Array.isArray(estudiantesData) ? estudiantesData : []);

        // Find current student index
        if (estudianteId) {
          const index = estudiantesData.findIndex((e: Estudiante) => e.id === Number(estudianteId));
          if (index !== -1) {
            setCurrentEstudianteIndex(index);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvaluaciones = async () => {
    if (!currentEstudiante) return;

    try {
      // Fetch evaluations for all periods
      const promises = PERIODOS.map((periodo) =>
        fetch(
          `/api/teacher/estudiantes/${currentEstudiante.id}/evaluaciones?periodo=${encodeURIComponent(periodo)}`,
          { credentials: "include" }
        ).then(res => res.ok ? res.json() : {})
      );

      const results = await Promise.all(promises);

      const evaluacionesData: EvaluacionData = {};
      results.forEach((evaluacionesMap, periodoIndex) => {
        evaluacionesData[periodoIndex] = evaluacionesMap || {};
      });

      setEvaluaciones(evaluacionesData);

      // Calculate visual marks for future periods based on "Adquirido" evaluations
      const visualMarksData: VisualMarksData = {};

      // For each indicator, if it's marked "Adquirido" in a period, show it visually in future periods
      indicadores.forEach((ind) => {
        let foundAdquirido = false;
        for (let pIdx = 0; pIdx < PERIODOS.length; pIdx++) {
          if (!visualMarksData[pIdx]) {
            visualMarksData[pIdx] = {};
          }

          if (evaluacionesData[pIdx]?.[ind.id] === "Adquirido") {
            foundAdquirido = true;
          }

          // Mark visually in future periods if already acquired
          if (foundAdquirido && pIdx > 0 && !evaluacionesData[pIdx]?.[ind.id]) {
            visualMarksData[pIdx][ind.id] = true;
          }
        }
      });

      setVisualMarks(visualMarksData);
    } catch (error) {
      console.error("Error fetching evaluaciones:", error);
    }
  };

  const fetchObservaciones = async () => {
    if (!currentEstudiante) return;

    try {
      const response = await fetch(
        `/api/teacher/estudiantes/${currentEstudiante.id}/observaciones`,
        { credentials: "include" }
      );

      if (response.ok) {
        const data = await response.json();
        const observacionesData: Record<number, ObservacionData> = {};

        data.forEach((obs: any) => {
          const periodoIndex = PERIODOS.indexOf(obs.periodo_evaluacion);
          if (periodoIndex !== -1) {
            observacionesData[periodoIndex] = {
              cualidades_destacar: obs.cualidades_destacar || "",
              necesita_apoyo: obs.necesita_apoyo || ""
            };
          }
        });

        setObservaciones(observacionesData);
      }
    } catch (error) {
      console.error("Error fetching observaciones:", error);
    }
  };

  const handleNivelClick = async (indicadorId: number, periodoIndex: number, nivel: string) => {
    if (!currentEstudiante) return;

    // Only allow clicking for the selected period
    if (periodoIndex !== selectedPeriodoIndex) return;

    const currentValue = evaluaciones[periodoIndex]?.[indicadorId];
    const newValue = currentValue === nivel ? null : nivel;

    // Update local state for the current period only
    setEvaluaciones(prev => ({
      ...prev,
      [periodoIndex]: {
        ...prev[periodoIndex],
        [indicadorId]: newValue
      }
    }));

    // Update visual marks for future periods if marking as "Adquirido"
    if (nivel === "Adquirido" && newValue === "Adquirido") {
      setVisualMarks(prev => {
        const updated = { ...prev };
        // Show visual mark in all future periods
        for (let futureIdx = periodoIndex + 1; futureIdx < PERIODOS.length; futureIdx++) {
          if (!updated[futureIdx]) {
            updated[futureIdx] = {};
          }
          updated[futureIdx][indicadorId] = true;
        }
        return updated;
      });
    } else if (newValue === null || nivel === "Adquirido") {
      // Remove visual marks from future periods when unmarking or changing from Adquirido
      setVisualMarks(prev => {
        const updated = { ...prev };
        for (let futureIdx = periodoIndex + 1; futureIdx < PERIODOS.length; futureIdx++) {
          if (updated[futureIdx]) {
            delete updated[futureIdx][indicadorId];
          }
        }
        return updated;
      });
    }

    // Save to backend - ONLY for the current period
    setSaving(true);
    try {
      await fetch("/api/teacher/evaluaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id_estudiante: currentEstudiante.id,
          id_indicador: indicadorId,
          periodo_evaluacion: PERIODOS[periodoIndex],
          valor_evaluacion: newValue,
          comentario: null,
        }),
      });
    } catch (error) {
      console.error("Error saving evaluation:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleObservacionChange = (periodoIndex: number, field: 'cualidades_destacar' | 'necesita_apoyo', value: string) => {
    setObservaciones(prev => ({
      ...prev,
      [periodoIndex]: {
        ...(prev[periodoIndex] || { cualidades_destacar: "", necesita_apoyo: "" }),
        [field]: value
      }
    }));
  };

  const handleSaveObservacion = async (periodoIndex: number) => {
    if (!currentEstudiante) return;

    const obs = observaciones[periodoIndex] || { cualidades_destacar: "", necesita_apoyo: "" };

    setSaving(true);
    try {
      await fetch("/api/teacher/observaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id_estudiante: currentEstudiante.id,
          periodo_evaluacion: PERIODOS[periodoIndex],
          cualidades_destacar: obs.cualidades_destacar,
          necesita_apoyo: obs.necesita_apoyo,
        }),
      });
    } catch (error) {
      console.error("Error saving observacion:", error);
    } finally {
      setSaving(false);
    }
  };

  const goToPreviousStudent = () => {
    if (currentEstudianteIndex > 0) {
      const newIndex = currentEstudianteIndex - 1;
      setCurrentEstudianteIndex(newIndex);
      navigate(`/teacher/cursos/${cursoId}/estudiantes/${estudiantes[newIndex].id}/evaluar`);
    }
  };

  const goToNextStudent = () => {
    if (currentEstudianteIndex < estudiantes.length - 1) {
      const newIndex = currentEstudianteIndex + 1;
      setCurrentEstudianteIndex(newIndex);
      navigate(`/teacher/cursos/${cursoId}/estudiantes/${estudiantes[newIndex].id}/evaluar`);
    }
  };

  const handleEstudianteChange = (estudianteId: string) => {
    const index = estudiantes.findIndex(e => e.id === Number(estudianteId));
    if (index !== -1) {
      setCurrentEstudianteIndex(index);
      navigate(`/teacher/cursos/${cursoId}/estudiantes/${estudianteId}/evaluar`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Group indicators by category, preserving order
  const groupedIndicadores = indicadores.reduce((acc, ind) => {
    const categoria = ind.nombre_categoria || "Sin categoría";
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(ind);
    return acc;
  }, {} as Record<string, Indicador[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (!currentEstudiante || !curso) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Datos no encontrados</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
        <button
          onClick={() => navigate(`/teacher/cursos/${cursoId}`)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al curso
        </button>

        {/* Student Navigation Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPreviousStudent}
              disabled={currentEstudianteIndex === 0}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            <div className="text-center flex-1">
              <p className="text-sm text-gray-500 mb-1">Evaluando a:</p>
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-3xl font-bold text-indigo-600 uppercase">
                  {currentEstudiante.nombre} {currentEstudiante.apellido}
                </h2>
                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <Edit2 className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="mt-2">
                <select
                  value={currentEstudiante.id}
                  onChange={(e) => handleEstudianteChange(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {estudiantes.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.nombre} {est.apellido}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={goToNextStudent}
              disabled={currentEstudianteIndex === estudiantes.length - 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Filters and Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">📝 Período a evaluar:</span>
              <select
                value={selectedPeriodoFilter}
                onChange={(e) => setSelectedPeriodoFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {PERIODOS.map((periodo) => (
                  <option key={periodo} value={periodo}>
                    {periodo}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={scrollToObservaciones}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all shadow-md"
                title="Ir a observaciones"
              >
                <MessageSquare className="w-5 h-5" />
                Observaciones
              </button>
              <button
                onClick={() => navigate(`/teacher/cursos/${cursoId}/estudiantes/${estudianteId}/boletin`)}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all shadow-md"
              >
                <FileText className="w-5 h-5" />
                Generar Boletín
              </button>
            </div>
          </div>
        </div>

        {/* Evaluation Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider" style={{ width: '40%' }}>
                    Indicadores de Logro
                  </th>
                  {PERIODOS.map((periodo, idx) => (
                    <th
                      key={periodo}
                      className={`px-4 py-4 text-center text-sm font-semibold uppercase tracking-wider ${idx === selectedPeriodoIndex
                        ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-500'
                        : 'text-gray-500'
                        }`}
                      style={{ width: '20%' }}
                    >
                      {periodo.replace(" Período", "")}
                      {idx === selectedPeriodoIndex && <div className="text-xs font-normal mt-1">(Evaluando)</div>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedIndicadores).map(([categoria, inds]) => (
                  <>
                    <tr key={`cat-${categoria}`} className="bg-blue-50">
                      <td colSpan={2} className="px-6 py-3">
                        <h3 className="text-base font-bold text-blue-900">{categoria}</h3>
                      </td>
                    </tr>
                    {inds.map((indicador) => (
                      <tr key={indicador.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {indicador.descripcion}
                        </td>
                        {PERIODOS.map((periodo, periodoIndex) => {
                          const isCurrentPeriod = periodoIndex === selectedPeriodoIndex;
                          const hasVisualMark = visualMarks[periodoIndex]?.[indicador.id] === true;

                          return (
                            <td key={periodo} className={`px-4 py-4 ${isCurrentPeriod ? 'bg-indigo-50' : ''}`}>
                              <div className="flex items-center justify-center gap-2">
                                {["Adquirido", "En Proceso", "Iniciado"].map((nivel) => {
                                  const isSelected = evaluaciones[periodoIndex]?.[indicador.id] === nivel;
                                  // Show visual mark for "Adquirido" in future periods
                                  const showVisualMark = !isSelected && hasVisualMark && nivel === "Adquirido";
                                  const label = NIVEL_LABELS[nivel];

                                  let colorClass = "bg-white border-gray-300 text-gray-600";
                                  if (isSelected) {
                                    colorClass = NIVEL_COLORS[nivel];
                                  } else if (showVisualMark) {
                                    // Visual-only mark: lighter green with dashed border
                                    colorClass = "bg-green-100 border-green-300 text-green-600 border-dashed";
                                  }

                                  return (
                                    <button
                                      key={nivel}
                                      onClick={() => handleNivelClick(indicador.id, periodoIndex, nivel)}
                                      disabled={!isCurrentPeriod}
                                      className={`w-9 h-9 rounded-lg border-2 font-bold text-xs transition-all ${isCurrentPeriod ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed opacity-60'
                                        } ${colorClass} ${isSelected ? 'shadow-md' : isCurrentPeriod ? 'hover:border-gray-400' : ''}`}
                                      title={`${nivel}${showVisualMark ? ' (Marcado visualmente - ya adquirido)' : ''}${!isCurrentPeriod ? ' (Solo lectura)' : ''}`}
                                    >
                                      {label}
                                    </button>
                                  );
                                })}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Observations Section */}
        <div ref={observacionesRef} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Observaciones - Todos los Períodos
            </h3>
          </div>

          <div className="space-y-6">
            {PERIODOS.map((periodo, periodoIndex) => {
              const obs = observaciones[periodoIndex] || { cualidades_destacar: "", necesita_apoyo: "" };
              return (
                <div key={periodo} className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                  <h4 className="text-lg font-bold text-indigo-700 mb-4 pb-2 border-b border-indigo-200">
                    {periodo}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cualidades a destacar:
                      </label>
                      <textarea
                        value={obs.cualidades_destacar}
                        onChange={(e) => handleObservacionChange(periodoIndex, 'cualidades_destacar', e.target.value)}
                        onBlur={() => handleSaveObservacion(periodoIndex)}
                        placeholder="Escriba las cualidades positivas observadas en este período..."
                        className="w-full h-28 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Necesita apoyo en:
                      </label>
                      <textarea
                        value={obs.necesita_apoyo}
                        onChange={(e) => handleObservacionChange(periodoIndex, 'necesita_apoyo', e.target.value)}
                        onBlur={() => handleSaveObservacion(periodoIndex)}
                        placeholder="Escriba los aspectos que necesitan apoyo adicional..."
                        className="w-full h-28 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-white"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-gray-500 mt-4 italic">
            Los cambios se guardan automáticamente al hacer clic fuera del campo de texto.
          </p>
        </div>

        {saving && (
          <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg">
            Guardando...
          </div>
        )}
      </main>
    </div>
  );
}
