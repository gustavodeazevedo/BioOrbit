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
import UpdateNotification from './components/UpdateNotification';
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <UpdateNotification />
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
      </Router>
    </AuthProvider>
  );
}

export default App;
