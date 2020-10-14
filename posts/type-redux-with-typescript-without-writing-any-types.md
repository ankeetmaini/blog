---
title: Type Redux with TypeScript without writing any types*!
description: This is a post on using redux in a fun way!
date: 2019-01-12
tags:
  - redux
  - typescript
layout: layouts/post.njk
---

Don’t believe me??

Redux has been infamous lately for bringing a lot of boilerplate and ceremony, which we’ll see isn’t quite true. It really shines when you add Types to it but writing _Types_ take time. And who has time when you’ve to ship a ton of features?

I’ve been doing some experiments on how to reduce the types, plus all third-party dependencies to something simple and yet tight.

### Actions and their problems

Redux actions are plain objects which are sent(dispatched) to the store and ultimately end up changing state via reducers. Any plain object as long as it has a `type` field can be called an action.

```js
// valid actions
{type: 'INCREMENT'}
{type: 'ADD_TODO', text: 'Finish this blog'}
```

But things are not this simple if you want to make some API calls, as with each API you’d fire three different actions to handle all probable states in your app

```js
// just before calling it
{type: 'API_CALL_LOADING', payload: {}}

// on success
{type: 'API_CALL_SUCCESS', payload: {...blah}}

// on error
{type: 'API_CALL_ERROR', payload: Error()}
```

You basically do this by using [redux-thunk](https://github.com/reduxjs/redux-thunk), and the corresponding code looks like this

```js
// https://gist.github.com/markerikson/ea4d0a6ce56ee479fe8b356e099f857e#file-redux-thunk-examples-js-L2
// The classic AJAX call - dispatch before the request, and after it comes back
function myThunkActionCreator(someValue) {
  return (dispatch, getState) => {
    dispatch({ type: "REQUEST_STARTED" })

    myAjaxLib.post("/someEndpoint", { data: someValue }).then(
      response => dispatch({ type: "REQUEST_SUCCEEDED", payload: response }),
      error => dispatch({ type: "REQUEST_FAILED", error: error })
    )
  }
}
```

There are two problems with this

- one, verbosity — you’d have to remember to create a function which returns a function and takes dispatch as argument and then trigger three actions on success, error and before making the request, every . single . time.

- second, it gives you a (bad) place to add logic — the action dispatch part is now **dangerously** mixed with API logic. God forbid if tomorrow you’d want to pass some extra header, add an extra then handler to process it/transform it, you’d have to come and wade through all action related code too.

**We’ll cut through all of that.**

### Defining actions

As we’ve learnt type is very important in an action, so we’ll create a file and list down all possible action types. You can create multiple files too, I prefer one.

![listing action types for the app](https://i.imgur.com/MZBBW9zl.png)_listing action types for the app_

With types out of the way, we need a solid way to create actions. Doing dispatch({type: ADD_TODO, payload: 'Finish blog post'}) from your components isn’t a great idea, because it’s verbose plus your action can take different shapes, like with type someone can send payload or text — you get the drift. We need to strongly type our action object.

```typescript
import { AnyAction } from "redux"

interface Payload<U, V> {
  readonly req: U
  readonly res: V
}

export interface Action<T extends string, U, V> extends AnyAction {
  readonly type: T
  readonly payload: Payload<U, V>
}
```

With this every action in the app will have a defined structure. Let’s now create a simple function to create this action object for us.

```typescript
export function createAction<T extends string, U, V>(
  type: T,
  req: U,
  res: V
): Action<T, U, V> {
  return {
    type,
    payload: {
      req,
      res,
    },
  }
}
```

With this one can easily create actions in one line, without worrying about the structure and TypeScript will automatically pick up the types.

Moving on to async thunk actions, which will come in handy for API calls. As I talked earlier of splitting the action dispatch logic and the actual API calling, let’s define all API calls in a separate file.

![Imgur](https://i.imgur.com/qvvYAEAl.png)

We can now use getDoggo API in one/many of our actions.

Let’s now define a function which would create a thunk action. (I’ve added extensive comments). This is without types to make it a little easier to grok. This function basically creates a thunk for you. It

- dispatches loading action just before making the API call

- makes the API call

- dispatches success and failure automatically

```typescript
// actions -> an array of three action types to be fired for loading, success and error
// api -> a function which returns a promise
export function createAsyncAction(actions, api) {
  return apiArguments => {
    // this function will be called by redux-thunk middleware
    // dispatch will be passed by the middleware
    return dispatch => {
      const [requestType, successType, errorType] = actions
      // triggering the action before making API call
      // use this to show loaders and stuff
      dispatch(createAction(requestType, apiArguments, {}))
      // calling the API with api arguments
      return Promise.resolve(api(apiArguments))
        .then(res => {
          // dispatching the success action
          // passing the request params as well in case you'd need in the reducer
          dispatch(createAction(successType, apiArguments, res))
        })
        .catch(err => {
          // in case of error, dispatching error action
          dispatch(createAction(errorType, apiArguments, err))
        })
    }
  }
}
```

The typed version would look something like this.

```ts
type API<U, V> = (args?: U) => Promise<V>;
export function createAsyncAction<
  A extends string,
  B extends string,
  C extends string,
  S,
  U,
  V
>(actions: [A, B, C], api: API<U, V>) {
  return (
    apiArgs?: U
  ): ThunkAction<
    Promise<Action<B, U | undefined, V> | void>,
    S,
    undefined,
    | Action<A, U | undefined, {}>
    | Action<B, U | undefined, V>
    | Action<C, U | undefined, any>
  > => dispatch => {
    const [requestType, successType, errorType] = actions
    dispatch(createAction(requestType, apiArgs, {}))
    return Promise.resolve(api(apiArgs)).then(
      response => {
        const action = createAction(successType, apiArgs, response)
        dispatch(action)
        return action
      },
      err => {
        const action = createAction(errorType, apiArgs, err)
        dispatch(action)
      }
    )
  }
}
```

With this out of the way, let’s use this to create Actions. I like to keep the action creators into a separate file of their own like in the screenshot below.

![](https://i.imgur.com/chEbZEWl.png)

This is amazing. We have 4 action creators in the lines of just one thunk that we saw earlier. Neat!

Our next problem is to determine the action object types that will be emitted to the store once you call these from the respective React components. Because each of the action needs to be handled at the reducer an we surely being lazy af, don’t want to type all the actions by hand.

**Can we infer Action objects via TypeScript? Yes, we can.**

```typescript
type Enumerate<T> = T[keyof T]
export type ActionObjectTypes<T> = Enumerate<
  {
    [K in keyof T]: T[K] extends (
      args: any
    ) => ThunkAction<any, any, any, infer A>
      ? A
      : T[K] extends (args: any) => Action<any, any, any> // for normal createAction
      ? ReturnType<T[K]>
      : never
  }
>
```

Here, we used infer and conditional types and ReturnType which were recently added in TypeScript. They take the real action object and return a union of all the Action types.

Using them is as easy as this. (See the last line of the file.)

![Imgur](https://i.imgur.com/4xaoDEvl.png)

If you clearly see the tooltip in the picture the action creators embed the Action type info and instead of duplicating it inside our codebase we could just infer them. If I hover over AppActionObjectTypes it shows a beautiful list of types it inferred.

![action object types automatically inferred](https://i.imgur.com/Ve8jLzGl.png)_action object types automatically inferred_

Let’s handle them in a reducer. Just to mimic a big app I’ll create two reducers one will hold Todos and another will hold Doggos and will use combineReducers

![Imgur](https://i.imgur.com/NKUedRMl.png)

How we get excellent autocomplete on action.type! We also get correct payload types based on the Action Type.

Combining the reducers… Well, while we’re at it, we somehow also need to calculate the entire App State type which is needed by combineReducer and later in the components using connect. We already know the return type of each reducer makes up the state. Using the same info we can write a type that does this thing automatically for us.

```typescript
export type GetReducerState<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => infer Q ? Q : never
}
```

And using it is as easy as this.

![see the type extracted by GetReducerState in the tooltip](https://i.imgur.com/9QwN0h5l.png)_see the type extracted by GetReducerState in the tooltip_

With actions and reducers in place, time to create our store.

```typescript
import reducer, { IAppState } from "./reducers"
import { createStore, applyMiddleware } from "redux"
import thunk, { ThunkMiddleware } from "redux-thunk"
import { AppActionObjectTypes } from "./actions/Actions"

export default createStore(
  reducer,
  applyMiddleware(thunk as ThunkMiddleware<IAppState, AppActionObjectTypes>)
)
```

Moving on to creating components to actually see the state in action. There are couple of things we need to take care of

1. state props — these are the props that we need from redux store, and we use **mapStateToProps** for that, and since we would use these props inside components we’d need to define there types as well. In the below code example we define **TStateProps** by reusing **mapStateToProps**. So no extra types defined. And **TStateProps** will always be in sync as it depends directly on mapStateToProps function. We are not re-declaring types here which can then easily go out of sync.

1. dispatch props — these are the action creators that we’d use in our components as props. **TDispatchProps** contain the types of these props. Why isn’t it as straightforward as **TStateProps**? Because, if you remember how we declared our action creators using **createAction** and **createAsyncAction**, latter is a function which returns another function which returns a promise (it’s actually called by redux-thunk middleware), but we don’t want to do that in our components, once we call it it should return a Promise. Correct?

1. Enter [bindActionCreators](https://redux.js.org/api/bindactioncreators), they help us map our actual action with dispatch as a convenience method. You’ll see a **GetConnectDispatchPropsType** used in the below gist ([source here](https://github.com/ankeetmaini/react-app-redux-ts/blob/master/src/utils/actionCreatorTypes.ts#L79))for Todos.tsx component to get the correct **TDispatchProps**. It’s a small utility type which helps to shunt the action creator type to what we’d like instead of `() => ThunkAction => Promise` to `() => Promise`

1. With that we type our component and get it working. I’ve added comments inline.

```jsx
import React, { Component } from 'react'
import { Dispatch } from 'redux'
import { AppState } from '../reducers'
import AppActions from '../actions/Actions'
import { GetConnectDispatchPropsType } from '../utils/actionCreatorTypes'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// state type, contains only one field of type string
type State = {
  todo: string
}

// to determine the type of state props that will be provided by redux
type TStateProps = ReturnType<typeof mapStateToProps>
// needed to properly type dispatch props type
type TBindActionCreators = typeof AppActions
type TDispatchProps = GetConnectDispatchPropsType<TBindActionCreators>

type AllProps = TStateProps & TDispatchProps

class Todos extends Component<AllProps, State> {
  state = {
    todo: '',
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ todo: e.target.value })
  }

  submit = (e: React.FormEvent) => {
    e.preventDefault()
    // triggering the redux action here
    this.props.addTodo(this.state.todo)
    // clear the text box
    this.setState({ todo: '' })
  }

  render() {
    return (
      <div>
        <h1>All Todos</h1>
        <form onSubmit={this.submit}>
          <input
            type="text"
            value={this.state.todo}
            onChange={this.handleChange}
          />
        </form>
        <div>
          <h3>pending todos</h3>
          <ol>
            {this.props.todos.map(t => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  todos: state.todos,
})
// binding our actions with dispatch for thunk.
// pretty much dumb boilerplate
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<TBindActionCreators, TDispatchProps>(AppActions, dispatch)

/**
 * connect takes in 4 generic types
 * 1. state props you need from redux
 * 2. dispatch props from redux to trigger actions
 * 3. own props that you need from your parent component
 * 4. app state that we dervied previously for combineReducers
 */
export default connect<TStateProps, TDispatchProps, {}, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(Todos)
```

Similarly, we can type all facets of our app from actions to reducers to components and all important store. I created [another component](https://github.com/ankeetmaini/react-app-redux-ts/blob/master/src/components/Doggos.tsx) which makes API calls. The typings for that are extremely similar to the above component.

Coming back to my promise of not writing any types — we’re still doing great. Because we have never defined an actual concrete interface or type. We’re inferring from already existing code blocks. Even in the component dispatch and state props are more of a boilerplate than _break-your-head-over-figuring-types_. [All the types that we created exist in only one util file.](https://github.com/ankeetmaini/react-app-redux-ts/blob/master/src/utils/actionCreatorTypes.ts)

[The code is at GitHub](https://github.com/ankeetmaini/react-app-redux-ts). And the app looks like below gif, you can see API requests for Dog images and plain actions to add TODOs.

![Imgur](https://i.imgur.com/1rUN6GU.gif)

I hope you found this approach helpful! In case you want to improve or have more ideas feel free to [create an issue](https://github.com/ankeetmaini/react-app-redux-ts/issues) or hit me up on [Twitter](https://twitter.com/ankeetmaini).

Thanks!