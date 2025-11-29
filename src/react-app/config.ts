// API Configuration for Vercel deployment
// Since both frontend and API are on Vercel, we use relative paths

// Helper function to build API URLs
export const getApiUrl = (path: string) => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // Always use relative paths since API and frontend are on same domain
    return `/${cleanPath}`;
};

// Helper function to make authenticated API calls
export const apiFetch = async (path: string, options: RequestInit = {}) => {
    const url = getApiUrl(path);

    // Get token from Supabase session if available
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.access_token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${session.access_token}`,
            };
        }
    }

    return fetch(url, options);
};
