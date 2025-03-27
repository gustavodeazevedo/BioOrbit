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
import ProtectedRoute from "./components/ProtectedRoute";
import HomeRedirect from "./components/HomeRedirect";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold">BioCalib</h1>
            </div>
          </header>
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
                {/* Outras rotas protegidas serão adicionadas aqui */}
              </Route>

              {/* Rotas protegidas apenas para admin */}
              <Route element={<ProtectedRoute adminOnly={true} />}>
                {/* Rotas de admin serão adicionadas aqui */}
              </Route>
            </Routes>
          </main>
          <footer className="bg-gray-100 border-t mt-auto">
            <div className="container mx-auto px-4 py-4 text-center text-gray-500">
              &copy; {new Date().getFullYear()} BioCalib - Todos os direitos
              reservados
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
