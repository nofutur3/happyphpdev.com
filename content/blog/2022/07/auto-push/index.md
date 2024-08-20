---
title: How to set up remote branch tracking automatically in Git
date: "2022-07-01"
description: "Learn how to set up remote branch tracking automatically in Git."
category: "git"
tags:
- git
- config
---

Do you often get this message when you try to push your changes to the remote repository?

```bash
There is no tracking information for the current branch.
Please specify which branch you want to merge with.
See git-pull(1) for details

    git pull <remote> <branch>

If you wish to set tracking information for this branch you can do so with:

    git branch --set-upstream-to=origin/<branch> mybranch
```

There is a simple solution to this problem. You can set up the remote branch to track the local branch automatically by running the following command:

```bash
git config --global --add --bool push.autoSetupRemote true
```
