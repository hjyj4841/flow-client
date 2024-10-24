import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 비동기 좋아요 토글 액션 생성
export const toggleLike = createAsyncThunk(
  "like/toggleLike",
  async (postCode) => {
    const userCode = localStorage.getItem("userCode"); // 토큰 대신 localStorage에서 사용자 정보 가져옴
    const user = { userCode };
    await axios.post(
      `http://localhost:8080/api/likes/toggle/${postCode}`,
      user
    );
    return postCode; // 성공 시 반환
  }
);

const likeSlice = createSlice({
  name: "like",
  initialState: {
    likedPosts: [], // 초기 상태에서 빈 배열로 설정
    loading: false,
    error: null,
  },
  reducers: {
    setLikedPosts: (state, action) => {
      state.likedPosts = action.payload || []; // payload가 없을 경우 빈 배열로 설정
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleLike.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const postCode = action.payload;
        if (state.likedPosts.includes(postCode)) {
          state.likedPosts = state.likedPosts.filter((id) => id !== postCode);
        } else {
          state.likedPosts.push(postCode);
        }
        state.loading = false;
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const { setLikedPosts } = likeSlice.actions;
export default likeSlice.reducer;
