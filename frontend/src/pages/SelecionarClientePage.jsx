import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaArrowLeft, FaCertificate } from "react-icons/fa";
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
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <button
          className="text-green-700 hover:text-green-900 flex items-center"
          onClick={() => navigate("/dashboard")}
        >
          <FaArrowLeft className="mr-2" /> Voltar ao Dashboard
        </button>
        <h1 className="text-2xl font-bold text-center text-green-800">
          Selecionar Cliente para Certificado
        </h1>
        <div>{/* Espaço para equilibrar o layout */}</div>
      </div>

      <div className="mb-6">
        <div className="relative w-64 mx-auto">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar cliente..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Carregando clientes...</p>
        </div>
      ) : filteredClientes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Nome
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Cidade
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Estado
                </th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClientes.map((cliente) => (
                <tr key={cliente._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 text-sm text-gray-900">
                    {cliente.nome}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-900">
                    {cliente.endereco?.cidade || "-"}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-900">
                    {cliente.endereco?.estado || "-"}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-900 text-center">
                    <button
                      onClick={() => handleSelectCliente(cliente)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center justify-center mx-auto"
                    >
                      <FaCertificate className="mr-1" /> Selecionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {searchTerm
              ? "Nenhum cliente encontrado com os termos de busca."
              : "Nenhum cliente cadastrado. Por favor, cadastre um cliente antes de emitir certificados."}
          </p>
        </div>
      )}
    </div>
  );
};

export default SelecionarClientePage;
