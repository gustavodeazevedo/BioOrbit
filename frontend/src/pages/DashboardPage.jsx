import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaSignOutAlt,
  FaUserPlus,
  FaCertificate
} from "react-icons/fa";
import "../styles/Dashboard.css";

const DashboardPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-panel">
        <div className="dashboard-header">
          <h2 className="dashboard-title">BioOrbit</h2>
          <p className="dashboard-welcome">
            Sistema de Calibração de Micropipetas
          </p>
        </div>

        {user && (
          <div className="user-info">
            <h3 className="user-info-title">Informações do Usuário</h3>
            <div className="user-info-row">
              <span className="user-info-label">Nome:</span>
              <span class="user-info-value">{user.nome}</span>
            </div>
            <div className="user-info-row">
              <span className="user-info-label">Email:</span>
              <span className="user-info-value">{user.email}</span>
            </div>
            <div className="user-info-row">
              <span className="user-info-label">Cargo:</span>
              <span className="user-info-value">{user.cargo}</span>
            </div>
            <div className="user-info-row">
              <span className="user-info-label">Setor:</span>
              <span className="user-info-value">{user.setor}</span>
            </div>
          </div>
        )}

        <div className="dashboard-sections">
          <div className="dashboard-section clients">
            <h3 className="section-title">
              <FaUserPlus style={{ marginRight: "8px", display: "inline" }} />
              Registro de Cliente
            </h3>
            <p className="section-description">
              Cadastre e gerencie os clientes da empresa.
            </p>
            <button
              className="dashboard-button clients-btn"
              onClick={() => navigate("/clientes")}
            >
              Gerenciar Clientes
            </button>
          </div>

          <div className="dashboard-section certificate">
            <h3 className="section-title">
              <FaCertificate style={{ marginRight: "8px", display: "inline" }} />
              Emitir Certificado
            </h3>
            <p className="section-description">
              Selecione um cliente e emita certificados de calibração de micropipetas.
            </p>
            <button
              className="dashboard-button certificate-btn"
              onClick={() => navigate("/selecionar-cliente")}
            >
              Emitir Certificado
            </button>
          </div>

          {/* Seção de Administração - visível apenas para admins, mas sem o botão de token */}
          {isAdmin() && (
            <div className="dashboard-section admin">
              <h3 className="section-title">
                <FaShieldAlt
                  style={{ marginRight: "8px", display: "inline" }}
                />
                Administração
              </h3>
              <p className="section-description">
                Acesso às funcionalidades administrativas do sistema.
              </p>
              {/* Botão removido */}
            </div>
          )}
        </div>

        <div className="dashboard-footer">
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt style={{ marginRight: "8px", display: "inline" }} />
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
