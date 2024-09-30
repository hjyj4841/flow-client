import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const LoginSuccess = () => {
  const [token, setToken] = useState();
  const navigate = useNavigate();

  const result = new URL(window.location.href).searchParams.get("token");

  const getToken = () => {
    localStorage.setItem("token", token);
    navigate("/");
  };

  useEffect(() => {
    alert(result);
    setToken(result);
  }, []);

  useEffect(() => {
    if (token != null) {
      getToken();
    }
  }, [token]);

  return null;
};
export default LoginSuccess;
