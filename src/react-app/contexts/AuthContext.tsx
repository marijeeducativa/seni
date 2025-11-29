import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../supabase";
import { getApiUrl } from "../config";

interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: "administrador" | "maestro";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // Set cookie for API
        document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${session.expires_in}; SameSite=Lax; Secure`;

        console.log('[AuthContext] Fetching user from API...');
        const response = await fetch(getApiUrl("api/users/me"), {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        console.log('[AuthContext] API response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('[AuthContext] User data received:', data);
          setUser(data);
        } else {
          const errorText = await response.text();
          console.error('[AuthContext] API error:', response.status, errorText);
          setUser(null);
        }
      } else {
        // Clear cookie
        document.cookie = `sb-access-token=; path=/; max-age=0; SameSite=Lax; Secure`;
        setUser(null);
      }
    } catch (error) {
      console.error('[AuthContext] fetchUser error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${session.expires_in}; SameSite=Lax; Secure`;
        // We call fetchUser to get the profile data from API
        // But we should debounce or check if we already have it?
        // fetchUser handles it.
        fetchUser();
      } else {
        document.cookie = `sb-access-token=; path=/; max-age=0; SameSite=Lax; Secure`;
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
