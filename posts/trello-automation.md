---
title: Automate Trello overnight!
description: automate trello with google cloud function 
date: 2021-06-11
layout: layouts/post.njk
tags:
  - trello
  - gcp
  - automation
---

I was recently bitten by the *todo-list-obsession-bug* to make myself super organized.

> I now have so many TODOs and no work done :P

Jokes aside, there are a lot of todo apps, but Trello is my favourite. It has everything you need - except (enough free) automation!

## what happens when you want to create a todo in trello?

You create a *todo*. But it isn't enough. You need to
- add a due date, so that you can get notifications when it's due
- need to add you as the *assignee* so that it shows up in your home-feed

And when you want to finish a *todo*. You need to
- mark that as finished, that it's done
- and drag it to your *done* list

If you just drag it to *done* list and don't check the due date, it continues to show as pending.

So you see, you need some automation. If you want you can choose the business class and spend money to use `Butler`, Trello's in-house automation. But a quick look at the quotas doesn't look as generous and you'll still fall short.

## hacking to the rescue

I used Trello's Webhooks and its rest api to automate the tasks as per my *whims and fantasies*. I used Google Cloud Functions as they've a very generous free quota.

> **Webhooks** are events that trello publishes to a URL (api hosted by you) anytime something happens on your board. Webhooks are nothing but published events that you've subscribed to.

So anytime you add a new todo, a webhook is triggered, and you can decide what to do now. 

> You mark a todo finished you get a call again with the event payload. Payload tells you what changed in the system.


### step 1
- get your Trello API key and token
- the documentation is good 
  - [api docs](https://developer.atlassian.com/cloud/trello/rest/)
  - [api key](https://trello.com/app-key)
  - api token - find the link in the api key doc above

### step 2
- set up your Google cloud function
- you can host it anywhere you want, I just used Google.
- a cloud function that we'd need would look like this

```js
exports.automate = (req, res) => {
  if (req.get("content-type") === "application/json") {
    // we'll define this later
    handle(req.body);
  }

  res.status(200).send("thanks!");
};

```

- make sure you wrap the function with `content-type` as Trello first sends `HEAD` request which won't have a payload and if your function doesn't send an `OK` response then the webhook won't be registered.
- once you create this function and deploy it - you need to make this endpoint public
- go to your cloud function page and choose `Permissions` -> `Add` 

<img src="https://i.imgur.com/FGmzsuC.png" alt="google cloud page for permissions" style="max-width: 100%">

- without this Trello or anyone can't post or access the cloud function's url
- quick tip: to safeguard yourself from someone bulk posting on your api, make sure to set sane limits. 
  - default is 600 per sec, you'd want less than 50 I guess :P
  - and set some alarms on your billing amount so that you're safe

### step 3 
- create some webhooks and test your integrations (using the API curls present in the Trello documentation)
- for local development you can use https://smee.io to see how events look!
  - you can register a separate webhook to a `smee` address so that you can see what events are posted as you play around on your board
- you can create webhooks for the Board id so that all events inside it are relayed to you
  - if you want the id of your board, check the network tab and you'd find it on page refresh

### step 4
- **actual automation time now**, yay!

I now want to achieve a few things for my own workflow. I've started with two boards
- personal
- work

All my personal tasks like bills, taxes, bank, credit cards stuff go into them.
For these tasks 
- I want to set the due date to the next **Saturday**, the weekend if I don't explicitly add a due date.
- and to add me as the owner - I know trello is funny 
- move my card to done list as soon as I mark it complete

To do this, I need to listen on the events and call the appropriate API by reading the docs.

#### example: setting the due date to weekend

Remember the `handle` function in the first code snippet?

```js
function handle({ model, action }) {

  const board = model.name;

  const eventType = action.type;
  const card = action.data.card;
  const cardId = card.id;
  switch (eventType) {
    case "createCard": {

      if (!card.due) {
        updateCard(cardId, {
          due: getDueDate(board), // some ugly logic to get next Saturday
        });
      }
    }
  }
}
```

In the above code snippet, `updateCard` does a plain ol' fetch call.

```js
fetch(`https://api.trello.com/1/cards/${cardId}?due=<date>&key=k&token=t`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
    },
  })

```

Please see the details of exact API call from the docs, most of the params are passed as query params.

### closing

This was a fun evening tinkering the API and making something custom-made. I hope it inspired you to go and build one for yourself too. 

Thanks friends!

(my trello board after doing this - lol)

<img src="https://i.imgur.com/tJZ5mft.png" alt="trello page" style="max-width: 100%">








