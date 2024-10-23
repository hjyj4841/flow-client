import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/",
});

// Toggle like
export const handleLikeToggle = async (postCode, user) => {
  try {
    await instance.post(`likes/toggle/${postCode}`, user);
  } catch (error) {
    console.error("Error toggling like", error);
  }
};

export const fetchLikedPosts = async (userCode) => {
  const response = await axios.get(
    `http://localhost:8080/api/likes/${userCode}/likes`
  );
  return response.data.postInfoList;
};
