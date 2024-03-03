---
title: so you’re an engineering manager, what next?
description: this post talks about an underrated trait of setting the identity of the team and its vision, which ultimately define the success of the team
layout: layouts/post.njk
date: 2024-03-04
tags:
  - leadership
---

so you became an engineering manager, what next?

i too became one sometime back and found out (the hard way) that there are so many hats i need to wear on a daily basis
- coaching and mentoring the people reporting in, ensuring they are growing and challenging themselves
- acting as program/project manager to deliver projects
- being the glue to hold the team together
- and serving as a shield to save them from top down stress, pressure and incoming barrage of requests, questions and last minute asks!

there’s another aspect which sometimes isn’t visible at the outset － **establishing the identity of the team**; which includes
- defining what the team actually stands for
- providing a framework or a north star to help them say yes or no to work requests
- defining the vision & mission of the team
- socialising the problem statements and domain of the team

this aspect often goes under the radar for two reasons and is probably the most important of all as we see later on.

first, you’ve got a product team that decides what you’ll do, and in that case, the engineering manager can choose to challenge and prioritise the work defined by them instead of setting one’s own roadmap. most often, only tech debt at these teams are pitched by em which certainly define the success of the team.

second, you’re in a bullish phase, where there’s just too much work going around. people are gasping for breath but there’s none available. imagine a new rewrite happening org-wide or within your team. someone somehow managed to convince a bunch of folks who matter (usually the c-suite) that the current version of our software is untenable and we’d need to write it again from scratch to deliver impact at a future time. post this, it’s the easiest time for an engineering manager from a strategy point of view only. the success of the team is only measured by the delivery of the said rewrite or migration that was promised.

but this is not always the case. 

what happens if you don’t have a big migration planned/going-on or you’re in a platform kind of team where the product help is scant? imagine teams like core engineering, data platform, productivity engineering.

_what does your team do then?_
_what defines their success and ultimately yours?_

well, for starters, you can pick up some tech-debt items and keep everyone busy for a while. but every team needs to deliver innovation or impact which would be a bit hard to justify if all the team did was some cleanup and hygiene tasks.

next, you can ping your manager and ask for help. the funny thing about being an engineering manager is that they are hired to take care of the team and drive the charter by themselves. nobody would hand down tasks to you. although you might get some help for the first few times, but after that, you’re not helping your manager if your problem also becomes their problem. at this level you’re supposed to define the charter if it doesn’t exist!

and this was exactly my problem. i was neck-deep in a big migration project but my worry wasn’t about today, it was about tomorrow. 

so instead of directly asking for new projects, i tried first writing a small doc － vision document for my team. it is a 1-pager of sorts to define what the team stands for, its identity.

at the time i was supporting the core app engineering team which was busy writing common libraries and was responsible for the overall big rewrite. i first outlined the various themes the team could work on
- performance & scale
- architecture capabilities
- reliability, stability & observability

i then started adding a few metrics under each of these heads which could help in writing objectives for the team
- performance & scale
    - load performance (app cold starts, lcp for web, individual page load times)
    - render performance (frozen frames for android, inp for web, hangs for ios)
    - battery & n/w usage
    - cpu cores needed for the fleet
- architecture capabilities
    - seo
    - accessibility
    - design system
- reliability, stability & observability
    - crash free rates
    - js errors
    - operational health (jira issues, production bugs, alerts)

i also did some market research on what should be a good north star for each of those metrics. then i added the north star and the current numbers in a table to show where we were; and where we wanted to go!

and then i asked my manager for help. this made the conversation super constructive and we debated heavily on these aspects before narrowing it down to just the absolute priorities. i partnered with him to get buy-ins from the wider org including product and other stakeholders － that look here’s what the team would figure out and we’d prioritise anything that helps us move these metrics while saying no to everything else!

external buy-in is usually the most difficult part as sometimes the priorities that you see may not align with the top leadership. they might not think it worthwhile to invest in your vision just yet while there are other bigger elephants that need addressing. in my case i was lucky, as early into our rewrite there was a big callout of a performance issue on our app.

> nothing scrambles an engineering team like a leadership escalation

usually, this is a bad thing, but this time it was a blessing in disguise. leadership saw that performance needs work; and the buy-in for vision happened just like that.

we managed to convince other leaders that this is indeed a problem that needs constant investment instead of a one time quick fix and my team would be at the helm of it.

the vision also got discussed thoroughly within the team to help explain everyone our purpose and get the team’s heart & soul behind our new okrs which aimed at moving the current metrics closer to our north star quarter over quarter.

now the team wasn’t operating as `android`, `web` & `ios` pods but as 
- performance swat team
- architecture swat team
- stability & reliability swat team

> also known as vertical slicing in delivery parlance; like adding direct value

at the end of the day all that matters is － are you delivering innovation to customers and can you create meaningful workstreams for your teams?

the better you get at it, the better off your teams will be.

finally, there’s a very thin line between relevance and irrelevance, and it’s your vision alone that determines which side your team falls on.

*special thanks to [pragya](https://www.linkedin.com/in/pragya-saha-116a0911/), [rahul](https://www.linkedin.com/in/rahulkrish/), [geetha](https://www.linkedin.com/in/geetha-rajendran1710/) and [amit](https://www.linkedin.com/in/amit-kishore/) for providing valuable feedback and delaying this blog by over 2 weeks :P*

