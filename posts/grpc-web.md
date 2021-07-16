---
title: Consuming gRPC services from web
description: gRPC web browser javascript
layout: layouts/post.njk
tags:
  - gRPC
  - web
---

In my [last post](https://ankeetmaini.dev/posts/grpc-services/) I went over how gRPC fares against the REST services. 

Today I want to walk you through on what's it like to call them from frontend apps.

## philosophy

- the whole point of gRPC services is that they confirm to a schema/contract which is defined in a protobuf file (a new binary format)
- this makes it easier to consume those services from other services; as they can infer exactly not only the request/response payloads but what different services there are to call!
- this is amazing for
    - discoverability: you don't have to refer a doc to find the api signatures, or talk to a person to confirm - the `.proto` file is all you need
    - binding: you can be sure that the contract is super tight and not dependent on some verbal/mutual agreement _(well almost)_
        - I don't think someone will hand you out old `.proto` files though :P

> so what's the catch? sounds too good to be true

## browser

The basic tenet of gRPC is that it works on **http 2**, and that's a problem for web.

### Why??

There's no way a browser can mandate the transport protocol to the server whether it's `HTTP 1` or `HTTP 2`.

> ever seen a parameter in `fetch` specfying the transport protocol? 

**No**. I know right!

This happens because:

- not all browser versions support HTTP 2.0
- and even if they did, this is too low level details from an app development wise; you shouldn't have to care about the protocol and automatically best decision is taken for you

And **SSL/TLS**

Even though `HTTP 2` can work without SSL but browsers have taken a call that they won't.

## solution

A ready-made proxy available to seamlessly convert gRPC calls from `http1 <-> http2` and taking care of all other differences.

There are two proxies you can use:
- [envoy with grpc filter](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/grpc_web_filter#config-http-filters-grpc-web)
- [go proxy](https://github.com/improbable-eng/grpc-web/tree/master/go/grpcwebproxy)

I will use the second in this post today.

## consuming the gRPC service

### step 1: get hold of the .proto file

Using [this .proto file](https://github.com/ankeetmaini/grpc-java-service/blob/main/service/src/main/proto/service.proto) for the little demo!

```protobuf
syntax = 'proto3';

message SumRequest {
	int32 num1 = 1;
	int32 num2 = 2;
}

message SumResponse {
	int32 sum = 1;
}

service DemoService {
	rpc Sum(SumRequest) returns (SumResponse);
}
```

This tells that there's a `DemoService` which has an API called `Sum` which take `SumRequest` and return `SumResponse`.

### step 2: generate client stubs

The single most high point of consuming gRPC service to me is to not integrate the API by hand like creating payloads, calling each API with correct URL, query params etc.

Here, you just generate the code at build time, and you're done!

Install [protoc](https://grpc.io/docs/protoc-installation/), the official protobuf compiler which reads the `.proto` file and spits out **js** code. More info on installing it locally [here](https://github.com/grpc/grpc-web#code-generator-plugin)

```bash
no one:
literally no one:

me: I eat, drink and sleep `Typescript`.
```

If you're like me, then no need to worry as there's an amazing plugin that creates the types automatically for the generated code.

One-liner command to generate the code from `.proto` file.

```bash
protoc \
  --js_out=import_style=commonjs,binary:./src/generated \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:./src/generated \
  -I=../service/src/main/proto \
  ../service/src/main/proto/*.proto
```

The `protoc` command takes some options which are self-explanatory 
- plugin: where I use this to generate TS models of the code
- js_out: to specify the style of generated code, commonjs and the location folder
- -I: takes in the directory where the .proto file resides
- and lastly the proto file pattern or a single file if you wish!

On running this, the `generated` folder is populated with [these files](https://github.com/ankeetmaini/grpc-java-service/tree/main/web-app/src/generated)

### step 3: make the API request!

At this point of time you've everything you need to make the API call. 

- import the request/response and Service class
- create the channel with the endpoint of the server (just once)
- get the response

```ts
import { DemoServiceClient } from "./generated/ServiceServiceClientPb";
import { SumRequest } from "./generated/service_pb";

// request creation - all typescript!
const request = new SumRequest();
request
    .setNum1(a)
    .setNum2(b);

// client creation
const client = new DemoServiceClient("http://localhost:3000/api");

// call methods instead of firing api
const response = await client.sum(request, {'some-header': 'probably'});
```

If you're to hover on the `client.sum` method, you can see its signature.

```ts
(method) DemoServiceClient.sum(request: SumRequest, metadata: any): Promise<SumResponse> (+1 overload)
```

> It returns a Promise, wow with strongly typed response.

NO TYPE-CASTING!

I wrote a small webpage to view this on a browser. Dockerized it, so that you can clone and run one command to get everything up!

```bash
git clone git@github.com:ankeetmaini/grpc-java-service.git
docker-compose up --build
```
The app would be accessible on `localhost:3000`.

It uses the go web proxy to smoothen over the gaps of grpc-web and grpc protocol.


