import { useEffect, useState } from "react";
import { getGoogleToken } from "../../api/google";
import { userCheck } from "../../api/user";

const AuthLoginGoogle = () => {
  const [userEmail, setUserEmail] = useState(null);

  const code = new URL(window.location.href).searchParams.get("code");

  // 2. 구글 코드를 통해 유저 이메일 추출
  const loadGoogleToken = async () => {
    setUserEmail(await getGoogleToken(code, "login"));
  };

  // 4. 가입한 회원인지 확인
  const loginCheck = async () => {
    await userCheck({
      userEmail: userEmail,
      userPlatform: "google",
      type: "login",
    });
  };

  // 1. 페이지 첫 로드 시 실행
  useEffect(() => {
    loadGoogleToken();
  }, []);

  // 3. userEmail 얻으면 실행
  useEffect(() => {
    if (userEmail !== null) {
      loginCheck();
    }
  }, [userEmail]);

  return;
};

export default AuthLoginGoogle;
