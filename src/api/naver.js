import axios from "axios";

const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;
const clientSecret = process.env.REACT_APP_NAVER_CLIENT_SECRET;
const redirectRegisterUri = "http://localhost:3000/authRegisterNaver";
const redirectLoginUri = "http://localhost:3000/authLoginNaver";

// 인증 코드 발급
export const getNaverCode = (type) => {
  let redirectUri;

  if (type === "register") redirectUri = redirectRegisterUri;
  // 회원가입
  else redirectUri = redirectLoginUri; // 로그인
  window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&state=flow-user-new-acc&redirect_uri=${redirectUri}`;
};

// 토큰 발급 후 유저 이메일 추출
export const getNaverToken = async (code, state) => {
  // 발급받은 코드를 이용해 네이버 토큰 발급
  const token = await axios.get(
    `http://localhost:8080/api/user/oauth/naver/getToken?clientId=${clientId}&clientSecret=${clientSecret}&code=${code}&state=${state}`
  );

  // accessToken 발급완료
  const accessToken = token.data.access_token;

  // accessToken으로 유저 정보 발급 받기
  const userData = await axios.get(
    `http://localhost:8080/api/user/oauth/naver/getUserData?token=${accessToken}`
  );

  // 유저 email 추출
  return userData.data.response.email;
};
