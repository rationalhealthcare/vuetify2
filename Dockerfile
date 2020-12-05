# build stage
FROM node:lts-alpine as build-stage
RUN apk update && \
    apk upgrade && \
    apk add --no-cache bash git openssh
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/00-set-runtime-config.sh /docker-entrypoint.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
