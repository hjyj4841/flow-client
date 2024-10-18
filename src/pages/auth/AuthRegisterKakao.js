import { useEffect, useState } from "react";
import { getKakaoToken } from "../../api/kakao";
import { userCheck } from "../../api/user";

const AuthRegisterKakao = () => {
  const [userEmail, setUserEmail] = useState(null);

  const code = new URL(window.location.href).searchParams.get("code");

  // 2. 카카오 토큰 발급 후 유저 이메일 추출
  const loadKakaoToken = async () => {
    setUserEmail(await getKakaoToken(code, "register"));
  };

  // 4. 회원 중복 체크
  const duplicateCheck = async () => {
    userCheck({
      userEmail: userEmail,
      userPlatform: "kakao",
      type: "register",
    });
  };

  // 1. 페이지 첫 로드 시 실행
  useEffect(() => {
    loadKakaoToken();
  }, []);

  // 3. 유저 이메일이 들어오면 실행
  useEffect(() => {
    if (userEmail !== null) {
      duplicateCheck();
    }
  }, [userEmail]);

  return;
};
export default AuthRegisterKakao;
