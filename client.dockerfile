FROM node:18-alpine as builder
RUN mkdir /client
COPY ./client /client
WORKDIR /client

EXPOSE 5173

RUN rm -rf node_modules
RUN rm package-lock.json
RUN npm install
RUN npm run build