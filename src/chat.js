import { createAction, createReducer } from "@reduxjs/toolkit";
import { isUserSignIn, saveMessage } from "./firebaseService";

export const onSaveMessage = createAction("chat/save message flow");

const saveMessageMiddleware = () => (next) => (action) => {
  next(action);

  if (onSaveMessage.match(action)) {
    console.log(action);
    console.log("user signIn? -> ", isUserSignIn())
    if (action.payload && isUserSignIn()) {
      saveMessage(action.payload);
    } else {
      console.log("You must to be logged in to send a message");
    }
  }
};

const initialState = [];

export const selectChat = (state) => state.chat;

export const chatReducer = createReducer(initialState, (builder) => {
  builder.addDefaultCase((state) => state);
});

export const chatMiddlewares = [saveMessageMiddleware];
