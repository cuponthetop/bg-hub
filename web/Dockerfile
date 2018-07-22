FROM node:10

COPY ./ web

WORKDIR web

RUN npm install



ENTRYPOINT [ "npm", "run", "build" ]