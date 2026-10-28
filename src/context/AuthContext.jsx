import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const AuthContext = createContext(null);

const LOCAL_STORAGE_AUTH_KEY = "matera_admin_session";

// Credenciales por defecto para acceso administrativo en desarrollo / offline
const DEFAULT_ADMIN = {
  email: "admin@lamateradelgringo.com",
  password: "admin",
  role: "ADMIN",
  nombre: "Marcos Godoy (Admin)"
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Si Supabase está configurado, escuchar cambios de sesión
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            role: "ADMIN",
            nombre: session.user.user_metadata?.nombre || "Administrador"
          });
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            role: "ADMIN",
            nombre: session.user.user_metadata?.nombre || "Administrador"
          });
        } else {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // 2. Modo Local / Fallback con localStorage
      try {
        const savedSession = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          if (parsed && parsed.role === "ADMIN") {
            setUser(parsed);
          }
        }
      } catch (err) {
        console.error("Error al restaurar sesión admin:", err);
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    // Intentar con Supabase si está disponible
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw new Error(error.message);
      }
      const adminUser = {
        id: data.user.id,
        email: data.user.email,
        role: "ADMIN",
        nombre: data.user.user_metadata?.nombre || "Administrador"
      };
      setUser(adminUser);
      return adminUser;
    }

    // Validación con credenciales locales
    if (
      email.trim().toLowerCase() === DEFAULT_ADMIN.email.toLowerCase() &&
      password === DEFAULT_ADMIN.password
    ) {
      const adminUser = {
        id: "local-admin-1",
        email: DEFAULT_ADMIN.email,
        role: "ADMIN",
        nombre: DEFAULT_ADMIN.nombre
      };
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(adminUser));
      setUser(adminUser);
      return adminUser;
    } else {
      throw new Error("Credenciales inválidas. Compruebe el correo y la contraseña.");
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    setUser(null);
  };

  const isAdmin = user && user.role === "ADMIN";

  return (
    <AuthContext.Provider value={{ user, role: user?.role || null, isAdmin, loading, login, logout, defaultCredentials: DEFAULT_ADMIN }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de un AuthProvider");
  }
  return context;
};
