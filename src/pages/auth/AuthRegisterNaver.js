import { useEffect } from "react";
import { getNaverToken } from "../../api/naver";

const AuthRegisterNaver = () => {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const loadNaverToken = async () => {
    const res = await getNaverToken(code, state);
    console.log(res);
  };

  useEffect(() => {
    loadNaverToken();
  }, []);

  return;
};
export default AuthRegisterNaver;
