FROM node:21
WORKDIR /app
COPY . /app
RUN yarn 
RUN yarn build 
CMD yarn start:prod
# CMD yarn start:dev