import React, { createContext, useContext, useState } from "react";
import { Check } from "lucide-react";

// Context para o Stepper
const StepperContext = createContext();

// Hook para usar o contexto do Stepper
const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a Stepper");
  }
  return context;
};

// Componente principal Stepper
export const Stepper = ({ children, defaultValue = 1, className = "" }) => {
  const [currentStep, setCurrentStep] = useState(defaultValue);

  return (
    <StepperContext.Provider value={{ currentStep, setCurrentStep }}>
      <div
        className={`relative flex items-start justify-between w-full ${className}`}
        data-orientation="horizontal"
      >
        {children}
      </div>
    </StepperContext.Provider>
  );
};

// Item do Stepper
export const StepperItem = ({ children, step, className = "" }) => {
  const { currentStep } = useStepper();
  const isActive = step <= currentStep;

  return (
    <div
      className={`relative flex-1 flex flex-col items-center group ${className}`}
      data-active={isActive}
    >
      {children}
    </div>
  );
};

// Trigger do Stepper
export const StepperTrigger = ({ children, className = "" }) => {
  return (
    <div
      className={`flex flex-col items-center gap-4 rounded cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
};

// Indicador do Stepper
export const StepperIndicator = ({ className = "", style = {}, step }) => {
  const initialClass = "stepper-circle-initial";
  const stepClass = step ? `stepper-circle-step-${step}` : "";

  return (
    <div
      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors ${initialClass} ${stepClass} ${className}`}
      style={style}
    >
      <Check size={16} />
    </div>
  );
};

// Título do Stepper
export const StepperTitle = ({
  children,
  className = "",
  style = {},
  step,
}) => {
  const initialClass = "stepper-text-initial";
  const stepClass = step ? `stepper-text-step-${step}` : "";

  return (
    <div
      className={`text-sm font-semibold ${initialClass} ${stepClass} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

// Descrição do Stepper
export const StepperDescription = ({
  children,
  className = "",
  style = {},
  step,
}) => {
  const initialClass = "stepper-text-initial";
  const stepClass = step ? `stepper-text-step-${step}` : "";

  return (
    <div
      className={`text-xs ${initialClass} ${stepClass} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

// Separador do Stepper
export const StepperSeparator = ({ className = "" }) => {
  return (
    <div
      className={`absolute top-5 left-1/2 transform -translate-y-1/2 h-0.5 bg-gray-200 ${className}`}
    ></div>
  );
};
