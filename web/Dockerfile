FROM node:10

WORKDIR /root

COPY ./ root/web

WORKDIR /root/web

RUN npm install

ENTRYPOINT [ "npm" "run" "build" ]