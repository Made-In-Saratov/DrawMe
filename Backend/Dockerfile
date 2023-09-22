FROM ubuntu:latest AS build

RUN apt-get update
RUN apt-get install openjdk-17-jdk -y
COPY . .

RUN .\gradlew bootJar --no-daemon

FROM bellsoft/liberica-openjdk-alpine:17

EXPOSE 8080

COPY --from=build /build/libs/Backend-0.0.1.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]