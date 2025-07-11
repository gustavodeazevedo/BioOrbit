import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, Building, MapPin } from "lucide-react";
import {
  createCliente,
  getClienteById,
  updateCliente,
} from "../services/clienteService";
import InputMask from "react-input-mask";

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
  }, [id]);

  const fetchCliente = async () => {
    try {
      setLoading(true);
      const cliente = await getClienteById(id);
      setFormData(cliente);
    } catch (err) {
      setError(
        "Erro ao carregar dados do cliente. Por favor, tente novamente."
      );
      console.error("Erro ao carregar cliente:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Lida com campos aninhados (endereco.XXX)
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

    // Limpa erro de validação quando o campo é alterado
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validação dos campos obrigatórios
    if (!formData.nome) errors.nome = "Nome é obrigatório";

    // Validação do endereço
    if (!formData.endereco.rua) errors["endereco.rua"] = "Rua é obrigatória";
    if (!formData.endereco.numero)
      errors["endereco.numero"] = "Número é obrigatório";
    if (!formData.endereco.bairro)
      errors["endereco.bairro"] = "Bairro é obrigatório";
    if (!formData.endereco.cidade)
      errors["endereco.cidade"] = "Cidade é obrigatória";
    if (!formData.endereco.estado)
      errors["endereco.estado"] = "Estado é obrigatório";
    if (!formData.endereco.cep) errors["endereco.cep"] = "CEP é obrigatório";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true); // Certificando que o objeto endereco está completo
      const dadosParaEnvio = {
        ...formData,
        endereco: {
          rua: formData.endereco?.rua || "",
          numero: formData.endereco?.numero || "",
          bairro: formData.endereco?.bairro || "",
          cidade: formData.endereco?.cidade || "",
          estado: formData.endereco?.estado || "",
          cep: formData.endereco?.cep || "",
        },
      };

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
            : "Erro ao salvar cliente. Por favor, tente novamente.")
      );
      window.scrollTo(0, 0);
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center p-6"
        style={{
          backgroundColor: "rgb(249, 250, 251)",
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
                borderTopColor: "rgb(144, 199, 45)",
                borderBottomColor: "rgb(144, 199, 45)",
              }}
            ></div>
            <p className="mt-3" style={{ color: "rgb(75, 85, 99)" }}>
              Carregando dados do cliente...
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{
        backgroundColor: "rgb(249, 250, 251)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "auto",
      }}
    >
      {" "}
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
          {" "}
          <button
            className="flex items-center hover:opacity-80"
            style={{ color: "rgb(144, 199, 45)" }}
            onClick={() => navigate("/clientes")}
            disabled={saving}
          >
            <ArrowLeft className="mr-2" /> Voltar
          </button>
          <h1
            className="text-2xl font-bold text-center"
            style={{ color: "rgb(144, 199, 45)" }}
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
          {" "}
          {/* Informações básicas */}{" "}
          <div className="p-4 rounded-md border border-gray-200">
            {" "}
            <h2
              className="text-lg font-semibold flex items-center mb-3"
              style={{ color: "rgb(75, 85, 99)" }}
            >
              <Building className="mr-2" /> Informações do Cliente
            </h2>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "rgb(75, 85, 99)" }}
              >
                Nome da Empresa*
              </label>{" "}
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md transition-colors ${
                  validationErrors.nome
                    ? "border-red-500"
                    : "border-gray-300 focus:border-green-500"
                } focus:outline-none`}
                style={{
                  borderColor: validationErrors.nome ? "#ef4444" : "#d1d5db",
                  color: "rgb(75, 85, 99)",
                }}
                onFocus={(e) => {
                  if (!validationErrors.nome) {
                    e.target.style.borderColor = "rgb(144, 199, 45)";
                  }
                }}
                onBlur={(e) => {
                  if (!validationErrors.nome) {
                    e.target.style.borderColor = "#d1d5db";
                  }
                }}
                placeholder="Nome da empresa"
              />
              {validationErrors.nome && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.nome}
                </p>
              )}
            </div>
          </div>{" "}
          {/* Endereço */}
          <div className="p-4 rounded-md border border-gray-200">
            {" "}
            <h2
              className="text-lg font-semibold flex items-center mb-3"
              style={{ color: "rgb(75, 85, 99)" }}
            >
              <MapPin className="mr-2" /> Endereço
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "rgb(75, 85, 99)" }}
                >
                  Rua*
                </label>{" "}
                <input
                  type="text"
                  name="endereco.rua"
                  value={formData.endereco.rua}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md transition-colors ${
                    validationErrors["endereco.rua"]
                      ? "border-red-500"
                      : "border-gray-300 focus:border-green-500"
                  } focus:outline-none`}
                  style={{
                    borderColor: validationErrors["endereco.rua"]
                      ? "#ef4444"
                      : "#d1d5db",
                    color: "rgb(75, 85, 99)",
                  }}
                  onFocus={(e) => {
                    if (!validationErrors["endereco.rua"]) {
                      e.target.style.borderColor = "rgb(144, 199, 45)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!validationErrors["endereco.rua"]) {
                      e.target.style.borderColor = "#d1d5db";
                    }
                  }}
                  placeholder="Nome da rua"
                />
                {validationErrors["endereco.rua"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors["endereco.rua"]}
                  </p>
                )}{" "}
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "rgb(75, 85, 99)" }}
                >
                  Número*
                </label>{" "}
                <input
                  type="text"
                  name="endereco.numero"
                  value={formData.endereco.numero}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md transition-colors ${
                    validationErrors["endereco.numero"]
                      ? "border-red-500"
                      : "border-gray-300 focus:border-green-500"
                  } focus:outline-none`}
                  style={{
                    borderColor: validationErrors["endereco.numero"]
                      ? "#ef4444"
                      : "#d1d5db",
                    color: "rgb(75, 85, 99)",
                  }}
                  onFocus={(e) => {
                    if (!validationErrors["endereco.numero"]) {
                      e.target.style.borderColor = "rgb(144, 199, 45)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!validationErrors["endereco.numero"]) {
                      e.target.style.borderColor = "#d1d5db";
                    }
                  }}
                  placeholder="123"
                />
                {validationErrors["endereco.numero"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors["endereco.numero"]}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "rgb(75, 85, 99)" }}
                >
                  Bairro*
                </label>{" "}
                <input
                  type="text"
                  name="endereco.bairro"
                  value={formData.endereco.bairro}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md transition-colors ${
                    validationErrors["endereco.bairro"]
                      ? "border-red-500"
                      : "border-gray-300 focus:border-green-500"
                  } focus:outline-none`}
                  style={{
                    borderColor: validationErrors["endereco.bairro"]
                      ? "#ef4444"
                      : "#d1d5db",
                    color: "rgb(75, 85, 99)",
                  }}
                  onFocus={(e) => {
                    if (!validationErrors["endereco.bairro"]) {
                      e.target.style.borderColor = "rgb(144, 199, 45)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!validationErrors["endereco.bairro"]) {
                      e.target.style.borderColor = "#d1d5db";
                    }
                  }}
                  placeholder="Nome do bairro"
                />
                {validationErrors["endereco.bairro"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors["endereco.bairro"]}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "rgb(75, 85, 99)" }}
                >
                  CEP*
                </label>{" "}
                <InputMask
                  mask="99999-999"
                  name="endereco.cep"
                  value={formData.endereco.cep}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md transition-colors ${
                    validationErrors["endereco.cep"]
                      ? "border-red-500"
                      : "border-gray-300 focus:border-green-500"
                  } focus:outline-none`}
                  style={{
                    borderColor: validationErrors["endereco.cep"]
                      ? "#ef4444"
                      : "#d1d5db",
                    color: "rgb(75, 85, 99)",
                  }}
                  onFocus={(e) => {
                    if (!validationErrors["endereco.cep"]) {
                      e.target.style.borderColor = "rgb(144, 199, 45)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!validationErrors["endereco.cep"]) {
                      e.target.style.borderColor = "#d1d5db";
                    }
                  }}
                  placeholder="00000-000"
                />
                {validationErrors["endereco.cep"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors["endereco.cep"]}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "rgb(75, 85, 99)" }}
                >
                  Cidade*
                </label>{" "}
                <input
                  type="text"
                  name="endereco.cidade"
                  value={formData.endereco.cidade}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md transition-colors ${
                    validationErrors["endereco.cidade"]
                      ? "border-red-500"
                      : "border-gray-300 focus:border-green-500"
                  } focus:outline-none`}
                  style={{
                    borderColor: validationErrors["endereco.cidade"]
                      ? "#ef4444"
                      : "#d1d5db",
                    color: "rgb(75, 85, 99)",
                  }}
                  onFocus={(e) => {
                    if (!validationErrors["endereco.cidade"]) {
                      e.target.style.borderColor = "rgb(144, 199, 45)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!validationErrors["endereco.cidade"]) {
                      e.target.style.borderColor = "#d1d5db";
                    }
                  }}
                  placeholder="Nome da cidade"
                />
                {validationErrors["endereco.cidade"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors["endereco.cidade"]}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "rgb(75, 85, 99)" }}
                >
                  Estado*
                </label>{" "}
                <select
                  name="endereco.estado"
                  value={formData.endereco.estado}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md transition-colors ${
                    validationErrors["endereco.estado"]
                      ? "border-red-500"
                      : "border-gray-300 focus:border-green-500"
                  } focus:outline-none`}
                  style={{
                    borderColor: validationErrors["endereco.estado"]
                      ? "#ef4444"
                      : "#d1d5db",
                    color: "rgb(75, 85, 99)",
                  }}
                  onFocus={(e) => {
                    if (!validationErrors["endereco.estado"]) {
                      e.target.style.borderColor = "rgb(144, 199, 45)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!validationErrors["endereco.estado"]) {
                      e.target.style.borderColor = "#d1d5db";
                    }
                  }}
                >
                  <option value="">Selecione um estado</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
                {validationErrors["endereco.estado"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors["endereco.estado"]}
                  </p>
                )}
              </div>{" "}
            </div>
          </div>
          {/* Botões de ação */}
          <div className="flex justify-end gap-4">
            {" "}
            <button
              type="button"
              onClick={() => navigate("/clientes")}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              style={{ color: "rgb(75, 85, 99)" }}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-md flex items-center focus:outline-none focus:ring-2 disabled:opacity-50"
              style={{
                backgroundColor: "rgb(144, 199, 45)",
                "--tw-ring-color": "rgb(144, 199, 45)",
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "rgb(130, 180, 40)")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "rgb(144, 199, 45)")
              }
              disabled={saving}
            >
              {" "}
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
