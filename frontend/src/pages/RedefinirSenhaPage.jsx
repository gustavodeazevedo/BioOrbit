import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";

const RedefinirSenhaPage = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    senha: "",
    confirmarSenha: "",
  });
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
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Link Inválido
          </h2>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            O link de redefinição de senha é inválido ou expirou.
          </div>
          <div className="text-center mt-4">
            <Link
              to="/recuperar-senha"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Solicitar novo link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Redefinir Senha - BioCalib
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Sua senha foi redefinida com sucesso!
            </div>
            <p className="mb-4 text-gray-600">
              Agora você pode fazer login com sua nova senha.
            </p>
            <Button
              variant="primary"
              className="mt-2"
              onClick={() => navigate("/login")}
            >
              Ir para Login
            </Button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-600">
              Digite sua nova senha abaixo para redefinir sua senha.
            </p>

            <form onSubmit={handleSubmit}>
              <FormInput
                label="Nova Senha"
                type="password"
                id="senha"
                value={formData.senha}
                onChange={handleChange}
                required
                error={formErrors.senha}
              />

              <FormInput
                label="Confirmar Nova Senha"
                type="password"
                id="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required
                error={formErrors.confirmarSenha}
              />

              <Button className="w-full mt-4">Redefinir Senha</Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RedefinirSenhaPage;
