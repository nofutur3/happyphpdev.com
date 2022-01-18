FROM node:16-alpine

MAINTAINER Jakub Vyvazil <jakub@vyvazil.cz>

# update libs
RUN apk update && apk upgrade

RUN apk add --no-cache libsodium \
       freetype-dev \
       libmcrypt-dev \
       libpng-dev \
       autoconf \
       automake \
       libtool \
       nasm \
       zlib-dev cyrus-sasl-dev libmemcached-dev \
       gcc make g++

# update npm
RUN npm install -g npm@8.3.1

COPY docker/node/docker-entrypoint.sh /usr/local/bin/

WORKDIR /var/www
