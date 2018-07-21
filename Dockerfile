FROM node:10

WORKDIR ~

COPY backend backend
COPY web web

RUN cd web \
 && npm install \
 && npm run build \
 && cd ../backend \
 && npm install \
 && npm start