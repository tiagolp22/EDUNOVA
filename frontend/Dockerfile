# Usar uma imagem oficial do Node.js para desenvolvimento
FROM node:18

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar os arquivos de dependências para o contêiner
COPY package.json package-lock.json ./

# Instalar as dependências do React
RUN npm install

# Copiar o restante do código da aplicação para o contêiner
COPY . .

# Expor a porta 3000 (a porta padrão usada pelo servidor de desenvolvimento do React)
EXPOSE 3000

# Comando para iniciar o servidor de desenvolvimento do React
CMD ["npm", "start"]
