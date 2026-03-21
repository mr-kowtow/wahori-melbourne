# Build stage — compile Tailwind CSS
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tailwind.config.js input.css index.html ./
RUN npm run build

# Serve stage — nginx serves the compiled output
FROM nginx:alpine
COPY --from=builder /app/index.html /usr/share/nginx/html/
COPY --from=builder /app/style.css /usr/share/nginx/html/
EXPOSE 80
