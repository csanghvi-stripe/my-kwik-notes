import {
  SIGN_IN,
  SIGN_OUT,
  SIGN_IN_FAILURE
} from './types';
const NoteServices = require('../api/NoteServices');

/*
export const signIn = userId => {

  return {
    type: SIGN_IN,
    payload: userId
  };
};
*/

export const signIn = userId => async (dispatch, getState) => {
  try {
  const response = await NoteServices.login( userId );
  dispatch({ type: SIGN_IN, payload: response.data });
} catch(err){
  console.log("IN action creator %o", err);
  dispatch({ type: SIGN_IN_FAILURE, payload: err });
}

};

export const signOut = () => {
  return {
    type: SIGN_OUT
  };
};
