-- Script generado automáticamente para actualizar indicadores
-- Agregamos columna descripcion_corta si no existe
ALTER TABLE public.indicadores ADD COLUMN IF NOT EXISTS descripcion_corta TEXT;

-- !!! ADVERTENCIA: ESTO BORRA TODAS LAS EVALUACIONES E INDICADORES DE FORMA IRREVERSIBLE !!!
TRUNCATE public.evaluaciones, public.indicadores CASCADE;

-- Reiniciamos la secuencia de IDs de indicadores (opcional, pero ordenado)
ALTER SEQUENCE public.indicadores_id_seq RESTART WITH 1;

-- Función auxiliar para crear categorías si no existen
CREATE OR REPLACE FUNCTION create_category_if_not_exists(cat_name TEXT) RETURNS BIGINT AS $$
DECLARE
  cat_id BIGINT;
BEGIN
  SELECT id INTO cat_id FROM public.categorias_indicadores WHERE nombre_categoria = cat_name;
  IF cat_id IS NULL THEN
    INSERT INTO public.categorias_indicadores (nombre_categoria) VALUES (cat_name) RETURNING id INTO cat_id;
  END IF;
  RETURN cat_id;
END;
$$ LANGUAGE plpgsql;


-- Indicadores para Prekinder

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Expresa sentimientos/emociones de forma gráfica/oral.', 'Expresa sentimientos/emociones de forma gráfica/oral.', cat_id, 'Prekinder', 1, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Sigue secuencia en textos orales expresando gestos.', 'Sigue secuencia en textos orales expresando gestos.', cat_id, 'Prekinder', 2, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Usa formas de expresión para comunicar opiniones.', 'Usa formas de expresión para comunicar opiniones.', cat_id, 'Prekinder', 3, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Colabora en la solución de problemas sencillos.', 'Colabora en la solución de problemas sencillos.', cat_id, 'Prekinder', 4, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Responde preguntas sobre situaciones de su contexto.', 'Responde preguntas sobre situaciones de su contexto.', cat_id, 'Prekinder', 5, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Comprende el orden lógico de actividades de rutina.', 'Comprende el orden lógico de actividades de rutina.', cat_id, 'Prekinder', 6, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Expresa acciones que le producen bienestar.', 'Expresa acciones que le producen bienestar.', cat_id, 'Prekinder', 7, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Demuestra afecto con gestos y palabras.', 'Demuestra afecto con gestos y palabras.', cat_id, 'Prekinder', 8, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Realiza dibujos representando ideas reales/imaginarias.', 'Realiza dibujos representando ideas reales/imaginarias.', cat_id, 'Prekinder', 9, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Maneja títeres contando historias con compañeros.', 'Maneja títeres contando historias con compañeros.', cat_id, 'Prekinder', 10, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Conversa sobre personajes en dramatizaciones.', 'Conversa sobre personajes en dramatizaciones.', cat_id, 'Prekinder', 11, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Combina colores primarios/secundarios en dibujos.', 'Combina colores primarios/secundarios en dibujos.', cat_id, 'Prekinder', 12, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Explora con su cuerpo sonidos y movimientos.', 'Explora con su cuerpo sonidos y movimientos.', cat_id, 'Prekinder', 13, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Explora posibilidades sonoras (voz, instrumentos).', 'Explora posibilidades sonoras (voz, instrumentos).', cat_id, 'Prekinder', 14, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Entona canciones acompañadas de percusión.', 'Entona canciones acompañadas de percusión.', cat_id, 'Prekinder', 15, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Realiza movimientos (direcciones/velocidades).', 'Realiza movimientos (direcciones/velocidades).', cat_id, 'Prekinder', 16, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Muestra estabilidad y equilibrio en desplazamientos.', 'Muestra estabilidad y equilibrio en desplazamientos.', cat_id, 'Prekinder', 17, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Explora y manipula objetos en juegos.', 'Explora y manipula objetos en juegos.', cat_id, 'Prekinder', 18, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Experimenta estiramiento, relajación y descanso.', 'Experimenta estiramiento, relajación y descanso.', cat_id, 'Prekinder', 19, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Imita situaciones reales/imaginarias en juegos.', 'Imita situaciones reales/imaginarias en juegos.', cat_id, 'Prekinder', 20, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Participa en actividades de higiene personal.', 'Participa en actividades de higiene personal.', cat_id, 'Prekinder', 21, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Reproduce secuencias rítmicas con el cuerpo.', 'Reproduce secuencias rítmicas con el cuerpo.', cat_id, 'Prekinder', 22, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Describe situaciones de su comunidad local.', 'Describe situaciones de su comunidad local.', cat_id, 'Prekinder', 23, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Participa en actividades de la comunidad.', 'Participa en actividades de la comunidad.', cat_id, 'Prekinder', 24, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Comparte información sobre su entorno inmediato.', 'Comparte información sobre su entorno inmediato.', cat_id, 'Prekinder', 25, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Cuestiona y explora su entorno natural.', 'Cuestiona y explora su entorno natural.', cat_id, 'Prekinder', 26, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Describe características de seres vivos.', 'Describe características de seres vivos.', cat_id, 'Prekinder', 27, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Dialoga sobre el respeto a seres vivos.', 'Dialoga sobre el respeto a seres vivos.', cat_id, 'Prekinder', 28, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Participa en el cuidado del entorno escolar.', 'Participa en el cuidado del entorno escolar.', cat_id, 'Prekinder', 29, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Colabora en la reducción de desechos y uso de agua.', 'Colabora en la reducción de desechos y uso de agua.', cat_id, 'Prekinder', 30, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Ordena hechos sencillos de la realidad.', 'Ordena hechos sencillos de la realidad.', cat_id, 'Prekinder', 31, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Predice acontecimientos según experiencias previas.', 'Predice acontecimientos según experiencias previas.', cat_id, 'Prekinder', 32, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Asume reglas acordadas en algunos juegos.', 'Asume reglas acordadas en algunos juegos.', cat_id, 'Prekinder', 33, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Integra objetos a juegos simulando situaciones.', 'Integra objetos a juegos simulando situaciones.', cat_id, 'Prekinder', 34, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Responde preguntas sobre actividades del contexto.', 'Responde preguntas sobre actividades del contexto.', cat_id, 'Prekinder', 35, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Expresa ideas sobre lo que observa.', 'Expresa ideas sobre lo que observa.', cat_id, 'Prekinder', 36, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Participa en búsqueda de soluciones cotidianas.', 'Participa en búsqueda de soluciones cotidianas.', cat_id, 'Prekinder', 37, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Expresa acuerdos o desacuerdos ante hechos.', 'Expresa acuerdos o desacuerdos ante hechos.', cat_id, 'Prekinder', 38, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COMUNICATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Escucha textos cortos asociando imágenes/palabras.', 'Escucha textos cortos asociando imágenes/palabras.', cat_id, 'Prekinder', 39, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COMUNICATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Comunica ideas mediante imágenes/textos icónicos.', 'Comunica ideas mediante imágenes/textos icónicos.', cat_id, 'Prekinder', 40, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COMUNICATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Comprende textos orales sencillos y pregunta.', 'Comprende textos orales sencillos y pregunta.', cat_id, 'Prekinder', 41, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COMUNICATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Produce textos orales con lenguaje no verbal.', 'Produce textos orales con lenguaje no verbal.', cat_id, 'Prekinder', 42, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COMUNICATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Escucha su nombre e intenta escribirlo.', 'Escucha su nombre e intenta escribirlo.', cat_id, 'Prekinder', 43, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COMUNICATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Utiliza la narración con ayuda del adulto.', 'Utiliza la narración con ayuda del adulto.', cat_id, 'Prekinder', 44, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COMUNICATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Respeta reglas de comunicación (espera turno).', 'Respeta reglas de comunicación (espera turno).', cat_id, 'Prekinder', 45, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COMUNICATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Identifica problemas y expresa soluciones oralmente.', 'Identifica problemas y expresa soluciones oralmente.', cat_id, 'Prekinder', 46, true);
END $$;

-- Indicadores para Kinder

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Comunica ideas y emociones para ser entendido.', 'Comunica ideas y emociones para ser entendido.', cat_id, 'Kinder', 1, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Utiliza técnicas/materiales para expresar sentimientos.', 'Utiliza técnicas/materiales para expresar sentimientos.', cat_id, 'Kinder', 2, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Escucha y valora las opiniones de los demás.', 'Escucha y valora las opiniones de los demás.', cat_id, 'Kinder', 3, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Expresa ideas/sentimientos con imágenes/masilla.', 'Expresa ideas/sentimientos con imágenes/masilla.', cat_id, 'Kinder', 4, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Describe situaciones problemáticas de forma creativa.', 'Describe situaciones problemáticas de forma creativa.', cat_id, 'Kinder', 5, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Comparte gustos y preferencias con respeto.', 'Comparte gustos y preferencias con respeto.', cat_id, 'Kinder', 6, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Valora a compañeros respetando ideas y sentimientos.', 'Valora a compañeros respetando ideas y sentimientos.', cat_id, 'Kinder', 7, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Identifica 3-4 elementos de cultura dominicana.', 'Identifica 3-4 elementos de cultura dominicana.', cat_id, 'Kinder', 8, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Usa lenguajes artísticos para comunicar ideas.', 'Usa lenguajes artísticos para comunicar ideas.', cat_id, 'Kinder', 9, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Explora y manipula títeres en improvisaciones.', 'Explora y manipula títeres en improvisaciones.', cat_id, 'Kinder', 10, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Explora posibilidades sonoras (cuerpo/instrumentos).', 'Explora posibilidades sonoras (cuerpo/instrumentos).', cat_id, 'Kinder', 11, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Entona canciones con instrumentos de percusión.', 'Entona canciones con instrumentos de percusión.', cat_id, 'Kinder', 12, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Escucha cuentos musicales identificando sonidos.', 'Escucha cuentos musicales identificando sonidos.', cat_id, 'Kinder', 13, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Mueve su cuerpo espontáneamente con música.', 'Mueve su cuerpo espontáneamente con música.', cat_id, 'Kinder', 14, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Reproduce patrones rítmicos sencillos.', 'Reproduce patrones rítmicos sencillos.', cat_id, 'Kinder', 15, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Realiza movimientos (direcciones/velocidades).', 'Realiza movimientos (direcciones/velocidades).', cat_id, 'Kinder', 16, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Ubica objetos según indicaciones derecha-izquierda.', 'Ubica objetos según indicaciones derecha-izquierda.', cat_id, 'Kinder', 17, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Explora objetos en juegos reales o imaginarios.', 'Explora objetos en juegos reales o imaginarios.', cat_id, 'Kinder', 18, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Imita situaciones a partir de cuentos/rondas.', 'Imita situaciones a partir de cuentos/rondas.', cat_id, 'Kinder', 19, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Participa en juegos grupales aceptando reglas.', 'Participa en juegos grupales aceptando reglas.', cat_id, 'Kinder', 20, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Coordina movimientos de partes del cuerpo.', 'Coordina movimientos de partes del cuerpo.', cat_id, 'Kinder', 21, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Se desplaza con estabilidad y equilibrio.', 'Se desplaza con estabilidad y equilibrio.', cat_id, 'Kinder', 22, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Experimenta estiramiento y relajación.', 'Experimenta estiramiento y relajación.', cat_id, 'Kinder', 23, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Participa en higiene y cuidado personal con apoyo.', 'Participa en higiene y cuidado personal con apoyo.', cat_id, 'Kinder', 24, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Describe situaciones de su comunidad (apoyo adulto).', 'Describe situaciones de su comunidad (apoyo adulto).', cat_id, 'Kinder', 25, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Participa en proyectos de problemas comunitarios.', 'Participa en proyectos de problemas comunitarios.', cat_id, 'Kinder', 26, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Colabora buscando información de temas de interés.', 'Colabora buscando información de temas de interés.', cat_id, 'Kinder', 27, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Cuestiona y explora su entorno natural con ayuda.', 'Cuestiona y explora su entorno natural con ayuda.', cat_id, 'Kinder', 28, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Usa utensilios/tecnología para experimentos sencillos.', 'Usa utensilios/tecnología para experimentos sencillos.', cat_id, 'Kinder', 29, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Registra resultados de exploración (oral/escrita/gráfica).', 'Registra resultados de exploración (oral/escrita/gráfica).', cat_id, 'Kinder', 30, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Comprende importancia del manejo de desechos.', 'Comprende importancia del manejo de desechos.', cat_id, 'Kinder', 31, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Identifica semejanzas y diferencias en seres vivos.', 'Identifica semejanzas y diferencias en seres vivos.', cat_id, 'Kinder', 32, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Usa información conocida para apoyar explicaciones.', 'Usa información conocida para apoyar explicaciones.', cat_id, 'Kinder', 33, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Colabora y explica medidas de protección ambiental.', 'Colabora y explica medidas de protección ambiental.', cat_id, 'Kinder', 34, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Ordena hechos sencillos usando imaginación.', 'Ordena hechos sencillos usando imaginación.', cat_id, 'Kinder', 35, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Predice acontecimientos según experiencias previas.', 'Predice acontecimientos según experiencias previas.', cat_id, 'Kinder', 36, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Asume reglas acordadas en juegos.', 'Asume reglas acordadas en juegos.', cat_id, 'Kinder', 37, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Integra objetos a juegos simulando situaciones.', 'Integra objetos a juegos simulando situaciones.', cat_id, 'Kinder', 38, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Responde preguntas sobre situaciones del contexto.', 'Responde preguntas sobre situaciones del contexto.', cat_id, 'Kinder', 39, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Expresa ideas sobre observaciones y actividades.', 'Expresa ideas sobre observaciones y actividades.', cat_id, 'Kinder', 40, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Expresa acuerdos/desacuerdos ante hechos cotidianos.', 'Expresa acuerdos/desacuerdos ante hechos cotidianos.', cat_id, 'Kinder', 41, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Participa buscando alternativas a problemas.', 'Participa buscando alternativas a problemas.', cat_id, 'Kinder', 42, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Colabora en la solución de problemas sencillos.', 'Colabora en la solución de problemas sencillos.', cat_id, 'Kinder', 43, true);
END $$;

-- Indicadores para Preprimario

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Comunica ideas y emociones con intención clara.', 'Comunica ideas y emociones con intención clara.', cat_id, 'Preprimario', 1, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Usa técnicas para expresar sentimientos/experiencias.', 'Usa técnicas para expresar sentimientos/experiencias.', cat_id, 'Preprimario', 2, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Expresa ideas a través de producciones digitales.', 'Expresa ideas a través de producciones digitales.', cat_id, 'Preprimario', 3, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Conversa sobre distintos temas escuchando a otros.', 'Conversa sobre distintos temas escuchando a otros.', cat_id, 'Preprimario', 4, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Comunica opinión sustentada con razones.', 'Comunica opinión sustentada con razones.', cat_id, 'Preprimario', 5, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Colabora en plan de solución de problemas.', 'Colabora en plan de solución de problemas.', cat_id, 'Preprimario', 6, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Identifica miembros de familia y costumbres.', 'Identifica miembros de familia y costumbres.', cat_id, 'Preprimario', 7, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Cumple deberes y actividades escolares.', 'Cumple deberes y actividades escolares.', cat_id, 'Preprimario', 8, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO SOCIOEMOCIONAL');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Comenta historias/personajes de familia/comunidad.', 'Comenta historias/personajes de familia/comunidad.', cat_id, 'Preprimario', 9, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Combina colores primarios/secundarios intencionalmente.', 'Combina colores primarios/secundarios intencionalmente.', cat_id, 'Preprimario', 10, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Reproduce elementos de cultura dominicana/otras.', 'Reproduce elementos de cultura dominicana/otras.', cat_id, 'Preprimario', 11, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Reproduce/crea patrones rítmicos y melódicos.', 'Reproduce/crea patrones rítmicos y melódicos.', cat_id, 'Preprimario', 12, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Danza en forma espontánea con materiales diversos.', 'Danza en forma espontánea con materiales diversos.', cat_id, 'Preprimario', 13, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Dibuja con precisión e intencionalidad comunicativa.', 'Dibuja con precisión e intencionalidad comunicativa.', cat_id, 'Preprimario', 14, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Crea figuras 2D y 3D utilizando papel.', 'Crea figuras 2D y 3D utilizando papel.', cat_id, 'Preprimario', 15, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Describe trama/personajes de dramatizaciones.', 'Describe trama/personajes de dramatizaciones.', cat_id, 'Preprimario', 16, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Maneja títeres contando historias a otros.', 'Maneja títeres contando historias a otros.', cat_id, 'Preprimario', 17, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO ARTÍSTICO Y CREATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Representa situaciones a partir de poesía/cuentos.', 'Representa situaciones a partir de poesía/cuentos.', cat_id, 'Preprimario', 18, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Comunica ideas a través del movimiento y juego.', 'Comunica ideas a través del movimiento y juego.', cat_id, 'Preprimario', 19, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Identifica lateralidad en acciones y formaciones.', 'Identifica lateralidad en acciones y formaciones.', cat_id, 'Preprimario', 20, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Expresa disponibilidad para actividad física.', 'Expresa disponibilidad para actividad física.', cat_id, 'Preprimario', 21, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Participa en juegos reglados cumpliendo normas.', 'Participa en juegos reglados cumpliendo normas.', cat_id, 'Preprimario', 22, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Realiza movimientos coordinados en espacio total.', 'Realiza movimientos coordinados en espacio total.', cat_id, 'Preprimario', 23, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Realiza movimientos (dirección/posición/velocidad).', 'Realiza movimientos (dirección/posición/velocidad).', cat_id, 'Preprimario', 24, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Se desplaza con equilibrio y control postural.', 'Se desplaza con equilibrio y control postural.', cat_id, 'Preprimario', 25, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Experimenta estiramiento, respiración y relajación.', 'Experimenta estiramiento, respiración y relajación.', cat_id, 'Preprimario', 26, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO PSICOMOTOR Y DE SALUD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Cuida su cuerpo practicando hábitos de higiene.', 'Cuida su cuerpo practicando hábitos de higiene.', cat_id, 'Preprimario', 27, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Experimenta, infiere y registra resultados.', 'Experimenta, infiere y registra resultados.', cat_id, 'Preprimario', 28, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Comunica resultados de exploración (oral/escrita/gráfica).', 'Comunica resultados de exploración (oral/escrita/gráfica).', cat_id, 'Preprimario', 29, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Identifica semejanzas/diferencias en seres vivos.', 'Identifica semejanzas/diferencias en seres vivos.', cat_id, 'Preprimario', 30, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Cuestiona y explora entorno profundizando temas.', 'Cuestiona y explora entorno profundizando temas.', cat_id, 'Preprimario', 31, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Usa TIC y artefactos en experimentos/tareas.', 'Usa TIC y artefactos en experimentos/tareas.', cat_id, 'Preprimario', 32, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Aplica pasos del método científico con apoyo.', 'Aplica pasos del método científico con apoyo.', cat_id, 'Preprimario', 33, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Describe eventos, fenómenos naturales y seguridad.', 'Describe eventos, fenómenos naturales y seguridad.', cat_id, 'Preprimario', 34, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Colabora en manejo de desechos y reciclaje.', 'Colabora en manejo de desechos y reciclaje.', cat_id, 'Preprimario', 35, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO DESCUBRIMIENTO DEL MUNDO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Participa en proyectos y propone acciones ambientales.', 'Participa en proyectos y propone acciones ambientales.', cat_id, 'Preprimario', 36, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Interpreta gráficas/símbolos matemáticos del entorno.', 'Interpreta gráficas/símbolos matemáticos del entorno.', cat_id, 'Preprimario', 37, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Completa series numéricas hasta el 9.', 'Completa series numéricas hasta el 9.', cat_id, 'Preprimario', 38, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Realiza adición/sustracción con objetos/representaciones.', 'Realiza adición/sustracción con objetos/representaciones.', cat_id, 'Preprimario', 39, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Agrupa objetos, explica criterios y analiza situaciones.', 'Agrupa objetos, explica criterios y analiza situaciones.', cat_id, 'Preprimario', 40, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Realiza agrupaciones para organizar información.', 'Realiza agrupaciones para organizar información.', cat_id, 'Preprimario', 41, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Reproduce/crea patrones (tamaño, longitud, cantidad).', 'Reproduce/crea patrones (tamaño, longitud, cantidad).', cat_id, 'Preprimario', 42, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Apoya explicaciones con información conocida.', 'Apoya explicaciones con información conocida.', cat_id, 'Preprimario', 43, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Identifica patrones en actividades diarias.', 'Identifica patrones en actividades diarias.', cat_id, 'Preprimario', 44, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Organiza ideas para juegos y actividades.', 'Organiza ideas para juegos y actividades.', cat_id, 'Preprimario', 45, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Participa en juegos lógicos respetando reglas.', 'Participa en juegos lógicos respetando reglas.', cat_id, 'Preprimario', 46, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COGNITIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Participa en búsqueda de soluciones a problemas.', 'Participa en búsqueda de soluciones a problemas.', cat_id, 'Preprimario', 47, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COMUNICATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Sigue una secuencia en textos orales escuchados.', 'Sigue una secuencia en textos orales escuchados.', cat_id, 'Preprimario', 48, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COMUNICATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Formula y responde preguntas para obtener información.', 'Formula y responde preguntas para obtener información.', cat_id, 'Preprimario', 49, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COMUNICATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Asume normas de comunicación establecidas.', 'Asume normas de comunicación establecidas.', cat_id, 'Preprimario', 50, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COMUNICATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Responde preguntas sencillas sobre idea general de un texto.', 'Responde preguntas sencillas sobre idea general de un texto.', cat_id, 'Preprimario', 51, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COMUNICATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Interpreta mensajes a partir de imágenes y símbolos.', 'Interpreta mensajes a partir de imágenes y símbolos.', cat_id, 'Preprimario', 52, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COMUNICATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Lee progresivamente (convencional/no) imágenes y palabras.', 'Lee progresivamente (convencional/no) imágenes y palabras.', cat_id, 'Preprimario', 53, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COMUNICATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Expresa ideas de textos escuchados o leídos.', 'Expresa ideas de textos escuchados o leídos.', cat_id, 'Preprimario', 54, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COMUNICATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Escribe su nombre de manera no convencional o convencional.', 'Escribe su nombre de manera no convencional o convencional.', cat_id, 'Preprimario', 55, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DOMINIO COMUNICATIVO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Produce textos basados en situaciones reales/imaginarias.', 'Produce textos basados en situaciones reales/imaginarias.', cat_id, 'Preprimario', 56, true);
END $$;

-- Indicadores para Párvulo III

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('SOCIOAFECTIVA, IDENTIDAD Y AUTONOMÍA');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Elige y completa una actividad simple.', 'Elige y completa una actividad simple.', cat_id, 'Párvulo III', 1, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('SOCIOAFECTIVA, IDENTIDAD Y AUTONOMÍA');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Asume responsabilidades de acuerdo con su edad.', 'Asume responsabilidades de acuerdo con su edad.', cat_id, 'Párvulo III', 2, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('SOCIOAFECTIVA, IDENTIDAD Y AUTONOMÍA');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Da las gracias, pide por favor, saluda y se despide.', 'Da las gracias, pide por favor, saluda y se despide.', cat_id, 'Párvulo III', 3, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('SOCIOAFECTIVA, IDENTIDAD Y AUTONOMÍA');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Intenta cumplir acuerdos de pedir la palabra/turnos.', 'Intenta cumplir acuerdos de pedir la palabra/turnos.', cat_id, 'Párvulo III', 4, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('SOCIOAFECTIVA, IDENTIDAD Y AUTONOMÍA');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Disfruta del juego e interactúa motivado por adulto.', 'Disfruta del juego e interactúa motivado por adulto.', cat_id, 'Párvulo III', 5, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('SOCIOAFECTIVA, IDENTIDAD Y AUTONOMÍA');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Interactúa con otros niños expresando intereses.', 'Interactúa con otros niños expresando intereses.', cat_id, 'Párvulo III', 6, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('SOCIOAFECTIVA, IDENTIDAD Y AUTONOMÍA');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Interactúa aceptando que otros usen objetos comunes.', 'Interactúa aceptando que otros usen objetos comunes.', cat_id, 'Párvulo III', 7, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('SOCIOAFECTIVA, IDENTIDAD Y AUTONOMÍA');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Utiliza gestos y palabras para manifestar emociones.', 'Utiliza gestos y palabras para manifestar emociones.', cat_id, 'Párvulo III', 8, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('SOCIOAFECTIVA, IDENTIDAD Y AUTONOMÍA');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Responde a su nombre y apellidos.', 'Responde a su nombre y apellidos.', cat_id, 'Párvulo III', 9, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('SOCIOAFECTIVA, IDENTIDAD Y AUTONOMÍA');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Dice su nombre, edad y sexo.', 'Dice su nombre, edad y sexo.', cat_id, 'Párvulo III', 10, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('SOCIOAFECTIVA, IDENTIDAD Y AUTONOMÍA');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Conoce el nombre de personas significativas.', 'Conoce el nombre de personas significativas.', cat_id, 'Párvulo III', 11, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO (I)');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Construye torres con mayor precisión.', 'Construye torres con mayor precisión.', cat_id, 'Párvulo III', 12, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO (I)');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Practica normas de autocuidado con ayuda.', 'Practica normas de autocuidado con ayuda.', cat_id, 'Párvulo III', 13, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO (I)');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Nombra y reconoce funciones de partes del cuerpo.', 'Nombra y reconoce funciones de partes del cuerpo.', cat_id, 'Párvulo III', 14, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO (I)');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Evita situaciones de inseguridad buscando al adulto.', 'Evita situaciones de inseguridad buscando al adulto.', cat_id, 'Párvulo III', 15, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO (I)');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Sigue advertencias de seguridad ante objetos.', 'Sigue advertencias de seguridad ante objetos.', cat_id, 'Párvulo III', 16, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO (I)');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Colabora en el cuidado de su cuerpo y espacios.', 'Colabora en el cuidado de su cuerpo y espacios.', cat_id, 'Párvulo III', 17, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO (I)');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Cede ante la solicitud de devolución de objetos.', 'Cede ante la solicitud de devolución de objetos.', cat_id, 'Párvulo III', 18, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO (I)');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Se aleja del adulto interactuando con otros.', 'Se aleja del adulto interactuando con otros.', cat_id, 'Párvulo III', 19, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO (I)');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Identifica y señala partes de su cuerpo en juegos.', 'Identifica y señala partes de su cuerpo en juegos.', cat_id, 'Párvulo III', 20, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO (I)');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Interactúa con objetos (tamaño, posición, textura).', 'Interactúa con objetos (tamaño, posición, textura).', cat_id, 'Párvulo III', 21, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO (I)');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Relaciona características de su cuerpo con pares.', 'Relaciona características de su cuerpo con pares.', cat_id, 'Párvulo III', 22, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO (I)');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Realiza juegos motrices con tiempo medido.', 'Realiza juegos motrices con tiempo medido.', cat_id, 'Párvulo III', 23, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO (I)');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Realiza acciones de vestirse (sacarse zapatos).', 'Realiza acciones de vestirse (sacarse zapatos).', cat_id, 'Párvulo III', 24, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO (I)');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Participa en juegos motrices para expresar ideas.', 'Participa en juegos motrices para expresar ideas.', cat_id, 'Párvulo III', 25, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO (I)');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Se desplaza caminando, corriendo y saltando.', 'Se desplaza caminando, corriendo y saltando.', cat_id, 'Párvulo III', 26, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO (I)');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Trepa sobre superficies inclinadas con confianza.', 'Trepa sobre superficies inclinadas con confianza.', cat_id, 'Párvulo III', 27, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO (I)');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Mantiene equilibrio en desplazamientos (línea recta).', 'Mantiene equilibrio en desplazamientos (línea recta).', cat_id, 'Párvulo III', 28, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO (I)');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Participa en lavado de manos, baño y cepillado.', 'Participa en lavado de manos, baño y cepillado.', cat_id, 'Párvulo III', 29, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Participa en juegos organizados (filas, círculos).', 'Participa en juegos organizados (filas, círculos).', cat_id, 'Párvulo III', 30, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Desarrolla imaginación (gestos, mímicas, danza).', 'Desarrolla imaginación (gestos, mímicas, danza).', cat_id, 'Párvulo III', 31, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Agarra objetos grandes y pequeños (exploración).', 'Agarra objetos grandes y pequeños (exploración).', cat_id, 'Párvulo III', 32, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Lanza pelotas intentando orientarlas.', 'Lanza pelotas intentando orientarlas.', cat_id, 'Párvulo III', 33, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Realiza juegos de arrastre, empuje y golpeo.', 'Realiza juegos de arrastre, empuje y golpeo.', cat_id, 'Párvulo III', 34, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Comprende informaciones de adultos y pares.', 'Comprende informaciones de adultos y pares.', cat_id, 'Párvulo III', 35, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Realiza preguntas para aclarar significados.', 'Realiza preguntas para aclarar significados.', cat_id, 'Párvulo III', 36, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Realiza acciones relacionando vivencias.', 'Realiza acciones relacionando vivencias.', cat_id, 'Párvulo III', 37, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Reconoce sonidos, mímicas y gestos.', 'Reconoce sonidos, mímicas y gestos.', cat_id, 'Párvulo III', 38, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Realiza instrucciones simples de vida cotidiana.', 'Realiza instrucciones simples de vida cotidiana.', cat_id, 'Párvulo III', 39, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Escucha y disfruta textos literarios.', 'Escucha y disfruta textos literarios.', cat_id, 'Párvulo III', 40, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Dramatiza acciones de textos.', 'Dramatiza acciones de textos.', cat_id, 'Párvulo III', 41, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Participa en situaciones comunicativas grupales.', 'Participa en situaciones comunicativas grupales.', cat_id, 'Párvulo III', 42, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Emplea lenguaje para necesidades/emociones.', 'Emplea lenguaje para necesidades/emociones.', cat_id, 'Párvulo III', 43, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Muestra respeto a normas de conversación.', 'Muestra respeto a normas de conversación.', cat_id, 'Párvulo III', 44, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Lee no convencionalmente libros ilustrados.', 'Lee no convencionalmente libros ilustrados.', cat_id, 'Párvulo III', 45, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Pregunta sobre contenido de libros.', 'Pregunta sobre contenido de libros.', cat_id, 'Párvulo III', 46, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Narra contenido de textos (sin orden lógico).', 'Narra contenido de textos (sin orden lógico).', cat_id, 'Párvulo III', 47, true);
END $$;

-- Indicadores para Párvulo II

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS E IDENTIDAD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Reconoce objetos y espacios habituales.', 'Reconoce objetos y espacios habituales.', cat_id, 'Párvulo II', 1, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS E IDENTIDAD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Usa normas sociales en interacciones (si se solicita).', 'Usa normas sociales en interacciones (si se solicita).', cat_id, 'Párvulo II', 2, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS E IDENTIDAD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Expresa sentimientos y afectos hacia otros.', 'Expresa sentimientos y afectos hacia otros.', cat_id, 'Párvulo II', 3, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS E IDENTIDAD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Juega explorando el ambiente con seguridad.', 'Juega explorando el ambiente con seguridad.', cat_id, 'Párvulo II', 4, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS E IDENTIDAD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Decide qué actividad le gusta o no realizar.', 'Decide qué actividad le gusta o no realizar.', cat_id, 'Párvulo II', 5, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS E IDENTIDAD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Se identifica a sí mismo y a otros en fotos/imágenes.', 'Se identifica a sí mismo y a otros en fotos/imágenes.', cat_id, 'Párvulo II', 6, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS E IDENTIDAD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Responde y expresa su nombre.', 'Responde y expresa su nombre.', cat_id, 'Párvulo II', 7, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS E IDENTIDAD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Tolera que otros usen juguetes u objetos comunes.', 'Tolera que otros usen juguetes u objetos comunes.', cat_id, 'Párvulo II', 8, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS E IDENTIDAD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('LENGUAJE E INTERACCIÓN (Parte I)', 'LENGUAJE E INTERACCIÓN (Parte I)', cat_id, 'Párvulo II', 9, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS E IDENTIDAD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Reconoce objetos/personas al ser nombrados.', 'Reconoce objetos/personas al ser nombrados.', cat_id, 'Párvulo II', 10, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS E IDENTIDAD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Sigue instrucciones simples de rutina.', 'Sigue instrucciones simples de rutina.', cat_id, 'Párvulo II', 11, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS E IDENTIDAD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Responde preguntas simples.', 'Responde preguntas simples.', cat_id, 'Párvulo II', 12, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS E IDENTIDAD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Lenguaje y Descubrimiento', 'Lenguaje y Descubrimiento', cat_id, 'Párvulo II', 13, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS E IDENTIDAD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('LENGUAJE E INTERACCIÓN (Parte II)', 'LENGUAJE E INTERACCIÓN (Parte II)', cat_id, 'Párvulo II', 14, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS E IDENTIDAD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Imita sonidos/movimientos de cuentos y canciones.', 'Imita sonidos/movimientos de cuentos y canciones.', cat_id, 'Párvulo II', 15, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS E IDENTIDAD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Expresa necesidades con palabras/gestos/frases.', 'Expresa necesidades con palabras/gestos/frases.', cat_id, 'Párvulo II', 16, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS E IDENTIDAD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Nombra objetos y acciones mientras juega.', 'Nombra objetos y acciones mientras juega.', cat_id, 'Párvulo II', 17, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS E IDENTIDAD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Elige e imita leer libros ilustrados.', 'Elige e imita leer libros ilustrados.', cat_id, 'Párvulo II', 18, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS E IDENTIDAD');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Formula preguntas al explorar libros.', 'Formula preguntas al explorar libros.', cat_id, 'Párvulo II', 19, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Controla su cuerpo al pararse sin apoyo.', 'Controla su cuerpo al pararse sin apoyo.', cat_id, 'Párvulo II', 20, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Manipula objetos para producir sonidos (ritmo).', 'Manipula objetos para producir sonidos (ritmo).', cat_id, 'Párvulo II', 21, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Usa manos para orientar pelotas/objetos.', 'Usa manos para orientar pelotas/objetos.', cat_id, 'Párvulo II', 22, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Coordina ojo-pie/ojo-mano (patear, atrapar).', 'Coordina ojo-pie/ojo-mano (patear, atrapar).', cat_id, 'Párvulo II', 23, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Expresa ideas gráficamente (garabateo).', 'Expresa ideas gráficamente (garabateo).', cat_id, 'Párvulo II', 24, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Realiza juegos de arrastre, empuje y golpeo.', 'Realiza juegos de arrastre, empuje y golpeo.', cat_id, 'Párvulo II', 25, true);
END $$;

-- Indicadores para Párvulo I - Etapa 1

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Expresa necesidades y sentimientos (llanto, gestos).', 'Expresa necesidades y sentimientos (llanto, gestos).', cat_id, 'Párvulo I - Etapa 1', 1, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Muestra agrado ante demostraciones de afecto.', 'Muestra agrado ante demostraciones de afecto.', cat_id, 'Párvulo I - Etapa 1', 2, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Imita reacciones que ve en sus cuidadores.', 'Imita reacciones que ve en sus cuidadores.', cat_id, 'Párvulo I - Etapa 1', 3, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Explora su entorno cercano con apoyo.', 'Explora su entorno cercano con apoyo.', cat_id, 'Párvulo I - Etapa 1', 4, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Reacciona al escuchar su nombre.', 'Reacciona al escuchar su nombre.', cat_id, 'Párvulo I - Etapa 1', 5, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Presta atención a la interacción comunicativa.', 'Presta atención a la interacción comunicativa.', cat_id, 'Párvulo I - Etapa 1', 6, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Crea significados a partir de la narración del adulto.', 'Crea significados a partir de la narración del adulto.', cat_id, 'Párvulo I - Etapa 1', 7, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Expresa necesidades con gestos globales y contacto visual.', 'Expresa necesidades con gestos globales y contacto visual.', cat_id, 'Párvulo I - Etapa 1', 8, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Observa con interés objetos e imágenes.', 'Observa con interés objetos e imágenes.', cat_id, 'Párvulo I - Etapa 1', 9, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Sostiene la cabeza y busca sonidos.', 'Sostiene la cabeza y busca sonidos.', cat_id, 'Párvulo I - Etapa 1', 10, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Percibe partes de su cuerpo mediante masajes.', 'Percibe partes de su cuerpo mediante masajes.', cat_id, 'Párvulo I - Etapa 1', 11, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Juega con manos y pies usando juguetes.', 'Juega con manos y pies usando juguetes.', cat_id, 'Párvulo I - Etapa 1', 12, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Manifiesta emociones espontáneamente (movimientos).', 'Manifiesta emociones espontáneamente (movimientos).', cat_id, 'Párvulo I - Etapa 1', 13, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Realiza expresiones faciales ante situaciones.', 'Realiza expresiones faciales ante situaciones.', cat_id, 'Párvulo I - Etapa 1', 14, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Empuja su cuerpo con las piernas.', 'Empuja su cuerpo con las piernas.', cat_id, 'Párvulo I - Etapa 1', 15, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Gira su cuerpo 360 grados (abdomen).', 'Gira su cuerpo 360 grados (abdomen).', cat_id, 'Párvulo I - Etapa 1', 16, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Arrastra su cuerpo (patrón cruzado).', 'Arrastra su cuerpo (patrón cruzado).', cat_id, 'Párvulo I - Etapa 1', 17, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Alcanza objetos boca abajo impulsándose.', 'Alcanza objetos boca abajo impulsándose.', cat_id, 'Párvulo I - Etapa 1', 18, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Balancea su cuerpo de derecha a izquierda.', 'Balancea su cuerpo de derecha a izquierda.', cat_id, 'Párvulo I - Etapa 1', 19, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Desplaza su cuerpo gateando/arrastrándose.', 'Desplaza su cuerpo gateando/arrastrándose.', cat_id, 'Párvulo I - Etapa 1', 20, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Manifiesta alegría al verse en espejo.', 'Manifiesta alegría al verse en espejo.', cat_id, 'Párvulo I - Etapa 1', 21, true);
END $$;

-- Indicadores para Párvulo I - Etapa 2

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Expresa sentimientos/necesidades con vocalizaciones.', 'Expresa sentimientos/necesidades con vocalizaciones.', cat_id, 'Párvulo I - Etapa 2', 1, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Reacciona ante afecto de familiares y extraños.', 'Reacciona ante afecto de familiares y extraños.', cat_id, 'Párvulo I - Etapa 2', 2, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Demuestra apego y se separa por corto tiempo.', 'Demuestra apego y se separa por corto tiempo.', cat_id, 'Párvulo I - Etapa 2', 3, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Participa en higiene y alimentación.', 'Participa en higiene y alimentación.', cat_id, 'Párvulo I - Etapa 2', 4, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Reconoce su imagen en diferentes representaciones.', 'Reconoce su imagen en diferentes representaciones.', cat_id, 'Párvulo I - Etapa 2', 5, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Reconoce por su nombre a miembros de su familia.', 'Reconoce por su nombre a miembros de su familia.', cat_id, 'Párvulo I - Etapa 2', 6, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Explora por sí solo y reconoce objetos.', 'Explora por sí solo y reconoce objetos.', cat_id, 'Párvulo I - Etapa 2', 7, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('RELACIONES SOCIOAFECTIVAS');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Imita normas sociales en interacciones.', 'Imita normas sociales en interacciones.', cat_id, 'Párvulo I - Etapa 2', 8, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Imita gestos/expresiones para necesidades.', 'Imita gestos/expresiones para necesidades.', cat_id, 'Párvulo I - Etapa 2', 9, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Usa espontáneamente gestos con pares/adultos.', 'Usa espontáneamente gestos con pares/adultos.', cat_id, 'Párvulo I - Etapa 2', 10, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Comprende informaciones durante la conversación.', 'Comprende informaciones durante la conversación.', cat_id, 'Párvulo I - Etapa 2', 11, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('LENGUAJE E INTERACCIÓN');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Interactúa con libros e imágenes literarias.', 'Interactúa con libros e imágenes literarias.', cat_id, 'Párvulo I - Etapa 2', 12, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Se pone de pie con apoyo.', 'Se pone de pie con apoyo.', cat_id, 'Párvulo I - Etapa 2', 13, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Mantiene el equilibrio de sentado a parado.', 'Mantiene el equilibrio de sentado a parado.', cat_id, 'Párvulo I - Etapa 2', 14, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Toca partes de su cuerpo imitando al adulto.', 'Toca partes de su cuerpo imitando al adulto.', cat_id, 'Párvulo I - Etapa 2', 15, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Imita movimientos sencillos de manos/brazos.', 'Imita movimientos sencillos de manos/brazos.', cat_id, 'Párvulo I - Etapa 2', 16, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Desplaza su cuerpo gateando.', 'Desplaza su cuerpo gateando.', cat_id, 'Párvulo I - Etapa 2', 17, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Gira su cuerpo rodando.', 'Gira su cuerpo rodando.', cat_id, 'Párvulo I - Etapa 2', 18, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Arrastra su cuerpo reptando.', 'Arrastra su cuerpo reptando.', cat_id, 'Párvulo I - Etapa 2', 19, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Alcanza objetos impulsándose.', 'Alcanza objetos impulsándose.', cat_id, 'Párvulo I - Etapa 2', 20, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Interactúa con juguetes y objetos cotidianos.', 'Interactúa con juguetes y objetos cotidianos.', cat_id, 'Párvulo I - Etapa 2', 21, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Entra y saca objetos de una caja.', 'Entra y saca objetos de una caja.', cat_id, 'Párvulo I - Etapa 2', 22, true);
END $$;

DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('DESCUBRIMIENTO DEL CUERPO Y ENTORNO');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('Aprieta y suelta objetos blandos.', 'Aprieta y suelta objetos blandos.', cat_id, 'Párvulo I - Etapa 2', 23, true);
END $$;
