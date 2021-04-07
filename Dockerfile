# Defining environment
ARG APP_ENV=development

# Building the base image
FROM node:lts-alpine as base
# FROM node:10.16.0-alpine as base

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

ENV YARN_VERSION 1.22.0

RUN echo "running BASE commands"

RUN apk add --no-cache --virtual .build-deps-yarn curl \
    && curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
    && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
    && rm yarn-v$YARN_VERSION.tar.gz \
    && apk del .build-deps-yarn

RUN apk add --no-cache autoconf automake build-base curl g++ git libtool make nasm python-dev zlib-dev mysql-client

USER node

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

# Building the development preinstall image
FROM base as development-preinstall

RUN echo "running development preinstall commands"


# Building the production preinstall image
FROM base as production-preinstall

RUN echo "running production preinstall commands"

# Installing the app files
FROM ${APP_ENV}-preinstall as install

RUN echo "running install commands"

COPY --chown=node:node [ "src/packages/common/package*.json", "src/packages/common/*.lock", "./src/packages/common/" ]
COPY --chown=node:node [ "src/packages/react-wheel/package*.json", "src/packages/react-wheel/*.lock", "./src/packages/react-wheel/" ]
COPY --chown=node:node [ "src/packages/testing/package*.json", "src/packages/testing/*.lock", "./src/packages/testing/" ]
COPY --chown=node:node [ "package*.json", "*.lock", "." ]

RUN yarn

COPY --chown=node:node . .

FROM install as production-postinstall

RUN echo "running production postinstall commands"

# RUN yarn build && apk del build-dependencies
RUN yarn build

RUN cp -r /home/node/app/src/frontend/public /home/node/app/dist/frontend

FROM install as development-postinstall

RUN echo "running development postinstall commands"

# RUN yarn global add typescript && yarn global add tsc-watch

FROM ${APP_ENV}-postinstall as final

RUN echo "running final commands"

RUN yarn global add pm2
# RUN pm2 install pm2-intercom && pm2 install pm2-server-monit && pm2 install pm2-auto-pull

RUN chmod +x /home/node/app/scripts/run.sh && chmod +x /home/node/app/scripts/wait-for-mysql.sh

EXPOSE 80 443 43554 1337

# ENTRYPOINT

CMD ["/bin/sh", "/home/node/app/scripts/run.sh"]
# CMD ["/bin/sh", "/home/node/app/scripts/wait-for-mysql.sh", "/home/node/app/scripts/run.sh"]
