import { initState, followReducer, fetchViewMyFollower} from "./reducers/followReducer";
import { useEffect, useReducer} from "react";
import { useParams } from "react-router-dom";
import FollowButton from "./FollowButton";

const MyFollower = () => {
  
    const {followingUserCode} = useParams();
    const [state, dispatch] = useReducer(followReducer, initState);
    useEffect(() => {
        fetchViewMyFollower(dispatch, followingUserCode);
    }, [dispatch, followingUserCode]);
    const {myFollower} = state;
    return (
        <>
          <h1>내가 팔로우 한 인간들</h1>
          <div>
            <p>팔로잉 : {myFollower?.countFollower}명</p>
            {myFollower?.countFollower === 0 ? (
                <p>아직 내가 팔로우한 인간이 없습니다.</p>
            ) : (
                myFollower?.follower?.map((user) => (
                    <div key={user.userCode}>
                      <p>{user.userEmail}</p>
                      <p>{user.userPlatform}</p>
                      <p>{user.userNickname}</p>
                      <FollowButton user={user} codeName={"followingUserCode"}/>
                    </div>
                  ))
            )}
          </div>
        </>
      );
}

export default MyFollower;