import React from "react";
import { Play, Pause, Settings, Zap, Timer, Turtle } from "lucide-react";
import "../styles/AIAnimatedInputs.css";

const AIAnimationControls = ({
  isAnimating,
  animationSpeed,
  setAnimationSpeed,
  stopAnimation,
  progress = 0,
  currentField = null,
}) => {
  const speedOptions = [
    {
      key: "slow",
      label: "Lento",
      icon: Turtle,
      description: "Digitação mais lenta e visível",
    },
    {
      key: "medium",
      label: "Médio",
      icon: Timer,
      description: "Velocidade equilibrada",
    },
    {
      key: "fast",
      label: "Rápido",
      icon: Zap,
      description: "Preenchimento mais ágil",
    },
  ];

  return (
    <div className="ai-animation-controls">
      {/* Indicador de status */}
      {isAnimating && (
        <div className="ai-working-overlay">
          <div className="ai-working-indicator">
            <div className="ai-working-spinner"></div>
            <div>
              <div>IA preenchendo formulário...</div>
              {currentField && (
                <div
                  style={{ fontSize: "12px", opacity: 0.7, marginTop: "4px" }}
                >
                  Campo atual: {currentField}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Controles de velocidade */}
      <div className="ai-speed-controls">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flex: 1,
          }}
        >
          <Settings size={16} style={{ color: "rgb(144, 199, 45)" }} />
          <span
            style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}
          >
            Velocidade de Preenchimento:
          </span>

          <div style={{ display: "flex", gap: "6px" }}>
            {speedOptions.map(({ key, label, icon: Icon, description }) => (
              <button
                key={key}
                className={`ai-speed-button ${
                  animationSpeed === key ? "active" : ""
                }`}
                onClick={() => setAnimationSpeed(key)}
                disabled={isAnimating}
                title={description}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  opacity: isAnimating ? 0.6 : 1,
                  cursor: isAnimating ? "not-allowed" : "pointer",
                }}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Botão de parar */}
        {isAnimating && (
          <button
            className="ai-stop-button"
            onClick={stopAnimation}
            title="Parar animação e preencher instantaneamente"
          >
            <Pause size={14} style={{ marginRight: "6px" }} />
            Parar Animação
          </button>
        )}
      </div>

      {/* Barra de progresso */}
      {isAnimating && (
        <div className="ai-progress-bar">
          <div className="ai-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
};

export default AIAnimationControls;
