import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  LogOut,
  UserPlus,
  Award,
  UserRound,
  Mail,
  Briefcase,
  Building,
} from "lucide-react";
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
          <div className="user-info-card">
            {" "}
            <div className="user-info-header">
              <UserRound className="user-avatar" />
              <h3 className="user-info-title">
                Olá, {user.nome.split(" ")[0]}
              </h3>
            </div>
            <div className="user-info-details">
              <div className="user-info-row">
                <UserRound className="user-info-icon" />
                <div className="user-info-content">
                  <span className="user-info-label">Nome</span>
                  <span className="user-info-value">{user.nome}</span>
                </div>
              </div>
              <div className="user-info-row">
                <Mail className="user-info-icon" />
                <div className="user-info-content">
                  <span className="user-info-label">Email</span>
                  <span className="user-info-value">{user.email}</span>
                </div>
              </div>
              <div className="user-info-row">
                <Briefcase className="user-info-icon" />
                <div className="user-info-content">
                  <span className="user-info-label">Cargo</span>
                  <span className="user-info-value">{user.cargo}</span>
                </div>
              </div>
              <div className="user-info-row">
                <Building className="user-info-icon" />
                <div className="user-info-content">
                  <span className="user-info-label">Setor</span>
                  <span className="user-info-value">{user.setor}</span>
                </div>{" "}
              </div>
            </div>
          </div>
        )}
        <div className="dashboard-sections">
          {" "}
          <div className="dashboard-section-card clients">
            <div className="card-icon-container">
              <UserPlus className="card-icon" />
            </div>
            <div className="card-content">
              <h3 className="section-title">Registro de Cliente</h3>
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
          </div>{" "}
          <div className="dashboard-section-card certificate">
            <div className="card-icon-container">
              <Award className="card-icon" />
            </div>
            <div className="card-content">
              <h3 className="section-title">Emitir Certificado</h3>
              <p className="section-description">
                Selecione um cliente e emita certificados.
              </p>
              <button
                className="dashboard-button certificate-btn"
                onClick={() => navigate("/selecionar-cliente")}
              >
                Emitir Certificado
              </button>{" "}
            </div>
          </div>
          {/* Seção de Administração - visível apenas para admins, mas sem o botão de token */}
          {isAdmin() && (
            <div className="dashboard-section-card admin">
              <div className="card-icon-container">
                <Shield className="card-icon" />
              </div>
              <div className="card-content">
                <h3 className="section-title">Administração</h3>
                <p className="section-description">
                  Acesso às funcionalidades administrativas do sistema.
                </p>
                {/* Botão removido */}
              </div>
            </div>
          )}
        </div>{" "}
        <div className="dashboard-footer">
          {" "}
          <button className="logout-button" onClick={handleLogout}>
            <LogOut className="logout-icon" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
