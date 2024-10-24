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
  let scrollTimeout = null;

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

  const handleScroll = () => {
    // 스크롤 시작하면 즉시 투명하게
    setOpacity(0);

    // 이전에 설정된 타이머를 제거
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // 스크롤이 멈춘 후 0.5초 후에 다시 불투명하게
    scrollTimeout = setTimeout(() => {
      setOpacity(1);
    }, 250);
  };

  useEffect(() => {
    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', handleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout); // 타이머도 해제
      }
    };
  }, []);
  return (
    <>
      <div className="following-userInfo">
        <header>
          <div className={`section ${bool ? "active" : ""}`} onClick={warp1}>
            <h1>내가 팔로우한 인간들</h1>
            <p>{count}명</p>
          </div>
          <div className={`section ${!bool ? "active" : ""}`} onClick={warp2}>
            <h1>나를 팔로우한 인간들</h1>
            <p>{counter}명</p>
          </div>
          <div className="section">
            <h1>추천 팔로워</h1>
          </div>
        </header>
        <div className="searchBar" style={{ opacity, transition: 'opacity 0.5s ease' }}>
          <input
            type="text"
            placeholder="검색" 
            value={key}
            onChange={(e) => {setKey(e.target.value)}}
          />
        </div>
        <div className="following-users">
          <div style={{ display: bool ? 'block' : 'none' }}>
            <FollowingPage followingUserCode={followingUserCode} search={key}/>
          </div>
          <div style={{ display: !bool ? 'block' : 'none' }}>
            <FollowerPage followingUserCode={followingUserCode} search={key}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyFollower;