import { createAction, createReducer } from "@reduxjs/toolkit";
import { isUserSignIn, saveMessage } from "./firebaseService";

// actions
const addNewMessage = createAction("chat/add new message");
const deleteMessage = createAction("chat/delete message");
export const onSaveMessage = createAction("chat/save message flow");
export const onRecentMessagesChange = createAction(
  "chat/recent message change"
);

// middlewares
const saveMessageMiddleware = () => (next) => (action) => {
  next(action);

  if (onSaveMessage.match(action)) {
    console.log("user signIn? -> ", isUserSignIn());
    if (action.payload && isUserSignIn()) {
      saveMessage(action.payload);
    } else {
      console.log("You must to be logged in to send a message");
    }
  }
};
const handleRecentMessageChange = () => (next) => (action) => {
  next(action);

  if (onRecentMessagesChange.match(action)) {
    const { newMessage, deletedMessage } = action.payload;
    if (newMessage) {
      console.log("new message");
      next(addNewMessage(newMessage));
    }
    if (deletedMessage) {
      next(deleteMessage(deletedMessage));
    }
  }
};

// selectors
export const selectChat = (state) => state.chat;

// reducer
const initialState = [];

export const chatReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addNewMessage, (state, { payload }) => [...state, payload])
    .addCase(deleteMessage, (state, { payload }) =>
      state.filter((msg) => msg.id !== payload.id).map((msg) => ({ ...msg }))
    )
    .addDefaultCase((state) => state);
});

export const chatMiddlewares = [
  saveMessageMiddleware,
  handleRecentMessageChange,
];
