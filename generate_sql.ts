
import * as fs from 'fs';
import * as path from 'path';

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

-- Desactivamos todos los indicadores existentes para los niveles afectados para evitar duplicados
UPDATE public.indicadores 
SET is_active = false 
WHERE niveles_aplicables IN ('Prekinder', 'Kinder', 'Preprimario', 'Párvulo III', 'Párvulo II', 'Párvulo I - Etapa 1', 'Párvulo I - Etapa 2');

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
            // Heuristic for category: All uppercase, possibly starting with DOMINIO or ETAPA (skip ETAPA lines if they are just titles)
            // Some files start with "ETAPA 1: ...". This is not a category, it's a title.
            // Categories in Parvulo files: "RELACIONES SOCIOAFECTIVAS", "LENGUAJE E INTERACCIÓN", etc.
            // Categories in Prekinder: "DOMINIO SOCIOEMOCIONAL", etc.

            const isCategory = (line === line.toUpperCase() && line.length > 5 && !line.startsWith('ETAPA'));

            if (isCategory) {
                currentCategory = line.replace(':', '').trim();
                // Normalize category names if needed? 
                // User wants "DOMINIO SOCIOEMOCIONAL" for Prekinder.
                // But maybe "SOCIOAFECTIVA..." for Parvulo.
                // I'll keep them as is.
            } else if (line.startsWith('ETAPA')) {
                // Ignore
            } else {
                // It's an indicator
                if (currentCategory) {
                    const description = line.replace(/'/g, "''"); // Escape single quotes
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
