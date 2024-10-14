FROM node:lts-alpine

ENV MY_PORT=8080

WORKDIR /apps/orgnization-dashboard

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE $MY_PORT

RUN npm install -g http-server

# CMD [ "http-server", "dist","-p 8081" ]
CMD http-server dist -p $MY_PORT --proxy http://127.0.0.1:$MY_PORT?
