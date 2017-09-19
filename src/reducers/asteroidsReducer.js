const initialState = {
  all: []
}
export default (currentState=initialState, action) =>{
  let newState
  switch(action.type){
    case("FETCHED_ASTEROIDS"):{
      newState = Object.assign(
        {},
        currentState,
        {all: action.payload}
      )
      break
    }
    default:
      newState = currentState

  }
  return newState
}
