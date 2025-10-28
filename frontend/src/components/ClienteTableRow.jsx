import React, { memo } from "react";

/**
 * Componente de linha de tabela otimizado
 * Usa React.memo para evitar re-renders desnecessários
 *
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.cliente - Dados do cliente
 * @param {Function} props.onEdit - Callback para edição
 * @param {Function} props.onDelete - Callback para exclusão
 * @param {boolean} props.confirmDelete - Se está em modo de confirmação
 * @param {Function} props.onCancelDelete - Callback para cancelar exclusão
 */
const ClienteTableRow = memo(
  ({ cliente, onEdit, onDelete, confirmDelete, onCancelDelete }) => {
    return (
      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {cliente.nome}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">{cliente.email}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">{cliente.telefone}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button
            onClick={() => onEdit(cliente._id)}
            className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
          >
            Editar
          </button>
          {confirmDelete === cliente._id ? (
            <>
              <button
                onClick={() => onDelete(cliente._id)}
                className="text-red-600 hover:text-red-900 mr-2 font-bold transition-colors"
              >
                Confirmar
              </button>
              <button
                onClick={onCancelDelete}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={() => onDelete(cliente._id)}
              className="text-red-600 hover:text-red-900 transition-colors"
            >
              Excluir
            </button>
          )}
        </td>
      </tr>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function
    // Só re-renderiza se houver mudanças relevantes
    return (
      prevProps.cliente._id === nextProps.cliente._id &&
      prevProps.cliente.nome === nextProps.cliente.nome &&
      prevProps.cliente.email === nextProps.cliente.email &&
      prevProps.cliente.telefone === nextProps.cliente.telefone &&
      prevProps.confirmDelete === nextProps.confirmDelete
    );
  }
);

ClienteTableRow.displayName = "ClienteTableRow";

export default ClienteTableRow;
