import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("banik_token");
    const email = localStorage.getItem("banik_email");
    const role = localStorage.getItem("banik_role");
    return token ? { token, email, role } : null;
  });

  useEffect(() => {
    if (auth) {
      localStorage.setItem("banik_token", auth.token);
      localStorage.setItem("banik_email", auth.email);
      localStorage.setItem("banik_role", auth.role);
    } else {
      localStorage.removeItem("banik_token");
      localStorage.removeItem("banik_email");
      localStorage.removeItem("banik_role");
    }
  }, [auth]);

  const login = (data) => setAuth(data);
  const logout = () => setAuth(null);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
