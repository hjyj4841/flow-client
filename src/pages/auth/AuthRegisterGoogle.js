import { useEffect, useState } from "react";
import { getGoogleToken } from "../../api/google";
import { userCheck } from "../../api/user";

const AuthRegisterGoogle = () => {
  const [userEmail, setUserEmail] = useState(null);

  const code = new URL(window.location.href).searchParams.get("code");

  // 2. 구글 토큰 발급 후 유저 이메일 추출
  const loadGoogleToken = async () => {
    setUserEmail(await getGoogleToken(code, "register"));
  };

  // 4. 회원 중복 체크
  const duplicateCheck = async () => {
    userCheck({
      userEmail: userEmail,
      userPlatform: "google",
      type: "register",
    });
  };

  // 1. 페이지 첫 로드 시 실행
  useEffect(() => {
    loadGoogleToken();
  }, []);

  // 2. userEmail 들어오면 실행
  useEffect(() => {
    if (userEmail !== null) {
      duplicateCheck();
    }
  }, [userEmail]);

  return;
};

export default AuthRegisterGoogle;
