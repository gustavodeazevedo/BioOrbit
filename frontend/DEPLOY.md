# Deploy Frontend na Vercel

## Configuração Automática

Este projeto está configurado para deploy automático na Vercel usando o arquivo `vercel.json`.

## Passos para Deploy:

### 1. **Via Git (Recomendado)**

1. Faça push do código para o GitHub
2. Conecte seu repositório na Vercel
3. A Vercel detectará automaticamente o `vercel.json` e fará o deploy

### 2. **Via CLI da Vercel**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Na pasta raiz do projeto
vercel

# Para deploy de produção
vercel --prod
```

## Configurações da Vercel:

- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Variáveis de Ambiente:

Configure na Vercel dashboard:

- `VITE_API_URL`: https://bioorbit.onrender.com/api

## URLs:

- **Backend**: https://bioorbit.onrender.com
- **Frontend**: https://[seu-projeto].vercel.app

## Estrutura de Build:

```
frontend/
├── dist/           # Output do build
├── src/           # Código fonte React
├── package.json   # Dependências
└── vite.config.js # Configurações do Vite
```
