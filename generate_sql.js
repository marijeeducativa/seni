
import fs from 'fs';
import path from 'path';

const indicatorsDir = path.join(process.cwd(), 'indicadores');
const outputFile = path.join(process.cwd(), 'update_indicadores.sql');

const files = [
  { name: 'PreKinder.txt', level: 'Prekinder' },
  { name: 'Kinder.txt', level: 'Kinder' },
  { name: 'Preprimario.txt', level: 'Preprimario' },
  { name: 'Parvulo 3.txt', level: 'Párvulo III' },
  { name: 'Parvulo 2.txt', level: 'Párvulo II' },
  { name: 'Parvulo 1 Etapa 1.txt', level: 'Párvulo I - Etapa 1' },
  { name: 'Parvulo 1 Etapa 2.txt', level: 'Párvulo I - Etapa 2' },
];

let sql = `-- Script generado automáticamente para actualizar indicadores
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

`;

files.forEach(file => {
  const filePath = path.join(indicatorsDir, file.name);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').map(l => l.trim()).filter(l => l);

    let currentCategory = '';
    let order = 1;

    sql += `\n-- Indicadores para ${file.level}\n`;

    lines.forEach(line => {
      const isCategory = (line === line.toUpperCase() && line.length > 5 && !line.startsWith('ETAPA'));

      if (isCategory) {
        currentCategory = line.replace(':', '').trim();
      } else if (line.startsWith('ETAPA')) {
        // Ignore
      } else {
        if (currentCategory) {
          const description = line.replace(/'/g, "''");
          sql += `
DO $$
DECLARE
  cat_id BIGINT;
BEGIN
  cat_id := create_category_if_not_exists('${currentCategory}');
  INSERT INTO public.indicadores (descripcion, descripcion_corta, id_categoria, niveles_aplicables, orden, is_active)
  VALUES ('${description}', '${description}', cat_id, '${file.level}', ${order}, true);
END $$;
`;
          order++;
        }
      }
    });
  }
});

fs.writeFileSync(outputFile, sql);
console.log('SQL script generated at ' + outputFile);
