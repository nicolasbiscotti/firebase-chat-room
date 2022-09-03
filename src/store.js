import { configureStore } from "@reduxjs/toolkit";
import { userMiddlewares, userReducer } from "./user";
import { chatMiddlewares, chatReducer } from "./chat";

export const store = configureStore({
  reducer: { user: userReducer, chat: chatReducer },
  middleware: [...userMiddlewares, ...chatMiddlewares],
});
