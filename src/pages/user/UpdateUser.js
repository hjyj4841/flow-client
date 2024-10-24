import { useEffect, useState } from "react";
import { deleteUser, findUser, updateUser } from "../../api/user";
import { useNavigate } from "react-router-dom";
import "../../assets/css/updateUser.scoped.scss";
import { MdOutlinePublic, MdOutlinePublicOff } from "react-icons/md";
import { useAuth } from "../../contexts/AuthContext";

const UpdateUser = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
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
    imgFile: null,
  });

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    setUser((await findUser(token)).data);
  };

  // 이미지 선택시 미리보기
  const changeImg = (e) => {
    setUser({
      ...user,
      userProfileUrl: URL.createObjectURL(e.target.files[0]),
      imgFile: e.target.files[0],
    });
  };

  // 기본 이미지로 변경
  const defaultImg = async () => {
    setUser({
      ...user,
      imgFile: null,
      userProfileUrl: "http://192.168.10.51:8081/userImg/defaultUser.png",
    });
  };

  // 회원 탈퇴
  const withOutUser = async () => {
    await deleteUser(token);
    logout();
    alert("회원탈퇴!");
    logout();
  };

  // 회원 수정
  const updateSubmit = async () => {
    const formData = new FormData();
    formData.append("userCode", user.userCode);
    formData.append("userEmail", user.userEmail);
    formData.append("userPlatform", user.userPlatform);
    formData.append("userJob", user.userJob);
    formData.append("userHeight", user.userHeight);
    formData.append("userWeight", user.userWeight);
    formData.append("userBodySpecYn", user.userBodySpecYn);
    formData.append("userProfileUrl", user.userProfileUrl);
    formData.append("userNickname", user.userNickname);
    formData.append("userGender", user.userGender);
    if (user.imgFile != null) formData.append("imgFile", user.imgFile);
    await updateUser(formData);
    navigate(`/mypage/${user.userCode}`);
  };

  return (
    <div className="text-gray-800">
      <section className="bg-white py-4 shadow-md" />
      <div className="con">
        <h1>회원 정보 수정</h1>
        <div className="updateImgBox">
          <img src={user.userProfileUrl} />
          <div>
            <div className="fileSelector">
              <input type="file" accept="image/*" onChange={changeImg} />
              <button type="button">이미지 변경</button>
            </div>
            <button type="button" onClick={defaultImg}>
              기본 이미지
            </button>
          </div>
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
          <select
            onChange={(e) => setUser({ ...user, userJob: e.target.value })}
          >
            <option
              value="사무직"
              selected={user.userJob === "사무직" ? "selected" : ""}
            >
              사무직
            </option>
            <option
              value="연구직"
              selected={user.userJob === "연구직" ? "selected" : ""}
            >
              연구직
            </option>
            <option
              value="공공직"
              selected={user.userJob === "공공직" ? "selected" : ""}
            >
              공공직
            </option>
            <option
              value="의료직"
              selected={user.userJob === "의료직" ? "selected" : ""}
            >
              의료직
            </option>
            <option
              value="엔터테인먼트"
              selected={user.userJob === "엔터테인먼트" ? "selected" : ""}
            >
              엔터테인먼트
            </option>
            <option
              value="서비스직"
              selected={user.userJob === "서비스직" ? "selected" : ""}
            >
              서비스직
            </option>
            <option
              value="영업직"
              selected={user.userJob === "영업직" ? "selected" : ""}
            >
              영업직
            </option>
            <option
              value="건설직"
              selected={user.userJob === "건설직" ? "selected" : ""}
            >
              건설직
            </option>
            <option
              value="생산직"
              selected={user.userJob === "생산직" ? "selected" : ""}
            >
              생산직
            </option>
            <option
              value="농림어업직"
              selected={user.userJob === "농림어업직" ? "selected" : ""}
            >
              농림어업직
            </option>
            <option
              value="기타"
              selected={user.userJob === "기타" ? "selected" : ""}
            >
              기타
            </option>
          </select>
        </div>
        <div>
          신장
          <input
            type="range"
            min="140"
            max="200"
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
            max="120"
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
        <div
          className={
            user.userBodySpecYn === "Y"
              ? "usreBodySpecPublic greenFont"
              : "usreBodySpecPublic redFont"
          }
        >
          {user.userBodySpecYn === "Y" ? (
            <MdOutlinePublic />
          ) : (
            <MdOutlinePublicOff />
          )}
          <button
            onClick={() =>
              setUser({
                ...user,
                userBodySpecYn: user.userBodySpecYn === "Y" ? "N" : "Y",
              })
            }
          >
            신체 정보 공개 여부 변경
          </button>
        </div>
        <button onClick={updateSubmit}>수정하기</button>
        <button onClick={withOutUser} className="deleteUser">
          회원탈퇴
        </button>
      </div>
    </div>
  );
};
export default UpdateUser;
