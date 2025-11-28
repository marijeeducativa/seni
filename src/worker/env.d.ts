// Extend the Env interface to include our application-specific bindings
declare global {
  interface Env {
    MOCHA_USERS_SERVICE_API_URL: string;
    MOCHA_USERS_SERVICE_API_KEY: string;
    SUPABASE_URL: string;
    SUPABASE_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    // DB: D1Database; // Deprecated

  }
}

export { };
