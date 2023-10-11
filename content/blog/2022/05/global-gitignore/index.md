---
title: Do you use a global .gitignore file? Why not?
date: "2022-06-30"
description: "Learn how to use .gitignore files correctly and keep your versioned projects free from unnecessary clutter. This article explains the importance of .gitignore files, identifies common artifacts that should be excluded from versioning, and provides step-by-step instructions for setting up a global .gitignore file to keep your environment clean."
category: "git"
tags:
- git
- gitignore
---
Every Git user knows about the .gitignore file, but many don't use it correctly. Its purpose is to keep project artifacts out of version control. So what are artifacts? In general, they are all the generated files needed to run the project. For a PHP app, this would typically include the vendor directory, cache, and any generated reports.

However, I often see a lot of IDE- or OS-specific stuff in .gitignore files, like .DS_STORE. If these files aren't ignored, they can be accidentally versioned in the project, which is not what we want. To prevent this, every developer should set up their environment to not commit their specific files with a global .gitignore.

To set up a global .gitignore, you first need to be in the versioned directory. If you're not, you can create a temporary directory like this:

```bash
mkdir ~/Temp
cd ~/Temp
git init
```
To search for global .gitignore files, you can use this command:

```bash
git config --global core.excludesFile
```

By default, there are no global .gitignore files. To create one, create a .gitignore file with the content you want. Here's an example:

```bash
nano ~/.gitignore
```

```text
# Node
npm-debug.log

# Mac
.DS_Store

# Windows
Thumbs.db

# JetBrains stuff
.idea/

# vi
*~
```

Once you have your .gitignore file, you can tell Git to use it globally:

```bash
git config --global core.excludesfile ~/.gitignore
```

