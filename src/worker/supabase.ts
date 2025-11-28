import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = (env: Env) => {
    return createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
};

export const createSupabaseAdminClient = (env: Env) => {
    return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
};
