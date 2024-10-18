import { useParams } from "react-router-dom";
import FollowButton from "./FollowButton";
import { useDispatch, useSelector } from "react-redux";
import {  myFollower } from "../../store/followSlice";
import { useEffect} from "react";

const MyFollower = () => {
    const {followingUserCode} = useParams();
    const dispatch = useDispatch();
    const count = useSelector((state) => state.follow.countFollower);
    const follower = useSelector((state) => state.follow.follower);
    useEffect(() => {
      dispatch(myFollower(followingUserCode)) 
    }, []);
    return (
        <>
         <div className="following-userInfo">
          <h1>내가 팔로우한 인간들</h1>
          <p>{count}명</p>
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

export default MyFollower;