FROM node:alpine

# 2. Definir o diretório de trabalho dentro do container
WORKDIR /app

# 3. Copiar os ficheiros de dependência do backend
# O ponto '.' refere-se ao contexto do build, que será a pasta 'backend'
COPY package*.json ./

# 4. Instalar apenas as dependências de produção para uma imagem mais leve
RUN npm install --omit=dev

# 5. Copiar todo o resto do código do backend para o container
COPY . .

# 6. Expor a porta em que o servidor irá rodar
EXPOSE 8004

# 7. O comando para iniciar o servidor
CMD [ "node", "server.js" ]
