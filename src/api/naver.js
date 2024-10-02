import axios from "axios";

const clientId = "vlHEtLBbU2ZmJLj2TMwV";
const clientSecret = "m9Ggb5mdjt";
const redirectRegisterUri = "http://localhost:3000/authRegisterNaver";
const redirectLoginUri = "http://localhost:3000/authLoginNaver";

// 네이버로 회원가입 -> 인증 코드 받아서 리다이렉트
export const naverRegister = () => {
  window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&state=flow-user-new-acc&redirect_uri=${redirectRegisterUri}`;
};

export const getNaverToken = async (code, state) => {
  // 발급받은 코드를 이용해 네이버 토큰 발급 - proxy 설정 사용 (Naver Api의 경우 보안상의 이유로 cors 허용 x)
  const token = await axios.get(
    `/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${code}&state=${state}`
  );

  //   const userData = getNaverUserData(token.data.access_token); 프록시 두개 설정 못하겠음... 일단 보류
  return token.data.access_token; // 일단 토큰 까지만 발급
};

const getNaverUserData = async (token) => {
  return await axios.get(`https://openapi.naver.com/v1/nid/me`, {
    Headers: { Authorization: `Bearer ${token}` },
  });
};
