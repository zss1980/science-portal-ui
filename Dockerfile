FROM gradle:8-jdk21 AS base
ARG NODE_VERSION=v22.11.0
ARG NVM_DIR=/nvm
ARG NVM_VERSION=v0.40.0

FROM base AS builder
ARG NODE_VERSION=v22.11.0
ARG NVM_DIR=/nvm
ARG NVM_VERSION=v0.40.0

RUN \
    mkdir -p ${NVM_DIR} \
    # installs nvm (Node Version Manager)
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh | bash \
    # download and install Node.js (you may need to restart the terminal)
    && . ${NVM_DIR}/nvm.sh \
    && nvm install ${NODE_VERSION} \
    # verifies the right Node.js version is in the environment
    && node -v # should print `v22.11.0` \
    # verifies the right npm version is in the environment
    && npm -v # should print `10.9.0`
COPY . /science-portal
WORKDIR /science-portal

# Disable the spotless check until the entire codebase is formatted
RUN \
    . ${NVM_DIR}/nvm.sh \
    && gradle -i clean build test -x spotlessCheck --no-daemon

FROM images.opencadc.org/library/cadc-tomcat:1.3 AS production

RUN mkdir -p /usr/share/tomcat/config

COPY --from=builder /science-portal/build/libs/science-portal.war /usr/share/tomcat/webapps/
COPY --from=builder /science-portal/org.opencadc.science-portal.properties /usr/share/tomcat/config/
