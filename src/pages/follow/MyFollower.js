import { useParams, useLocation} from "react-router-dom";
import FollowButton from "./FollowButton";
import { useDispatch, useSelector } from "react-redux";
import { myFollower, followMe} from "../../store/followSlice";
import { useEffect, useState} from "react";
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
    const warp2 = () => {
      setBool(false);
    }
    const warp1 = () => {
      setBool(true);
    }
    useEffect(() => {
      dispatch(myFollower(followingUserCode));
      dispatch(followMe(followingUserCode)); 
    }, [bool]);
    return (
        <>
         <div className="following-userInfo">
          <header>
            <div className={`section ${bool ? 'active' : ''} `} onClick={warp1}>
              <h1>내가 팔로우한 인간들</h1>
              <p>{count}명</p>
            </div>
            <div className={`section ${!bool ? 'active' : ''} `} onClick={warp2}>
              <h1>나를 팔로우한 인간들</h1>
              <p>{counter}명</p>
            </div>
            <div className="section">
              <h1>추천 팔로워</h1>
            </div>
          </header>
            <div className="following-users">
              {(bool ? follower : followee)?.map((user) => (
                <div className="userSection" key={user.userCode}>
                    <img src={user.userProfileUrl}></img>
                    <p>{user.userNickname}</p>
                    <p>{user.userEmail}</p>
                    <FollowButton user={user} key={user.userCode}/>
                </div>
              ))}
            </div>
         </div>
        </>
      );
}

export default MyFollower;