import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cargo: "",
    setor: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const { register, error } = useAuth();
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
    if (!formData.nome) errors.nome = "Nome é obrigatório";
    if (!formData.email) errors.email = "Email é obrigatório";
    if (!formData.senha) errors.senha = "Senha é obrigatória";
    if (!formData.confirmarSenha)
      errors.confirmarSenha = "Confirmação de senha é obrigatória";
    if (!formData.cargo) errors.cargo = "Cargo é obrigatório";
    if (!formData.setor) errors.setor = "Setor é obrigatório";

    // Validação de email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email inválido";
    }

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
      // Remover confirmarSenha antes de enviar para a API
      const { confirmarSenha, ...userData } = formData;
      await register(userData);
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro no cadastro:", err);
      // O erro global já é tratado pelo contexto de autenticação
    }
  };

  return (
    <div className="flex justify-center items-center py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Cadastro - BioCalib
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Nome Completo"
            id="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            error={formErrors.nome}
          />

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Cargo"
              id="cargo"
              value={formData.cargo}
              onChange={handleChange}
              required
              error={formErrors.cargo}
            />

            <FormInput
              label="Setor"
              id="setor"
              value={formData.setor}
              onChange={handleChange}
              required
              error={formErrors.setor}
            />
          </div>

          <FormInput
            label="Senha"
            type="password"
            id="senha"
            value={formData.senha}
            onChange={handleChange}
            required
            error={formErrors.senha}
          />

          <FormInput
            label="Confirmar Senha"
            type="password"
            id="confirmarSenha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            required
            error={formErrors.confirmarSenha}
          />

          <Button className="w-full mt-4">Cadastrar</Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
