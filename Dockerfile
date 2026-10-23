# Stage 1: Build the React application
FROM registry.access.redhat.com/hi/nodejs:24.21.0-1792544770 as react-build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Serve the app
FROM quay.io/redhat-services-prod/hcm-eng-prod-tenant/caddy-ubi:9c48e04

ENV CADDY_TLS_MODE http_port 8000

COPY ./config/Caddyfile /etc/caddy/Caddyfile

COPY --from=react-build /app/build /opt/app-root/src/build

COPY ./package.json /opt/app-root/src

WORKDIR /opt/app-root/src

EXPOSE 8000
