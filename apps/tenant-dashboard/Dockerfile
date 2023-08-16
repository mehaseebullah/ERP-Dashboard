FROM node:lts-alpine

ENV MY_PORT=8081

RUN npm install -g http-server

WORKDIR /apps/tenant-dashboard

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE $MY_PORT

# CMD [ "http-server", "dist","-p 8081" ]
CMD http-server dist -p $MY_PORT --proxy http://127.0.0.1:$MY_PORT?