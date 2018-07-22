FROM node:10

VOLUME [ "/static" ]

COPY ./ web

WORKDIR web

RUN npm install



ENTRYPOINT [ "npm", "run", "build" ]