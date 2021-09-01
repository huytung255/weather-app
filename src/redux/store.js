import { configureStore } from "@reduxjs/toolkit";
import infoReducer from "./info";
export const store = configureStore({
  reducer: {
    info: infoReducer,
  },
});
