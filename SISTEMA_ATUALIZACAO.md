# Sistema de Notificação de Atualização - BioOrbit

## Visão Geral

O BioOrbit agora inclui um sistema automatizado de notificação de atualizações que força os usuários a recarregar a página quando uma nova versão da aplicação é implantada.

## Como Funciona

### 1. Geração de Versão
- Durante o processo de build (`npm run build`), um hash único é gerado baseado no commit Git atual
- Este hash é salvo em um arquivo `version.json` que é incluído nos assets estáticos
- O arquivo contém informações como hash do commit, timestamp e tempo de build

### 2. Verificação de Versão
- A aplicação carrega a versão atual ao inicializar
- A cada 5 minutos (configurável), verifica se há uma nova versão disponível
- Compara o hash da versão atual com o hash no servidor

### 3. Notificação ao Usuário
- Quando uma nova versão é detectada, um modal aparece imediatamente
- O modal não pode ser fechado - força o usuário a atualizar
- Mostra a versão atual vs nova versão para transparência
- Botão "Atualizar página" recarrega a aplicação

## Arquivos Criados/Modificados

### Novos Arquivos:
- `frontend/scripts/generate-version.js` - Script para gerar hash de versão
- `frontend/src/services/versionService.js` - Serviço de verificação de versão
- `frontend/src/components/VersionUpdateNotification.jsx` - Componente do modal
- `frontend/src/hooks/useVersionUpdate.js` - Hook para gerenciar atualizações

### Arquivos Modificados:
- `frontend/package.json` - Adicionado script `prebuild`
- `frontend/src/App.jsx` - Integração do sistema de versão
- `frontend/src/index.jsx` - Comentário sobre inicialização

## Configuração

### Intervalo de Verificação
Por padrão, a verificação ocorre a cada 5 minutos. Para alterar:

```javascript
// Em App.jsx
const { isUpdateAvailable, /* ... */ } = useVersionUpdate({
  checkInterval: 3 * 60 * 1000, // 3 minutos
  autoStart: true
});
```

### Desabilitar em Desenvolvimento
O sistema funciona automaticamente em produção. Em desenvolvimento, é seguro ignorar as notificações.

## Benefícios

1. **Atualizações Forçadas**: Usuários não ficam com versões desatualizadas
2. **Transparência**: Mostra claramente qual versão está sendo usada
3. **Automático**: Funciona sem intervenção manual após implantação
4. **Confiável**: Baseado em hash Git para identificação única de versões

## Fluxo de Implantação

1. Desenvolvedor faz commit das mudanças
2. CI/CD executa `npm run build` (que gera nova version.json)
3. Nova versão é implantada no servidor
4. Usuários com BioOrbit aberto recebem notificação automaticamente
5. Usuários clicam "Atualizar página" e obtêm a nova versão

## Monitoramento

O sistema registra logs no console do navegador:
- Inicialização do serviço de versão
- Detecção de novas versões
- Início/parada da verificação periódica

Exemplo de logs:
```
Version service initialized: d79ba646
Version checking started (interval: 300s)
New version detected: {current: d79ba646, latest: abcd1234}
```