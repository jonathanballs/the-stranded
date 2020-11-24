FROM node:9-alpine

WORKDIR /worker
ADD package.json .
RUN yarn install
ADD . /worker/

ENV PORT=80
EXPOSE 80
CMD ["yarn", "start"]

