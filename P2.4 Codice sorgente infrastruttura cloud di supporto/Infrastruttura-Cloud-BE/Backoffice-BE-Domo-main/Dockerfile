FROM node:20-alpine AS development

WORKDIR /backend

COPY ./package.json ./tsconfig.json ./.npmrc /backend/

ARG AUTH_TOKEN

# Verify auth for Visioscientiae packages
RUN echo "//npm.pkg.github.com/:_authToken=${AUTH_TOKEN}" > ~/.npmrc && npm i

COPY . /backend

RUN npm run build

CMD ["node", "dist/main.js"]