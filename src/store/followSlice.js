import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addFollowRelative,
  unfollow,
  viewMyFollower,
  followMeUsers,
  status,
} from "../api/follow";

export const createFollowRelative = createAsyncThunk(
  "follow/createFollowRelative",
  async ({isSelf, follow}) => {
    await addFollowRelative(follow);
    return {isSelf};
  }
);

export const removeFollowRelative = createAsyncThunk(
  "follow/removeFollowRelative",
  async ({ followingUserCode, followerUserCode }) => {
    await unfollow(followingUserCode, followerUserCode);
  }
);

export const myFollower = createAsyncThunk(
  "follow/myFollower",
  async (followingUserCode) => {
    const response = await viewMyFollower(followingUserCode);
    return response.data;
  }
);

export const followMe = createAsyncThunk(
  "follow/followMe",
  async (followerUserCode) => {
    const response = await followMeUsers(followerUserCode);
    return response.data;
  }
);

export const followStatus = createAsyncThunk(
  "follow/followStatus",
  async ({ followingUserCode, followerUserCode }) => {
    const response = await status(followingUserCode, followerUserCode);
    return response.data;
  }
);

const followSlice = createSlice({
  name: "followSlice",
  initialState: {
    countFollower: 0,
    follower: [],
    counter: 0,
    followee: [],
    followBool: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(myFollower.fulfilled, (state, action) => {
        return {
          ...state,
          countFollower: action.payload.countFollower,
          follower: action.payload.follower,
        };
      })
      .addCase(followMe.fulfilled, (state, action) => {
        return {
          ...state,
          counter: action.payload.countFollower,
          followee: action.payload.follower,
        };
      })
      .addCase(removeFollowRelative.fulfilled, (state,action) => {
        const { isSelf } = action.meta.arg;
        if(isSelf) state.countFollower -= 1;
        else state.counter -= 1;
        state.followBool = false;
      })
      .addCase(createFollowRelative.fulfilled, (state,action) => {
        const { isSelf } = action.meta.arg;
        console.log(isSelf);
        if(isSelf) state.countFollower += 1;
        else state.counter += 1;
        state.followBool = true;
      })
      .addCase(createFollowRelative.rejected, (state, action) => {
        console.log("error");
      })
      .addCase(followStatus.rejected, (state, action) => {
        console.log("error");
      })
      .addCase(followStatus.fulfilled, (state, action) => {
        state.followBool = action.payload;
      });
  },
});

export default followSlice;
