---
title: Asteroid Collision
description: asteroid collision google facebook leetcode
layout: layouts/post.njk
tags:
  - two pointers
---

Hi! Today I'll go through the problem **asteroid collision** and solve it with you!

### problem

You're given an array of numbers, some positive and some negative. Each number signifies how big is the asteroid, bigger the absolute number bigger the size.

- positive numbers mean they move right ->
- negative numbers mean they move left <-

Asteroids moving towards each other will collide and the bigger one will win with smaller one being destroyed. If both are of the same size then both will get destroyed.

You need to return the asteroids that will be left after the collision 💥💥💥

### some examples

TODO:// add images

### concept

I'll use the two pointer approach. The two pointers will be

- lastAsteroid will start at 0
- nextAsteroid will start at 1

I'll keep on checking if the adjacent asteroids are colliding, and keep incrementing/decrementing the pointers till the entire array of asteroids are exhausted. This can be done either recursively or iteratively. I'll show both :)



### code

```javascript
var simplifyPath = function(path) {
    const paths = path.split('/')
        .filter(segment => segment && segment !== '.'); // ignoring . and empty for samples like //
    const result = [];

    paths.forEach(segment => {
        if (segment == '..' ) {
            result.pop();
            return;
        }
        
        result.push(segment);
    });
    
    return '/' + result.join('/');
};
```

### practise

You can practise this question on [leetcode](https://leetcode.com/problems/simplify-path/)
    
