import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "", compact = false }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] cursor-pointer ${
        isDark
          ? "bg-[#2C211B] text-[#D4AF37] hover:bg-[#3D2E26] border border-[#5A3825]"
          : "bg-[#4A2E1F] text-[#F3EAD8] hover:bg-[#5C3A27] border border-[#7A523A]"
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-[#D4AF37] animate-in fade-in zoom-in-75 duration-300" />
        ) : (
          <Moon className="w-4 h-4 text-[#F3EAD8] animate-in fade-in zoom-in-75 duration-300" />
        )}
      </div>

      {!compact && (
        <span className="sr-only">
          {isDark ? "Modo Claro" : "Modo Oscuro"}
        </span>
      )}
    </button>
  );
}
