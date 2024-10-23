// reducers.js
const initialState = {
  post: null,
  likedPosts: [],
  savedPosts: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POST_DETAIL:
      return { ...state, post: action.payload };
    case LIKE_POST:
      return {
        ...state,
        likedPosts: state.likedPosts.includes(action.payload)
          ? state.likedPosts.filter((id) => id !== action.payload)
          : [...state.likedPosts, action.payload],
      };
    case SAVE_POST:
      return {
        ...state,
        savedPosts: state.savedPosts.includes(action.payload)
          ? state.savedPosts.filter((id) => id !== action.payload)
          : [...state.savedPosts, action.payload],
      };
    default:
      return state;
  }
};

export default rootReducer;
