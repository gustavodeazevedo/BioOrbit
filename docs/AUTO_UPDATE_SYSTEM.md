# Auto-Update Notification System

Este sistema notifica automaticamente os usuários quando uma nova versão do BioOrbit está disponível, resolvendo o problema de usuários que mantêm a aplicação aberta em abas do navegador sem receber atualizações.

## Como Funciona

### Backend
- **Endpoint de Versão**: `/api/version` retorna informações da versão atual incluindo:
  - Hash do commit Git
  - Branch atual
  - Timestamp de build
  - Versão da aplicação

### Frontend
- **Verificação Periódica**: Verifica por novas versões a cada 5 minutos
- **Comparação de Versões**: Compara a versão local armazenada com a versão do servidor
- **Notificação Visual**: Exibe uma barra de notificação azul no topo da página quando uma nova versão é detectada
- **Atualização Forçada**: Permite ao usuário atualizar imediatamente ou ignorar a notificação

## Arquivos Modificados

### Backend
- `backend/src/routes/version.js` - Nova rota para informações de versão
- `backend/src/server.js` - Adicionada rota `/api/version`

### Frontend
- `frontend/src/services/versionService.js` - Serviço para verificação de versões
- `frontend/src/contexts/VersionContext.jsx` - Context para gerenciar estado de versão
- `frontend/src/components/UpdateNotification.jsx` - Componente de notificação
- `frontend/src/App.jsx` - Integração dos providers e componente de notificação

## Configuração

### Variáveis de Ambiente
- `VITE_API_URL` - URL base da API (frontend)
- `BUILD_NUMBER` - Número do build (backend, opcional)

### Personalização
- **Frequência de Verificação**: Modificar o intervalo em `VersionContext.jsx` (padrão: 5 minutos)
- **Estilo da Notificação**: Modificar `UpdateNotification.jsx` para alterar aparência
- **Fallback**: O sistema funciona mesmo se a API não estiver disponível

## Comportamento

1. **Primeira Visita**: Salva a versão atual no localStorage
2. **Verificações Periódicas**: Consulta a API a cada 5 minutos
3. **Nova Versão Detectada**: Exibe notificação com opções:
   - **"Atualizar Agora"**: Recarrega a página imediatamente
   - **"Ignorar"**: Remove a notificação e atualiza a versão local
4. **Recarregamento**: Limpa o localStorage e recarrega a página para garantir a versão mais recente

## Benefícios

- ✅ **Usuários sempre atualizados**: Força atualizações quando necessário
- ✅ **Experiência não intrusiva**: Permite ao usuário escolher quando atualizar
- ✅ **Detecção automática**: Funciona sem intervenção manual
- ✅ **Tolerante a falhas**: Funciona mesmo se a API estiver temporariamente indisponível
- ✅ **Deployment agnóstico**: Funciona com qualquer sistema de deployment