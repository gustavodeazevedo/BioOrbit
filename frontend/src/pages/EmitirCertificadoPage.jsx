import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Download,
  Thermometer,
  Droplet,
  TestTube,
  TrendingUp,
  Plus,
  Minus,
  Calculator,
  Table,
  Eye,
  EyeOff,
  FileDown,
  HelpCircle,
  Info,
  Trash2,
} from "lucide-react";
import Tooltip from "../components/Tooltip";
import ConfirmDialog from "../components/ConfirmDialog";
import { getClienteById } from "../services/clienteService";
import { formatNumberInput, formatTemperature } from "../utils/formatUtils";
import { PDFService } from "../services/pdfService";

const EmitirCertificadoPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Ref para controlar a navegação entre inputs
  const formRef = useRef(null);

  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    numeroCertificado: "",
    dataCalibracao: "",
    marcaPipeta: "",
    modeloPipeta: "",
    numeroPipeta: "",
    numeroIdentificacao: "",
    capacidade: "",
    unidadeCapacidade: "µL",
    faixaIndicacao: "", // Faixa de indicação da pipeta
    faixaCalibrada: "", // Faixa calibrada da pipeta
    tipoInstrumento: "monocanal", // Tipo de instrumento (monocanal/multicanal)
    quantidadeCanais: 8, // Quantidade de canais para multicanal (8 ou 12)
    temperatura: "20.0",
    umidadeRelativa: "50",
    // Novos campos para aprimorar o certificado
    equipamentoReferencia: {
      balanca: "Mettler Toledo XS105",
      termometro: "Minipa MT-241",
      higrometro: "Minipa MT-241",
    },
    metodologia: "ISO 8655",
    validadeCalibracao: "12", // Validade em meses
    condicoesAmbientaisControladas: true,
  });
  const [certificadoGerado, setCertificadoGerado] = useState(false); // Fator Z calculado com base na temperatura
  const [fatorZ, setFatorZ] = useState(1.0029); // Valor padrão para 20°C
  // Estado para os pontos de calibração
  const [pontosCalibra, setPontosCalibra] = useState([
    {
      id: 1,
      volumeNominal: "",
      unidade: "µL",
      medicoes: Array(10).fill(""),
      valoresTexto: "", // Campo para armazenar o texto original
      media: null,
      mediaMassa: null,
      inexatidao: null,
      inexatidaoPercentual: null,
      desvioPadrao: null,
    },
  ]);
  // Estado para controlar o número de canais (para multicanal)
  const [numeroCanais, setNumeroCanais] = useState(1);
  // Estado para controlar a quantidade de canais selecionada pelo usuário
  const [quantidadeCanais, setQuantidadeCanais] = useState(8); // 8 ou 12 canais

  // Estado para controlar a visibilidade da nota explicativa sobre cálculos
  const [mostrarNotaCalculos, setMostrarNotaCalculos] = useState(false);

  // Estado para controlar o diálogo de confirmação de remoção
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    pontoId: null,
  });

  // Estado para exibir/esconder a seção de cálculos
  const [mostrarCalculos, setMostrarCalculos] = useState(false);

  // Tabela de referência mais precisa para o fator Z baseado na temperatura com incrementos de 0.5°C
  const tabelaFatorZ = {
    "15.0": 1.002,
    15.5: 1.002,
    "16.0": 1.0021,
    16.5: 1.0022,
    "17.0": 1.0023,
    17.5: 1.0024,
    "18.0": 1.0025,
    18.5: 1.0026,
    "19.0": 1.0027,
    19.5: 1.0028,
    "20.0": 1.0029,
    20.5: 1.003,
    "21.0": 1.0031,
    21.5: 1.0032,
    "22.0": 1.0033,
    22.5: 1.0034,
    "23.0": 1.0035,
    23.5: 1.0036,
    "24.0": 1.0038,
    24.5: 1.0039,
    "25.0": 1.004,
    25.5: 1.0041,
    "26.0": 1.0043,
    26.5: 1.0044,
    "27.0": 1.0045,
    27.5: 1.0047,
    "28.0": 1.0048,
    28.5: 1.005,
    "29.0": 1.0051,
    29.5: 1.0052,
    "30.0": 1.0054,
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
  // Utilizando a função de formatTemperature da pasta utils
  const ajustarTemperatura = (valor) => {
    return formatTemperature(valor);
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
    const camposNumericos = ["temperatura", "umidadeRelativa", "capacidade"];

    if (name === "temperatura") {
      // Para temperatura, ajusta para incrementos de 0.5
      const temperaturaAjustada = formatTemperature(value);
      setFormData({
        ...formData,
        [name]: temperaturaAjustada,
      });
    } else if (camposNumericos.includes(name)) {
      // Para outros campos numéricos, usa a função de formatação de números
      const valorFormatado = formatNumberInput(value);

      setFormData({
        ...formData,
        [name]: valorFormatado,
      });
    } else if (name === "tipoInstrumento") {
      // Quando o tipo de instrumento muda, reorganiza os pontos de calibração
      if (value === "multicanal") {
        // Para multicanal, cria grupos de 3 pontos por canal
        reorganizarPontosParaMulticanal();
      } else {
        // Para monocanal, volta ao layout padrão
        reorganizarPontosParaMonocanal();
      }

      setFormData({
        ...formData,
        [name]: value,
        quantidadeCanais: value === "multicanal" ? quantidadeCanais : 1,
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
  // Função para reorganizar pontos para layout multicanal
  const reorganizarPontosParaMulticanal = () => {
    // Usar a quantidade de canais selecionada pelo usuário
    const novosCanais = quantidadeCanais; // 8 ou 12 canais conforme seleção
    const pontosPorCanal = 3;
    const novosPontos = [];

    for (let canal = 1; canal <= novosCanais; canal++) {
      for (let ponto = 1; ponto <= pontosPorCanal; ponto++) {
        novosPontos.push({
          id: Date.now() + canal * 100 + ponto,
          volumeNominal: "",
          unidade: "µL",
          medicoes: Array(10).fill(""),
          valoresTexto: "",
          media: null,
          mediaMassa: null,
          inexatidao: null,
          inexatidaoPercentual: null,
          desvioPadrao: null,
          canal: canal, // Identificador do canal
          pontoPosicao: ponto, // Posição do ponto dentro do canal
        });
      }
    }

    setPontosCalibra(novosPontos);
    setNumeroCanais(novosCanais);
  };
  // Função para reorganizar pontos para layout monocanal
  const reorganizarPontosParaMonocanal = () => {
    // Volta ao layout padrão com um ponto
    setPontosCalibra([
      {
        id: Date.now(),
        volumeNominal: "",
        unidade: "µL",
        medicoes: Array(10).fill(""),
        valoresTexto: "",
        media: null,
        mediaMassa: null,
        inexatidao: null,
        inexatidaoPercentual: null,
        desvioPadrao: null,
      },
    ]);
    setNumeroCanais(1);
  };  // Função para lidar com mudança na quantidade de canais
  const handleQuantidadeCanaisChange = (novaQuantidade) => {
    setQuantidadeCanais(novaQuantidade);
    
    // Atualizar também o formData
    setFormData({
      ...formData,
      quantidadeCanais: novaQuantidade,
    });
    
    // Se já estiver em modo multicanal, reorganiza os pontos com a nova quantidade
    if (formData.tipoInstrumento === "multicanal") {
      const pontosPorCanal = 3;
      const novosPontos = [];
      
      for (let canal = 1; canal <= novaQuantidade; canal++) {
        for (let ponto = 1; ponto <= pontosPorCanal; ponto++) {
          novosPontos.push({
            id: Date.now() + canal * 100 + ponto,
            volumeNominal: "",
            unidade: "µL",
            medicoes: Array(10).fill(""),
            valoresTexto: "",
            media: null,
            mediaMassa: null,
            inexatidao: null,
            inexatidaoPercentual: null,
            desvioPadrao: null,
            canal: canal,
            pontoPosicao: ponto,
          });
        }
      }
      
      setPontosCalibra(novosPontos);
      setNumeroCanais(novaQuantidade);
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

  // Função para navegar para o próximo input quando Enter for pressionado
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (!formRef.current) return;

      // Seleciona todos os inputs, selects e buttons focáveis no formulário
      const focusableElements = formRef.current.querySelectorAll(
        'input:not([disabled]):not([type="hidden"]), select:not([disabled]), button:not([disabled]):not([type="submit"])'
      );

      const focusableArray = Array.from(focusableElements);
      const currentIndex = focusableArray.indexOf(e.target);

      if (currentIndex > -1 && currentIndex < focusableArray.length - 1) {
        // Move para o próximo elemento
        focusableArray[currentIndex + 1].focus();
      } else if (currentIndex === focusableArray.length - 1) {
        // Se for o último elemento, volta para o primeiro
        focusableArray[0].focus();
      }
    }
  }; // Função para fazer o download do certificado em PDF
  const handleDownloadCertificado = async () => {
    try {
      // Gerar o PDF usando o serviço
      const pdf = await PDFService.gerarCertificadoCalibracao(
        formData,
        cliente,
        pontosCalibra,
        fatorZ
      );

      // Criar nome do arquivo
      const nomeArquivo = `serie. ${formData.numeroPipeta || "SemSerie"}.pdf`;

      // Baixar o PDF
      PDFService.baixarPDF(pdf, nomeArquivo);
    } catch (error) {
      console.error("Erro ao gerar certificado PDF:", error);
      alert(
        "Erro ao gerar o certificado. Verifique se todos os dados estão preenchidos corretamente."
      );
    }
  };

  // Função para visualizar o PDF antes de baixar
  const handleVisualizarCertificado = async () => {
    try {
      // Gerar o PDF usando o serviço
      const pdf = await PDFService.gerarCertificadoCalibracao(
        formData,
        cliente,
        pontosCalibra,
        fatorZ
      );

      // Abrir o PDF em uma nova aba para visualização
      PDFService.abrirPDF(pdf);
    } catch (error) {
      console.error("Erro ao gerar certificado PDF:", error);
      alert(
        "Erro ao gerar o certificado. Verifique se todos os dados estão preenchidos corretamente."
      );
    }
  };

  const renderEnderecoCompleto = () => {
    if (!cliente?.endereco) return "Endereço não disponível";

    const { rua, numero, complemento, bairro, cidade, estado, cep } =
      cliente.endereco;

    return `${rua}, ${numero}${
      complemento ? `, ${complemento}` : ""
    } - ${bairro} - ${cidade}/${estado} - CEP: ${cep}`;
  }; // Função para adicionar um novo ponto de calibração
  const adicionarPontoCalibracao = () => {
    if (formData.tipoInstrumento === "multicanal") {
      // Para multicanal, adicionar um novo canal completo
      const novoCanal = numeroCanais + 1;
      const pontosPorCanal = 3;
      const novosPontos = [];

      // Verificar se não ultrapassou o limite de canais
      if (novoCanal > quantidadeCanais) {
        alert(`Limite máximo de ${quantidadeCanais} canais atingido.`);
        return;
      }

      for (let ponto = 1; ponto <= pontosPorCanal; ponto++) {
        novosPontos.push({
          id: Date.now() + novoCanal * 100 + ponto,
          volumeNominal: "",
          unidade: "µL",
          medicoes: Array(10).fill(""),
          valoresTexto: "",
          media: null,
          mediaMassa: null,
          inexatidao: null,
          inexatidaoPercentual: null,
          desvioPadrao: null,
          canal: novoCanal,
          pontoPosicao: ponto,
        });
      }

      setPontosCalibra([...pontosCalibra, ...novosPontos]);
      setNumeroCanais(novoCanal);
    } else {
      // Para monocanal, adicionar um ponto individual
      const novoPonto = {
        id: Date.now(),
        volumeNominal: "",
        unidade: "µL",
        medicoes: Array(10).fill(""),
        valoresTexto: "",
        media: null,
        mediaMassa: null,
        inexatidao: null,
        inexatidaoPercentual: null,
        desvioPadrao: null,
      };

      setPontosCalibra([...pontosCalibra, novoPonto]);
    }
  };
  // Função para remover um ponto de calibração
  const removerPontoCalibracao = (id) => {
    if (formData.tipoInstrumento === "multicanal") {
      // Para multicanal, remover o canal inteiro
      const ponto = pontosCalibra.find((p) => p.id === id);
      if (ponto && numeroCanais > 1) {
        // Remove todos os pontos do canal
        const pontosRestantes = pontosCalibra.filter(
          (p) => p.canal !== ponto.canal
        );
        setPontosCalibra(pontosRestantes);
        setNumeroCanais(numeroCanais - 1);
      } else if (numeroCanais === 1) {
        alert("É necessário manter pelo menos um canal de calibração.");
      }
    } else {
      // Para monocanal, remover ponto individual
      if (pontosCalibra.length <= 1) {
        alert("É necessário manter pelo menos um ponto de calibração.");
        return;
      }
      setPontosCalibra(pontosCalibra.filter((ponto) => ponto.id !== id));
    }
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
          // Usa a função de formatação de números da pasta utils
          // Permite apenas números e pontos decimais (não vírgulas)
          const valorFormatado = formatNumberInput(valor);
          novasMedicoes[medicaoIndex] = valorFormatado;
          return { ...ponto, medicoes: novasMedicoes };
        }
        return ponto;
      })
    );
  }; // Função para realizar os cálculos de calibração para todos os pontos
  const calcularResultados = () => {
    // Teste com valores específicos da planilha fornecida
    if (process.env.NODE_ENV !== "production") {
      console.log("--- Teste com valores da planilha fornecida ---");

      // Fator Z da planilha
      const testeFatorZ = 1.0043; // Z factor μl/mg da planilha
      console.log("Fator Z:", testeFatorZ);

      // Teste para volume 100,00 μL
      const valoresVol1 = [99.4, 99.5]; // Valores da coluna [mg]
      const volNominal1 = 100.0;
      const mediaMassaVol1 =
        valoresVol1.reduce((sum, val) => sum + val, 0) / valoresVol1.length;
      const mediaVolumeVol1 = mediaMassaVol1 * testeFatorZ;
      const accuracyVol1 = mediaVolumeVol1 - volNominal1;
      const accuracyPctVol1 = (accuracyVol1 / volNominal1) * 100;

      // Volumes individuais e desvio padrão para volume 100,00
      const volumesVol1 = valoresVol1.map((massa) => massa * testeFatorZ);
      const somaQuadradosVol1 = volumesVol1.reduce(
        (sum, vol) => sum + Math.pow(vol - mediaVolumeVol1, 2),
        0
      );
      const precisaoVol1 = Math.sqrt(
        somaQuadradosVol1 / (volumesVol1.length - 1)
      );
      const precisaoPctVol1 = (precisaoVol1 / mediaVolumeVol1) * 100;

      console.log("\nVolume 1 (100,00 μL):");
      console.log(
        "Média massa:",
        mediaMassaVol1.toFixed(2),
        "mg (Planilha: 99,45)"
      );
      console.log(
        "Mean Volume:",
        mediaVolumeVol1.toFixed(2),
        "μL (Planilha: 99,88)"
      );
      console.log("Accuracy:", accuracyVol1.toFixed(2), "μL (Planilha: -0,12)");
      console.log(
        "Accuracy %:",
        accuracyPctVol1.toFixed(2),
        "% (Planilha: -0,12%)"
      );
      console.log(
        "Precision (SD):",
        precisaoVol1.toFixed(2),
        "μL (Planilha: 0,07)"
      );
      console.log(
        "Precision (CV):",
        precisaoPctVol1.toFixed(2),
        "% (Planilha: 0,07%)"
      );

      // Teste para volume 500,00 μL
      const valoresVol2 = [495.6, 495.7]; // Valores da coluna [mg]
      const volNominal2 = 500.0;
      const mediaMassaVol2 =
        valoresVol2.reduce((sum, val) => sum + val, 0) / valoresVol2.length;
      const mediaVolumeVol2 = mediaMassaVol2 * testeFatorZ;
      const accuracyVol2 = mediaVolumeVol2 - volNominal2;
      const accuracyPctVol2 = (accuracyVol2 / volNominal2) * 100;

      // Volumes individuais e desvio padrão para volume 500,00
      const volumesVol2 = valoresVol2.map((massa) => massa * testeFatorZ);
      const somaQuadradosVol2 = volumesVol2.reduce(
        (sum, vol) => sum + Math.pow(vol - mediaVolumeVol2, 2),
        0
      );
      const precisaoVol2 = Math.sqrt(
        somaQuadradosVol2 / (volumesVol2.length - 1)
      );
      const precisaoPctVol2 = (precisaoVol2 / mediaVolumeVol2) * 100;

      console.log("\nVolume 2 (500,00 μL):");
      console.log(
        "Média massa:",
        mediaMassaVol2.toFixed(2),
        "mg (Planilha: 495,65)"
      );
      console.log(
        "Mean Volume:",
        mediaVolumeVol2.toFixed(2),
        "μL (Planilha: 497,78)"
      );
      console.log("Accuracy:", accuracyVol2.toFixed(2), "μL (Planilha: -2,22)");
      console.log(
        "Accuracy %:",
        accuracyPctVol2.toFixed(2),
        "% (Planilha: -0,44%)"
      );
      console.log(
        "Precision (SD):",
        precisaoVol2.toFixed(2),
        "μL (Planilha: 0,07)"
      );
      console.log(
        "Precision (CV):",
        precisaoPctVol2.toFixed(2),
        "% (Planilha: 0,01%)"
      );

      // Teste para volume 1000,00 μL
      const valoresVol3 = [995.5, 995.3]; // Valores da coluna [mg]
      const volNominal3 = 1000.0;
      const mediaMassaVol3 =
        valoresVol3.reduce((sum, val) => sum + val, 0) / valoresVol3.length;
      const mediaVolumeVol3 = mediaMassaVol3 * testeFatorZ;
      const accuracyVol3 = mediaVolumeVol3 - volNominal3;
      const accuracyPctVol3 = (accuracyVol3 / volNominal3) * 100;

      // Volumes individuais e desvio padrão para volume 1000,00
      const volumesVol3 = valoresVol3.map((massa) => massa * testeFatorZ);
      const somaQuadradosVol3 = volumesVol3.reduce(
        (sum, vol) => sum + Math.pow(vol - mediaVolumeVol3, 2),
        0
      );
      const precisaoVol3 = Math.sqrt(
        somaQuadradosVol3 / (volumesVol3.length - 1)
      );
      const precisaoPctVol3 = (precisaoVol3 / mediaVolumeVol3) * 100;

      console.log("\nVolume 3 (1000,00 μL):");
      console.log(
        "Média massa:",
        mediaMassaVol3.toFixed(2),
        "mg (Planilha: 995,40)"
      );
      console.log(
        "Mean Volume:",
        mediaVolumeVol3.toFixed(2),
        "μL (Planilha: 999,68)"
      );
      console.log("Accuracy:", accuracyVol3.toFixed(2), "μL (Planilha: -0,32)");
      console.log(
        "Accuracy %:",
        accuracyPctVol3.toFixed(2),
        "% (Planilha: -0,03%)"
      );
      console.log(
        "Precision (SD):",
        precisaoVol3.toFixed(2),
        "μL (Planilha: 0,14)"
      );
      console.log(
        "Precision (CV):",
        precisaoPctVol3.toFixed(2),
        "% (Planilha: 0,01%)"
      );

      console.log("------------------------------------------");
    }

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
            mediaMassa: null,
            inexatidao: null,
            inexatidaoPercentual: null,
            desvioPadrao: null,
            coeficienteVariacao: null,
          };
        }

        // Converte o volume nominal para número
        const volumeNominalNum = parseFloat(ponto.volumeNominal);
        if (isNaN(volumeNominalNum)) return ponto;

        // 1. Calcular a média das massas (mg)
        const mediaMassa =
          medicoesValidas.reduce((sum, val) => sum + val, 0) /
          medicoesValidas.length;

        // 2. Converter cada medição individual de massa (mg) para volume (µL)
        const volumesIndividuais = medicoesValidas.map(
          (massa) => massa * fatorZ
        );

        // 3. Calcular a média dos volumes convertidos
        const mediaVolume =
          volumesIndividuais.reduce((sum, vol) => sum + vol, 0) /
          volumesIndividuais.length;

        // 4. Calcular exatidão (accuracy)
        const inexatidao = mediaVolume - volumeNominalNum;
        const inexatidaoPercentual = (inexatidao / volumeNominalNum) * 100;

        // 5. Calcular precisão (desvio padrão - SD) diretamente nos volumes convertidos
        const somaDosQuadradosDasDiferencas = volumesIndividuais.reduce(
          (sum, vol) => sum + Math.pow(vol - mediaVolume, 2),
          0
        );

        const desvioPadrao = Math.sqrt(
          somaDosQuadradosDasDiferencas / (volumesIndividuais.length - 1)
        );

        // 6. Cálculo do CV (Coeficiente de Variação)
        const coeficienteVariacao =
          mediaVolume !== 0 ? (desvioPadrao / mediaVolume) * 100 : 0; // Arredonda para duas casas decimais antes de armazenar
        return {
          ...ponto,
          media: parseFloat(mediaVolume.toFixed(2)),
          mediaMassa: parseFloat(mediaMassa.toFixed(2)),
          inexatidao: parseFloat(inexatidao.toFixed(2)),
          inexatidaoPercentual: parseFloat(inexatidaoPercentual.toFixed(2)),
          desvioPadrao: parseFloat(desvioPadrao.toFixed(2)),
          coeficienteVariacao: parseFloat(coeficienteVariacao.toFixed(2)),
        };
      })
    );
  };

  // Recalcular automaticamente quando as medições ou o fator Z mudam
  useEffect(() => {
    calcularResultados();
  }, [pontosCalibra.map((p) => p.medicoes.join()).join(), fatorZ]);

  // Função para calcular a média das medições, com opção de conversão
  const calcularMedia = (medicoes, fatorConversao = null) => {
    const valoresNumericos = medicoes
      .filter((med) => med !== "")
      .map((med) => {
        const valor = parseFloat(med);
        // Se um fator de conversão for fornecido, aplicar a cada valor
        return !isNaN(valor)
          ? fatorConversao
            ? valor * fatorConversao
            : valor
          : null;
      })
      .filter((val) => val !== null);

    if (valoresNumericos.length === 0) return null;

    const soma = valoresNumericos.reduce((acc, val) => acc + val, 0);
    return soma / valoresNumericos.length;
  };

  // Função para calcular o desvio padrão
  const calcularDesvioPadrao = (medicoes, media, fatorConversao = null) => {
    if (media === null) return null;

    const valoresNumericos = medicoes
      .filter((med) => med !== "")
      .map((med) => {
        const valor = parseFloat(med);
        // Se um fator de conversão for fornecido, aplicar a cada valor
        return !isNaN(valor)
          ? fatorConversao
            ? valor * fatorConversao
            : valor
          : null;
      })
      .filter((val) => val !== null);

    if (valoresNumericos.length <= 1) return 0;

    const somaDosQuadradosDasDiferencas = valoresNumericos.reduce(
      (acc, val) => acc + Math.pow(val - media, 2),
      0
    );

    return Math.sqrt(
      somaDosQuadradosDasDiferencas / (valoresNumericos.length - 1)
    );
  }; // Função para adicionar novo ponto de calibração
  const adicionarPonto = () => {
    setPontosCalibra([
      ...pontosCalibra,
      {
        id: Date.now(),
        volumeNominal: "",
        unidade: "µL",
        medicoes: Array(10).fill(""),
        valoresTexto: "",
        media: null,
        mediaMassa: null,
        inexatidao: null,
        inexatidaoPercentual: null,
        desvioPadrao: null,
      },
    ]);
  }; // Função para mostrar diálogo de confirmação de remoção
  const confirmarRemoverPonto = (id, numeroPonto, isCanal = false) => {
    if (formData.tipoInstrumento === "multicanal" && isCanal) {
      if (numeroCanais <= 1) {
        setConfirmDialog({
          isOpen: true,
          title: "Não é possível remover",
          message: "É necessário ter pelo menos um canal de calibração.",
          pontoId: null,
          type: "info",
        });
        return;
      }

      setConfirmDialog({
        isOpen: true,
        title: "Remover canal de calibração",
        message: `Tem certeza que deseja remover o canal ${numeroPonto} completo? Todos os 3 pontos de calibração deste canal serão removidos.`,
        pontoId: id,
        type: "warning",
      });
    } else {
      if (pontosCalibra.length <= 1) {
        setConfirmDialog({
          isOpen: true,
          title: "Não é possível remover",
          message: "É necessário ter pelo menos um ponto de calibração.",
          pontoId: null,
          type: "info",
        });
        return;
      }

      setConfirmDialog({
        isOpen: true,
        title: "Remover ponto de calibração",
        message: `Tem certeza que deseja remover o ponto de calibração #${numeroPonto}?`,
        pontoId: id,
        type: "warning",
      });
    }
  };
  // Função para remover um ponto de calibração
  const removerPonto = (id) => {
    removerPontoCalibracao(id);
    // Fecha o modal de confirmação
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  }; // Função para processar valores separados por vírgula em um único input
  const handleValoresChange = (pontoId, valores) => {
    // Processa a string de valores separados por vírgula
    const valoresArray = valores
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "");

    // Preenche um array de 10 posições com os valores ou strings vazias
    const medicoesPadrao = Array(10).fill("");
    valoresArray.forEach((valor, index) => {
      if (index < 10) {
        medicoesPadrao[index] = valor;
      }
    });

    setPontosCalibra(
      pontosCalibra.map((ponto) => {
        if (ponto.id === pontoId) {
          return {
            ...ponto,
            medicoes: medicoesPadrao,
            valoresTexto: valores, // Mantém o texto original para exibição
          };
        }
        return ponto;
      })
    );
  };  // Função para atualizar o volume nominal de um ponto
  const handleVolumeNominalChange = (pontoId, valor) => {
    // Usa a função de formatação de números da pasta utils
    const valorFormatado = formatNumberInput(valor);

    // Encontrar o ponto que está sendo modificado
    const pontoAtual = pontosCalibra.find(p => p.id === pontoId);
    const isCanal1 = pontoAtual && pontoAtual.canal === 1;
    const isMulticanal = formData.tipoInstrumento === "multicanal";

    setPontosCalibra(
      pontosCalibra.map((ponto) => {
        // Atualizar o ponto atual
        if (ponto.id === pontoId) {
          // Filtrar medições válidas
          const medicoesValidas = ponto.medicoes
            .map((m) => parseFloat(m))
            .filter((m) => !isNaN(m));

          // Calcular média de massa
          const mediaMassa =
            medicoesValidas.length > 0
              ? medicoesValidas.reduce((sum, val) => sum + val, 0) /
                medicoesValidas.length
              : null;

          // Converter cada medição para volume e calcular média
          let media = null;
          let volumesIndividuais = [];

          if (mediaMassa !== null) {
            // Converter cada medição individual de massa para volume
            volumesIndividuais = medicoesValidas.map((massa) => massa * fatorZ);

            // Calcular a média dos volumes
            media =
              volumesIndividuais.reduce((sum, vol) => sum + vol, 0) /
              volumesIndividuais.length;
          }

          // Calcular inexatidão baseada no novo volume nominal
          let inexatidao = null;
          let inexatidaoPercentual = null;

          if (media !== null && valorFormatado !== "") {
            const volumeNominal = parseFloat(valorFormatado);
            inexatidao = media - volumeNominal;
            inexatidaoPercentual = (inexatidao / volumeNominal) * 100;
          }

          // Calcular a precisão (desvio padrão) diretamente dos volumes individuais
          let desvioPadrao = null;
          let coeficienteVariacao = null;

          if (volumesIndividuais.length > 1 && media !== null) {
            const somaDosQuadradosDasDiferencas = volumesIndividuais.reduce(
              (sum, vol) => sum + Math.pow(vol - media, 2),
              0
            );

            desvioPadrao = Math.sqrt(
              somaDosQuadradosDasDiferencas / (volumesIndividuais.length - 1)
            );

            // Cálculo do CV (Coeficiente de Variação) - presente na planilha como Precision (CV)
            coeficienteVariacao =
              media !== null && media !== 0 ? (desvioPadrao / media) * 100 : 0;
          }
          
          return {
            ...ponto,
            volumeNominal: valorFormatado,
            media: media !== null ? parseFloat(media.toFixed(2)) : null,
            mediaMassa:
              mediaMassa !== null ? parseFloat(mediaMassa.toFixed(2)) : null,
            inexatidao:
              inexatidao !== null ? parseFloat(inexatidao.toFixed(2)) : null,
            inexatidaoPercentual:
              inexatidaoPercentual !== null
                ? parseFloat(inexatidaoPercentual.toFixed(2))
                : null,
            desvioPadrao:
              desvioPadrao !== null
                ? parseFloat(desvioPadrao.toFixed(2))
                : null,
            coeficienteVariacao:
              coeficienteVariacao !== null
                ? parseFloat(coeficienteVariacao.toFixed(2))
                : null,
          };
        }
        
        // Se for multicanal e estamos alterando o canal 1, sincronizar com outros canais
        else if (isMulticanal && isCanal1 && ponto.canal !== 1 && ponto.pontoPosicao === pontoAtual.pontoPosicao) {
          return {
            ...ponto,
            volumeNominal: valorFormatado,
            // Recalcular este ponto também se tiver medições
            ...(ponto.medicoes.some(m => m !== "") ? (() => {
              const medicoesValidas = ponto.medicoes
                .map((m) => parseFloat(m))
                .filter((m) => !isNaN(m));

              if (medicoesValidas.length === 0) return {};

              const mediaMassa = medicoesValidas.reduce((sum, val) => sum + val, 0) / medicoesValidas.length;
              const volumesIndividuais = medicoesValidas.map((massa) => massa * fatorZ);
              const media = volumesIndividuais.reduce((sum, vol) => sum + vol, 0) / volumesIndividuais.length;
              
              let inexatidao = null;
              let inexatidaoPercentual = null;
              if (valorFormatado !== "") {
                const volumeNominal = parseFloat(valorFormatado);
                inexatidao = media - volumeNominal;
                inexatidaoPercentual = (inexatidao / volumeNominal) * 100;
              }

              let desvioPadrao = null;
              let coeficienteVariacao = null;
              if (volumesIndividuais.length > 1) {
                const somaDosQuadrados = volumesIndividuais.reduce(
                  (sum, vol) => sum + Math.pow(vol - media, 2), 0
                );
                desvioPadrao = Math.sqrt(somaDosQuadrados / (volumesIndividuais.length - 1));
                coeficienteVariacao = media !== 0 ? (desvioPadrao / media) * 100 : 0;
              }

              return {
                media: parseFloat(media.toFixed(2)),
                mediaMassa: parseFloat(mediaMassa.toFixed(2)),
                inexatidao: inexatidao !== null ? parseFloat(inexatidao.toFixed(2)) : null,
                inexatidaoPercentual: inexatidaoPercentual !== null ? parseFloat(inexatidaoPercentual.toFixed(2)) : null,
                desvioPadrao: desvioPadrao !== null ? parseFloat(desvioPadrao.toFixed(2)) : null,
                coeficienteVariacao: coeficienteVariacao !== null ? parseFloat(coeficienteVariacao.toFixed(2)) : null,
              };
            })() : {})
          };
        }
        
        return ponto;
      })
    );
  };
  if (loading) {
    return (
      <div
        className="min-h-screen w-full p-6"
        style={{
          backgroundColor: "rgb(249, 250, 251)",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <div
          className="p-6 max-w-4xl mx-auto"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "20px",
            boxShadow:
              "0 20px 40px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div className="text-center p-4">
            <div
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto"
              style={{
                borderTopColor: "rgb(144, 199, 45)",
                borderBottomColor: "rgb(144, 199, 45)",
              }}
            ></div>
            <p className="mt-3" style={{ color: "rgb(75, 85, 99)" }}>
              Carregando dados do cliente...
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div
        className="min-h-screen w-full p-6"
        style={{
          backgroundColor: "rgb(249, 250, 251)",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <div
          className="w-full max-w-4xl mx-auto"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "20px",
            boxShadow:
              "0 20px 40px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "2rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
          <button
            className="flex items-center hover:opacity-80"
            style={{ color: "rgb(144, 199, 45)" }}
            onClick={() => navigate("/selecionar-cliente")}
          >
            <ArrowLeft className="mr-2" /> Voltar
          </button>
        </div>
      </div>
    );
  }
  return (
    <div
      className="min-h-screen w-full p-6"
      style={{
        backgroundColor: "rgb(249, 250, 251)",
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <div
        className="w-full max-w-6xl mx-auto"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          boxShadow:
            "0 20px 40px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          padding: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <button
            className="flex items-center hover:opacity-80"
            style={{ color: "rgb(144, 199, 45)" }}
            onClick={() => navigate("/selecionar-cliente")}
          >
            <ArrowLeft className="mr-2" /> Voltar
          </button>{" "}
          <h1
            className="text-2xl font-bold text-center py-2 px-4 rounded-lg"
            style={{
              color: "rgb(144, 199, 45)",
            }}
          >
            Emissão de Certificado
          </h1>
          <div>{/* Espaço para equilibrar o layout */}</div>
        </div>{" "}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
          {" "}
          <h3
            className="text-lg font-semibold mb-2 py-2 px-3 border-l-4"
            style={{
              color: "rgb(75, 85, 99)",
              borderLeftColor: "rgb(144, 199, 45)",
            }}
          >
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
              <FileText className="text-6xl text-red-600 mx-auto mb-4" />
              <p className="text-xl font-semibold mb-2">
                Certificado de Calibração
              </p>
              <p className="mb-2">Número: {formData.numeroCertificado}</p>
              <p className="mb-2">Cliente: {cliente?.nome}</p>{" "}
              <p className="mb-2">
                Micropipeta: {formData.marcaPipeta} {formData.modeloPipeta}
              </p>{" "}
              <p className="mb-2">Número de Série: {formData.numeroPipeta}</p>
              {formData.numeroIdentificacao && (
                <p className="mb-2">
                  Nº de Identificação: {formData.numeroIdentificacao}
                </p>
              )}
              <p className="mb-2">
                Tipo de Instrumento:{" "}
                {formData.tipoInstrumento === "monocanal"
                  ? "Monocanal"
                  : "Multicanal"}
              </p>
              <p className="mb-2">Temperatura: {formData.temperatura} °C</p>
              <p className="mb-2">
                Umidade Relativa: {formData.umidadeRelativa}%
              </p>
              <p className="mb-2">Fator Z: {fatorZ.toFixed(4)}</p>{" "}
              <p className="mb-4">Emissão: {new Date().toLocaleDateString()}</p>
              {/* Botões de ação para o certificado */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={handleVisualizarCertificado}
                  className="text-white px-6 py-2 rounded-md flex items-center justify-center focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    backgroundColor: "rgb(59, 130, 246)",
                    "--tw-ring-color": "rgb(59, 130, 246)",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "rgb(37, 99, 235)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "rgb(59, 130, 246)")
                  }
                >
                  <Eye className="mr-2" /> Visualizar Certificado
                </button>

                <button
                  onClick={handleDownloadCertificado}
                  className="text-white px-6 py-2 rounded-md flex items-center justify-center focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    backgroundColor: "rgb(144, 199, 45)",
                    "--tw-ring-color": "rgb(144, 199, 45)",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "rgb(130, 180, 40)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "rgb(144, 199, 45)")
                  }
                >
                  <Download className="mr-2" /> Baixar Certificado
                </button>
              </div>
            </div>{" "}
            <button
              onClick={() => setCertificadoGerado(false)}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-2"
              style={{ color: "rgb(75, 85, 99)" }}
            >
              Editar Dados
            </button>
            <button
              onClick={() => navigate("/selecionar-cliente")}
              className="text-white px-4 py-2 rounded-md ml-2 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "rgb(144, 199, 45)",
                "--tw-ring-color": "rgb(144, 199, 45)",
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "rgb(130, 180, 40)")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "rgb(144, 199, 45)")
              }
            >
              Novo Certificado
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            className="space-y-6"
            ref={formRef}
          >
            {" "}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              {" "}
              <h3
                className="text-lg font-semibold mb-3 py-2 px-3 border-l-4"
                style={{
                  color: "rgb(75, 85, 99)",
                  borderLeftColor: "rgb(144, 199, 45)",
                }}
              >
                Dados do Certificado
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {" "}
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "rgb(75, 85, 99)" }}
                  >
                    Número do Certificado
                  </label>
                  <input
                    type="text"
                    name="numeroCertificado"
                    value={formData.numeroCertificado}
                    onChange={handleChange}
                    placeholder="Ex: 8550.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{
                      "--tw-ring-color": "rgb(144, 199, 45)",
                      color: "rgb(75, 85, 99)",
                    }}
                    required
                  />
                </div>{" "}
                <div>
                  {" "}
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "rgb(75, 85, 99)" }}
                  >
                    Data da Calibração
                  </label>
                  <input
                    type="date"
                    name="dataCalibracao"
                    value={formData.dataCalibracao}
                    onChange={handleChange}
                    placeholder="Selecione a data da calibração"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{
                      "--tw-ring-color": "rgb(144, 199, 45)",
                      color: "rgb(75, 85, 99)",
                    }}
                    required
                  />
                </div>
              </div>
            </div>{" "}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              {" "}
              <h3
                className="text-lg font-semibold mb-3 py-2 px-3 border-l-4"
                style={{
                  color: "rgb(75, 85, 99)",
                  borderLeftColor: "rgb(144, 199, 45)",
                }}
              >
                Condições Ambientais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {" "}
                  <label
                    className="flex text-sm font-medium mb-1 items-center"
                    style={{ color: "rgb(75, 85, 99)" }}
                  >
                    <Thermometer className="mr-2 text-red-500" />
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
                      className="w-full px-3 py-2 border-y border-gray-300 focus:outline-none focus:ring-2 text-center"
                      style={{
                        "--tw-ring-color": "rgb(144, 199, 45)",
                        color: "rgb(75, 85, 99)",
                      }}
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
                  </div>{" "}
                  <div className="text-sm text-gray-700 mt-2 p-2 bg-yellow-50 rounded-md border border-yellow-100">
                    <div className="font-medium mb-1">
                      Fator Z atual:{" "}
                      <span className="text-green-600">
                        {fatorZ.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>{" "}
                <div>
                  {" "}
                  <label
                    className="flex text-sm font-medium mb-1 items-center"
                    style={{ color: "rgb(75, 85, 99)" }}
                  >
                    <Droplet className="mr-2 text-blue-500" />
                    Umidade Relativa do Ar (%)
                  </label>
                  <input
                    type="number"
                    name="umidadeRelativa"
                    value={formData.umidadeRelativa}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{
                      "--tw-ring-color": "rgb(144, 199, 45)",
                      color: "rgb(75, 85, 99)",
                    }}
                    min="30"
                    max="90"
                    required
                  />
                </div>
              </div>
            </div>{" "}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              {" "}
              <h3
                className="text-lg font-semibold mb-3 py-2 px-3 border-l-4"
                style={{
                  color: "rgb(75, 85, 99)",
                  borderLeftColor: "rgb(144, 199, 45)",
                }}
              >
                Dados da Micropipeta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {" "}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "rgb(75, 85, 99)" }}
                  >
                    Marca da Pipeta
                  </label>
                  <input
                    type="text"
                    name="marcaPipeta"
                    value={formData.marcaPipeta}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{
                      "--tw-ring-color": "rgb(144, 199, 45)",
                      color: "rgb(75, 85, 99)",
                    }}
                    required
                    placeholder="Ex: Eppendorf, Gilson, HTL, etc."
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "rgb(75, 85, 99)" }}
                  >
                    Modelo da Pipeta
                  </label>
                  <input
                    type="text"
                    name="modeloPipeta"
                    value={formData.modeloPipeta}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{
                      "--tw-ring-color": "rgb(144, 199, 45)",
                      color: "rgb(75, 85, 99)",
                    }}
                    required
                    placeholder="Ex: P1000, Research Plus, etc."
                  />
                </div>{" "}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "rgb(75, 85, 99)" }}
                  >
                    Número/Série da Pipeta
                  </label>
                  <input
                    type="text"
                    name="numeroPipeta"
                    value={formData.numeroPipeta}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{
                      "--tw-ring-color": "rgb(144, 199, 45)",
                      color: "rgb(75, 85, 99)",
                    }}
                    required
                    placeholder="Ex: AJ12345"
                  />{" "}
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "rgb(75, 85, 99)" }}
                  >
                    Nº de Identificação
                  </label>
                  <input
                    type="text"
                    name="numeroIdentificacao"
                    value={formData.numeroIdentificacao}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{
                      "--tw-ring-color": "rgb(144, 199, 45)",
                      color: "rgb(75, 85, 99)",
                    }}
                    placeholder="Ex: ID001, BIO123, etc. (opcional)"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "rgb(75, 85, 99)" }}
                  >
                    Capacidade
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      name="capacidade"
                      value={formData.capacidade}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2"
                      style={{
                        "--tw-ring-color": "rgb(144, 199, 45)",
                        color: "rgb(75, 85, 99)",
                      }}
                      required
                      placeholder="Ex: 1000"
                    />
                    <select
                      name="unidadeCapacidade"
                      value={formData.unidadeCapacidade}
                      onChange={handleChange}
                      className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2"
                      style={{
                        "--tw-ring-color": "rgb(144, 199, 45)",
                        color: "rgb(75, 85, 99)",
                      }}
                    >
                      <option value="µL">µL</option>
                      <option value="mL">mL</option>
                    </select>
                  </div>
                </div>{" "}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "rgb(75, 85, 99)" }}
                  >
                    Tipo de Instrumento
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="tipoInstrumento"
                        value="monocanal"
                        checked={formData.tipoInstrumento === "monocanal"}
                        onChange={handleChange}
                        className="form-radio h-5 w-5"
                        style={{ color: "rgb(144, 199, 45)" }}
                      />
                      <span
                        className="ml-2"
                        style={{ color: "rgb(75, 85, 99)" }}
                      >
                        Monocanal
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="tipoInstrumento"
                        value="multicanal"
                        checked={formData.tipoInstrumento === "multicanal"}
                        onChange={handleChange}
                        className="form-radio h-5 w-5"
                        style={{ color: "rgb(144, 199, 45)" }}
                      />
                      <span
                        className="ml-2"
                        style={{ color: "rgb(75, 85, 99)" }}
                      >
                        Multicanal
                      </span>
                    </label>
                  </div>

                  {/* Seleção de quantidade de canais - só aparece quando multicanal está selecionado */}
                  {formData.tipoInstrumento === "multicanal" && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "rgb(75, 85, 99)" }}
                      >
                        Quantidade de Canais
                      </label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="quantidadeCanais"
                            value="8"
                            checked={quantidadeCanais === 8}
                            onChange={(e) =>
                              handleQuantidadeCanaisChange(
                                parseInt(e.target.value)
                              )
                            }
                            className="form-radio h-4 w-4"
                            style={{ color: "rgb(144, 199, 45)" }}
                          />
                          <span
                            className="ml-2 text-sm"
                            style={{ color: "rgb(75, 85, 99)" }}
                          >
                            8 Canais
                          </span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="quantidadeCanais"
                            value="12"
                            checked={quantidadeCanais === 12}
                            onChange={(e) =>
                              handleQuantidadeCanaisChange(
                                parseInt(e.target.value)
                              )
                            }
                            className="form-radio h-4 w-4"
                            style={{ color: "rgb(144, 199, 45)" }}
                          />
                          <span
                            className="ml-2 text-sm"
                            style={{ color: "rgb(75, 85, 99)" }}
                          >
                            12 Canais
                          </span>                        </label>
                      </div>
                    </div>
                  )}
                </div>{" "}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "rgb(75, 85, 99)" }}
                  >
                    Faixa de Indicação
                  </label>
                  <input
                    type="text"
                    name="faixaIndicacao"
                    value={formData.faixaIndicacao}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{
                      "--tw-ring-color": "rgb(144, 199, 45)",
                      color: "rgb(75, 85, 99)",
                    }}
                    placeholder="Ex: 100-1000 µL"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "rgb(75, 85, 99)" }}
                  >
                    Faixa Calibrada
                  </label>
                  <input
                    type="text"
                    name="faixaCalibrada"
                    value={formData.faixaCalibrada}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{
                      "--tw-ring-color": "rgb(144, 199, 45)",
                      color: "rgb(75, 85, 99)",
                    }}
                    placeholder="Ex: 200-1000 µL"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              {" "}
              <div className="flex justify-between items-center mb-3">
                {" "}
                <h3
                  className="text-lg font-semibold flex items-center py-2 px-3 border-l-4"
                  style={{
                    color: "rgb(75, 85, 99)",
                    borderLeftColor: "rgb(144, 199, 45)",
                  }}
                >
                  <TrendingUp
                    className="mr-2"
                    style={{ color: "rgb(144, 199, 45)" }}
                  />
                  Pontos de Calibração
                  {formData.tipoInstrumento === "multicanal" && (
                    <span className="ml-2 text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
                      {quantidadeCanais} Canais
                    </span>
                  )}
                </h3>
                <div className="flex space-x-2">
                  {" "}
                  <button
                    type="button"
                    onClick={() => setMostrarNotaCalculos(!mostrarNotaCalculos)}
                    className={`flex items-center text-sm px-3 py-1.5 rounded-md border transition-colors duration-200 ${
                      mostrarNotaCalculos
                        ? "bg-blue-100 text-blue-800 border-blue-300"
                        : "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    }`}
                  >
                    {mostrarNotaCalculos ? (
                      <>
                        <EyeOff className="mr-1" /> Ocultar Ajuda
                      </>
                    ) : (
                      <>
                        <Info className="mr-1" /> Como os cálculos são feitos?
                      </>
                    )}
                  </button>{" "}
                  <button
                    type="button"
                    className={`flex items-center text-sm px-3 py-1.5 rounded-md border transition-colors ${
                      formData.tipoInstrumento === "multicanal" &&
                      numeroCanais >= quantidadeCanais
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "border-green-300"
                    }`}
                    style={{
                      backgroundColor:
                        formData.tipoInstrumento === "multicanal" &&
                        numeroCanais >= quantidadeCanais
                          ? "rgb(243, 244, 246)"
                          : "rgb(240, 253, 244)",
                      color:
                        formData.tipoInstrumento === "multicanal" &&
                        numeroCanais >= quantidadeCanais
                          ? "rgb(156, 163, 175)"
                          : "rgb(144, 199, 45)",
                    }}
                    onMouseEnter={(e) => {
                      if (
                        !(
                          formData.tipoInstrumento === "multicanal" &&
                          numeroCanais >= quantidadeCanais
                        )
                      ) {
                        e.target.style.backgroundColor = "rgb(220, 252, 231)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        !(
                          formData.tipoInstrumento === "multicanal" &&
                          numeroCanais >= quantidadeCanais
                        )
                      ) {
                        e.target.style.backgroundColor = "rgb(240, 253, 244)";
                      }
                    }}
                    onClick={adicionarPontoCalibracao}
                    title={
                      formData.tipoInstrumento === "multicanal"
                        ? numeroCanais >= quantidadeCanais
                          ? `Limite máximo de ${quantidadeCanais} canais atingido`
                          : `Adicionar novo canal de calibração (${numeroCanais}/${quantidadeCanais})`
                        : "Adicionar novo ponto de calibração"
                    }
                    disabled={
                      formData.tipoInstrumento === "multicanal" &&
                      numeroCanais >= quantidadeCanais
                    }
                  >
                    <Plus className="mr-2" />
                    {formData.tipoInstrumento === "multicanal"
                      ? `Adicionar Canal (${numeroCanais}/${quantidadeCanais})`
                      : "Adicionar Ponto"}
                  </button>
                </div>
              </div>{" "}
              {mostrarNotaCalculos && (
                <div className="bg-blue-50 p-3 rounded-md mb-4 text-sm text-blue-700 border border-blue-200 animate-fade-in shadow-sm">
                  <div className="flex items-start">
                    {" "}
                    <Calculator className="mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-bold text-blue-800">
                          Nota sobre os cálculos:
                        </p>
                        <button
                          onClick={() => setMostrarNotaCalculos(false)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          title="Fechar"
                        >
                          <EyeOff size={14} />
                        </button>
                      </div>{" "}
                      <p>
                        Cole os valores das medições em{" "}
                        <strong>massa (mg)</strong> separados por vírgulas. Os
                        valores serão automaticamente convertidos para{" "}
                        <strong>volume (µL)</strong> usando o fator Z, que varia
                        de acordo com a temperatura do ambiente.
                      </p>
                      <p>
                        <strong>Exemplo de entrada:</strong> 99.2, 99.12, 99.17,
                        99.16, 99.26
                      </p>
                      <p>Fórmula: Volume (µL) = Massa (mg) × Fator Z</p>{" "}
                      <div className="mt-2 border-t border-blue-200 pt-2">
                        <p className="font-bold text-blue-800 mb-1">
                          Cálculos realizados:
                        </p>
                        <ul className="list-disc ml-4 mt-1">
                          <li>
                            <strong>Mean Volume:</strong> Média dos volumes
                            individuais em <strong>µL</strong> (cada massa ×
                            Fator Z)
                          </li>
                          <li>
                            <strong>Accuracy:</strong> Mean Volume - Volume
                            Nominal
                          </li>
                          <li>
                            <strong>Accuracy %:</strong> (Accuracy ÷ Volume
                            Nominal) × 100
                          </li>
                          <li>
                            <strong>Precision (SD):</strong> Desvio padrão dos
                            volumes individuais
                          </li>
                          <li>
                            <strong>Precision (CV):</strong> (SD ÷ Mean Volume)
                            × 100%
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}{" "}
              <div className="space-y-6">
                {formData.tipoInstrumento === "multicanal"
                  ? // Layout para micropipeta multicanal - agrupado por canal
                    Array.from({ length: numeroCanais }, (_, canalIndex) => {
                      const canalNum = canalIndex + 1;
                      const pontosDoCanalAtual = pontosCalibra.filter(
                        (p) => p.canal === canalNum
                      );

                      return (
                        <div
                          key={`canal-${canalNum}`}
                          className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50"
                        >                          {/* Cabeçalho do canal */}
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-blue-800 flex items-center">
                              <TestTube className="mr-2" />
                              Canal {canalNum}
                              {canalNum === 1 && (
                                <span className="ml-2 text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md">
                                  Canal Mestre
                                </span>
                              )}
                            </h4>
                            {numeroCanais > 1 && (
                              <button
                                type="button"
                                className="flex items-center px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md border border-red-200 transition-colors"
                                onClick={() => {
                                  const primeiroPontoDoCanal =
                                    pontosDoCanalAtual[0];
                                  if (primeiroPontoDoCanal) {
                                    confirmarRemoverPonto(
                                      primeiroPontoDoCanal.id,
                                      canalNum,
                                      true
                                    );
                                  }
                                }}
                                title={`Remover canal ${canalNum} completo`}
                              >
                                <Trash2 className="mr-1" size={14} />
                                <span className="text-xs">Remover Canal</span>
                              </button>
                            )}
                          </div>

                          {/* Container dos 3 pontos do canal */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {pontosDoCanalAtual.map((ponto, pontoIndex) => (
                              <div
                                key={ponto.id}
                                className="border border-gray-300 rounded-md p-3 bg-white relative"
                              >
                                <div className="mb-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-600">
                                      Ponto {ponto.pontoPosicao}
                                    </span>
                                    <div className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">
                                      Canal {canalNum}
                                    </div>
                                  </div>

                                  <label
                                    className="block text-sm font-medium mb-1"
                                    style={{ color: "rgb(75, 85, 99)" }}
                                  >
                                    Volume Nominal
                                  </label>
                                  <div className="flex">
                                    <input
                                      type="text"
                                      value={ponto.volumeNominal}
                                      onChange={(e) =>
                                        handleVolumeNominalChange(
                                          ponto.id,
                                          e.target.value
                                        )
                                      }
                                      placeholder="Volume nominal"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2"
                                      style={{
                                        "--tw-ring-color": "rgb(144, 199, 45)",
                                        color: "rgb(75, 85, 99)",
                                      }}
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
                                      className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2"
                                      style={{
                                        "--tw-ring-color": "rgb(144, 199, 45)",
                                        color: "rgb(75, 85, 99)",
                                      }}
                                    >
                                      <option value="µL">µL</option>
                                      <option value="mL">mL</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="mb-3">
                                  <label
                                    className="block text-sm font-medium mb-1"
                                    style={{ color: "rgb(75, 85, 99)" }}
                                  >
                                    Medições (mg)
                                  </label>
                                  <div className="space-y-2">
                                    <textarea
                                      value={ponto.valoresTexto || ""}
                                      onChange={(e) =>
                                        handleValoresChange(
                                          ponto.id,
                                          e.target.value
                                        )
                                      }
                                      placeholder="Cole os valores separados por vírgula"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 resize-none"
                                      style={{
                                        "--tw-ring-color": "rgb(144, 199, 45)",
                                        color: "rgb(75, 85, 99)",
                                      }}
                                      rows="2"
                                    />

                                    {/* Mostrar os valores processados */}
                                    {ponto.medicoes.some((m) => m !== "") && (
                                      <div className="mt-2">
                                        <div className="text-xs text-gray-500 mb-1">
                                          Valores detectados:
                                        </div>
                                        <div className="grid grid-cols-3 gap-1">
                                          {ponto.medicoes
                                            .slice(0, 6)
                                            .map((medicao, index) => (
                                              <div
                                                key={index}
                                                className={`px-1 py-1 text-xs rounded text-center ${
                                                  medicao !== ""
                                                    ? "bg-green-100 text-green-800 border border-green-200"
                                                    : "bg-gray-100 text-gray-400 border border-gray-200"
                                                }`}
                                              >
                                                {medicao !== ""
                                                  ? medicao
                                                  : `M${index + 1}`}
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Resultados dos cálculos */}
                                {ponto.media !== null && (
                                  <div className="bg-gray-50 p-2 rounded-md">
                                    <h5 className="font-medium mb-2 text-xs text-gray-700">
                                      Resultados
                                    </h5>
                                    <div className="space-y-2 text-xs">
                                      <div className="p-2 bg-white rounded shadow-sm border border-gray-200">
                                        <div className="text-xs text-gray-500 mb-1">
                                          Mean Volume
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">
                                            {ponto.mediaMassa?.toFixed(2)} mg
                                          </span>
                                          <span className="text-green-600 font-medium">
                                            {ponto.media?.toFixed(2)} µL
                                          </span>
                                        </div>
                                      </div>
                                      <div className="p-2 bg-white rounded shadow-sm border border-gray-200">
                                        <div className="text-xs text-gray-500 mb-1">
                                          Accuracy
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">
                                            {ponto.inexatidao?.toFixed(2)} µL
                                          </span>
                                          <span
                                            className={
                                              Math.abs(
                                                ponto.inexatidaoPercentual
                                              ) > 5
                                                ? "text-red-600 font-medium"
                                                : "text-green-600 font-medium"
                                            }
                                          >
                                            {ponto.inexatidaoPercentual?.toFixed(
                                              2
                                            )}
                                            %
                                          </span>
                                        </div>
                                      </div>
                                      <div className="p-2 bg-white rounded shadow-sm border border-gray-200">
                                        <div className="text-xs text-gray-500 mb-1">
                                          Precision
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">
                                            SD: {ponto.desvioPadrao?.toFixed(2)}
                                          </span>
                                          <span className="text-blue-600 font-medium">
                                            CV:{" "}
                                            {ponto.coeficienteVariacao?.toFixed(
                                              2
                                            )}
                                            %
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
                      );
                    })
                  : // Layout para micropipeta monocanal - layout original
                    pontosCalibra.map((ponto, pontoIndex) => (
                      <div
                        key={ponto.id}
                        className="border border-gray-300 rounded-md p-3 bg-white relative"
                      >
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex-1 min-w-[200px]">
                            <label
                              className="block text-sm font-medium mb-1"
                              style={{ color: "rgb(75, 85, 99)" }}
                            >
                              Volume Nominal
                            </label>
                            <div className="flex">
                              <input
                                type="text"
                                value={ponto.volumeNominal}
                                onChange={(e) =>
                                  handleVolumeNominalChange(
                                    ponto.id,
                                    e.target.value
                                  )
                                }
                                placeholder="Volume nominal"
                                className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2"
                                style={{
                                  "--tw-ring-color": "rgb(144, 199, 45)",
                                  color: "rgb(75, 85, 99)",
                                }}
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
                                className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2"
                                style={{
                                  "--tw-ring-color": "rgb(144, 199, 45)",
                                  color: "rgb(75, 85, 99)",
                                }}
                              >
                                <option value="µL">µL</option>
                                <option value="mL">mL</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="px-3 py-2 rounded-md bg-gray-100 text-center border border-gray-200">
                              <span className="text-xs text-gray-500">
                                Ponto #{pontoIndex + 1}
                              </span>
                            </div>

                            {pontosCalibra.length > 1 && (
                              <button
                                type="button"
                                className="flex items-center px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md border border-red-200 transition-colors"
                                onClick={() =>
                                  confirmarRemoverPonto(
                                    ponto.id,
                                    pontoIndex + 1
                                  )
                                }
                                title="Remover ponto de calibração"
                              >
                                <Trash2 className="mr-1" />
                                <span className="text-xs">Remover</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="mb-4">
                          <label
                            className="block text-sm font-medium mb-1"
                            style={{ color: "rgb(75, 85, 99)" }}
                          >
                            Medições (mg)
                          </label>
                          <div className="space-y-2">
                            <textarea
                              value={ponto.valoresTexto || ""}
                              onChange={(e) =>
                                handleValoresChange(ponto.id, e.target.value)
                              }
                              placeholder="Cole os valores separados por vírgula. Ex: 99.2, 99.12, 99.17, 99.16, 99.26"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 resize-none"
                              style={{
                                "--tw-ring-color": "rgb(144, 199, 45)",
                                color: "rgb(75, 85, 99)",
                              }}
                              rows="3"
                            />
                            <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded border border-blue-200">
                              <strong>💡 Dica:</strong> Copie os valores do
                              Notion e cole aqui.
                            </div>

                            {/* Mostrar os valores processados */}
                            {ponto.medicoes.some((m) => m !== "") && (
                              <div className="mt-2">
                                <div className="text-xs text-gray-500 mb-1">
                                  Valores detectados:
                                </div>
                                <div className="grid grid-cols-5 gap-1">
                                  {ponto.medicoes
                                    .slice(0, 10)
                                    .map((medicao, index) => (
                                      <div
                                        key={index}
                                        className={`px-2 py-1 text-xs rounded text-center ${
                                          medicao !== ""
                                            ? "bg-green-100 text-green-800 border border-green-200"
                                            : "bg-gray-100 text-gray-400 border border-gray-200"
                                        }`}
                                      >
                                        {medicao !== ""
                                          ? medicao
                                          : `M${index + 1}`}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Resultados dos cálculos */}
                        {ponto.media !== null && (
                          <div className="bg-gray-50 p-3 rounded-md">
                            <h4
                              className="font-medium mb-2 flex items-center py-1.5 px-2 border-l-4"
                              style={{
                                color: "rgb(75, 85, 99)",
                                borderLeftColor: "rgb(144, 199, 45)",
                              }}
                            >
                              <Calculator
                                className="mr-2"
                                style={{ color: "rgb(144, 199, 45)" }}
                              />
                              Resultados
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                              <div className="p-2 bg-white rounded shadow-sm border border-gray-200">
                                <div className="text-xs text-gray-500 mb-1">
                                  Mean Volume
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    {ponto.mediaMassa?.toFixed(2)} mg
                                  </span>
                                  <span className="text-green-600 font-medium">
                                    {ponto.media?.toFixed(2)} µL
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Massa média × Fator Z
                                </div>
                              </div>
                              <div className="p-2 bg-white rounded shadow-sm border border-gray-200">
                                <div className="text-xs text-gray-500 mb-1">
                                  Accuracy
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    {ponto.inexatidao?.toFixed(2)} µL
                                  </span>
                                  <span
                                    className={
                                      Math.abs(ponto.inexatidaoPercentual) > 5
                                        ? "text-red-600 font-medium"
                                        : "text-green-600 font-medium"
                                    }
                                  >
                                    {ponto.inexatidaoPercentual?.toFixed(2)}%
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Mean Volume - Volume Nominal
                                </div>
                              </div>
                              <div className="p-2 bg-white rounded shadow-sm border border-gray-200">
                                <div className="text-xs text-gray-500 mb-1">
                                  Precision
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    SD: {ponto.desvioPadrao?.toFixed(2)} µL
                                  </span>
                                  <span className="text-blue-600 font-medium">
                                    CV: {ponto.coeficienteVariacao?.toFixed(2)}%
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Desvio padrão e coeficiente de variação
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
              </div>
            </div>{" "}
            <div className="flex justify-end">
              <button
                type="submit"
                className="text-white px-6 py-2 rounded-md focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "rgb(144, 199, 45)",
                  "--tw-ring-color": "rgb(144, 199, 45)",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "rgb(130, 180, 40)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "rgb(144, 199, 45)")
                }
              >
                Gerar Certificado
              </button>
            </div>
            {/* Diálogo de confirmação para remoção de ponto */}{" "}
            <ConfirmDialog
              isOpen={confirmDialog.isOpen}
              title={confirmDialog.title}
              message={confirmDialog.message}
              onCancel={(e) => {
                e.preventDefault(); // Evita o submit do formulário
                setConfirmDialog({ ...confirmDialog, isOpen: false });
              }}
              onConfirm={(e) => {
                e.preventDefault(); // Evita o submit do formulário
                removerPonto(confirmDialog.pontoId);
                setConfirmDialog({ ...confirmDialog, isOpen: false });
              }}
            />{" "}
          </form>
        )}
      </div>
    </div>
  );
};

export default EmitirCertificadoPage;
