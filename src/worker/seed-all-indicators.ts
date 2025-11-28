// Complete seed data for all indicators from the structure document
type D1Database = any;

export async function seedAllIndicators(db: D1Database): Promise<{ success: boolean; count: number; total: number }> {
  try {
    console.log("Starting indicator seeding process...");

    // First, create all categories
    const categories = [
      { nombre: "Relaciones socioafectivas, identidad y autonomía", descripcion: "Párvulo I, II, III" },
      { nombre: "Lenguaje e Interacción", descripcion: "Párvulo I" },
      { nombre: "Lenguaje e interacción", descripcion: "Párvulo I, II, III" },
      { nombre: "Descubrimiento de su cuerpo y su relación con el entorno", descripcion: "Párvulo I, II, III" },
      { nombre: "Dominio Socioemocional", descripcion: "Prekinder, Kinder, Preprimario" },
      { nombre: "Dominio Artístico y Creativo", descripcion: "Prekinder, Kinder, Preprimario" },
      { nombre: "Dominio Psicomotor y de Salud", descripcion: "Prekinder, Kinder, Preprimario" },
      { nombre: "Dominio Descubrimiento del Mundo", descripcion: "Prekinder, Kinder, Preprimario" },
      { nombre: "Dominio Cognitivo", descripcion: "Prekinder, Kinder, Preprimario" },
      { nombre: "Dominio Comunicativo", descripcion: "Prekinder, Kinder, Preprimario" },
    ];

    const categoryMap: Record<string, number> = {};

    console.log("Creating/loading categories...");
    for (const cat of categories) {
      try {
        const existing = await db.prepare(
          "SELECT id FROM categorias_indicadores WHERE nombre_categoria = ?"
        ).bind(cat.nombre).first();

        if (!existing) {
          const result = await db.prepare(
            "INSERT INTO categorias_indicadores (nombre_categoria, descripcion) VALUES (?, ?)"
          ).bind(cat.nombre, cat.descripcion).run();
          categoryMap[cat.nombre] = result.meta.last_row_id as number;
          console.log(`Created category: ${cat.nombre}`);
        } else {
          categoryMap[cat.nombre] = (existing as any).id;
          console.log(`Found existing category: ${cat.nombre}`);
        }
      } catch (err) {
        console.error(`Error processing category ${cat.nombre}:`, err);
        throw err;
      }
    }

    console.log(`Categories processed: ${Object.keys(categoryMap).length}`);

    // Define all indicators with their data
    const indicators = [
      // Párvulo I - Nivel 1 (45 días a 6 meses)
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Expresa sus necesidades, sentimientos llorando, moviendo su cuerpo o vocalizando y gestos de satisfacción al reconocer personas familiares.", orden: 1 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Muestra agrado ante las demostraciones de afecto por medio al contacto corporal, visual, por medio de conversaciones, arrullos y nanas.", orden: 2 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Imita las reacciones y movimientos que ve en las interacciones con sus cuidadores.", orden: 3 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Explora su entorno cercano con apoyo del adulto o por sí solo.", orden: 4 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Reacciona al escuchar su nombre.", orden: 5 },

      { cat: "Lenguaje e Interacción", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Presta atención al lenguaje reaccionando a la interacción comunicativa de personas cercanas y las canciones de cuna o arrullos.", orden: 6 },
      { cat: "Lenguaje e Interacción", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Crea los significados a partir de la narración que hace el adulto sobre gestos, vocalizaciones, las acciones y emociones del momento.", orden: 7 },
      { cat: "Lenguaje e Interacción", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Expresa sus necesidades por medio de gestos globales e indiferenciados, contacto visual, gritos, llantos y movimientos involuntarios.", orden: 8 },
      { cat: "Lenguaje e Interacción", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Observa con interés los objetos, imágenes de libros ilustrados.", orden: 9 },

      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Sostiene la cabeza y busca con la misma los sonidos que escucha del medio.", orden: 10 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Percibe las partes de su cuerpo mediante masajes y movimientos o juegos corporales que le realiza el adulto.", orden: 11 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Juega con manos y pies usando juguetes, utiliza sus dedos para agarrar objetos pequeños, lo entra y lo saca de una caja con apoyo interactuando en su medio.", orden: 12 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Manifiesta sus emociones espontáneamente con movimientos del cuerpo y por medio de gestos y llantos.", orden: 13 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Realiza movimientos con el cuerpo: expresiones faciales, gestos y llantos ante situaciones en el entorno y acciones que percibe del adulto.", orden: 14 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Empuja su cuerpo con las piernas sobre una superficie plana.", orden: 15 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Gira su cuerpo con su abdomen a 360 grados empujándose con los pies.", orden: 16 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Arrastra su cuerpo colocándolo en patrón cruzado, mano izquierda y pie derecho, mano derecha y pie izquierdo.", orden: 17 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Alcanza objetos con las manos en posición boca abajo e impulsándose con los pies.", orden: 18 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Balancea su cuerpo de derecha a izquierda.", orden: 19 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Desplaza su cuerpo gateando y arrastrándose sobre superficies planas.", orden: 20 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Manifiesta alegría al observarse cuando ve su imagen en el espejo con la asistencia de un adulto.", orden: 21 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Juega con algunas partes de su cuerpo como son las manos y los pies.", orden: 22 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 1 (45 días a 6 meses)", desc: "Muestra placer y alegría al jugar tocándose sus manos, pies y los dedos.", orden: 23 },

      // Párvulo I - Nivel 2 (6 meses a 1 año)
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Expresa sentimientos, necesidades e intereses con vocalizaciones, gestos, caricias y palabras.", orden: 100 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Reacciona ante las demostraciones de afecto de las personas familiares y extrañas.", orden: 101 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Demuestra apego hacia las personas de su afecto y se separa por corto tiempo.", orden: 102 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Participa en actividades de su higiene y alimentación, de acuerdo con su desarrollo motor.", orden: 103 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Reconoce su imagen y de personas cercanas en diferentes representaciones.", orden: 104 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Responde cuando le llaman por su nombre e intenta decirlo.", orden: 105 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Reconoce por su nombre a miembros de su familia y personas significativas.", orden: 106 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Explora por sí solo su entorno cercano y reconoce objetos.", orden: 107 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Imita normas sociales en sus interacciones.", orden: 108 },

      { cat: "Lenguaje e interacción", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Imita gestos y expresiones al manifestar sus necesidades a sus pares y personas adultas.", orden: 109 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Usa espontáneamente gestos, expresiones al manifestar sus necesidades, con sus pares y personas adultas.", orden: 110 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Comprende las informaciones emitidas durante la conversación con pares y otras personas.", orden: 111 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Usa palabra- frase, gestos y movimientos corporales unidas a las acciones cotidianas al expresar sus intereses, emociones y necesidades.", orden: 112 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Presta atención, aprecia las imágenes de libros ilustrados y comprende nombres, elementos, personajes y algunas de sus características.", orden: 113 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Interactúa y disfruta las situaciones comunicativas que integran libros de imágenes y las expresiones literarias acompañados de movimientos.", orden: 114 },

      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Se pone de pie con apoyos de un adulto para lograrlo, iniciando el proceso del caminar.", orden: 115 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Mantiene el equilibrio en cambios de posición de sentado a parado.", orden: 116 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Toca con sus manos algunas partes de su cuerpo imitando acciones del adulto.", orden: 117 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Juega con sus manos y pies al interactuar con juguetes y objetos de uso cotidiano.", orden: 118 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Imita movimientos sencillos de las manos, los brazos y la cabeza del adulto para expresarse con su cuerpo.", orden: 119 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Realiza movimientos del cuerpo, gestos y llantos ante situaciones del entorno y acciones que percibe del adulto.", orden: 120 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Manifiesta sus emociones espontáneamente con movimientos del cuerpo y por medio de gestos y llantos.", orden: 121 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Desplaza su cuerpo gateando y arrastrándose sobre superficies planas.", orden: 122 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Gira su cuerpo rodando en diferentes direcciones.", orden: 123 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Arrastra su cuerpo reptando en dirección frontal.", orden: 124 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Alcanza objetos con las manos en posición boca abajo e impulsándose con los pies.", orden: 125 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Balancea su cuerpo de derecha a izquierda.", orden: 126 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Aprieta y suelta objetos blandos por indicación e imitación del adulto.", orden: 127 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Interactúa con juguetes y objetos de uso cotidiano.", orden: 128 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Entra y saca objetos de una caja sin asistencia y con la indicación de un adulto.", orden: 129 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Juega con algunas partes de su cuerpo como son las manos y los pies.", orden: 130 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo I - Nivel 2 (6 meses a 1 año)", desc: "Muestra placer y alegría al jugar tocándose sus manos, pies y los dedos.", orden: 131 },

      // Párvulo II
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo II", desc: "Reconoce objetos y espacios habituales.", orden: 200 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo II", desc: "Usa normas sociales en sus interacciones cuando se le solicita.", orden: 201 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo II", desc: "Expresa sentimientos y afectos hacia otros.", orden: 202 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo II", desc: "Juega mientras explora el ambiente que le rodea con cierta independencia y seguridad.", orden: 203 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo II", desc: "Decide qué actividad le gusta o no realizar.", orden: 204 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo II", desc: "Se identifica a sí mismo, a sus pares y personas cercanas en diferentes representaciones.", orden: 205 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo II", desc: "Responde y expresa su nombre.", orden: 206 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo II", desc: "Tolera en sus interacciones si otras personas utilizan juguetes u objetos comunes.", orden: 207 },

      { cat: "Lenguaje e interacción", nivel: "Párvulo II", desc: "Reconoce objetos, personas, animales del entorno cercano nombrados por otra persona en situaciones comunicativas.", orden: 208 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo II", desc: "Sigue instrucciones asociados a actividades de rutina expresadas en oraciones simples y palabras conocidas.", orden: 209 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo II", desc: "Responde preguntas simples.", orden: 210 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo II", desc: "Imita sonidos y movimientos expresados en cuentos cortos/repetitivo, poesías rimadas, canciones.", orden: 211 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo II", desc: "Expresa sus necesidades fisiológicas, socioafectivas y/o de juego acompañando su acción con palabras, primeras frases, gestos y movimientos voluntarios.", orden: 212 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo II", desc: "Nombra objetos y acciones mientras juega, conversa y explora su entorno cercano.", orden: 213 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo II", desc: "Elige e imita la acción de leer al explorar libros ilustrados de su interés.", orden: 214 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo II", desc: "Formula pregunta al explorar libros ilustrados.", orden: 215 },

      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo II", desc: "Se desplaza caminando, corriendo, y saltando en superficies planas en diversas direcciones, a distancias cortas, con o sin obstáculos con estabilidad, equilibrio y confianza.", orden: 216 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo II", desc: "Trepa sobre superficies inclinadas con progresiva confianza.", orden: 217 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo II", desc: "Mantiene el equilibrio en la ejecución de desplazamientos como caminar por una línea recta y curvas trazadas en el piso y trepar pequeñas alturas.", orden: 218 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo II", desc: "Participa en acciones cotidianas de lavado de manos, bañarse y cepillarse con apoyo del adulto.", orden: 219 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo II", desc: "Controla de manera progresiva su cuerpo al colocarse de pie sin apoyo.", orden: 220 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo II", desc: "Manipula con sus manos y pies diferentes materiales y juguetes para producir sonidos libremente a partir de movimientos con su cuerpo.", orden: 221 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo II", desc: "Usa sus manos pelotas pequeñas y medianas y otros objetos, intentando orientarlos hacia un punto.", orden: 222 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo II", desc: "Realiza movimientos en los que coordina ojo-pie y ojo-mano como patear pelotas sin orientación específica o atrapar una pelota pequeña.", orden: 223 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo II", desc: "Expresa ideas y sentimientos libremente de forma gráfica de manera no convencional.", orden: 224 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo II", desc: "Realiza juegos y ejercicio de arrastres, de empuje y golpeo de objetos usando sus manos y pies.", orden: 225 },

      // Párvulo III
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo III", desc: "Elige y completa una actividad simple.", orden: 300 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo III", desc: "Asume responsabilidades de acuerdo con su edad cuando se le pide.", orden: 301 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo III", desc: "Da las gracias, pide por favor, saluda y se despide al salir.", orden: 302 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo III", desc: "Intenta el cumplimiento de acuerdos de pedir la palabra y espera su turno para hablar o realizar actividades rutinarias.", orden: 303 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo III", desc: "Disfruta del juego e interactúa con otras personas motivado por el adulto.", orden: 304 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo III", desc: "Interactúa con otros niños y niñas expresando sus propios intereses de acuerdo a sus posibilidades.", orden: 305 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo III", desc: "Interactúa siguiendo las orientaciones y aceptando que otros utilicen los objetos y juguetes comunes.", orden: 306 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo III", desc: "Utiliza gestos y palabras para manifestar sus emociones.", orden: 307 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo III", desc: "Responde a su nombre y apellidos.", orden: 308 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo III", desc: "Dice su nombre, edad y sexo.", orden: 309 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo III", desc: "Conoce el nombre de personas significativas de su entorno.", orden: 310 },
      { cat: "Relaciones socioafectivas, identidad y autonomía", nivel: "Párvulo III", desc: "Construye torres con mayor precisión.", orden: 311 },

      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo III", desc: "Practica normas de autocuidado con ayuda.", orden: 312 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo III", desc: "Nombra y reconoce algunas de las funciones de las partes externas de su cuerpo.", orden: 313 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo III", desc: "Evita participar en situaciones que le provocan inseguridad buscando al adulto de su afecto cuando se le presentan.", orden: 314 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo III", desc: "Sigue algunas advertencias de seguridad ante objetos y el espacio cercano.", orden: 315 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo III", desc: "Colabora en el cuidado de su cuerpo, objetos y espacios que usa.", orden: 316 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo III", desc: "Cede ante la solicitud de devolución de objetos o juguetes comunes.", orden: 317 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo III", desc: "Se aleja del adulto de su afecto interactuando con otras personas en situaciones que le producen bienestar y seguridad.", orden: 318 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo III", desc: "Realiza juegos en los que identifica y señala algunas partes de su cuerpo reaccionando a la pregunta de un adulto.", orden: 319 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo III", desc: "Interactúa con elementos y objetos de su entorno inmediato, en relación con su tamaño, posición, distancia, espacio, tiempo, peso, textura, temperatura y forma.", orden: 320 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo III", desc: "Relaciona las características de su propio cuerpo con la de sus pares.", orden: 321 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo III", desc: "Realiza juegos y actividades motrices con tiempo medido.", orden: 322 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo III", desc: "Realiza algunas acciones de vestirse como sacarse los zapatos y colabora con el adulto para que lo vista.", orden: 323 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo III", desc: "Participa en juegos y otras acciones motrices para expresar ideas, sentimiento y emociones, al interactuar con su entorno físico y sus familiares más cercanos.", orden: 324 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo III", desc: "Se desplaza caminando, corriendo, y saltando en superficies planas en diversas direcciones, a distancias cortas, con o sin obstáculos con estabilidad, equilibrio y confianza.", orden: 325 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo III", desc: "Trepa sobre superficies inclinadas con progresiva confianza.", orden: 326 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo III", desc: "Mantiene el equilibrio en la ejecución de desplazamientos como caminar por una línea recta y curvas trazadas en el piso y trepar pequeñas alturas.", orden: 327 },
      { cat: "Descubrimiento de su cuerpo y su relación con el entorno", nivel: "Párvulo III", desc: "Participa en acciones cotidianas de lavado de manos, bañarse y cepillarse con apoyo del adulto.", orden: 328 },

      { cat: "Lenguaje e interacción", nivel: "Párvulo III", desc: "Participa en juegos en los que se organiza en filas, hileras, círculos y semicírculos junto a los compañeros.", orden: 329 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo III", desc: "Desarrolla creativamente su imaginación mediante gestos, mímicas, movimientos rítmicos (danzas y formas jugadas), dramatización e imitación de situaciones y movimientos de su entorno.", orden: 330 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo III", desc: "Agarra con las manos objetos grandes y pequeños como medio de exploración de su entorno.", orden: 331 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo III", desc: "Lanza pelotas pequeñas, medianas y otros objetos, intentando orientarlos hacia un punto.", orden: 332 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo III", desc: "Realiza juegos y ejercicios de arrastres, de empuje y golpeo de objetos blandos usando sus manos y pies.", orden: 333 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo III", desc: "Comprende las informaciones y/o mensajes de los adultos y sus pares.", orden: 334 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo III", desc: "Realiza preguntas para aclarar los significados relacionados con experiencias y elementos de vida cotidiana.", orden: 335 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo III", desc: "Realiza acciones o juegos relacionando experiencias o vivencias cotidianas.", orden: 336 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo III", desc: "Reconoce sonidos, mímicas, gestos y emociones relacionados con su medio social y natural.", orden: 337 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo III", desc: "Realiza las instrucciones simples relacionadas con vida cotidiana.", orden: 338 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo III", desc: "Escucha con atención y disfruta textos literarios, narrativos y poéticos tanto tradicionales como contemporáneos.", orden: 339 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo III", desc: "Dramatiza acciones relacionadas con el contenido de textos narrativos y poéticos.", orden: 340 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo III", desc: "Participa en situaciones comunicativas en pequeños grupos y con todo el grupo.", orden: 341 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo III", desc: "Emplea el lenguaje para expresar necesidades, sentimientos y emociones.", orden: 342 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo III", desc: "Muestra respeto a las normas de conversación.", orden: 343 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo III", desc: "Lee no convencionalmente libros ilustrados con textos poéticos y narrativos.", orden: 344 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo III", desc: "Pregunta sobre el contenido de libros ilustrados.", orden: 345 },
      { cat: "Lenguaje e interacción", nivel: "Párvulo III", desc: "Realiza narraciones cortas sobre el contenido de textos literarios sin seguir el orden lógico.", orden: 346 },

      // Prekinder
      { cat: "Dominio Socioemocional", nivel: "Prekinder", desc: "Expresa sus sentimientos, emociones e ideas de forma gráfica o escrita, al escuchar narraciones, mensajes, cuentos, canciones, poesías leídas por otras personas, de manera no convencional.", orden: 400 },
      { cat: "Dominio Socioemocional", nivel: "Prekinder", desc: "Sigue una secuencia en el uso de algunos textos orales, en situaciones cotidianas de comunicación al expresar sentimientos, gestos, emociones y movimientos corporales.", orden: 401 },
      { cat: "Dominio Socioemocional", nivel: "Prekinder", desc: "Usa diversas formas de expresión con intención de comunicar sus ideas, opiniones, emociones, sentimientos y experiencias.", orden: 402 },
      { cat: "Dominio Socioemocional", nivel: "Prekinder", desc: "Colabora en la puesta en práctica de la solución acordada de problemas sencillos o situaciones cotidianas que afectan a sí mismo o al grupo.", orden: 403 },
      { cat: "Dominio Socioemocional", nivel: "Prekinder", desc: "Responde a preguntas sobre situaciones o actividades que se desarrollan en su contexto inmediato.", orden: 404 },
      { cat: "Dominio Socioemocional", nivel: "Prekinder", desc: "Comprende, progresivamente, el orden lógico de actividades en una rutina.", orden: 405 },
      { cat: "Dominio Socioemocional", nivel: "Prekinder", desc: "Expresa las acciones y actitudes que le producen bienestar o no a su persona y a los demás.", orden: 406 },
      { cat: "Dominio Socioemocional", nivel: "Prekinder", desc: "Participa en el cuidado del entorno escolar.", orden: 407 },
      { cat: "Dominio Socioemocional", nivel: "Prekinder", desc: "Demuestra afecto a través de sus gestos, palabras y comportamientos.", orden: 408 },

      { cat: "Dominio Artístico y Creativo", nivel: "Prekinder", desc: "Realiza producciones plásticas bidimensionales (dibujo) al representar ideas reales o imaginarias.", orden: 409 },
      { cat: "Dominio Artístico y Creativo", nivel: "Prekinder", desc: "Maneja títeres de dedos y manos junto a compañeros y compañeras, cantando o contando historias.", orden: 410 },
      { cat: "Dominio Artístico y Creativo", nivel: "Prekinder", desc: "Conversa acerca de las actuaciones de los personajes en dramatizaciones y obras de títeres que observa.", orden: 411 },
      { cat: "Dominio Artístico y Creativo", nivel: "Prekinder", desc: "Realiza producciones plásticas bidimensionales (dibujo) seleccionando y combinando colores primarios y secundarios al representar ideas reales o imaginarias.", orden: 412 },
      { cat: "Dominio Artístico y Creativo", nivel: "Prekinder", desc: "Explora con su cuerpo sonidos y movimientos, de forma libre y siguiendo un ritmo.", orden: 413 },
      { cat: "Dominio Artístico y Creativo", nivel: "Prekinder", desc: "Explora las posibilidades sonoras de su voz y de sonidos producidos al percutir, sacudir o frotar instrumentos musicales y objetos o materiales de su entorno.", orden: 414 },
      { cat: "Dominio Artístico y Creativo", nivel: "Prekinder", desc: "Entona canciones infantiles y las acompaña con instrumentos de percusión menor.", orden: 415 },
      { cat: "Dominio Artístico y Creativo", nivel: "Prekinder", desc: "Reproduce secuencia rítmica y melódica con su cuerpo e instrumentos musicales.", orden: 416 },
      { cat: "Dominio Artístico y Creativo", nivel: "Prekinder", desc: "Participa y colabora en actividades festivas culturales y folklóricas relacionadas con la comunidad local.", orden: 417 },

      { cat: "Dominio Psicomotor y de Salud", nivel: "Prekinder", desc: "Realiza movimientos en diferentes direcciones y velocidades, de forma libre y siguiendo un ritmo.", orden: 418 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Prekinder", desc: "Realiza juegos de desplazamiento en el espacio, mostrando progresión en la estabilidad y equilibrio de su cuerpo según indicaciones derecha- izquierda.", orden: 419 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Prekinder", desc: "Explora y manipula objetos y los incorpora al juego o improvisaciones lúdicas.", orden: 420 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Prekinder", desc: "Experimenta con su cuerpo movimientos de estiramiento, relajación y descanso, al iniciar y al finalizar actividades físicas.", orden: 421 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Prekinder", desc: "Imita de manera espontánea situaciones reales e imaginarias a partir canciones y juegos de rondas.", orden: 422 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Prekinder", desc: "Asume progresivamente las reglas acordadas en algunos juegos.", orden: 423 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Prekinder", desc: "Integra de manera espontánea objetos del entorno cercano a sus juegos simulando situaciones reales o imaginarias.", orden: 424 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Prekinder", desc: "Participa en actividades de higiene y cuidado personal, con apoyo del adulto.", orden: 425 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Prekinder", desc: "Reproduce secuencia rítmica y melódica con su cuerpo e instrumentos musicales.", orden: 426 },

      { cat: "Dominio Descubrimiento del Mundo", nivel: "Prekinder", desc: "Describe situaciones de su comunidad local a partir de preguntas, con el apoyo de adultos.", orden: 427 },
      { cat: "Dominio Descubrimiento del Mundo", nivel: "Prekinder", desc: "Participa en actividades relacionadas con la comunidad local.", orden: 428 },
      { cat: "Dominio Descubrimiento del Mundo", nivel: "Prekinder", desc: "Comparte informaciones con ayuda del adulto, sobre temas de interés de su entorno inmediato.", orden: 429 },
      { cat: "Dominio Descubrimiento del Mundo", nivel: "Prekinder", desc: "Cuestiona, observa y explora su entorno natural a partir de temas de interés.", orden: 430 },
      { cat: "Dominio Descubrimiento del Mundo", nivel: "Prekinder", desc: "Experimenta con su cuerpo movimiento, estiramiento, respiración, relajación y descanso.", orden: 431 },
      { cat: "Dominio Descubrimiento del Mundo", nivel: "Prekinder", desc: "Describe algunas características de los seres vivos de su entorno.", orden: 432 },
      { cat: "Dominio Descubrimiento del Mundo", nivel: "Prekinder", desc: "Dialoga sobre el cuidado y respeto a los seres vivos y su entorno.", orden: 433 },
      { cat: "Dominio Descubrimiento del Mundo", nivel: "Prekinder", desc: "Participan en el cuidado del entorno escolar.", orden: 434 },
      { cat: "Dominio Descubrimiento del Mundo", nivel: "Prekinder", desc: "Colabora en la reducción de la producción de desecho y en su depósito adecuado; así como en acciones cotidianas de uso adecuado de agua y fuente de energía.", orden: 435 },

      { cat: "Dominio Cognitivo", nivel: "Prekinder", desc: "Ordena hechos sencillos de la realidad ocurridos en su entorno inmediato utilizando su imaginación.", orden: 436 },
      { cat: "Dominio Cognitivo", nivel: "Prekinder", desc: "Predice acontecimientos explicando lo ocurrido de acuerdo a su conocimiento y experiencias previas.", orden: 437 },
      { cat: "Dominio Cognitivo", nivel: "Prekinder", desc: "Asume progresivamente las reglas acordadas en algunos juegos.", orden: 438 },
      { cat: "Dominio Cognitivo", nivel: "Prekinder", desc: "Integra de manera espontánea objetos del entorno cercano a sus juegos simulando situaciones reales o imaginarias.", orden: 439 },
      { cat: "Dominio Cognitivo", nivel: "Prekinder", desc: "Responde a preguntas sobre situaciones o actividades que se desarrollan en su contexto inmediato.", orden: 440 },
      { cat: "Dominio Cognitivo", nivel: "Prekinder", desc: "Expresa sus ideas sobre lo que observa y las actividades cotidianas que realiza.", orden: 441 },
      { cat: "Dominio Cognitivo", nivel: "Prekinder", desc: "Expresa a los demás sus acuerdos o desacuerdos ante situaciones o hechos cotidianos.", orden: 442 },
      { cat: "Dominio Cognitivo", nivel: "Prekinder", desc: "Participa en la búsqueda y selección de alternativas al solucionar situaciones cotidianas.", orden: 443 },
      { cat: "Dominio Cognitivo", nivel: "Prekinder", desc: "Colabora en la puesta en práctica de la solución acordada de problemas sencillos o situaciones cotidianas que afectan a sí mismo o al grupo.", orden: 444 },

      { cat: "Dominio Comunicativo", nivel: "Prekinder", desc: "Escucha, textos cortos, asociando imágenes, palabras y frases cortas, mediante la exploración diferentes recursos y medios.", orden: 445 },
      { cat: "Dominio Comunicativo", nivel: "Prekinder", desc: "Comunica ideas mediante imágenes, textos funcionales e icónicos en formato digitales e impreso.", orden: 446 },
      { cat: "Dominio Comunicativo", nivel: "Prekinder", desc: "Comprende e interpreta mensajes a partir de imágenes y símbolos, en textos sencillos y establece comparaciones progresivas en palabras que inician o terminan similar, a partir del sonido o la grafía.", orden: 447 },
      { cat: "Dominio Comunicativo", nivel: "Prekinder", desc: "Produce textos orales y los expone en lenguaje no verbal (gestos, ademanes, postura…) y paraverbal (entonación, ritmo, pausa, intensidad…), de acuerdo a sus necesidades.", orden: 448 },
      { cat: "Dominio Comunicativo", nivel: "Prekinder", desc: "Escucha su nombre e intenta escribirlo de forma no convencional o progresivamente convencional.", orden: 449 },
      { cat: "Dominio Comunicativo", nivel: "Prekinder", desc: "Utiliza la narración en las formas convencionales de lectura con ayuda del adulto.", orden: 450 },
      { cat: "Dominio Comunicativo", nivel: "Prekinder", desc: "Respeta las reglas de convivencia y comunicación, esperando su turno para formular preguntas sencillas de su interés.", orden: 451 },
      { cat: "Dominio Comunicativo", nivel: "Prekinder", desc: "Identifica problemas del entorno y expresa posibles soluciones mediante un tipo de texto oral o manera no convencional.", orden: 452 },
      { cat: "Dominio Comunicativo", nivel: "Prekinder", desc: "Explora textos orales y escritos, sencillos, exponiendo los resultados mediante imágenes, textos orales, utilizando recursos y diversos medios.", orden: 453 },
      { cat: "Dominio Comunicativo", nivel: "Prekinder", desc: "Expresa los valores que escucha e imita, lo escribe o reproduce en el texto oral o de forma no convencional.", orden: 454 },

      // Kinder
      { cat: "Dominio Socioemocional", nivel: "Kinder", desc: "Comunica sus ideas, pensamientos, emociones y experiencias con la finalidad de que los demás puedan entender lo que pretende comunicar.", orden: 500 },
      { cat: "Dominio Socioemocional", nivel: "Kinder", desc: "Utiliza técnicas y materiales en sus producciones para expresar sus emociones, sentimientos, ideas y experiencias.", orden: 501 },
      { cat: "Dominio Socioemocional", nivel: "Kinder", desc: "Escucha y valora las opiniones de los demás.", orden: 502 },
      { cat: "Dominio Socioemocional", nivel: "Kinder", desc: "Expresa ideas y sentimientos a través de imágenes sencillas creadas con masillas.", orden: 503 },
      { cat: "Dominio Socioemocional", nivel: "Kinder", desc: "Usa frases sencillas organizadas en forma lógica, crítica y creativa en la descripción de situaciones cotidianas y objetos de su entorno inmediato, y a través de ilustraciones.", orden: 504 },
      { cat: "Dominio Socioemocional", nivel: "Kinder", desc: "Describe situaciones problemáticas del entorno, ubicándolas de forma adecuada y creativa.", orden: 505 },
      { cat: "Dominio Socioemocional", nivel: "Kinder", desc: "Identifica y comparte sus gustos y preferencias con respeto, cortesía expresiones muy breves y sencillas.", orden: 506 },
      { cat: "Dominio Socioemocional", nivel: "Kinder", desc: "Valora a sus compañeros respetando sus ideas y sentimientos.", orden: 507 },

      { cat: "Dominio Artístico y Creativo", nivel: "Kinder", desc: "Identifica al menos 3 o 4 elementos de la cultura dominicana.", orden: 508 },
      { cat: "Dominio Artístico y Creativo", nivel: "Kinder", desc: "Comprensión de la importancia del manejo adecuado de los desechos.", orden: 509 },
      { cat: "Dominio Artístico y Creativo", nivel: "Kinder", desc: "Usa diversas formas de los lenguajes de las artes y materiales de desecho con intención de comunicar sus ideas (reales o imaginarias), opiniones, emociones, sentimientos y experiencias.", orden: 510 },
      { cat: "Dominio Artístico y Creativo", nivel: "Kinder", desc: "Explora y manipula títeres y objetos y los incorpora al juego o improvisaciones lúdicas.", orden: 511 },
      { cat: "Dominio Artístico y Creativo", nivel: "Kinder", desc: "Explora las posibilidades sonoras de su cuerpo, voz y de sonidos producidos al percutir, sacudir o frotar instrumentos musicales y objetos o materiales de su entorno.", orden: 512 },
      { cat: "Dominio Artístico y Creativo", nivel: "Kinder", desc: "Entona canciones infantiles y las acompaña con instrumentos de percusión menor.", orden: 513 },
      { cat: "Dominio Artístico y Creativo", nivel: "Kinder", desc: "Escucha con atención cuentos musicales, identificando los sonidos de voces e instrumentos.", orden: 514 },
      { cat: "Dominio Artístico y Creativo", nivel: "Kinder", desc: "Mueve su cuerpo de forma espontánea, con estímulos sonoros de origen diverso.", orden: 515 },
      { cat: "Dominio Artístico y Creativo", nivel: "Kinder", desc: "Reproduce patrones rítmicos sencillos con su cuerpo, su voz o instrumentos.", orden: 516 },

      { cat: "Dominio Psicomotor y de Salud", nivel: "Kinder", desc: "Realiza movimientos en diferentes direcciones, posiciones y velocidades, según indicaciones.", orden: 517 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Kinder", desc: "Ubica objetos y realiza movimientos según indicaciones derecha- izquierda, con relación a su cuerpo.", orden: 518 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Kinder", desc: "Explora y manipula objetos y los incorpora al juego o improvisaciones lúdicas al representar situaciones reales o imaginarias.", orden: 519 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Kinder", desc: "Imita situaciones reales e imaginaria a partir canciones, juegos de rondas o cuentos cortos.", orden: 520 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Kinder", desc: "Participa en juegos grupales reglados de reglas, aceptando procedimientos acordados en el grupo.", orden: 521 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Kinder", desc: "Realiza movimientos con algunas partes de su cuerpo de manera coordinada en el espacio parcial y total.", orden: 522 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Kinder", desc: "Realiza desplazamientos en el espacio mostrando estabilidad y equilibrio en sus movimientos.", orden: 523 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Kinder", desc: "Experimenta con su cuerpo movimientos de estiramiento, relajación y descanso, al finalizar actividades físicas.", orden: 524 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Kinder", desc: "Participa en actividades de higiene y cuidado personal, con apoyo del adulto.", orden: 525 },

      { cat: "Dominio Descubrimiento del mundo", nivel: "Kinder", desc: "Describe situaciones de su comunidad local a partir de observación, exploración y preguntas, con el apoyo de adultos.", orden: 526 },
      { cat: "Dominio Descubrimiento del mundo", nivel: "Kinder", desc: "Participa en proyectos sobre problemas sencillos que afectan su comunidad.", orden: 527 },
      { cat: "Dominio Descubrimiento del mundo", nivel: "Kinder", desc: "Colabora en la búsqueda de información con ayuda del adulto, sobre temas de interés de su entorno inmediato natural y fenómenos naturales.", orden: 528 },
      { cat: "Dominio Descubrimiento del mundo", nivel: "Kinder", desc: "Cuestiona, observa y explora su entorno natural cercano con ayuda de otras personas.", orden: 529 },
      { cat: "Dominio Descubrimiento del mundo", nivel: "Kinder", desc: "Usa utensilios, artefactos de su entorno o recursos tecnológicos, al realizar experimentos sencillos.", orden: 530 },
      { cat: "Dominio Descubrimiento del mundo", nivel: "Kinder", desc: "Registra los resultados de la exploración del entorno natural de forma oral, escrita o gráfica, de manera convencional o no.", orden: 531 },
      { cat: "Dominio Descubrimiento del mundo", nivel: "Kinder", desc: "Identifica algunas semejanzas y diferencias entre seres vivos de su entorno.", orden: 532 },
      { cat: "Dominio Descubrimiento del mundo", nivel: "Kinder", desc: "Utiliza informaciones sobre personas, animales u objetos conocidos para apoyar sus explicaciones.", orden: 533 },
      { cat: "Dominio Descubrimiento del mundo", nivel: "Kinder", desc: "Colabora y explica algunas medidas en actividades de protección y cuidado del entorno escolar, recursos, sus plantas y animales.", orden: 534 },

      { cat: "Dominio Cognitivo", nivel: "Kinder", desc: "Ordena hechos sencillos de la realidad ocurridos en su entorno inmediato utilizando su imaginación.", orden: 535 },
      { cat: "Dominio Cognitivo", nivel: "Kinder", desc: "Predice acontecimientos explicando lo ocurrido de acuerdo con su conocimiento y experiencias previas.", orden: 536 },
      { cat: "Dominio Cognitivo", nivel: "Kinder", desc: "Asume progresivamente las reglas acordadas en algunos juegos.", orden: 537 },
      { cat: "Dominio Cognitivo", nivel: "Kinder", desc: "Integra de manera espontánea objetos del entorno cercano a sus juegos simulando situaciones reales o imaginarias.", orden: 538 },
      { cat: "Dominio Cognitivo", nivel: "Kinder", desc: "Responde a preguntas sobre situaciones o actividades que se desarrollan en su contexto inmediato.", orden: 539 },
      { cat: "Dominio Cognitivo", nivel: "Kinder", desc: "Expresa sus ideas sobre lo que observa y las actividades cotidianas que realiza.", orden: 540 },
      { cat: "Dominio Cognitivo", nivel: "Kinder", desc: "Expresa a los demás sus acuerdos o desacuerdos ante situaciones o hechos cotidiano.", orden: 541 },
      { cat: "Dominio Cognitivo", nivel: "Kinder", desc: "Participa en la búsqueda y selección de alternativas al solucionar situaciones cotidianas.", orden: 542 },
      { cat: "Dominio Cognitivo", nivel: "Kinder", desc: "Colabora en la puesta en búsqueda de la solución acordada de problemas sencillos o situaciones cotidianas que afectan a sí mismo o al grupo.", orden: 543 },

      { cat: "Dominio Comunicativo", nivel: "Kinder", desc: "Sigue una secuencia en el uso de textos orales que escucha, en situaciones cotidianas de comunicación.", orden: 544 },
      { cat: "Dominio Comunicativo", nivel: "Kinder", desc: "Formula y responde a preguntas, al obtener informaciones sobre temas de su interés.", orden: 545 },
      { cat: "Dominio Comunicativo", nivel: "Kinder", desc: "Asume progresivamente normas de comunicación establecidas.", orden: 546 },
      { cat: "Dominio Comunicativo", nivel: "Kinder", desc: "Responde a preguntas sencillas sobre la idea general de un texto.", orden: 547 },
      { cat: "Dominio Comunicativo", nivel: "Kinder", desc: "Interpreta mensajes a partir de imágenes y símbolos, en textos sencillos y establece comparaciones progresivas en palabras que inician o terminan similar, a partir del sonido o la grafía.", orden: 548 },
      { cat: "Dominio Comunicativo", nivel: "Kinder", desc: "Lee progresivamente, de manera no convencional o convencional, imágenes y palabras en textos sencillos, comprendiendo su significado literal y utiliza algunas formas convencionales de lectura.", orden: 549 },
      { cat: "Dominio Comunicativo", nivel: "Kinder", desc: "Expresa con sus palabras ideas o información escuchadas o leídas en textos funcionales y literarios de manera no convencional o progresivamente convencional.", orden: 550 },
      { cat: "Dominio Comunicativo", nivel: "Kinder", desc: "Escribe su nombre de manera no convencional o progresivamente convencional.", orden: 551 },
      { cat: "Dominio Comunicativo", nivel: "Kinder", desc: "Reproduce o produce textos basados en situaciones reales e imaginarias de manera no convencional y progresivamente convencional, utilizando algunos recursos o medios tecnológicos o convencionales.", orden: 552 },

      // Preprimario
      { cat: "Dominio Socioemocional", nivel: "Preprimario", desc: "Se desplaza en diferentes direcciones y posiciones con y sin instrumentos, manteniendo el equilibrio y el control postural, siguiendo secuencias, compases y ritmos compases.", orden: 600 },
      { cat: "Dominio Socioemocional", nivel: "Preprimario", desc: "Experimenta con su cuerpo movimiento, estiramiento, respiración, relajación y descanso.", orden: 601 },
      { cat: "Dominio Socioemocional", nivel: "Preprimario", desc: "Cuida su cuerpo, el de los y las demás, practicando hábitos de higiene antes, durante y después de la realización de actividades físicas.", orden: 602 },
      { cat: "Dominio Socioemocional", nivel: "Preprimario", desc: "Identifica a los miembros de su familia algunas costumbres, tradiciones y ocupaciones de algunos miembros de su comunidad.", orden: 603 },
      { cat: "Dominio Socioemocional", nivel: "Preprimario", desc: "Cumple con sus deberes realizando las actividades escolares que le son solicitadas.", orden: 604 },
      { cat: "Dominio Socioemocional", nivel: "Preprimario", desc: "Comenta sobre las historias, y personajes de su familia y la comunidad.", orden: 605 },

      { cat: "Dominio Descubrimiento del Mundo", nivel: "Preprimario", desc: "Describe algunos eventos y fenómenos naturales, así como las medidas de seguridad.", orden: 606 },
      { cat: "Dominio Descubrimiento del Mundo", nivel: "Preprimario", desc: "Colabora en actividades de manejo adecuado de desechos y reciclaje.", orden: 607 },
      { cat: "Dominio Descubrimiento del Mundo", nivel: "Preprimario", desc: "Participa en proyectos sobre problemáticas sencilla que afectan su comunidad y propone acciones para el cuidado del medio ambiente, las plantas y los animales.", orden: 608 },
      { cat: "Dominio Descubrimiento del Mundo", nivel: "Preprimario", desc: "Participa en pequeños experimentos utilizando elementos manipulables y seguros, realizando inferencias y registrando los resultados de manera convencional o no.", orden: 609 },
      { cat: "Dominio Descubrimiento del Mundo", nivel: "Preprimario", desc: "Comunica resultados de la exploración del entorno natural de forma oral, escrita o gráfica.", orden: 610 },
      { cat: "Dominio Descubrimiento del Mundo", nivel: "Preprimario", desc: "Identifica algunas semejanzas y diferencias entre seres vivos de su entorno.", orden: 611 },

      { cat: "Dominio Cognitivo", nivel: "Preprimario", desc: "Organiza sus ideas para realizar juegos y actividades de la vida cotidiana, así como participa en juegos que abordan procesos lógicos respetando las reglas establecidas y a los participantes.", orden: 612 },
      { cat: "Dominio Cognitivo", nivel: "Preprimario", desc: "Participa en la búsqueda y selección de alternativas al solucionar problemas sencillos, y colabora en la elaboración de un plan de solución sencillo sobre un problema identificado.", orden: 613 },
      { cat: "Dominio Cognitivo", nivel: "Preprimario", desc: "Interpreta imágenes, graficas o símbolos matemáticos no convencionales y convencionales que representan informaciones de su entorno inmediato.", orden: 614 },
      { cat: "Dominio Cognitivo", nivel: "Preprimario", desc: "Descubre orden lógico y secuencia numérica para completar una serie numérica hasta el 9 y realiza operaciones de adición y sustracción con objetos concretos y luego de forma semi-concreta utilizando representaciones numéricas no convencionales y convencionales para resolver problemas sencillos de la cotidianidad.", orden: 615 },
      { cat: "Dominio Cognitivo", nivel: "Preprimario", desc: "Agrupa objetos por iguales características dadas por otras personas o criterios propios y ofrece explicaciones, así como relaciona una idea con otra al analizar situaciones cotidianas, aportando su opinión o conclusión.", orden: 616 },
      { cat: "Dominio Cognitivo", nivel: "Preprimario", desc: "Realiza agrupaciones de objetos de acuerdo con uno o más atributos en la organización de informaciones y solución de situaciones cotidianas.", orden: 617 },
      { cat: "Dominio Cognitivo", nivel: "Preprimario", desc: "Reproduce o crea patrones matemáticos de tamaño, longitud, cantidad o posición, relacionados a una información, usando material concreto o formato digital.", orden: 618 },
      { cat: "Dominio Cognitivo", nivel: "Preprimario", desc: "Utiliza informaciones sobre personas, animales u objetos conocidos para apoyar sus explicaciones o creencias, así como identifica progresivamente actividades de la vida diaria que se encuentran organizadas por patrones.", orden: 619 },

      { cat: "Dominio Comunicativo", nivel: "Preprimario", desc: "Expresa con sus palabras ideas o información escuchadas o leídas en textos funcionales y literarios de manera no convencional o progresivamente convencional.", orden: 620 },
      { cat: "Dominio Comunicativo", nivel: "Preprimario", desc: "Escribe su nombre de manera no convencional o progresivamente convencional.", orden: 621 },
      { cat: "Dominio Comunicativo", nivel: "Preprimario", desc: "Reproduce o produce textos basados en situaciones reales e imaginarias de manera no convencional y progresivamente convencional, utilizan algunos recursos o medios digitales.", orden: 622 },
      { cat: "Dominio Comunicativo", nivel: "Preprimario", desc: "Responde a preguntas sencillas sobre la idea general de un texto.", orden: 623 },
      { cat: "Dominio Comunicativo", nivel: "Preprimario", desc: "Interpreta mensajes a partir de imágenes y símbolos, en textos sencillos y establece comparaciones progresivas en palabras que inician o terminan similar, a partir del sonido o la grafía.", orden: 624 },
      { cat: "Dominio Comunicativo", nivel: "Preprimario", desc: "Lee progresivamente, de manera no convencional o convencional, imágenes y palabras en textos sencillos, comprendiendo su significado literal y utiliza algunas formas convencionales de lectura.", orden: 625 },
      { cat: "Dominio Comunicativo", nivel: "Preprimario", desc: "Sigue una secuencia en el uso de textos orales que escucha, en situaciones cotidianas de comunicación.", orden: 626 },
      { cat: "Dominio Comunicativo", nivel: "Preprimario", desc: "Formula y responde a preguntas, al obtener informaciones sobre temas de su interés.", orden: 627 },
      { cat: "Dominio Comunicativo", nivel: "Preprimario", desc: "Asume progresivamente normas de comunicación establecidas.", orden: 628 },
      { cat: "Dominio Comunicativo", nivel: "Preprimario", desc: "Comunica sus ideas, pensamientos, emociones y experiencias con la intención de que otros comprendan el mensaje.", orden: 629 },
      { cat: "Dominio Comunicativo", nivel: "Preprimario", desc: "Utiliza técnicas y materiales en sus producciones para expresar sus emociones, sentimientos, ideas y experiencias.", orden: 630 },
      { cat: "Dominio Comunicativo", nivel: "Preprimario", desc: "Expresa ideas y sentimientos a través de producciones digitales en creación de imágenes, formas y sonidos.", orden: 631 },

      { cat: "Dominio Artístico y Creativo", nivel: "Preprimario", desc: "Selecciona y combina colores primarios y secundarios, utilizándolos con intencionalidad en sus producciones plásticas bidimensionales y tridimensionales al representar ideas reales o imaginarias.", orden: 632 },
      { cat: "Dominio Artístico y Creativo", nivel: "Preprimario", desc: "Reproduce algunos elementos de la cultura dominicana y de otras culturas, utilizando elementos de los lenguajes artísticos.", orden: 633 },
      { cat: "Dominio Artístico y Creativo", nivel: "Preprimario", desc: "Reproduce o continua a partir de modelos, patrones rítmicos y melódicos con su cuerpo e instrumentos musicales.", orden: 634 },
      { cat: "Dominio Artístico y Creativo", nivel: "Preprimario", desc: "Describe la trama y la participación de algunos personajes de dramatizaciones y obras de títeres, identificando ideas, sentimientos o emociones.", orden: 635 },
      { cat: "Dominio Artístico y Creativo", nivel: "Preprimario", desc: "Maneja títeres sencillos, junto a compañeros y compañeras, contando historias para otras personas.", orden: 636 },
      { cat: "Dominio Artístico y Creativo", nivel: "Preprimario", desc: "Representa situaciones reales e imaginarias a partir de poesías, canciones o cuentos.", orden: 637 },
      { cat: "Dominio Artístico y Creativo", nivel: "Preprimario", desc: "Danza en forma espontánea, rítmica y con materiales diversos.", orden: 638 },
      { cat: "Dominio Artístico y Creativo", nivel: "Preprimario", desc: "Dibuja libremente con mayor precisión e intencionalidad comunicativa, agregando progresivamente elementos del lenguaje plástico a sus producciones.", orden: 639 },
      { cat: "Dominio Artístico y Creativo", nivel: "Preprimario", desc: "Crea figuras bidimensionales y tridimensionales utilizando el papel.", orden: 640 },
      { cat: "Dominio Artístico y Creativo", nivel: "Preprimario", desc: "Escucha con atención cuentos musicales, identificando los sonidos de voces e instrumentos.", orden: 641 },
      { cat: "Dominio Artístico y Creativo", nivel: "Preprimario", desc: "Mueve su cuerpo de forma espontánea, con estímulos sonoros de origen diverso.", orden: 642 },
      { cat: "Dominio Artístico y Creativo", nivel: "Preprimario", desc: "Reproduce patrones rítmicos sencillos con su cuerpo, su voz o instrumentos.", orden: 643 },

      { cat: "Dominio Psicomotor y de Salud", nivel: "Preprimario", desc: "Comunica a través del movimiento una idea, sentimientos o experiencia incorporando objetos al juego o improvisaciones lúdicas.", orden: 644 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Preprimario", desc: "Identifica su lateralidad en la realización de acciones motrices y en la ejecución de diferentes tipos de formaciones (filas, hileras, columnas, círculos, entre otras).", orden: 645 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Preprimario", desc: "Expresa su disponibilidad corporal para la realización y disfrute de la actividad física.", orden: 646 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Preprimario", desc: "Participa en juegos grupales reglados, aceptando y cumpliendo los procedimientos acordados en el grupo.", orden: 647 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Preprimario", desc: "Realiza movimientos con algunas partes de su cuerpo de manera coordinada en el espacio parcial y total.", orden: 648 },
      { cat: "Dominio Psicomotor y de Salud", nivel: "Preprimario", desc: "Realiza movimientos en diferentes direcciones, posiciones y velocidades, según indicaciones.", orden: 649 },
    ];

    // Insert all indicators
    console.log(`Starting to insert ${indicators.length} indicators...`);
    let insertedCount = 0;
    for (let i = 0; i < indicators.length; i++) {
      const ind = indicators[i];
      try {
        const catId = categoryMap[ind.cat];

        if (!catId) {
          console.error(`Category not found for indicator: ${ind.cat}`);
          continue;
        }

        // Check if indicator already exists
        const existing = await db.prepare(
          "SELECT id FROM indicadores WHERE descripcion = ? AND niveles_aplicables = ?"
        ).bind(ind.desc, ind.nivel).first();

        if (!existing) {
          await db.prepare(
            `INSERT INTO indicadores (descripcion, id_categoria, niveles_aplicables, tipo_evaluacion, orden)
             VALUES (?, ?, ?, ?, ?)`
          ).bind(
            ind.desc,
            catId,
            ind.nivel,
            "cualitativa",
            ind.orden
          ).run();
          insertedCount++;

          if (insertedCount % 50 === 0) {
            console.log(`Inserted ${insertedCount} indicators so far...`);
          }
        }
      } catch (err) {
        console.error(`Error inserting indicator ${i + 1} (${ind.nivel}):`, err);
        throw err;
      }
    }

    console.log(`Seeding complete! Inserted ${insertedCount} new indicators out of ${indicators.length} total.`);
    return { success: true, count: insertedCount, total: indicators.length };
  } catch (error) {
    console.error("Error in seedAllIndicators:", error);
    throw error;
  }
}
