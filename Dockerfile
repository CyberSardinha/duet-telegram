FROM node:latest

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install

COPY . /app/

CMD [ "node", "index.js" ]
