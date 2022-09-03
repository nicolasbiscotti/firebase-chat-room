import { createAction, createReducer, configureStore } from "@reduxjs/toolkit";
import {
  getProfilePicUrl,
  getUserName,
  signIn,
  signOutUser,
} from "./firebaseService";

export const onSignInUser = createAction("user/sign-in user");
export const onSignOutUser = createAction("user/sign-out user");
const setUser = createAction("user/set user");

const sigInUserMiddleware = () => (next) => (action) => {
  next(action);

  if (onSignInUser.match(action)) {
    const getUser = () => ({
      userName: getUserName(),
      profilePicURL: getProfilePicUrl(),
    });
    if (action.payload) {
      next(setUser(getUser()));
    } else {
      signIn().then(() => next(setUser(getUser())));
    }
  }
};

const signOutUserMiddleware = () => (next) => (action) => {
  next(action);

  if (onSignOutUser.match(action)) {
    signOutUser();
    next(setUser({ userName: null, profilePicURL: null }));
  }
};

const initialState = () => {
  const user = {
    userName: null,
    profilePicURL: null,
  };
  return user;
};

export const selectUser = (state) => state.user;

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setUser, (state, { payload }) => ({
      ...state,
      userName: payload.userName,
      profilePicURL: payload.profilePicURL,
    }))
    .addDefaultCase((state) => state);
});

export const userMiddlewares = [sigInUserMiddleware, signOutUserMiddleware];
