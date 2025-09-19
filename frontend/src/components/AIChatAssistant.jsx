import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Brain,
  Send,
  X,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Minimize2,
  Maximize2,
} from "lucide-react";
import useDataExtraction from "../hooks/useDataExtraction";
import "../styles/AIFloatingButton.css";

const AIChatAssistant = ({
  onDataExtracted,
  showInCurrentPage = true,
  animationSpeed,
  setAnimationSpeed,
  isAnimating,
  stopAnimation,
  progress,
  currentField,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [inputRows, setInputRows] = useState(2); // Estado para controlar altura do textarea
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content:
        "Olá! 👋 Sou seu assistente de IA. Cole os dados do Notion aqui e eu preencherei automaticamente todos os campos do certificado para você.",
      timestamp: new Date(),
    },
  ]);

  const { extractPipetteData, isProcessing, error, setError } =
    useDataExtraction();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const addMessage = (type, content) => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Adicionar mensagem do usuário
    addMessage("user", inputMessage);
    const userInput = inputMessage;
    setInputMessage("");
    setInputRows(2); // Resetar para o estado normal

    // Adicionar mensagem de processamento
    const processingMessage = addMessage(
      "assistant",
      "🤖 Processando seus dados..."
    );

    try {
      // Processar com IA
      const data = await extractPipetteData(userInput);

      // Remover mensagem de processamento
      setMessages((prev) => prev.filter((m) => m.id !== processingMessage.id));

      // Adicionar mensagem de sucesso
      const instrumentType =
        data.tipoEquipamento === "repipetador"
          ? "repipetador"
          : data.tipoInstrumento === "multicanal"
          ? "micropipeta multicanal"
          : "micropipeta monocanal";

      addMessage(
        "assistant",
        `✅ Perfeito! Identifiquei uma **${instrumentType}** da marca **${data.marcaPipeta}**.\n\n` +
          `📋 **Dados extraídos:**\n` +
          `• Marca: ${data.marcaPipeta}\n` +
          `• Modelo: ${data.modeloPipeta}\n` +
          `• Série: ${data.numeroPipeta}\n` +
          `• Pontos de calibração: ${data.pontosCalibra.length}\n` +
          `${data.seringas ? `• Seringas: ${data.seringas.length}\n` : ""}` +
          `\n🚀 Preenchendo formulário automaticamente...`
      );

      // Aplicar dados
      if (onDataExtracted) {
        onDataExtracted(data);
      }

      // Adicionar mensagem final
      setTimeout(() => {
        addMessage(
          "assistant",
          "🎉 Formulário preenchido com sucesso! Você pode revisar os dados e gerar o certificado."
        );

        // Fechar o chat automaticamente após o processamento
        setTimeout(() => {
          setIsOpen(false);
        }, 800); // Reduzido para 800ms para fechamento mais rápido
      }, 1000); // Reduzido para 1 segundo
    } catch (err) {
      // Remover mensagem de processamento
      setMessages((prev) => prev.filter((m) => m.id !== processingMessage.id));

      // Adicionar mensagem de erro
      addMessage(
        "assistant",
        `❌ **Ops! Encontrei um problema:**\n\n${err.message}\n\n` +
          `💡 **Dica:** Verifique se os dados estão no formato correto do Notion.`
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Função para expandir textarea automaticamente
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputMessage(value);

    // Calcular número de linhas baseado no conteúdo
    const lines = value.split("\n").length;
    const calculatedRows = Math.min(Math.max(lines, 2), 8); // Min 2, Max 8 linhas
    setInputRows(calculatedRows);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Não renderizar se não deve aparecer nesta página
  if (!showInCurrentPage) {
    return null;
  }

  // Renderizar usando portal para garantir que fique no nível mais alto do DOM
  return createPortal(
    <>
      {/* Botão flutuante - Sempre visível no viewport */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="ai-floating-button pulse group"
          title="Assistente IA - Preenchimento Automático"
        >
          <Brain className="w-6 h-6 text-white" />

          {/* Tooltip */}
          <div
            className="absolute bottom-full right-0 mb-2 bg-white text-sm font-medium py-2 px-3 rounded-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-lg"
            style={{ color: "rgb(75, 85, 99)" }}
          >
            Assistente IA - Preenchimento Automático
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200"></div>
          </div>
        </button>
      )}

      {/* Chat Container - Fixo no viewport */}
      {isOpen && (
        <div
          className={`ai-chat-container bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 backdrop-blur-sm relative ${
            isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center ai-header-logo"
                  style={{
                    background:
                      "linear-gradient(45deg, rgb(144, 199, 45) 0%, rgb(80, 120, 20) 20%, rgb(200, 255, 80) 40%, rgb(60, 100, 15) 60%, rgb(180, 240, 70) 80%, rgb(144, 199, 45) 100%)",
                    backgroundSize: "400% 400%",
                    animation: "ai-gradient-flow 6s ease infinite",
                  }}
                >
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Assistente IA</h3>
                <p className="text-xs text-gray-500">
                  Online • Pronto para ajudar
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{ height: "450px", paddingBottom: "120px" }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[280px] rounded-2xl px-4 py-3 ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-green-50 to-green-100 text-green-900 border border-green-200"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          message.type === "user"
                            ? "text-green-700"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          IA está pensando...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                <div className="flex items-end space-x-2">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Cole os dados do Notion aqui..."
                      className="w-full px-4 py-3 resize-none focus:outline-none transition-all ai-input-animated"
                      rows={inputRows}
                      style={{
                        fontFamily: "monospace",
                        minHeight: "48px",
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isProcessing}
                      className="flex-shrink-0 w-12 h-12 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex items-center justify-center"
                      style={{
                        backgroundColor: "rgb(144, 199, 45)",
                        minHeight: "48px",
                      }}
                      onMouseEnter={(e) => {
                        if (!e.target.disabled) {
                          e.target.style.backgroundColor = "rgb(130, 180, 40)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.target.disabled) {
                          e.target.style.backgroundColor = "rgb(144, 199, 45)";
                        }
                      }}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Controle de Velocidade de Preenchimento */}
                {animationSpeed !== undefined && setAnimationSpeed && (
                  <div className="mt-3 px-2 py-2 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-gray-700">
                        Velocidade de Preenchimento
                      </label>
                      <span className="text-xs text-gray-500">
                        {animationSpeed === 1
                          ? "Lenta"
                          : animationSpeed === 2
                          ? "Normal"
                          : "Rápida"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Lenta</span>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        value={animationSpeed}
                        onChange={(e) =>
                          setAnimationSpeed(Number(e.target.value))
                        }
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, rgb(144, 199, 45) 0%, rgb(144, 199, 45) ${
                            ((animationSpeed - 1) / 2) * 100
                          }%, #e5e7eb ${
                            ((animationSpeed - 1) / 2) * 100
                          }%, #e5e7eb 100%)`,
                        }}
                      />
                      <span className="text-xs text-gray-500">Rápida</span>
                    </div>
                    {isAnimating && (
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-xs text-gray-600">
                          {currentField && `Preenchendo: ${currentField}`}
                        </div>
                        <button
                          onClick={stopAnimation}
                          className="text-xs text-red-600 hover:text-red-800 font-medium"
                        >
                          Parar
                        </button>
                      </div>
                    )}
                    {progress !== undefined && progress > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 text-center mt-1">
                          {Math.round(progress)}% concluído
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-2 text-xs text-gray-500 text-center">
                  Pressione Enter para enviar • Shift+Enter para nova linha
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
          }
        }

        @keyframes ai-gradient-flow {
          0% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 50% 0%;
          }
          50% {
            background-position: 100% 50%;
          }
          75% {
            background-position: 50% 100%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes border-glow {
          0% {
            background-position: 0% 0%;
          }
          25% {
            background-position: 100% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }

        .ai-header-logo:hover {
          animation: ai-gradient-flow 3.5s ease infinite !important;
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }

        .ai-input-animated {
          border: 2px solid transparent;
          border-radius: 12px;
          background: linear-gradient(white, white) padding-box,
            linear-gradient(
                90deg,
                rgba(144, 199, 45, 0.3) 0%,
                rgba(144, 199, 45, 0.8) 25%,
                rgba(144, 199, 45, 0.3) 50%,
                rgba(144, 199, 45, 0.1) 75%,
                rgba(144, 199, 45, 0.3) 100%
              )
              border-box;
          background-size: 300% 300%;
          animation: border-glow 3s linear infinite;
        }

        .ai-input-animated:focus {
          background: linear-gradient(white, white) padding-box,
            linear-gradient(
                90deg,
                rgba(144, 199, 45, 0.6) 0%,
                rgba(144, 199, 45, 1) 25%,
                rgba(144, 199, 45, 0.6) 50%,
                rgba(144, 199, 45, 0.3) 75%,
                rgba(144, 199, 45, 0.6) 100%
              )
              border-box;
          animation: border-glow 2s linear infinite;
          box-shadow: 0 0 0 3px rgba(144, 199, 45, 0.1);
        }

        /* Estilos para o slider de velocidade */
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: rgb(144, 199, 45);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border: 2px solid white;
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: rgb(144, 199, 45);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border: 2px solid white;
        }

        .slider:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 2px rgba(144, 199, 45, 0.3);
        }
      `}</style>
    </>,
    document.body // Portal renderiza diretamente no body
  );
};

export default AIChatAssistant;
