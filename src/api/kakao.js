import axios from "axios";

const kakaoApiKey = process.env.REACT_APP_KAKAO_API_KEY;
const kakaoSecret = process.env.REACT_APP_KAKAO_SECRET;
const redirectLoginUri = "http://localhost:3000/authLoginKakao";
const redirectRegisterUri = "http://localhost:3000/authRegisterKakao";

// 인증 코드 발급
export const getKakaoCode = (type) => {
  let redirectUri;

  if (type === "register") redirectUri = redirectRegisterUri;
  // 회원가입
  else redirectUri = redirectLoginUri; // 로그인
  window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoApiKey}&redirect_uri=${redirectUri}&response_type=code`;
};

// 토큰 발급 후 유저 이메일 추출
export const getKakaoToken = async (code, type) => {
  let redirectUri;

  if (type === "register") redirectUri = redirectRegisterUri;
  // 회원가입
  else redirectUri = redirectLoginUri; // 로그인

  const res = await axios.post(
    "https://kauth.kakao.com/oauth/token",
    {
      grant_type: "authorization_code",
      client_id: kakaoApiKey,
      redirectUri: redirectUri,
      code: code,
      client_secret: kakaoSecret,
    },
    {
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );

  // 토큰 발급
  const token = res.data.access_token;

  const userData = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });

  // 유저 이메일
  return userData.data.kakao_account.email;
};
