
import FollowButton from "./FollowButton";
import { useDispatch, useSelector } from "react-redux";
import { followMe} from "../../store/followSlice";
import { useEffect, useState, useCallback, useMemo} from "react";
import "../../assets/css/mypage_follow.css"
import { useAuth } from "../../contexts/AuthContext";
import React from "react";

const FollowerPage = React.memo(({followingUserCode, search}) => {
    const dispatch = useDispatch();
    const followee = useSelector((state) => state.follow.followee);
    const {token} = useAuth();
    const [code, setCode] = useState(0);

    useEffect(() => {
      if (token) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        const userData = JSON.parse(window.atob(base64));
        setCode(userData.userCode);
      }
    }, [token]); // 의존성 배열 추가
    const users = useMemo(() => followee, [followee]);

      const fetchFollowers = useCallback(() => {
        if(followingUserCode !== undefined) {
          dispatch(followMe({
            followerUserCode : followingUserCode,
            key : search
          }));
        }
      }, [dispatch, search]);
    
      // Redux 액션을 디스패치하는 useEffect
      useEffect(() => {
        fetchFollowers();
      }, [fetchFollowers]);

      const userList = 
      useMemo(
        () =>
          users.map((dto) => (
            <div className="userSection" key={dto.user.userCode}>
              <img src={dto.user.userProfileUrl} alt={dto.user.userNickname} />
              <p>{dto.user.userNickname}</p>
              <p>{dto.user.userEmail}</p>
              {(code !== dto.user.userCode && dto.following !== undefined) && (
                <>
                  <FollowButton user={dto.user} key={dto.user.userCode} bool={dto.following} />
                </>
              )}
            </div>
          )),
        [users]
      );
    return (
      <>
          <div className="following-users">{userList}</div>
      </>
    );
  });

export default FollowerPage;