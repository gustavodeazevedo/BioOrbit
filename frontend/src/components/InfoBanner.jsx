import React from "react";
import {
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  X,
  EyeOff,
} from "lucide-react";

const InfoBanner = ({
  children,
  variant = "info",
  onClose,
  closable = false,
  icon: CustomIcon,
  className = "",
}) => {
  // Mantém os estilos originais exatos do projeto
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return {
          className:
            "bg-green-50 p-3 rounded-md text-sm text-green-700 border border-green-200 animate-fade-in shadow-sm",
          iconColor: "text-green-500",
          defaultIcon: CheckCircle,
        };
      case "warning":
        return {
          className:
            "text-sm text-gray-700 mt-2 p-2 bg-yellow-50 rounded-md border border-yellow-100",
          iconColor: "text-yellow-500",
          defaultIcon: AlertTriangle,
        };
      case "error":
        return {
          className:
            "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md",
          iconColor: "text-red-500",
          defaultIcon: XCircle,
        };
      case "info":
      default:
        return {
          className: "mt-3 p-3 bg-green-50 rounded-md border border-green-200",
          iconColor: "text-blue-500",
          defaultIcon: Info,
        };
    }
  };

  const styles = getVariantStyles();
  const IconComponent = CustomIcon || styles.defaultIcon;

  if (variant === "success" && closable) {
    // Estilo especial para o banner de ajuda sobre cálculos
    return (
      <div className={`${styles.className} ${className}`}>
        <div className="flex items-start">
          <IconComponent
            className={`mr-2 mt-0.5 ${styles.iconColor} flex-shrink-0`}
          />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              {closable && onClose && (
                <button
                  onClick={onClose}
                  className="text-green-500 hover:text-green-700 p-1 ml-auto"
                  title="Fechar"
                >
                  <EyeOff size={14} />
                </button>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.className} ${className}`}>
      {variant !== "warning" && IconComponent && (
        <div className="flex items-start space-x-3">
          <IconComponent
            className={`${styles.iconColor} flex-shrink-0 mt-0.5`}
          />
          <div className="flex-1">{children}</div>
          {closable && onClose && (
            <button
              onClick={onClose}
              className={`${styles.iconColor} hover:opacity-70 flex-shrink-0`}
              title="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
      {variant === "warning" && <div>{children}</div>}
    </div>
  );
};

export default InfoBanner;
