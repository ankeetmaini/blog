---
title: Deepest node in binary tree
description: A short post on how to find the deepest node using recursion. Daily Coding Problem #622
date: 2020-10-15
layout: layouts/post.njk
tags:
  - dcs
  - psds
---

I came across today's `Daily Coding Problem #622` and since it was tagged easy I thought of trying it out.

The problem was about finding the deepest node given a binary tree.

```text
    a
   / \
  b   c
 /
d
```

Each node can be described to have a structure like this

```text
type node = {
  val: some-value,
  left?: node,
  right?: node
}
```

The `left` and `right` values can be empty or null.

In the above example, it's clear by looking that the deepest node is `d`.

```text
    a       0th level
   / \
  b   c     1st level
 /
d           2nd level
```

This can be solved by keeping track of the level as you traverse. In these cases one traverses recursively on each node till there are no children.

At each level you can check if the current level is greater than last traversed level. For this we'd need to store a variable to keep track of it.

I'll use a closure to save these as shown below.

```js
const findDeepest = (root) => {
  let maxLevel = 0;
  let deepest = root;
  // what if this is the only node with no
  // children, so initialising it with argument

  const traverse = (node, level) => {
    // see if the level is greater
    // than `maxLevel` then save it
    // traverse right and left children
  };

  traverse(root, 0);
};
```

I've declared a `traverse` function which will basically do the heavy lifting. To start the recursive traversal I'm calling it given the current root and the current level which is 0 :P

Writing the `traverse` function

```js
const traverse = (node, level) => {
  if (!node) return;

  if (level > maxLevel) {
    maxLevel = level;
    deepest = node;
  }

  traverse(node.left, level + 1);
  traverse(node.right, level + 1);
};
```

Notice how the `traverse` function recursively calls itself for the left subtree and the right subtree. We pass the level too by incrementing by 1 as the child is 1 level below the current node level.

Once it exhausts all possible subtrees then the value of `maxLevel` and `deepest` would be the answer.

We can just return these two once the function runs over.

Here's the final solution.

```js/20/
const findDeepest = (root) => {
  let maxLevel = 0;
  let deepest = root;
  // what if this is the only node with no
  // children, so initialising it with argument

  const traverse = (node, level) => {
    if (!node) return;

    if (level > maxLevel) {
      maxLevel = level;
      deepest = node;
    }

    traverse(node.left, level + 1);
    traverse(node.right, level + 1);
  };

  traverse(root, 0);

  return deepest;
};
```
