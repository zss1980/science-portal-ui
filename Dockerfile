FROM eclipse-temurin:11-alpine AS base

FROM base AS builder
COPY . /science-portal
WORKDIR /science-portal
RUN ./gradlew clean spotlessCheck build test --no-daemon

FROM images.opencadc.org/library/cadc-tomcat:1.3 AS production

RUN mkdir -p /usr/share/tomcat/config

COPY --from=builder /science-portal/build/libs/science-portal.war /usr/share/tomcat/webapps/
COPY --from=builder /science-portal/org.opencadc.science-portal.properties /usr/share/tomcat/config/
