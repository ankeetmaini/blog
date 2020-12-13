---
title: "Part 1 - Going deeper into MongoDB"
description: overview of MongoDB, collections and documents, docker
date: 2020-12-13
layout: layouts/post.njk
tags: mongodb
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

`MongoDB` is a nosql database. That means that there're no tables, rows or foreign key relationships in quite the same manner they are in relational databases like `MySQL` etc.

It's a document store, which means you can store documents inside it directly. A `document` doesn't mean a literal file here. It means a `JSON` object.

```json
{ "name": "Jonas Kahnwald" }
```

Above is an example of a document.

In a SQL database, data is stored in a `table` and a table is made of `rows`. Each row has a fixed number of columns.

Similarly, in NoSQL database, the data is stored in `collections`, where each collection is made of `documents`. There's no restriction that each document should contain the same attributes or columns as in a relational database.

So this can be done in a NoSQL DB like MongoDB

```json
[{ "name": "Jonas Kahnwald" }, { "favouriteFood": "Croissants" }]
```

Not that I'm recommending of doing this (having disjoint attribute names for every document) but you can do it.

The benefit of this is in future if your data model changes, you can change the document structure without migrating the old data.

[![Untitled-2020-12-13-2113.png](https://i.postimg.cc/PrH8XZ9T/Untitled-2020-12-13-2113.png)](https://postimg.cc/0rtNZ69B)

> showing co-relations between a SQL and a NoSQL database

## mongo shell

As [shown above](#trying-it-and-installing) the shell of MongoDB isn't just like a regular database shell. It can even run JavaScript inside it.

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

## Operations (CRUD)

### create

Since the database is empty, I'll start by adding something to it.

- create a collection (empty)
- add a document inside it using `insertOne`
- done!

```bash

# create an empty collection - food
> db.food
test.food

# create a document inside the food collection
# db.food makes sure the document is
# added inside the `food` collection
> db.food.insertOne({name: 'Croissant'})
{
	"acknowledged" : true,
	"insertedId" : ObjectId("5fd64dabed36a5727cf5a243")
}

```

There's another method `insertMany` which as you correctly guessed inserts multiple documents in one go.

```bash

> db.food.insertMany([{name: "Samosa"}, {name: "Jalebi"}])
{
	"acknowledged" : true,
	"insertedIds" : [
		ObjectId("5fd64f09016e04b26b6fbfa9"),
		ObjectId("5fd64f09016e04b26b6fbfaa")
	]
}
>
```

### read

There are two methods to read.

- findOne
- find (for finding all documents)

```bash

> db.food.findOne()
{ "_id" : ObjectId("5fd64dabed36a5727cf5a243"), "name" : "Croissant" }
> db.food.findMany()
uncaught exception: TypeError: db.food.findMany is not a function :
@(shell):1:1
> db.food.find()
{ "_id" : ObjectId("5fd64dabed36a5727cf5a243"), "name" : "Croissant" }
{ "_id" : ObjectId("5fd64f09016e04b26b6fbfa9"), "name" : "Samosa" }
{ "_id" : ObjectId("5fd64f09016e04b26b6fbfaa"), "name" : "Jalebi" }
>
```

I can also pass a search criteria to find a particular document too.

```bash

> db.food.find({ name: "Samosa" })
{ "_id" : ObjectId("5fd64f09016e04b26b6fbfa9"), "name" : "Samosa" }
```

### update

This will be covered in part 2, something for you to comeback and subscribe.

> _genius skills for making you subscribe and bookmark :P_

### delete

Again, there are two ways you can delete

- deleteOne
- deleteMany

You can pass a matching criteria and all the records will get deleted that fit the criteria with `deleteMany`

```bash

> db.food.deleteMany({name: "Samosa"})
{ "acknowledged" : true, "deletedCount" : 1 }
```

You don't believe me?

```bash

> db.food.find()
{ "_id" : ObjectId("5fd64dabed36a5727cf5a243"), "name" : "Croissant" }
{ "_id" : ObjectId("5fd64f09016e04b26b6fbfaa"), "name" : "Jalebi" }
```

I told you!

## Bonus

- If you'd have noticed, I'm sure you'd have that a special attribute `_id` gets added to each record. If you pass it yourself, it'll be honoured else Mongo will create one for you. No two records can have the same `_id`. I think that was obvious and I could've saved those free extra keystrokes, but I'm nice :P
- Since all is JavaScript, you can just write the name of the function to see what it does

```bash

> db.food.insertOne
function(document, options) {
    var opts = Object.extend({}, options || {});

    // Add _id ObjectId if needed
    document = this.addIdIfNeeded(document);

    // Get the write concern
    var writeConcern = this._createWriteConcern(opts);

    // Result
    var result = {acknowledged: (writeConcern && writeConcern.w == 0) ? false : true};

    // Use bulk operation API already in the shell
    var bulk = this.initializeOrderedBulkOp();
    bulk.insert(document);

    # removed rest for brevity
```

> OMG! I know right!

See you in the next part. Kbye
