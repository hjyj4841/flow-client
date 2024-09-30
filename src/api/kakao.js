import axios from "axios";

const kakaoApiKey = "1a0c2ee5a1c05d498d69df5ba445b391";
const redirectUri = "http://localhost:3000/auth";
const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoApiKey}&redirect_uri=${redirectUri}&response_type=code`;
const kakaoSecret = "L8NYxWHVPQW4p2RIqID4TSJ1WKT3GI20";

export const getKakaoCode = () => {
  window.location.href = kakaoURL;
};

export const getKakaoToken = async (token) => {
  const res = await axios.post(
    "https://kauth.kakao.com/oauth/token",
    {
      grant_type: "authorization_code",
      client_id: kakaoApiKey,
      redirectUri: redirectUri,
      code: token,
      client_secret: kakaoSecret,
    },
    {
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );

  return getKakaoUserData(res.data.access_token);
};

const getKakaoUserData = async (token) => {
  const user = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });
  return user.data;
};
