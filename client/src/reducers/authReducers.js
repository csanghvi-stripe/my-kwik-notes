import { SIGN_IN, SIGN_OUT, SIGN_IN_FAILURE } from '../actions/types';

const INTIAL_STATE = {
  isSignedIn: null,
  userObj: null,
  loginError:null
};

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN:
      return { ...state, isSignedIn: true, userObj: action.payload };
    case SIGN_OUT:
      return { ...state, isSignedIn: false, userObj: null };
    case SIGN_IN_FAILURE:
      return { ...state, loginError: action.payload };
    default:
      return state;
  }
};
