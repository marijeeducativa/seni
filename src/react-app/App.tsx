import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "@/react-app/contexts/AuthContext";
import LoginPage from "@/react-app/pages/Login";
import AdminDashboard from "@/react-app/pages/admin/Dashboard";
import AdminUsers from "@/react-app/pages/admin/Users";
import AdminStudents from "@/react-app/pages/admin/Students";
import AdminCourses from "@/react-app/pages/admin/Courses";
import AdminIndicators from "@/react-app/pages/admin/Indicators";
import SeedIndicators from "@/react-app/pages/admin/SeedIndicators";
import AdminSettings from "@/react-app/pages/admin/Settings";
import AdminBulkBulletins from "@/react-app/pages/admin/BulkBulletins";
import TeacherCourses from "@/react-app/pages/teacher/Courses";
import TeacherCourseDetail from "@/react-app/pages/teacher/CourseDetail";
import EvaluateStudent from "@/react-app/pages/teacher/EvaluateStudent";
import BulletinPreview from "@/react-app/pages/teacher/BulletinPreview";
import BulkBulletinPrint from "@/react-app/pages/teacher/BulkBulletinPrint";
import ProtectedRoute from "@/react-app/components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="administrador">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="administrador">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute requiredRole="administrador">
                <AdminStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute requiredRole="administrador">
                <AdminCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/indicators"
            element={
              <ProtectedRoute requiredRole="administrador">
                <AdminIndicators />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/seed-indicators"
            element={
              <ProtectedRoute requiredRole="administrador">
                <SeedIndicators />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute requiredRole="administrador">
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bulk-bulletins"
            element={
              <ProtectedRoute requiredRole="administrador">
                <AdminBulkBulletins />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cursos/:id/boletines-masivos"
            element={
              <ProtectedRoute requiredRole="administrador">
                <BulkBulletinPrint />
              </ProtectedRoute>
            }
          />

          {/* Teacher routes */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute requiredRole="maestro">
                <TeacherCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/cursos/:id"
            element={
              <ProtectedRoute requiredRole="maestro">
                <TeacherCourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/cursos/:id/estudiantes/:estudianteId/evaluar"
            element={
              <ProtectedRoute requiredRole="maestro">
                <EvaluateStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/cursos/:id/estudiantes/:estudianteId/boletin"
            element={
              <ProtectedRoute requiredRole="maestro">
                <BulletinPreview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/cursos/:id/boletines-masivos"
            element={
              <ProtectedRoute requiredRole="maestro">
                <BulkBulletinPrint />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
