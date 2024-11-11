import axios from "axios";

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
const scope = "https://www.googleapis.com/auth/userinfo.email";
const redirectRegisterUri = "http://localhost:3000/authRegisterGoogle";
const redirectLoginUri = "http://localhost:3000/authLoginGoogle";

// 인증 코드 발급
export const getGoogleCode = (type) => {
  let redirectUri;

  if (type === "register") redirectUri = redirectRegisterUri;
  // 회원가입
  else redirectUri = redirectLoginUri; // 로그인
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
};

// 토큰 발급 후 유저 이메일 추출
export const getGoogleToken = async (code, type) => {
  let redirectUri;

  if (type === "register") redirectUri = redirectRegisterUri;
  // 회원가입
  else redirectUri = redirectLoginUri; // 로그인

  const res = await axios.post(`https://oauth2.googleapis.com/token`, {
    client_id: googleClientId,
    client_secret: googleClientSecret,
    code: code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    state: "random",
  });

  // 토큰 발급
  const token = res.data.access_token;

  const userData = await axios.get(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
  );

  // 유저 이메일
  return userData.data.email;
};
