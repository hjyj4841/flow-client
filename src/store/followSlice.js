import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addFollowRelative, unfollow, viewMyFollower, followMeUsers ,status } from "../api/follow";

export const createFollowRelative = createAsyncThunk("follow/createFollowRelative",
    async (follow) => {
        await addFollowRelative(follow);
    }
);

export const removeFollowRelative = createAsyncThunk("follow/removeFollowRelative",
    async ({ followingUserCode, followerUserCode }) => {
        await unfollow(
            followingUserCode, followerUserCode
        );
    }
)

export const myFollower = createAsyncThunk("follow/myFollower",
    async (followingUserCode) => {
        const response = await viewMyFollower(followingUserCode);
        return response.data;
    }
)

export const followMe = createAsyncThunk("follow/followMe",
    async (followerUserCode) => {
        const response = await followMeUsers(followerUserCode);
        return response.data;
    }
)

export const followStatus = createAsyncThunk("follow/followStatus",
    async ({followingUserCode, followerUserCode}) => {
        const response = await status(followingUserCode,followerUserCode);
        return response.data;
    }
)

const followSlice = createSlice({
    name : "followSlice",
    initialState : {
        countFollower: 0,
        follower: [],
        counter : 0
    },
    extraReducers : (builder) => {
        builder
        .addCase(myFollower.fulfilled, (state,action) => {
            return {
            ...state,
            countFollower : action.payload.countFollower,
            follower : action.payload.follower
            }
        })
        .addCase(followMe.fulfilled, (state, action) => {
            return {
                ...state,
                countFollower : action.payload.countFollower,
                follower : action.payload.follower,
                counter : action.payload.countFollower
                }
        })
        .addCase(removeFollowRelative.fulfilled, (state) => {
            state.countFollower -= 1;
        })
        .addCase(createFollowRelative.fulfilled, (state) => {
            state.countFollower += 1;
        })
    }
})

export default followSlice;