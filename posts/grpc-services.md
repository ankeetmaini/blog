---
title: gRPC - the new REST!
description: gRPC web services 
date: 2021-06-26
layout: layouts/post.njk
tags:
  - java
  - gRPC
---

`REST` services is the ubiquitous way of writing APIs for as long as I can remember. Today I want to introduce you to a new way of writing APIs.

> Have you met `gRPC`?

## gRPC

This is a relatively new way to write APIs and consume them as if you're just calling a function. 

- `gRPC` originated from RPC (Remote Procedure Call). The client can just call a stubbed method which will invoke the method at the server side
- all the connection details are abstracted at the client with this stub
- it doesn't use everyone's favourite `JSON` to send the data over the wire, but uses a new format called [Protocol Buffers (protobuf in short)](https://developers.google.com/protocol-buffers)
- `protobuf` is a new way of serializing data in binary format, which cuts down on payload size and readability both

There are lots of pros on using `gRPC` as the way to write services over `REST` that I went ahead and created this big table of analysis for you all :)

## gRPC vs REST

|pivot | gRPC | REST
|------|------|-----|
payload size | **protobuf**: smaller and binary | **json**: bigger in size cuz text |
underlying protocol | http/2 | http/1|
communication | bidirectional cuz http/2 and async | one way, client to server only (no server push) |
integration | just call autogenerated methods | use http clients and painstakingly create the request object manually |
api spec | protofiles and autogenerated code | bug the backend dev, or hope for a swagger link and lastly trial and error |
speed | 20-25 times faster: less payload and less CPU to convert from binary format | slow due to text based payloads and new connection for each request, no multi-plexing available |

## variants

Did I tell you that streaming is a first class citizen in `gRPC` due to HTTP/2 protocol. That means there are four types of APIs you can write and use

1. no streaming at all just like plain `REST` - it's called `unary` api in `gRPC` lingo
2. client calling once and then **server streaming** 
3. **client streaming** and then the server responding once
4. both client and server streaming continuously


![types of api](https://i.imgur.com/SmC5J7K.png)

## defining the interface 

Everything starts from a `proto` file, which contains the definition of the APIs (methods) that the server will implement and clients can call.

I am going to implement a sum service that would take two numbers and return the result.

Below are the definition of the request and response types along with `Sum` service

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

Once this is done, just running `mvn clean install` will generate the request, response and service classes automatically which will be used to add the logic of the API (no sweat!)

> If you're following along, then take a peek at the /target folder and you'll find all the autogenerated code there :)

## making the API ready

Time to see how absolutely lazy it is to create the API

- creating a file (of course), DemoServiceImpl.java (cuz that's how Java folks roll)
- once you create the class, extend it with the auto-generated class of the same name with which you defined the service in the proto file (`DemoService`)
- the auto-generated class has methods for the service, like shown below `sum`
- it generates the boilerplate code so that you can just add the logic

```java
import io.grpc.stub.StreamObserver;

public class DemoServiceImpl extends DemoServiceGrpc.DemoServiceImplBase {
	@Override
	public void sum(Service.SumRequest request, StreamObserver<Service.SumResponse> responseObserver) {
		
	}
}
```

Adding the logic for sum service; simplest logic in the world :P

```java

import io.grpc.stub.StreamObserver;

public class DemoServiceImpl extends DemoServiceGrpc.DemoServiceImplBase {
	@Override
	public void sum(Service.SumRequest request, StreamObserver<Service.SumResponse> responseObserver) {
		int num1 = request.getNum1();
		int num2 = request.getNum2();

		int result = num1 + num2;

		// creating the response payload
		Service.SumResponse response = Service.SumResponse.newBuilder().setSum(result).build();

		// sending the payload
		responseObserver.onNext(response);
		responseObserver.onCompleted();
	}
}

```
