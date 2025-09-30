import React, { useCallback, useMemo } from "react";

// CONSTANTES DE CONFIGURAÇÃO - BioOrbit Design System

//  Cores principais do sistema BioOrbit para calibração de micropipetas
const BIOORBIT_COLORS = {
  PRIMARY_GREEN: "rgb(144, 199, 45)",
  PRIMARY_GREEN_HOVER: "rgb(130, 180, 40)",
  SUCCESS_GREEN: "rgb(34, 197, 94)",
  SUCCESS_BACKGROUND: "rgb(240, 253, 244)",
  SUCCESS_HOVER: "rgb(220, 252, 231)",
  GRAY_TEXT: "rgb(75, 85, 99)",
  GRAY_BORDER: "rgb(209, 213, 219)",
  GRAY_BACKGROUND: "rgb(243, 244, 246)",
  GRAY_HOVER: "rgb(229, 231, 235)",
  WHITE: "white",
  WHITE_HOVER: "rgb(249, 250, 251)",
};

//  Configurações de variantes específicas para ações do sistema de calibração
const BUTTON_VARIANTS = {
  // Ação principal - usar para confirmar calibrações
  SECONDARY: "secondary",
  // Estado de sucesso - certificados aprovados
  SUCCESS: "success",
  // Ações secundárias - navegação e ajuda
  OUTLINE_GREEN: "outline-green",
  OUTLINE: "outline",
  OUTLINE_SMALL: "outline-small",
  // Estados de automação para calibração automática
  AUTOMATION_ACTIVE: "automation-active",
  AUTOMATION_INACTIVE: "automation-inactive",
};


//  Estilos base para diferentes tipos de botões do sistema

const VARIANT_STYLES = {
  [BUTTON_VARIANTS.SECONDARY]: {
    className:
      "text-white px-6 py-2 rounded-md flex items-center justify-center focus:outline-none focus:ring-2 transition-colors font-medium",
    style: {
      backgroundColor: BIOORBIT_COLORS.PRIMARY_GREEN,
      "--tw-ring-color": BIOORBIT_COLORS.PRIMARY_GREEN,
    },
    hoverColor: BIOORBIT_COLORS.PRIMARY_GREEN_HOVER,
    defaultColor: BIOORBIT_COLORS.PRIMARY_GREEN,
  },
  [BUTTON_VARIANTS.SUCCESS]: {
    className:
      "flex items-center text-sm px-3 py-1.5 rounded-md border border-green-300",
    style: {
      backgroundColor: BIOORBIT_COLORS.SUCCESS_BACKGROUND,
      color: BIOORBIT_COLORS.SUCCESS_GREEN,
    },
    hoverColor: BIOORBIT_COLORS.SUCCESS_HOVER,
    defaultColor: BIOORBIT_COLORS.SUCCESS_BACKGROUND,
  },
  [BUTTON_VARIANTS.OUTLINE_GREEN]: {
    className:
      "flex items-center text-sm px-3 py-1.5 rounded-md border transition-colors duration-200 bg-green-50 hover:bg-green-100 text-green-700 border-green-200",
    style: {},
    hoverColor: BIOORBIT_COLORS.SUCCESS_BACKGROUND,
    defaultColor: BIOORBIT_COLORS.WHITE_HOVER,
  },
  [BUTTON_VARIANTS.AUTOMATION_ACTIVE]: {
    className:
      "relative flex items-center text-sm px-3 py-1.5 rounded-md border transition-all duration-300 bg-green-100 text-green-800 border-green-300 hover:bg-green-200 automation-active",
    style: {},
    hoverColor: BIOORBIT_COLORS.SUCCESS_HOVER,
    defaultColor: BIOORBIT_COLORS.SUCCESS_BACKGROUND,
  },
  [BUTTON_VARIANTS.AUTOMATION_INACTIVE]: {
    className:
      "relative flex items-center text-sm px-3 py-1.5 rounded-md border transition-all duration-300 bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 automation-inactive",
    style: {},
    hoverColor: BIOORBIT_COLORS.GRAY_HOVER,
    defaultColor: BIOORBIT_COLORS.GRAY_BACKGROUND,
  },
  [BUTTON_VARIANTS.OUTLINE]: {
    className:
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-white hover:bg-gray-50 px-6 py-2",
    style: {
      borderColor: BIOORBIT_COLORS.GRAY_BORDER,
      color: BIOORBIT_COLORS.GRAY_TEXT,
      "--tw-ring-color": BIOORBIT_COLORS.PRIMARY_GREEN,
    },
    hoverColor: BIOORBIT_COLORS.WHITE_HOVER,
    defaultColor: BIOORBIT_COLORS.WHITE,
  },
  [BUTTON_VARIANTS.OUTLINE_SMALL]: {
    className:
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border hover:bg-accent hover:text-accent-foreground px-3 py-1.5",
    style: {
      borderColor: BIOORBIT_COLORS.PRIMARY_GREEN,
      color: BIOORBIT_COLORS.WHITE,
      backgroundColor: BIOORBIT_COLORS.PRIMARY_GREEN,
      "--tw-ring-color": BIOORBIT_COLORS.PRIMARY_GREEN,
    },
    hoverColor: BIOORBIT_COLORS.PRIMARY_GREEN_HOVER,
    defaultColor: BIOORBIT_COLORS.PRIMARY_GREEN,
  },
};

// Estilo padrão para casos não especificados
const DEFAULT_VARIANT_STYLE = {
  className: "text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2",
  style: {
    backgroundColor: BIOORBIT_COLORS.PRIMARY_GREEN,
    "--tw-ring-color": BIOORBIT_COLORS.PRIMARY_GREEN,
  },
  hoverColor: BIOORBIT_COLORS.PRIMARY_GREEN_HOVER,
  defaultColor: BIOORBIT_COLORS.PRIMARY_GREEN,
};

// COMPONENTE PRINCIPAL

/**
 * Botão de ação reutilizável para o sistema BioOrbit
 * Otimizado para operações de calibração de micropipetas e navegação
 *
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteúdo do botão
 * @param {Function} props.onClick - Handler de clique
 * @param {string} props.variant - Variante visual do botão
 * @param {React.ComponentType} props.icon - Ícone opcional (componente Lucide)
 * @param {boolean} props.disabled - Se o botão está desabilitado
 * @param {string} props.type - Tipo do botão HTML
 * @param {string} props.className - Classes CSS adicionais
 * @param {string} props.title - Tooltip do botão
 * @param {Object} props.style - Estilos inline adicionais
 */

const ActionButton = ({
  children,
  onClick,
  variant = BUTTON_VARIANTS.SECONDARY,
  icon: Icon,
  disabled = false,
  type = "button",
  className = "",
  title,
  style = {},
}) => {

  // HOOKS E CONFIGURAÇÕES

  // Obtém a configuração de estilo para a variante especificada
  // Memoizado para otimizar performance em re-renders
  const buttonConfiguration = useMemo(() => {
    return VARIANT_STYLES[variant] || DEFAULT_VARIANT_STYLE;
  }, [variant]);

  // Determina a classe CSS do ícone baseada na variante e presença de children
  // Aplicação específica para o sistema de calibração
  const iconSpacingClass = useMemo(() => {
    if (!children) return "";

    // Variantes que não precisam de margem no ícone
    const noMarginVariants = [
      BUTTON_VARIANTS.OUTLINE_SMALL,
      BUTTON_VARIANTS.OUTLINE,
    ];
    return noMarginVariants.includes(variant) ? "" : "mr-2";
  }, [children, variant]);

  // HANDLERS DE EVENTOS

  // Handler otimizado para hover do mouse
  // Aplica cor de hover específica da variante
  const handleMouseEnterButton = useCallback(
    (event) => {
      if (!disabled && buttonConfiguration.hoverColor) {
        event.target.style.backgroundColor = buttonConfiguration.hoverColor;
      }
    },
    [disabled, buttonConfiguration.hoverColor]
  );

  // Handler otimizado para saída do mouse
  // Restaura cor padrão da variante
  const handleMouseLeaveButton = useCallback(
    (event) => {
      if (!disabled && buttonConfiguration.defaultColor) {
        event.target.style.backgroundColor = buttonConfiguration.defaultColor;
      }
    },
    [disabled, buttonConfiguration.defaultColor]
  );

  // ESTILOS COMPUTADOS

  // Estilos finais do botão com aplicação de estado disabled
  const finalButtonStyles = useMemo(
    () => ({
      ...buttonConfiguration.style,
      ...style,
      ...(disabled && {
        opacity: 0.5,
        cursor: "not-allowed",
      }),
    }),
    [buttonConfiguration.style, style, disabled]
  );

  // Classes CSS finais combinadas
  const finalButtonClasses = useMemo(
    () => `${buttonConfiguration.className} ${className}`,
    [buttonConfiguration.className, className]
  );

  // RENDER

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={finalButtonClasses}
      style={finalButtonStyles}
      onMouseEnter={handleMouseEnterButton}
      onMouseLeave={handleMouseLeaveButton}
    >
      {Icon && <Icon className={iconSpacingClass} />}
      {children}
    </button>
  );
};

export default ActionButton;
