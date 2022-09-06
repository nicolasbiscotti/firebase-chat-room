import { createAction, createReducer } from "@reduxjs/toolkit";
import {
  getProfilePicUrl,
  getUserName,
  isUserSignIn,
  signIn,
  signOutUser,
  subscribeAuthListener,
} from "./firebaseService";

const auth = (function () {
  let unsubscribeAuthListener;

  function startAuth(authListener) {
    unsubscribeAuthListener = subscribeAuthListener(authListener);
  }

  function endAuth() {
    unsubscribeAuthListener();
  }

  return {
    startAuth,
    endAuth,
  };
})();

// actions
const setUser = createAction("user/set user");
const onAuthStateChange = createAction("user/auth state change");

export const onStartAuth = createAction("user/start authentication");
export const onEndAuth = createAction("user/end authentication");
export const onSignInUser = createAction("user/sign-in user");
export const onSignOutUser = createAction("user/sign-out user");

// middlewares
const handleAuth = ({ dispatch }) => (next) => (action) => {
  next(action);

  if (onStartAuth.match(action)) {
    auth.startAuth(() => dispatch(onAuthStateChange()));
  }
  if (onEndAuth.match(action)) {
    auth.endAuth();
  }
};

const handleSignInUser = () => (next) => (action) => {
  next(action);

  if (onSignInUser.match(action)) {
    signIn();
  }
};

const handleSignOutUser = () => (next) => (action) => {
  next(action);

  if (onSignOutUser.match(action)) {
    signOutUser();
  }
};

const handleAuthStateChanged = () => (next) => (action) => {
  next(action);

  if (onAuthStateChange.match(action)) {
    const user = {
      userName: null,
      profilePicURL: null,
    };
    if (isUserSignIn()) {
      user.userName = getUserName();
      user.profilePicURL = getProfilePicUrl();
    }
    next(setUser(user));
  }
};

// selectors
export const selectUser = (state) => state.user;

// initial state and reducer
const initialState = () => {
  const user = {
    userName: null,
    profilePicURL: null,
  };
  return user;
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setUser, (state, { payload }) => ({
      ...state,
      userName: payload.userName,
      profilePicURL: payload.profilePicURL,
    }))
    .addDefaultCase((state) => state);
});

export const userMiddlewares = [
  handleAuth,
  handleSignInUser,
  handleSignOutUser,
  handleAuthStateChanged,
];
