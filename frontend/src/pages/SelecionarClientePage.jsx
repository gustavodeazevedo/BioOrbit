import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Award } from "lucide-react";
import { getClientes } from "../services/clienteService";

const SelecionarClientePage = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await getClientes();
      setClientes(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Erro ao carregar clientes");
      console.error("Erro ao carregar clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCliente = (cliente) => {
    // Navega para a página de emissão de certificado com o ID do cliente selecionado
    navigate(`/emitir-certificado/${cliente._id}`, {
      state: {
        clienteNome: cliente.nome,
        clienteEndereco: cliente.endereco,
      },
    });
  };

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
        className="w-full max-w-6xl mx-auto"
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
            style={{ color: "rgb(144, 199, 45)" }}
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="mr-2" /> Voltar
          </button>
          <h1
            className="text-2xl font-bold text-center"
            style={{ color: "rgb(144, 199, 45)" }}
          >
            Selecionar Cliente para Certificado
          </h1>
          <div>{/* Espaço para equilibrar o layout */}</div>
        </div>        <div className="mb-6">
          <div className="relative w-64 mx-auto">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: "rgb(156, 163, 175)" }}
            />
            <input
              type="text"
              placeholder="Buscar cliente..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2"
              style={{
                "--tw-ring-color": "rgb(144, 199, 45)",
                color: "rgb(75, 85, 99)",
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center p-4">
            <div
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto"
              style={{
                borderTopColor: "rgb(144, 199, 45)",
                borderBottomColor: "rgb(144, 199, 45)",
              }}
            ></div>
            <p className="mt-3" style={{ color: "rgb(75, 85, 99)" }}>
              Carregando clientes...
            </p>
          </div>        ) : filteredClientes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="py-3 px-4 text-left text-sm font-semibold"
                    style={{ color: "rgb(75, 85, 99)" }}
                  >
                    Nome
                  </th>
                  <th 
                    className="py-3 px-4 text-left text-sm font-semibold"
                    style={{ color: "rgb(75, 85, 99)" }}
                  >
                    Cidade
                  </th>
                  <th 
                    className="py-3 px-4 text-left text-sm font-semibold"
                    style={{ color: "rgb(75, 85, 99)" }}
                  >
                    Estado
                  </th>
                  <th 
                    className="py-3 px-4 text-center text-sm font-semibold"
                    style={{ color: "rgb(75, 85, 99)" }}
                  >
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClientes.map((cliente) => (
                  <tr key={cliente._id} className="hover:bg-gray-50">
                    <td 
                      className="py-2 px-4 text-sm"
                      style={{ color: "rgb(75, 85, 99)" }}
                    >
                      {cliente.nome}
                    </td>
                    <td 
                      className="py-2 px-4 text-sm"
                      style={{ color: "rgb(75, 85, 99)" }}
                    >
                      {cliente.endereco?.cidade || "-"}
                    </td>
                    <td 
                      className="py-2 px-4 text-sm"
                      style={{ color: "rgb(75, 85, 99)" }}
                    >
                      {cliente.endereco?.estado || "-"}
                    </td>
                    <td className="py-2 px-4 text-sm text-center">
                      <button
                        onClick={() => handleSelectCliente(cliente)}
                        className="text-white px-3 py-1 rounded-md flex items-center justify-center mx-auto focus:outline-none focus:ring-2 disabled:opacity-50"
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
                      >
                        <Award className="mr-1" /> Selecionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>        ) : (
          <div className="text-center p-6 bg-gray-50 rounded-md border border-gray-200">
            <p style={{ color: "rgb(75, 85, 99)" }}>
              {searchTerm
                ? "Nenhum cliente encontrado com os termos de busca."
                : "Nenhum cliente cadastrado. Por favor, cadastre um cliente antes de emitir certificados."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelecionarClientePage;
