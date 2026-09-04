---
title: Adminer
date: "2021-06-02"
description: "What Adminer is, why it beats phpMyAdmin, and how to run it safely in Docker Compose."
category: "tools"
tags:
    - database
    - docker
---

[Adminer](https://www.adminer.org/) is a database management tool, similar to phpMyAdmin, but it ships as a single PHP file. No installation, no dependencies, no folder full of assets. You just drop it next to your project (or run its Docker image) and open it in the browser.

A few reasons I reach for it over phpMyAdmin:

- It talks to more than MySQL/MariaDB out of the box: PostgreSQL, SQLite, MS SQL, Oracle, and a couple more.
- The UI is lighter and loads faster, since there's a lot less markup and JavaScript behind it.
- Being one file makes it trivial to drop into any project without touching the rest of your setup.

In practice I add it as a service in my `docker-compose.yml` during local development:

```yaml
services:
  adminer:
    image: adminer
    restart: always
    ports:
      - 8080:8080
```

Point your browser at `localhost:8080`, log in with your database container's service name as the host, and you're browsing your data without installing any client.

**One warning though:** never leave Adminer running on a production server. It's a full database admin panel reachable straight from a browser, and exposing that publicly is a real security risk. Keep it in your local or dev compose file only, and if you genuinely need it somewhere shared, put it behind a VPN or an IP allowlist, never open to the internet.
