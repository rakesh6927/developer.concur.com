import 'es6-promise';
import fetch from 'isomorphic-fetch';
import { reset } from 'redux-form';
import { hashHistory } from 'react-router';

import { sharedHelpers } from '../utils/actionHelpers';

export const NEW_APP_REQUEST = 'NEW_APP_REQUEST';
export const NEW_APP_FAILURE = 'NEW_APP_FAILURE';
export const NEW_APP_SUCCESS = 'NEW_APP_SUCCESS';

export function newAppRequest() {
  return { type: NEW_APP_REQUEST };
}

export function newAppFailure(message) {
  return {
    type: NEW_APP_FAILURE,
    message,
  };
}

export function newAppSuccess(app, clientSecret) {
  return {
    type: NEW_APP_SUCCESS,
    app,
    clientSecret,
  };
}

export function postNewApp(newApp) {
  return (dispatch, getState) => {
    dispatch(newAppRequest());

    const { token } = getState().auth;
    const options = {
      method: 'POST',
      body: JSON.stringify(newApp),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    return fetch(`${process.env.DEVCENTER_API_FORMS}/applications`, options)
      .then(sharedHelpers.validResponse(dispatch))
      .then(response => response.json())
      .then(({ application: app, clientSecret }) => {
        dispatch(newAppSuccess(app, clientSecret));
        hashHistory.push('/new/success');
        dispatch(reset('newApp'));
      })
      .catch(err => dispatch(newAppFailure(err.message)));
  };
}
