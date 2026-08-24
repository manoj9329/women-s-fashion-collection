FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

COPY backend/pom.xml .
COPY backend/src ./src

RUN apk add --no-cache maven && mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=build /app/target/womens-fashion-collection-1.0.0.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]