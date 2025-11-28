// Seed data for SENI system based on indicator structure

export const CURSOS_SEED = [
  { nombre_curso: "Párvulo I", nivel: "Nivel Inicial", descripcion: "45 días a 1 año", orden: 1 },
  { nombre_curso: "Párvulo II", nivel: "Nivel Inicial", descripcion: "1 a 2 años", orden: 2 },
  { nombre_curso: "Párvulo III", nivel: "Nivel Inicial", descripcion: "2 a 3 años", orden: 3 },
  { nombre_curso: "Prekinder", nivel: "Nivel Inicial", descripcion: "3 a 4 años", orden: 4 },
  { nombre_curso: "Kinder", nivel: "Nivel Inicial", descripcion: "4 a 5 años", orden: 5 },
  { nombre_curso: "Preprimario", nivel: "Nivel Inicial", descripcion: "5 a 6 años", orden: 6 },
];

export const DOMINIOS_SEED = [
  // Párvulo I - Nivel 1 y 2
  { nombre_categoria: "Relaciones socioafectivas, identidad y autonomía", descripcion: "Párvulo I", curso: "Párvulo I", orden: 1 },
  { nombre_categoria: "Lenguaje e Interacción", descripcion: "Párvulo I", curso: "Párvulo I", orden: 2 },
  { nombre_categoria: "Descubrimiento de su cuerpo y su relación con el entorno", descripcion: "Párvulo I", curso: "Párvulo I", orden: 3 },
  
  // Párvulo II
  { nombre_categoria: "Relaciones socioafectivas, identidad y autonomía", descripcion: "Párvulo II", curso: "Párvulo II", orden: 1 },
  { nombre_categoria: "Lenguaje e interacción", descripcion: "Párvulo II", curso: "Párvulo II", orden: 2 },
  { nombre_categoria: "Descubrimiento de su cuerpo y su relación con el entorno", descripcion: "Párvulo II", curso: "Párvulo II", orden: 3 },
  
  // Párvulo III
  { nombre_categoria: "Relaciones socioafectivas, identidad y autonomía", descripcion: "Párvulo III", curso: "Párvulo III", orden: 1 },
  { nombre_categoria: "Descubrimiento de su cuerpo y su relación con el entorno", descripcion: "Párvulo III", curso: "Párvulo III", orden: 2 },
  { nombre_categoria: "Lenguaje e interacción", descripcion: "Párvulo III", curso: "Párvulo III", orden: 3 },
  
  // Prekinder, Kinder, Preprimario (same domains)
  { nombre_categoria: "Dominio Socioemocional", descripcion: "Prekinder, Kinder, Preprimario", curso: "Prekinder", orden: 1 },
  { nombre_categoria: "Dominio Artístico y Creativo", descripcion: "Prekinder, Kinder, Preprimario", curso: "Prekinder", orden: 2 },
  { nombre_categoria: "Dominio Psicomotor y de Salud", descripcion: "Prekinder, Kinder, Preprimario", curso: "Prekinder", orden: 3 },
  { nombre_categoria: "Dominio Descubrimiento del Mundo", descripcion: "Prekinder, Kinder, Preprimario", curso: "Prekinder", orden: 4 },
  { nombre_categoria: "Dominio Cognitivo", descripcion: "Prekinder, Kinder, Preprimario", curso: "Prekinder", orden: 5 },
  { nombre_categoria: "Dominio Comunicativo", descripcion: "Prekinder, Kinder, Preprimario", curso: "Prekinder", orden: 6 },
];

export const INDICADORES_PARVULO_I_NIVEL_1 = {
  curso: "Párvulo I",
  nivel: "Nivel 1 (45 días a 6 meses)",
  indicadores: {
    "Relaciones socioafectivas, identidad y autonomía": [
      "Expresa sus necesidades, sentimientos llorando, moviendo su cuerpo o vocalizando y gestos de satisfacción al reconocer personas familiares.",
      "Muestra agrado ante las demostraciones de afecto por medio al contacto corporal, visual, por medio de conversaciones, arrullos y nanas.",
      "Imita las reacciones y movimientos que ve en las interacciones con sus cuidadores.",
      "Explora su entorno cercano con apoyo del adulto o por sí solo.",
      "Reacciona al escuchar su nombre.",
    ],
    "Lenguaje e Interacción": [
      "Presta atención al lenguaje reaccionando a la interacción comunicativa de personas cercanas y las canciones de cuna o arrullos.",
      "Crea los significados a partir de la narración que hace el adulto sobre gestos, vocalizaciones, las acciones y emociones del momento.",
      "Expresa sus necesidades por medio de gestos globales e indiferenciados, contacto visual, gritos, llantos y movimientos involuntarios.",
      "Observa con interés los objetos, imágenes de libros ilustrados.",
    ],
    "Descubrimiento de su cuerpo y su relación con el entorno": [
      "Sostiene la cabeza y busca con la misma los sonidos que escucha del medio.",
      "Percibe las partes de su cuerpo mediante masajes y movimientos o juegos corporales que le realiza el adulto.",
      "Juega con manos y pies usando juguetes, utiliza sus dedos para agarrar objetos pequeños, lo entra y lo saca de una caja con apoyo interactuando en su medio.",
      "Manifiesta sus emociones espontáneamente con movimientos del cuerpo y por medio de gestos y llantos.",
      "Realiza movimientos con el cuerpo: expresiones faciales, gestos y llantos ante situaciones en el entorno y acciones que percibe del adulto.",
      "Empuja su cuerpo con las piernas sobre una superficie plana.",
      "Gira su cuerpo con su abdomen a 360 grados empujándose con los pies.",
      "Arrastra su cuerpo colocándolo en patrón cruzado, mano izquierda y pie derecho, mano derecha y pie izquierdo.",
      "Alcanza objetos con las manos en posición boca abajo e impulsándose con los pies.",
      "Balancea su cuerpo de derecha a izquierda.",
      "Desplaza su cuerpo gateando y arrastrándose sobre superficies planas.",
      "Manifiesta alegría al observarse cuando ve su imagen en el espejo con la asistencia de un adulto.",
      "Juega con algunas partes de su cuerpo como son las manos y los pies.",
      "Muestra placer y alegría al jugar tocándose sus manos, pies y los dedos.",
    ],
  },
};

// This structure will be used to seed the database with all indicators
// For now, I'll create the API endpoints to manage this data
