import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isSupabaseConfigured } from "../../lib/supabase";
import {
  LayoutDashboard,
  Package,
  Layers,
  Image as ImageIcon,
  Star,
  Percent,
  Calendar,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Database
} from "lucide-react";

export default function AdminLayout({ activeTab, setActiveTab, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: "inicio", label: "Inicio", icon: LayoutDashboard },
    { id: "productos", label: "Productos", icon: Package },
    { id: "categorias", label: "Categorías", icon: Layers },
    { id: "imagenes", label: "Imágenes", icon: ImageIcon },
    { id: "destacados", label: "Destacados", icon: Star },
    { id: "descuentos", label: "Descuentos", icon: Percent },
    { id: "calendario", label: "Calendario", icon: Calendar },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col md:flex-row text-[#382A24] font-sans">
      {/* Mobile Header (Marrón más claro #5A3825) */}
      <div className="md:hidden bg-[#5A3825] text-[#F3EAD8] p-4 flex items-center justify-between border-b border-[#7A523A] sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <img
            src="/logo1.jpeg"
            alt="Logo"
            className="w-9 h-9 rounded-full object-cover border border-[#D4AF37]"
          />
          <div>
            <h2 className="font-serif font-bold text-sm text-[#F3EAD8]">La Matera del Gringo</h2>
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-wider">Panel Admin</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-[#6E4933] text-[#F3EAD8] hover:bg-[#7D553D]"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation (Marrón más claro #5A3825) */}
      <aside
        className={`fixed md:sticky top-0 z-50 md:z-30 h-screen w-64 bg-[#5A3825] text-[#F3EAD8] border-r border-[#7A523A] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-[#7A523A] hidden md:flex items-center space-x-3">
            <img
              src="/logo1.jpeg"
              alt="Logo"
              className="w-11 h-11 rounded-full object-cover border-2 border-[#D4AF37]"
            />
            <div>
              <h2 className="font-serif font-bold text-base text-[#F3EAD8] leading-tight">
                La Matera del Gringo
              </h2>
              <span className="text-[10px] text-[#D4AF37] tracking-widest uppercase font-semibold">
                Gestión Comercial
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#D4AF37] text-[#5A3825] shadow-md font-bold"
                      : "text-[#E0D0C1] hover:bg-[#6E4933] hover:text-[#F3EAD8]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#5A3825]" : "text-[#D4AF37]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#7A523A] space-y-3">
          {/* Status backend */}
          <div className="p-2.5 bg-[#452C1E] rounded-xl flex items-center space-x-2 text-[11px] text-[#D0C0B0]">
            <Database className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="truncate">
              {isSupabaseConfigured ? "Supabase Conectado" : "Almacenamiento Local"}
            </span>
            <span className={`w-2 h-2 rounded-full shrink-0 ${isSupabaseConfigured ? "bg-emerald-400" : "bg-amber-400"}`}></span>
          </div>

          {/* Public store link */}
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#E0D0C1] hover:text-white hover:bg-[#6E4933] border border-[#7A523A] transition-colors"
          >
            <span>Ver Tienda Pública</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-300 hover:text-red-100 hover:bg-red-950/40 border border-red-900/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="hidden md:flex bg-white border-b border-[#E8DFD3] px-8 py-4 items-center justify-between shadow-xs">
          <div>
            <h1 className="text-xl font-serif font-bold text-[#5A3825] capitalize">
              {navItems.find((n) => n.id === activeTab)?.label || "Panel"}
            </h1>
            <p className="text-xs text-[#8C7A6B]">Administración integral del catálogo y promociones</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-xs font-bold text-[#5A3825] block">{user?.nombre || "Administrador"}</span>
              <span className="text-[10px] text-[#8C7A6B] uppercase tracking-wider">{user?.email}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#5A3825] text-[#D4AF37] flex items-center justify-center font-bold text-sm shadow">
              MG
            </div>
          </div>
        </header>

        {/* Tab Body */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
