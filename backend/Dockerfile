FROM node:10

WORKDIR backend

COPY ./*.json .

RUN npm install

COPY . .


CMD [ "npx", "cross-env", "NODE_ENV=$NODE_ENV", "POSTGRES_PASSWORD=$POSTGRES_PASSWORD", "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID", "ts-node", "index.ts" ]