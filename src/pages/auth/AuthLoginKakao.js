import { useEffect, useState } from "react";
import { getKakaoToken } from "../../api/kakao";
import { userCheck } from "../../api/user";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthLoginKakao = () => {
  const [userEmail, setUserEmail] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const code = new URL(window.location.href).searchParams.get("code");

  // 2. 카카오 코드를 통해 유저 이메일 추출
  const loadKakaoToken = async () => {
    setUserEmail(await getKakaoToken(code, "login"));
  };

  // 4. 해당 회원이 가입되어 있는지 조회
  const loginCheck = async () => {
    const token = await userCheck({
      userEmail: userEmail,
      userPlatform: "kakao",
      type: "login",
    });
    if (token !== null) login(token);
    navigate("/");
  };

  // 1. 페이지 첫 로드 시 실행
  useEffect(() => {
    loadKakaoToken();
  }, []);

  // 3. userEmail이 들어오면 실행
  useEffect(() => {
    if (userEmail !== null) loginCheck();
  }, [userEmail]);

  return <></>;
};

export default AuthLoginKakao;
