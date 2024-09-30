import axios from "axios";

const kakaoApiKey = "1a0c2ee5a1c05d498d69df5ba445b391";
const redirectLoginUri = "http://localhost:3000/authLogin";
const redirectRegisterUri = "http://localhost:3000/authRegister";
const kakaoSecret = "L8NYxWHVPQW4p2RIqID4TSJ1WKT3GI20";

// 카카오 로그인페이지에서 인증 코드 발급 -> 회원가입
export const getKakaoCodeByRegister = () => {
  window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoApiKey}&redirect_uri=${redirectRegisterUri}&response_type=code`;
};

// 카카오 로그인페이지에서 인증 코드 발급 -> 로그인
export const getKakaoCodeByLogin = () => {
  window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoApiKey}&redirect_uri=${redirectLoginUri}&response_type=code`;
};

// 인증코드
export const getKakaoToken = async (token, type) => {
  let res;
  if (type === "register") {
    res = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: kakaoApiKey,
        redirectUri: redirectRegisterUri,
        code: token,
        client_secret: kakaoSecret,
      },
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
  } else if (type === "login") {
    res = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: kakaoApiKey,
        redirectUri: redirectLoginUri,
        code: token,
        client_secret: kakaoSecret,
      },
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
  }

  return getKakaoUserData(res.data.access_token);
};

// 카카오에서 발급 받은 토큰으로 유저 정보 추출하는 로직
const getKakaoUserData = async (token) => {
  const user = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });
  return user.data;
};
