FROM node:12.18.1
 
WORKDIR /app
RUN git clone https://github.com/martinj/duet-telegram.git /app/
 
COPY package.json package.json
COPY package-lock.json package-lock.json
 
RUN npm install
 
COPY . .
 
CMD [ "node", "index.js" ]
