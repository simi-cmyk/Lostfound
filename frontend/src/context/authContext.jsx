import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const login = (userData) => {
    console.log("FULL LOGIN DATA:", userData);

    //  normalize role to lowercase → "Admin" becomes "admin"
    const normalized = {
      ...userData,
      role: userData.role?.toLowerCase(),
    };

    setAuth(normalized);
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};