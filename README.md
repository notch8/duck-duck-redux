# Asyncronous Actions

In Duck, Duck, Meteor, we refactored the application to use the redux pattern.  In our ```fetchAsteroids()``` action, we're still using the cached call out to the api to load data, and not actually making the request.  Let's take a look at how we can hook up the fetch request into Redux.

## A Review of fetch()

Recall this diagram of a typical call out to a server for information

![user fetch](https://s3.amazonaws.com/learn-site/curriculum/redux/user-request.jpg)

Asyncrounous calls within a React/Redux application require special techniques to allow the request to go out and have the application remain functional and responsive to the user while waiting for the response from the server to come back and be processed.  It would not be a great experience for our users if they were forced to sit there staring at a frozen browser window while the back end server is processing their request.  Instead, we use promises and thunks in the app to fire off the request and allow the app to go about its other business until the response from the request comes back.

Here is the ```fetch()``` request we were using in the first version of Duck, Duck, Meteor:

```javascript
 fetch("http://backend-server.com").then((rawResponse)=>{
   return rawResponse.json()
 }).then((parsedResponse) => {
   //.... Update the component with the data from the response
 })
```
Fetch returns a promise, and is therefor "non-blocking", which is exactly what we want.  We can use fetch in the app to fire off the request, go about its business, and when the response comes in, update the Redux store with the new information.

## Using fetch() in a Redux action

We know about actions and thunks in Redux, and we know how ```fetch()``` works so we have all of the pieces we need to make asyncronous calls in our application.  We're ready work with live data from the Nasa api, and finish our application.  Let's start by refactoring the App Component a bit to make it easier to work with the api call.  Here's what App currently looks like:

```javascript
class App extends Component {
  constructor(props){
    super(props)
    let today = new Date()
    this.state = {
      apiKey: "NT8V130OXGjNIRbuEbvygKwFipek7WxYXI8nn1o9",
      startDate: `${today.getFullYear()}-${today.getMonth() +1}-${today.getDate()}`,
      apiUrl: "https://api.nasa.gov/neo/rest/v1/feed",
      asteroids: []
    }
  }
  componentWillMount(){
    this.props.dispatch(fetchAsteroids())
  }

  // ...
}
```

We want to refactor the components of the URL into an object that we can pass to our action that will make the request:

```javascript
class App extends Component {
  constructor(props){
    super(props)
    let today = new Date()
    this.state = {
      // Move the the URL parts into an object that we can easily pass to the action
      asteroidsRequest: {
        apiKey: "NT8V130OXGjNIRbuEbvygKwFipek7WxYXI8nn1o9",
        startDate: `${today.getFullYear()}-${today.getMonth() +1}-${today.getDate()}`,
        apiUrl: "https://api.nasa.gov/neo/rest/v1/feed"
      }
      // Remove the asteroids: [] part, because that is in Redux now!
    }
  }
  componentWillMount(){
    // Pass the URL object into the action
    this.props.dispatch(fetchAsteroids(this.state.asteroidsRequest))
  }

  //...
}

```

With that done, the ```fetchAsteroids()``` action has all it needs to fire off the request for asteroid data.  Here is what ```fetchAsteroids()``` currently looks like:

```javascript
export function fetchAsteroids(){
  let neoData = nearEathObjects.near_earth_objects
  let newAsteroids = []
  Object.keys(neoData).forEach((date)=>{
    // Parse the asteroid data for the details we want to use
  })

  return {
    type: 'FETCHED_ASTEROIDS',
    payload: newAsteroids
  }
}
```

We're now passing in an URL object, so lets update the function to accept that:

```javascript
export function fetchAsteroids(apiUrl){
  // not changing anything else yet
}
```

Next, we need to add some middleware to our store, so we can return a thunk from an action and have it dispatched correctly.  Recall that we installed the NPM package 'redux-thunk' when converted this app to Redux origionally.  In store.js:

#### ./store.js
```javascript
import {createStore, applyMiddleware} from 'redux'
import combinedReducer from './reducers'
import logger from 'redux-logger'

// add the import for thunk
import thunk from 'redux-thunk'

// add think to middleware
// Note: logger must come last in the middleware stack
export default createStore(combinedReducer, applyMiddleware(thunk, logger))
```

Now we can return a thunk (which is a promise) from our action, so the proper action is dispatched when the fetch is returned.  We're not using ```fetch()``` yet, but we do have the thunk in place, and everything should work as before:

#### ./actions/asteroidActions.js
```javascript
import nearEathObjects from '../fixtures/sample-neo'

export function fetchAsteroids(apiUrl){
  //Now we're returning a thunk!
  return ((dispatch)=>{
    let neoData = nearEathObjects.near_earth_objects
    let newAsteroids = []
    Object.keys(neoData).forEach((date)=>{
      neoData[date].forEach((asteroid) =>{
        newAsteroids.push({
          id: asteroid.neo_reference_id,
          name: asteroid.name,
          date: asteroid.close_approach_data[0].close_approach_date,
          diameterMin: asteroid.estimated_diameter.feet.estimated_diameter_min.toFixed(0),
          diameterMax: asteroid.estimated_diameter.feet.estimated_diameter_max.toFixed(0),
          closestApproach: asteroid.close_approach_data[0].miss_distance.miles,
          velocity: parseFloat(asteroid.close_approach_data[0].relative_velocity.miles_per_hour).toFixed(0),
          distance: asteroid.close_approach_data[0].miss_distance.miles
        })
      })
    })

    //In a thunk, we can dispatch from within an action
    dispatch({
      type: 'FETCHED_ASTEROIDS',
      payload: newAsteroids
    })
  })
}
```
The key here is that we can **dispatch from within the thunk** that we are returning from this action.  That is exactly what we want to do when the fetch promise resolves with the data from the api request.  Let's get to it.  We're ready to add our fetch call.  Here's the completed action:

#### ./actions/asteroidActions.js
```javascript
export function fetchAsteroids(apiUrl){
  return ((dispatch)=>{
    return fetch(`${apiUrl.apiUrl}?start_date=${apiUrl.startDate}&api_key=${apiUrl.apiKey}`).then((rawResponse)=>{
      return rawResponse.json()
    }).then((parsedResponse) => {
      let neoData = parsedResponse.near_earth_objects
      let newAsteroids = []
      Object.keys(neoData).forEach((date)=>{
        neoData[date].forEach((asteroid) =>{
          newAsteroids.push({
            id: asteroid.neo_reference_id,
            name: asteroid.name,
            date: asteroid.close_approach_data[0].close_approach_date,
            diameterMin: asteroid.estimated_diameter.feet.estimated_diameter_min.toFixed(0),
            diameterMax: asteroid.estimated_diameter.feet.estimated_diameter_max.toFixed(0),
            closestApproach: asteroid.close_approach_data[0].miss_distance.miles,
            velocity: parseFloat(asteroid.close_approach_data[0].relative_velocity.miles_per_hour).toFixed(0),
            distance: asteroid.close_approach_data[0].miss_distance.miles
          })
        })
      })

      dispatch({
        type: 'FETCHED_ASTEROIDS',
        payload: newAsteroids
      })
    })
  })
}
```

## Code
You can view the completed project [here](https://github.com/notch8/duck-duck-redux)
