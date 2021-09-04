---
title: Group-by (SQL) in Google sheets
description: group by in google sheet, query, sum, sql, manipulate data
date: 2020-10-18
layout: layouts/post.njk
tags:
  - google-sheets
---

I today needed to manipulate some data I collected in a `Google sheet`. I started googling frantically to reduce the data in a way I wanted. I got so many different in-built functions and things were getting a little out of hand for something super simple.

> Little did I know that Google sheets supported entire `SQL` query syntaxes. Whoaaa!

Let's say we have a table and we want to aggregate the distinct food items (group-by) and sum their cost.

![](img/croissants.png)

These are the items sold today and I want to see how many distinct items were sold with the total amount they got me.

Google sheets have `QUERY` function which allows you to write full queries to transform your data and see it in anyway.

It takes two inputs:

- the range of the cells your query applies to
- the query itself

## defining the range

![Screenshot-2020-10-18-at-5-52-17-PM.png](img/Screenshot-2020-10-18-at-5-52-17-PM.png)

## writing the QUERY

### just summing everything

```sql
=QUERY(A1:B6, "select sum(B)")
```

This would output just one singe value adding all the values in the second column. Here `B` would automatically take the second column and so on.

### aggregating by food (group-by)

```sql
=QUERY(A1:B6, "select A, sum(B) group by A")
```

This nicely sums up our items

[Screenshot-2020-10-18-at-5-56-05-PM.png](img/Screenshot-2020-10-18-at-5-56-05-PM.png)

### sorting by highest amount

```sql
=QUERY(A1:B6, "select A, sum(B) group by A order by sum(B) desc")
```

Plain old `order by` clause works here as well.

[Screenshot-2020-10-18-at-5-58-19-PM.png](img/Screenshot-2020-10-18-at-5-58-19-PM.png)

I hope you'd find yourself having to make sense of some data in an excel sheet and this post will find you well that day. No need to struggle with myriad in-built functions and use your SQL skills like-a-boss (although mine are pathetic).

This was a nice and fun discovery.
