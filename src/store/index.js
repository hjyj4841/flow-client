import { configureStore } from "@reduxjs/toolkit";
import voteSlice from "./voteSlice";

const store = configureStore({
  vote: voteSlice.reducer,
});

export default store;
