FROM node:10

WORKDIR /root

COPY ./ /root/backend

WORKDIR /root/backend

RUN npm install

ENTRYPOINT [ "npm" "start" ]