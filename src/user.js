import { createAction, createReducer } from "@reduxjs/toolkit";
import {
  getProfilePicUrl,
  getUserName,
  isUserSignIn,
  signIn,
  signOutUser,
} from "./firebaseService";

// actions
const setUser = createAction("user/set user");
export const onSignInUser = createAction("user/sign-in user");
export const onSignOutUser = createAction("user/sign-out user");
export const onAuthStateChange = createAction("user/auth state change");

// middlewares
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
  handleSignInUser,
  handleSignOutUser,
  handleAuthStateChanged,
];
