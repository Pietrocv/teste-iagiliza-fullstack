FROM node:20-alpine

# Traduzir os comentários sobre a dockerização após a finalização do projeto

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de manifesto primeiro (para cache mais eficiente)
COPY package*.json ./

# Instala as dependências
RUN npm ci

# Copia o restante do código-fonte
COPY . .

# Gera o client do Prisma
RUN npx prisma generate

# Expõe a porta do Fastify
EXPOSE 3333

# Comando padrão para rodar o servidor
CMD ["npm", "run", "dev"]
