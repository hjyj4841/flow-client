import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 로그인 상태 확인
  const [token, setToken] = useState(localStorage.getItem("token"));

  // 로그인 -> 토큰 저장
  const login = (data) => {
    localStorage.setItem("token", data);
    setToken(data);
  };

  // 로그아웃 -> 토큰 제거
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
