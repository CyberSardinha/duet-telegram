FROM node:12.18.1
RUN apt-get update \
    apt-get install -y git
RUN mkdir /app \
    cd /app \
    git clone https://github.com/CyberSardinha/duet-telegram.git

WORKDIR /app/duet-telegram

COPY package.json package.json
COPY package-lock.json package-lock.json
 
RUN npm install --silent
 
CMD [ "node", "index.js" ]
