import React from "react";
import { AlertTriangle, Check, X } from "lucide-react";

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning",
}) => {
  if (!isOpen) return null;

  const iconColors = {
    warning: "text-yellow-400",
    danger: "text-red-500",
    info: "text-blue-500",
  };

  const buttonColors = {
    warning: "bg-yellow-500 hover:bg-yellow-600",
    danger: "bg-red-500 hover:bg-red-600",
    info: "bg-blue-500 hover:bg-blue-600",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center p-4 border-b border-gray-200">
          <div
            className={`rounded-full p-2 mr-3 ${
              type === "danger"
                ? "bg-red-100"
                : type === "info"
                ? "bg-blue-100"
                : "bg-yellow-100"
            }`}
          >
            {" "}
            {type === "danger" ? (
              <AlertTriangle className={iconColors[type]} size={18} />
            ) : type === "info" ? (
              <Check className={iconColors[type]} size={18} />
            ) : (
              <AlertTriangle className={iconColors[type]} size={18} />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>

        <div className="p-4">
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="flex justify-end p-4 space-x-3 bg-gray-50">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
          >
            <X className="inline mr-1 -mt-1" /> {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColors[type]}`}
          >
            <Check className="inline mr-1 -mt-1" /> {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
