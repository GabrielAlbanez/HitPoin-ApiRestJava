
# Ponto Fácil

Ponto Fácil é uma aplicação web desenvolvida para facilitar o registro de pontos de funcionários em empresas. A plataforma permite que os usuários registrem seus horários de **entrada**, **pausa**, **retorno** e **saída** de forma intuitiva e eficiente.

## 📌 Funcionalidades

- **Registro de Ponto**:  
  Os usuários podem registrar seus horários de entrada, pausa, retorno e saída diretamente na plataforma.
  
- **Autenticação de Usuários**:  
  Sistema de login seguro para garantir que apenas usuários autorizados acessem a aplicação.

- **Gestão de Usuários**:  
  Administradores podem gerenciar contas de usuários, incluindo criação, edição e exclusão.

- **Visualização de Registros**:  
  Usuários podem visualizar seus registros de ponto anteriores.

- **Notificações em Tempo Real**:  
  Implementação de WebSocket para notificações instantâneas sobre o status dos usuários.

---
## 📂 Estrutura de Pastas

### Frontend (ponto-facil/web)
  ponto-facil/web
  ├── .next               # Arquivos gerados durante o build do Next.js
  ├── .vscode             # Configurações do Visual Studio Code
  ├── app                  # Diretório principal do Next.js (páginas e rotas)
  ├── components            # Componentes reutilizáveis da interface
  ├── config                # Configurações globais do frontend
  ├── images                # Recursos de imagem do projeto
  ├── icons               # Ícones utilizados no projeto
  ├── node_modules        # Dependências do projeto
  ├── public              # Arquivos públicos, como imagens e fontes
  ├── styles              # Estilos globais e específicos do projeto
  ├── types               # Tipos TypeScript personalizados
  ├── .env                # Arquivo de variáveis de ambiente
  ├── .eslintignore       # Configurações de exclusão do ESLint
  ├── .gitignore          # Arquivos e pastas ignorados pelo Git
  ├── LICENSE             # Licença do projeto
  ├── middleware.ts       # Middlewares para controle de rotas
  ├── package.json        # Dependências e scripts do projeto
  ├── README.md           # Documentação do frontend
  ├── tailwind.config.js  # Configuração do Tailwind CSS
  └── tsconfig.json       # Configuração do TypeScript

  ### Backend (HitPoin-ApiRestJava)

HitPoin-ApiRestJava
├── mvnw                # Wrapper do Maven
├── src                 # Código-fonte principal
│   ├── main
│   │   ├── java/tech/buildrun/springponto
│   │   │   ├── config      # Configurações do projeto
│   │   │   ├── controller  # Controladores REST
│   │   │   ├── entities    # Classes das entidades do banco de dados
│   │   │   ├── repository  # Interfaces de acesso ao banco
│   │   │   └── services    # Regras de negócio e lógica do backend
│   │   └── resources       # Recursos estáticos e propriedades
│   │       ├── app.key     # Chave de autenticação
│   │       ├── app.pub     # Chave pública de autenticação
│   │       ├── application.properties # Configurações do Spring Boot
│   │       └── data.sql    # Script de inicialização do banco de dados
│   └── test                # Testes unitários e de integração
├── target              # Diretório gerado pelo Maven após o build
├── Dockerfile          # Arquivo para criação de imagem Docker
├── pom.xml             # Configurações e dependências do Maven
└── README.md           # Documentação do backend




---

## 🛠️ Tecnologias Utilizadas

- **Backend**:  
  Java com Spring Boot para construção de APIs RESTful.
  
- **Frontend**:  
  Next.js com TypeScript para desenvolvimento da interface do usuário.
  
- **Banco de Dados**:  
  Utilização de JPA/Hibernate para persistência de dados.
  
- **Autenticação**:  
  NextAuth.js para gerenciamento de sessões e autenticação de usuários.
  
- **WebSocket**:  
  Stomp.js e SockJS para comunicação em tempo real.

---

## 👥 Equipe de Desenvolvimento

| Nome        | GitHub                                    |
|-------------|-------------------------------------------|
| **Caio**    | [GitHub](https://github.com/caio)         |
| **Gabriel** | [GitHub](https://github.com/GabrielAlbanez) |
| **Fernando**| [GitHub](https://github.com/fernando)     |
| **Kaique**  | [GitHub](https://github.com/kaique)       |

---

## 🌐 Acesso à Aplicação

A aplicação está disponível publicamente e pode ser acessada através do seguinte link:  
[**Ponto Fácil**](https://hit-poin-api-rest-java.vercel.app/)

---

## ⚙️ Como Executar o Projeto Localmente

### 1. **Clone o Repositório**
```bash
git clone https://github.com/GabrielAlbanez/HitPoin-ApiRestJava.git
```

### 2. **Backend**
- Navegue até o diretório do backend:
  ```bash
  cd HitPoin-ApiRestJava/HitPoin-ApiRestJava
  ```
- Compile e execute a aplicação Spring Boot:
  ```bash
  ./mvnw spring-boot:run
  ```

### 3. **Frontend**
- Navegue até o diretório do frontend:
  ```bash
  cd ponto-facil/web
  ```
- Instale as dependências:
  ```bash
  npm install
  ```
- Inicie o servidor de desenvolvimento:
  ```bash
  npm run dev
  ```

---

## 🐳 Deploy com Docker

### 1. **Criar a Imagem Docker**
No diretório raiz do projeto:
```bash
docker build -t hitpoint-backend .
```

### 2. **Rodar o Contêiner**
```bash
docker run -p 8080:8080 hitpoint-backend
```

### 3. **Deploy para o Registro Docker**
Caso utilize um registro Docker (como Docker Hub):
```bash
docker tag hitpoint-backend <seu-usuario>/hitpoint-backend:latest
docker push <seu-usuario>/hitpoint-backend:latest
```

---

## 🤝 Contribuição

Contribuições são bem-vindas!  
Siga os passos abaixo para contribuir com o projeto:

1. Faça um **fork** do repositório.
2. Crie uma **branch** para sua feature ou correção:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça o commit das suas alterações:
   ```bash
   git commit -m "Minha nova feature"
   ```
4. Faça o push para a sua branch:
   ```bash
   git push origin minha-feature
   ```
5. Abra um **pull request** no repositório original.

---

## 📜 Licença

Este projeto está licenciado sob a Licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
