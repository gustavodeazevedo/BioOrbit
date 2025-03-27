import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Componente para proteger rotas que requerem autenticação
const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  // Se estiver carregando, não renderiza nada ainda
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se a rota for apenas para admin e o usuário não for admin
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Se estiver autenticado (e for admin se necessário), renderiza o conteúdo da rota
  return <Outlet />;
};

export default ProtectedRoute;
