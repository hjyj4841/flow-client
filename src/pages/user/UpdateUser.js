import { useEffect, useState } from "react";
import { findUser, updateUser } from "../../api/user";
import { useNavigate } from "react-router-dom";
import "../../assets/css/updateUser.scoped.scss";

const UpdateUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    userCode: 0,
    userEmail: "",
    userPlatform: "",
    userJob: "사무직",
    userHeight: 0,
    userWeight: 0,
    userBodySpecYn: "",
    userProfileUrl: "",
    userNickname: "",
    userGender: "",
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
    <div className="con">
      <h1>회원 정보 수정</h1>
      <div className="updateImgBox">
        <img src={user.userProfileUrl} />
      </div>
      <div>
        <input
          type="text"
          value={user.userNickname}
          onChange={(e) => setUser({ ...user, userNickname: e.target.value })}
          placeholder="닉네임"
        />
      </div>
      <div>
        직종
        <select onChange={(e) => setUser({ ...user, userJob: e.target.value })}>
          <option
            value="사무직"
            selected={user.userJob == "사무직" ? "selected" : ""}
          >
            사무직
          </option>
          <option
            value="연구직"
            selected={user.userJob == "연구직" ? "selected" : ""}
          >
            연구직
          </option>
          <option
            value="공공직"
            selected={user.userJob == "공공직" ? "selected" : ""}
          >
            공공직
          </option>
          <option
            value="의료직"
            selected={user.userJob == "의료직" ? "selected" : ""}
          >
            의료직
          </option>
          <option
            value="엔터테인먼트"
            selected={user.userJob == "엔터테인먼트" ? "selected" : ""}
          >
            엔터테인먼트
          </option>
          <option
            value="서비스직"
            selected={user.userJob == "서비스직" ? "selected" : ""}
          >
            서비스직
          </option>
          <option
            value="영업직"
            selected={user.userJob == "영업직" ? "selected" : ""}
          >
            영업직
          </option>
          <option
            value="건설직"
            selected={user.userJob == "건설직" ? "selected" : ""}
          >
            건설직
          </option>
          <option
            value="생산직"
            selected={user.userJob == "생산직" ? "selected" : ""}
          >
            생산직
          </option>
          <option
            value="농림어업직"
            selected={user.userJob == "농림어업직" ? "selected" : ""}
          >
            농림어업직
          </option>
          <option
            value="기타"
            selected={user.userJob == "기타" ? "selected" : ""}
          >
            기타
          </option>
        </select>
      </div>
      <div>
        신장
        <input
          type="range"
          min="130"
          max="250"
          step="1"
          value={user.userHeight}
          onChange={(e) => setUser({ ...user, userHeight: e.target.value })}
        />
        <input
          type="number"
          value={user.userHeight}
          onChange={(e) => setUser({ ...user, userHeight: e.target.value })}
        />
        <span>cm</span>
      </div>
      <div>
        체중
        <input
          type="range"
          min="30"
          max="150"
          step="1"
          value={user.userWeight}
          onChange={(e) => setUser({ ...user, userWeight: e.target.value })}
        />
        <input
          type="number"
          value={user.userWeight}
          onChange={(e) => setUser({ ...user, userWeight: e.target.value })}
        />
        <span>kg</span>
      </div>
      <div className="usreBodySpecPublic">
        신체 정보 {user.userBodySpecYn === "Y" ? "공개" : "비공개"}
        <button
          onClick={() =>
            setUser({
              ...user,
              userBodySpecYn: user.userBodySpecYn === "Y" ? "N" : "Y",
            })
          }
        >
          변경
        </button>
      </div>
      <button onClick={updateSubmit}>수정하기</button>
    </div>
  );
};
export default UpdateUser;
