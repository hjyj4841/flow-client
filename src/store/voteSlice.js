import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addVote } from "../api/vote";

export const vote = createAsyncThunk("vote/addVote", async (data) => {
  const response = await addVote(data);
  return response.data;
});

const voteSlice = createSlice({
  name: "voteSlice",
  initialState: { votes: "" },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(vote.fulfilled, (state, action) => {
      state.votes = action.payload;
    });
  },
});

export default voteSlice;
