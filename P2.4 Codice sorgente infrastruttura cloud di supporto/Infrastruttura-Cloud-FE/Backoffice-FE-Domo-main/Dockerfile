# Stage 1: Build
FROM node:20-alpine AS builder

ARG AUTH_TOKEN
ARG VITE_BE_URL
ENV VITE_BE_URL=$VITE_BE_URL


USER node

WORKDIR /app

COPY --chown=node:node package*.json ./

# Verify auth for Visioscientiae packages
RUN echo "//npm.pkg.github.com/:_authToken=${AUTH_TOKEN}" > ~/.npmrc && npm i

COPY --chown=node:node . .

RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: custom nginx config
COPY base.conf /etc/nginx/sites-enabled/base.conf
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]