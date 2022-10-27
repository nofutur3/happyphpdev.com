---
title: How to add sqlsrv extension for docker (alpine)
date: "2022-10-27"
description: "Did you ever wonder how to annotate Doctrine Collections with PHPDoc? Check out the syntax!"
category: "php"
tags:
- php
- docker
- alpine
- sqlsrv
---

```Dockerfile
FROM php:8.1-alpine

RUN wget https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/msodbcsql17_17.5.1.1-1_amd64.apk && \
    wget https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/mssql-tools_17.5.1.1-1_amd64.apk && \
    apk add --allow-untrusted msodbcsql17_17.5.1.1-1_amd64.apk && \
    apk add --allow-untrusted mssql-tools_17.5.1.1-1_amd64.apk && \
    apk add --no-cache --virtual .phpize-deps $PHPIZE_DEPS unixodbc-dev && \
    pecl install sqlsrv pdo_sqlsrv && \
    docker-php-ext-enable sqlsrv pdo_sqlsrv && \
    apk del .phpize-deps && \
    rm msodbcsql17_17.5.1.1-1_amd64.apk && \
    rm mssql-tools_17.5.1.1-1_amd64.apk
```
