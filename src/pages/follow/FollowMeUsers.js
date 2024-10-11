import { initState, followReducer, fetchFollowMeUsers } from "./reducers/followReducer";
import { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import FollowButton from "./FollowButton";

const FollowMeUsers = () => {
    const {followerUserCode} = useParams();
    const [state, dispatch] = useReducer(followReducer, initState);
    useEffect(() => {
        fetchFollowMeUsers(dispatch, followerUserCode);
    }, [dispatch, followerUserCode]);
    const {followMeUser} = state;
    return (
        <>
          <h1>나를 팔로우 한 인간들</h1>
          <div>
            <p>팔로워 : {followMeUser?.countFollower}명</p>
            {followMeUser?.countFollower === 0 ? (
            <p>"아직 팔로워가 없습니다"</p>) : (
                followMeUser?.follower?.map((user) => (
                    <div key={user.userCode}>
                      <p>{user.userCode}</p>
                      <p>{user.userEmail}</p>
                      <p>{user.userPlatform}</p>
                      <p>{user.userNickname}</p>
                      <FollowButton user={user} codeName={"followerUserCode"}/>
                    </div>
                  ))
                )
            }
          </div>
        </>
      );
}

export default FollowMeUsers;