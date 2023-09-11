FROM node:18-alpine

RUN corepack enable

WORKDIR /app

COPY . ./

RUN npm i

CMD [ "npm", "start:dev" ]