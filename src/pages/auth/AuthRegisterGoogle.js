import { useEffect, useState } from "react";
import { getGoogleToken } from "../../api/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthRegisterGoogle = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);
  const [user, setUser] = useState({
    userEmail: "",
    userPlatform: "",
  });

  const code = new URL(window.location.href).searchParams.get("code");

  // 발급 받은 인가 코드를 통해 유저 이메일 추출
  const getTokenByGoogle = async () => {
    const res = await getGoogleToken(code, "register");
    setUserEmail(res);
  };

  useEffect(() => {
    getTokenByGoogle();
  }, []);

  // 유저 이메일 값이 변수에 저장되면 실행
  useEffect(() => {
    if (userEmail !== null) {
      setUser({
        userEmail: userEmail,
        userPlatform: "google",
      });
    }
  }, [userEmail]);

  const duplicateCheck = async () => {
    // 회원 중복 체크
    const result = await axios.get(
      "http://localhost:8080/api/user/duplicateCheck?userEmail=" +
        user.userEmail +
        "&userPlatform=" +
        user.userPlatform
    );

    if (result.data) {
      navigate(
        `/registerUser?userEmail=${user.userEmail}&userPlatform=${user.userPlatform}`
      );
    } else {
      alert("이미 가입한 회원입니다.");
      navigate("/login");
    }
  };

  // 유저 값이 저장되면 회원중복 체크
  useEffect(() => {
    if (user.userEmail !== "") {
      duplicateCheck();
    }
  }, [user]);

  return;
};

export default AuthRegisterGoogle;
