import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addComment, getAllComment, updateComment } from "../api/comment";

export const createComment = createAsyncThunk(
  "comment/createComment",
  async (data, thunkAPI) => {
    await addComment(data);
    thunkAPI.dispatch(fetchComments(data.postCode));
  }
);

export const modifyComment = createAsyncThunk(
  "comment/modifyComment",
  async (data, thunkAPI) => {
    await updateComment(data);
    thunkAPI.dispatch(fetchComments(data.postCode));
  }
);

export const fetchComments = createAsyncThunk(
  "comment/fetchComments",
  async (postCode) => {
    const response = await getAllComment(postCode);

    return response.data;
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState: { comments: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.comments = action.payload;
    });
  },
});

export default commentSlice;
