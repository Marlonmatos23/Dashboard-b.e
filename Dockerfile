# Estágio 1: Build da aplicação React
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala todas as dependências (incluindo as de desenvolvimento para o build)
RUN npm install

# Copia o resto do código fonte
COPY . .

# Executa o comando de build (cria a pasta dist)
RUN npm run build

# Estágio 2: Servidor de Produção (leve)
FROM node:20-alpine

WORKDIR /app

# Copia o package.json novamente para instalar apenas dependências de produção (express, etc)
COPY package*.json ./
RUN npm install --omit=dev

# Copia a pasta 'dist' GERADA no estágio anterior para este novo estágio
COPY --from=builder /app/dist ./dist

# Copia o servidor web simples
COPY server.cjs .

# Expõe a porta interna
EXPOSE 8002

# Inicia o servidor
CMD ["node", "server.cjs"]