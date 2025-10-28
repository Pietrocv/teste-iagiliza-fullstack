# Traduzir os comentários sobre a dockerização após a finalização do projeto

# imagem base compatível com Prisma e OpenSSL
FROM node:20-slim

# instala openssl e dependências do sistema
RUN apt-get update -y && apt-get install -y openssl

# define diretório de trabalho
WORKDIR /app

# copia e instala dependências
COPY package*.json ./
RUN npm ci

# copia o restante do códigodocker compose build backend --no-cache
COPY . .

# gera o Prisma Client dentro do container
RUN npx prisma generate

# expõe a porta do Fastify
EXPOSE 3333

# comando padrão de inicialização
CMD ["npm", "run", "dev"]

