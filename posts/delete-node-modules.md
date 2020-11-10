---
title: Delete node_modules and free up your disk
description: delete node_modules easily and free up disk space
date: 2020-11-10
layout: layouts/post.njk
---

I routinely (almost every month) see my Mac's disk space getting filled and the pesky notifications.

Mostly it's just `node_modules` eating your hard disk up. In the era of trying out all those cool projects by doing `npm i` leaves a heavy residue on your system.

> Use `npx npkill`

This is an amazing CLI which shows you the space taken by each `node_modules` folder and can clean them up by hitting the `spacebar` key.

I forget this nifty `npm` module every single time (hopefully not anymore :P)
