import { SIGN_IN, SIGN_OUT, SIGN_IN_FAILURE } from '../actions/types';

const INTIAL_STATE = {
  isSignedIn: null,
  userObj: null,
  error:null
};

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN:
      return { ...state, isSignedIn: true, userObj: action.payload };
    case SIGN_OUT:
      return { ...state, isSignedIn: false, userObj: null };
    case SIGN_IN_FAILURE:
      return { ...state, isSignedIn: false, error: action.payload };
    default:
      return state;
  }
};
