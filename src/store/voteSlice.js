import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  addVote, 
  allVoteView, 
  detailPostVote, 
  updateVote, 
  deleteVote 
} from "../api/vote";

export const vote = createAsyncThunk("vote/addVote", async (data, thunkAPI) => {
  await addVote(data);
  thunkAPI.dispatch(allVoteList(data.postCode))
});

export const voteDetail = createAsyncThunk("vote/voteDetail", async (data, thunkAPI) => {
  await detailPostVote(data);
  thunkAPI.dispatch(allVoteList(data.postCode))
});

export const voteUpdate = createAsyncThunk("vote/voteUpdate", async (data, thunkAPI) => {
  await updateVote(data);
  thunkAPI.dispatch(allVoteList(data.postCode))
});

export const voteDelete = createAsyncThunk("vote/voteDelete", async (data, thunkAPI) => {
  await deleteVote(data);
  thunkAPI.dispatch(allVoteList(data.postCode))
});

export const allVoteList = createAsyncThunk("vote/allVoteList", async (postCode) => {
  const response = await allVoteView(postCode);
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
