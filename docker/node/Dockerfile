FROM node:18-alpine

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
RUN npm install -g npm@10.8.2

COPY docker/node/docker-entrypoint.sh /usr/local/bin/

WORKDIR /var/www
