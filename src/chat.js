import { createAction, createReducer } from "@reduxjs/toolkit";
import {
  isUserSignIn,
  saveMessage,
  susbscribeMessagesListener,
} from "./firebaseService";

const lastMessages = (function () {
  let unsubscribeMessagesListener;

  function subscribe(listener) {
    unsubscribeMessagesListener = susbscribeMessagesListener(listener);
  }

  function unsubscribe() {
    unsubscribeMessagesListener();
  }

  return {
    subscribe,
    unsubscribe,
  };
})();

// actions
const clearFeed = createAction("chat/clear the feed");
const addNewMessage = createAction("chat/add new message");
const deleteMessage = createAction("chat/delete message");
const onRecentMessagesChange = createAction("chat/recent message change");

export const subscribeToTheFeed = createAction("chat/subscribe to the feed");
export const unsubscribeToTheFeed = createAction(
  "chat/unsubscribe to the feed"
);
export const onSendMessage = createAction("chat/save message flow");

// middlewares
const handleSubscription = ({ dispatch }) => (next) => (action) => {
  next(action);

  if (subscribeToTheFeed.match(action)) {
    lastMessages.subscribe(({ newMessage, deletedMessage }) =>
      dispatch(onRecentMessagesChange({ newMessage, deletedMessage }))
    );
  }
  if (unsubscribeToTheFeed.match(action)) {
    lastMessages.unsubscribe();
    next(clearFeed());
  }
};

const handleSendMessage = () => (next) => (action) => {
  next(action);

  if (onSendMessage.match(action)) {
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
    if (isUserSignIn()) {
      const { newMessage, deletedMessage } = action.payload;
      if (newMessage) {
        next(addNewMessage(newMessage));
      }
      if (deletedMessage) {
        next(deleteMessage(deletedMessage));
      }
    }
  }
};

// selectors
export const selectChat = (state) => state.chat;

// initial state and reducer
const initialState = [];

export const chatReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addNewMessage, (state, { payload }) => [...state, payload])
    .addCase(deleteMessage, (state, { payload }) =>
      state.filter((msg) => msg.id !== payload.id).map((msg) => ({ ...msg }))
    )
    .addCase(clearFeed, () => [])
    .addDefaultCase((state) => state);
});

export const chatMiddlewares = [
  handleSendMessage,
  handleRecentMessageChange,
  handleSubscription,
];
