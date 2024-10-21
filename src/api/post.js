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
