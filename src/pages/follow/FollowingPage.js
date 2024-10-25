
import FollowButton from "./FollowButton";
import { useDispatch, useSelector } from "react-redux";
import { myFollower} from "../../store/followSlice";
import { useEffect, useState, useCallback, useMemo} from "react";
import "../../assets/css/mypage_follow.css"
import { useAuth } from "../../contexts/AuthContext";
import React from "react";

const FollowingPage = React.memo(({followingUserCode, search}) => {
    const dispatch = useDispatch();
    const follower = useSelector((state) => state.follow.follower);
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

    // users 변수를 useMemo로 메모이제이션하여 불필요한 계산을 방지
    const users = useMemo(() => follower, [follower]);

      const fetchFollowers = useCallback(() => {
        if(followingUserCode !== undefined) {
          dispatch(myFollower({
            followingUserCode,
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
              <div className="infoBox">
                <div className="nickBox">{dto.user.userNickname}</div>
                <div className="etcBox">{dto.user.userEmail}</div>
              </div>
              {(code !== dto.user.userCode && dto.following !== undefined) && (
                <>
                <div className="buttonContainer">
                  <FollowButton user={dto.user} key={dto.user.userCode} bool={dto.following} />
                </div>
                </>
              )}
            </div>
          )),
        [users]
      );
      
  
    return (
      <>
          {userList}
      </>
    );
  });

export default FollowingPage;