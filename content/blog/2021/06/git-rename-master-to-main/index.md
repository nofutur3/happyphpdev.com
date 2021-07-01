---
title: How to rename master to main | GIT
date: "2021-06-01"
description: "Hello World"
---

```bash
git branch -m master main
git push -u origin main
git push origin --delete master
```

origin? git remotes

```
 jakub@zion  ~/Projects/personal/happyphpdev.com   main ±✚  git push origin --delete master
remote: error: refusing to delete the current branch: refs/heads/master
To bitbucket.org:jvyvazil/happyphpdev.com.git
 ! [remote rejected] master (deletion of the current branch prohibited)
error: failed to push some refs to 'bitbucket.org:jvyvazil/happyphpdev.com.git'

```
