import { configureStore } from "@reduxjs/toolkit";
import voteSlice from "./voteSlice";
import followSlice from "./followSlice";
import commentSlice from "./commentSlice";
import likeSlice from "./likeSlice";

const store = configureStore({
  reducer: {
    vote: voteSlice.reducer,
    follow: followSlice.reducer,
    comment: commentSlice.reducer,
    like: likeSlice,
  },
});

export default store;
