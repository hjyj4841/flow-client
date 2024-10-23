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

  const warp1 = useCallback(() => {
    setBool(true);
  }, []);

  const warp2 = useCallback(() => {
    setBool(false);
  }, []);

  useEffect(() => {
    dispatch(myFollower(followingUserCode));
    dispatch(followMe(followingUserCode));
  }, [dispatch, followingUserCode]);

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
        <div className="following-users">
          <div style={{ display: bool ? 'block' : 'none' }}>
            <FollowingPage followingUserCode={followingUserCode} />
          </div>
          <div style={{ display: !bool ? 'block' : 'none' }}>
            <FollowerPage followingUserCode={followingUserCode} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyFollower;