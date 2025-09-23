import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

/**
 * Componente de Skeleton Loader usando react-loading-skeleton
 * Usado para melhorar UX durante cold start do backend no Render
 */

// Skeleton para linha de tabela
export const TableRowSkeleton = ({ columns = 4 }) => {
  return (
    <tr className="border-b border-gray-200">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <Skeleton height={20} />
        </td>
      ))}
    </tr>
  );
};

// Skeleton para tabela completa
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          {/* Header skeleton */}
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-6 py-3 text-left">
                  <Skeleton height={16} width="80%" />
                </th>
              ))}
            </tr>
          </thead>

          {/* Body skeleton */}
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, index) => (
              <TableRowSkeleton key={index} columns={columns} />
            ))}
          </tbody>
        </table>

        {/* Indicador de cold start */}
        <div className="text-center py-4 text-sm text-gray-500 border-t">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
            <span>Aguardando resposta do servidor...</span>
          </div>
          <p className="text-xs mt-1 text-gray-400">
            Primeira conexão pode levar alguns segundos
          </p>
        </div>
      </div>
    </SkeletonTheme>
  );
};

// Skeleton para cards de cliente
export const ClientCardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="p-6 bg-white rounded-lg shadow border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {/* Nome da empresa */}
            <Skeleton height={24} width="60%" className="mb-2" />
            {/* CNPJ */}
            <Skeleton height={16} width="40%" />
          </div>
          {/* Botões de ação */}
          <div className="flex gap-2 ml-4">
            <Skeleton height={32} width={80} />
            <Skeleton height={32} width={64} />
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="space-y-2">
          <Skeleton height={16} width="80%" />
          <Skeleton height={16} width="70%" />
          <Skeleton height={16} width="50%" />
        </div>
      </div>
    </SkeletonTheme>
  );
};

// Skeleton para lista de clientes em cards
export const ClientListSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <ClientCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Skeleton genérico para conteúdo
export const ContentSkeleton = ({ lines = 3 }) => {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            height={16}
            width={index === lines - 1 ? "75%" : "100%"}
          />
        ))}
      </div>
    </SkeletonTheme>
  );
};

// Skeleton para botões
export const ButtonSkeleton = ({ width = 96, height = 40 }) => {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <Skeleton height={height} width={width} borderRadius={8} />
    </SkeletonTheme>
  );
};

// Skeleton para input/formulário
export const InputSkeleton = ({ label = true }) => {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="space-y-2">
        {label && <Skeleton height={16} width="20%" />}
        <Skeleton height={40} width="100%" borderRadius={8} />
      </div>
    </SkeletonTheme>
  );
};

// Skeleton para campo de busca
export const SearchSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="relative w-64">
        <Skeleton height={40} width="100%" borderRadius={8} />
      </div>
    </SkeletonTheme>
  );
};

export default {
  TableRowSkeleton,
  TableSkeleton,
  ClientCardSkeleton,
  ClientListSkeleton,
  ContentSkeleton,
  ButtonSkeleton,
  InputSkeleton,
  SearchSkeleton,
};
