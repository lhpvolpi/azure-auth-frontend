import React, { createContext, useContext } from "react";
import { MsalProvider, useMsal, useIsAuthenticated } from "@azure/msal-react";
import { msalInstance } from "../authConfig";

// Definindo um tipo correto para o contexto
interface AuthContextType {
  instance: any;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthWrapper>{children}</AuthWrapper>
    </MsalProvider>
  );
};

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  return (
    <AuthContext.Provider value={{ instance, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
