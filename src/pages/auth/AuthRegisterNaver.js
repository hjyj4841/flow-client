import { useEffect, useState } from "react";
import { getNaverToken } from "../../api/naver";
import { userCheck } from "../../api/user";

const AuthRegisterNaver = () => {
  const [userEmail, setUserEmail] = useState(null);

  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // 2. 네이버 토큰 발급 후 유저이메일 추출
  const loadNaverToken = async () => {
    setUserEmail(await getNaverToken(code, state));
  };

  // 4. 유저 정보가 이미 있는지 조회
  const duplicateCheck = async () => {
    userCheck({
      userEmail: userEmail,
      userPlatform: "naver",
      type: "register",
    });
  };

  // 1. 페이지 첫 로드 시 실행
  useEffect(() => {
    loadNaverToken();
  }, []);

  // 3. userEmail이 들어오면 실행
  useEffect(() => {
    if (userEmail !== null) {
      duplicateCheck();
    }
  }, [userEmail]);

  return;
};
export default AuthRegisterNaver;
