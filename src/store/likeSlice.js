import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likedPosts: [],
};

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    toggleLike: (state, action) => {
      const postId = action.payload;
      if (state.likedPosts.includes(postId)) {
        state.likedPosts = state.likedPosts.filter((id) => id !== postId);
      } else {
        state.likedPosts.push(postId);
      }
    },
    setLikedPosts: (state, action) => {
      state.likedPosts = action.payload;
    },
  },
});

export const { toggleLike, setLikedPosts } = likeSlice.actions;
export default likeSlice.reducer;
