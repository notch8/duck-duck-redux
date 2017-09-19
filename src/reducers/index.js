import asteroidsReducer from './asteroidsReducer.js'
import {combineReducers} from 'redux'

export default combineReducers({
  asteroids: asteroidsReducer
})
