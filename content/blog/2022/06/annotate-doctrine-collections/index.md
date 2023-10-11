---
title: PHPDoc for Doctrine Collections
date: "2022-06-30"
description: "Did you ever wonder how to annotate Doctrine Collections with PHPDoc? Check out the syntax!"
category: "php"
tags:
- php
- phpdoc
- doctrine
- annotations
---

When working with collections in PHP entities, it's recommended to use the Doctrine\Common\Collections\Collection interface as a type. This will allow you to use either the ArrayCollection or PersistentCollection implementation, depending on your needs. To properly document your code with PHPDoc, you can use the following syntax:
```php
/** @var Collection<int, Article> $articles */
private Collection $articles; 
```
