import { useEffect, useState } from "react";
import { getGoogleToken } from "../../api/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthLoginGoogle = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);
  const [user, setUser] = useState({
    userEmail: "",
    userPlatform: "",
  });

  const code = new URL(window.location.href).searchParams.get("code");

  const loadToken = async () => {
    const res = await getGoogleToken(code, "login");
    setUserEmail(res);
  };

  useEffect(() => {
    loadToken();
  }, []);

  // 토큰을 통해 유저이메일을 뽑았다면 실행시킬 구문
  useEffect(() => {
    if (userEmail !== null) {
      setUser({
        userEmail: userEmail,
        userPlatform: "google",
      });
    }
  }, [userEmail]);

  // 유저 정보가 세팅 된다면 실행
  useEffect(() => {
    if (user.userEmail !== "") {
      loginCheck();
    }
  }, [user]);

  // 해당 유저가 flow 서버에 가입되어있는데 확인
  const loginCheck = async () => {
    // 가입 회원인지 조회
    const result = await axios.get(
      `http://localhost:8080/api/user/duplicateCheck?userEmail=${user.userEmail}&userPlatform=${user.userPlatform}`
    );

    if (!result.data) {
      const response = await axios.post(
        "http://localhost:8080/api/user/login",
        user
      );
      localStorage.setItem("token", response.data);

      window.location.href = "/";
    } else {
      alert("회원가입 후 이용해 주세요.");
      navigate("/register");
    }
  };

  return;
};

export default AuthLoginGoogle;
