import { useParams } from "react-router-dom";
import FollowButton from "./FollowButton";
import { useDispatch, useSelector } from "react-redux";
import { followMe } from "../../store/followSlice";
import { useEffect } from "react";

const FollowMeUsers = () => {
  const {followerUserCode} = useParams();
  const dispatch = useDispatch();
  const follower = useSelector((state) => state.follow.follower);
  const counter = useSelector((state) => state.follow.counter);
  useEffect(() => {
    dispatch(followMe(followerUserCode));
  }, []);
  return (
      <>
       <div className="following-userInfo">
        <h1>나를 팔로우한 인간들</h1>
        <p>{counter}명</p>
          <div className="following-users">
            {follower?.map((user) => (
              <div key={user.userCode}>
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

export default FollowMeUsers;