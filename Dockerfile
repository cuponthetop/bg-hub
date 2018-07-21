FROM node:10

WORKDIR /root

COPY backend backend
COPY web web

RUN cd web \
  && npm install \
  && npm run build \
  && cd ../backend \
  && npm install

WORKDIR /root/backend

ENTRYPOINT [ "npm" "start" ]