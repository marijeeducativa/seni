import { useAuth } from "@/react-app/contexts/AuthContext";
import { Navigate } from "react-router";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "administrador" | "maestro";
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.rol !== requiredRole) {
    const redirectPath = user.rol === "administrador" ? "/admin/dashboard" : "/teacher/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
