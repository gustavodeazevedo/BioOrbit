import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaFilePdf,
  FaDownload,
  FaThermometerHalf,
  FaTint,
  FaVial,
  FaChartLine,
  FaPlus,
  FaMinus,
  FaCalculator,
  FaTable,
  FaEye,
  FaEyeSlash,
  FaFileExport,
} from "react-icons/fa";
import { getClienteById } from "../services/clienteService";

const EmitirCertificadoPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    numeroCertificado: `CERT-${new Date().getFullYear()}-${String(
      Math.floor(Math.random() * 10000)
    ).padStart(4, "0")}`,
    dataCalibracao: new Date().toISOString().split("T")[0],
    dataValidade: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .split("T")[0],
    marcaPipeta: "",
    modeloPipeta: "",
    numeroPipeta: "",
    capacidade: "",
    unidadeCapacidade: "µL",
    temperatura: "20.0",
    umidadeRelativa: "50",
    observacoes: "",
  });
  const [certificadoGerado, setCertificadoGerado] = useState(false);
  // Fator Z calculado com base na temperatura
  const [fatorZ, setFatorZ] = useState(1.0029); // Valor padrão para 20°C

  // Estado para os pontos de calibração
  const [pontosCalibra, setPontosCalibra] = useState([
    {
      id: 1,
      volumeNominal: "",
      unidade: "µL",
      medicoes: Array(10).fill(""),
      media: null,
      inexatidao: null,
      inexatidaoPercentual: null,
      incerteza: null,
      incertezaPercentual: null,
    },
  ]);

  // Estado para exibir/esconder a seção de cálculos
  const [mostrarCalculos, setMostrarCalculos] = useState(false);

  // Tabela de referência mais precisa para o fator Z baseado na temperatura com incrementos de 0.5°C
  const tabelaFatorZ = {
    "15.0": 1.0017,
    15.5: 1.0018,
    "16.0": 1.0019,
    16.5: 1.002,
    "17.0": 1.0021,
    17.5: 1.0022,
    "18.0": 1.0023,
    18.5: 1.0024,
    "19.0": 1.0026,
    19.5: 1.0027,
    "20.0": 1.0029,
    20.5: 1.0031,
    "21.0": 1.0032,
    21.5: 1.0034,
    "22.0": 1.0036,
    22.5: 1.0037,
    "23.0": 1.0039,
    23.5: 1.004,
    "24.0": 1.0042,
    24.5: 1.0043,
    "25.0": 1.0045,
    25.5: 1.0047,
    "26.0": 1.0048,
    26.5: 1.005,
    "27.0": 1.0051,
    27.5: 1.0053,
    "28.0": 1.0055,
    28.5: 1.0056,
    "29.0": 1.0058,
    29.5: 1.006,
    "30.0": 1.0061,
  };

  // Calcula o fator Z com base na temperatura
  useEffect(() => {
    const calcularFatorZ = (temperatura) => {
      const tempFormatada = parseFloat(temperatura).toFixed(1);
      return tabelaFatorZ[tempFormatada] || tabelaFatorZ["20.0"]; // Retorna o valor padrão se não encontrar
    };

    setFatorZ(calcularFatorZ(formData.temperatura));
  }, [formData.temperatura]);

  // Ajusta a temperatura para incrementos de 0.5°C
  const ajustarTemperatura = (valor) => {
    const temp = parseFloat(valor);
    if (isNaN(temp)) return "20.0";

    // Arredonda para o incremento de 0.5 mais próximo
    const tempArredondada = Math.round(temp * 2) / 2;

    // Limita entre 15.0 e 30.0
    const tempLimitada = Math.max(15.0, Math.min(30.0, tempArredondada));

    return tempLimitada.toFixed(1);
  };

  // Buscar dados do cliente se não foram passados pelo location state
  useEffect(() => {
    const fetchClienteData = async () => {
      if (location.state?.clienteNome) {
        setCliente({
          nome: location.state.clienteNome,
          endereco: location.state.clienteEndereco,
        });
        setLoading(false);
      } else {
        try {
          const data = await getClienteById(id);
          setCliente(data);
          setError(null);
        } catch (err) {
          setError(
            "Erro ao carregar dados do cliente. Por favor, tente novamente."
          );
          console.error("Erro ao carregar cliente:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchClienteData();
  }, [id, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "temperatura") {
      // Para temperatura, ajusta para incrementos de 0.5
      const temperaturaAjustada = ajustarTemperatura(value);
      setFormData({
        ...formData,
        [name]: temperaturaAjustada,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Manipula mudanças diretas nos controles de temperatura (botões + e -)
  const alterarTemperatura = (incremento) => {
    const temperaturaAtual = parseFloat(formData.temperatura);
    const novaTemperatura = (temperaturaAtual + incremento).toFixed(1);

    // Verifica se a temperatura está dentro dos limites permitidos
    if (novaTemperatura >= 15.0 && novaTemperatura <= 30.0) {
      setFormData({
        ...formData,
        temperatura: novaTemperatura,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aqui seria implementada a lógica para gerar o PDF do certificado
    // usando os dados do cliente e os dados do formulário

    setCertificadoGerado(true);

    // Simula a geração do certificado bem-sucedida
    console.log("Certificado gerado para o cliente:", cliente?.nome);
    console.log("Dados do certificado:", formData);
  };

  // Função que seria chamada para fazer o download do certificado
  const handleDownloadCertificado = () => {
    // Implementação real faria o download do PDF gerado
    alert(
      "Funcionalidade de download do certificado será implementada em uma próxima etapa"
    );
  };

  const renderEnderecoCompleto = () => {
    if (!cliente?.endereco) return "Endereço não disponível";

    const { rua, numero, complemento, bairro, cidade, estado, cep } =
      cliente.endereco;

    return `${rua}, ${numero}${
      complemento ? `, ${complemento}` : ""
    } - ${bairro} - ${cidade}/${estado} - CEP: ${cep}`;
  };

  // Função para adicionar um novo ponto de calibração
  const adicionarPontoCalibracao = () => {
    const novoPonto = {
      id: Date.now(),
      volumeNominal: "",
      unidade: "µL",
      medicoes: Array(10).fill(""),
      media: null,
      inexatidao: null,
      inexatidaoPercentual: null,
      incerteza: null,
      incertezaPercentual: null,
    };

    setPontosCalibra([...pontosCalibra, novoPonto]);
  };

  // Função para remover um ponto de calibração
  const removerPontoCalibracao = (id) => {
    if (pontosCalibra.length <= 1) {
      alert("É necessário manter pelo menos um ponto de calibração.");
      return;
    }
    setPontosCalibra(pontosCalibra.filter((ponto) => ponto.id !== id));
  };

  // Função para atualizar um ponto de calibração
  const atualizarPontoCalibracao = (id, campo, valor) => {
    setPontosCalibra(
      pontosCalibra.map((ponto) => {
        if (ponto.id === id) {
          return { ...ponto, [campo]: valor };
        }
        return ponto;
      })
    );
  };

  // Função para atualizar uma medição específica de um ponto
  const atualizarMedicao = (pontoId, medicaoIndex, valor) => {
    setPontosCalibra(
      pontosCalibra.map((ponto) => {
        if (ponto.id === pontoId) {
          const novasMedicoes = [...ponto.medicoes];
          // Permite apenas números, ponto e vírgula
          const valorLimpo = valor.replace(/[^0-9.,]/g, "").replace(",", ".");
          novasMedicoes[medicaoIndex] = valorLimpo;
          return { ...ponto, medicoes: novasMedicoes };
        }
        return ponto;
      })
    );
  };

  // Função para realizar os cálculos de calibração para todos os pontos
  const calcularResultados = () => {
    setPontosCalibra(
      pontosCalibra.map((ponto) => {
        // Filtra as medições válidas (não vazias e convertidas para número)
        const medicoesValidas = ponto.medicoes
          .map((m) => parseFloat(m.trim()))
          .filter((m) => !isNaN(m));

        // Verifica se há medições válidas para calcular
        if (medicoesValidas.length === 0) {
          return {
            ...ponto,
            media: null,
            inexatidao: null,
            inexatidaoPercentual: null,
            incerteza: null,
            incertezaPercentual: null,
          };
        }

        // Converte o volume nominal para número
        const volumeNominalNum = parseFloat(ponto.volumeNominal);
        if (isNaN(volumeNominalNum)) return ponto;

        // 1. Cálculo da média das medições (massa)
        const mediaMassa =
          medicoesValidas.reduce((sum, val) => sum + val, 0) /
          medicoesValidas.length;

        // Aplicação do fator Z para converter massa em volume
        const mediaVolume = mediaMassa / fatorZ;

        // 2. Cálculo da inexatidão (desvio da indicação)
        const inexatidao = mediaVolume - volumeNominalNum;
        const inexatidaoPercentual = (inexatidao / volumeNominalNum) * 100;

        // 3. Cálculo do desvio padrão
        const somaDosQuadradosDasDiferencas = medicoesValidas.reduce(
          (sum, val) => {
            const volumeEquivalente = val / fatorZ;
            return sum + Math.pow(volumeEquivalente - mediaVolume, 2);
          },
          0
        );

        const desvioPadrao = Math.sqrt(
          somaDosQuadradosDasDiferencas / (medicoesValidas.length - 1)
        );

        // 4. Cálculo da incerteza da medição (k=2 para 95% de confiança)
        const incerteza = 2 * desvioPadrao;
        const incertezaPercentual = (incerteza / volumeNominalNum) * 100;

        return {
          ...ponto,
          media: mediaVolume,
          mediaMassa,
          inexatidao: inexatidao,
          inexatidaoPercentual: inexatidaoPercentual,
          incerteza: incerteza,
          incertezaPercentual: incertezaPercentual,
          desvioPadrao,
        };
      })
    );
  };

  // Recalcular automaticamente quando as medições ou o fator Z mudam
  useEffect(() => {
    calcularResultados();
  }, [pontosCalibra.map((p) => p.medicoes.join()).join(), fatorZ]);

  // Função para calcular a média das medições
  const calcularMedia = (medicoes) => {
    const valoresNumericos = medicoes
      .filter((med) => med !== "")
      .map((med) => parseFloat(med));

    if (valoresNumericos.length === 0) return null;

    const soma = valoresNumericos.reduce((acc, val) => acc + val, 0);
    return soma / valoresNumericos.length;
  };

  // Função para calcular o desvio padrão
  const calcularDesvioPadrao = (medicoes, media) => {
    if (media === null) return null;

    const valoresNumericos = medicoes
      .filter((med) => med !== "")
      .map((med) => parseFloat(med));

    if (valoresNumericos.length <= 1) return 0;

    const somaDosQuadradosDasDiferencas = valoresNumericos.reduce(
      (acc, val) => acc + Math.pow(val - media, 2),
      0
    );

    return Math.sqrt(
      somaDosQuadradosDasDiferencas / (valoresNumericos.length - 1)
    );
  };

  // Função para adicionar novo ponto de calibração
  const adicionarPonto = () => {
    setPontosCalibra([
      ...pontosCalibra,
      {
        id: Date.now(),
        volumeNominal: "",
        unidade: "µL",
        medicoes: Array(10).fill(""),
        media: null,
        inexatidao: null,
        inexatidaoPercentual: null,
        incerteza: null,
        incertezaPercentual: null,
      },
    ]);
  };

  // Função para remover um ponto de calibração
  const removerPonto = (id) => {
    if (pontosCalibra.length <= 1) return;
    setPontosCalibra(pontosCalibra.filter((ponto) => ponto.id !== id));
  };

  // Função para atualizar as medições de um ponto específico
  const handleMedicaoChange = (pontoId, indice, valor) => {
    setPontosCalibra(
      pontosCalibra.map((ponto) => {
        if (ponto.id === pontoId) {
          const novasMedicoes = [...ponto.medicoes];
          novasMedicoes[indice] = valor;

          // Calcular a média
          const media = calcularMedia(novasMedicoes);

          // Calcular inexatidão (se o volume nominal estiver definido)
          let inexatidao = null;
          let inexatidaoPercentual = null;
          if (media !== null && ponto.volumeNominal !== "") {
            const volumeNominal = parseFloat(ponto.volumeNominal);
            inexatidao = media - volumeNominal;
            inexatidaoPercentual = (inexatidao / volumeNominal) * 100;
          }

          // Calcular a incerteza (k=2 para nível de confiança de 95%)
          const desvioPadrao = calcularDesvioPadrao(novasMedicoes, media);
          let incerteza = null;
          let incertezaPercentual = null;
          if (desvioPadrao !== null && ponto.volumeNominal !== "") {
            incerteza = 2 * desvioPadrao; // k=2 para 95% de confiança
            const volumeNominal = parseFloat(ponto.volumeNominal);
            incertezaPercentual = (incerteza / volumeNominal) * 100;
          }

          return {
            ...ponto,
            medicoes: novasMedicoes,
            media,
            inexatidao,
            inexatidaoPercentual,
            incerteza,
            incertezaPercentual,
          };
        }
        return ponto;
      })
    );
  };

  // Função para atualizar o volume nominal de um ponto
  const handleVolumeNominalChange = (pontoId, valor) => {
    setPontosCalibra(
      pontosCalibra.map((ponto) => {
        if (ponto.id === pontoId) {
          // Recalcular dados com o novo volume nominal
          const media = calcularMedia(ponto.medicoes);

          // Calcular inexatidão
          let inexatidao = null;
          let inexatidaoPercentual = null;
          if (media !== null && valor !== "") {
            const volumeNominal = parseFloat(valor);
            inexatidao = media - volumeNominal;
            inexatidaoPercentual = (inexatidao / volumeNominal) * 100;
          }

          // Calcular a incerteza
          const desvioPadrao = calcularDesvioPadrao(ponto.medicoes, media);
          let incerteza = null;
          let incertezaPercentual = null;
          if (desvioPadrao !== null && valor !== "") {
            incerteza = 2 * desvioPadrao; // k=2 para 95% de confiança
            const volumeNominal = parseFloat(valor);
            incertezaPercentual = (incerteza / volumeNominal) * 100;
          }

          return {
            ...ponto,
            volumeNominal: valor,
            media,
            inexatidao,
            inexatidaoPercentual,
            incerteza,
            incertezaPercentual,
          };
        }
        return ponto;
      })
    );
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Carregando dados do cliente...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
        <button
          className="text-green-700 hover:text-green-900 flex items-center"
          onClick={() => navigate("/selecionar-cliente")}
        >
          <FaArrowLeft className="mr-2" /> Voltar para Seleção de Clientes
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <button
          className="text-green-700 hover:text-green-900 flex items-center"
          onClick={() => navigate("/selecionar-cliente")}
        >
          <FaArrowLeft className="mr-2" /> Voltar
        </button>
        <h1 className="text-2xl font-bold text-center text-green-800">
          Emissão de Certificado
        </h1>
        <div>{/* Espaço para equilibrar o layout */}</div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Dados do Cliente
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <div>
            <span className="font-medium">Empresa:</span>{" "}
            {cliente?.nome || "N/A"}
          </div>
          <div>
            <span className="font-medium">Endereço:</span>{" "}
            {renderEnderecoCompleto()}
          </div>
        </div>
      </div>

      {certificadoGerado ? (
        <div className="text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6">
            Certificado gerado com sucesso!
          </div>

          <div className="mb-6 p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <FaFilePdf className="text-6xl text-red-600 mx-auto mb-4" />
            <p className="text-xl font-semibold mb-2">
              Certificado de Calibração
            </p>
            <p className="mb-2">Número: {formData.numeroCertificado}</p>
            <p className="mb-2">Cliente: {cliente?.nome}</p>
            <p className="mb-2">
              Micropipeta: {formData.marcaPipeta} {formData.modeloPipeta}
            </p>
            <p className="mb-2">Número de Série: {formData.numeroPipeta}</p>
            <p className="mb-2">Temperatura: {formData.temperatura} °C</p>
            <p className="mb-2">
              Umidade Relativa: {formData.umidadeRelativa}%
            </p>
            <p className="mb-2">Fator Z: {fatorZ.toFixed(4)}</p>
            <p className="mb-4">Emissão: {new Date().toLocaleDateString()}</p>

            <button
              onClick={handleDownloadCertificado}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center mx-auto"
            >
              <FaDownload className="mr-2" /> Baixar Certificado
            </button>
          </div>

          <button
            onClick={() => setCertificadoGerado(false)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg mr-2"
          >
            Editar Dados
          </button>

          <button
            onClick={() => navigate("/selecionar-cliente")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg ml-2"
          >
            Novo Certificado
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Dados do Certificado
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número do Certificado
                </label>
                <input
                  type="text"
                  name="numeroCertificado"
                  value={formData.numeroCertificado}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Calibração
                </label>
                <input
                  type="date"
                  name="dataCalibracao"
                  value={formData.dataCalibracao}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Validade
                </label>
                <input
                  type="date"
                  name="dataValidade"
                  value={formData.dataValidade}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Condições Ambientais
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaThermometerHalf className="mr-2 text-red-500" />
                  Temperatura (°C)
                </label>
                <div className="relative flex items-center">
                  <button
                    type="button"
                    onClick={() => alterarTemperatura(-0.5)}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-l-md border border-gray-300"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="temperatura"
                    value={formData.temperatura}
                    onChange={handleChange}
                    onBlur={(e) => {
                      const ajustado = ajustarTemperatura(e.target.value);
                      setFormData({ ...formData, temperatura: ajustado });
                    }}
                    className="w-full px-3 py-2 border-y border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-center"
                    step="0.5"
                    min="15.0"
                    max="30.0"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => alterarTemperatura(0.5)}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-md border border-gray-300"
                  >
                    +
                  </button>
                </div>
                <div className="text-sm text-gray-700 mt-2 p-2 bg-yellow-50 rounded-md border border-yellow-100">
                  <div className="font-medium mb-1">
                    Fator Z atual:{" "}
                    <span className="text-green-600">{fatorZ.toFixed(4)}</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Este fator será usado nos cálculos de calibração. Valor
                    recomendado: 20.0°C (Z=1.0029)
                  </p>
                </div>
                <div className="mt-2 grid grid-cols-5 gap-1 text-center text-xs">
                  {[15, 17.5, 20, 22.5, 25].map((temp) => (
                    <button
                      key={temp}
                      type="button"
                      className={`p-1 rounded ${
                        formData.temperatura === temp.toFixed(1)
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          temperatura: temp.toFixed(1),
                        })
                      }
                    >
                      {temp}°C
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaTint className="mr-2 text-blue-500" />
                  Umidade Relativa (%)
                </label>
                <input
                  type="number"
                  name="umidadeRelativa"
                  value={formData.umidadeRelativa}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="30"
                  max="90"
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 p-2 rounded-md mt-3 text-sm text-blue-700">
              <p>
                <strong>Nota:</strong> A temperatura deve ser selecionada em
                incrementos de 0.5°C (ex: 20.0, 20.5, 21.0). O fator Z é
                atualizado automaticamente de acordo com a temperatura
                selecionada.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Dados da Micropipeta
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca da Pipeta
                </label>
                <input
                  type="text"
                  name="marcaPipeta"
                  value={formData.marcaPipeta}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  placeholder="Ex: Eppendorf, Gilson, HTL, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modelo da Pipeta
                </label>
                <input
                  type="text"
                  name="modeloPipeta"
                  value={formData.modeloPipeta}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  placeholder="Ex: P1000, Research Plus, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número/Série da Pipeta
                </label>
                <input
                  type="text"
                  name="numeroPipeta"
                  value={formData.numeroPipeta}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  placeholder="Ex: AJ12345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidade
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="capacidade"
                    value={formData.capacidade}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    placeholder="Ex: 1000"
                  />
                  <select
                    name="unidadeCapacidade"
                    value={formData.unidadeCapacidade}
                    onChange={handleChange}
                    className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="µL">µL</option>
                    <option value="mL">mL</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                <FaChartLine className="mr-2 text-green-600" />
                Pontos de Calibração
              </h3>

              <div>
                <button
                  type="button"
                  className="flex items-center text-sm bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-md border border-green-300"
                  onClick={adicionarPonto}
                >
                  <FaPlus className="mr-2" /> Adicionar Ponto
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-2 rounded-md mb-4 text-sm text-blue-700 flex items-start">
              <FaCalculator className="mr-2 mt-0.5 text-blue-500" />
              <div>
                <p>
                  <strong>Nota sobre os cálculos:</strong>
                </p>
                <p>
                  Os valores devem ser inseridos em <strong>massa (mg)</strong>{" "}
                  e serão convertidos para <strong>volume (µL)</strong> usando o
                  fator Z = {fatorZ.toFixed(4)}.
                </p>
                <p>Fórmula: Volume = Massa ÷ Fator Z</p>
              </div>
            </div>

            <div className="space-y-6">
              {pontosCalibra.map((ponto, pontoIndex) => (
                <div
                  key={ponto.id}
                  className="border border-gray-300 rounded-md p-3 bg-white relative"
                >
                  <div className="absolute top-2 right-2">
                    {pontosCalibra.length > 1 && (
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removerPonto(ponto.id)}
                        title="Remover ponto"
                      >
                        <FaMinus />
                      </button>
                    )}
                  </div>

                  <div className="mb-4 flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Volume Nominal
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={ponto.volumeNominal}
                          onChange={(e) =>
                            handleVolumeNominalChange(ponto.id, e.target.value)
                          }
                          placeholder="Volume nominal"
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                        <select
                          value={ponto.unidade}
                          onChange={(e) =>
                            atualizarPontoCalibracao(
                              ponto.id,
                              "unidade",
                              e.target.value
                            )
                          }
                          className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="µL">µL</option>
                          <option value="mL">mL</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex-grow-0">
                      <div className="px-3 py-2 rounded-md bg-gray-100 text-center border border-gray-200">
                        <span className="text-xs text-gray-500">
                          Ponto #{pontoIndex + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medições (mg)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {ponto.medicoes.map((medicao, index) => (
                        <input
                          key={index}
                          type="text"
                          value={medicao}
                          onChange={(e) =>
                            handleMedicaoChange(ponto.id, index, e.target.value)
                          }
                          placeholder={`M${index + 1}`}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Resultados dos cálculos */}
                  {ponto.media !== null && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                        <FaCalculator className="mr-2 text-green-600" />
                        Resultados
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="p-2 bg-white rounded shadow-sm border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">
                            Média das Medições
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {ponto.mediaMassa?.toFixed(4)} mg
                            </span>
                            <span className="text-green-600">
                              {ponto.media?.toFixed(4)} µL
                            </span>
                          </div>
                        </div>
                        <div className="p-2 bg-white rounded shadow-sm border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">
                            Inexatidão
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {ponto.inexatidao?.toFixed(4)} µL
                            </span>
                            <span
                              className={
                                ponto.inexatidaoPercentual > 5
                                  ? "text-red-600"
                                  : "text-green-600"
                              }
                            >
                              {ponto.inexatidaoPercentual?.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                        <div className="p-2 bg-white rounded shadow-sm border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">
                            Desvio Padrão
                          </div>
                          <span className="font-medium">
                            {ponto.desvioPadrao?.toFixed(4)} µL
                          </span>
                        </div>
                        <div className="p-2 bg-white rounded shadow-sm border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">
                            Incerteza (k=2)
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {ponto.incerteza?.toFixed(4)} µL
                            </span>
                            <span
                              className={
                                ponto.incertezaPercentual > 5
                                  ? "text-red-600"
                                  : "text-green-600"
                              }
                            >
                              {ponto.incertezaPercentual?.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Observações
            </h3>

            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Adicione aqui quaisquer observações relevantes..."
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Gerar Certificado
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EmitirCertificadoPage;
