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
import UpdateNotification from "./components/UpdateNotification";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <UpdateNotification />
        <Routes>
          <Route path="/" element={<HomeRedirect />} />

          {/* Rotas públicas - com wrapper */}
          <Route
            path="/login"
            element={
              <div className="min-h-screen bg-gray-50">
                <main className="container mx-auto px-4 py-8">
                  <LoginPage />
                </main>
              </div>
            }
          />
          <Route
            path="/registro"
            element={
              <div className="min-h-screen bg-gray-50">
                <main className="container mx-auto px-4 py-8">
                  <RegisterPage />
                </main>
              </div>
            }
          />
          <Route
            path="/recuperar-senha"
            element={
              <div className="min-h-screen bg-gray-50">
                <main className="container mx-auto px-4 py-8">
                  <RecuperarSenhaPage />
                </main>
              </div>
            }
          />
          <Route
            path="/redefinir-senha/:token"
            element={
              <div className="min-h-screen bg-gray-50">
                <main className="container mx-auto px-4 py-8">
                  <RedefinirSenhaPage />
                </main>
              </div>
            }
          />

          {/* Rotas protegidas */}
          <Route element={<ProtectedRoute />}>
            {/* Dashboard - SEM wrapper */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Rotas de clientes - com wrapper */}
            <Route
              path="/clientes"
              element={
                <div className="min-h-screen bg-gray-50">
                  <main className="container mx-auto px-4 py-8">
                    <ClientesPage />
                  </main>
                </div>
              }
            />
            <Route
              path="/clientes/novo"
              element={
                <div className="min-h-screen bg-gray-50">
                  <main className="container mx-auto px-4 py-8">
                    <ClienteFormPage />
                  </main>
                </div>
              }
            />
            <Route
              path="/clientes/editar/:id"
              element={
                <div className="min-h-screen bg-gray-50">
                  <main className="container mx-auto px-4 py-8">
                    <ClienteFormPage />
                  </main>
                </div>
              }
            />

            {/* Rotas de certificados - com wrapper */}
            <Route
              path="/selecionar-cliente"
              element={
                <div className="min-h-screen bg-gray-50">
                  <main className="container mx-auto px-4 py-8">
                    <SelecionarClientePage />
                  </main>
                </div>
              }
            />
            <Route
              path="/emitir-certificado/:id"
              element={
                <div className="min-h-screen bg-gray-50">
                  <main className="container mx-auto px-4 py-8">
                    <EmitirCertificadoPage />
                  </main>
                </div>
              }
            />
          </Route>

          {/* Rotas protegidas apenas para admin */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            {/* Outras rotas de admin serão adicionadas aqui */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
