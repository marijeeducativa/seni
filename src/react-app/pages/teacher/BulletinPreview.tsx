import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Printer } from "lucide-react";

interface BulletinData {
  estudiante: {
    id: number;
    nombre: string;
    apellido: string;
    fecha_nacimiento: string | null;
    genero: string | null;
    grado_nivel: string | null;
    nivel_parvulo: string | null;
    nombre_tutor: string | null;
    curso: string;
    seccion: string | null;
    anio_escolar: string | null;
  };
  maestro: {
    nombre: string;
    apellido: string;
  };
  config: {
    nombre_centro?: string;
    codigo_centro?: string;
    direccion?: string;
    regional?: string;
    distrito?: string;
    logo_minerd_url?: string;
    logo_centro_url?: string;
    director_nombre?: string;
    anio_escolar_actual?: string;
  };
  indicadores: Array<{
    id: number;
    descripcion: string;
    nombre_categoria: string | null;
    orden: number;
  }>;
  evaluaciones: Record<string, Record<number, string>>;
  observaciones: Record<string, {
    cualidades_destacar: string;
    necesita_apoyo: string;
  }>;
}

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
  "Realiza juegos de arrastre, empuje y golpeo.": "Realiza juegos de arrastre, empuje y golpeo.",
};

export default function BulletinPreview() {
  const { id: cursoId, estudianteId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<BulletinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBulletinData();
  }, [estudianteId]);

  const fetchBulletinData = async () => {
    try {
      const response = await fetch(`/api/teacher/estudiantes/${estudianteId}/boletin`, {
        credentials: "include",
      });
      if (response.ok) {
        const bulletinData = await response.json();
        setData(bulletinData);
      } else {
        const err = await response.json();
        setError(err.error || "Error al cargar datos");
      }
    } catch (error: any) {
      console.error("Error fetching bulletin data:", error);
      setError(error.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getAge = (fechaNacimiento: string | null) => {
    if (!fechaNacimiento) return null;
    const birth = new Date(fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const normalizeString = (str: string) => {
    return str.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") // remove punctuation
      .replace(/\s+/g, " ") // collapse whitespace
      .trim();
  };

  const getAgeRangeForGrade = (currentCourse: string, nivelParvulo?: string | null) => {
    if (currentCourse === "Párvulo I" && nivelParvulo) {
      if (nivelParvulo.includes("Nivel 1")) {
        return "45 días a 6 meses";
      } else if (nivelParvulo.includes("Nivel 2")) {
        return "6 meses a 1 año";
      }
    }

    const ageRanges: Record<string, string> = {
      "Párvulo I": "45 días a 1 año",
      "Párvulo II": "1 a 2 años",
      "Párvulo III": "2 a 3 años",
      "Prekinder": "3 a 4 años",
      "Kinder": "4 a 5 años",
      "Preprimario": "5 a 6 años"
    };
    return ageRanges[currentCourse] || "N/A";
  };

  const getNextGrade = (currentCourse: string) => {
    const gradeMap: Record<string, string> = {
      "Párvulo I": "Párvulo II",
      "Párvulo II": "Párvulo III",
      "Párvulo III": "Prekinder",
      "Prekinder": "Kinder",
      "Kinder": "Preprimario",
      "Preprimario": "Primero (1ro)"
    };
    return gradeMap[currentCourse] || "N/A";
  };



  // Summarize indicator descriptions for Párvulo II, Kinder, Prekinder and Preprimario to fit in 1-2 lines
  const summarizeIndicator = (desc: string, curso: string): string => {


    if (curso !== "Párvulo II" && curso !== "Kinder" && curso !== "Preprimario") return desc;

    // Párvulo II summaries for long indicators
    if (curso === "Párvulo II") {
      const normalizedDesc = normalizeString(desc);
      // Find matching key in PARVULO_II_INDICATORS
      const matchKey = Object.keys(PARVULO_II_INDICATORS).find(key =>
        normalizeString(key) === normalizedDesc ||
        normalizeString(key).includes(normalizedDesc) ||
        normalizedDesc.includes(normalizeString(key))
      );

      if (matchKey) {
        return PARVULO_II_INDICATORS[matchKey];
      }
      return desc;
    }

    // Custom summaries for Kinder and Preprimario indicators that maintain meaning but are more concise
    const summaries: Record<string, string> = {
      // Kinder specific summaries (original ones, now Prekinder uses its own map)
      "Expresa sus sentimientos, emociones e ideas de forma gráfica o escrita, al escuchar narraciones, mensajes, cuentos, canciones, poesías leídas por otras personas, de manera no convencional.": "Expresa sentimientos gráficamente al escuchar narraciones.",
      "Sigue una secuencia en el uso de algunos textos orales, en situaciones cotidianas de comunicación al expresar sentimientos, gestos, emociones y movimientos corporales.": "Sigue secuencias en textos orales cotidianos.",
      "Usa diversas formas de expresión con intención de comunicar sus ideas, opiniones, emociones, sentimientos y experiencias.": "Usa diversas formas de expresión para comunicar ideas.",
      "Realiza producciones plásticas bidimensionales (dibujo) seleccionando y combinando colores primarios y secundarios al representar ideas reales o imaginarias.": "Crea dibujos combinando colores primarios y secundarios.",
      "Explora con su cuerpo sonidos y movimientos, de forma libre y siguiendo un ritmo.": "Explora sonidos y movimientos corporales con ritmo.",
      "Explora las posibilidades sonoras de su voz y de sonidos producidos al percutir, sacudir o frotar instrumentos musicales y objetos o materiales de su entorno.": "Explora sonidos con su voz e instrumentos musicales.",
      "Comprende e interpreta mensajes a partir de imágenes y símbolos, en textos sencillos y establece comparaciones progresivas en palabras que inician o terminan similar, a partir del sonido o la grafía.": "Interpreta imágenes y compara palabras por sonido/grafía.",
      "Produce textos orales y los expone en lenguaje no verbal (gestos, ademanes, postura…) y paraverbal (entonación, ritmo, pausa, intensidad…), de acuerdo a sus necesidades.": "Produce textos orales usando gestos y entonación.",
      "Comunica sus ideas, pensamientos, emociones y experiencias con la finalidad de que los demás puedan entender lo que pretende comunicar.": "Comunica sus ideas y emociones claramente.",
      "Utiliza técnicas y materiales en sus producciones para expresar sus emociones, sentimientos, ideas y experiencias.": "Usa técnicas y materiales para expresar emociones.",
      "Escucha y valora las opiniones de los demás.": "Escucha y valora las opiniones de los demás.",
      "Expresa ideas y sentimientos a través de imágenes sencillas creadas con masillas.": "Expresa ideas modelando con masilla.",
      "Usa frases sencillas organizadas en forma lógica, crítica y creativa en la descripción de situaciones cotidianas y objetos de su entorno inmediato, y a través de ilustraciones.": "Describe situaciones y objetos con frases sencillas.",
      "Describe situaciones problemáticas del entorno, ubicándolas de forma adecuada y creativa.": "Describe y ubica situaciones problemáticas del entorno.",
      "Identifica y comparte sus gustos y preferencias con respeto, cortesía expresiones muy breves y sencillas.": "Comparte sus gustos y preferencias con respeto.",
      "Valora a sus compañeros respetando sus ideas y sentimientos.": "Valora y respeta las ideas de sus compañeros.",
      "Identifica al menos 3 o 4 elementos de la cultura dominicana.": "Identifica elementos de la cultura dominicana.",
      "Comprensión de la importancia del manejo adecuado de los desechos.": "Comprende la importancia del manejo de desechos.",
      "Usa diversas formas de los lenguajes de las artes y materiales de desecho con intención de comunicar sus ideas (reales o imaginarias), opiniones, emociones, sentimientos y experiencias.": "Usa artes y materiales reciclados para comunicar ideas.",
      "Explora y manipula títeres y objetos y los incorpora al juego o improvisaciones lúdicas.": "Incorpora títeres y objetos en sus juegos.",
      "Explora las posibilidades sonoras de su cuerpo, voz y de sonidos producidos al percutir, sacudir o frotar instrumentos musicales y objetos o materiales de su entorno.": "Explora sonidos con su cuerpo, voz e instrumentos.",
      "Entona canciones infantiles y las acompaña con instrumentos de percusión menor.": "Entona canciones acompañándose de instrumentos.",
      "Escucha con atención cuentos musicales, identificando los sonidos de voces e instrumentos.": "Identifica voces e instrumentos en cuentos musicales.",
      "Mueve su cuerpo de forma espontánea, con estímulos sonoros de origen diverso.": "Mueve su cuerpo espontáneamente ante sonidos.",
      "Reproduce patrones rítmicos sencillos con su cuerpo, su voz o instrumentos.": "Reproduce patrones rítmicos sencillos.",
      "Realiza movimientos en diferentes direcciones, posiciones y velocidades, según indicaciones.": "Realiza movimientos siguiendo indicaciones de dirección.",
      "Realiza movimientos en diferentes direcciones y velocidades, de forma libre y siguiendo un ritmo.": "Se mueve libremente en diferentes direcciones y ritmos.",
      "Realiza juegos de desplazamiento en el espacio, mostrando progresión en la estabilidad y equilibrio de su cuerpo según indicaciones derecha- izquierda.": "Se desplaza con equilibrio siguiendo derecha-izquierda.",
      "Ubica objetos y realiza movimientos según indicaciones derecha- izquierda, con relación a su cuerpo.": "Ubica objetos y se mueve según derecha-izquierda.",
      "Explora y manipula objetos y los incorpora al juego o improvisaciones lúdicas.": "Incorpora objetos en juegos e improvisaciones.",
      "Explora y manipula objetos y los incorpora al juego o improvisaciones lúdicas al representar situaciones reales o imaginarias.": "Usa objetos en juegos representando situaciones.",
      "Imita situaciones reales e imaginaria a partir canciones, juegos de rondas o cuentos cortos.": "Imita situaciones reales e imaginarias en juegos.",
      "Participa en juegos grupales reglados de reglas, aceptando procedimientos acordados en el grupo.": "Participa en juegos grupales aceptando las reglas.",
      "Realiza movimientos con algunas partes de su cuerpo de manera coordinada en el espacio parcial y total.": "Coordina movimientos corporales en el espacio.",
      "Realiza desplazamientos en el espacio mostrando estabilidad y equilibrio en sus movimientos.": "Se desplaza mostrando estabilidad y equilibrio.",
      "Experimenta con su cuerpo movimientos de estiramiento, relajación y descanso, al finalizar actividades físicas.": "Realiza estiramiento y relajación tras actividad física.",
      "Experimenta con su cuerpo movimientos de estiramiento, relajación y descanso, al iniciar y al finalizar actividades físicas.": "Practica estiramiento y relajación antes/después de actividad.",
      "Participa en actividades de higiene y cuidado personal, con apoyo del adulto.": "Participa en higiene personal con apoyo.",
      "Describe situaciones de su comunidad local a partir de observación, exploración y preguntas, con el apoyo de adultos.": "Describe situaciones de su comunidad con apoyo.",
      "Participa en proyectos sobre problemas sencillos que afectan su comunidad.": "Participa en proyectos sobre problemas comunitarios.",
      "Colabora en la búsqueda de información con ayuda del adulto, sobre temas de interés de su entorno inmediato natural y fenómenos naturales.": "Busca información sobre su entorno con ayuda.",
      "Cuestiona, observa y explora su entorno natural cercano con ayuda de otras personas.": "Observa y explora su entorno natural con ayuda.",
      "Usa utensilios, artefactos de su entorno o recursos tecnológicos, al realizar experimentos sencillos.": "Usa utensilios y recursos en experimentos sencillos.",
      "Registra los resultados de la exploración del entorno natural de forma oral, escrita o gráfica, de manera convencional o no.": "Registra resultados de su exploración del entorno.",
      "Identifica algunas semejanzas y diferencias entre seres vivos de su entorno.": "Identifica semejanzas y diferencias en seres vivos.",
      "Utiliza informaciones sobre personas, animales u objetos conocidos para apoyar sus explicaciones.": "Usa información conocida para apoyar explicaciones.",
      "Colabora y explica algunas medidas en actividades de protección y cuidado del entorno escolar, recursos, sus plantas y animales.": "Colabora en el cuidado del entorno escolar y natural.",
      "Ordena hechos sencillos de la realidad ocurridos en su entorno inmediato utilizando su imaginación.": "Ordena hechos sencillos de su entorno.",
      "Predice acontecimientos explicando lo ocurrido de acuerdo con su conocimiento y experiencias previas.": "Predice acontecimientos basado en experiencias previas.",
      "Asume progresivamente las reglas acordadas en algunos juegos.": "Asume progresivamente las reglas en juegos.",
      "Integra de manera espontánea objetos del entorno cercano a sus juegos simulando situaciones reales o imaginarias.": "Integra objetos a sus juegos simulando situaciones.",
      "Responde a preguntas sobre situaciones o actividades que se desarrollan en su contexto inmediato.": "Responde preguntas sobre su contexto inmediato.",
      "Expresa sus ideas sobre lo que observa y las actividades cotidianas que realiza.": "Expresa ideas sobre observaciones y actividades.",
      "Expresa a los demás sus acuerdos o desacuerdos ante situaciones o hechos cotidiano.": "Expresa acuerdos o desacuerdos ante situaciones.",
      "Participa en la búsqueda y selección de alternativas al solucionar situaciones cotidianas.": "Busca alternativas para solucionar situaciones.",
      "Colabora en la puesta en búsqueda de la solución acordada de problemas sencillos o situaciones cotidianas que afectan a sí mismo o al grupo.": "Colabora en la solución de problemas sencillos.",
      "Sigue una secuencia en el uso de textos orales que escucha, en situaciones cotidianas de comunicación.": "Sigue la secuencia de textos orales que escucha.",
      "Formula y responde a preguntas, al obtener informaciones sobre temas de su interés.": "Formula y responde preguntas sobre temas de interés.",
      "Asume progresivamente normas de comunicación establecidas.": "Asume normas de comunicación establecidas.",
      "Responde a preguntas sencillas sobre la idea general de un texto.": "Responde preguntas sobre la idea de un texto.",
      "Interpreta mensajes a partir de imágenes y símbolos, en textos sencillos y establece comparaciones progresivas en palabras que inician o terminan similar, a partir del sonido o la grafía.": "Interpreta mensajes de imágenes y compara palabras.",
      "Lee progresivamente, de manera no convencional o convencional, imágenes y palabras en textos sencillos, comprendiendo su significado literal y utiliza algunas formas convencionales de lectura.": "Lee imágenes y palabras en textos sencillos.",
      "Expresa con sus palabras ideas o información escuchadas o leídas en textos funcionales y literarios de manera no convencional o progresivamente convencional.": "Expresa con sus palabras ideas escuchadas o leídas.",
      "Escribe su nombre de manera no convencional o progresivamente convencional.": "Escribe su nombre de manera progresiva.",
      "Reproduce o produce textos basados en situaciones reales e imaginarias de manera no convencional y progresivamente convencional, utilizando algunos recursos o medios tecnológicos o convencionales.": "Produce textos sobre situaciones reales o imaginarias."
    };

    // Preprimario summaries for long indicators
    if (curso === "Preprimario") {
      const preprimarioSummaries: Record<string, string> = {
        "Se desplaza en diferentes direcciones y posiciones con y sin instrumentos, manteniendo el equilibrio y el control postural, siguiendo secuencias, compases y ritmos compases.": "Se desplaza con equilibrio y control siguiendo ritmos y secuencias.",
        "Selecciona y combina colores primarios y secundarios, utilizándolos con intencionalidad en sus producciones plásticas bidimensionales y tridimensionales al representar ideas reales o imaginarias.": "Combina colores intencionalmente en producciones plásticas 2D y 3D.",
        "Dibuja libremente con mayor precisión e intencionalidad comunicativa, agregando progresivamente elementos del lenguaje plástico a sus producciones.": "Dibuja con precisión e intención comunicativa.",
        "Comunica a través del movimiento una idea, sentimientos o experiencia incorporando objetos al juego o improvisaciones lúdicas.": "Comunica ideas y sentimientos a través del movimiento.",
        "Identifica su lateralidad en la realización de acciones motrices y en la ejecución de diferentes tipos de formaciones (filas, hileras, columnas, círculos, entre otras).": "Identifica su lateralidad en acciones motrices y formaciones.",
        "Comunica ideas y emociones con intención comunicativa en sus conversaciones con niños/niñas.": "Comunica ideas y emociones con intención en conversaciones.",
        "Usa técnicas para expresar emociones, sentimientos, ideas y experiencias.": "Expresa emociones e ideas con técnicas diversas.",
        "Expresa ideas y través de producciones artísticas de su preferencia.": "Crea producciones artísticas de su preferencia.",
        "Escucha y respeta las ideas de las personas que le rodean y expresa sus argumentaciones.": "Escucha, respeta y argumenta sus ideas.",
        "Comparte sentimientos y emociones y toma en cuenta las reacciones de los demás.": "Comparte sentimientos considerando a los demás.",
        "Controla impulsos de manera autónoma tomando en cuenta los acuerdos del grupo.": "Controla impulsos según acuerdos grupales.",
        "Comunica verbalmente utilizando frases sencillas de manera lógica, crítica y creativa describiendo situaciones cotidianas y objetos de su entorno inmediato.": "Describe situaciones cotidianas con frases lógicas y creativas.",
        "Demuestra coordinación en movimientos de las partes de su cuerpo, en el espacio parcial y total.": "Coordina movimientos corporales en espacios diversos.",
        "Realiza desplazamientos en el espacio mostrando estabilidad y equilibrio en sus movimientos.": "Se desplaza con estabilidad y equilibrio.",
        "Experimenta con su cuerpo movimientos de estiramiento, relajación y descanso, al finalizar actividades físicas.": "Practica estiramiento, relajación y descanso post-actividad.",
        "Participa en actividades de higiene y cuidado personal de manera autónoma.": "Participa autónomamente en higiene y cuidado personal.",
        "Describe situaciones de su comunidad local a partir de observación, exploración y preguntas, con el apoyo de adultos.": "Describe situaciones comunitarias mediante observación.",
        "Participa en proyectos sobre problemas sencillos que afectan su comunidad.": "Participa en proyectos sobre problemas comunitarios.",
        "Colabora en la búsqueda de información con ayuda del adulto, sobre temas de interés de su entorno inmediato natural y fenómenos naturales.": "Busca información sobre su entorno con apoyo adulto.",
        "Cuestiona, observa y explora su entorno natural cercano con ayuda de otras personas.": "Explora su entorno natural con curiosidad.",
        "Usa utensilios, artefactos de su entorno o recursos tecnológicos, al realizar experimentos sencillos.": "Usa herramientas en experimentos sencillos.",
        "Registra los resultados de la exploración del entorno natural de forma oral, escrita o gráfica, de manera convencional o no.": "Registra resultados de exploraciones.",
        "Identifica algunas semejanzas y diferencias entre seres vivos de su entorno.": "Compara seres vivos de su entorno.",
        "Utiliza informaciones sobre personas, animales u objetos conocidos para apoyar sus explicaciones.": "Usa información para sustentar explicaciones.",
        "Colabora y explica algunas medidas en actividades de protección y cuidado del entorno escolar, recursos, sus plantas y animales.": "Participa en cuidado del entorno escolar.",
        "Ordena hechos sencillos de la realidad ocurridos en su entorno inmediato utilizando su imaginación.": "Ordena hechos usando imaginación.",
        "Predice acontecimientos explicando lo ocurrido de acuerdo con su conocimiento y experiencias previas.": "Predice eventos según experiencias previas.",
        "Asume progresivamente las reglas acordadas en algunos juegos.": "Asume reglas en juegos.",
        "Integra de manera espontánea objetos del entorno cercano a sus juegos simulando situaciones reales o imaginarias.": "Integra objetos en juegos de simulación.",
        "Responde a preguntas sobre situaciones o actividades que se desarrollan en su contexto inmediato.": "Responde preguntas sobre su contexto.",
        "Expresa sus ideas sobre lo que observa y las actividades cotidianas que realiza.": "Expresa ideas sobre lo que observa.",
        "Expresa a los demás sus acuerdos o desacuerdos ante situaciones o hechos cotidianos.": "Expresa acuerdos y desacuerdos.",
        "Participa en la búsqueda y selección de alternativas al solucionar situaciones cotidianas.": "Busca alternativas para resolver situaciones.",
        "Colabora en la puesta en marcha de la solución acordada de problemas sencillos o situaciones cotidianas que afectan a sí mismo o al grupo.": "Colabora en soluciones de problemas grupales."
      };
      return preprimarioSummaries[desc] || desc;
    }

    return summaries[desc] || desc;
  };

  // Create a linear flow of all indicators across both columns
  const distributeIndicatorsLinear = () => {
    if (!data) return { leftIndicators: [], rightIndicators: [], observationsIndicators: [] };

    // Get all indicators in order and apply summaries
    // Deduplicate indicators by description to avoid double counting if DB has duplicates
    const uniqueMap = new Map();
    data.indicadores.forEach((ind: any) => {
      const normDesc = ind.descripcion.trim().toLowerCase();
      if (!uniqueMap.has(normDesc)) {
        uniqueMap.set(normDesc, ind);
      } else {
        // Prefer specific parts if available
        const existing = uniqueMap.get(normDesc);
        const currentHasPart = ind.nombre_categoria?.includes("Parte") || ind.nombre_categoria?.includes("PARTE");
        const existingHasPart = existing.nombre_categoria?.includes("Parte") || existing.nombre_categoria?.includes("PARTE");

        if (currentHasPart && !existingHasPart) {
          uniqueMap.set(normDesc, ind);
        }
      }
    });

    const allIndicators = Array.from(uniqueMap.values()).sort((a: any, b: any) => a.orden - b.orden).map((ind: any) => ({
      ...ind,
      // Handle potential property mismatch from backend
      nombre_categoria: ind.nombre_categoria || ind.categoria,
      original_descripcion: ind.descripcion, // Keep original for matching
      descripcion: ind.descripcion_corta || summarizeIndicator(ind.descripcion, data.estudiante.curso)
    }));

    // Special handling for Kinder - move some Dominio Comunicativo to observations page
    // Special handling for Kinder - move some Dominio Comunicativo to observations page
    if ((data!.estudiante.curso || "").toLowerCase().includes("kinder")) {
      // Group indicators by domain with robust matching
      const normalizeCat = (cat: string) => (cat || "").trim().toLowerCase();

      // Group indicators by domain with robust matching
      const socioemocional = allIndicators.filter(ind =>
        normalizeCat(ind.nombre_categoria).includes("socioemocional")
      );
      const artistico = allIndicators.filter(ind =>
        normalizeCat(ind.nombre_categoria).includes("artístico") || normalizeCat(ind.nombre_categoria).includes("artistico")
      );
      const psicomotor = allIndicators.filter(ind =>
        normalizeCat(ind.nombre_categoria).includes("psicomotor")
      );
      const descubrimiento = allIndicators.filter(ind =>
        normalizeCat(ind.nombre_categoria).includes("descubrimiento")
      );
      const cognitivo = allIndicators.filter(ind =>
        normalizeCat(ind.nombre_categoria).includes("cognitivo")
      );

      // Move last 5 indicators from Cognitivo to observations page
      const cognitivoForMatrix = cognitivo.slice(0, -5);
      const cognitivoForObservations = cognitivo.slice(-5);

      // Split Psicomotor: 4 left, 5 right to balance pages better
      const psicomotorLeft = psicomotor.slice(0, 4);
      const psicomotorRight = psicomotor.slice(4);

      // Left page: Socioemocional (7) + Artistico (8) + Part of Psicomotor (4) = 19
      const leftIndicators = [
        ...socioemocional,
        ...artistico,
        ...psicomotorLeft
      ];

      // Right page: Rest of Psicomotor (5) + ALL Descubrimiento (10) + First 4 of Cognitivo = 19
      const rightIndicators = [
        ...psicomotorRight,
        ...descubrimiento,
        ...cognitivoForMatrix
      ];

      return {
        leftIndicators,
        rightIndicators,
        observationsIndicators: cognitivoForObservations
      };
    }

    // ---------------------------------------------------------
    // PÁRVULO I LOGIC
    // ---------------------------------------------------------

    const curso = data!.estudiante.curso || "";
    if (["Párvulo I", "Parvulo I", "Párvulo 1", "Parvulo 1"].includes(curso)) {
      // Define lists for categorization
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

      const relaciones = allIndicators
        .filter(ind => isInList(ind, relacionesList))
        .map(ind => ({ ...ind, nombre_categoria: "RELACIONES SOCIOAFECTIVAS" }));

      const lenguaje = allIndicators
        .filter(ind => isInList(ind, lenguajeList))
        .map(ind => ({ ...ind, nombre_categoria: "LENGUAJE E INTERACCIÓN" }));

      const descubrimiento = allIndicators
        .filter(ind => isInList(ind, descubrimientoList))
        .map(ind => ({ ...ind, nombre_categoria: "DESCUBRIMIENTO DEL CUERPO Y ENTORNO" }));

      // Find any indicators that didn't match any list
      const categorizedIds = new Set([
        ...relaciones.map(i => i.id),
        ...lenguaje.map(i => i.id),
        ...descubrimiento.map(i => i.id)
      ]);

      const others = allIndicators.filter(ind => !categorizedIds.has(ind.id));

      // Sort
      const sortFn = (a: any, b: any) => a.orden - b.orden;
      relaciones.sort(sortFn);
      lenguaje.sort(sortFn);
      descubrimiento.sort(sortFn);
      others.sort(sortFn);

      // Distribute
      // Left: Relaciones + Lenguaje
      // Right: Descubrimiento + Others
      const leftIndicators = [...relaciones, ...lenguaje];
      const rightIndicators = [...descubrimiento, ...others];

      return { leftIndicators, rightIndicators, observationsIndicators: [] };
    }

    // ---------------------------------------------------------
    // PÁRVULO II LOGIC
    // ---------------------------------------------------------
    if (["Párvulo II", "Parvulo II", "Párvulo 2", "Parvulo 2"].includes(data!.estudiante.curso || "")) {
      // Define lists for categorization (Párvulo II)
      const validIndicators = allIndicators.filter(ind => {
        const currentDescNorm = normalizeString(ind.descripcion);

        // Strict check: Must match a value or key EXACTLY (normalized)
        // We remove .includes() to prevent "Lenguaje" matching "Lenguaje y algo mas" if that was the case, 
        // though here we are matching descriptions.
        // If "Juega" matches "Juega con pelotas", that's bad.
        // So we use exact match on normalized strings.

        const matchesValue = Object.values(PARVULO_II_INDICATORS).some(val =>
          normalizeString(val) === currentDescNorm
        );

        if (matchesValue) return true;

        const matchesKey = Object.keys(PARVULO_II_INDICATORS).some(key =>
          normalizeString(key) === currentDescNorm
        );

        return matchesKey;
      });

      // ---------------------------------------------------------
      // STRICT BUCKET DISTRIBUTION FOR PÁRVULO II
      // ---------------------------------------------------------

      // Define exact lists for each section
      const relacionesList = [
        "Reconoce objetos y espacios habituales.",
        "Usa normas sociales en interacciones (si se solicita).", // normalized: usa normas sociales en interacciones
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
        .filter(ind => isInList(ind, relacionesList))
        .map(ind => ({ ...ind, nombre_categoria: "RELACIONES SOCIOAFECTIVAS E IDENTIDAD" }));

      const lenguajeParte1 = validIndicators
        .filter(ind => isInList(ind, lenguaje1List))
        .map(ind => ({ ...ind, nombre_categoria: "LENGUAJE E INTERACCIÓN (Parte I)" }));

      const lenguajeParte2 = validIndicators
        .filter(ind => isInList(ind, lenguaje2List))
        .map(ind => ({ ...ind, nombre_categoria: "LENGUAJE E INTERACCIÓN (Parte II)" }));

      const descubrimientoEntorno = validIndicators
        .filter(ind => isInList(ind, descubrimientoList))
        .map(ind => ({ ...ind, nombre_categoria: "DESCUBRIMIENTO DEL CUERPO Y ENTORNO" }));

      // Sort each bucket by ID or Order to keep them consistent
      const sortFn = (a: any, b: any) => a.orden - b.orden;
      relacionesSocioafectivas.sort(sortFn);
      // lenguajeParte1.sort(sortFn); // Or use the explicit order if needed, but they are small groups
      // lenguajeParte2.sort(sortFn);
      descubrimientoEntorno.sort(sortFn);

      // Explicit sort for Lenguaje 1 and 2 to match exact requested order
      const sortByList = (list: string[]) => (a: any, b: any) => {
        const idxA = list.findIndex(l => normalizeString(l) === normalizeString(a.descripcion));
        const idxB = list.findIndex(l => normalizeString(l) === normalizeString(b.descripcion));
        return idxA - idxB;
      };
      lenguajeParte1.sort(sortByList(lenguaje1List));
      lenguajeParte2.sort(sortByList(lenguaje2List));

      const comunicativoForObservations: any[] = []; // No observations for Párvulo II

      const leftIndicators = [
        ...relacionesSocioafectivas,
        ...lenguajeParte1
      ];

      const rightIndicators = [
        ...lenguajeParte2,
        ...descubrimientoEntorno
      ];

      return {
        leftIndicators,
        rightIndicators,
        observationsIndicators: comunicativoForObservations
      };
    }

    // ---------------------------------------------------------
    // PÁRVULO III LOGIC
    // ---------------------------------------------------------
    const cursoNorm = normalizeString(curso);
    if (cursoNorm.includes("parvulo iii") || cursoNorm.includes("parvulo 3")) {
      // Párvulo III Logic - Force list-based categorization for robustness
      // We ignore 'orden' because it has proven inconsistent in the database for this grade.

      // Define lists with unique substrings for robust matching
      // Updated based on specific user request and observed "others" leakage
      const relacionesList = [
        "Elige y completa una actividad",
        "Asume responsabilidades de acuerdo",
        "Da las gracias, pide por favor",
        "Intenta cumplir acuerdos de pedir",
        "Disfruta del juego e interactúa motivado",
        "Interactúa con otros niños expresando",
        "Interactúa aceptando que otros usen",
        "Utiliza gestos y palabras para manifestar",
        "Responde a su nombre y apellidos",
        "Dice su nombre, edad y sexo",
        "Conoce el nombre de personas significativas"
      ];

      const descubrimientoList = [
        "Construye torres con mayor precisión",
        "Practica normas de autocuidado",
        "Nombra y reconoce funciones de partes",
        "Evita situaciones de inseguridad buscando",
        "Sigue advertencias de seguridad ante",
        "Colabora en el cuidado de su cuerpo",
        "Cede ante", // Matches "Cede ante la solicitud..." and "Cede ante solicitud..."
        "Se aleja del adulto interactuando",
        "Identifica y señala partes de su cuerpo",
        "Interactúa con objetos", // Matches "Interactúa con objetos (tamaño...)"
        "Interactúa con elementos", // Matches "Interactúa con elementos de su entorno"
        "Relaciona características de su cuerpo",
        "Realiza juegos motrices", // Matches "Realiza juegos motrices con tiempo..."
        "Realiza juegos y actividades motrices", // Matches "Realiza juegos y actividades motrices"
        "Realiza acciones de vestirse",
        "Participa en juegos motrices", // Matches "Participa en juegos motrices para expresar..."
        "Expresa ideas/sentimientos con acciones", // Original for "Participa en juegos motrices" if it's different
        "Se desplaza caminando, corriendo",
        "Trepa sobre superficies inclinadas",
        "Mantiene equilibrio en desplazamientos",
        "Participa en lavado de manos"
      ];

      const lenguajeList = [
        "Participa en juegos organizados",
        "Desarrolla imaginación", // Matches "Desarrolla imaginación (gestos...)"
        "Agarra objetos grandes y pequeños",
        "Lanza pelotas", // Matches "Lanza pelotas intentando..."
        "Juegos de arrastre, empuje y golpeo", // Matches "Realiza juegos de arrastre..."
        "Comprende informaciones de adultos",
        "Realiza preguntas para aclarar",
        "Realiza acciones relacionando", // Matches "Realiza acciones relacionando vivencias."
        "Reconoce sonidos", // Matches "Reconoce sonidos, mímicas..."
        "Realiza instrucciones simples de vida",
        "Escucha y disfruta textos literarios",
        "Dramatiza acciones de textos",
        "Participa en situaciones comunicativas",
        "Emplea lenguaje", // Matches "Emplea lenguaje para necesidades..."
        "Muestra respeto a normas de conversación",
        "Lee no convencionalmente libros",
        "Pregunta sobre contenido de libros",
        "Narra contenido de textos" // Matches "Narra contenido de textos (sin orden...)"
      ];

      const normalize = (str: string) => str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      const isInList = (ind: any, list: string[]) => {
        const desc = normalize(ind.original_descripcion || ind.descripcion || "");

        return list.some(item => {
          const itemNorm = normalize(item);
          return desc.includes(itemNorm);
        });
      };

      // Categorize
      let relaciones = allIndicators.filter(ind => isInList(ind, relacionesList));

      // Special handling for Descubrimiento to avoid over-matching "Interactúa con" or "Realiza juegos"
      // We use a more specific list first, then fall back if needed, or just use the broad list carefully.
      // Given the user's specific text, let's use the broad list but ensure we catch the variations.
      let descubrimiento = allIndicators.filter(ind => {
        const desc = normalize(ind.original_descripcion || ind.descripcion || "");
        // Specific checks for the problematic ones
        if (desc.includes(normalize("Interactúa con objetos")) || desc.includes(normalize("Interactúa con elementos"))) return true;
        if (desc.includes(normalize("Realiza juegos motrices")) || desc.includes(normalize("Realiza juegos y actividades"))) return true;
        if (desc.includes(normalize("Participa en juegos motrices")) || desc.includes(normalize("Expresa ideas"))) return true;

        return isInList(ind, descubrimientoList);
      });

      let lenguaje = allIndicators.filter(ind => isInList(ind, lenguajeList));

      // Sort by list order
      const sortByList = (list: string[]) => (a: any, b: any) => {
        const descA = normalize(a.original_descripcion || a.descripcion || "");
        const descB = normalize(b.original_descripcion || b.descripcion || "");

        const indexA = list.findIndex(l => {
          const lNorm = normalize(l);
          return descA.includes(lNorm);
        });
        const indexB = list.findIndex(l => {
          const lNorm = normalize(l);
          return descB.includes(lNorm);
        });

        // If not found in list (matched via specific logic), push to end or try to map
        const safeIndexA = indexA === -1 ? 999 : indexA;
        const safeIndexB = indexB === -1 ? 999 : indexB;

        return safeIndexA - safeIndexB;
      };

      relaciones.sort(sortByList(relacionesList));

      // Custom sort for Descubrimiento to match user order exactly
      // We need a more robust sort that handles the "Interactúa con" ambiguity if we want specific order
      // "Interactúa con objetos" comes AFTER "Identifica y señala"
      descubrimiento.sort((a, b) => {
        const descA = normalize(a.original_descripcion || a.descripcion || "");
        const descB = normalize(b.original_descripcion || b.descripcion || "");

        const getOrder = (desc: string) => {
          if (desc.includes(normalize("Construye torres"))) return 1;
          if (desc.includes(normalize("Practica normas"))) return 2;
          if (desc.includes(normalize("Nombra y reconoce"))) return 3;
          if (desc.includes(normalize("Evita situaciones"))) return 4;
          if (desc.includes(normalize("Sigue advertencias"))) return 5;
          if (desc.includes(normalize("Colabora en el cuidado"))) return 6;
          if (desc.includes(normalize("Cede ante"))) return 7;
          if (desc.includes(normalize("Se aleja del adulto"))) return 8;
          if (desc.includes(normalize("Identifica y señala"))) return 9;
          if (desc.includes(normalize("Interactúa con objetos"))) return 10; // Specific
          if (desc.includes(normalize("Interactúa con elementos"))) return 11; // Specific
          if (desc.includes(normalize("Relaciona características"))) return 12;
          if (desc.includes(normalize("Realiza juegos motrices"))) return 13; // Specific
          if (desc.includes(normalize("Realiza juegos y actividades"))) return 14; // Specific
          if (desc.includes(normalize("Realiza acciones de vestirse"))) return 15;
          if (desc.includes(normalize("Participa en juegos motrices")) || desc.includes(normalize("Expresa ideas"))) return 16; // Specific
          if (desc.includes(normalize("Se desplaza caminando"))) return 17;
          if (desc.includes(normalize("Trepa sobre"))) return 18;
          if (desc.includes(normalize("Mantiene equilibrio"))) return 19;
          if (desc.includes(normalize("Participa en lavado"))) return 20;
          return 99;
        };

        return getOrder(descA) - getOrder(descB);
      });

      lenguaje.sort(sortByList(lenguajeList));

      // Apply category names
      relaciones = relaciones.map(ind => ({ ...ind, nombre_categoria: "RELACIONES SOCIOAFECTIVAS, IDENTIDAD Y AUTONOMÍA" }));
      descubrimiento = descubrimiento.map(ind => ({ ...ind, nombre_categoria: "DESCUBRIMIENTO DE SU CUERPO Y SU RELACIÓN CON EL ENTORNO" }));
      lenguaje = lenguaje.map(ind => ({ ...ind, nombre_categoria: "LENGUAJE E INTERACCIÓN" }));

      // IMPORTANT: Ensure no duplicates in 'others'
      // We create a Set of IDs that have been categorized
      const categorizedIds = new Set([
        ...relaciones.map(i => i.id),
        ...descubrimiento.map(i => i.id),
        ...lenguaje.map(i => i.id)
      ]);

      // 'others' should ONLY contain indicators that were NOT matched above
      const others = allIndicators.filter(ind => {
        if (categorizedIds.has(ind.id)) return false; // Already categorized

        const indDescNorm = normalize(ind.original_descripcion || ind.descripcion || "");

        // Check if this 'other' indicator's description is contained by or contains any categorized indicator's description
        const isDuplicate = [...relaciones, ...descubrimiento, ...lenguaje].some(catInd => {
          const catIndDescNorm = normalize(catInd.original_descripcion || catInd.descripcion || "");
          return indDescNorm.includes(catIndDescNorm) || catIndDescNorm.includes(indDescNorm);
        });

        return !isDuplicate;
      });

      // Double check others against our lists to prevent leakage
      // If an 'other' matches a list item loosely, we should probably hide it or merge it?
      // For now, just sort.
      others.sort((a, b) => a.id - b.id);

      // Distribution Strategy:
      // Relaciones: 11 items
      // Descubrimiento: 18 items
      // Lenguaje: 18 items
      // Total: 47 items

      // Left Page: Relaciones (11) + First part of Descubrimiento (13) = 24 items
      // Right Page: Rest of Descubrimiento (5) + Lenguaje (18) = 23 items

      const descubrimientoSplitIndex = 13;
      const descubrimientoPart1 = descubrimiento.slice(0, descubrimientoSplitIndex);
      const descubrimientoPart2 = descubrimiento.slice(descubrimientoSplitIndex);

      const leftIndicators = [
        ...relaciones,
        ...descubrimientoPart1
      ];

      const rightIndicators = [
        ...descubrimientoPart2,
        ...lenguaje,
        ...others // Only truly unmatched indicators go here
      ];

      return { leftIndicators, rightIndicators, observationsIndicators: [] };
    }

    // Special handling for Prekinder - filter and distribute by domain
    if (data!.estudiante.curso === "Prekinder") {
      // Helper to get indicators by domain (handling uppercase from new DB import)
      const getByDomain = (domain: string) => allIndicators.filter(ind => ind.nombre_categoria === domain);

      const socioemocional = getByDomain("DOMINIO SOCIOEMOCIONAL");
      const artistico = getByDomain("DOMINIO ARTÍSTICO Y CREATIVO");
      const psicomotor = getByDomain("DOMINIO PSICOMOTOR Y DE SALUD");
      const descubrimiento = getByDomain("DOMINIO DESCUBRIMIENTO DEL MUNDO");
      const cognitivo = getByDomain("DOMINIO COGNITIVO");
      const comunicativo = getByDomain("DOMINIO COMUNICATIVO");

      // Split Psicomotor to balance pages
      const psicomotorHalf = Math.ceil(psicomotor.length / 2);
      const psicomotorLeft = psicomotor.slice(0, psicomotorHalf);
      const psicomotorRight = psicomotor.slice(psicomotorHalf);

      // Left Page: Socioemocional, Artístico, Part of Psicomotor
      const leftIndicators = [
        ...socioemocional,
        ...artistico,
        ...psicomotorLeft
      ];

      // Right Page: Rest of Psicomotor, Descubrimiento, Cognitivo
      const rightIndicators = [
        ...psicomotorRight,
        ...descubrimiento,
        ...cognitivo
      ];

      // Observations: Comunicativo
      const observationsIndicators = comunicativo;

      return {
        leftIndicators,
        rightIndicators,
        observationsIndicators
      };
    }

    // Special handling for Preprimario - based on official bulletin layout
    if (data!.estudiante.curso === "Preprimario") {
      // Group indicators by domain
      const socioemocional = allIndicators.filter(ind =>
        ind.nombre_categoria === "Dominio Socioemocional" || ind.nombre_categoria === "DOMINIO SOCIOEMOCIONAL"
      );
      const artistico = allIndicators.filter(ind =>
        ind.nombre_categoria === "Dominio Artístico y Creativo" || ind.nombre_categoria === "DOMINIO ARTÍSTICO Y CREATIVO"
      );
      const psicomotor = allIndicators.filter(ind =>
        ind.nombre_categoria === "Dominio Psicomotor y de Salud" || ind.nombre_categoria === "DOMINIO PSICOMOTOR Y DE SALUD"
      );
      const descubrimiento = allIndicators.filter(ind =>
        ind.nombre_categoria === "Dominio Descubrimiento del Mundo" || ind.nombre_categoria === "DOMINIO DESCUBRIMIENTO DEL MUNDO"
      );
      const cognitivo = allIndicators.filter(ind =>
        ind.nombre_categoria === "Dominio Cognitivo" || ind.nombre_categoria === "DOMINIO COGNITIVO"
      );
      const comunicativo = allIndicators.filter(ind =>
        ind.nombre_categoria === "Dominio Comunicativo" || ind.nombre_categoria === "DOMINIO COMUNICATIVO"
      );

      // Move last 8 indicators from Comunicativo to observations page
      const comunicativoForMatrix = comunicativo.slice(0, -8);
      const comunicativoForObservations = comunicativo.slice(-8);

      // Split Psicomotor: last 3 go to right page
      const psicomotorLeft = psicomotor.slice(0, -3);
      const psicomotorRight = psicomotor.slice(-3);

      // Left page: Socioemocional + Artistico + most of Psicomotor
      const leftIndicators = [
        ...socioemocional,
        ...artistico,
        ...psicomotorLeft
      ];

      // Right page: Last 3 of Psicomotor + Descubrimiento + Cognitivo + Rest of Comunicativo
      const rightIndicators = [
        ...psicomotorRight,
        ...descubrimiento,
        ...cognitivo,
        ...comunicativoForMatrix
      ];

      // Observations page: Last 8 indicators of Comunicativo
      const observationsIndicators = comunicativoForObservations;

      return {
        leftIndicators,
        rightIndicators,
        observationsIndicators
      };
    }

    // Default distribution for other courses
    const totalIndicators = allIndicators.length;
    const halfPoint = Math.ceil(totalIndicators / 2);

    return {
      leftIndicators: allIndicators.slice(0, halfPoint),
      rightIndicators: allIndicators.slice(halfPoint),
      observationsIndicators: []
    };
  };

  // const normalizeString = (str: string) => str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Cargando boletín...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600">
          {error || "No se encontraron datos"}
        </div>
      </div>
    );
  }

  const { leftIndicators, rightIndicators, observationsIndicators } = distributeIndicatorsLinear();

  // Dynamic font sizing
  const curso = data.estudiante.curso || "";
  const isLargeFont = ["Prekinder", "Kinder", "Párvulo II", "Párvulo I", "Parvulo I"].includes(curso);
  const isParvulo3 = ["Párvulo III", "Parvulo III", "Párvulo 3", "Parvulo 3"].includes(curso);
  const isMediumFont = curso === "Preprimario";

  let tableTextSize = "text-[9px]";
  let categoryTextSize = "text-[9px]";
  let indicatorTextSize = "text-[8px] leading-tight";

  if (isLargeFont) {
    tableTextSize = "text-[11px]";
    categoryTextSize = "text-[12px]";
    indicatorTextSize = "text-[11px] leading-snug";
  } else if (isParvulo3) {
    tableTextSize = "text-[10px]";
    categoryTextSize = "text-[11px]";
    indicatorTextSize = "text-[10px] leading-snug";
  } else if (isMediumFont) {
    tableTextSize = "text-[9.5px]";
    categoryTextSize = "text-[10.5px]";
    indicatorTextSize = "text-[9.5px] leading-tight";
  }

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
          
          @media print {
            .no-print { display: none !important; }
            body { margin: 0; padding: 0; background: white; }
            .bulletin-sheet { 
              box-shadow: none !important; 
              margin: 0 !important;
              page-break-after: always;
            }
          }
          
          body { font-family: 'Roboto', sans-serif; }
        `}
      </style>

      <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => navigate(`/teacher/cursos/${cursoId}/estudiantes/${estudianteId}/evaluar`)}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          <Printer className="w-5 h-5" />
          Imprimir
        </button>
      </div>

      <div className="min-h-screen bg-gray-600 p-5 flex flex-col items-center gap-5">
        {/* HOJA 1: EXTERIOR (Portada y Observaciones) */}
        <div className="bulletin-sheet bg-white" style={{
          width: '11in',
          height: '8.5in',
          padding: '0.4in 0.4in 0.5in 0.4in',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.6in',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}>
          {/* Observaciones */}
          <div className="border-r border-gray-200 pr-4 flex flex-col">
            {/* Additional Indicators Section for Prekinder/Kinder */}
            {observationsIndicators && observationsIndicators.length > 0 && (
              <div className="mb-2">
                <table className={"w-full border-collapse " + tableTextSize} style={{ border: '1.5px solid #000' }}>
                  <thead>
                    <tr>
                      <th className="border border-gray-600 p-1 bg-blue-50 font-bold text-left uppercase text-[10px]" colSpan={10}>
                        Continuación de Indicadores - Dominio Cognitivo
                      </th>
                    </tr>
                    <tr>
                      <th className="border border-gray-600 p-0.5 bg-white font-bold text-center" style={{ width: '50%' }}>
                        INDICADORES DE LOGRO
                      </th>
                      <th colSpan={3} className="border border-gray-600 p-0.5 bg-white font-bold text-center text-[8px]">
                        1ro
                      </th>
                      <th colSpan={3} className="border border-gray-600 p-0.5 bg-white font-bold text-center text-[8px]">
                        2do
                      </th>
                      <th colSpan={3} className="border border-gray-600 p-0.5 bg-white font-bold text-center text-[8px]">
                        3ro
                      </th>
                    </tr>
                    <tr>
                      <th className="border border-gray-600"></th>
                      {[0, 1, 2].map((p) => (
                        <>
                          <th key={`${p}-l`} className="border border-gray-600 text-center text-[7px] p-0" style={{ width: '11px' }}>L</th>
                          <th key={`${p}-p`} className="border border-gray-600 text-center text-[7px] p-0" style={{ width: '11px' }}>P</th>
                          <th key={`${p}-i`} className="border border-gray-600 text-center text-[7px] p-0" style={{ width: '11px' }}>I</th>
                        </>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {observationsIndicators.map((ind) => {
                      return (
                        <tr key={`obs-ind-${ind.id}`}>
                          <td className={`border border-gray-600 p-0.5 text-left ${indicatorTextSize}`}>{ind.descripcion}</td>
                          {["1er Período", "2do Período", "3er Período"].map((periodo, pIdx) => {
                            const valor = data.evaluaciones[periodo]?.[ind.id];

                            return (
                              <>
                                <td key={`obs-${ind.id}-p${pIdx}-l`} className="border border-gray-600 text-center p-0 font-bold text-black" style={{ width: '11px', fontSize: '9px' }}>
                                  {valor === "Adquirido" ? "✓" : ""}
                                </td>
                                <td key={`obs-${ind.id}-p${pIdx}-p`} className="border border-gray-600 text-center p-0 font-bold text-black" style={{ width: '11px', fontSize: '9px' }}>
                                  {valor === "En Proceso" ? "✓" : ""}
                                </td>
                                <td key={`obs-${ind.id}-p${pIdx}-i`} className="border border-gray-600 text-center p-0 font-bold text-black" style={{ width: '11px', fontSize: '9px' }}>
                                  {valor === "Iniciado" ? "✓" : ""}
                                </td>
                              </>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <h3 className="text-sm font-bold text-center mb-1.5 uppercase border-b-2 border-black pb-1">
              Observaciones y Comentarios
            </h3>
            <div className="flex flex-col gap-1.5 flex-1">
              {["1er Período (Ago - Dic)", "2do Período (Ene - Mar)", "3er Período (Abr - Jun)"].map((periodo, idx) => {
                const periodoKey = ["1er Período", "2do Período", "3er Período"][idx];
                const obs = data.observaciones?.[periodoKey] || { cualidades_destacar: "", necesita_apoyo: "" };

                return (
                  <div key={periodo} className="border border-black p-1.5 flex-grow">
                    <div className="font-bold bg-gray-100 px-1.5 py-0.5 text-[10px] mb-1 border-b border-gray-300">
                      {periodo}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="border-r border-gray-300 pr-1.5">
                        <span className="text-[9px] uppercase font-bold text-gray-600 block mb-0.5">
                          Cualidades a destacar:
                        </span>
                        <div className="h-10 text-[9px] leading-tight overflow-hidden">
                          {obs.cualidades_destacar}
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-gray-600 block mb-0.5">
                          Aspectos a estimular:
                        </span>
                        <div className="h-10 text-[9px] leading-tight overflow-hidden">
                          {obs.necesita_apoyo}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-0.5 text-[9px] text-center text-gray-500 italic mb-1">
              Nota: Este reporte valora los avances según el ritmo individual de aprendizaje.
            </div>
          </div>

          {/* Portada */}
          <div className="pl-4 flex flex-col justify-between">
            <div className="text-center">
              <div className="mx-auto mb-2 w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xs border border-gray-300">
                {data.config.logo_minerd_url ? (
                  <img src={data.config.logo_minerd_url} alt="Logo MINERD" className="w-full h-full object-contain rounded-full" />
                ) : (
                  "[Logo Gob]"
                )}
              </div>

              <h2 className="text-xs font-bold uppercase text-gray-700 tracking-wide">
                Gobierno de la República Dominicana
              </h2>
              <h3 className="text-xs uppercase text-red-600 font-bold tracking-wider mt-1">
                Educación
              </h3>
              <h4 className="text-xs text-gray-600 mt-1 leading-tight">
                Viceministerio de Servicios Técnicos y Pedagógicos<br />
                Dirección General de Educación Inicial
              </h4>

              <h1 className="text-2xl font-black uppercase mt-3 mb-1 text-teal-700 tracking-tight border-b-2 border-teal-100 inline-block pb-1">
                Informe de Evaluación
              </h1>

              <div className="mx-auto mt-2 w-14 h-14 bg-gray-100 rounded-full border border-gray-300 flex items-center justify-center text-xs">
                {data.config.logo_centro_url ? (
                  <img src={data.config.logo_centro_url} alt="Logo Centro" className="w-full h-full object-contain rounded-full" />
                ) : (
                  "[Logo Centro]"
                )}
              </div>
            </div>

            <div className="mt-1 text-center">
              <h2 className="text-sm font-bold text-gray-600">
                Niños y niñas de {getAgeRangeForGrade(data.estudiante.curso || '', data.estudiante.nivel_parvulo)}
              </h2>
              <h2 className="text-2xl font-black text-black uppercase tracking-wide">
                GRADO: {data.estudiante.curso?.toUpperCase() || 'N/A'}
                {data.estudiante.nivel_parvulo && ` - ${data.estudiante.nivel_parvulo.toUpperCase()}`}
                {data.estudiante.seccion ? ` - SECCIÓN ${data.estudiante.seccion.toUpperCase()}` : ''}
              </h2>
            </div>

            <div className="flex gap-4 items-start px-2 mt-2">
              <div className="flex-shrink-0">
                <div className="w-28 h-32 border border-dashed border-gray-400 bg-gray-50 flex items-center justify-center text-xs text-gray-500">
                  PEGAR FOTO<br />(3x4 cm)
                </div>
              </div>
              <div className="flex-grow pt-1 text-xs">
                <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 items-baseline">
                  <span className="font-bold">Nombre:</span>
                  <span className="border-b border-dotted border-gray-400">{data.estudiante.nombre} {data.estudiante.apellido}</span>

                  <span className="font-bold">Edad:</span>
                  <span className="border-b border-dotted border-gray-400">{getAge(data.estudiante.fecha_nacimiento) !== null ? `${getAge(data.estudiante.fecha_nacimiento)} Años` : 'N/A'}</span>

                  <span className="font-bold">Sexo:</span>
                  <span className="border-b border-dotted border-gray-400">{data.estudiante.genero || 'N/A'}</span>

                  <span className="font-bold">Grado:</span>
                  <span className="border-b border-dotted border-gray-400">{data.estudiante.curso}{data.estudiante.seccion ? ` - Sección ${data.estudiante.seccion}` : ''}</span>

                  <span className="font-bold">Año Esc.:</span>
                  <span className="border-b border-dotted border-gray-400">{data.estudiante.anio_escolar || data.config.anio_escolar_actual || 'N/A'}</span>

                  <span className="font-bold">Tanda:</span>
                  <span className="border-b border-dotted border-gray-400">Matutina</span>
                </div>
              </div>
            </div>

            <div className="px-2 space-y-1 mt-1 text-xs">
              <div className="grid grid-cols-[auto_1fr] gap-x-2 items-baseline">
                <span className="font-bold">Padre/Madre:</span>
                <span className="border-b border-dotted border-gray-400">{data.estudiante.nombre_tutor || 'N/A'}</span>

                <span className="font-bold">Centro:</span>
                <span className="border-b border-dotted border-gray-400 uppercase">{data.config.nombre_centro || 'N/A'}</span>

                <span className="font-bold">Educador/a:</span>
                <span className="border-b border-dotted border-gray-400 uppercase">
                  Lic. {data.maestro.nombre} {data.maestro.apellido}
                </span>

                <span className="font-bold">Reg:</span>
                <span className="border-b border-dotted border-gray-400">{data.config.regional || 'N/A'}</span>

                <span className="font-bold">Dist:</span>
                <span className="border-b border-dotted border-gray-400">{data.config.distrito || 'N/A'}</span>

                <span className="font-bold">Grado Siguiente:</span>
                <span className="border-b border-black font-medium">{getNextGrade(data.estudiante.curso || '')}</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-8 text-center px-4">
              <div>
                <div className="border-t border-black w-3/4 mx-auto mb-1"></div>
                <p className="text-xs font-bold">Firma Educador/a</p>
              </div>
              <div>
                <div className="border-t border-black w-3/4 mx-auto mb-1"></div>
                <p className="text-xs font-bold">Firma Director/a</p>
              </div>
            </div>

            <div className="mt-auto mb-1">
              <div className="text-xs text-justify bg-yellow-50 p-2 border border-yellow-200 rounded">
                <b>A las Familias:</b> En {data.estudiante.curso}, trabajamos los dominios de desarrollo integral.
                Les invitamos a revisar los indicadores y las observaciones para apoyar el aprendizaje de su hijo/a en casa.
              </div>
            </div>
          </div>
        </div>

        {/* HOJA 2: INTERIOR (Matriz de Indicadores) */}
        <div className="bulletin-sheet bg-white" style={{
          width: '11in',
          height: '8.5in',
          padding: '0.4in 0.4in 0.5in 0.4in',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.6in',
          alignItems: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}>
          {/* Left Panel */}
          <div>
            <table className={"w-full border-collapse " + tableTextSize} style={{ border: '1.5px solid #000' }}>
              <thead>
                <tr>
                  <th className="border border-gray-600 p-0.5 bg-white font-bold text-center" style={{ width: '44%' }}>
                    INDICADORES DE LOGRO
                  </th>
                  <th colSpan={3} className="border border-gray-600 p-0.5 bg-white font-bold text-center text-[8px]">
                    1ro (Ago-Dic)
                  </th>
                  <th colSpan={3} className="border border-gray-600 p-0.5 bg-white font-bold text-center text-[8px]">
                    2do (Ene-Mar)
                  </th>
                  <th colSpan={3} className="border border-gray-600 p-0.5 bg-white font-bold text-center text-[8px]">
                    3ro (Abr-Jun)
                  </th>
                </tr>
                <tr>
                  <th className="border border-gray-600"></th>
                  {[0, 1, 2].map((p) => (
                    <>
                      <th key={`${p}-l`} className="border border-gray-600 text-center text-[7px] p-0" style={{ width: '13px' }}>L</th>
                      <th key={`${p}-p`} className="border border-gray-600 text-center text-[7px] p-0" style={{ width: '13px' }}>P</th>
                      <th key={`${p}-i`} className="border border-gray-600 text-center text-[7px] p-0" style={{ width: '13px' }}>I</th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leftIndicators?.map((ind, index) => {
                  // Show category header when category changes
                  // Force strict check for Párvulo II split headers
                  const showCategoryHeader = index === 0 ||
                    ind.nombre_categoria !== leftIndicators?.[index - 1]?.nombre_categoria;

                  // Debug: Ensure category is not empty
                  if (!ind.nombre_categoria) console.warn("Indicator missing category:", ind);

                  const categoryColorClass = "bg-green-50 text-green-900";

                  return (
                    <>
                      {showCategoryHeader && (
                        <tr key={`cat-${ind.nombre_categoria}-${index}`}>
                          <td colSpan={10} className={`border border-gray-600 ${categoryColorClass} font-bold uppercase ${categoryTextSize} px-1.5 py-0.5`}>
                            {ind.nombre_categoria || "Sin categoría"}
                          </td>
                        </tr>
                      )}
                      <tr key={`left-ind-${ind.id}`} className="hover:bg-gray-50">
                        <td className={`border border-gray-600 p-0.5 text-left ${indicatorTextSize}`}>{ind.descripcion}</td>
                        {["1er Período", "2do Período", "3er Período"].map((periodo, pIdx) => {
                          const valor = data.evaluaciones[periodo]?.[ind.id];
                          return (
                            <>
                              <td key={`left-${ind.id}-p${pIdx}-l`} className="border border-gray-600 text-center p-0 font-bold text-black" style={{ width: '13px', fontSize: '10px' }}>
                                {valor === "Adquirido" ? "✓" : ""}
                              </td>
                              <td key={`left-${ind.id}-p${pIdx}-p`} className="border border-gray-600 text-center p-0 font-bold text-black" style={{ width: '13px', fontSize: '10px' }}>
                                {valor === "En Proceso" ? "✓" : ""}
                              </td>
                              <td key={`left-${ind.id}-p${pIdx}-i`} className="border border-gray-600 text-center p-0 font-bold text-black" style={{ width: '13px', fontSize: '10px' }}>
                                {valor === "Iniciado" ? "✓" : ""}
                              </td>
                            </>
                          );
                        })}
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Right Panel */}
          <div>
            <table className={"w-full border-collapse " + tableTextSize} style={{ border: '1.5px solid #000' }}>
              <thead>
                <tr>
                  <th className="border border-gray-600 p-0.5 bg-white font-bold text-center" style={{ width: '44%' }}>
                    INDICADORES DE LOGRO
                  </th>
                  <th colSpan={3} className="border border-gray-600 p-0.5 bg-white font-bold text-center text-[8px]">
                    1ro (Ago-Dic)
                  </th>
                  <th colSpan={3} className="border border-gray-600 p-0.5 bg-white font-bold text-center text-[8px]">
                    2do (Ene-Mar)
                  </th>
                  <th colSpan={3} className="border border-gray-600 p-0.5 bg-white font-bold text-center text-[8px]">
                    3ro (Abr-Jun)
                  </th>
                </tr>
                <tr>
                  <th className="border border-gray-600"></th>
                  {[0, 1, 2].map((p) => (
                    <>
                      <th key={`${p}-l`} className="border border-gray-600 text-center text-[7px] p-0" style={{ width: '13px' }}>L</th>
                      <th key={`${p}-p`} className="border border-gray-600 text-center text-[7px] p-0" style={{ width: '13px' }}>P</th>
                      <th key={`${p}-i`} className="border border-gray-600 text-center text-[7px] p-0" style={{ width: '13px' }}>I</th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rightIndicators?.map((ind, index) => {
                  // Show category header when category changes
                  // Force strict check for Párvulo II split headers
                  const showCategoryHeader = index === 0 ||
                    ind.nombre_categoria !== rightIndicators?.[index - 1]?.nombre_categoria;

                  // Debug: Ensure category is not empty
                  if (!ind.nombre_categoria) console.warn("Right Indicator missing category:", ind);


                  const categoryColorClass = "bg-green-50 text-green-900";

                  return (
                    <>
                      {showCategoryHeader && (
                        <tr key={`cat-${ind.nombre_categoria}-${index}`}>
                          <td colSpan={10} className={`border border-gray-600 ${categoryColorClass} font-bold uppercase ${categoryTextSize} px-1.5 py-0.5`}>
                            {ind.nombre_categoria || "Sin categoría"}
                          </td>
                        </tr>
                      )}
                      <tr key={`right-ind-${ind.id}`} className="hover:bg-gray-50">
                        <td className={`border border-gray-600 p-0.5 text-left ${indicatorTextSize}`}>{ind.descripcion}</td>
                        {["1er Período", "2do Período", "3er Período"].map((periodo, pIdx) => {
                          const valor = data.evaluaciones[periodo]?.[ind.id];
                          return (
                            <>
                              <td key={`right-${ind.id}-p${pIdx}-l`} className="border border-gray-600 text-center p-0 font-bold text-black" style={{ width: '13px', fontSize: '10px' }}>
                                {valor === "Adquirido" ? "✓" : ""}
                              </td>
                              <td key={`right-${ind.id}-p${pIdx}-p`} className="border border-gray-600 text-center p-0 font-bold text-black" style={{ width: '13px', fontSize: '10px' }}>
                                {valor === "En Proceso" ? "✓" : ""}
                              </td>
                              <td key={`right-${ind.id}-p${pIdx}-i`} className="border border-gray-600 text-center p-0 font-bold text-black" style={{ width: '13px', fontSize: '10px' }}>
                                {valor === "Iniciado" ? "✓" : ""}
                              </td>
                            </>
                          );
                        })}
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

