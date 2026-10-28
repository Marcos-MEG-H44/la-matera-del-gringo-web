import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured } from "../lib/supabase";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const { login, isAdmin, defaultCredentials } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Si ya es admin, redirigir al panel
  if (isAdmin) {
    const from = location.state?.from?.pathname || "/admin/dashboard";
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      const from = location.state?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemo = () => {
    setEmail(defaultCredentials.email);
    setPassword(defaultCredentials.password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center items-center p-4 selection:bg-[#D4AF37]/30 selection:text-[#5A3825]">
      {/* Botón Volver a la Tienda */}
      <div className="w-full max-w-md mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-[#7A6859] hover:text-[#5A3825] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Volver a la Tienda Pública
        </Link>
      </div>

      {/* Tarjeta de Login */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#E8DFD3] overflow-hidden">
        {/* Cabecera con colores de marca */}
        <div className="bg-[#5A3825] p-8 text-center relative border-b border-[#7A523A]">
          <div className="inline-block p-1 bg-[#D4AF37] rounded-full shadow-lg mb-3">
            <img
              src="/logo1.jpeg"
              alt="Logo La Matera del Gringo"
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#F3EAD8] tracking-wide">
            Panel de Administración
          </h1>
          <p className="text-xs text-[#D4AF37] tracking-wider uppercase mt-1">
            La Matera del Gringo
          </p>
        </div>

        {/* Formulario */}
        <div className="p-8 space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#6B5344] uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@lamateradelgringo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-[#382A24] text-sm focus:outline-none focus:border-[#5A3825] focus:ring-1 focus:ring-[#5A3825] transition-all"
                />
                <Mail className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6B5344] uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#D8CCBC] bg-[#FDFBF7] text-[#382A24] text-sm focus:outline-none focus:border-[#5A3825] focus:ring-1 focus:ring-[#5A3825] transition-all"
                />
                <Lock className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#8C7A6B] hover:text-[#5A3825]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#5A3825] hover:bg-[#6E4933] text-[#D4AF37] font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? "Accediendo..." : "Ingresar al Panel"}</span>
            </button>
          </form>

          {/* Acceso Rápido / Credenciales de Demostración */}
          <div className="pt-4 border-t border-[#F0E8DD] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8C7A6B]">Acceso de prueba rápido:</span>
              <button
                type="button"
                onClick={handleUseDemo}
                className="text-xs font-bold text-[#5A3825] hover:text-[#D4AF37] flex items-center space-x-1 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Autocompletar credenciales</span>
              </button>
            </div>

            <div className="p-3 bg-[#F5F0E8] rounded-xl text-[11px] text-[#6E5C4F] space-y-1">
              <div><strong>Email:</strong> admin@lamateradelgringo.com</div>
              <div><strong>Contraseña:</strong> admin</div>
              <div className="text-[10px] text-[#8C7A6B] pt-1 border-t border-[#E8DFD3]/60">
                Estado del Backend: {isSupabaseConfigured ? "🟢 Conectado a Supabase" : "🟡 Almacenamiento Local (Listo para migrar)"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
