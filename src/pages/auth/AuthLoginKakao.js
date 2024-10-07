import { useEffect, useState } from "react";
import { getKakaoToken } from "../../api/kakao";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthLoginKakao = () => {
  const navigate = useNavigate();
  const [kakaoToken, setKakaoToken] = useState(null);
  const [user, setUser] = useState({
    userEmail: "",
    userPlatform: "",
  });

  // 카카오 서버로 받은 인증코드
  const code = new URL(window.location.href).searchParams.get("code");

  // 인증코드를 통해 카카오 토큰 발급 후 유저 정보 추출
  const loadToken = async () => {
    const res = await getKakaoToken(code, "login");
    setKakaoToken(res);
  };

  useEffect(() => {
    loadToken();
  }, []);

  // 카카오 토큰을 통해 받은 유저 정보를 userEmail, userPlatform에 세팅
  useEffect(() => {
    if (kakaoToken !== null) {
      if (
        kakaoToken.kakao_account.profile.profile_image_url.includes("kakao")
      ) {
        setUser({
          userEmail: kakaoToken.kakao_account.email,
          userPlatform: "kakao",
        });
      }
    }
  }, [kakaoToken]);

  // 유저 정보가 세팅 된다면 실행
  useEffect(() => {
    if (user.userEmail !== "") {
      loginCheck();
    }
  }, [user]);

  // 해당 유저가 flow 서버에 가입되어있는지 확인
  const loginCheck = async () => {
    // 가입 회원인지 조회
    const result = await axios.get(
      "http://localhost:8080/api/user/duplicateCheck?userEmail=" +
        user.userEmail +
        "&userPlatform=" +
        user.userPlatform
    );

    // 가입되어 있는 회원이라면 서버를 통해 토큰 발급 후 메인으로 이동
    if (!result.data) {
      const response = await axios.post(
        "http://localhost:8080/api/user/login",
        user
      );
      localStorage.setItem("token", response.data);

      window.location.href = "/";
      // navigate("/");

      // 가입되어 있는 회원이 아닌경우 처리 하는 로직
    } else {
      alert("회원가입 후 이용해 주세요.");
      navigate("/register");
    }
  };

  return <></>;
};

export default AuthLoginKakao;
