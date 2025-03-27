import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Componente para redirecionar da página inicial com base no estado de autenticação
const HomeRedirect = () => {
  const { user, loading } = useAuth();

  // Se estiver carregando, mostra um indicador de carregamento
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se estiver autenticado, redireciona para o dashboard
  // Se não estiver autenticado, redireciona para o login
  return user ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default HomeRedirect;
