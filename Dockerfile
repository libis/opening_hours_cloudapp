FROM node:18-alpine

#RUN addgroup app --gid 10000 && adduser app --home /app --uid 10000 --ingroup app

#USER app:app
WORKDIR /app

COPY README.md README.md
COPY cloudapp cloudapp
COPY config.json config.json
COPY manifest.json manifest.json
COPY package.json package.json

RUN yarn global add @exlibris/exl-cloudapp-cli
RUN yarn install

ENV NODE_OPTIONS=--openssl-legacy-provider
EXPOSE 4200

CMD yarn start --no-open-browser --host 0.0.0.0 --disable-host-check 
