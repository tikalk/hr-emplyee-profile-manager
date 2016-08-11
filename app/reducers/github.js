import merge from 'lodash/merge';
import { LoginActionTypes } from '../actions/loginpage';

export default function counter(state = {}, action) {
  switch (action.type) {
    case LoginActionTypes.SET_API_TOKEN:
      console.log(action);

      return merge(state, { github: { API_TOKEN: action.payload } });
    default:
      return state;
  }
}
