import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecuperarSenhaPage from "./pages/RecuperarSenhaPage";
import RedefinirSenhaPage from "./pages/RedefinirSenhaPage";
import DashboardPage from "./pages/DashboardPage";
import ClientesPage from "./pages/ClientesPage";
import ClienteFormPage from "./pages/ClienteFormPage";
import SelecionarClientePage from "./pages/SelecionarClientePage";
import EmitirCertificadoPage from "./pages/EmitirCertificadoPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeRedirect from "./components/HomeRedirect";
import VersionUpdateNotification from "./components/VersionUpdateNotification";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import useVersionUpdate from "./hooks/useVersionUpdate";

function App() {
  // Hook for version update checking
  const { 
    isUpdateAvailable, 
    currentVersion, 
    newVersion, 
    reloadApplication 
  } = useVersionUpdate({
    checkInterval: 5 * 60 * 1000, // Check every 5 minutes
    autoStart: true
  });

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomeRedirect />} />
              {/* Rotas públicas */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegisterPage />} />
              <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
              <Route
                path="/redefinir-senha/:token"
                element={<RedefinirSenhaPage />}
              />
              {/* Rotas protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                {/* Rotas de clientes */}
                <Route path="/clientes" element={<ClientesPage />} />
                <Route path="/clientes/novo" element={<ClienteFormPage />} />
                <Route
                  path="/clientes/editar/:id"
                  element={<ClienteFormPage />}
                />
                {/* Rotas de certificados */}
                <Route
                  path="/selecionar-cliente"
                  element={<SelecionarClientePage />}
                />{" "}
                <Route
                  path="/emitir-certificado/:id"
                  element={<EmitirCertificadoPage />}
                />
                {/* Outras rotas protegidas serão adicionadas aqui */}
              </Route>
              {/* Rotas protegidas apenas para admin */}
              <Route element={<ProtectedRoute adminOnly={true} />}>
                {/* Outras rotas de admin serão adicionadas aqui */}
              </Route>{" "}
            </Routes>
          </main>
        </div>

        {/* Version Update Notification Modal */}
        <VersionUpdateNotification
          isVisible={isUpdateAvailable}
          onReload={reloadApplication}
          currentVersion={currentVersion}
          newVersion={newVersion}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
