ARG NODE_VERSION=18.0.0

FROM node:${NODE_VERSION}-alpine AS build

ENV NODE_ENV production


WORKDIR /otawilma

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./scripts/ ./scripts
COPY ./config ./config
COPY ./public ./public
COPY ./src ./src

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
    
RUN npm run build

FROM nginx:latest
COPY --from=build /otawilma/build /usr/share/nginx/html/