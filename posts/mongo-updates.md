---
title: "Part 2 - Going deeper into MongoDB updates"
description: mongodb updates with modifier for increment decrement push pop filter find
date: 2020-12-30
layout: layouts/post.njk
tags: mongodb
---

I hope you've gone through the first part of this series (if not I've linked it in the next line) and are warmed up now for making updates to your documents with surgical precision.

> [Part 1 - Going deeper into MongoDB](/posts/mongo-intro/)

I'll try out the various update statements on a local MongoDB instance using Docker, please [refer this](<(/posts/mongo-intro/#trying-it-and-installing)>) if you want to follow along.

## ~~C~~RUD is the new CRUD; C = U

Remember I told you [how to create documents](/posts/mongo-intro/#create) in the previous part. You can use it but as you'll see in MongoDB we can use `update` to do `create` too.

This is awesome for two reasons

- one less API to ~~Google~~ remember
- we mostly write code to create/update in the same function/component etc, this way we don't need to guess or make an extra call to find out which one to use

### How can I?

- [How can I create or update a document?](#how-can-i-create-or-update-a-document%3F)
- [How can I increment a count value?](#how-can-i-increment-a-count-value%3F)
- [How can I decrement a count value?](#how-can-i-decrement-a-count-value%3F)
- [How can I delete a key from the document?](#how-can-i-delete-a-key-from-the-document%3F)
- [How can I add items to an array?](#how-can-i-add-items-to-an-array%3F)
- [How can I remove items from an array?](#how-can-i-remove-items-from-an-array%3F)
- [How can I edit items in an array?](#how-can-i-edit-items-in-an-array%3F)
- [How can I return the record edited?](#how-can-i-return-the-record-edited%3F)
- [How can I update multiple documents in one go?](#how-can-i-update-multiple-documents-in-one-go%3F)

## How can I create or update a document?

I want to save a document as shown below.

```json
{ "name": "Samosa", "type": "spicy" }
```

Using the knowledge of the previous post, we know that all the functions of Mongo take a filter object as its first argument.

```js
db.food.updateOne(filter, updateObject, config);
```

At this point no records exist in the db, so the filter will lead to 0 results, but since we've used a special attribute in config `upsert: true` a document would be created. If you omit this, then the `updateOne` call won't save the doc if it did not exist.

> So for the last time, `upsert: true` is what gives `updateOne` the power to _create_.

```js
db.food.updateOne(
  { name: "Samosa" }, // filter
  { $set: { name: "Samosa", type: "spicy" } }, // update doc
  { upsert: true } // config
);
```

I know you see a weird `$set` keyword in the above command.

> That's an atomic update operator. There're a few of them, not many and they are our friends.

Running this on the shell...

```bash
> db.food.updateOne(
      { name: "Samosa" },
      { $set: { name: "Samosa", type: "spicy" } },
      { upsert: true }
    );
{
	"acknowledged" : true,
	"matchedCount" : 0,
	"modifiedCount" : 0,
	"upsertedId" : ObjectId("5fec78c3cbb7cf98a4358bf4")
}

> db.food.find()
{ "_id" : ObjectId("5fec78c3cbb7cf98a4358bf4"), "name" : "Samosa", "type" : "spicy" }
```

So `$set` really sets 😉

## How can I increment a count value?

So using the above example I want to keep a track of how many `Samosa`s I ate.

We can do this by

- first filtering the food === samosa
- adding a new attribute for keeping the count (say `count`)
- and incrementing it

Doing the above with code

```js
db.food.updateOne(
  { name: "Samosa" }, // filter
  { $inc: { count: -1000 } }, // update keys
  { upsert: true } // config
);
```

I know you'd be judging me for using `upsert: true` here which is not needed, but that's the beauty. You can use it and totally forget about handling if the document doesn't exist. This should become the default in your codebase.

Running this on shell...

```bash
> db.food.updateOne(
...   { name: "Samosa" }, // filter
...   { $inc: { count: 1 } }, // update keys
...   { upsert: true } // config
... );
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }

> db.food.updateOne(
...   { name: "Samosa" }, // filter
...   { $inc: { count: 1 } }, // update keys
...   { upsert: true } // config
... );
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }

> db.food.find()
{ "_id" : ObjectId("5fec8174cbb7cf98a4358c40"), "name" : "Samosa", "type" : "spicy", "count" : 2 }
>
```

Needless to say if you did it twice it will increment twice. The value `count: 1` is a step value, if you gave 100, it'll increment by 100.

## How can I decrement a count value?

Sorry friends, there's no `$dec` modifier (lol), if you want to decrement use a negative step value

```js
db.food.updateOne(
  { name: "Samosa" }, // filter
  { $inc: { count: -1 } }, // update keys
  { upsert: true } // config
);
```

## How can I delete a key from the document?

Use `$unset`

I now want to delete the count attribute we added to the food document, because that's like the worst schema design; storing count without the user context.

```js
db.food.updateOne(
  { name: "Samosa" }, // filter
  { $unset: { count: 1 } }, // update keys
  { upsert: true } // config
);
```

Again, the value of `count` doesn't matter, `$unset` just removes the attribute.

```bash
> db.food.updateOne(
...   { name: "Samosa" }, // filter
...   { $unset: { count: 0 } }, // update keys
...   { upsert: true } // config
... );
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }

> db.food.find()
{ "_id" : ObjectId("5fec8174cbb7cf98a4358c40"), "name" : "Samosa", "type" : "spicy" }
```

## How can I add items to an array?

For example, this is how our doc looks like now(omitting the `_id` for brevity)

```json
{ "name": "Samosa", "type": "spicy" }
```

Imagine you're the owner of a restaurant that sells this item and hungry customers are placing orders. We want to store the `orders` so that the document looks like the below json

```json
{
  "name": "Samosa",
  "type": "spicy",
  "orders": [
    { "customerName": "Ankeet", "quantity": 2 },
    { "customerName": "Romeo", "quantity": 5 }
  ]
}
```

Enter `$push`

```js
db.food.updateOne(
  { name: "Samosa" }, // filter
  {
    $push: {
      orders: { customerName: "Ankeet", quantity: 2 },
    },
  },
  { upsert: true }
);
```

This will not only add the attribute `orders` to the doc but also push the order to it.

If I were to run this in the shell

```bash
> db.food.updateOne(
...   { name: "Samosa" }, // filter
...   { $push: { orders: { customerName: "Ankeet", quantity: 2 } } },
...   { upsert: true }
... );
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }

> db.food.find()
{
    "_id" : ObjectId("5fec8174cbb7cf98a4358c40"),"name" : "Samosa",
    "type" : "spicy",
    "orders" : [
        { "customerName" : "Ankeet", "quantity" : 2 }
    ]
}
```

## How can I remove items from an array?

### by position

This is an easy one, and you can almost guess what the operator name would be, (hint: opposite of push) `$pop` using an attribute with position (1 or -1)

- `<attribute-name> = -1` removes the element from the top
- `<attribute-name> = 1` removes the element from the bottom

Here, `attribute-name = orders`

```js
db.food.updateOne(
  { name: "Samosa" }, // filter
  { $pop: { orders: -1 } }, // first item, Ankeet's order
  { upsert: true } // harmless config
);
```

### by filter

Enter `$pull`. You can give it a filter criteria and all the elements that match will be removed.

Let's say I want to remove Ankeet's order as it's fulfilled.

```js
db.food.updateOne(
  { name: "Samosa" }, // main filter
  { $pull: { orders: { customerName: "Ankeet" } } }, // orders filter
  { upsert: true } // harmless config
);
```

Dissecting the `$pull` arguments

> `$pull` (we want to remove items) -> from `orders` -> which matches `customerName=Ankeet`

Trying this out on the mongo shell...

```bash
> db.food.find()
{
    "_id" : ObjectId("5fec8174cbb7cf98a4358c40"),
    "name" : "Samosa",
    "type" : "spicy",
    "orders" : [
        { "customerName" : "Ankeet", "quantity" : 2 }, { "customerName" : "Romeo", "quantity" : 5 }
    ]
}

> db.food.updateOne(
...   { name: "Samosa" }, // main filter
...   { $pull: { orders: { customerName: "Ankeet" } } }, // orders filter
...   { upsert: true } // harmless config
... );
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }

> db.food.find()
{
    "_id" : ObjectId("5fec8174cbb7cf98a4358c40"),
    "name" : "Samosa",
    "type" : "spicy",
    "orders" : [
        { "customerName" : "Romeo", "quantity" : 5 }
    ]
}
```

Wowww, Ankeet's order gone.

## How can I edit items in an array?

Let's take a look at the same order json structure and try to do something fancy.

```json
{
  "name": "Samosa",
  "type": "spicy",
  "orders": [
    { "customerName": "Ankeet", "quantity": 2 },
    { "customerName": "Romeo", "quantity": 5 }
  ]
}
```

As you can see there are two orders, now I want to change the `quantity` for Ankeet's order. How can I do it?

Don't say using `$set` but by hardcoding it like this way

```js
db.food.updateOne(
  { name: "Samosa" }, // filter
  { $set: { "orders.0.quantity": 10 } } // hardcoding the deep path with array index
);
```

🚫 _Although it works_, this isn't practical at all, because knowing the index at which the record is stored will not be known to you at the time of writing the query.

✅ using `$set` with position operator $

```js
db.food.updateOne(
  { name: "Samosa", "orders.customerName": "Ankeet" }, // filter
  { $set: { "orders.$.quantity": 10 } }
);
```

In the above we've selected not only the food, but also the inner array item where `customerName=Ankeet`. We then use `$set` to set the quantity at the selected index which is automatically stored in `$`.

> Anytime you filter an item from an array, the index is saved and available for use in the `$` operator.

### using arrayFilters

The only problem with the above approach is that it'll work only for the **first item** it matches.

What if due to extreme scarcity the restaurant decides to limit the order to `quantity = 1`.

We'll use `arrayFilters`

```js
db.food.findOneAndUpdate(
  { name: "Samosa" }, // main filter
  { $set: { "orders.$[x].quantity": 4 } },
  { arrayFilters: [{ "x.quantity": { $eq: 1 } }] }
);
```

Dissecting the above

`$set` -> quantity to 1 for matching items (denoted by x)

> how are the matching items found?

We've one top level filter, which selects the doc containing `Samosa`, but we need another filter to select the sub array `orders`

`arrayFilters` (another filter for the sub-array) -> it matches the elements say `x` if the quantity is `greater than` 1

```bash
> db.food.find()
{ "_id" : ObjectId("5fec8174cbb7cf98a4358c40"),
"name" : "Samosa",
"type" : "spicy",
"orders" : [
   { "customerName" : "Romeo", "quantity" : 5 },
   { "customerName" : "Ankeet", "quantity" : 10 }
] }

> db.food.updateOne(
...   { name: "Samosa" }, // main filter
...   { $set: { "orders.$[x].quantity": 1 } },
...   { arrayFilters: [{ "x.quantity": { $gte: 1 } }] }
... );
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }

> db.food.find()
{ "_id" : ObjectId("5fec8174cbb7cf98a4358c40"),
"name" : "Samosa",
"type" : "spicy",
"orders" : [
  { "customerName" : "Romeo", "quantity" : 1 },
  { "customerName" : "Ankeet", "quantity" : 1 }
] }
```

## How can I return the record edited?

Just replace all instances of `updateOne` -> `findOneAndUpdate`, and you're done!

```bash
> db.food.findOneAndUpdate(
...   { name: "Samosa" }, // main filter
...   { $set: { "orders.$[x].quantity": 4 } },
...   { arrayFilters: [{ "x.quantity": { $eq: 1 } }] }
... );
{
	"_id" : ObjectId("5fec8174cbb7cf98a4358c40"),
	"name" : "Samosa",
	"type" : "spicy",
	"orders" : [
		{
			"customerName" : "Romeo",
			"quantity" : 1
		},
		{
			"customerName" : "Ankeet",
			"quantity" : 1
		}
	]
}
>
```

## How can I update multiple documents in one go?

Just replace `updateOne` with `updateMany`
