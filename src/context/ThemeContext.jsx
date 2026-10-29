import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "matera_theme_preference";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === "light" || saved === "dark" || saved === "system")) {
        return saved;
      }
    } catch (e) {
      console.warn("No se pudo leer la preferencia de tema:", e);
    }
    return "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark") return "dark";
    if (saved === "light") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (isDarkTheme) => {
      if (isDarkTheme) {
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
        root.style.colorScheme = "dark";
        setResolvedTheme("dark");
      } else {
        root.classList.remove("dark");
        root.setAttribute("data-theme", "light");
        root.style.colorScheme = "light";
        setResolvedTheme("light");
      }
    };

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mediaQuery.matches);

      const handleChange = (e) => {
        applyTheme(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      applyTheme(theme === "dark");
    }

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.warn("No se pudo guardar la preferencia de tema:", e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const current = prev === "system" ? resolvedTheme : prev;
      return current === "dark" ? "light" : "dark";
    });
  };

  const isDark = resolvedTheme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  }
  return context;
};
