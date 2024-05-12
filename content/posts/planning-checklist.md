---
title: planning checklist for people in tech
description: this post tries to add a method to madness which runs amok every 3 months and both leaders and teams run helter-skelter to put an exciting list of okrs together to executing them
layout: layouts/post.njk
date: 2024-05-13
tags:
  - leadership
  - planning
---

it's almost may and in just about a month a brand new quarter would start which comes with a possibility of endless opportunities in engg roadmap parlance. 

we've come a long way from knowing what would get done years in advance, like a construction building, say a new mall for which once the blueprint is finalised, you can usually estimate the multi-year work upfront at least on paper before you dive deep into execution. but who knew building software on time is even tougher or have we deliberately made it that way?

we work in sprints, we put our heads down for two weeks and then again and again. some teams decide within these two weeks what next to do and sort of groom their stories with no hints or indication of what lies ahead and coin words like agile :P

but there's just too much flux in this way. there's so much extra time being spent deciding every two weeks what to do. does it even matter right now or can be pushed out?

in companies, work usually happens around big projects and launches. and they have dates or an expected date of launch. everything begins from there and you usually back calculate.

so with above context, how do you decide what gets done in a quarter? what actually is **planning**?

> you can choose to wing it yolo style because life's too short to plan anything, because seriously who cares?

**but you should care, as if your life depends on it**

i've done it both ways (just don't tell my boss though), planned (roadmaps, sprints) on the fly and derived them meticulously by using the below framework. the difference was monumental in the quality of deliverables and the morale of the team!

earlier i'd have a meeting every two weeks, rethinking priorities and not just me, my entire team. i thought having them on the call would give them visibility but all they saw was uncertainty and jitteriness. they felt as if nobody had any idea what exactly needed to be done, and the entire team was busy pitching things they would like to do instead which might not be in the best interest of the organisation. it doesn’t make sense for everyone to work on reducing build times or trying out a new framework which came out yesterday!

so i had to change, and below is what i put together after i got humiliated at a party with my peers and bosses :P (no surprises there)

## 1. draft objectives & key results
<table>
<tbody>
<tr>
    <td>who</td>
    <td>ems and pms should deliberate and debate on the most important problems and get leadership buy-in.<br><br>some orgs have yearly okrs published by the ceo/cto's office which can be translated into okrs at your level which is nothing but matching your efforts to meet the company goals</td>
  </tr>
  <tr>
    <td>when</td>
    <td>40 days before quarter starts (q - 40 days)</td>
  </tr>
  <tr>
    <td>output</td>
    <td>objectives &amp; key results with impact</td>
  </tr>
</tbody>
</table>

<div class="message-box">

e.g. 
- objective: improve the conversion funnel by 20% on our e-commerce app
- key results:
  - reduce page load of product page from 6s → 3.5s
  - remove friction on payment page by showing upi as the top payment mode
  - launch 1-click purchase from home to checkout for high value items like phones & appliances

</div>

## 2. come up with initiatives for each key result (break-up & scope)
<table>
<tbody>
<tr>
    <td>who</td>
    <td>staff+ engineers breakdown the key result into solid activities which can be done by 1 person in about 2 weeks. <br><br>in short they define the scope and breakdown big problem statements into short palatable stories for the team</td>
  </tr>
  <tr>
    <td>when</td>
    <td>a month before the quarter starts (q - 30 days)</td>
  </tr>
  <tr>
    <td>output</td>
    <td>breakdown and scope definition of activities/tasks with t-shirt size (broad) estimates</td>
  </tr>
</tbody>
</table>

<div class="message-box">

e.g.
- key result: reduce page load of product page from 6s → 3.5s
- initiatives
  - reduce the javascript bundle size by 120kb to improve time to interactive
    - remove lodash
    - write a lighter implementation for the product page image component which is 100kb in size
  - 🔺 enable edge caching for product listing call to speed up the api response time
  - 🔺 partial painting of product page reusing the state of homepage while the api call is in progress

> 🔺 means that the initiative needs refinement and is a fuzzy item. it will usually require an hld/lld/1-pager and would probably get executed as a spike item where concrete details would get added after a deep-dive or a small poc.
>> the staff+ engineers would also have to make a case as to why do they think the above initiative is needed with roi in mind as well, because such fuzzy initiatives require greater engineering efforts and often run into risk during execution

</div>

## 3. prepare a plan with sequencing, owners and known risks
<table>
<tbody>
<tr>
    <td>who</td>
    <td>tech leads and ems define the sequencing in a gantt chart to see what's landing when and if there's a scope for parallelisation. <br><br>they also define the owners for each initiative and list down risks which needs to be under close watch</td>
  </tr>
  <tr>
    <td>when</td>
    <td>2 weeks before quarter starts (q - 15 days)</td>
  </tr>
  <tr>
    <td>output</td>
    <td>gantt chart, owners & risk table</td>
  </tr>
</tbody>
</table>

tech leads & ems create a gantt chart at this point to see how much work is possible taking into account the t-shirt size estimations & people's leaves.

### quick reference to t-shirt sizing & project recommendations

| 👕 | estimate in person weeks | notes
|-----|-------|----
s | 2 person weeks | can be lead & delivered by sde1/2
m | 4 person weeks | needs at least a senior engineer to see it through
l | 8 person weeks | needs a staff engineer to lead and constant architecture reviews
xl | 16 person weeks | multi-quarter effort and needs a staff+ engineer to lead & deliver
xxl | 20+ person weeks | multi-quarter effort and needs an architect to lead and breakdown


next would be defining the owners, which usually is done by first talking to the owners and setting the expectations of leading a project.

> i usually make them owners of the respective epic where they are responsible to updating it weekly with crisp status updates and highlighting risks which need leadership attention.

lastly you need to surface up the known risks before you even begin the quarter. the risks could range from resourcing or dependencies on other teams. each of the risks need a date by which it goes away or a date by which the initiative itself gets scrapped.

for. e.g if you have an xl item but no staff engineer; then if you can't get the engineer by so & so date the initiative becomes no-go. similarly if you need an api from another team to build a feature but the dependent team hasn't prioritised then also your initiative will become a no-go

at this point you'll have to escalate this to your leadership to take further calls on the next steps.

*i've deliberately left covering the gantt chart in details as it's a standard item but may cover it in a future post.*


## 4. sprint grooming (bi-weekly before sprint)
<table>
<tbody>
<tr>
    <td>who</td>
    <td>only tech leads, ems, pms and epic owners</td>
  </tr>
  <tr>
    <td>when</td>
    <td>1 week before sprint starts (s - 7 days)</td>
  </tr>
  <tr>
    <td>output</td>
    <td>stories with scope, exit criteria and context</td>
  </tr>
</tbody>
</table>

*here the stories can be implementation tasks, or creation of hld, lld or a poc*

## 5. sprint planning (bi-weekly)
<table>
<tbody>
<tr>
    <td>who</td>
    <td>entire team</td>
  </tr>
  <tr>
    <td>when</td>
    <td>just before or on sprint start (s - 2 days)</td>
  </tr>
  <tr>
    <td>output</td>
    <td>stories assigned to people with story points assigned</td>
  </tr>
</tbody>
</table>

if you reached till here, then you can see **planning** is a whole team activity but there's a method to this madness. every person on the team comes into the exercise at different times and for different things.

if as an engineering manager you just buckle up and tell the team to do x, y & z they'll never commit to it. you don't want to hire smart people and then do the thinking for them. let them come up with solutions and let them surprise you in a good way. 

this is the only way to get 200% and pave the way for building a high-performing team which goes over & beyond not because you're pressurising them but because they like solving complex challenges and getting better at their craft

*special thanks to [rahul](https://www.linkedin.com/in/rahulkrish/), [rajesh](https://www.linkedin.com/in/rnaik/), [deepanshu](https://www.linkedin.com/in/androiddeepanshu/), and [sajan](https://www.linkedin.com/in/sajankedia/) for telling me how stupid i was at the absolute wrong time when i was having fun at a party in indiranagar 😭*