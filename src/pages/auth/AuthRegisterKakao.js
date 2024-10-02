import { useEffect, useState } from "react";
import { getKakaoToken } from "../../api/kakao";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthRegisterKakao = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState({
    userEmail: "",
    userPlatform: "",
  });
  const code = new URL(window.location.href).searchParams.get("code");

  // kakao로 발급 받은 토큰으로 유저 정보 추출
  const loadToken = async () => {
    setUserData(await getKakaoToken(code, "register"));
  };

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    if (userData != null) {
      // 유저가 카카오 계정으로 가입했을 경우
      setUser({
        userEmail: userData.kakao_account.email,
        userPlatform: "kakao",
      });
    }
  }, [userData]);

  const duplicateCheck = async () => {
    // 회원 중복 체크
    const result = await axios.get(
      "http://localhost:8080/api/user/duplicateCheck?userEmail=" +
        user.userEmail +
        "&userPlatform=" +
        user.userPlatform
    );

    if (result.data) {
      // 파라미터로 유저정보 묶어서 회원가입페이지 이동
      navigate(
        "/registerUser?userEmail=" +
          user.userEmail +
          "&userPlatform=" +
          user.userPlatform
      );
    } else {
      alert("이미 가입한 회원입니다.");
      navigate("/login"); // 로그인 주소로 바꾸어야함
    }
  };

  useEffect(() => {
    if (user.userEmail !== "") {
      duplicateCheck();
    }
  }, [user]);

  return;
};
export default AuthRegisterKakao;
