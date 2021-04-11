## Getting Code Coverage for e2e tests run on a Java codebase

I recently was asked to help on a project where they were trying to get the test coverage for **e2e tests** also known as **component tests**. As I come from a JavaScript/NodeJS background I initially tried to lean to the argument that component tests run on the actual application process and not in the context of a test/source file unlike a __unit test__.

The way a Java app runs is quite similar to a NodeJS app. A __bundle__ in Java world is called a __jar__. You can run an app by just running the jar file which contains all the classes and the app dependencies all together.

```bash
java -jar your-application-jar-file.jar
```

That's it, the app server would start and you can run your component/e2e tests using any framework of your liking.

For simplicity I'd choose running manual curls and seeing if the api responds correctly or not. So here if you see we're not dealing with the testing framework's ability to generate code coverage, what we actually want is to see from the time we started our app what code paths were run.

### JaCoCo

This is the library which is used by all `Java` programmers to get coverage for their unit tests. It stands for **Java** **Co**de **Co**verage. (I could've never guessed it in my dreams had I not googled it)