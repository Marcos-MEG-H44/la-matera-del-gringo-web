import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Coffee } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#5A3825] border-t-[#D4AF37] animate-spin"></div>
        <div className="flex items-center space-x-2 text-[#5A3825] font-serif font-bold">
          <Coffee className="w-5 h-5 text-[#D4AF37]" />
          <span>Verificando credenciales de administrador...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    // Redirige al login de administración guardando la ubicación previa
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
