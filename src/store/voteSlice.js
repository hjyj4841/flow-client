import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addVote,
  removeVote,
  checkVote,
  countVote,
  countY,
  countN,
} from "../api/vote";

export const voteYorN = createAsyncThunk("vote/voteYorN", async (data) => {
  const response = await addVote(data);
  return response.data;
});

export const delVote = createAsyncThunk("vote/delVote", async (voteCode) => {
  const response = await removeVote(voteCode);
  return response.data;
});

export const checkVoteState = createAsyncThunk(
  "vote/checkVoteState",
  async (data) => {
    const response = await checkVote(data);
    return response.data;
  }
);

export const totalVoteCount = createAsyncThunk(
  "vote/countVoteData",
  async (voteCode) => {
    const response = await countVote(voteCode);
    return response.data;
  }
);

export const totalYCount = createAsyncThunk(
  "vote/countVoteY",
  async (voteYn) => {
    const response = await countY(voteYn);
    return response.data;
  }
);

export const totalNCount = createAsyncThunk(
  "vote/countVoteN",
  async (voteYn) => {
    const response = await countN(voteYn);
    return response.data;
  }
);

const voteSlice = createSlice({
  name: "voteSlice",
  initialState: { votes: null, count: 0, countY: 0, countN: 0, isVote: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(voteYorN.fulfilled, (state, action) => {
        state.votes = action.payload;
        state.count += 1;
        state.isVote = true;
      })
      .addCase(delVote.fulfilled, (state, action) => {
        state.votes = null;
        state.count -= 1;
        state.countY -= 1;
        state.countN -= 1;
        state.isVote = false;
      })
      .addCase(checkVoteState.fulfilled, (state, action) => {
        if (action.payload === "") {
          state.isVote = false;
          state.votes = null;
        } else {
          state.isVote = true;
          state.votes = action.payload;
        }
      })
      .addCase(totalVoteCount.fulfilled, (state, action) => {
        state.votes = action.payload;
        state.count = action.payload;
        state.countY = action.payload;
        state.countN = action.payload;
      })
      .addCase(totalYCount.fulfilled, (state, action) => {
        state.votes = action.payload;
        state.count = action.payload;
        state.countY = action.payload;
        state.countN = action.payload;
      })
      .addCase(totalNCount.fulfilled, (state, action) => {
        state.votes = action.payload;
        state.count = action.payload;
        state.countY = action.payload;
        state.countN = action.payload;
      });
  },
});

export default voteSlice;
