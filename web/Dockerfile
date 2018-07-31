FROM node:10 as build

COPY ./ /web

WORKDIR /web

ARG configuration=production

RUN npm install \
  && npm run build -- --configuration $configuration

FROM nginx:latest

COPY --from=build /static /var/local/bg-hub/static
COPY --from=build /web/nginx-conf /etc/nginx/conf.d/default.conf