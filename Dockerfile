FROM node:9-alpine

WORKDIR /worker
ADD package.json .
RUN yarn install
ADD . /worker/

EXPOSE 4004

CMD ["yarn", "start"]

