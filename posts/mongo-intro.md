---
title: "Part 1 - Going deeper into MongoDB"
description: overview of MongoDB, collections and documents, docker
date: 2020-12-13
layout: layouts/post.njk
tags: mongo
---

I've been using `MongoDB` for quite some time on and off but I always resort to Google every time I've to use it. I now have a use-case where just the basics won't get me far and I'll have to understand the underlying tech to take advantage of it.

## Trying it and installing

Since I just want to try it out, using a Docker image makes perfect sense. No installation required and hence no clean-up too.

```bash
docker container run --name mongo mongo
```

This will start the docker container (name `mongo`) which will have the `MongoDB` installed. To use the mongo shell I'll open another terminal instance and just `exec` or ssh into the above container.

```bash

docker exec -it mongo /bin/bash
root@46abee94ab0c:/# mongo
MongoDB shell version v4.4.2
# rest of the startup logs omitted for brevity
>

```

Wow, we're in!

Before we dive into the shell and try commands, lets take a brief look into whats and whys of `MongoDB`

## NoSQL database

`MongoDB` is a nosql database. That means that there's no tables, rows or foreign key relationships in the same manner they have in the relational databases like `MySQL` etc.

It's a document store, which means you can store documents inside it directly. A `document` doesn't mean a literal file here. It means a `JSON` object.

```json
{ "name": "Jonas Kahnwald" }
```

Above is an example of a document.

In a SQL database data is stored in a `table` and a table is made of `rows`. Each row has a fixed number of columns.

Similarly, in NoSQL the data is stored in `collections`, where each collection is made of a number of `documents`. There's no restriction that each document should contain the same attributes or columns as in relational database.

So this can be done in a NoSQL DB like MongoDB

```json
[{ "name": "Jonas Kahnwald" }, { "favouriteFood": "Croissants" }]
```

Not that I'm recommending of doing this (having disjoint attribute names for every document) but you can do it.

The benefit of this is in future if your data model changes, you can change the document structure without migrating the old data.

[![Untitled-2020-12-13-2113.png](https://i.postimg.cc/PrH8XZ9T/Untitled-2020-12-13-2113.png)](https://postimg.cc/0rtNZ69B)

> showing co-relations between a SQL and a NoSQL database

## mongo shell

As [shown above](#Tryingitandinstalling) the shell of MongoDB isn't just like a regular database shell. It can even run JavaScript inside it.

```bash

> 0.1 + 0.2
0.30000000000000004
```

_LOL, the best way to test JS_

By default when you connect to a `Mongo Shell` and don't specify a db name, it connects to `test`.

You can check this by typing db and seeing the value.

```bash

> db
test
>
```

You can access all the collections, documents from the keyword `db`. It holds the currently selected database.
