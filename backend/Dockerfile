FROM node:10

COPY ./ backend

WORKDIR backend

RUN npm install

ENTRYPOINT [ "npm", "start" ]