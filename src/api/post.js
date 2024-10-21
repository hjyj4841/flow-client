import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/",
});

const authorize = axios.create({
  baseURL: "http://localhost:8080/api/private/",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// 게시물 추가
export const addPost = async (data) => {
  return await instance.post("post", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 게시물 수정
export const updatePost = async (data) => {
  return await instance.put("post", data);
};

// POST_CODE로 게시물 1개 조회
export const detailPost = async (postCode) => {
  return await instance.get(`post/${postCode}`);
};

// postCode로 게시물 이미지 조회
export const detailImg = async (postCode) => {
  return await instance.get(`postImg/${postCode}`);
};

// 본인 게시물 삭제
export const delPost = async (postCode) => {
  return await instance.delete(`post/${postCode}`);
};

// postImgCode로 사진 삭제
export const delImg = async (postImgCode) => {
  return await instance.delete(`postImg`, {
    data: postImgCode, // 배열 전달
  });
};

// 메인 화면 NewFeed
export const newFeed = async (page = 1, keyword = "") => {
  const response = await instance.get(`post`, {
    params: {
      page: page,
      keyword: keyword,
    },
  });
  return response.data;
};

// 해당 유저가 작성한 게시물 조회 (게시물[], 게시물 수)
export const fetchCreatedPosts = async (userCode) => {
  try {
    return await instance.get(`${userCode}/post`);
  } catch (error) {
    console.error("Error fetching created posts", error);
  }
};

// 해당 유저가 좋아요한 게시물 조회
export const fetchLikedPosts = async (userCode) => {
  try {
    return await instance.get(`likes/${userCode}/likes`);
  } catch (error) {
    console.error("Error fetching liked posts", error);
  }
};

// 해당 유저가 북마크한 게시물 조회
export const fetchSavedPosts = async (userCode) => {
  try {
    return await instance.get(`collection/${userCode}/collections`);
  } catch (error) {
    console.error("Error fetching saved posts", error);
  }
};

// 메인 화면 PopularFeed
export const popularFeed = async (page = 1) => {
  const response = await instance.get(`likes/post/ordered-by-likes`, {
    params: {
      page: page,
    },
  });
  return response.data;
};

// 메인 화면 MyFollowerFeed
export const myFollowerFeed = async (userCode, page = 1) => {
  const response = await instance.get(`/posts/followed/${userCode}`, {
    params: {
      page: page,
    },
  });
  return response.data;
};
