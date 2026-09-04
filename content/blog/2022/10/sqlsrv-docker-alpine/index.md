---
title: How to add sqlsrv extension for docker (alpine)
date: "2022-10-27"
description: "A working Dockerfile for installing the sqlsrv and pdo_sqlsrv PHP extensions on Alpine."
category: "php"
tags:
- php
- docker
- alpine
- sqlsrv
---

Getting the `sqlsrv` and `pdo_sqlsrv` PHP extensions working on an Alpine-based image is annoying: there's no prebuilt package for musl libc, so you have to install Microsoft's ODBC driver first and then compile the extensions yourself with `pecl`.

<!-- more -->

Here's a working Dockerfile for PHP 8.1 on Alpine:

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

The `--allow-untrusted` flags are needed because Microsoft's `.apk` packages aren't signed with an Alpine-trusted key. The package URLs above pin a specific driver version, so if Microsoft moves them, check their official ODBC driver documentation for the current download links.
