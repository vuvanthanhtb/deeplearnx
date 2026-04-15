# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml .
COPY deeplearnx-api/pom.xml deeplearnx-api/
COPY deeplearnx-application/pom.xml deeplearnx-application/
COPY deeplearnx-core/pom.xml deeplearnx-core/
COPY deeplearnx-domain/pom.xml deeplearnx-domain/
COPY deeplearnx-infrastructure/pom.xml deeplearnx-infrastructure/
COPY deeplearnx-start/pom.xml deeplearnx-start/

RUN mvn dependency:go-offline -B

COPY . .

RUN mvn clean package -DskipTests -B

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=builder /app/deeplearnx-start/target/*.jar app.jar

EXPOSE 9000

ENTRYPOINT ["java", "-jar", "app.jar"]
