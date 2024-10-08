import { useEffect, useState } from "react";
import { getNaverToken, getNaverUserData } from "../../api/naver";

const AuthRegisterNaver = () => {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const loadNaverToken = async () => {
    console.log("Auth-10 (인증 code) : " + code);
    await getNaverToken(code, state);
  };

  useEffect(() => {
    loadNaverToken();
  }, []);

  return;
};
export default AuthRegisterNaver;
