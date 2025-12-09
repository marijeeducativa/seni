import { getEstudiantes, getBoletinData } from "@/react-app/lib/supabase-helpers";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Loader2 } from "lucide-react";

interface Estudiante {
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
}

interface Maestro {
  nombre: string;
  apellido: string;
}

interface Config {
  nombre_centro?: string;
  codigo_centro?: string;
  direccion?: string;
  regional?: string;
  distrito?: string;
  logo_minerd_url?: string;
  logo_centro_url?: string;
  director_nombre?: string;
  anio_escolar_actual?: string;
}

interface Indicador {
  id: number;
  descripcion: string;
  nombre_categoria: string | null;
  orden: number;
  original_descripcion?: string;
}

interface BulletinData {
  estudiante: Estudiante;
  maestro: Maestro;
  config: Config;
  indicadores: Indicador[];
  evaluaciones: Record<string, Record<number, string>>;
  observaciones: Record<string, {
    cualidades_destacar: string;
    necesita_apoyo: string;
  }>;
}

export default function BulkBulletinPrint() {
  const { id: cursoId } = useParams();
  const navigate = useNavigate();
  const [allBulletins, setAllBulletins] = useState<BulletinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    fetchAllBulletins();
  }, [cursoId]);

  const fetchAllBulletins = async () => {
    try {
      // First get all students in the course
      const estudiantesData = await getEstudiantes();
      const estudiantesCurso = estudiantesData.filter((e: any) => e.id_curso_actual === Number(cursoId));

      setLoadingProgress({ current: 0, total: estudiantesCurso.length });

      // Fetch bulletin data for each student
      const bulletins: BulletinData[] = [];

      for (let i = 0; i < estudiantesCurso.length; i++) {
        const estudiante = estudiantesCurso[i];
        setLoadingProgress({ current: i + 1, total: estudiantesCurso.length });

        try {
          const bulletinData = await getBoletinData(estudiante.id);
          bulletins.push(bulletinData as any);
        } catch (err) {
          console.error(`Error fetching bulletin for student ${estudiante.id}:`, err);
        }
      }

      setAllBulletins(bulletins);
    } catch (error) {
      console.error("Error fetching bulletins:", error);
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

  const summarizeIndicator = (desc: string, curso: string): string => {
    if (curso !== "Párvulo II" && curso !== "Kinder" && curso !== "Preprimario") return desc;

    if (curso === "Párvulo II") {
      const parvulo2Summaries: Record<string, string> = {
        "Expresa sus necesidades fisiológicas, socioafectivas y/o de juego acompañando su acción con palabras, primeras frases, gestos y movimientos voluntarios.": "Expresa necesidades con palabras, frases, gestos y movimientos.",
        "Se desplaza caminando, corriendo, y saltando en superficies planas en diversas direcciones, a distancias cortas, con o sin obstáculos con estabilidad, equilibrio y confianza.": "Se desplaza caminando, corriendo y saltando con equilibrio y confianza.",
        "Mantiene el equilibrio en la ejecución de desplazamientos como caminar por una línea recta y curvas trazadas en el piso y trepar pequeñas alturas.": "Mantiene equilibrio al caminar por líneas y trepar.",
        "Sigue instrucciones asociados a actividades de rutina expresadas en oraciones simples y palabras conocidas.": "Sigue instrucciones simples en actividades de rutina.",
        "Imita sonidos y movimientos expresados en cuentos cortos/repetitivo, poesías rimadas, canciones.": "Imita sonidos y movimientos de cuentos, poesías y canciones.",
        "Reconoce objetos, personas, animales del entorno cercano nombrados por otra persona en situaciones comunicativas.": "Reconoce objetos, personas y animales nombrados.",
        "Manipula con sus manos y pies diferentes materiales y juguetes para producir sonidos libremente a partir de movimientos con su cuerpo.": "Manipula materiales para producir sonidos con su cuerpo.",
        "Realiza movimientos en los que coordina ojo-pie y ojo-mano como patear pelotas sin orientación específica o atrapar una pelota pequeña.": "Coordina ojo-pie y ojo-mano al patear y atrapar pelotas.",
        "Usa sus manos pelotas pequeñas y medianas y otros objetos, intentando orientarlos hacia un punto.": "Usa manos para orientar pelotas y objetos hacia un punto.",
        "Nombra objetos y acciones mientras juega, conversa y explora su entorno cercano.": "Nombra objetos y acciones al jugar y explorar.",
        "Elige e imita la acción de leer al explorar libros ilustrados de su interés.": "Imita leer al explorar libros ilustrados.",
        "Participa en acciones cotidianas de lavado de manos, bañarse y cepillarse con apoyo del adulto.": "Participa en lavado de manos y aseo con apoyo.",
        "Controla de manera progresiva su cuerpo al colocarse de pie sin apoyo.": "Se coloca de pie sin apoyo progresivamente.",
        "Expresa ideas y sentimientos libremente de forma gráfica de manera no convencional.": "Expresa ideas gráficamente de manera no convencional.",
        "Realiza juegos y ejercicio de arrastres, de empuje y golpeo de objetos usando sus manos y pies.": "Realiza juegos de arrastre, empuje y golpeo de objetos.",
        "Se identifica a sí mismo, a sus pares y personas cercanas en diferentes representaciones.": "Se identifica a sí mismo y a personas cercanas.",
        "Tolera en sus interacciones si otras personas utilizan juguetes u objetos comunes.": "Tolera que otros usen juguetes u objetos comunes.",
        "Juega mientras explora el ambiente que le rodea con cierta independencia y seguridad.": "Juega y explora con independencia y seguridad.",
        "Usa normas sociales en sus interacciones cuando se le solicita.": "Usa normas sociales cuando se le solicita.",
        "Trepa sobre superficies inclinadas con progresiva confianza.": "Trepa superficies inclinadas con confianza.",
      };
      return parvulo2Summaries[desc] || desc;
    }

    const summaries: Record<string, string> = {
      // Prekinder specific summaries
      "Expresa sus sentimientos, emociones e ideas de forma gráfica o escrita, al escuchar narraciones, mensajes, cuentos, canciones, poesías leídas por otras personas, de manera no convencional.": "Expresa sentimientos gráficamente al escuchar narraciones.",
      "Sigue una secuencia en el uso de algunos textos orales, en situaciones cotidianas de comunicación al expresar sentimientos, gestos, emociones y movimientos corporales.": "Sigue secuencia en textos orales cotidianos.",
      "Usa diversas formas de expresión con intención de comunicar sus ideas, opiniones, emociones, sentimientos y experiencias.": "Usa diversas formas de expresión comunicativa.",
      "Realiza producciones plásticas bidimensionales (dibujo) seleccionando y combinando colores primarios y secundarios al representar ideas reales o imaginarias.": "Dibuja combinando colores primarios y secundarios.",
      "Explora con su cuerpo sonidos y movimientos, de forma libre y siguiendo un ritmo.": "Explora sonidos y movimientos con su cuerpo.",
      "Explora las posibilidades sonoras de su voz y de sonidos producidos al percutir, sacudir o frotar instrumentos musicales y objetos o materiales de su entorno.": "Explora sonidos con voz e instrumentos.",
      "Comprende e interpreta mensajes a partir de imágenes y símbolos, en textos sencillos y establece comparaciones progresivas en palabras que inician o terminan similar, a partir del sonido o la grafía.": "Interpreta mensajes y compara palabras similares.",
      "Produce textos orales y los expone en lenguaje no verbal (gestos, ademanes, postura…) y paraverbal (entonación, ritmo, pausa, intensidad…), de acuerdo a sus necesidades.": "Produce textos orales con lenguaje verbal y no verbal.",
      "Comunica sus ideas, pensamientos, emociones y experiencias con la finalidad de que los demás puedan entender lo que pretende comunicar.": "Comunica ideas claramente.",
      "Utiliza técnicas y materiales en sus producciones para expresar sus emociones, sentimientos, ideas y experiencias.": "Expresa emociones con técnicas.",
      "Escucha y valora las opiniones de los demás.": "Escucha y valora opiniones.",
      "Expresa ideas y sentimientos a través de imágenes sencillas creadas con masillas.": "Crea con masillas.",
      "Usa frases sencillas organizadas en forma lógica, crítica y creativa en la descripción de situaciones cotidianas y objetos de su entorno inmediato, y a través de ilustraciones.": "Describe con frases lógicas.",
      "Describe situaciones problemáticas del entorno, ubicándolas de forma adecuada y creativa.": "Describe problemas.",
      "Identifica y comparte sus gustos y preferencias con respeto, cortesía expresiones muy breves y sencillas.": "Comparte gustos con respeto.",
      "Valora a sus compañeros respetando sus ideas y sentimientos.": "Respeta a compañeros.",
      "Identifica al menos 3 o 4 elementos de la cultura dominicana.": "Identifica cultura.",
      "Comprensión de la importancia del manejo adecuado de los desechos.": "Comprende manejo de desechos.",
      "Usa diversas formas de los lenguajes de las artes y materiales de desecho con intención de comunicar sus ideas (reales o imaginarias), opiniones, emociones, sentimientos y experiencias.": "Comunica con artes.",
      "Explora y manipula títeres y objetos y los incorpora al juego o improvisaciones lúdicas.": "Usa títeres en juegos.",
      "Explora las posibilidades sonoras de su cuerpo, voz y de sonidos producidos al percutir, sacudir o frotar instrumentos musicales y objetos o materiales de su entorno.": "Explora sonidos.",
      "Entona canciones infantiles y las acompaña con instrumentos de percusión menor.": "Canta con instrumentos.",
      "Escucha con atención cuentos musicales, identificando los sonidos de voces e instrumentos.": "Identifica sonidos.",
      "Mueve su cuerpo de forma espontánea, con estímulos sonoros de origen diverso.": "Se mueve con música.",
      "Reproduce patrones rítmicos sencillos con su cuerpo, su voz o instrumentos.": "Reproduce ritmos.",
      "Realiza movimientos en diferentes direcciones, posiciones y velocidades, según indicaciones.": "Realiza movimientos variados.",
      "Realiza movimientos en diferentes direcciones y velocidades, de forma libre y siguiendo un ritmo.": "Realiza movimientos variados con ritmo.",
      "Realiza juegos de desplazamiento en el espacio, mostrando progresión en la estabilidad y equilibrio de su cuerpo según indicaciones derecha- izquierda.": "Se desplaza con equilibrio derecha-izquierda.",
      "Ubica objetos y realiza movimientos según indicaciones derecha- izquierda, con relación a su cuerpo.": "Ubica derecha-izquierda.",
      "Explora y manipula objetos y los incorpora al juego o improvisaciones lúdicas.": "Incorpora objetos en juegos.",
      "Explora y manipula objetos y los incorpora al juego o improvisaciones lúdicas al representar situaciones reales o imaginarias.": "Incorpora objetos en juegos.",
      "Imita situaciones reales e imaginaria a partir canciones, juegos de rondas o cuentos cortos.": "Imita situaciones.",
      "Participa en juegos grupales reglados de reglas, aceptando procedimientos acordados en el grupo.": "Participa en juegos con reglas.",
      "Realiza movimientos con algunas partes de su cuerpo de manera coordinada en el espacio parcial y total.": "Coordina movimientos.",
      "Realiza desplazamientos en el espacio mostrando estabilidad y equilibrio en sus movimientos.": "Se desplaza con equilibrio.",
      "Experimenta con su cuerpo movimientos de estiramiento, relajación y descanso, al finalizar actividades físicas.": "Practica relajación.",
      "Experimenta con su cuerpo movimientos de estiramiento, relajación y descanso, al iniciar y al finalizar actividades físicas.": "Practica estiramiento y relajación.",
      "Participa en actividades de higiene y cuidado personal, con apoyo del adulto.": "Participa en higiene.",
      "Describe situaciones de su comunidad local a partir de observación, exploración y preguntas, con el apoyo de adultos.": "Describe situaciones comunitarias.",
      "Participa en proyectos sobre problemas sencillos que afectan su comunidad.": "Participa en proyectos.",
      "Colabora en la búsqueda de información con ayuda del adulto, sobre temas de interés de su entorno inmediato natural y fenómenos naturales.": "Busca información.",
      "Cuestiona, observa y explora su entorno natural cercano con ayuda de otras personas.": "Explora entorno.",
      "Usa utensilios, artefactos de su entorno o recursos tecnológicos, al realizar experimentos sencillos.": "Usa herramientas.",
      "Registra los resultados de la exploración del entorno natural de forma oral, escrita o gráfica, de manera convencional o no.": "Registra resultados.",
      "Identifica algunas semejanzas y diferencias entre seres vivos de su entorno.": "Compara seres vivos.",
      "Utiliza informaciones sobre personas, animales u objetos conocidos para apoyar sus explicaciones.": "Usa información.",
      "Colabora y explica algunas medidas en actividades de protección y cuidado del entorno escolar, recursos, sus plantas y animales.": "Cuida el entorno.",
      "Ordena hechos sencillos de la realidad ocurridos en su entorno inmediato utilizando su imaginación.": "Ordena hechos.",
      "Predice acontecimientos explicando lo ocurrido de acuerdo con su conocimiento y experiencias previas.": "Predice eventos.",
      "Asume progresivamente las reglas acordadas en algunos juegos.": "Asume reglas.",
      "Integra de manera espontánea objetos del entorno cercano a sus juegos simulando situaciones reales o imaginarias.": "Integra objetos en juegos.",
      "Responde a preguntas sobre situaciones o actividades que se desarrollan en su contexto inmediato.": "Responde preguntas.",
      "Expresa sus ideas sobre lo que observa y las actividades cotidianas que realiza.": "Expresa ideas.",
      "Expresa a los demás sus acuerdos o desacuerdos ante situaciones o hechos cotidiano.": "Expresa acuerdos.",
      "Participa en la búsqueda y selección de alternativas al solucionar situaciones cotidianas.": "Busca soluciones.",
      "Colabora en la puesta en búsqueda de la solución acordada de problemas sencillos o situaciones cotidianas que afectan a sí mismo o al grupo.": "Colabora en soluciones.",
      "Sigue una secuencia en el uso de textos orales que escucha, en situaciones cotidianas de comunicación.": "Sigue secuencias.",
      "Formula y responde a preguntas, al obtener informaciones sobre temas de su interés.": "Formula preguntas.",
      "Asume progresivamente normas de comunicación establecidas.": "Asume normas.",
      "Responde a preguntas sencillas sobre la idea general de un texto.": "Responde sobre textos.",
      "Interpreta mensajes a partir de imágenes y símbolos, en textos sencillos y establece comparaciones progresivas en palabras que inician o terminan similar, a partir del sonido o la grafía.": "Interpreta imágenes.",
      "Lee progresivamente, de manera no convencional o convencional, imágenes y palabras en textos sencillos, comprendiendo su significado literal y utiliza algunas formas convencionales de lectura.": "Lee imágenes y palabras.",
      "Expresa con sus palabras ideas o información escuchadas o leídas en textos funcionales y literarios de manera no convencional o progresivamente convencional.": "Expresa lo leído.",
      "Escribe su nombre de manera no convencional o progresivamente convencional.": "Escribe su nombre.",
      "Reproduce o produce textos basados en situaciones reales e imaginarias de manera no convencional y progresivamente convencional, utilizando algunos recursos o medios tecnológicos o convencionales.": "Produce textos."
    };

    if (curso === "Preprimario") {
      const preprimarioSummaries: Record<string, string> = {
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



  const getIndicatorDistribution = (data: BulletinData) => {
    // Clone and summarize
    const allIndicators = [...data.indicadores].sort((a, b) => a.orden - b.orden).map(ind => ({
      ...ind,
      descripcion: summarizeIndicator(ind.descripcion, data.estudiante.curso)
    }));

    const normalizeCat = (cat: string | null) => (cat || "").trim().toLowerCase();
    const courseName = (data.estudiante.curso || "").trim();

    if (courseName === "Kinder") {
      const getByDomain = (domainFragment: string) => allIndicators.filter(ind =>
        normalizeCat(ind.nombre_categoria).includes(domainFragment.toLowerCase())
      );

      const socioemocional = getByDomain("socioemocional");
      const artistico = getByDomain("artístico")
        .concat(getByDomain("artistico"))
        .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i); // Dedupe

      const psicomotor = getByDomain("psicomotor");
      const descubrimiento = getByDomain("descubrimiento");
      const cognitivo = getByDomain("cognitivo");
      const comunicativo = getByDomain("comunicativo");

      // Logic derived from BulletinPreview:
      // Left: Socioemocional + Artistico + Psicomotor(Left 4)
      // Right: Psicomotor(Right) + Descubrimiento + Cognitivo(Matrix)
      // Obs: Cognitivo(Last 5) OR Communicativo(Last X) depending on data availability.
      // Standard for Kinder usually puts Communicativo or part of Cognitivo in observations.

      // If Communicativo exists, use it for observations (standard flow if available)
      if (comunicativo.length > 0) {
        const psicomotorLeft = psicomotor.slice(0, 4);
        const psicomotorRight = psicomotor.slice(4);

        return {
          leftIndicators: [
            ...socioemocional,
            ...artistico,
            ...psicomotorLeft
          ],
          rightIndicators: [
            ...psicomotorRight,
            ...descubrimiento,
            ...cognitivo
          ],
          observationsIndicators: comunicativo
        };
      } else {
        // Fallback: Use Cognitivo split if Communicativo is missing/empty
        const cognitivoForMatrix = cognitivo.slice(0, -5);
        const cognitivoForObservations = cognitivo.slice(-5);
        const psicomotorLeft = psicomotor.slice(0, 4);
        const psicomotorRight = psicomotor.slice(4);

        return {
          leftIndicators: [...socioemocional, ...artistico, ...psicomotorLeft],
          rightIndicators: [...psicomotorRight, ...descubrimiento, ...cognitivoForMatrix],
          observationsIndicators: cognitivoForObservations
        };
      }
    }

    if (courseName === "Prekinder") {
      const getByDomain = (domainFragment: string) => allIndicators.filter(ind =>
        normalizeCat(ind.nombre_categoria).includes(domainFragment.toLowerCase())
      );

      const socioemocional = getByDomain("socioemocional");
      const artistico = getByDomain("artístico").concat(getByDomain("artistico")).filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
      const psicomotor = getByDomain("psicomotor");
      const descubrimiento = getByDomain("descubrimiento");
      const cognitivo = getByDomain("cognitivo");
      const comunicativo = getByDomain("comunicativo");

      // Prekinder logic: 
      // Left: Socio + Art + Psico(half)
      // Right: Psico(half) + Descu + Cogni
      // Obs: Comunicativo

      const psicomotorHalf = Math.ceil(psicomotor.length / 2);
      const psicomotorLeft = psicomotor.slice(0, psicomotorHalf);
      const psicomotorRight = psicomotor.slice(psicomotorHalf);

      return {
        leftIndicators: [
          ...socioemocional,
          ...artistico,
          ...psicomotorLeft
        ],
        rightIndicators: [
          ...psicomotorRight,
          ...descubrimiento,
          ...cognitivo
        ],
        observationsIndicators: comunicativo
      };
    }

    if (courseName === "Párvulo II") {
      const relacionesSocioafectivas = allIndicators.filter(ind => normalizeCat(ind.nombre_categoria).includes("relaciones"));
      const descubrimientoEntorno = allIndicators.filter(ind => normalizeCat(ind.nombre_categoria).includes("descubrimiento"));
      const comunicativoIndicators = allIndicators.filter(ind => normalizeCat(ind.nombre_categoria).includes("lenguaje"));

      const comunicativoForMatrix = comunicativoIndicators.slice(0, -12);
      const comunicativoForObservations = comunicativoIndicators.slice(-12);

      const descubrimientoLeft = descubrimientoEntorno.slice(0, 13);
      const descubrimientoRight = descubrimientoEntorno.slice(13);

      return {
        leftIndicators: [...relacionesSocioafectivas, ...descubrimientoLeft],
        rightIndicators: [...descubrimientoRight, ...comunicativoForMatrix],
        observationsIndicators: comunicativoForObservations
      };
    }

    if (courseName === "Preprimario") {
      const getByDomain = (domainFragment: string) => allIndicators.filter(ind =>
        normalizeCat(ind.nombre_categoria).includes(domainFragment.toLowerCase())
      );

      const socioemocional = getByDomain("socioemocional");
      const artistico = getByDomain("artístico").concat(getByDomain("artistico")).filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
      const psicomotor = getByDomain("psicomotor");
      const descubrimiento = getByDomain("descubrimiento");
      const cognitivo = getByDomain("cognitivo");
      const comunicativo = getByDomain("comunicativo");

      const comunicativoForMatrix = comunicativo.slice(0, -8);
      const comunicativoForObservations = comunicativo.slice(-8);

      const psicomotorLeft = psicomotor.slice(0, -3);
      const psicomotorRight = psicomotor.slice(-3);

      return {
        leftIndicators: [...socioemocional, ...artistico, ...psicomotorLeft],
        rightIndicators: [...psicomotorRight, ...descubrimiento, ...cognitivo, ...comunicativoForMatrix],
        observationsIndicators: comunicativoForObservations
      };
    }

    // PÁRVULO III LOGIC
    const cursoNorm = normalizeCat(courseName);
    if (cursoNorm.includes("parvulo iii") || cursoNorm.includes("parvulo 3")) {
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
        "Cede ante",
        "Se aleja del adulto interactuando",
        "Identifica y señala partes de su cuerpo",
        "Interactúa con objetos",
        "Interactúa con elementos",
        "Relaciona características de su cuerpo",
        "Realiza juegos motrices",
        "Realiza juegos y actividades motrices",
        "Realiza acciones de vestirse",
        "Participa en juegos motrices",
        "Expresa ideas/sentimientos con acciones",
        "Se desplaza caminando, corriendo",
        "Trepa sobre superficies inclinadas",
        "Mantiene equilibrio en desplazamientos",
        "Participa en lavado de manos"
      ];

      const lenguajeList = [
        "Participa en juegos organizados",
        "Desarrolla imaginación",
        "Agarra objetos grandes y pequeños",
        "Lanza pelotas",
        "Juegos de arrastre, empuje y golpeo",
        "Comprende informaciones de adultos",
        "Realiza preguntas para aclarar",
        "Realiza acciones relacionando",
        "Reconoce sonidos",
        "Realiza instrucciones simples de vida",
        "Escucha y disfruta textos literarios",
        "Dramatiza acciones de textos",
        "Participa en situaciones comunicativas",
        "Emplea lenguaje",
        "Muestra respeto a normas de conversación",
        "Lee no convencionalmente libros",
        "Pregunta sobre contenido de libros",
        "Narra contenido de textos"
      ];

      const normalize = (str: string) => str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      const isInList = (ind: any, list: string[]) => {
        const desc = normalize(ind.original_descripcion || ind.descripcion || "");
        return list.some(item => {
          const itemNorm = normalize(item);
          return desc.includes(itemNorm);
        });
      };

      let relaciones = allIndicators.filter(ind => isInList(ind, relacionesList));

      let descubrimiento = allIndicators.filter(ind => {
        const desc = normalize(ind.original_descripcion || ind.descripcion || "");
        if (desc.includes(normalize("Interactúa con objetos")) || desc.includes(normalize("Interactúa con elementos"))) return true;
        if (desc.includes(normalize("Realiza juegos motrices")) || desc.includes(normalize("Realiza juegos y actividades"))) return true;
        if (desc.includes(normalize("Participa en juegos motrices")) || desc.includes(normalize("Expresa ideas"))) return true;
        return isInList(ind, descubrimientoList);
      });

      let lenguaje = allIndicators.filter(ind => isInList(ind, lenguajeList));

      const sortByList = (list: string[]) => (a: any, b: any) => {
        const descA = normalize(a.original_descripcion || a.descripcion || "");
        const descB = normalize(b.original_descripcion || b.descripcion || "");
        const indexA = list.findIndex(l => descA.includes(normalize(l)));
        const indexB = list.findIndex(l => descB.includes(normalize(l)));
        const safeIndexA = indexA === -1 ? 999 : indexA;
        const safeIndexB = indexB === -1 ? 999 : indexB;
        return safeIndexA - safeIndexB;
      };

      relaciones.sort(sortByList(relacionesList));

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
          if (desc.includes(normalize("Interactúa con objetos"))) return 10;
          if (desc.includes(normalize("Interactúa con elementos"))) return 11;
          if (desc.includes(normalize("Relaciona características"))) return 12;
          if (desc.includes(normalize("Realiza juegos motrices"))) return 13;
          if (desc.includes(normalize("Realiza juegos y actividades"))) return 14;
          if (desc.includes(normalize("Realiza acciones de vestirse"))) return 15;
          if (desc.includes(normalize("Participa en juegos motrices")) || desc.includes(normalize("Expresa ideas"))) return 16;
          if (desc.includes(normalize("Se desplaza caminando"))) return 17;
          if (desc.includes(normalize("Trepa sobre"))) return 18;
          if (desc.includes(normalize("Mantiene equilibrio"))) return 19;
          if (desc.includes(normalize("Participa en lavado"))) return 20;
          return 99;
        };
        return getOrder(descA) - getOrder(descB);
      });

      lenguaje.sort(sortByList(lenguajeList));

      relaciones = relaciones.map(ind => ({ ...ind, nombre_categoria: "RELACIONES SOCIOAFECTIVAS, IDENTIDAD Y AUTONOMÍA" }));
      descubrimiento = descubrimiento.map(ind => ({ ...ind, nombre_categoria: "DESCUBRIMIENTO DE SU CUERPO Y SU RELACIÓN CON EL ENTORNO" }));
      lenguaje = lenguaje.map(ind => ({ ...ind, nombre_categoria: "LENGUAJE E INTERACCIÓN" }));

      const categorizedIds = new Set([
        ...relaciones.map(i => i.id),
        ...descubrimiento.map(i => i.id),
        ...lenguaje.map(i => i.id)
      ]);

      const others = allIndicators.filter(ind => {
        if (categorizedIds.has(ind.id)) return false;
        const indDescNorm = normalize(ind.original_descripcion || ind.descripcion || "");
        const isDuplicate = [...relaciones, ...descubrimiento, ...lenguaje].some(catInd => {
          const catIndDescNorm = normalize(catInd.original_descripcion || catInd.descripcion || "");
          return indDescNorm.includes(catIndDescNorm) || catIndDescNorm.includes(indDescNorm);
        });
        return !isDuplicate;
      });
      others.sort((a, b) => a.id - b.id);

      // Distribution: L(24) R(23)
      const descubrimientoSplitIndex = 13;
      const descubrimientoPart1 = descubrimiento.slice(0, descubrimientoSplitIndex);
      const descubrimientoPart2 = descubrimiento.slice(descubrimientoSplitIndex);

      const leftIndicators = [...relaciones, ...descubrimientoPart1];
      const rightIndicators = [...descubrimientoPart2, ...lenguaje, ...others];

      return { leftIndicators, rightIndicators, observationsIndicators: [] };
    }




    const totalIndicators = allIndicators.length;
    const halfPoint = Math.ceil(totalIndicators / 2);

    return {
      leftIndicators: allIndicators.slice(0, halfPoint),
      rightIndicators: allIndicators.slice(halfPoint),
      observationsIndicators: []
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <div className="text-gray-700 text-lg font-medium">
          Cargando boletines...
        </div>
        <div className="text-gray-500 text-sm mt-2">
          {loadingProgress.current} de {loadingProgress.total} estudiantes
        </div>
      </div>
    );
  }

  if (allBulletins.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">No hay boletines para imprimir</div>
      </div>
    );
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
            .bulletin-separator {
              page-break-after: always;
            }
          }
          
          body { font-family: 'Roboto', sans-serif; }
        `}
      </style>

      <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => navigate(`/teacher/cursos/${cursoId}`)}
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
          Imprimir Todos ({allBulletins.length})
        </button>
      </div>

      <div className="min-h-screen bg-gray-600 p-5">
        {allBulletins.map((data, bulletinIndex) => {
          const { leftIndicators, rightIndicators, observationsIndicators } = getIndicatorDistribution(data);

          // Dynamic font sizing
          const curso = data.estudiante.curso || "";
          const isKinderLike = ["Kinder", "Prekinder"].includes(curso);
          const isLargeFont = ["Párvulo II", "Párvulo I", "Parvulo I"].includes(curso);
          const isParvulo3 = ["Párvulo III", "Parvulo III", "Párvulo 3", "Parvulo 3"].includes(curso);
          const isMediumFont = curso === "Preprimario";

          let tableTextSize = "text-[9px]";
          let categoryTextSize = "text-[9px]";
          let indicatorTextSize = "text-[8px] leading-tight";

          if (isLargeFont) {
            tableTextSize = "text-[11px]";
            categoryTextSize = "text-[12px]";
            indicatorTextSize = "text-[11px] leading-snug";
          } else if (isKinderLike) {
            // Smaller than Large but bigger than base, optimized for space
            tableTextSize = "text-[10px]";
            categoryTextSize = "text-[11px]";
            indicatorTextSize = "text-[9.5px] leading-tight";
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
            <div key={data.estudiante.id} className="mb-5">
              <div className="flex flex-col items-center gap-5">
                {/* HOJA 1: EXTERIOR (Portada y Observaciones) */}
                <div className="bulletin-sheet bg-white w-[11in] h-[8.5in] pt-[0.4in] px-[0.4in] pb-[0.5in] grid grid-cols-2 gap-[0.6in] shadow-lg">
                  {/* Observaciones */}
                  <div className="border-r border-gray-200 pr-4 flex flex-col">
                    {observationsIndicators && observationsIndicators.length > 0 && (
                      <div className="mb-2">
                        <table className={"w-full border-collapse border-[1.5px] border-black " + tableTextSize}>
                          <thead>
                            <tr>
                              <th className={`border border-gray-600 p-1 bg-blue-50 font-bold text-left uppercase ${categoryTextSize}`} colSpan={10}>
                                Continuación de Indicadores - Dominio Cognitivo
                              </th>
                            </tr>
                            <tr>
                              <th className="border border-gray-600 p-0.5 bg-white font-bold text-center w-1/2">
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
                                  <th key={`${p}-l`} className="border border-gray-600 text-center text-[7px] p-0 w-[11px]">L</th>
                                  <th key={`${p}-p`} className="border border-gray-600 text-center text-[7px] p-0 w-[11px]">P</th>
                                  <th key={`${p}-i`} className="border border-gray-600 text-center text-[7px] p-0 w-[11px]">I</th>
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
                                        <td key={`obs-${ind.id}-p${pIdx}-l`} className="border border-gray-600 text-center p-0 font-bold text-black w-[11px] text-[9px]">
                                          {valor === "Adquirido" ? "✓" : ""}
                                        </td>
                                        <td key={`obs-${ind.id}-p${pIdx}-p`} className="border border-gray-600 text-center p-0 font-bold text-black w-[11px] text-[9px]">
                                          {valor === "En Proceso" ? "✓" : ""}
                                        </td>
                                        <td key={`obs-${ind.id}-p${pIdx}-i`} className="border border-gray-600 text-center p-0 font-bold text-black w-[11px] text-[9px]">
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
                          <div key={periodo} className="border border-black p-1.5 flex flex-col min-h-[80px]">
                            <div className="font-bold bg-gray-100 px-1.5 py-0.5 text-[10px] mb-1 border-b border-gray-300">
                              {periodo}
                            </div>
                            <div className="grid grid-cols-2 gap-1.5 flex-1">
                              <div className="border-r border-gray-300 pr-1.5 flex flex-col">
                                <span className="text-[9px] uppercase font-bold text-gray-600 block mb-0.5">
                                  Cualidades a destacar:
                                </span>
                                <div className="flex-1 text-[9px] leading-tight overflow-hidden whitespace-pre-wrap text-justify">
                                  {obs.cualidades_destacar}
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] uppercase font-bold text-gray-600 block mb-0.5">
                                  Aspectos a estimular:
                                </span>
                                <div className="flex-1 text-[9px] leading-tight overflow-hidden whitespace-pre-wrap text-justify">
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
                        Les invitamos a revisar los indicadores para apoyar el aprendizaje de su hijo/a en casa.
                      </div>
                    </div>
                  </div>
                </div>

                {/* HOJA 2: INTERIOR (Matriz de Indicadores) */}
                <div className="bulletin-sheet bg-white w-[11in] h-[8.5in] pt-[0.4in] px-[0.4in] pb-[0.5in] grid grid-cols-2 gap-[0.6in] shadow-lg">
                  {/* Left Panel */}
                  <div>
                    <table className={"w-full border-collapse border-[1.5px] border-black " + tableTextSize}>
                      <thead>
                        <tr>
                          <th className="border border-gray-600 p-0.5 bg-white font-bold text-center w-[44%]">
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
                              <th key={`${p}-l`} className="border border-gray-600 text-center text-[7px] p-0 w-[10px]">L</th>
                              <th key={`${p}-p`} className="border border-gray-600 text-center text-[7px] p-0 w-[10px]">P</th>
                              <th key={`${p}-i`} className="border border-gray-600 text-center text-[7px] p-0 w-[10px]">I</th>
                            </>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {leftIndicators?.map((ind, index) => {
                          const showCategoryHeader = index === 0 ||
                            ind.nombre_categoria !== leftIndicators?.[index - 1]?.nombre_categoria;

                          return (
                            <>
                              {showCategoryHeader && (
                                <tr key={`cat-${ind.nombre_categoria}-${index}`}>
                                  <td colSpan={10} className={`border border-gray-600 bg-green-50 font-bold uppercase ${categoryTextSize} px-1.5 py-0.5 text-green-900`}>
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
                                      <td key={`left-${ind.id}-p${pIdx}-l`} className="border border-gray-600 text-center p-0 font-bold text-black w-[10px] text-[10px]">
                                        {valor === "Adquirido" ? "✓" : ""}
                                      </td>
                                      <td key={`left-${ind.id}-p${pIdx}-p`} className="border border-gray-600 text-center p-0 font-bold text-black w-[10px] text-[10px]">
                                        {valor === "En Proceso" ? "✓" : ""}
                                      </td>
                                      <td key={`left-${ind.id}-p${pIdx}-i`} className="border border-gray-600 text-center p-0 font-bold text-black w-[10px] text-[10px]">
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
                    <table className={"w-full border-collapse border-[1.5px] border-black " + tableTextSize}>
                      <thead>
                        <tr>
                          <th className="border border-gray-600 p-0.5 bg-white font-bold text-center w-[44%]">
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
                              <th key={`${p}-l`} className="border border-gray-600 text-center text-[7px] p-0 w-[10px]">L</th>
                              <th key={`${p}-p`} className="border border-gray-600 text-center text-[7px] p-0 w-[10px]">P</th>
                              <th key={`${p}-i`} className="border border-gray-600 text-center text-[7px] p-0 w-[10px]">I</th>
                            </>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rightIndicators?.map((ind, index) => {
                          const showCategoryHeader = index === 0 ||
                            ind.nombre_categoria !== rightIndicators?.[index - 1]?.nombre_categoria;

                          return (
                            <>
                              {showCategoryHeader && (
                                <tr key={`cat-${ind.nombre_categoria}-${index}`}>
                                  <td colSpan={10} className={`border border-gray-600 bg-green-50 font-bold uppercase ${categoryTextSize} px-1.5 py-0.5 text-green-900`}>
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
                                      <td key={`right-${ind.id}-p${pIdx}-l`} className="border border-gray-600 text-center p-0 font-bold text-black w-[10px] text-[10px]">
                                        {valor === "Adquirido" ? "✓" : ""}
                                      </td>
                                      <td key={`right-${ind.id}-p${pIdx}-p`} className="border border-gray-600 text-center p-0 font-bold text-black w-[10px] text-[10px]">
                                        {valor === "En Proceso" ? "✓" : ""}
                                      </td>
                                      <td key={`right-${ind.id}-p${pIdx}-i`} className="border border-gray-600 text-center p-0 font-bold text-black w-[10px] text-[10px]">
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

              {/* Add page break between students (except for the last one) */}
              {bulletinIndex < allBulletins.length - 1 && (
                <div className="bulletin-separator" style={{ height: '20px' }}></div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
