import { useEffect, useState } from "react";
import { getKakaoToken } from "../api/kakao";
const Auth = () => {
  const [userData, setUserData] = useState("");
  const code = new URL(window.location.href).searchParams.get("code");

  const loadToken = async () => {
    setUserData(await getKakaoToken(code));
  };

  useEffect(() => {
    loadToken();
  }, []);

  return (
    <>
      <h1>발급받은 인가 코드: {code}</h1>
    </>
  );
};
export default Auth;
