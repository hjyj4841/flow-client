import { configureStore } from "@reduxjs/toolkit";
import voteSlice from "./voteSlice";
import followSlice from "./followSlice";

const store = configureStore({
  reducer: {
    vote: voteSlice.reducer,
    follow: followSlice.reducer,
  },
});

export default store;
