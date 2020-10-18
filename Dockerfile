FROM node:latest

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install

COPY . .

CMD [ "node", "index.js" ]
