import { useEffect, useState } from "react";
import { getKakaoToken } from "../../api/kakao";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthLogin = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState({
    userEmail: "",
    userPlatform: "",
  });
  const code = new URL(window.location.href).searchParams.get("code");

  const loadToken = async () => {
    setUserData(await getKakaoToken(code, "login"));
  };

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    if (userData != null) {
      if (userData.kakao_account.profile.profile_image_url.includes("kakao")) {
        setUser({
          userEmail: userData.kakao_account.email,
          userPlatform: "kakao",
        });
      }
    }
  }, [userData]);

  const loginCheck = async () => {
    const result = await axios.get(
      "http://localhost:8080/api/user/duplicateCheck?userEmail=" +
        user.userEmail +
        "&userPlatform=" +
        user.userPlatform
    );

    if (!result.data) {
      alert("로그인 성공!");
      navigate("/");
    } else {
      alert("로그인 실패!");
    }
  };

  useEffect(() => {
    if (user.userEmail !== "") {
      loginCheck();
    }
  }, [user]);

  return <></>;
};

export default AuthLogin;
