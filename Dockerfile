FROM node:10

WORKDIR ~

COPY backend backend
COPY web web

RUN pushd web \
 && npm install \
 && npm run build \
 && popd && pushd backend \
 && npm install \
 && npm start