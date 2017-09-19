import {createStore, applyMiddleware} from 'redux'
import combinedReducer from './reducers'
import logger from 'redux-logger'

export default createStore(combinedReducer, applyMiddleware(logger))
