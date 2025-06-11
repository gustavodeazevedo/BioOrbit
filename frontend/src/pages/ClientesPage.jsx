import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Search, Edit, Trash2, ArrowLeft } from "lucide-react";
import { getClientes, deleteCliente } from "../services/clienteService";

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
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

  const handleEdit = (id) => {
    navigate(`/clientes/editar/${id}`);
  };

  const handleDelete = async (id) => {
    if (confirmDelete === id) {
      try {
        await deleteCliente(id);
        setClientes(clientes.filter((cliente) => cliente._id !== id));
        setConfirmDelete(null);
      } catch (err) {
        setError(err.message || "Erro ao excluir cliente");
        console.error("Erro ao excluir cliente:", err);
      }
    } else {
      setConfirmDelete(id);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <button
          className="hover:opacity-80 flex items-center"
          style={{ color: "rgb(144, 199, 45)" }}
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="mr-2" /> Voltar ao Dashboard
        </button>
        <h1
          className="text-2xl font-bold text-center"
          style={{ color: "rgb(144, 199, 45)" }}
        >
          Gerenciamento de Clientes
        </h1>
        <div>{/* Espaço para equilibrar o layout */}</div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar cliente..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-1 focus:border-[rgb(144,199,45)]"
            style={{ "--tw-ring-color": "rgb(144, 199, 45)" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => navigate("/clientes/novo")}
          className="text-white px-4 py-2 rounded-lg flex items-center hover:opacity-80"
          style={{ backgroundColor: "rgb(144, 199, 45)" }}
        >
          <UserPlus className="mr-2" /> Novo Cliente
        </button>
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
                  Ações
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
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(cliente._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => handleDelete(cliente._id)}
                        className={`${
                          confirmDelete === cliente._id
                            ? "text-red-600"
                            : "text-gray-600 hover:text-red-600"
                        }`}
                      >
                        <Trash2 />
                      </button>
                    </div>
                    {confirmDelete === cliente._id && (
                      <div className="mt-2 text-xs flex justify-center space-x-2">
                        <span className="text-red-600">
                          Confirmar exclusão?
                        </span>
                        <button
                          onClick={() => handleDelete(cliente._id)}
                          className="text-red-600 font-bold"
                        >
                          Sim
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="text-gray-600 font-bold"
                        >
                          Não
                        </button>
                      </div>
                    )}
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
              : "Nenhum cliente cadastrado."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientesPage;
