FROM tarampampam/node:13-alpine

RUN mkdir /app
RUN cd /app
RUN git clone https://github.com/CyberSardinha/duet-telegram.git

WORKDIR /app/duet-telegram

COPY package.json package.json
COPY package-lock.json package-lock.json
 
RUN npm install --silent
 
CMD [ "node" "index.js" ]
