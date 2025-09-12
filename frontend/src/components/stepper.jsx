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

// Utilitário para gerar classes CSS baseadas no step
const createStepClasses = (step, basePrefix = "stepper") => {
  const baseClass = `${basePrefix}-initial`;
  const stepClass = step ? `${basePrefix}-step-${step}` : "";
  return { baseClass, stepClass };
};

// Utilitário para combinar classes CSS
const combineClasses = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// Componente principal Stepper
export const Stepper = ({ children, initialStep = 1, className = "" }) => {
  const [currentStep] = useState(initialStep);

  const contextValue = {
    currentStep,
  };

  return (
    <StepperContext.Provider value={contextValue}>
      <div
        className={combineClasses(
          "relative flex items-start justify-between w-full",
          className
        )}
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
  const isCompleted = step < currentStep;

  return (
    <div
      className={combineClasses(
        "relative flex-1 flex flex-col items-center group",
        isActive && "step-active",
        isCompleted && "step-completed",
        className
      )}
      data-step={step}
      data-active={isActive}
      data-completed={isCompleted}
    >
      {children}
    </div>
  );
};

// Trigger do Stepper
export const StepperTrigger = ({ children, className = "" }) => {
  return (
    <div
      className={combineClasses(
        "flex flex-col items-center gap-4 rounded cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};

// Componente base para elementos com styling condicional
const StepperStyledElement = ({
  children,
  step,
  className = "",
  style = {},
  element: Element = "div",
  stylePrefix = "stepper-text",
}) => {
  const { baseClass, stepClass } = createStepClasses(step, stylePrefix);

  return (
    <Element
      className={combineClasses(baseClass, stepClass, className)}
      style={style}
    >
      {children}
    </Element>
  );
};

// Indicador do Stepper
export const StepperIndicator = ({ className = "", style = {}, step }) => {
  const { baseClass, stepClass } = createStepClasses(step, "stepper-circle");

  return (
    <div
      className={combineClasses(
        "w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors",
        baseClass,
        stepClass,
        className
      )}
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
  return (
    <StepperStyledElement
      step={step}
      className={combineClasses("text-sm font-semibold", className)}
      style={style}
      stylePrefix="stepper-text"
    >
      {children}
    </StepperStyledElement>
  );
};

// Descrição do Stepper
export const StepperDescription = ({
  children,
  className = "",
  style = {},
  step,
}) => {
  return (
    <StepperStyledElement
      step={step}
      className={combineClasses("text-xs", className)}
      style={style}
      stylePrefix="stepper-text"
    >
      {children}
    </StepperStyledElement>
  );
};
