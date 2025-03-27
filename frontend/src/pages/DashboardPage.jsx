import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>

      {user && (
        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            <span className="font-medium">Nome:</span> {user.nome}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-medium">Cargo:</span> {user.cargo}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-medium">Setor:</span> {user.setor}
          </p>
        </div>
      )}

      <div className="flex flex-col space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            Equipamentos
          </h3>
          <p className="text-gray-600 mb-3">
            Gerencie os equipamentos biomédicos cadastrados no sistema.
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate("/equipamentos")}
            className="w-full md:w-auto"
          >
            Gerenciar Equipamentos
          </Button>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-medium text-green-800 mb-2">
            Calibrações
          </h3>
          <p className="text-gray-600 mb-3">
            Visualize e gerencie as calibrações agendadas e realizadas.
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate("/calibracoes")}
            className="w-full md:w-auto"
          >
            Gerenciar Calibrações
          </Button>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200">
        <Button variant="danger" onClick={handleLogout}>
          Sair
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
