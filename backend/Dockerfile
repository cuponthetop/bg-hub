FROM node:10

COPY ./ backend

WORKDIR backend

RUN npm install \
  && env

CMD [ "npx","cross-env", "NODE_ENV=$NODE_ENV", "ts-node", "index.ts" ]