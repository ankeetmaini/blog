---
title: Simplify Paths
description: simplify unix path leetcode
layout: layouts/post.njk
tags:
  - stack
---

Hi! Today I'll go through the problem **simplify paths** and see how best to solve it!

The premise is simple, you'd be given a unix like path and we need to simplify it as much as we can. This means

- removing trailing slashes
- removing `..` parent references
- removing `//` and adding just single `/`
- remove `.` if it doesn't add any value, like `/a/./b` => `/a/b`

```
input = '/a/../b/'
output = '/b'
```

### curb your temptations!

You might get tempted to do it the same way you're probably thinking right now. 
 - take a pass and remove all `.`
 - make all `//` to single one

But this isn't so easy as you'll have to keep track of previous element too. As both `.`, `..` and `/`, `//` are to be processed differently.

### some examples

- /a/./b => /a/b
- /a/./b/../../c/ => /c

You can see the path segments (stuff between the slashes `/`) will always be a valid path. It can be just these things
- .
- ..
- [az]* (any alphanumeric word)

You need something to go and keep track of directory/nesting level. I'm going to use an array to solve this.

### concept

- split the input path by `/`
- for each path segment
    - if it's `.` then ignore
    - if it's `..` then drop the last item in the array as we want to land to the parent directory
    - if it's empty - ignore

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
    
