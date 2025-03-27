import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const { login, error } = useAuth();
  const navigate = useNavigate();

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
    if (!formData.email) errors.email = "Email é obrigatório";
    if (!formData.senha) errors.senha = "Senha é obrigatória";

    // Validação básica de email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email inválido";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(formData.email, formData.senha);
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro no login:", err);
      // O erro global já é tratado pelo contexto de autenticação
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login - BioCalib
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            required
            error={formErrors.email}
          />

          <FormInput
            label="Senha"
            type="password"
            id="senha"
            value={formData.senha}
            onChange={handleChange}
            required
            error={formErrors.senha}
          />

          <div className="flex justify-between items-center mb-6">
            <div className="text-sm">
              <Link
                to="/recuperar-senha"
                className="text-blue-600 hover:text-blue-800"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </div>

          <Button className="w-full">Entrar</Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{" "}
            <Link
              to="/registro"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
