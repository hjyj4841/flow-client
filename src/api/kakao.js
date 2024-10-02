import axios from "axios";

const kakaoApiKey = "1a0c2ee5a1c05d498d69df5ba445b391";
const redirectLoginUri = "http://localhost:3000/authLoginKakao";
const redirectRegisterUri = "http://localhost:3000/authRegisterKakao";
const kakaoSecret = "L8NYxWHVPQW4p2RIqID4TSJ1WKT3GI20";

// 카카오 서버에서 인증 코드 발급 후 AuthRegisterKakao.js로 리다이렉트
export const getKakaoCodeByRegister = () => {
  window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoApiKey}&redirect_uri=${redirectRegisterUri}&response_type=code`;
};

// 카카오 서버에서 인증 코드 발급 후 AuthLoginKakao.js로 리다이렉트
export const getKakaoCodeByLogin = () => {
  window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoApiKey}&redirect_uri=${redirectLoginUri}&response_type=code`;
};

// 인증코드를 통해 토큰 발급 후 해당 Auth...js로 리턴
export const getKakaoToken = async (code, type) => {
  let res;
  // 회원가입 일 경우
  if (type === "register") {
    res = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: kakaoApiKey,
        redirectUri: redirectRegisterUri,
        code: code,
        client_secret: kakaoSecret,
      },
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
    // 로그인 일 경우
  } else if (type === "login") {
    res = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: kakaoApiKey,
        redirectUri: redirectLoginUri,
        code: code,
        client_secret: kakaoSecret,
      },
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
  }

  // 토큰을 통해 유저 데이터를 추출 후 리턴
  return await getKakaoUserData(res.data.access_token);
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
