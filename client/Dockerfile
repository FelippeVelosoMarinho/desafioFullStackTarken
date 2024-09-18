# Etapa 1: Construir a aplicação com Node.js
FROM node:18-alpine as builder

# Define o diretório de trabalho como /app
WORKDIR /app

# Copia apenas os arquivos necessários para instalar dependências
COPY package*.json ./

# Instala as dependências da aplicação
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Builda o aplicativo
RUN npm run build