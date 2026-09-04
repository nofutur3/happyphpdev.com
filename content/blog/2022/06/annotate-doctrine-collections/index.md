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

When working with collections in PHP entities, it's recommended to use the `Doctrine\Common\Collections\Collection` interface as a type. This lets you use either the `ArrayCollection` or `PersistentCollection` implementation, depending on your needs, without changing any code that consumes the property.

The problem is that plain PHP has no generics: `Collection` alone doesn't tell you, or your IDE, what's actually inside it. That's where PHPDoc comes in:

```php
/** @var Collection<int, Article> $articles */
private Collection $articles;
```

The first type parameter is the key type Doctrine uses internally (`int` for a plain array-like collection), and the second is the entity class actually stored inside, `Article` here. Annotate it this way and static analysis tools like PHPStan or Psalm, and IDEs like PhpStorm, understand that iterating over `$articles` gives you `Article` instances, with proper autocompletion and type checking.

Keep in mind this annotation has no effect at runtime. PHP itself ignores it completely. It only helps if something is actually reading it, your IDE or a static analysis tool in your CI pipeline.
