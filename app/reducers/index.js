import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import github from './counter';

const rootReducer = combineReducers({
  counter,
  routing,
  github
});

export default rootReducer;
