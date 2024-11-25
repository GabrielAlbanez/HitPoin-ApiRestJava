# Imagem base do Maven para compilar o projeto
FROM maven:3.8-openjdk-17 AS build

# Define o diretório de trabalho para o build
WORKDIR /app

# Copia o código do projeto para dentro do contêiner
COPY . .

# Compila o projeto e gera o .jar
RUN mvn clean package -DskipTests

# Imagem base do Java para rodar o servidor
FROM openjdk:17-jdk-slim

# Define o diretório de trabalho para o runtime
WORKDIR /app

# Copia o .jar gerado no estágio de build
COPY --from=build /app/target/springPonto-0.0.1-SNAPSHOT.jar app.jar

# Copia a pasta de uploads para o contêiner
COPY ./HitPoint/uploads/images /app/uploads/images

# Comando para rodar o servidor
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
