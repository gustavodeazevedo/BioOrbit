import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, Building, MapPin } from "lucide-react";
import {
  createCliente,
  getClienteById,
  updateCliente,
} from "../services/clienteService";
import InputMask from "react-input-mask";

// Constantes para cores e estilos
const COLORS = {
  PRIMARY: "rgb(144, 199, 45)",
  PRIMARY_HOVER: "rgb(130, 180, 40)",
  TEXT: "rgb(75, 85, 99)",
  BORDER_DEFAULT: "#d1d5db",
  BORDER_ERROR: "#ef4444",
  BACKGROUND: "rgb(249, 250, 251)",
};

const ESTADOS_BRASIL = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

const ERROR_MESSAGES = {
  LOAD_FAILED: "Erro ao carregar dados do cliente. Por favor, tente novamente.",
  SAVE_FAILED: "Erro ao salvar cliente. Por favor, tente novamente.",
  VALIDATION_REQUIRED: {
    nome: "Nome é obrigatório",
    rua: "Rua é obrigatória",
    numero: "Número é obrigatório",
    bairro: "Bairro é obrigatório",
    cidade: "Cidade é obrigatória",
    estado: "Estado é obrigatório",
    cep: "CEP é obrigatório",
  },
};

const initialState = {
  nome: "",
  endereco: {
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  },
};

const ClienteFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      fetchCliente();
    }
  }, [id, isEditMode]);

  // Funções auxiliares para controle de estado
  const clearValidationError = (fieldName) => {
    if (validationErrors[fieldName]) {
      setValidationErrors((prev) => ({
        ...prev,
        [fieldName]: null,
      }));
    }
  };

  // Handler reutilizável para focus/blur
  const createFocusBlurHandlers = (fieldName) => ({
    onFocus: (e) => {
      if (!validationErrors[fieldName]) {
        e.target.style.borderColor = COLORS.PRIMARY;
      }
    },
    onBlur: (e) => {
      if (!validationErrors[fieldName]) {
        e.target.style.borderColor = COLORS.BORDER_DEFAULT;
      }
    },
  });

  // Função para buscar cliente
  const fetchCliente = async () => {
    try {
      setLoading(true);
      const cliente = await getClienteById(id);
      setFormData(cliente);
    } catch (err) {
      setError(ERROR_MESSAGES.LOAD_FAILED);
      console.error("Erro ao carregar cliente:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handler para mudanças nos campos
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    clearValidationError(name);
  };

  // Função de validação
  const validateForm = () => {
    const errors = {};

    if (!formData.nome) errors.nome = ERROR_MESSAGES.VALIDATION_REQUIRED.nome;

    // Validação do endereço
    if (!formData.endereco.rua)
      errors["endereco.rua"] = ERROR_MESSAGES.VALIDATION_REQUIRED.rua;
    if (!formData.endereco.numero)
      errors["endereco.numero"] = ERROR_MESSAGES.VALIDATION_REQUIRED.numero;
    if (!formData.endereco.bairro)
      errors["endereco.bairro"] = ERROR_MESSAGES.VALIDATION_REQUIRED.bairro;
    if (!formData.endereco.cidade)
      errors["endereco.cidade"] = ERROR_MESSAGES.VALIDATION_REQUIRED.cidade;
    if (!formData.endereco.estado)
      errors["endereco.estado"] = ERROR_MESSAGES.VALIDATION_REQUIRED.estado;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Função para preparar dados para envio
  const prepareDataForSubmission = () => ({
    ...formData,
    endereco: {
      rua: formData.endereco?.rua || "",
      numero: formData.endereco?.numero || "",
      bairro: formData.endereco?.bairro || "",
      cidade: formData.endereco?.cidade || "",
      estado: formData.endereco?.estado || "",
      cep: formData.endereco?.cep || "",
    },
  });

  // Handler para envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const dadosParaEnvio = prepareDataForSubmission();

      console.log("Dados enviados:", dadosParaEnvio);

      if (isEditMode) {
        await updateCliente(id, dadosParaEnvio);
      } else {
        await createCliente(dadosParaEnvio);
      }

      navigate("/clientes");
    } catch (err) {
      console.error("Erro detalhado:", err);
      setError(
        err.message ||
          (err.error
            ? `Erro ao salvar cliente: ${err.error}`
            : ERROR_MESSAGES.SAVE_FAILED)
      );
      window.scrollTo(0, 0);
    } finally {
      setSaving(false);
    }
  };
  // Componentes internos para melhor organização
  const LoadingScreen = () => (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{
        backgroundColor: COLORS.BACKGROUND,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "auto",
      }}
    >
      <div
        className="p-6 max-w-4xl mx-auto"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          boxShadow:
            "0 20px 40px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <div className="text-center p-4">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto"
            style={{
              borderTopColor: COLORS.PRIMARY,
              borderBottomColor: COLORS.PRIMARY,
            }}
          ></div>
          <p className="mt-3" style={{ color: COLORS.TEXT }}>
            Carregando dados do cliente...
          </p>
        </div>
      </div>
    </div>
  );

  const FormInput = ({
    label,
    name,
    value,
    placeholder,
    type = "text",
    required = false,
  }) => {
    const fieldName = name;
    const hasError = validationErrors[fieldName];
    const focusBlurHandlers = createFocusBlurHandlers(fieldName);

    return (
      <div>
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: COLORS.TEXT }}
        >
          {label}
          {required && "*"}
        </label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md transition-colors ${
            hasError
              ? "border-red-500"
              : "border-gray-300 focus:border-green-500"
          } focus:outline-none`}
          style={{
            borderColor: hasError ? COLORS.BORDER_ERROR : COLORS.BORDER_DEFAULT,
            color: COLORS.TEXT,
          }}
          placeholder={placeholder}
          {...focusBlurHandlers}
        />
        {hasError && <p className="text-red-500 text-xs mt-1">{hasError}</p>}
      </div>
    );
  };

  const FormSelect = ({ label, name, value, options, required = false }) => {
    const fieldName = name;
    const hasError = validationErrors[fieldName];
    const focusBlurHandlers = createFocusBlurHandlers(fieldName);

    return (
      <div>
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: COLORS.TEXT }}
        >
          {label}
          {required && "*"}
        </label>
        <select
          name={name}
          value={value}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md transition-colors ${
            hasError
              ? "border-red-500"
              : "border-gray-300 focus:border-green-500"
          } focus:outline-none`}
          style={{
            borderColor: hasError ? COLORS.BORDER_ERROR : COLORS.BORDER_DEFAULT,
            color: COLORS.TEXT,
          }}
          {...focusBlurHandlers}
        >
          <option value="">Selecione um estado</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {hasError && <p className="text-red-500 text-xs mt-1">{hasError}</p>}
      </div>
    );
  };

  const FormInputMask = ({
    label,
    name,
    value,
    mask,
    placeholder,
    required = false,
  }) => {
    const fieldName = name;
    const hasError = validationErrors[fieldName];
    const focusBlurHandlers = createFocusBlurHandlers(fieldName);

    return (
      <div>
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: COLORS.TEXT }}
        >
          {label}
          {required && "*"}
        </label>
        <InputMask
          mask={mask}
          name={name}
          value={value}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md transition-colors ${
            hasError
              ? "border-red-500"
              : "border-gray-300 focus:border-green-500"
          } focus:outline-none`}
          style={{
            borderColor: hasError ? COLORS.BORDER_ERROR : COLORS.BORDER_DEFAULT,
            color: COLORS.TEXT,
          }}
          placeholder={placeholder}
          {...focusBlurHandlers}
        />
        {hasError && <p className="text-red-500 text-xs mt-1">{hasError}</p>}
      </div>
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{
        backgroundColor: COLORS.BACKGROUND,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "auto",
      }}
    >
      <div
        className="w-full max-w-4xl mx-auto"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          boxShadow:
            "0 20px 40px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          padding: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <button
            className="flex items-center hover:opacity-80"
            style={{ color: COLORS.PRIMARY }}
            onClick={() => navigate("/clientes")}
            disabled={saving}
          >
            <ArrowLeft className="mr-2" /> Voltar
          </button>
          <h1
            className="text-2xl font-bold text-center"
            style={{ color: COLORS.PRIMARY }}
          >
            {isEditMode ? "Editar Cliente" : "Novo Cliente"}
          </h1>
          <div>{/* Espaço para equilibrar o layout */}</div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações básicas */}
          <div className="p-4 rounded-md border border-gray-200">
            <h2
              className="text-lg font-semibold flex items-center mb-3"
              style={{ color: COLORS.TEXT }}
            >
              <Building className="mr-2" /> Informações do Cliente
            </h2>
            <FormInput
              label="Nome da Empresa"
              name="nome"
              value={formData.nome}
              placeholder="Nome da empresa"
              required
            />
          </div>

          {/* Endereço */}
          <div className="p-4 rounded-md border border-gray-200">
            <h2
              className="text-lg font-semibold flex items-center mb-3"
              style={{ color: COLORS.TEXT }}
            >
              <MapPin className="mr-2" /> Endereço
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Rua"
                name="endereco.rua"
                value={formData.endereco.rua}
                placeholder="Nome da rua"
                required
              />
              <FormInput
                label="Número"
                name="endereco.numero"
                value={formData.endereco.numero}
                placeholder="123"
                required
              />
              <FormInput
                label="Bairro"
                name="endereco.bairro"
                value={formData.endereco.bairro}
                placeholder="Nome do bairro"
                required
              />
              <FormInputMask
                label="CEP"
                name="endereco.cep"
                value={formData.endereco.cep}
                mask="99999-999"
                placeholder="00000-000"
              />
              <FormInput
                label="Cidade"
                name="endereco.cidade"
                value={formData.endereco.cidade}
                placeholder="Nome da cidade"
                required
              />
              <FormSelect
                label="Estado"
                name="endereco.estado"
                value={formData.endereco.estado}
                options={ESTADOS_BRASIL}
                required
              />
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/clientes")}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              style={{ color: COLORS.TEXT }}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-md flex items-center focus:outline-none focus:ring-2 disabled:opacity-50"
              style={{
                backgroundColor: COLORS.PRIMARY,
                "--tw-ring-color": COLORS.PRIMARY,
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = COLORS.PRIMARY_HOVER)
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = COLORS.PRIMARY)
              }
              disabled={saving}
            >
              <Save className="mr-2" />
              {saving ? "Salvando..." : "Salvar Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteFormPage;
