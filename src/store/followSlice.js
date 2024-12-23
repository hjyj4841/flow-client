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
  async ({isSelf, followingUserCode, followerUserCode }) => {
    await unfollow(followingUserCode, followerUserCode);
    return {isSelf};
  }
);

export const myFollower = createAsyncThunk(
  "follow/myFollower",
  async ({ followingUserCode, key }) => {
    const response = await viewMyFollower(followingUserCode, key);
    return response.data;
  }
);
export const followMe = createAsyncThunk(
  "follow/followMe",
  async ({followerUserCode, key}) => {
    const response = await followMeUsers(followerUserCode, key);
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
        switch(isSelf) {
          case 1 : {
            state.countFollower -= 1;
            break;
          }
          case 2 : {
            state.counter -= 1;
            break;
          }
          default : {
            break;
          }
        }
        state.followBool = false;
      })
      .addCase(createFollowRelative.fulfilled, (state,action) => {
        const { isSelf } = action.meta.arg;
        switch(isSelf) {
          case 1 : {
            state.countFollower += 1;
            break;
          }
          case 2 : {
            state.counter += 1;
            break;
          }
          default : {
            break;
          }
        }
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
