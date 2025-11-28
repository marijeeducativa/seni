import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wbiccasythxsetmoxxvi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiaWNjYXN5dGh4c2V0bW94eHZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMTkwMDAsImV4cCI6MjA3OTU5NTAwMH0.kVOYN4V5o5-VoQhjvqa7YFjn5G3-Heu_vEONv8FM2Cw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const PARVULO_I_ETAPA1_INDICATORS = {
    // Relaciones Socioafectivas (ID 17)
    "Expresa necesidades y sentimientos (llanto, gestos).": 17,
    "Muestra agrado ante demostraciones de afecto.": 17,
    "Imita reacciones que ve en sus cuidadores.": 17,
    "Explora su entorno cercano con apoyo.": 17,
    "Reacciona al escuchar su nombre.": 17,

    // Lenguaje e Interacción (ID 19)
    "Presta atención a la interacción comunicativa.": 19,
    "Crea significados a partir de la narración del adulto.": 19,
    "Expresa necesidades con gestos globales y contacto visual.": 19,
    "Observa con interés objetos e imágenes.": 19,

    // Descubrimiento (ID 21)
    "Sostiene la cabeza y busca sonidos.": 21,
    "Percibe partes de su cuerpo mediante masajes.": 21,
    "Juega con manos y pies usando juguetes.": 21,
    "Manifiesta emociones espontáneamente (movimientos).": 21,
    "Realiza expresiones faciales ante situaciones.": 21,
    "Empuja su cuerpo con las piernas.": 21,
    "Gira su cuerpo 360 grados (abdomen).": 21,
    "Arrastra su cuerpo (patrón cruzado).": 21,
    "Alcanza objetos boca abajo impulsándose.": 21,
    "Balancea su cuerpo de derecha a izquierda.": 21,
    "Desplaza su cuerpo gateando/arrastrándose.": 21,
    "Manifiesta alegría al verse en espejo.": 21
};

const PARVULO_I_ETAPA2_INDICATORS = {
    // Relaciones Socioafectivas (ID 17)
    "Expresa sentimientos/necesidades con vocalizaciones.": 17,
    "Reacciona ante afecto de familiares y extraños.": 17,
    "Demuestra apego y se separa por corto tiempo.": 17,
    "Participa en higiene y alimentación.": 17,
    "Reconoce su imagen en diferentes representaciones.": 17,
    "Reconoce por su nombre a miembros de su familia.": 17,
    "Explora por sí solo y reconoce objetos.": 17,
    "Imita normas sociales en interacciones.": 17,

    // Lenguaje e Interacción (ID 19)
    "Imita gestos/expresiones para necesidades.": 19,
    "Usa espontáneamente gestos con pares/adultos.": 19,
    "Comprende informaciones durante la conversación.": 19,
    "Interactúa con libros e imágenes literarias.": 19,

    // Descubrimiento (ID 21)
    "Se pone de pie con apoyo.": 21,
    "Mantiene el equilibrio de sentado a parado.": 21,
    "Toca partes de su cuerpo imitando al adulto.": 21,
    "Imita movimientos sencillos de manos/brazos.": 21,
    "Desplaza su cuerpo gateando.": 21,
    "Gira su cuerpo rodando.": 21,
    "Arrastra su cuerpo reptando.": 21,
    "Alcanza objetos impulsándose.": 21,
    "Interactúa con juguetes y objetos cotidianos.": 21,
    "Entra y saca objetos de una caja.": 21,
    "Aprieta y suelta objetos blandos.": 21
};

async function seedParvuloI() {
    console.log('Seeding Párvulo I Indicators...');

    // Etapa 1
    let order = 1;
    for (const [desc, catId] of Object.entries(PARVULO_I_ETAPA1_INDICATORS)) {
        const { error } = await supabase.from('indicadores').insert({
            descripcion: desc,
            id_categoria: catId,
            niveles_aplicables: 'Párvulo I, Párvulo I - Etapa 1, Etapa 1',
            tipo_evaluacion: 'cualitativa',
            orden: order++,
            is_active: true
        });
        if (error) console.error(`Error inserting "${desc}":`, error.message);
        else console.log(`Inserted "${desc}" (Etapa 1)`);
    }

    // Etapa 2
    order = 1;
    for (const [desc, catId] of Object.entries(PARVULO_I_ETAPA2_INDICATORS)) {
        const { error } = await supabase.from('indicadores').insert({
            descripcion: desc,
            id_categoria: catId,
            niveles_aplicables: 'Párvulo I, Párvulo I - Etapa 2, Etapa 2',
            tipo_evaluacion: 'cualitativa',
            orden: order++,
            is_active: true
        });
        if (error) console.error(`Error inserting "${desc}":`, error.message);
        else console.log(`Inserted "${desc}" (Etapa 2)`);
    }

    console.log('Seeding complete.');
}

seedParvuloI();
