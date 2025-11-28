import { createClient } from '@supabase/supabase-js';
import { seedAllIndicators } from './seed-all-indicators';

const SUPABASE_URL = 'https://wbiccasythxsetmoxxvi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiaWNjYXN5dGh4c2V0bW94eHZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMTkwMDAsImV4cCI6MjA3OTU5NTAwMH0.kVOYN4V5o5-VoQhjvqa7YFjn5G3-Heu_vEONv8FM2Cw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Mock D1Database interface using Supabase client
const mockDB = {
    prepare: (query: string) => {
        return {
            bind: (...args: any[]) => {
                return {
                    first: async () => {
                        // Very basic SQL parser for SELECT
                        if (query.includes('SELECT id FROM categorias_indicadores')) {
                            const { data } = await supabase.from('categorias_indicadores').select('id').eq('nombre_categoria', args[0]).maybeSingle();
                            return data;
                        }
                        if (query.includes('SELECT id FROM indicadores')) {
                            const { data } = await supabase.from('indicadores').select('id').eq('descripcion', args[0]).eq('niveles_aplicables', args[1]).maybeSingle();
                            return data;
                        }
                        return null;
                    },
                    run: async () => {
                        // Very basic SQL parser for INSERT
                        if (query.includes('INSERT INTO categorias_indicadores')) {
                            const { data, error } = await supabase.from('categorias_indicadores').insert({
                                nombre_categoria: args[0],
                                descripcion: args[1]
                            }).select().single();
                            if (error) throw error;
                            return { meta: { last_row_id: data.id } };
                        }
                        if (query.includes('INSERT INTO indicadores')) {
                            const { data, error } = await supabase.from('indicadores').insert({
                                descripcion: args[0],
                                id_categoria: args[1],
                                niveles_aplicables: args[2],
                                tipo_evaluacion: args[3],
                                orden: args[4]
                            }).select().single();
                            if (error) throw error;
                            return { meta: { last_row_id: data.id } };
                        }
                        return { meta: { last_row_id: 0 } };
                    }
                };
            }
        };
    }
} as any;

async function runSeed() {
    console.log('Starting seed to Supabase...');
    try {
        await seedAllIndicators(mockDB);
        console.log('Seed completed successfully!');
    } catch (e) {
        console.error('Seed failed:', e);
    }
}

runSeed();
