---
title: Ultimate Docker workflow for frontend development
date: 2020-06-18
---

Docker is amazing. It is the gateway for all amazing things you can do in devops. Once you get the hang of it, you can never go back.

It gives you deterministic builds every single time. Guaranteed! No more of _these_ replies to your Manager :P

> it worked on my machine, really.

# but what is Docker?

Docker is a way to package your app and run it. With _Docker_

- you can define and fix the execution environment of your app
- and totally decouple the app from the host machine

For example say you are working on the latest and greatest app of the year on a mac but your production servers run linux. Such a bummer. You can't say if everything will run as-is on prod cuz you won't know! Anything can go wrong. The dependencies of the app might depend on native libraries, or the os might use _forward slash_ or _backlash_ for paths(windows). So you get the drift; why we need determinism inspite of all the different host/os/environments/ configurations.

# where do I start?

Everything starts with a Dockerfile. To start on a more practical note, I'll try to package/dockerise a React Node app but here _react_ doesn't matter and it could be anything {insert-your-fav-framework-please}

So I've just bootstrapped a react app using _create react app_ ([github snapshot](https://github.com/ankeetmaini/docker-react-nginx/tree/6a5d4e77d777fc23d2a772b23fcf56a85068c410)).

**First question** that needs to be answered before ~~copy-pasting~~ writing a `Dockerfile` is what is the os/flavour of your production environment (usually it's linux) and what're your dependencies?

Since I'm running a node app, I'd want atleast `node` installed on the linux machine.

> Base image: is the thing that helps you define environment and any dependencies your app wants.

The base images for most _(if not all)_ languages/engines/runtimes already exist on [Docker Hub](https://hub.docker.com) by the official authors/companies/orgs.

Like the official [Node image here](https://hub.docker.com/_/node). You can choose from a variety of versions and flavours. I chose [Node v12 installed on a trimmed Debian OS](https://github.com/nodejs/docker-node/blob/9518f46153d0ab2a3ebb20bc24c28ee0c48af208/12/stretch-slim/Dockerfile)

This would be the very first line of the Dockerfile.

```dockerfile
FROM node:12-stretch-slim as test
```

> _layering_ in docker: every line in the Dockerfile becomes a `layer` which translates to an intermediate image. A docker image is made up of a number of these intermediate image layers.

The image layers are cached by docker and they could speed up the entire building process if the cache is not busted. This is the reason why one must be extra careful in writing the Dockerfile.

Always try to see if the top lines/layers are not changed, as every layer from then on will be discarded and built again.

> _multi-stage_ docker builds is one more concept that needs to be discussed before we delve into the art of writing the ultimate Dockerfile

Docker **image size** is of great importance and one should strive to get to the slimmest image possible. It directly improves the time it takes to deploy, saves a lot of storage for you and not to forget the security aspect where the lesser the surface area of your image the less chances of someone finding loopholes in it. And why have something in your prod image that you aren't even using?

_Multi stage_ docker helps in trimming the size of the docker image by giving you the option of removing extra layers in your image and keep only the stuff required. In absence of multi stage docker builds people used multiple Dockerfiles to achieve the same results. You can have one single Dockerfile for both prod and dev.

`Multi stage` lets you have multiple `FROM` statements and ability to copy stuff from one stage to another.

> boundary of a stage extends from the start of a `FROM` statement till another `FROM` statement or till the end of the file

This way you can define different stages for

- static analysis like lint checks
- tests
- build
- final where you just copy the built assets

![](../content/assets/steps-for-docker.png)

## writing the Dockerfile

Switching the focus back to Dockerfile which only has one line specifying the base image. The next thing to do is to define the _working directory_ using the `WORKDIR` command. It creates a directory if it does not exist. It also sets the context of all commands run subsequently with the given directory as the base path.

Also, notice the `as` keyword which is the syntax to name a multi stage build step. This step can now be referenced as `test` from another stage.

```dockerfile
FROM node:12-stretch-slim as test

WORKDIR /docker-react-nginx
```

If you're to peek inside the os right now you'd see

```bash
root@726b2a193270:/# ls -al
total 76
drwxr-xr-x   1 root root 4096 Jun 20 11:21 .
drwxr-xr-x   1 root root 4096 Jun 20 11:21 ..
-rwxr-xr-x   1 root root    0 Jun 20 11:21 .dockerenv
drwxr-xr-x   2 root root 4096 Apr 22 00:00 bin
drwxr-xr-x   2 root root 4096 Feb  1 17:09 boot
drwxr-xr-x   5 root root  360 Jun 20 11:22 dev
drwxr-xr-x  19 root root  608 Jun 18 12:02 docker-react-nginx
drwxr-xr-x   1 root root 4096 Jun 20 11:21 etc
drwxr-xr-x   1 root root 4096 Apr 23 03:09 home
drwxr-xr-x   1 root root 4096 Apr 22 00:00 lib
drwxr-xr-x   2 root root 4096 Apr 22 00:00 lib64
drwxr-xr-x   2 root root 4096 Apr 22 00:00 media
drwxr-xr-x   2 root root 4096 Apr 22 00:00 mnt
drwxr-xr-x   1 root root 4096 Apr 29 02:26 opt
dr-xr-xr-x 174 root root    0 Jun 20 11:21 proc
drwx------   1 root root 4096 Apr 29 02:26 root
drwxr-xr-x   3 root root 4096 Apr 22 00:00 run
drwxr-xr-x   2 root root 4096 Apr 22 00:00 sbin
drwxr-xr-x   2 root root 4096 Apr 22 00:00 srv
dr-xr-xr-x  12 root root    0 Jun 20 11:21 sys
drwxrwxrwt   1 root root 4096 Apr 29 02:26 tmp
drwxr-xr-x   1 root root 4096 Apr 22 00:00 usr
drwxr-xr-x   1 root root 4096 Apr 22 00:00 var
```

You can see a folder `docker-react-nginx` (6th item from the top) created automatically inside what looks like a linux operating system. Fantastic!

## installing dependencies

> Of all the things in frontend development the most frustrating would definitely be `(npm|yarn) install`

If you remember the layering concept I mentioned above can be utilized to optimize this and do this only if dependencies **really** change.

```dockerfile
COPY  package.json yarn.*lock ./
RUN yarn install --pure-lockfile
```

The `package.json` is first copied before installing the dependencies as the docker image is empty and anything you want there has to be copied from host machine or created there.

> Why not copy all the source files and with it `package.json` as well? This could prove detrimental to the time it takes to build the image. Even for commits that don't change the deps the `npm i` would not be cached and would get executed every time.

Doing it separately caches it and Docker runs it only if the checksum of `package.json` or lock file changes. Also note the flag `--pure-lockfile` which will respect the pinned versions and not take the latest semverv matching package as per `~|^` in the package.json

## copy the source files

```dockerfile
COPY  . .
```

## run tests, lints etc

```dockerfile
RUN yarn test
```

I only ran unit tests but you can run all sorts of checks which you'd run on a PR like prettier checks, lint checks, ts checks etc.

## building assets

While building assets it's essential certain environment variables are set correctly, e.g. `NODE_ENV=production`. These and others on which your app depends can be set easily using `ENV` directive.

```dockerfile
ENV NODE_ENV production
# build client JS and server
RUN yarn build
RUN yarn build:server
```

## final stage (well not quite)

At this stage the image is almost ready and can be run as-is. _But, we can do better._

There's a lot of stuff here which can be removed like _node modules_, _source files_, _intermediate image layers_. Let's remove them by taking only the stuff that is needed in a new multi-stage build step.

```dockerfile
# starting from a clean state
FROM node:12-stretch-slim
WORKDIR /docker-react-nginx

COPY --from=test /docker-react-nginx/build .
CMD ["node", "server.js"]
```

If you notice I ran the `server.js` directly using `node`. No node process managers like `PM2` or `forever`. These process managers are used generally because node is single threaded and to have HA (redundancy), parallelism and making sure one process is always up. Even if a process goes down these process managers spawn a new one. But this is not needed in container world. You can get the same redundancy by spinning multiple docker containers using some federation software be it docker swarm, kubernetes etc. (I may do a separate blog post on it in future)

The Dockerfile at this point works, no doubt but there's a lot more that can be done to take it to the next level.

```dockerfile
FROM node:12-stretch-slim as test

WORKDIR /docker-react-nginx

COPY  package.json yarn.*lock ./
RUN yarn install --pure-lockfile

COPY  . .
# env CI as I'm using create react app
# and it runs the tests in watch mode
# untill you make this env true
ENV CI true
RUN yarn test

ENV NODE_ENV production
# build client JS and server
RUN yarn build
RUN yarn build:server

FROM node:12-stretch-slim
WORKDIR /docker-react-nginx

COPY --from=test /docker-react-nginx/build .
CMD ["node", "server.js"]

```

# improvements

## least privilege user

All the commands now are run with `root` user context. Although `root` inside docker container is not the same as `root` in host machine. But the privilege must be limited and should only be just enough to do the task. This is pretty easy to achieve as `node` docker images ship with a user `NODE` which is a non-root user.

Changing the Dockerfile to use this user instead of root. This needs to be changed at a couple of places.

- first when doing the `WORKDIR` as docker creates the directory using root permissions, but if the directory is already created docker would just `cd` instead of `mkdir` and `cd`
- adding `USER` directive to enable the specific user's context for all subsequent `CMD`, `RUN` and `ENTRYPOINT` instructions

```diff
+ RUN mkdir -p /docker-react-nginx && chown -R node:node /docker-react-nginx
+ USER node

WORKDIR /docker-react-nginx
```

- use `NODE` user for copying files from host machine

```diff
# node_modules install
- COPY  package.json yarn.*lock ./
+ COPY  --chown=node:node package.json yarn.*lock ./

# source copy step
- COPY  . .
+ COPY --chown=node:node  . .
```

## dry out base image in FROM statements

- in both of the multi stage builds the `FROM` statements starts and defines the base image as `node:12-stretch-slim`, such repetition :/
- this can be DRYed out using another empty stage at the top

```diff
+ FROM node:12-stretch-slim as base

# test stage
- FROM node:12-stretch-slim as test
+ FROM base as test

# final stage
- FROM node:12-stretch-slim
+ FROM base
```

# improved Dockerfile

```dockerfile
FROM node:12-stretch-slim as base

FROM base as test

# least privilege user
RUN mkdir -p /docker-react-nginx && chown -R node:node /docker-react-nginx
USER node

WORKDIR /docker-react-nginx

# node module deps as a separate layer for caching
COPY  --chown=node:node package.json yarn.*lock ./
RUN yarn install --pure-lockfile

# copy source code
COPY --chown=node:node  . .

# run any tests you want to, linting, prettier, unit etc
ENV CI true
RUN yarn test

ENV NODE_ENV production
# after successful test build your JS assets etc
RUN yarn build
RUN yarn build:server

FROM base as prod
# least privilege user
RUN mkdir -p /docker-react-nginx && chown -R node:node /docker-react-nginx
USER node

WORKDIR /docker-react-nginx

# only copy needed assets, node_modules
# etc will be left in test image, super light prod image
COPY --chown=node:node --from=test /docker-react-nginx/build .
CMD ["node", "server.js"]
```

# checklist

- [x] least previlige user
- [x] DRY base image declarations
- [x] least previlige user
- [ ] dev setup
- [ ] .dockerignore
