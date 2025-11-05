# 🚀 IAgiliza – Full Stack Chat App

Aplicação **Full Stack** desenvolvida como **teste técnico**, com autenticação JWT, múltiplos chats por usuário e respostas automáticas simuladas de uma IA.  
O projeto foi construído com foco em **organização**, **boas práticas** e **integração total entre frontend e backend via Docker**.

---

## 🧭 Visão Geral

O **IAgiliza** é um aplicativo que integra autenticação, chats independentes e armazenamento persistente de mensagens, com interface moderna e responsiva.

**Stack principal:**
- **Backend:** Fastify + Prisma + PostgreSQL + JWT  
- **Frontend:** React + Vite + TailwindCSS + Shadcn UI  
- **Infraestrutura:** Docker + Docker Compose  

---

## 🧱 Funcionalidades

### 🖥️ Backend (Fastify + Prisma)

#### 🔐 Autenticação
- Registro e login de usuários (`/register`, `/login`)
- Criptografia de senhas com **bcrypt**
- Geração e validação de **token JWT**
- Acesso autenticado via **middleware**

#### 💬 Chats e Mensagens
- `/chats` → cria e lista chats por usuário
- `/messages` → adiciona novas mensagens e gera resposta automática “fake” da IA
- Persistência completa no banco PostgreSQL via **Prisma ORM**

#### 🗄️ Banco de Dados
- Modelos principais: `User`, `Chat`, `Message`
- Relações 1:N entre usuários, chats e mensagens

---

### 🌐 Frontend (React + Vite + Tailwind + Shadcn UI)

#### 📄 Páginas Implementadas
- **Login / Register:** autenticação completa com integração ao backend  
- **Landing Page:** acesso à área autenticada  
- **Chat Page:** histórico completo das conversas e respostas da IA  
- **Profile Page:** exibição e edição de dados do usuário  

#### ⚙️ Funcionalidades
- Autenticação persistente com **LocalStorage**
- Requisições via **Axios**
- Componentização com **Shadcn UI**
- Layout moderno e responsivo (TailwindCSS)

---

## 🐳 Como Rodar com Docker

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/seuusuario/IAgiliza.git
cd IAgiliza
```

---

### 2️⃣ Configurar variáveis de ambiente
Crie um arquivo `.env` dentro da pasta **backend/** com o seguinte conteúdo:
```bash
DATABASE_URL="postgresql://postgres:postgres@db:5432/iagiliza"
JWT_SECRET="sua_chave_jwt_aqui"
```

E outro arquivo `.env` dentro da pasta **frontend/** com:
```bash
VITE_API_URL="http://localhost:3333"
```

Essas variáveis permitem que o backend e o frontend se comuniquem entre si e com o banco de dados PostgreSQL dentro do ambiente Docker.

---

### 3️⃣ Subir os containers
```bash
docker-compose up --build
```

Esse comando:
- Cria e inicia os containers do **backend**, **frontend** e **PostgreSQL**
- Instala dependências automaticamente  
- Sobe a aplicação com os serviços já integrados

---

### 4️⃣ Acessar a aplicação
Após o build, a aplicação estará disponível em:

- 🌐 **Frontend:** [http://localhost:5173](http://localhost:5173)  
- 🧠 **Backend (API):** [http://localhost:3333](http://localhost:3333)

O login e o cadastro já estarão ativos, assim como o fluxo completo de criação de chats e mensagens.

---

### 5️⃣ Rodar migrations (se necessário)
Se o banco ainda não tiver sido inicializado, rode:
```bash
docker exec -it agiliza_backend npx prisma migrate deploy
```

Isso aplicará o schema do Prisma dentro do container PostgreSQL, garantindo a criação das tabelas `User`, `Chat` e `Message`.

---

### 6️⃣ Comandos úteis
```bash
# Parar todos os containers
docker-compose down

# Reconstruir containers (após alterações)
docker-compose up --build

# Acessar o terminal do backend
docker exec -it agiliza_backend sh

# Visualizar o banco de dados no Prisma Studio
docker exec -it agiliza_backend npx prisma studio
```

---

### 7️⃣ Estrutura dos serviços Docker

| Serviço   | Descrição                                    | Porta Local |
|------------|----------------------------------------------|--------------|
| **backend**  | API Fastify + Prisma + JWT                  | 3333 |
| **frontend** | Interface React + Vite + Tailwind + Shadcn UI | 5173 |
| **db**       | Banco PostgreSQL persistido em volume interno | 5432 |

---

Após a inicialização, o **IAgiliza** estará completamente funcional no ambiente Docker, com frontend, backend e banco de dados integrados, prontos para uso e persistência total das informações.
