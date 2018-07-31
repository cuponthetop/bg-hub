FROM node:10 as build

COPY ./ /web

WORKDIR /web

RUN npm install \
  && npm run build

FROM nginx:latest

COPY --from=build /static /var/local/bg-hub
COPY --from=build /web/nginx-conf /etc/nginx/conf.d/default.conf