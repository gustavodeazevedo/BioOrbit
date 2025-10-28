import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Lock, Eye, EyeOff } from "lucide-react";
import "../styles/Auth.css";

const RedefinirSenhaPage = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    senha: "",
    confirmarSenha: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(true);
  const [success, setSuccess] = useState(false);
  const { resetPassword, error } = useAuth();
  const navigate = useNavigate();

  // Verificar se o token existe
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
    }
  }, [token]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    // Limpar erro específico quando o usuário começa a digitar
    if (formErrors[id]) {
      setFormErrors({ ...formErrors, [id]: null });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.senha) errors.senha = "Senha é obrigatória";
    if (!formData.confirmarSenha)
      errors.confirmarSenha = "Confirmação de senha é obrigatória";

    // Validação de senha
    if (formData.senha && formData.senha.length < 6) {
      errors.senha = "A senha deve ter pelo menos 6 caracteres";
    }

    // Validação de confirmação de senha
    if (
      formData.senha &&
      formData.confirmarSenha &&
      formData.senha !== formData.confirmarSenha
    ) {
      errors.confirmarSenha = "As senhas não coincidem";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await resetPassword(token, formData.senha);
      setSuccess(true);
    } catch (err) {
      console.error("Erro ao redefinir senha:", err);
      // O erro global já é tratado pelo contexto de autenticação
    }
  };

  if (!tokenValid) {
    return (
      <div className="login-container">
        <div className="login-form">
          <div className="login-logo">
            <img
              src="/images/bioorbit-logo.png"
              alt="BioOrbit Logo"
              className="logo-image"
            />
          </div>

          <h2 className="form-title">Link Inválido</h2>
          <div className="error-message">
            O link de redefinição de senha é inválido ou expirou.
          </div>
          <div className="links-container">
            <Link to="/recuperar-senha" className="forgot-password">
              Solicitar novo link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-logo">
          <img
            src="/images/bioorbit-logo.png"
            alt="BioOrbit Logo"
            className="logo-image"
          />
        </div>

        <h2 className="form-title">Redefinir Senha</h2>

        {error && <div className="error-message">{error}</div>}

        {success ? (
          <div>
            <div className="success-message">
              Sua senha foi redefinida com sucesso!
            </div>
            <p className="form-description">
              Agora você pode fazer login com sua nova senha.
            </p>
            <button className="login-button" onClick={() => navigate("/login")}>
              IR PARA LOGIN
            </button>
          </div>
        ) : (
          <>
            <p className="form-description">
              Digite sua nova senha abaixo para redefinir seu acesso.
            </p>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <div className="input-group">
                {" "}
                <div className="input-wrapper">
                  <Lock className="input-icon" />{" "}
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="NOVA SENHA"
                    id="senha"
                    className="login-input with-icon"
                    style={{ animationDelay: "0.1s" }}
                    value={formData.senha}
                    onChange={handleChange}
                    required
                  />
                  {formData.senha && (
                    <div
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </div>
                  )}
                  {formErrors.senha && (
                    <div className="error-message">{formErrors.senha}</div>
                  )}
                </div>
              </div>

              <div className="input-group">
                {" "}
                <div className="input-wrapper">
                  <Lock className="input-icon" />{" "}
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="CONFIRMAR NOVA SENHA"
                    id="confirmarSenha"
                    className="login-input with-icon"
                    style={{ animationDelay: "0.2s" }}
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    required
                  />
                  {formData.confirmarSenha && (
                    <div
                      className="toggle-password"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {" "}
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </div>
                  )}
                  {formErrors.confirmarSenha && (
                    <div className="error-message">
                      {formErrors.confirmarSenha}
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="login-button">
                REDEFINIR SENHA
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RedefinirSenhaPage;
