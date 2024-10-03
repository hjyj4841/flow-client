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
    `/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${code}&state=${state}`
  );

  const userData = await getNaverUserData(token.data.access_token);
  return userData; // 토큰으로 유저 데이터 받아오는 거 안된 프록시 설정해도 404 error
  // return token.data.access_token; // 일단 토큰 까지만 발급
};

const getNaverUserData = async (token) => {
  console.log(token);
  const userData = await axios.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("userData: " + userData);
  return userData;
};
