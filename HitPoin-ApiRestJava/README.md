# Java & Next.js Full-Stack Project

![Java Logo]([https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg](https://th.bing.com/th/id/OIP.n8pa_ux7uUyU9CJrzb1scAHaHa?rs=1&pid=ImgDetMain))
![Next.js Logo]([https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg](https://th.bing.com/th/id/OIP.rwaT41zwdT7cYK_prF8etAHaFj?rs=1&pid=ImgDetMain))

Este projeto utiliza **Java** no backend com Spring Boot e **Next.js** no frontend para criar uma aplicação full-stack robusta. A aplicação é estruturada para fornecer um sistema de autenticação, operações de CRUD e funcionalidades de upload de imagens para perfis de usuário.

---

## Tecnologias Utilizadas

- **Backend**: Java (Spring Boot)
- **Frontend**: Next.js
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT com OAuth2
- **Upload de Imagens**: Armazenamento local com suporte para caminho dinâmico

---

## Rotas da API

Aqui estão as rotas principais da API para interagir com o backend.

### Autenticação

- **POST /auth/Login**
  - **Descrição**: Autenticação de usuário com email e senha.
  - **Parâmetros**:
    - `email`: String
    - `password`: String
  - **Retorno**: Retorna um token de acesso JWT.

- **GET /auth/profile**
  - **Descrição**: Obtém o perfil do usuário autenticado.
  - **Cabeçalho**: `Authorization: Bearer <token>`
  - **Retorno**: Informações do usuário, incluindo `username`, `email`, `roles`, `cargaHoraria`, `cargo`, e `imagePath`.

### Usuários

- **POST /usuarios/CreateUser**
  - **Descrição**: Cria um novo usuário.
  - **Parâmetros**:
    - `username`: String
    - `email`: String
    - `password`: String
  - **Retorno**: Dados do usuário recém-criado.

- **GET /usuarios/allUsers**
  - **Descrição**: Retorna todos os usuários cadastrados no sistema.
  - **Cabeçalho**: `Authorization: Bearer <token>`
  - **Retorno**: Lista de todos os usuários com seus respectivos dados.

### Upload de Imagens

- **POST /usuarios/imageUpload**
  - **Descrição**: Faz upload de uma imagem de perfil para o usuário autenticado.
  - **Cabeçalho**: `Authorization: Bearer <token>`
  - **Parâmetros**:
    - `file`: Arquivo de imagem (multipart/form-data)
  - **Retorno**: Caminho da imagem salva no servidor.

---

## Estrutura do Projeto

```plaintext
|-- src/
|   |-- main/
|   |   |-- java/
|   |   |   |-- com.example.project/
|   |   |   |   |-- controller/       # Controladores de API (ex.: UserController)
|   |   |   |   |-- model/            # Modelos de dados (ex.: User, Role)
|   |   |   |   |-- repository/       # Repositórios JPA (ex.: UserRepository)
|   |   |   |   |-- service/          # Serviços de negócios (ex.: UserService)
|   |   |   |   |-- config/           # Configurações (ex.: SecurityConfig, CorsConfig)
|   |-- resources/
|       |-- application.properties    # Configurações da aplicação
|
|-- frontend/
|   |-- pages/
|   |   |-- index.tsx                 # Página inicial do Next.js
|   |   |-- profile.tsx               # Página de perfil do usuário
|   |-- api/
|       |-- auth/
|           |-- [...nextauth].ts      # Configurações de autenticação do NextAuth.js
