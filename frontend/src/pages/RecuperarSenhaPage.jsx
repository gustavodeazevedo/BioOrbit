import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";

const RecuperarSenhaPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { requestPasswordReset, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
    setEmailError(null);
  };

  const validateForm = () => {
    let isValid = true;

    if (!email) {
      setEmailError("Email é obrigatório");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email inválido");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      console.error("Erro ao solicitar recuperação de senha:", err);
      // O erro global já é tratado pelo contexto de autenticação
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Recuperação de Senha - BioCalib
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Um email com instruções para redefinir sua senha foi enviado para{" "}
              {email}.
            </div>
            <p className="mb-4 text-gray-600">
              Verifique sua caixa de entrada e siga as instruções no email.
            </p>
            <Button
              variant="secondary"
              className="mt-2"
              onClick={() => navigate("/login")}
            >
              Voltar para Login
            </Button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-600">
              Digite seu email abaixo e enviaremos instruções para redefinir sua
              senha.
            </p>

            <form onSubmit={handleSubmit}>
              <FormInput
                label="Email"
                type="email"
                id="email"
                value={email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
                error={emailError}
              />

              <Button className="w-full mt-4">Enviar Instruções</Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Lembrou sua senha?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Voltar para Login
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecuperarSenhaPage;
