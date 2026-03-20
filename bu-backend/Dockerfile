# Etapa 1: Build
FROM maven:3.9.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY pom.xml .

# Descargar dependencias
RUN mvn dependency:resolve

# Copiar código fuente
COPY src src

# Compilar aplicación
RUN mvn clean package -DskipTests

# Etapa 2: Runtime
FROM eclipse-temurin:17-jre

WORKDIR /app

# Instalar curl para health checks
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Copiar JAR desde la etapa de build
COPY --from=builder /app/target/*.jar app.jar

# Crear usuario no-root
RUN addgroup --system spring && adduser --system spring --ingroup spring --disabled-password
USER spring:spring

# Exponer puerto
EXPOSE 8080

# Variables de entorno
ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENV SPRING_PROFILES_ACTIVE=docker

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Comando de inicio
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]