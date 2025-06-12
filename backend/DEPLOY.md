# Deploy no Render - Backend

## Configuração Automática

Este projeto está configurado para deploy automático no Render usando o arquivo `render.yaml`.

## Passos para Deploy:

1. Faça push do código para o GitHub
2. Conecte seu repositório no Render
3. O Render detectará automaticamente o arquivo `render.yaml` e fará o deploy

## Variáveis de Ambiente Necessárias:

- `NODE_ENV`: production (configurado automaticamente)
- `MONGODB_URI`: Conexão com MongoDB Atlas
- `JWT_SECRET`: Chave secreta para JWT (gerada automaticamente pelo Render)
- `PORT`: Porta do servidor (configurada automaticamente pelo Render)

## Endpoints:

- **Health Check**: `GET /health`
- **API Base**: `GET /`
- **Todas as rotas da API**: `/api/*`

## Monitoramento:

O Render irá monitorar automaticamente o endpoint `/health` para verificar se o serviço está funcionando.
