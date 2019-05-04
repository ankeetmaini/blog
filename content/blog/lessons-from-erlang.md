---
title: Software lessons from ERLANG
date: 2019-04-22
---

## What's an **Architecture** anyway?

- problem statement
  - Software architectures are not general purpose, but specific. So first and foremost is defining the problem we're trying to solve
- central ideas of software construction
- guidelines
  - more like lints so that the entire project looks like one
- a set of pre-defined components
  - using which it's easier to build complex components on top of them
- a way of configuring things
  - how to re-configure while it's still ON, or how to start/stop etc
- a way of describing things
  - how can we describe the interface of a component?
  - how do we transfer messages from one system to another?

## Characteristics of a complex sytem (telecom in case of ERLANG)

- concurrency
  > able to handle tens of thousands of concurrent activities
- soft real-time
  > ability to configure a large number of timers and act based on the rules configured
- distributed
  > easy to go from a single node to multi node system
- hard-ware interaction
  > to be able to monitor and control large physical hardwares, with efficient device drivers etc
- complex functionalities which will mature over time
