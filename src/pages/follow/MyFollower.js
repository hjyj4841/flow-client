import { useParams, useLocation} from "react-router-dom";
import FollowButton from "./FollowButton";
import { useDispatch, useSelector } from "react-redux";
import { myFollower, followMe, followStatus} from "../../store/followSlice";
import { useEffect, useState, useCallback, useMemo} from "react";
import "../../assets/css/mypage_follow.css"

const MyFollower = () => {
    const location = useLocation();
    const logic = location.state;
    const {followingUserCode} = useParams();
    const dispatch = useDispatch();
    const count = useSelector((state) => state.follow.countFollower);
    const counter = useSelector((state) => state.follow.counter);
    const follower = useSelector((state) => state.follow.follower);
    const followee = useSelector((state) => state.follow.followee);
    const [bool, setBool] = useState(logic);
    const warp1 = useCallback(() => {
      setBool(true);
    }, []);
  
    const warp2 = useCallback(() => {
      setBool(false);
    }, []);
    // users 변수를 useMemo로 메모이제이션하여 불필요한 계산을 방지
    const users = useMemo(() => (bool ? follower : followee), [bool, follower, followee]);

    /*
      users -> 이걸 반복문이나 forEach 사용해서
      해당 status 상태들을 리스트로 추가해서 false 또는 true로 
      리스트가 나오고! 
    */
    users.forEach((e) => {
      dispatch(followStatus(followingUserCode,e.userCode));
    })
  
    const fetchFollowers = useCallback(() => {
      dispatch(myFollower(followingUserCode));
      dispatch(followMe(followingUserCode));
    }, [dispatch, followingUserCode, bool]);
  
    // Redux 액션을 디스패치하는 useEffect
    useEffect(() => {
      fetchFollowers();
    }, [fetchFollowers]);
  
    // users.map을 useMemo로 메모이제이션하여 불필요한 렌더링을 방지 bool={statusList[index]
    const userList = useMemo(
      () =>
        users.map((user, index) => (
          <div className="userSection" key={user.userCode}>
            <img src={user.userProfileUrl} alt={user.userNickname} />
            <p>{user.userNickname}</p>
            <p>{user.userEmail}</p>
            <FollowButton user={user} key={user.userCode}/>
          </div>
        )),
      [users, bool]
    );
  
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
          <div className="following-users">{userList}</div>
        </div>
      </>
    );
  };

export default MyFollower;