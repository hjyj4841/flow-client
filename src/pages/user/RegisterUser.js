import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/user";

const RegisterUser = () => {
  const [user, setUser] = useState({
    userEmail: new URL(window.location.href).searchParams.get("userEmail"),
    userPlatform: new URL(window.location.href).searchParams.get(
      "userPlatform"
    ),
    userNickname: "",
    userJob: "",
    userGender: "",
    userHeight: 0,
    userWeight: 0,
  });

  const navigate = useNavigate();

  const register = async () => {
    registerUser(user);
    navigate("/");
  };

  return (
    <>
      닉네임 :
      <input
        value={user.userNickname}
        onChange={(e) => setUser({ ...user, userNickname: e.target.value })}
      />
      직종 :
      <input
        value={user.userJob}
        onChange={(e) => setUser({ ...user, userJob: e.target.value })}
      />
      성별 :
      <input
        value={user.userGender}
        onChange={(e) => setUser({ ...user, userGender: e.target.value })}
      />
      키 :
      <input
        value={user.userHeight}
        onChange={(e) => setUser({ ...user, userHeight: e.target.value })}
      />
      체중 :
      <input
        value={user.userWeight}
        onChange={(e) => setUser({ ...user, userWeight: e.target.value })}
      />
      <button type="button" onClick={register}>
        회원가입
      </button>
    </>
  );
};
export default RegisterUser;
