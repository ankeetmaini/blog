---
title: 'Crafting a PWA: Part 1 — Setting up the development workflow'
date: 2017-09-18
---

PWAs have been gaining popularity for quite sometime now. Crafting a good, performant experience is continuous journey.

> So before even embarking on the PWA journey, we should invest time on setting up the development workflow.
>
> # This separates great apps from apps that were great once.

For example let’s consider a [GitHub repository](https://github.com/ankeetmaini/react-hn) which has Hacker News front end implemented. This is not a PWA **_yet_**. It’s made with React and Redux.

I want every Pull Request on this repository from now on to be tested and audited for performance issues.

How do I do that? Using a CI server, like [Travis](http://travis-ci.org). With Travis we’ll add support for lint checks, automatic stage deployments, audit using lighthouse and would be in absolute control over the changes happening on the app at all times.

### Step 1 — Adding Travis CI

Enable Travis CI for your repository by going to your profile page

![](https://cdn-images-1.medium.com/max/4948/1*z9SeKBEVcQv1DPzO6w7JYQ.png)

Once you enable the switch, you’d then need to add a .travis.yml which will instruct Travis on what to do at different stages of the build.

```yml
language: node_js
node_js:
  - '7'
script: npm run lint
cache:
  directories:
    - 'node_modules'
```

Above is a simple .travis.yml which runs lint checks on PR.

### Step — 2: Adding stage deployments

1. Being able to see the code changes in action helps the reviewer a lot to merge your changes with confidence.

2. I’ll use [Now](https://zeit.co/now) to deploy your code to a unique stage URL once a Pull Request is created. You can use [Surge](http://surge.sh/) as well.

3. Our challenge is to integrate Now deployments from Travis so that anytime a PR is created/updated the new changes are deployed and ready to be seen/audited by other reviewers.

4. [now-travis](https://github.com/eliperelman/now-travis) is an excellent utility to deploy to now. The thing with now deployments is — _Every time you deploy a project, now will provide you with a new, unique URL._

5. But [now-travis](https://github.com/eliperelman/now-travis) doesn’t provide the ability to save the URL so that we can use it later to run lighthouse audits. I’ll cover this bit in a little while.

6. So I added a change to save the deployed URL to a temporary file and created a Pull Request which hasn’t been merged as of now. You can use this fork for your setup: [https://github.com/ankeetmaini/now-travis](https://github.com/ankeetmaini/now-travis)

7. npm i -D ankeetmaini/now-travis This will add **now-travis** as a dev dependency to your project.

8. Follow the instructions in the [README](https://github.com/ankeetmaini/now-travis/blob/master/README.md) to integrate now deployments with Travis.

9. now uses npm start or npm run now-start to start your application. It gives preference to now-\* commands so in this case now-start would be executed instead of npm start. This is useful because in dev mode also I’ll use npm start and in production I may need to pass NODE_ENV=production. Or you may need to send something else entirely.

10. Update your .travis.yml to run now-travis after successful build. See this line of code in after_script
    `*NOW_ALIAS=react-hn-ankeetmaini node_modules/.bin/now-travis — file=now_url*`

```
language: node_js
node_js:
  - '7'
script: npm run lint
after_script:
  - NOW_ALIAS=react-hn-ankeetmaini node_modules/.bin/now-travis --file=now_url
branches:
  only:
    - master
cache:
  directories:
    - node_modules
env:
  global:
    secure: jMH9lqo0E83BhZR8oZiXM...
```

With this setup now Travis will deploy every pull request¹. You can see in the below image that a Staging deployment was done.

![CI checks PR for lint, deploys and audits app performance](https://cdn-images-1.medium.com/max/3644/1*4ASToWVoqCPXkdekrd6x-A.png)_CI checks PR for lint, deploys and audits app performance_

### Step — 3: Integrating Lighthouse

1. [Lighthouse](https://developers.google.com/web/tools/lighthouse/) is an audit tool by Google which checks your app against a number of points and scores it.

2. It’s vital to run this audit continuously, so as to always keep our app fast and performant. We’ll use [lighthouse-ci](https://github.com/ebidel/lighthouse-ci) to integrate it with Travis.

3. Add [lighthousebot](https://github.com/lighthousebot) as a collaborator in your repository, so that it can update the status of your PR and post a comment with the Lighthouse score.

4. [Request an API key](https://github.com/ebidel/lighthouse-ci#get-an-api-key) and add an ENV variable in the Travis. This isn’t necessary as of now, but will be done in the future.

5. Since _now_ deploys our app to a unique URL, we save it in a file named now-url. We need to read this URL from the file and give it as an input to lighthouse-ci.

6. To do this I created a file _run-lighthouse.js_ at the root of the folder, with the following code. _lighthouse-ci_ takes [following options](https://github.com/ebidel/lighthouse-ci#options) and we’re passing the same in the below file.

```js
#! /usr/bin/env node

const fs = require('fs')
const argv = require('yargs').argv
const childProcess = require('child_process')

const path = require('path')

const fileName = argv.file

const file = fs.readdirSync(__dirname).filter(f => f === fileName)[0]
const nowUrl = fs.readFileSync(file).toString()

// bail, we did not get the URL
if (!nowUrl) process.exit(1)

const lighthouseCi = path.resolve(__dirname, 'node_modules', 'lighthouse-ci')
const child = childProcess.fork(lighthouseCi, [
  '--score',
  93,
  '--runner',
  'wpt',
  nowUrl,
])

child.on('error', err => {
  console.error(err)
  process.exit(1)
})
```

7. Lastly add an entry into .travis.yml in the **after_script** section to run the above file after the stage deployment is done. _— file_ is the argument which takes in the file name from which the deployed URL needs to be read. This will now evaluate your stage deployment and fail² the PR if you’ve not passed a minScore and also post a comment with your lighthouse score, see this PR [https://github.com/ankeetmaini/react-hn/pull/9](https://github.com/ankeetmaini/react-hn/pull/9)

   ./run-lighthouse.js --file=now_url

![](https://cdn-images-1.medium.com/max/3296/1*4Jzgvr9vD1YthNj89ws_YQ.png)

**Congratulations!**, you’ve successfully setup an awesome workflow. All the code used in the citations [lives here](https://github.com/ankeetmaini/react-hn).

[1] since free OSS plan in now can only have three active deployments at a time, you might need to manually remove deployments using now rm id

[2] right now the lightousebot will only post a comment and not fail your PR because of insufficient rights on the repository, the above screenshot which shows failing of my PR is because I’ve run a separate instance of lighthouse-ci for demo purposes. [See this issue for more details](https://github.com/ebidel/lighthouse-ci/issues/8)
