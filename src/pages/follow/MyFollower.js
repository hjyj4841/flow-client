import { useParams, useLocation} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { myFollower, followMe } from "../../store/followSlice";
import { useState, useCallback, useEffect} from "react";
import "../../assets/css/mypage_follow.css"
import FollowingPage from "./FollowingPage";
import FollowerPage from "./FollowerPage";

const MyFollower = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const logic = location.state;
  const { followingUserCode } = useParams();
  const count = useSelector((state) => state.follow.countFollower);
  const counter = useSelector((state) => state.follow.counter);
  const [bool, setBool] = useState(logic);
  const [key, setKey] = useState("");
  const [opacity, setOpacity] = useState(1);

  const warp1 = useCallback(() => {
    setBool(true);
  }, []);

  const warp2 = useCallback(() => {
    setBool(false);
  }, []);

  useEffect(() => {
    if(followingUserCode !== undefined) {
      dispatch(myFollower({
        followingUserCode : parseInt(followingUserCode),
        key : key
      }));
      dispatch(followMe({
        followerUserCode : parseInt(followingUserCode),
        key : key
      }));
    }
  }, [dispatch, followingUserCode]);

  useEffect(() => {
    let timeout;
    let isScrolling = false;
  
    const handleScroll = () => {
      const followingUsersDiv = document.querySelector('.following-users');
      const { scrollTop, scrollHeight, clientHeight } = followingUsersDiv;
  
      // 스크롤이 가능한 상태일 때만 실행
      if (scrollTop + clientHeight < scrollHeight) {
        setOpacity(0.3);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          setOpacity(1); // 스크롤 멈춘 후 원래 상태로 복원
        }, 500);
      }
  
      isScrolling = true; // 스크롤 중
    };
  
    const handleWheel = (e) => {
      const followingUsersDiv = document.querySelector('.following-users');
      const { scrollTop, scrollHeight, clientHeight } = followingUsersDiv;
  
      // 스크롤이 끝에 도달했는지 확인
      const isAtScrollEnd = scrollTop + clientHeight >= scrollHeight;
  
      if (isAtScrollEnd) {
        // 스크롤이 끝에 도달한 상태에서 휠을 돌리면 opacity를 조정
        setOpacity(0.3);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          setOpacity(1); // 휠 멈춘 후 원래 상태로 복원
        }, 50);
      }
    };
  
    const followingUsersDiv = document.querySelector('.following-users');
    if (followingUsersDiv) {
      followingUsersDiv.addEventListener('scroll', handleScroll); // 스크롤 이벤트 추가
    }
  
    // Cleanup event listener on unmount
    return () => {
      if (followingUsersDiv) {
        followingUsersDiv.removeEventListener('scroll', handleScroll);
        followingUsersDiv.removeEventListener('wheel', handleWheel);
      }
      if (timeout) clearTimeout(timeout);
    };
  }, []);
  return (
    <>
      <div className="following-userInfo">
        <header style={{ opacity, transition: 'opacity 0.3s ease' }}>
          <div className={`section ${bool ? "active" : ""}`} onClick={warp1}>
            <h1>팔로잉</h1>
            <p>{count}</p>
          </div>
          <div className={`section ${!bool ? "active" : ""}`} onClick={warp2}>
            <h1>팔로워</h1>
            <p>{counter}</p>
          </div>
          <div className="section">
            <h1>추천 팔로워</h1>
          </div>
        </header>
        <div className="searchBar" style={{ opacity, transition: 'opacity 0.3s ease' }}>
          <input
            type="text"
            placeholder="검색" 
            value={key}
            onChange={(e) => {setKey(e.target.value)}}
          />
        </div>
        <div className="following-users">
          <div style={{ display: bool ? 'flex' : 'none', flexDirection: 'column'}}>
            <FollowingPage followingUserCode={followingUserCode} search={key}/>
          </div>
          <div style={{ display: !bool ? 'flex' : 'none', flexDirection: 'column'}}>
            <FollowerPage followingUserCode={followingUserCode} search={key}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyFollower;