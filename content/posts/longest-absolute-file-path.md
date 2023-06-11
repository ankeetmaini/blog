---
title: Longest absolute file path
description: solving longest absolute file path, daily coding problem 17, 658, 875, leetcode 388
date: 2021-07-14
layout: layouts/post.njk
tags:
  - dcs
  - leetcode
---

## Problem 

The question gives us the input in the form of a file path

### input

`dir\n\tsubdir1\n\tsubdir2\n\t\tfile.ext`

which represents the following

```
dir
    subdir1
    subdir2
        file.ext
```

The directory `dir` contains an empty sub-directory `subdir1` and a sub-directory `subdir2` containing a file `file.ext`.

### output

The length of absolute length of the longest file path. This includes:

- string length
- `\t` length, each tab character is considered as 1 length unit

So for the above input example, the answer would be adding up the length of `dir -> subdir2 -> file.txt`

- 3 - `dir` is 3 characters
- 8 - `subdir2` is 7 characters + 1 `\t`
- 9 - `file.txt` is 9 characters + 1 `\t`

## Solution

The directory structure looks like the classic folder structure on our laptops, where each file is nested under a folder and folders in turn can be in other folders/directory.

> Before you run off to start parsing the string as a tree like structure, I'd urge you to hold-your-horses. There's very less ROI (return on investment)

The files are located directly under the directory one level up, and each path is separated by `\n`. 

**So that's our #1 hint.** Process each path one by one - split by `\n`

> pro-tip: `\t` and `\n` are single characters

If you're to closely look at the file path, you get each level or nesting one by one. For example, the below path would be three separate strings and not one if you split by `\n`.

```
dir                 (level 0)
    subdir2          (level 1)
        file.txt     (level 2)
```

```js
=> ['dir', '\tsubdir2', '\t\tfile.txt']
```

You get the level by counting the `\t` character.

### determining the longest path

The following should probably do it :P

- process all files
- calculate the length of each input (file or folder)
- keep track of the max length encountered so far

### how to calculate the length

- count the characters in the filename
- add the length of parent folders

_(cost calculation figure)_
```
dir                (level 0)
<-3->                           3
    subdir2        (level 1)
    <-1 + 7->                   3 + 8 = 11    
        file.txt   (level 2)
        <-1 + 8->               11 + 9 = 20

** 1 is added at both level 1,2 for the nesting
```

### translating into code

The below code is written in Go, as I wanted to learn this for a long time and this will probably teach me at least 10% :P

> Go code is very terse, and readable like English

### processing the input and splitting it by `\n`

```go
func lengthLongestPath(input string) int {
    lines := strings.Split(input, "\n")

    // iterating over lines one by one
    for _, eachLine := range lines {
        // calculate the cost of line
    }
}

```

### calculating cost

_cost of item = self cost + prev level cost_

I'll also have to store the cost of each level so that it can be used to calculate the cost of subsequent levels. (using a map)

```go/1,3,10/
func lengthLongestPath(input string) int {
    maxCost := 0
    lines := strings.Split(input, "\n")
    costMap := make(map[int]int)

    for _, eachLine := range lines {
        // count the `\t` in the line
        tabs := strings.Count(eachLine, "\t")

        // calculate the cost of each line
        cost := len(eachLine) - tabs + costMap[tabs - 1] + nestingCost(tabs)

        // save the cost for future use
        costMap[tabs] = cost

        if strings.Contains(eachLine, ".") {
            // do this only if it's a file
            if maxCost < cost {
                maxCost = cost
            }
        }
    }

    return maxCost
}

func nestingCost(tabs int) int {
    if tabs == 0 {
        return 0
    }
    return 1
}
```

In the above code, all the magic is in the line which calculates the cost

```go
cost := len(eachLine) - tabs // self cost
    + costMap[tabs - 1]      // prev level cost
    + nestingCost(tabs)      // nesting cost either 0 or 1
```

If you're scratching your head and wondering what's going on in there, let me break it down.

- self cost
    - `len(eachLine)` counts the length of the string but this includes all the `\t` also
    - we remove all the tabs deliberately because we don't want to double count them in the future and hence `- tabs`

- cost of the previous level
    - straightforward reading from the map entry
- nesting cost
    - this is the edge case - nesting cost will be 0 only for the first level, i.e. the root node
    - for all other levels it'll be just one more than the prev level cost
    - the function `nestingCost` does just that

## practise

- this problem can be practised at [leetcode](https://leetcode.com/problems/longest-absolute-file-path/)
- you can paste the code snippet to verify the solution works for all test cases!
- this was also featured in Daily Coding Problem series and was asked by `Google` as per them :P
