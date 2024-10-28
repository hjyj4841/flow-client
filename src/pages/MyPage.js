import { useState, useEffect } from "react";
import {
  fetchCreatedPosts,
  fetchLikedPosts,
  fetchSavedPosts,
} from "../api/post";
import { useNavigate, useParams } from "react-router-dom";
import { findUser, findUserByCode } from "../api/user";
import { useAuth } from "../contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import {
  myFollower,
  followMe,
  followStatus,
  createFollowRelative,
  removeFollowRelative,
} from "../store/followSlice";
import { LiaPollSolid } from "react-icons/lia";
import "../assets/css/mypage.scoped.scss";
import {
  PiGridFourThin,
  PiHeartStraightLight,
  PiBookmarksThin,
  PiMicrophoneStageFill,
} from "react-icons/pi";
import { MdAccountBalance, MdBusinessCenter } from "react-icons/md";
import { FaBriefcaseMedical, FaCog, FaRocketchat } from "react-icons/fa";
import { RiServiceFill, RiPlantFill } from "react-icons/ri";
import { FaHelmetSafety, FaComputer } from "react-icons/fa6";
import { HiBeaker } from "react-icons/hi2";
import { haveVote } from "../api/vote";
import { CgGenderMale, CgGenderFemale } from "react-icons/cg";
import "../pages/follow/MyFollower.js";
import MyFollower from "../pages/follow/MyFollower.js";

const MyPage = () => {
  const [pageState, setPageState] = useState("created");
  const [createdPosts, setCreatedPosts] = useState({
    postInfoList: [],
    totalPosts: 0,
  });
  const { mypageUserCode } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const followerCount = useSelector((state) => state.follow.counter);
  const followingCount = useSelector((state) => state.follow.countFollower);
  const statusByFollow = useSelector((state) => state.follow.followBool);
  const dispatch = useDispatch();
  // 현재 접속한 유저 정보
  const [user, setUser] = useState({
    userCode: 0,
  });
  // 마이페이지 유저 정보
  const [mypageUser, setMypageUser] = useState({
    userCode: 0,
    userEmail: "",
    userPlatform: "",
    userJob: "",
    userHeight: 0,
    userWeight: 0,
    userBodySpecYn: "",
    userProfileUrl: "",
    userNickname: "",
    userGender: "",
  });
  // 투표 생성 유무 조회
  const [isVote, setIsVote] = useState(false);

  // 팔로우 기능
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  }
  const [follow, setFollow] = useState({
    followingUser: {
      userCode: 0,
    },
    followerUser: {
      userCode: 0,
    },
  });
  useEffect(() => {
    setFollow({
      followingUser: {
        userCode: user.userCode,
      },
      followerUser: {
        userCode: mypageUser.userCode,
      },
    });
  }, [user.userCode, mypageUser.userCode]);
  let isSelf = 0;
  const addFollow = () => {
    if (
      user.userCode !== 0 &&
      mypageUserCode !== 0 &&
      follow.followingUser.userCode !== 0
    ) {
      isSelf =
        user.userCode === parseInt(mypageUserCode)
          ? 1
          : user.userCode !== parseInt(mypageUserCode) &&
            parseInt(user.userCode) === parseInt(follow.followingUser.userCode)
          ? 2
          : 0;
    }
    dispatch(
      createFollowRelative({
        isSelf,
        follow,
      })
    );
  };
  // 언팔로우 기능
  const removefollow = () => {
    if (
      user.userCode !== 0 &&
      mypageUserCode !== 0 &&
      follow.followingUser.userCode !== 0
    ) {
      isSelf =
        user.userCode === parseInt(mypageUserCode)
          ? 1
          : user.userCode !== parseInt(mypageUserCode) &&
            parseInt(user.userCode) === parseInt(follow.followingUser.userCode)
          ? 2
          : 0;
    }
    dispatch(
      removeFollowRelative({
        isSelf,
        followingUserCode: user.userCode,
        followerUserCode: mypageUser.userCode,
      })
    );
  };

  // 유저가 작성한 게시물 조회
  const getCreatePosts = async () => {
    const response = await fetchCreatedPosts(mypageUser.userCode);
    setCreatedPosts(response.data);
    setPageState("created");
  };

  // 유저가 좋아요한 게시물 조회
  const getLikedPosts = async () => {
    const response = await fetchLikedPosts(mypageUser.userCode);
    setCreatedPosts({
      ...createdPosts,
      postInfoList: response.data.postInfoList,
    });
    setPageState("liked");
  };

  // 유저가 북마크한 게시물 조회
  const getBookmarkedPosts = async () => {
    const response = await fetchSavedPosts(mypageUser.userCode);
    setCreatedPosts({
      ...createdPosts,
      postInfoList: response.data.postInfoList,
    });
    setPageState("bookmarked");
  };

  // 회원 정보 가져오기
  const getUserInfo = async () => {
    setUser((await findUser(token)).data);
  };
  const getMypageUserInfo = async () => {
    setMypageUser((await findUserByCode(mypageUserCode)).data);
  };

  // 디테일 화면으로 이동
  const detail = (postCode) => {
    navigate(`/post/${postCode}`);
  };

  // 마이페이지 회원의 투표 존재 유무 확인
  const getVote = async () => {
    setIsVote((await haveVote(mypageUserCode)).data);
  };

  useEffect(() => {
    if (token !== null) getUserInfo();
    getMypageUserInfo();
  }, []);

  useEffect(() => {
    if (token === null || (mypageUser.userCode !== 0 && user.userCode !== 0)) {
      getVote();
      getCreatePosts();
      dispatch(myFollower({
        followingUserCode : mypageUser.userCode,
        key : null
      }));
      dispatch(followMe({
        followerUserCode : mypageUser.userCode,
        key : null
      }));
      dispatch(
        followStatus({
          followingUserCode: user.userCode,
          followerUserCode: mypageUser.userCode,
        })
      );
    }
  }, [mypageUser.userCode, user.userCode]);

  return (
    <div className="text-gray-800">
      <section className="bg-white py-4 shadow-md" />

      <main className="container mx-auto py-8">
        <div className="mypageTop">
          <div className="mypageImg">
            <img src={mypageUser.userProfileUrl} />
            <div
              className="mypageImgBack"
              style={
                isVote
                  ? {
                      backgroundImage:
                        "linear-gradient(#fff, #fff), linear-gradient(to bottom right, #B292CA 0%, #99ABD0 29%, #7EC6D7 67%, #5FE5DE 100%)",
                    }
                  : {
                      backgroundImage:
                        "linear-gradient(#fff, #fff), linear-gradient(to bottom right, #2e3440 0%, #3b4252 29%, #434c5e 67%, #4c566a 100%)",
                    }
              }
            />
          </div>
          <div className="mypageDesc">
            <div className="mypageNameGender">
              {mypageUser.userNickname}
              <span className="mypageGender">
                {mypageUser.userGender === "남성" ? (
                  <CgGenderMale style={{ color: "skyblue" }} />
                ) : (
                  <CgGenderFemale style={{ color: "pink" }} />
                )}
              </span>
            </div>
            <div className="mypageFollow">
              <span>
                게시물 <span>{createdPosts.totalPosts}</span>
              </span>
              {/* 팔로우 경로 */}
              <span onClick={openModal}>
                  <MyFollower setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} logic={true}/>
                  <span>{followerCount}</span>
              </span>
              {/* <span
                onClick={() =>
                  navigate(
                    mypageUserCode === user.userCode
                      ? `/mypage/follow/myFollower/${user.userCode}`
                      : `/mypage/follow/myFollower/${mypageUserCode}`,
                    {
                      state: false,
                    }
                  )
                }
              >
                팔로워 
              </span> */}
               <span onClick={openModal}>
                  <MyFollower setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} logic={false}/>
                  <span>{followingCount}</span>
              </span>
              {/* <span
                onClick={() =>
                  navigate(
                    mypageUserCode === user.userCode
                      ? `/mypage/follow/myFollower/${user.userCode}`
                      : `/mypage/follow/myFollower/${mypageUserCode}`,
                    {
                      state: true,
                    }
                  )
                }
              >
                팔로잉 
              </span> */}
            </div>
            <div className="myJobBox">
              <i>
                {mypageUser.userJob === "사무직" ? (
                  <FaComputer />
                ) : mypageUser.userJob === "연구직" ? (
                  <HiBeaker />
                ) : mypageUser.userJob === "공공직" ? (
                  <MdAccountBalance />
                ) : mypageUser.userJob === "의료직" ? (
                  <FaBriefcaseMedical />
                ) : mypageUser.userJob === "엔터테인먼트" ? (
                  <PiMicrophoneStageFill />
                ) : mypageUser.userJob === "서비스직" ? (
                  <RiServiceFill />
                ) : mypageUser.userJob === "영업직" ? (
                  <MdBusinessCenter />
                ) : mypageUser.userJob === "건설직" ? (
                  <FaHelmetSafety />
                ) : mypageUser.userJob === "생산직" ? (
                  <FaCog />
                ) : mypageUser.userJob === "농림어업직" ? (
                  <RiPlantFill />
                ) : (
                  <FaRocketchat />
                )}
              </i>
              <span>{mypageUser.userJob}</span>
              {mypageUser.userBodySpecYn === "Y" ? (
                <span>
                  {mypageUser.userHeight}cm / {mypageUser.userWeight}kg
                </span>
              ) : (
                <></>
              )}
            </div>
            <div>
              {user.userCode === mypageUser.userCode ? (
                <button onClick={() => navigate("/updateUser")}>
                  정보수정
                </button>
              ) : statusByFollow === false ? (
                <button className="followButton" onClick={addFollow}>
                  Follw
                </button>
              ) : (
                <button className="followButton" onClick={removefollow}>
                  UnFollow
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="mypageBottom">
          <div className="mypageButtonBox">
            <button
              onClick={getCreatePosts}
              style={
                pageState === "created"
                  ? { borderTop: "1px solid black" }
                  : { borderTop: "1px solid white" }
              }
            >
              <PiGridFourThin />
              게시물
            </button>
            <button>
              <LiaPollSolid />
              투표현황
            </button>
            <button
              onClick={getLikedPosts}
              style={
                pageState === "liked"
                  ? { borderTop: "1px solid black" }
                  : { borderTop: "1px solid white" }
              }
            >
              <PiHeartStraightLight />
              좋아요
            </button>
            <button
              onClick={getBookmarkedPosts}
              style={
                pageState === "bookmarked"
                  ? { borderTop: "1px solid black" }
                  : { borderTop: "1px solid white" }
              }
            >
              <PiBookmarksThin />
              북마크
            </button>
          </div>
          {/* 게시물 나오는 부분 */}
          <section className="postList">
            <div className="grid grid-cols-3 gap-2">
              {createdPosts.postInfoList.map((item) => (
                <div
                  key={item.post.postCode}
                  className="relative rounded-lg group postBox"
                >
                  {item.imageFiles && item.imageFiles.length > 0 ? (
                    <img
                      src={item.imageFiles[0]?.postImgUrl || "default.jpg"}
                      alt={item.postDesc}
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <div className="bg-gray-200 rounded-lg flex justify-center items-center text-gray-500">
                      No Image
                    </div>
                  )}
                  <div
                    onClick={() => detail(item.post.postCode)}
                    className="cursor-pointer rounded-lg absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MyPage;
