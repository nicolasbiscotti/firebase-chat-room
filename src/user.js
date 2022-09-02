import { createAction, createReducer, configureStore } from "@reduxjs/toolkit";
import {
  getProfilePicUrl,
  getUserName,
  isUserSignIn,
  signIn,
  signOutUser,
} from "./firebaseService";

export const onSignInUser = createAction("user/ sign-in user");
export const onSignOutUser = createAction("user/ sign-out user");
const setUser = createAction("user/ set user");

const sigInUserMiddleware = () => (next) => (action) => {
  next(action);

  if (onSignInUser.match(action)) {
    signIn().then(() =>
      next(
        setUser({
          userName: getUserName(),
          profilePicURL: getProfilePicUrl(),
        })
      )
    );
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
  if (isUserSignIn()) {
    user.userName = getUserName();
    user.profilePicURL = getProfilePicUrl();
  }
  return user;
};

const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setUser, (state, { payload }) => ({
      ...state,
      userName: payload.userName,
      profilePicURL: payload.profilePicURL,
    }))
    .addDefaultCase((state) => state);
});

export const store = configureStore({
  reducer: userReducer,
  middleware: [sigInUserMiddleware, signOutUserMiddleware],
});
