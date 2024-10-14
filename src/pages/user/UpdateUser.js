import { useEffect, useState } from "react";
import { findUser, updateUser } from "../../api/user";
import { useNavigate } from "react-router-dom";

const UpdateUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    userCode: 0,
    userEmail: "",
    userPlatform: "",
    userJob: "",
    userHeight: 0,
    userWeight: 0,
    userBodySpecYn: "",
    userProfileUrl: "",
    userNickname: "",
  });

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    setUser((await findUser(localStorage.getItem("token"))).data);
  };

  const updateSubmit = async () => {
    await updateUser(user);
    navigate("/");
  };

  return (
    <>
      <div>
        <p>Email : {user.userEmail}</p>
        <p>가입 경로 : {user.userPlatform}</p>
        <p>
          닉네임 :
          <input
            type="text"
            value={user.userNickname}
            onChange={(e) => setUser({ ...user, userNickname: e.target.value })}
          />
        </p>
        <p>
          직종 :
          <input
            type="text"
            value={user.userJob}
            onChange={(e) => setUser({ ...user, userJob: e.target.value })}
          />
        </p>
        <p>
          신장 :
          <input
            type="text"
            value={user.userHeight}
            onChange={(e) => setUser({ ...user, userHeight: e.target.value })}
          />
          cm
        </p>
        <p>
          체중 :
          <input
            type="text"
            value={user.userWeight}
            onChange={(e) => setUser({ ...user, userWeight: e.target.value })}
          />
          kg
        </p>
        <p>
          신체정보 공개여부 : {user.userBodySpecYn === "Y" ? "공개" : "비공개"}
        </p>
        <img
          src={
            user.userProfileUrl != null
              ? user.userProfileUrl
              : `http://192.168.10.51:8081/postImg/444d3989-3258-40a7-a7e9-dbbcaffe71e7_hoseob.jpg`
          }
        />
        <button onClick={updateSubmit}>수정하기</button>
      </div>
    </>
  );
};
export default UpdateUser;
